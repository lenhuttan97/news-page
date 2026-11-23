const IMAGE_HOST = 'cdnphoto.dantri.com.vn'

export function imageProxyUrl(url) {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' && parsed.hostname.toLowerCase().replace(/\.$/, '') === IMAGE_HOST
      ? `/api/image?url=${encodeURIComponent(url)}`
      : url
  } catch {
    return url
  }
}
