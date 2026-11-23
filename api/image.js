import { isIP } from 'node:net'

function isPrivateIp(hostname) {
  const host = hostname.replace(/^\[|\]$/g, '')
  if (isIP(host) === 6) return host === '::1' || host.startsWith('fc') || host.startsWith('fd') || host.startsWith('fe80:')
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
    if (
      url.protocol !== 'https:' ||
      !url.hostname ||
      url.username ||
      url.password ||
      url.hostname === 'localhost' ||
      url.hostname.endsWith('.local') ||
      isPrivateIp(url.hostname)
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

export async function sendImage(res, rawUrl, fetchImpl = fetch) {
  const url = parseImageUrl(rawUrl)
  if (!url) return sendJson(res, 400, 'invalid_url')

  try {
    const upstream = await fetchImpl(url, {
      headers: { accept: 'image/avif,image/webp,image/png,image/jpeg,image/gif,image/*;q=0.8,*/*;q=0.5' },
      referrerPolicy: 'no-referrer',
    })
    const contentType = upstream.headers.get('content-type') || ''
    if (!upstream.ok || !contentType.startsWith('image/') || contentType.startsWith('image/svg')) {
      return sendJson(res, 502, 'image_unavailable')
    }

    res.statusCode = 200
    res.setHeader('content-type', contentType)
    res.setHeader('cache-control', 'public, s-maxage=86400, stale-while-revalidate=604800')
    res.end(Buffer.from(await upstream.arrayBuffer()))
  } catch {
    return sendJson(res, 502, 'image_unavailable')
  }
}

export default function handler(req, res) {
  return sendImage(res, req.query?.url || new URL(req.url, 'https://example.com').searchParams.get('url'))
}
