import React from 'react'

function FirstArticle({ news, onOpen }) {
  if (!news) return null

  const open = () => {
    if (onOpen) onOpen(news)
  }

  return (
    <section className="mb-12 lg:mb-16">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div
          className="w-full bg-cover bg-center bg-no-repeat rounded-lg aspect-video cursor-pointer"
          style={{ backgroundImage: news.image ? `url("${news.image}")` : 'url("https://picsum.photos/seed/news-hero/800/450")' }}
          alt={news.title}
          onClick={open}
        />
        <div className="flex flex-col items-start justify-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-accent">
            Top Story
          </p>
          <h1
            className="font-serif text-3xl font-bold leading-tight tracking-tight text-text-light dark:text-text-dark md:text-4xl lg:text-5xl cursor-pointer hover:text-accent transition-colors"
            onClick={open}
          >
            {news.title}
          </h1>
          <p className="mt-4 text-sm text-text-muted-light dark:text-text-muted-dark">
            {news.source} • {news.pubDate ? new Date(news.pubDate).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}
          </p>
          <p className="mt-6 text-sm text-text-muted-light dark:text-text-muted-dark max-w-prose">
            {news.description || news.title}
          </p>
          <div className="mt-8 flex items-center gap-4">
            <button onClick={open} className="btn-primary">
              Read Full Story
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (news.link && navigator.clipboard) {
                  navigator.clipboard.writeText(news.link)
                }
              }}
              className="btn-secondary"
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FirstArticle
