import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Header from './components/Header'
import FirstArticle from './components/FirstArticle'
import FeaturedArticles from './components/FeaturedArticles'
import CategoryGrid from './components/CategoryGrid'
import LongformArticles from './components/LongformArticles'
import Footer from './components/Footer'
import NewsModal from './components/NewsModal'
import BackToTop from './components/BackToTop'
import { fetchNews } from './store/newsSlice'
import { NEWS_CATEGORIES } from './data/rssData.js'

const FIRST_ARTICLE_COUNT = 1
const RECENT_ARTICLES_COUNT = 3
const LONGFORM_PAGE_SIZE = 6

function App() {
  const dispatch = useDispatch()
  const { items, loading, error } = useSelector((state) => state.news)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [visibleLongform, setVisibleLongform] = useState(LONGFORM_PAGE_SIZE)
  const sentinelRef = useRef(null)

  useEffect(() => {
    dispatch(fetchNews())
  }, [dispatch])

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
  }, [items])

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
        if (entries[0].isIntersecting && hasMoreLongform) {
          setVisibleLongform((prev) =>
            Math.min(prev + LONGFORM_PAGE_SIZE, articleGroups.longformPool.length)
          )
        }
      },
      { rootMargin: '400px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMoreLongform, articleGroups.longformPool.length])

  // Prepare category articles data for Browse by Category columns
  const categoryArticles = useMemo(() => {
    return NEWS_CATEGORIES.filter(cat => cat.id !== 'all').map(cat => {
      const matchingArticle = articleGroups.browseCategoryArticles.find(
        article => article.category && article.category.toLowerCase() === cat.id
      ) || articleGroups.featuredArticles.find(
        article => article.category && article.category.toLowerCase() === cat.id
      ) || articleGroups.firstArticles[0] || items[0]

      return {
        id: matchingArticle?.id || `${cat.id}-${Math.random()}`,
        title: matchingArticle?.title || `${cat.label} News`,
        description: matchingArticle?.description || '',
        link: matchingArticle?.link || '#',
        category: matchingArticle?.category || cat.id,
        source: matchingArticle?.source || '',
        pubDate: matchingArticle?.pubDate || new Date().toISOString(),
        image: matchingArticle?.image,
      }
    })
  }, [articleGroups, items])

  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark animate-fadeIn">
        <div className="text-center">
          <div className="loading-spinner inline-block w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full mb-4"></div>
          <div className="loading-dots flex justify-center gap-1 mb-3">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span className="w-2 h-2 bg-primary rounded-full"></span>
          </div>
          <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium">Đang tải tin tức...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark animate-fadeIn">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark animate-fadeIn">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Render first articles */}
        {articleGroups.firstArticles.length > 0 && (
          <div className="mb-12 lg:mb-16">
            {articleGroups.firstArticles.map((article, index) => (
              <FirstArticle key={article.id || index} news={article} onOpen={setSelectedArticle} />
            ))}
          </div>
        )}

        {/* Latest News section using recent articles */}
        {articleGroups.recentArticles.length > 0 && (
          <section className="mb-12 lg:mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-10">
                <h2 className="mb-4 border-b border-border-light dark:border-border-dark pb-2 text-sm font-semibold uppercase tracking-wider text-text-light dark:text-text-dark">
                  Latest News
                </h2>
                <div className="flex flex-col space-y-4">
                  {articleGroups.recentArticles.map((article, index) => (
                    <button
                      key={article.id || index}
                      onClick={() => setSelectedArticle(article)}
                      className="group flex items-start justify-between gap-4 border-b border-border-light dark:border-border-dark pb-4 text-left w-full"
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
        <section className="mb-12 lg:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: 4 Browse by Category articles */}
            <div className="hidden lg:block lg:col-span-3 space-y-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark border-b border-border-light dark:border-border-dark pb-2">
                Browse by Category
              </h3>
              <div className="flex flex-col space-y-4">
                {categoryArticles.slice(0, 4).map((article, index) => (
                  <button
                    key={article.id || index}
                    onClick={() => setSelectedArticle(article)}
                    className="group text-left block w-full"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-accent mb-1">
                      {article.category}
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
                Featured Articles
              </h2>
              <FeaturedArticles articles={articleGroups.featuredArticles} onOpen={setSelectedArticle} />
            </div>

            {/* Right Column: Next 4 Browse by Category articles */}
            <div className="hidden lg:block lg:col-span-3 space-y-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark border-b border-border-light dark:border-border-dark pb-2">
                More Categories
              </h3>
              <div className="flex flex-col space-y-4">
                {categoryArticles.slice(4, 8).map((article, index) => (
                  <button
                    key={article.id || index}
                    onClick={() => setSelectedArticle(article)}
                    className="group text-left block w-full"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-accent mb-1">
                      {article.category}
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
        <section className="mb-12 lg:mb-16">
          <CategoryGrid />
        </section>

        {/* Longform Articles section with infinite scroll */}
        <section className="mb-12 lg:mb-16">
          <LongformArticles articles={longformVisible} onOpen={setSelectedArticle} />
          <div ref={sentinelRef} className="py-6 text-center">
            {hasMoreLongform ? (
              <div>
                <div className="loading-spinner inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full mb-2"></div>
                <p className="text-text-muted-light dark:text-text-muted-dark text-sm">Đang tải thêm tin tức...</p>
              </div>
            ) : (
              articleGroups.longformPool.length > 0 && (
                <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium">Đã hiển thị tất cả tin tức</p>
              )
            )}
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />

      {selectedArticle && (
        <NewsModal news={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}
    </div>
  )
}

export default App
