import { isIP } from 'node:net'

const IMAGE_HOST = 'cdnphoto.dantri.com.vn'
const MAX_IMAGE_BYTES = 4 * 1024 * 1024

function isPrivateIp(hostname) {
  const host = hostname.replace(/^\[|\]$/g, '')
  if (isIP(host) === 6) {
    return host === '::' || host === '::1' || host.startsWith('::ffff:') || host.startsWith('fc') || host.startsWith('fd') || host.startsWith('fe80:')
  }
  if (isIP(host) !== 4) return false

  const [first, second] = host.split('.').map(Number)
  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    first >= 224 ||
    (first === 100 && second >= 64 && second <= 127) ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168)
  )
}

function parseImageUrl(rawUrl) {
  try {
    const url = new URL(rawUrl)
    const hostname = url.hostname.toLowerCase().replace(/\.$/, '')
    if (
      url.protocol !== 'https:' ||
      hostname !== IMAGE_HOST ||
      url.username ||
      url.password ||
      hostname === 'localhost' ||
      hostname.endsWith('.local') ||
      isPrivateIp(hostname)
    ) {
      return null
    }
    return url
  } catch {
    return null
  }
}

function sendJson(res, status, error) {
  res.statusCode = status
  res.setHeader('content-type', 'application/json')
  res.setHeader('cache-control', 'no-store')
  res.end(JSON.stringify({ error }))
}

async function readImage(upstream) {
  const contentLength = Number(upstream.headers.get('content-length'))
  if (Number.isFinite(contentLength) && (contentLength < 0 || contentLength > MAX_IMAGE_BYTES)) return null

  const reader = upstream.body?.getReader()
  if (!reader) return null
  const chunks = []
  let size = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) return Buffer.concat(chunks, size)
    size += value.byteLength
    if (size > MAX_IMAGE_BYTES) {
      await reader.cancel()
      return null
    }
    chunks.push(Buffer.from(value))
  }
}

export async function sendImage(res, rawUrl, fetchImpl = fetch) {
  const url = parseImageUrl(rawUrl)
  if (!url) return sendJson(res, 400, 'invalid_url')

  try {
    const upstream = await fetchImpl(url, {
      headers: {
        accept: 'image/avif,image/webp,image/png,image/jpeg,image/gif,image/*;q=0.8,*/*;q=0.5',
        referer: 'https://dantri.com.vn/',
      },
      referrerPolicy: 'no-referrer',
      redirect: 'manual',
    })
    const contentType = upstream.headers.get('content-type') || ''
    if (!upstream.ok || !contentType.startsWith('image/') || contentType.startsWith('image/svg')) {
      return sendJson(res, 502, 'image_unavailable')
    }
    const image = await readImage(upstream)
    if (!image) return sendJson(res, 502, 'image_unavailable')

    res.statusCode = 200
    res.setHeader('content-type', contentType)
    res.setHeader('cache-control', 'public, s-maxage=86400, stale-while-revalidate=604800')
    res.end(image)
  } catch {
    return sendJson(res, 502, 'image_unavailable')
  }
}

export default function handler(req, res) {
  return sendImage(res, req.query?.url || new URL(req.url, 'https://example.com').searchParams.get('url'))
}
