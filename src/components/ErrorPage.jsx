import React from 'react'
import { useRouteError, Link, isRouteErrorResponse } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function ErrorPage() {
  const error = useRouteError()
  console.error('Route Error:', error)

  const is404 = isRouteErrorResponse(error) && error.status === 404

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 mb-6">
            <span className="material-symbols-outlined text-3xl">
              {is404 ? 'search_off' : 'error'}
            </span>
          </div>
          <h1 className="text-2xl font-bold font-serif mb-2">
            {is404 ? 'Không tìm thấy trang (404)' : 'Đã xảy ra lỗi hệ thống'}
          </h1>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-8">
            {is404
              ? 'Đường dẫn bạn truy cập không tồn tại hoặc đã bị di chuyển.'
              : error?.statusText || error?.message || 'Xin lỗi, trang bạn đang truy cập gặp sự cố.'}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/"
              className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-lg">home</span>
              Về trang chủ
            </Link>
            {!is404 && (
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border-light dark:border-border-dark text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">refresh</span>
                Thử lại
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
