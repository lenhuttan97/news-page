export function imageProxyUrl(url) {
  try {
    return new URL(url).protocol === 'https:' ? `/api/image?url=${encodeURIComponent(url)}` : url
  } catch {
    return url
  }
}
