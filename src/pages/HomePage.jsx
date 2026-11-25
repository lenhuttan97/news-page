import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SkeletonLoader from '../components/SkeletonLoader'
import NewsModal from '../components/NewsModal'
import { fetchNews } from '../store'
import { selectDataSource, selectMixSources } from '../store/settingsSlice'
import { NEWS_CATEGORIES } from '../data/rssData'
import { mixSources } from '../data/mixSources'

const HOME_PAGE_SIZE = 50

function getCategoryLabel(id) {
  return NEWS_CATEGORIES.find((category) => category.id === id)?.label || id
}

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function HomePage() {
  const dispatch = useDispatch()
  const { items: fetchedItems, loading, loadingMore, hasMore, nextOffset, error, errorOffset } = useSelector((state) => state.home)
  const dataSource = useSelector(selectDataSource)
  const shouldMix = useSelector(selectMixSources)
  const items = shouldMix ? mixSources(fetchedItems) : fetchedItems
  const [selectedArticle, setSelectedArticle] = useState(null)
  const sentinelRef = useRef(null)
  const loadLock = useRef(false)
  const requestedSource = useRef(null)
  const requestPage = useCallback((offset) => {
    if (loadLock.current || loading || loadingMore) return
    loadLock.current = true
    dispatch(fetchNews({ offset, limit: HOME_PAGE_SIZE }))
  }, [dispatch, loading, loadingMore])

  useEffect(() => {
    if (requestedSource.current === dataSource) return
    requestedSource.current = dataSource
    dispatch(fetchNews({ offset: 0, limit: HOME_PAGE_SIZE }))
  }, [dispatch, dataSource])

  useEffect(() => {
    if (!loadingMore && !loading) loadLock.current = false
  }, [loading, loadingMore])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || !hasMore || loading || loadingMore || error) return
        requestPage(nextOffset)
      },
      { rootMargin: '250px', threshold: 0.1 },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [error, hasMore, loading, loadingMore, nextOffset, requestPage])

  if (loading && items.length === 0) return <SkeletonLoader />

  if (error && items.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <p role="alert" className="text-red-500">{error}</p>
        <button
          type="button"
          onClick={() => requestPage(0)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        >
          Thử tải lại
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-5xl animate-pageFadeInUp">
      <header className="mb-8 border-b border-border-light pb-6 dark:border-border-dark md:mb-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">Tafu Hub</p>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-text-light dark:text-text-dark sm:text-4xl">
          Tin mới nhất
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-text-muted-light dark:text-text-muted-dark">
          Các tin mới từ những nguồn bạn theo dõi, cập nhật theo thứ tự thời gian.
        </p>
      </header>

      <div className="divide-y divide-border-light dark:divide-border-dark">
        {items.map((article) => (
          <article key={article.id} className="py-5 first:pt-0 sm:py-6">
            <button
              type="button"
              onClick={() => setSelectedArticle(article)}
              className="group grid w-full grid-cols-[96px_minmax(0,1fr)] gap-4 rounded-lg text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-6"
            >
              {article.image ? (
                <img
                  src={article.image}
                  alt=""
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-md object-cover"
                />
              ) : (
                <div className="flex aspect-[4/3] w-full items-center justify-center rounded-md bg-black/5 text-text-muted-light dark:bg-white/5 dark:text-text-muted-dark" aria-hidden="true">
                  <span className="material-symbols-outlined text-3xl">newspaper</span>
                </div>
              )}
              <div className="min-w-0 py-0.5">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
                  {getCategoryLabel(article.category)}
                </p>
                <h2 className="font-serif text-lg font-bold leading-snug text-text-light transition-colors group-hover:text-accent dark:text-text-dark sm:text-xl">
                  {article.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm leading-5 text-text-muted-light dark:text-text-muted-dark">
                  {article.description || article.title}
                </p>
                <p className="mt-3 text-xs text-text-muted-light dark:text-text-muted-dark">
                  {article.source}{article.pubDate ? ` · ${formatDate(article.pubDate)}` : ''}
                </p>
              </div>
            </button>
          </article>
        ))}
      </div>

      <div ref={sentinelRef} className="flex min-h-16 items-center justify-center py-5" role="status" aria-live="polite">
        {loadingMore ? (
          <span className="flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark">
            <span className="loading-dot inline-block h-1.5 w-1.5 rounded-full bg-primary" />
            Đang tải thêm tin…
          </span>
        ) : error ? (
          <div className="flex flex-col items-center gap-2">
            <p role="alert" className="text-sm text-red-500">
              {errorOffset === 0 ? 'Không thể cập nhật tin.' : 'Không tải được tin tiếp theo.'}
            </p>
            <button
              type="button"
              onClick={() => requestPage(errorOffset === 0 ? 0 : nextOffset)}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Thử lại
            </button>
          </div>
        ) : !hasMore && items.length > 0 ? (
          <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Bạn đã xem hết tin hiện có.</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Chưa có tin để hiển thị.</p>
        ) : null}
      </div>

      {selectedArticle && <NewsModal news={selectedArticle} onClose={() => setSelectedArticle(null)} />}
    </div>
  )
}
