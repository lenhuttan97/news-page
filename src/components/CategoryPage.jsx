import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useParams, Link } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import BackToTop from './BackToTop'
import SkeletonLoader from './SkeletonLoader'
import { useLoadingTimer } from '../hooks/useLoadingTimer'
import {
  selectAllArticles,
  selectCategoryArticles,
  fetchNews,
  fetchCategoryNews,
} from '../store/newsSlice'
import { NEWS_CATEGORIES } from '../data/rssData'
import NewsModal from './NewsModal'

function getCategoryLabel(id) {
  const found = NEWS_CATEGORIES.find((cat) => cat.id === id)
  return found ? found.label : id
}

function CategoryPage() {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const { categoryLoading, error } = useSelector((state) => state.news)
  const isShowingLoading = useLoadingTimer(categoryLoading)
  const allArticles = useSelector(selectAllArticles)
  const categoryArticles = useSelector(selectCategoryArticles)

  const isKnownCategory = NEWS_CATEGORIES.some((cat) => cat.id === slug)
  const homeSeededRef = useRef(false)

  const CATEGORY_PAGE_SIZE = 20
  const [visibleCount, setVisibleCount] = useState(CATEGORY_PAGE_SIZE)
  const sentinelRef = useRef(null)
  const [selectedArticle, setSelectedArticle] = useState(null)

  useEffect(() => {
    if (isKnownCategory && slug !== 'all') {
      dispatch(fetchCategoryNews(slug))
    }
  }, [dispatch, slug, isKnownCategory])

  useEffect(() => {
    if (homeSeededRef.current) return
    if (allArticles.length > 0) return
    homeSeededRef.current = true
    dispatch(fetchNews())
  }, [dispatch, allArticles.length])

  useEffect(() => {
    setVisibleCount(CATEGORY_PAGE_SIZE)
  }, [slug])

  const hasMoreCategory = visibleCount < categoryArticles.length

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreCategory) {
          setVisibleCount((prev) =>
            Math.min(prev + CATEGORY_PAGE_SIZE, categoryArticles.length)
          )
        }
      },
      { rootMargin: '150px', threshold: 0.1 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [categoryArticles.length, hasMoreCategory, visibleCount])

  useEffect(() => {
    if (categoryArticles.length > 0 && hasMoreCategory && visibleCount < categoryArticles.length) {
      setVisibleCount((prev) =>
        Math.min(prev + CATEGORY_PAGE_SIZE, categoryArticles.length)
      )
    }
  }, [categoryArticles.length])

  const sidebarArticles = allArticles
    .filter((item) => item.category && item.category.toLowerCase() !== (slug || '').toLowerCase())
    .slice(0, 5)

  if (slug === 'all') {
    return <Navigate to="/" replace />
  }

  if (!isKnownCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-text-light dark:text-text-dark mb-4">Không có chuyên mục này</h1>
          <Link to="/" className="inline-block text-accent hover:underline">
            Về trang chủ
          </Link>
        </div>
      </div>
    )
  }

  if (isShowingLoading && categoryArticles.length === 0) {
    return <SkeletonLoader />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  const categoryName = getCategoryLabel(slug)

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="mb-12 animate-pageFadeInUp">
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-text-light dark:text-text-dark md:text-5xl lg:text-6xl mb-4">
            {categoryName}
          </h1>
          <p className="text-lg text-text-muted-light dark:text-text-muted-dark max-w-2xl">
            Discover những câu chuyện, góc nhìn mới nhất về {categoryName}, được biên tập bởi đội ngũ chuyên gia.
          </p>
        </div>

        {categoryArticles.length > 0 ? (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="col-span-1 lg:col-span-9">
              <div className="flex flex-col space-y-4">
                {categoryArticles.slice(0, visibleCount).map((article, index) => (
                  <article
                    key={article.id || index}
                    onClick={() => setSelectedArticle(article)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setSelectedArticle(article)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className="group block cursor-pointer border-b border-border-light dark:border-border-dark pb-8 animate-cardAppear"
                    style={{ animationDelay: index < CATEGORY_PAGE_SIZE ? `${(index + 1) * 0.08}s` : '0s' }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                      <div className="md:col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">
                          {getCategoryLabel(article.category)}
                        </p>
                        <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark group-hover:text-accent transition-colors mb-3">
                          {article.title}
                        </h2>
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4">
                          {article.description || article.title}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                            {article.source} • {article.pubDate ? new Date(article.pubDate).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}
                          </p>
                          <div className="flex items-center gap-3 text-text-muted-light dark:text-text-muted-dark">
                            <button className="hover:text-accent transition-colors" title="Chia sẻ">
                              <span className="material-symbols-outlined !text-[18px]">share</span>
                            </button>
                            <button className="hover:text-accent transition-colors" title="Lưu">
                              <span className="material-symbols-outlined !text-[18px]">bookmark</span>
                            </button>
                          </div>
                        </div>
                      </div>
                      <img
                        src={article.image ? article.image : 'https://picsum.photos/seed/category/640/480'}
                        alt={article.title}
                        loading="lazy"
                        className="w-full object-cover aspect-[4/3] rounded-lg"
                      />
                    </div>
                  </article>
                ))}
              </div>

              {/* Sentinel and Infinite Scroll Status */}
              <div ref={sentinelRef} className="h-8 flex items-center justify-center py-0 m-0">
                {hasMoreCategory ? (
                  <div className="flex items-center gap-1" aria-label="Đang tải thêm">
                    <span className="loading-dot w-1 h-1 rounded-full bg-primary inline-block"></span>
                    <span className="loading-dot loading-dot-2 w-1 h-1 rounded-full bg-primary inline-block"></span>
                    <span className="loading-dot loading-dot-3 w-1 h-1 rounded-full bg-primary inline-block"></span>
                  </div>
                ) : (
                  <p className="text-text-muted-light dark:text-text-muted-dark text-[10px] font-medium m-0">Đã hiển thị tất cả tin tức</p>
                )}
              </div>
            </div>

            {sidebarArticles.length > 0 && (
              <div className="hidden lg:block lg:col-span-3">
                <div className="sticky top-10">
                  <h2 className="mb-4 border-b border-border-light dark:border-border-dark pb-2 text-sm font-semibold uppercase tracking-wider text-text-light dark:text-text-dark animate-pageFadeInUp stagger-1">
                    Tin mới nhất
                  </h2>
                  <div className="flex flex-col space-y-4">
                    {sidebarArticles.map((item, index) => (
                      <button
                        key={item.id || index}
                        type="button"
                        onClick={() => setSelectedArticle(item)}
                        className="group w-full text-left animate-cardAppear"
                        style={{ animationDelay: `${(index + 1) * 0.06}s` }}
                      >
                        <p className="text-sm font-medium text-text-light dark:text-text-dark group-hover:text-accent transition-colors">
                          {item.title}
                        </p>
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                          {item.pubDate ? new Date(item.pubDate).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''} • {item.source}
                        </p>
                       </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 animate-pageFadeInUp">
            <p className="text-text-muted-light dark:text-text-muted-dark text-lg">Không có bài viết nào trong {categoryName}</p>
            <Link to="/" className="mt-4 inline-block text-accent hover:underline">
              Về trang chủ
            </Link>
          </div>
        )}
      </main>
      <Footer />
      <BackToTop />

      {selectedArticle && (
        <NewsModal news={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}
    </div>
  )
}

export default CategoryPage
export { NewsModal }
