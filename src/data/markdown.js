// Crawled bodies may be Markdown. Only intentional block/inline constructs count,
// so ordinary prose with a stray asterisk keeps the plain-text renderer.
export function isMarkdown(text) {
  if (typeof text !== 'string') return false
  return /^#{1,6}\s|^>\s|^```|^~~~|^\|.*\||!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|^[-*+]\s|^\d+\.\s/m.test(
    text,
  )
}
