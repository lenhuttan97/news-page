import React from 'react'

function LongformArticles({ articles, onOpen }) {
  const longformArticles = articles && articles.length > 0
    ? articles
    : [
        {
          title: 'The Vanishing Art of Letter Writing in a Digital World',
          description: 'Exploring the profound personal connections forged through handwritten correspondence and its place in our fast-paced, digital-first society.',
          image: 'https://picsum.photos/seed/letter/640/480',
        },
        {
          title: 'How Ancient Philosophers Can Help Us Navigate Modern Anxiety',
          description: 'Timeless wisdom from Stoicism and other schools of thought provides a surprisingly relevant toolkit for managing the stresses of contemporary life.',
          image: 'https://picsum.photos/seed/philosophy/640/480',
        },
        {
          title: 'Inside the Meticulous Craft of a Master Watchmaker',
          description: 'A look into a world where centuries-old techniques meet microscopic precision, creating timepieces that are both art and engineering marvels.',
          image: 'https://picsum.photos/seed/watchmaker/640/480',
        },
        {
          title: 'Climate Change and the Future of the Wine Industry',
          description: 'Vintners around the world are adapting to changing weather patterns, experimenting with new grape varieties and locations to save their craft.',
          image: 'https://picsum.photos/seed/wine/640/480',
        },
        {
          title: 'The Hidden Architecture of Modern Cities',
          description: 'Beneath the skylines and boulevards, invisible systems of infrastructure quietly shape how millions of people live every day.',
          image: 'https://picsum.photos/seed/city/640/480',
        },
        {
          title: 'The Quiet Renaissance of Local Craftsmanship',
          description: 'Artisans across the globe are finding new audiences and renewed purpose through digital platforms and community support.',
          image: 'https://picsum.photos/seed/craft/640/480',
        },
      ]

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16">
      <div className="flex flex-col space-y-8 border-t border-border-light dark:border-border-dark pt-12 lg:pt-16">
        {longformArticles.map((article, index) => (
          <div
            key={article.id || index}
            onClick={() => onOpen && onOpen(article)}
            className="group block border-b border-border-light dark:border-border-dark pb-8 cursor-pointer"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
              <div className="md:col-span-3">
                <h3 className="font-serif text-3xl font-bold text-text-light dark:text-text-dark group-hover:text-accent transition-colors">
                  {article.title}
                </h3>
                <p className="mt-3 text-sm text-text-muted-light dark:text-text-muted-dark">
                  {article.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                    {article.source || 'Tổng hợp'} • {article.pubDate ? new Date(article.pubDate).toLocaleDateString('vi-VN') : ''}
                  </p>
                  <div
                    className="flex items-center gap-4 text-text-muted-light dark:text-text-muted-dark"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className="hover:text-accent transition-colors" title="Share">
                      <span className="material-symbols-outlined !text-[18px]">share</span>
                    </button>
                    <button className="hover:text-accent transition-colors" title="Copy Link">
                      <span className="material-symbols-outlined !text-[18px]">link</span>
                    </button>
                    <button className="hover:text-accent transition-colors" title="Save">
                      <span className="material-symbols-outlined !text-[18px]">bookmark</span>
                    </button>
                    <button className="hover:text-accent transition-colors" title="More">
                      <span className="material-symbols-outlined !text-[18px]">more_horiz</span>
                    </button>
                  </div>
                </div>
              </div>
              <div
                className="w-full bg-cover bg-center bg-no-repeat aspect-[4/3] rounded-lg"
                style={{ backgroundImage: article.image ? `url("${article.image}")` : 'none' }}
                alt={article.title}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LongformArticles;
