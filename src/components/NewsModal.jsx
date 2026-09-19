import React from 'react'
import { NEWS_CATEGORIES } from '../data/rssData'

function getCategoryLabel(id) {
  const found = NEWS_CATEGORIES.find((cat) => cat.id === id)
  return found ? found.label : id
}

function NewsModal({ news, onClose }) {
  if (!news) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-modalFadeIn" onClick={onClose}>
      <div
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl bg-background-light dark:bg-background-dark animate-modalScaleIn"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full bg-white/90 p-1 text-gray-600 transition-colors duration-200 hover:bg-gray-100 dark:bg-background-dark/90 dark:text-gray-300 dark:hover:bg-background-dark"
          aria-label="Close modal"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {news.image && (
          <img
            src={news.image}
            alt={news.title}
            className="mb-6 h-64 w-full rounded-t-lg object-cover"
          />
        )}

        <div className="p-6">
          <span className="mb-3 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            {getCategoryLabel(news.category)}
          </span>

          <h2 className="mb-2 text-3xl font-bold text-text-light dark:text-text-dark">{news.title}</h2>

          <div className="mb-4 flex flex-col gap-3 text-sm text-text-muted-light dark:text-text-muted-dark sm:flex-row">
            <span>Nguồn: {news.source}</span>
            <span>•</span>
            <span>{news.pubDate ? new Date(news.pubDate).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'Không có ngày đăng'}</span>
          </div>

          <p className="mb-6 text-base leading-relaxed text-text-light dark:text-text-dark">
            {news.description || 'Chưa có mô tả.'}
          </p>

          <div className="flex items-center justify-between gap-4 border-t border-border-light pt-4 dark:border-border-dark">
            <button
              onClick={onClose}
              className="font-medium text-sm text-accent transition-colors duration-200 hover:text-accent/80"
            >
              Đóng
            </button>
            <a
              href={news.link || news.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-white transition-colors duration-200 hover:bg-primary/90"
            >
              Đọc thêm
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsModal