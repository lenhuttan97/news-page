import React from 'react'
import { NEWS_CATEGORIES } from '../data/rssData'

function getCategoryLabel(id) {
  const found = NEWS_CATEGORIES.find((cat) => cat.id === id)
  return found ? found.label : id
}

function NewsCard({ news, onOpen }) {
  if (!news) return null

  const formatRelativeTime = (pubDate) => {
    if (!pubDate) return ''
    const date = new Date(pubDate)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffMins < 1) return 'vừa xong'
    if (diffMins < 60) return `${diffMins}p trước`
    if (diffHours < 24) return `${diffHours}g trước`
    return `${diffDays}ngày trước`
  }

  const handleCardClick = () => {
    if (onOpen) onOpen(news)
  }

  return (
    <div>
      <article
        className="group flex flex-col gap-3 cursor-pointer"
        onClick={handleCardClick}
      >
        <img
          src={news.image ? news.image : 'https://picsum.photos/seed/news-card/400/225'}
          alt={news.title}
          loading="lazy"
          className="w-full object-cover aspect-video rounded-lg transition-all duration-300 group-hover:scale-[1.02]"
        />
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent transition-colors group-hover:text-accent/80">
            {getCategoryLabel(news.category)}
          </p>
          <p className="text-lg font-semibold leading-tight text-text-light dark:text-text-dark group-hover:text-accent transition-colors duration-300">
            {news.title}
          </p>
          <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
            {news.source} • {formatRelativeTime(news.pubDate)}
          </p>
        </div>
      </article>
    </div>
  )
}

export default NewsCard