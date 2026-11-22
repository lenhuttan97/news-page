import React from 'react'
import { Link } from 'react-router-dom'
import { NEWS_CATEGORIES } from '../data/rssData.js'

function getCategoryLabel(id) {
  const found = NEWS_CATEGORIES.find((cat) => cat.id === id)
  return found ? found.label : id
}

function CategoryArticles({ articles, onOpen }) {
  if (!articles || articles.length === 0) return null

  return (
    <section className="mb-12 lg:mb-16">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {articles.map((article, index) => (
          <div key={article?.id || index} className="flex flex-col gap-3 border-r border-border-light dark:border-border-dark last:border-r-0 pr-8">
            <Link to={`/category/${article?.category}`} className="text-xs font-semibold uppercase tracking-wider text-accent hover:text-accent/80 transition-colors duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
              {getCategoryLabel(article?.category)}
            </Link>
            <button onClick={() => onOpen && onOpen(article)} className="group text-left hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
              <h3 className="text-lg font-semibold leading-tight text-text-light dark:text-text-dark group-hover:text-accent transition-colors duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
                {article?.title}
              </h3>
            </button>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
              {article?.source} • {article?.pubDate ? new Date(article.pubDate).toLocaleDateString('vi-VN') : ''}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CategoryArticles
