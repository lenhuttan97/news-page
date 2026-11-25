import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SkeletonLoader from '../components/SkeletonLoader'
import FirstArticle from '../components/FirstArticle'
import FeaturedArticles from '../components/FeaturedArticles'
import CategoryGrid from '../components/CategoryGrid'
import LongformArticles from '../components/LongformArticles'
import NewsModal from '../components/NewsModal'
import { fetchNews } from '../store'
import { selectDataSource, selectMixSources } from '../store/settingsSlice'
import { mixSources } from '../data/mixSources'
import { NEWS_CATEGORIES } from '../data/rssData.js'

const FIRST_ARTICLE_COUNT = 1
const RECENT_ARTICLES_COUNT = 3
const LONGFORM_PAGE_SIZE = 6
const HOME_PAGE_SIZE = 50

function getCategoryLabel(id) {
  const found = NEWS_CATEGORIES.find((cat) => cat.id === id)
  return found ? found.label : id
}

export default function HomePage() {
  const dispatch = useDispatch()
  const {
    items: fetchedItems,
    loading,
    loadingMore,
    hasMore,
    nextOffset,
    error,
    errorOffset,
    generation,
  } = useSelector((state) => state.home)
  const mix = useSelector(selectMixSources)
  const items = useMemo(() => (mix ? mixSources(fetchedItems) : fetchedItems), [fetchedItems, mix])
  const dataSource = useSelector(selectDataSource)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [visibleLongform, setVisibleLongform] = useState(LONGFORM_PAGE_SIZE)
  const sentinelRef = useRef(null)
  const loadLock = useRef(false)
  const requestedSource = useRef(null)
  const [hasStartedRequest, setHasStartedRequest] = useState(false)

  const requestPage = useCallback((offset) => {
    if (loadLock.current || loading || loadingMore) return
    loadLock.current = true
    dispatch(fetchNews({ offset, limit: HOME_PAGE_SIZE }))
  }, [dispatch, loading, loadingMore])

  useEffect(() => {
    if (requestedSource.current === dataSource) return
    requestedSource.current = dataSource
    setHasStartedRequest(true)
    dispatch(fetchNews({ offset: 0, limit: HOME_PAGE_SIZE }))
  }, [dispatch, dataSource])

  useEffect(() => {
    if (!loading && !loadingMore) loadLock.current = false
  }, [loading, loadingMore])

  // State management for article groups - ensures no overlap
  const articleGroups = useMemo(() => {
    if (!items || items.length === 0) {
      return {
        firstArticles: [],
        recentArticles: [],
        featuredArticles: [],
        browseCategoryArticles: [],
        longformPool: [],
      }
    }

    const usedIds = new Set()
    const withImage = (item) => item && item.image && item.image !== '' && !usedIds.has(item.id)
    const take = (item) => {
      usedIds.add(item.id)
      return item
    }

    // Group 1: First article from all sources with image
    const firstArticles = []
    for (const item of items) {
      if (firstArticles.length >= FIRST_ARTICLE_COUNT) break
      if (withImage(item)) firstArticles.push(take(item))
    }

    // Group 2: Recent articles with images
    const recentArticles = []
    for (const item of items) {
      if (recentArticles.length >= RECENT_ARTICLES_COUNT) break
      if (withImage(item)) recentArticles.push(take(item))
    }

    // Group 3: Featured articles (4 articles)
    const featuredArticles = []
    for (const item of items) {
      if (featuredArticles.length >= 4) break
      if (withImage(item)) featuredArticles.push(take(item))
    }

    // Group 4: Browse by Category articles
    const browseCategoryArticles = []
    for (const item of items) {
      if (browseCategoryArticles.length >= 8) break
      if (withImage(item)) browseCategoryArticles.push(take(item))
    }

    // Group 5: Longform pool = all remaining articles with images
    const longformPool = items.filter((item) => withImage(item)).map((item) => take(item))

    return {
      firstArticles,
      recentArticles,
      featuredArticles,
      browseCategoryArticles,
      longformPool,
    }
  }, [items])

  // Reset visible longform count when data reloads
  useEffect(() => {
    setVisibleLongform(LONGFORM_PAGE_SIZE)
  }, [generation])

  const longformVisible = useMemo(() => {
    return articleGroups.longformPool.slice(0, visibleLongform)
  }, [articleGroups, visibleLongform])

  const hasMoreLongform = visibleLongform < articleGroups.longformPool.length

  // Infinite scroll: load more longform articles when sentinel enters viewport
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        if (hasMoreLongform) {
          setVisibleLongform((prev) =>
            Math.min(prev + LONGFORM_PAGE_SIZE, articleGroups.longformPool.length)
          )
        } else if (hasMore && !loading && !loadingMore && !error) {
          requestPage(nextOffset)
        }
      },
      { rootMargin: '150px', threshold: 0.1 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [
    hasMoreLongform,
    articleGroups.longformPool.length,
    visibleLongform,
    hasMore,
    loading,
    loadingMore,
    error,
    nextOffset,
    requestPage,
  ])

  // Browse by Category columns: one real article per category, never repeated.
  // Prefer articles not already shown higher up the page; skip empty categories.
  const categoryArticles = useMemo(() => {
    const candidates = [
      ...articleGroups.browseCategoryArticles,
      ...articleGroups.longformPool,
      ...articleGroups.featuredArticles,
      ...articleGroups.firstArticles,
    ]
    const usedIds = new Set()
    const picked = []
    for (const cat of NEWS_CATEGORIES) {
      if (cat.id === 'all') continue
      const article = candidates.find(
        (item) => item.category?.toLowerCase() === cat.id && !usedIds.has(item.id),
      )
      if (!article) continue
      usedIds.add(article.id)
      picked.push(article)
    }
    return picked
  }, [articleGroups])

  if (!hasStartedRequest || loading) {
    return <SkeletonLoader />
  }

  if (error && items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <p className="text-red-500">{error}</p>
        <button
          type="button"
          onClick={() => requestPage(0)}
          className="ml-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        >
          Thử lại
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Render first articles */}
      {articleGroups.firstArticles.length > 0 && (
        <div className="mb-12 lg:mb-16 animate-pageFadeInUp">
          {articleGroups.firstArticles.map((article, index) => (
            <FirstArticle key={article.id || index} news={article} onOpen={setSelectedArticle} />
          ))}
        </div>
      )}

      {/* Latest News section using recent articles */}
      {articleGroups.recentArticles.length > 0 && (
        <section className="mb-12 lg:mb-16 animate-pageFadeInUp stagger-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-10">
              <h2 className="mb-4 border-b border-border-light dark:border-border-dark pb-2 text-sm font-semibold uppercase tracking-wider text-text-light dark:text-text-dark">
                Tin mới nhất
              </h2>
              <div className="flex flex-col space-y-4">
                {articleGroups.recentArticles.map((article, index) => (
                  <button
                    key={article.id || index}
                    onClick={() => setSelectedArticle(article)}
                    className="group flex items-start justify-between gap-4 border-b border-border-light dark:border-border-dark pb-4 text-left w-full animate-cardAppear"
                    style={{ animationDelay: `${(index + 1) * 0.08}s` }}
                  >
                    <p className="text-base font-medium text-text-light dark:text-text-dark group-hover:text-accent transition-colors">
                      {article.title}
                    </p>
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark whitespace-nowrap">
                      {article.pubDate ? new Date(article.pubDate).toLocaleDateString('vi-VN') : ''} • {article.source}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Browse by Category + Featured Articles layout: Left (4 category articles), Center (Featured Articles with smaller images), Right (4 category articles) */}
      <section className="mb-12 lg:mb-16 animate-pageFadeInUp stagger-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 4 Browse by Category articles */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark border-b border-border-light dark:border-border-dark pb-2">
              Xem theo chuyên mục
            </h3>
            <div className="flex flex-col space-y-4">
              {categoryArticles.slice(0, 4).map((article, index) => (
                <button
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="group text-left block w-full animate-cardAppear"
                  style={{ animationDelay: `${(index + 1) * 0.06}s` }}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-accent mb-1">
                    {getCategoryLabel(article.category)}
                  </p>
                  <h4 className="text-sm font-medium text-text-light dark:text-text-dark group-hover:text-accent transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                </button>
              ))}
            </div>
          </div>

          {/* Center Column: Featured Articles with smaller images */}
          <div className="col-span-1 lg:col-span-6 lg:border-l lg:border-r border-border-light dark:border-border-dark lg:px-6">
            <h2 className="mb-4 border-b border-border-light dark:border-border-dark pb-2 text-sm font-semibold uppercase tracking-wider text-text-light dark:text-text-dark">
              Bài viết nổi bật
            </h2>
            <FeaturedArticles articles={articleGroups.featuredArticles} onOpen={setSelectedArticle} />
          </div>

          {/* Right Column: Next 4 Browse by Category articles */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark border-b border-border-light dark:border-border-dark pb-2">
              Chuyên mục khác
            </h3>
            <div className="flex flex-col space-y-4">
              {categoryArticles.slice(4, 8).map((article, index) => (
                <button
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="group text-left block w-full animate-cardAppear"
                  style={{ animationDelay: `${(index + 1) * 0.06}s` }}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-accent mb-1">
                    {getCategoryLabel(article.category)}
                  </p>
                  <h4 className="text-sm font-medium text-text-light dark:text-text-dark group-hover:text-accent transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid section */}
      <section className="mb-12 lg:mb-16 animate-pageFadeInUp stagger-3">
        <CategoryGrid />
      </section>

       {/* Longform Articles section with infinite scroll */}
      <section className="mb-12 lg:mb-16 animate-pageFadeInUp stagger-4">
        <LongformArticles articles={longformVisible} onOpen={setSelectedArticle} />
        <div ref={sentinelRef} className="h-8 flex items-center justify-center py-0 m-0">
          {hasMoreLongform || loadingMore ? (
            <div className="flex items-center gap-1" aria-label="Đang tải thêm">
              <span className="loading-dot w-1 h-1 rounded-full bg-primary inline-block"></span>
              <span className="loading-dot loading-dot-2 w-1 h-1 rounded-full bg-primary inline-block"></span>
              <span className="loading-dot loading-dot-3 w-1 h-1 rounded-full bg-primary inline-block"></span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-2">
              <p role="alert" className="text-xs text-red-500">
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
          ) : hasMore ? (
            <div className="flex items-center gap-1" aria-label="Có thêm tin">
              <span className="loading-dot w-1 h-1 rounded-full bg-primary inline-block"></span>
              <span className="loading-dot loading-dot-2 w-1 h-1 rounded-full bg-primary inline-block"></span>
              <span className="loading-dot loading-dot-3 w-1 h-1 rounded-full bg-primary inline-block"></span>
            </div>
          ) : (
            articleGroups.longformPool.length > 0 && (
              <p className="text-text-muted-light dark:text-text-muted-dark text-[10px] font-medium m-0">Đã hiển thị tất cả tin tức</p>
            )
          )}
        </div>
      </section>

      {selectedArticle && (
        <NewsModal news={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}
    </div>
  )
}
