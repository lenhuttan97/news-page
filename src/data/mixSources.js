const MAX_RUN = 2

// Keep the time order, but never show more than MAX_RUN articles from the same
// source in a row: when a source hits the cap, the next-newest article from
// another source is pulled ahead. Leftovers of one source stay at the end.
export function mixSources(articles, maxRun = MAX_RUN) {
  const remaining = [...articles]
  const mixed = []
  let lastSource = null
  let run = 0
  while (remaining.length > 0) {
    let pick = 0
    if (run >= maxRun) {
      const other = remaining.findIndex((article) => sourceOf(article) !== lastSource)
      if (other !== -1) pick = other
    }
    const [article] = remaining.splice(pick, 1)
    const source = sourceOf(article)
    run = source === lastSource ? run + 1 : 1
    lastSource = source
    mixed.push(article)
  }
  return mixed
}

const sourceOf = (article) => article.sourceKey || article.source
