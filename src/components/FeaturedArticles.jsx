import React from 'react'
import { NEWS_CATEGORIES } from '../data/rssData'

function getCategoryLabel(id) {
  const found = NEWS_CATEGORIES.find((cat) => cat.id === id)
  return found ? found.label : id
}

function FeaturedArticles({ articles, onOpen }) {
  if (!articles || articles.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {articles.map((article, index) => (
        <button
          key={article.id || index}
          type="button"
          onClick={() => onOpen && onOpen(article)}
          className="group flex flex-col gap-2 text-left bg-black/5 dark:bg-white/5 p-4 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        >
          <div
            className="w-full bg-cover bg-center bg-no-repeat aspect-[16/9] max-h-[140px] rounded-md"
            style={{
              backgroundImage: article.image
                ? `url("${article.image}")`
                : 'url("https://picsum.photos/seed/featured/400/225")',
            }}
            alt={article.title}
          />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-accent mb-1">
              {getCategoryLabel(article.category)}
            </p>
            <h3 className="text-sm font-semibold leading-snug text-text-light dark:text-text-dark group-hover:text-accent transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="mt-2 text-[11px] text-text-muted-light dark:text-text-muted-dark">
              {article.source} • {article.pubDate ? new Date(article.pubDate).toLocaleDateString('vi-VN') : ''}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}

export default FeaturedArticles
