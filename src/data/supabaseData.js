import { categorizeNews } from './rssData'

const ENDPOINT = '/api/supabase'
const CACHE_MS = 60_000

let cached = null // { at, promise } — home and category pages share one request

// Error codes sent by the /api/supabase proxy, in words a reader can act on.
const ERROR_MESSAGES = {
  supabase_not_configured: 'Tafu Hub chưa được cấu hình trên máy chủ. Hãy chuyển sang nguồn RSS.',
  supabase_unavailable: 'Máy chủ Tafu Hub không phản hồi. Hãy thử lại sau ít phút.',
  not_found: 'Không tìm thấy bài này trên Tafu Hub.',
  invalid_id: 'Mã bài không hợp lệ.',
}

// Throws a readable error unless the proxy answered 200 with JSON.
async function readJson(res, what) {
  const body = await res.json().catch(() => null)
  if (!res.ok || body === null) {
    throw new Error(ERROR_MESSAGES[body?.error] || `Không tải được ${what} (HTTP ${res.status}).`)
  }
  return body
}

// Crawled URLs end up in an <a href>: allow web links only (no javascript:/data:).
const safeLink = (url) => (/^https?:\/\//i.test(url || '') ? url : '#')

function toArticle(story) {
  const extraSources = (story.sources || []).filter((source) => source !== story.source).length
  return {
    id: `supabase-${story.id}`,
    supabaseId: story.id,
    title: story.title,
    description: story.description || '',
    link: safeLink(story.canonical_url || story.url),
    // Same rule as the proxy's sort: unparsable publish times fall back to crawl time.
    pubDate: Number.isNaN(Date.parse(story.published_at)) ? story.crawled_at : story.published_at,
    image: story.lead_image_url || '',
    sourceKey: story.source,
    source: extraSources > 0 ? `${story.source} +${extraSources} nguồn` : story.source,
    color: 'blue',
    category: categorizeNews(`${story.section || ''} ${story.title}`),
  }
}

function loadStories() {
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.promise
  const promise = fetch(ENDPOINT)
    .then((res) => readJson(res, 'dữ liệu Tafu Hub'))
    .then((body) => {
      // A malformed reply must surface as an error, not as an empty (cached) feed.
      if (!Array.isArray(body.stories)) throw new Error('Tafu Hub trả về dữ liệu không hợp lệ.')
      return body.stories.map(toArticle)
    })
  cached = { at: Date.now(), promise }
  promise.catch(() => {
    if (cached?.promise === promise) cached = null
  })
  return promise
}

export async function fetchHomeNews() {
  return loadStories()
}

export async function fetchCategoryNews(categoryId) {
  const articles = await loadStories()
  return articles.filter((article) => article.category === categoryId)
}

// Full text + images of one story, fetched when its dialog opens.
export async function fetchStoryDetail(storyId, signal) {
  const res = await fetch(`${ENDPOINT}?id=${encodeURIComponent(storyId)}`, { signal })
  const detail = await readJson(res, 'nội dung bài')
  if (typeof detail.text !== 'string') throw new Error('Nội dung bài không hợp lệ.')
  return detail
}

// Crawled text has no line breaks: split into short paragraphs of sentences.
export function toParagraphs(text, sentencesPerParagraph = 3) {
  const sentences = (text || '').split(/(?<=[.!?…])\s+(?=[\p{Lu}“"])/u).filter(Boolean)
  const paragraphs = []
  for (let i = 0; i < sentences.length; i += sentencesPerParagraph) {
    paragraphs.push(sentences.slice(i, i + sentencesPerParagraph).join(' '))
  }
  return paragraphs
}
