import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useParams, Link } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import {
  selectAllArticles,
  selectCategoryArticles,
  fetchNews,
  fetchCategoryNews,
} from '../store/newsSlice'
import { NEWS_CATEGORIES } from '../data/rssData'

function getCategoryLabel(id) {
  const found = NEWS_CATEGORIES.find((cat) => cat.id === id)
  return found ? found.label : id
}

function CategoryPage() {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.news)
  const allArticles = useSelector(selectAllArticles)
  const categoryArticles = useSelector(selectCategoryArticles)

  const isKnownCategory = NEWS_CATEGORIES.some((cat) => cat.id === slug)
  const homeSeededRef = useRef(false)

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

  const sidebarArticles = allArticles
    .filter((item) => item.category && item.category.toLowerCase() !== slug.toLowerCase())
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

  if (loading && categoryArticles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
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
        <div className="mb-12">
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-text-light dark:text-text-dark md:text-5xl lg:text-6xl mb-4">
            {categoryName}
          </h1>
          <p className="text-lg text-text-muted-light dark:text-text-muted-dark max-w-2xl">
            Discover the most recent stories, insights, and perspectives in {categoryName}, curated by our editorial team.
          </p>
        </div>

        {categoryArticles.length > 0 ? (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-9">
              <div className="flex flex-col space-y-8">
                {categoryArticles.map((article, index) => (
                  <article key={article.id || index} className="group block border-b border-border-light dark:border-border-dark pb-8">
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
                            <button className="hover:text-accent transition-colors" title="Share">
                              <span className="material-symbols-outlined !text-[18px]">share</span>
                            </button>
                            <button className="hover:text-accent transition-colors" title="Save">
                              <span className="material-symbols-outlined !text-[18px]">bookmark</span>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div
                        className="w-full bg-cover bg-center bg-no-repeat aspect-[4/3] rounded-lg"
                        style={{ backgroundImage: article.image ? `url("${article.image}")` : 'url("https://picsum.photos/seed/category/640/480")' }}
                        alt={article.title}
                      />
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {sidebarArticles.length > 0 && (
              <div className="lg:col-span-3">
                <div className="sticky top-10">
                  <h2 className="mb-4 border-b border-border-light dark:border-border-dark pb-2 text-sm font-semibold uppercase tracking-wider text-text-light dark:text-text-dark">
                    Latest News
                  </h2>
                  <div className="flex flex-col space-y-4">
                    {sidebarArticles.map((item, index) => (
                        <a key={item.id || index} href="#" className="group">
                          <p className="text-sm font-medium text-text-light dark:text-text-dark group-hover:text-accent transition-colors">
                            {item.title}
                          </p>
                          <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                            {item.pubDate ? new Date(item.pubDate).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''} • {item.source}
                          </p>
                        </a>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-muted-light dark:text-text-muted-dark text-lg">Không có bài viết nào trong {categoryName}</p>
            <Link to="/" className="mt-4 inline-block text-accent hover:underline">
              Về trang chủ
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default CategoryPage