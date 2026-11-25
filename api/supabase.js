import { categorizeNews, NEWS_CATEGORIES } from '../src/data/rssData.js'

// Read-only proxy to the mini_crawler Supabase mirror. The tables have RLS with
// no policies, so only the secret key can read them; it stays on the server.
const STORY_COLUMNS =
  'id,url,canonical_url,source,title,description,published_at,section,tags,lead_image_url,crawled_at'
const MAX_LIMIT = 200
// A story has at most one mapping per source (unique story_id+source), so 50 ids
// stay far below PostgREST's row cap and keep each URL ~2 KB.
const IDS_PER_REQUEST = 50
const CATEGORY_SCAN_SIZE = 200
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Every call here reads rows, so anything but a JSON array is an upstream fault.
async function rest(env, path) {
  const table = path.split('?')[0]
  const res = await fetch(`${env.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${path}`, {
    headers: { apikey: env.SUPABASE_SECRET_KEY, accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`Supabase ${table}: HTTP ${res.status}`)
  const rows = await res.json().catch(() => {
    throw new Error(`Supabase ${table}: non-JSON body (HTTP ${res.status})`)
  })
  if (!Array.isArray(rows)) throw new Error(`Supabase ${table}: expected an array of rows`)
  return rows
}

// Newest first by publish time; stories without one (or unparsable) fall back
// to crawl time. Done here because published_at is text with mixed offsets.
function storyTime(story) {
  const published = Date.parse(story.published_at)
  return Number.isNaN(published) ? Date.parse(story.crawled_at) || 0 : published
}

function fail(status, message, code) {
  const error = new Error(message)
  error.status = status
  if (code) error.code = code
  return error
}

function assertConfigured(env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY) throw fail(503, 'Supabase is not configured')
}

// Full body of one story, loaded only when its dialog opens (text is large).
export async function loadStoryDetail(env, id) {
  assertConfigured(env)
  if (!UUID.test(id || '')) throw fail(400, 'Invalid story id')
  const rows = await rest(env, `news_stories?select=id,text,images,authors,word_count&id=eq.${id}`)
  if (rows.length === 0) throw fail(404, 'Story not found')
  return rows[0]
}

// Latest stories, each with the distinct sources that reported it.
export async function loadStories(env, limit = MAX_LIMIT, offset = 0, categoryId = null) {
  assertConfigured(env)
  const size = Math.min(Math.max(Number(limit) || MAX_LIMIT, 1), MAX_LIMIT)
  const start = Math.max(Number.parseInt(offset, 10) || 0, 0)
  if (categoryId && !NEWS_CATEGORIES.some((category) => category.id === categoryId && category.id !== 'all')) {
    throw fail(400, 'Invalid category', 'invalid_category')
  }

  let stories = []
  let nextOffset = start
  let hasMore = false

  if (!categoryId) {
    stories = await rest(
      env,
      `news_stories?select=${STORY_COLUMNS}&order=crawled_at.desc,id.desc&offset=${start}&limit=${size}`,
    )
    nextOffset += stories.length
    hasMore = stories.length === size
  } else {
    // Scan the newest rows until this category has a full page. Keep the cursor
    // immediately after the last returned match so no matches are skipped.
    let scanOffset = start
    let exhausted = false
    while (stories.length < size && !exhausted) {
      const batch = await rest(
        env,
        `news_stories?select=${STORY_COLUMNS}&order=crawled_at.desc,id.desc&offset=${scanOffset}&limit=${CATEGORY_SCAN_SIZE}`,
      )
      if (batch.length === 0) {
        exhausted = true
        break
      }

      for (let index = 0; index < batch.length; index += 1) {
        const story = batch[index]
        if (categorizeNews(`${story.section || ''} ${story.title || ''}`) === categoryId) {
          stories.push(story)
          if (stories.length === size) {
            nextOffset = scanOffset + index + 1
            hasMore = batch.length === CATEGORY_SCAN_SIZE || index + 1 < batch.length
            break
          }
        }
      }

      if (stories.length < size) {
        scanOffset += batch.length
        nextOffset = scanOffset
        exhausted = batch.length < CATEGORY_SCAN_SIZE
      }
    }
    if (exhausted) hasMore = false
  }

  if (stories.length === 0) return { stories: [], nextOffset, hasMore }

  // Batched lookups for all mappings (a few requests in parallel, not one per story).
  const chunks = []
  for (let i = 0; i < stories.length; i += IDS_PER_REQUEST) {
    chunks.push(stories.slice(i, i + IDS_PER_REQUEST).map((story) => story.id).join(','))
  }
  const mappings = (
    await Promise.all(
      chunks.map((ids) => rest(env, `news_story_articles?select=story_id,source&story_id=in.(${ids})`)),
    )
  ).flat()
  const sourcesByStory = new Map()
  for (const { story_id: storyId, source } of mappings) {
    if (!source) continue
    if (!sourcesByStory.has(storyId)) sourcesByStory.set(storyId, new Set())
    sourcesByStory.get(storyId).add(source)
  }

  return {
    stories: stories
      .map((story) => ({ ...story, sources: [...(sourcesByStory.get(story.id) || [])] }))
      .sort((a, b) => storyTime(b) - storyTime(a)),
    nextOffset,
    hasMore,
  }
}

const ERROR_CODES = {
  400: 'invalid_id',
  404: 'not_found',
  503: 'supabase_not_configured',
}

// ?id=<uuid> → one story's full detail; otherwise the latest story list.
export function sendStories(res, env, params) {
  const categoryId = params.get('category')
  const noStore = categoryId !== null
  const send = (status, body) => {
    res.statusCode = status
    res.setHeader('content-type', 'application/json')
    res.setHeader(
      'cache-control',
      status === 200 && !noStore ? 's-maxage=60, stale-while-revalidate=300' : 'no-store',
    )
    res.end(JSON.stringify(body))
  }
  const id = params.get('id')
  const request = id !== null ? `story ${id}` : 'story list'
  const load = id !== null
    ? loadStoryDetail(env, id)
    : loadStories(env, params.get('limit'), params.get('offset'), categoryId)
  return load
    .then(
      (body) => send(200, body),
      (error) => {
        // 4xx are the caller's fault (bad id, not found); log real failures only.
        // Never echo upstream details or the key back to the client.
        if (!error.status || error.status >= 500) {
          console.error(`Supabase proxy failed (${request}):`, error.stack || error.message)
        }
        send(error.status || 502, { error: error.code || ERROR_CODES[error.status] || 'supabase_unavailable' })
      },
    )
    .catch((error) => {
      // Writing the response itself failed: make sure the request still ends.
      console.error(`Supabase proxy could not respond (${request}):`, error)
      if (!res.headersSent) res.statusCode = 500
      if (!res.writableEnded) res.end()
    })
}

export default function handler(req, res) {
  return sendStories(res, process.env, new URL(req.url, 'https://example.com').searchParams)
}
