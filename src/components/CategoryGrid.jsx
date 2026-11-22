import React from 'react'
import { Link } from 'react-router-dom'
import { NEWS_CATEGORIES } from '../data/rssData.js'

const CATEGORY_ICONS = {
  'tin-tuc': 'newspaper',
  'kinh-te': 'account_balance',
  'giao-duc': 'school',
  'cong-nghe': 'laptop_chromebook',
  'the-thao': 'sports_soccer',
  'suc-khoe': 'health_and_safety',
  'doi-song': 'restaurant',
  'van-hoa': 'theater_comedy',
  'du-lich': 'flight',
  xe: 'directions_car',
  'quoc-phong': 'shield',
  video: 'play_circle',
}

function CategoryGrid() {
  const categories = NEWS_CATEGORIES.filter(cat => cat.id !== 'all').map(cat => ({
    ...cat,
    icon: CATEGORY_ICONS[cat.id] || 'public',
  }))

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-text-light dark:text-text-dark">
          Xem theo chuyên mục
        </h2>
      </div>
<div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((cat) => (
            <Link key={cat.id} to={`/category/${cat.id}`} className="group flex flex-col items-center gap-3 text-center animate-cardAppear hover:-translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
              <span className="material-symbols-outlined text-4xl text-text-muted-light dark:text-text-muted-dark group-hover:text-accent group-hover:scale-110 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
                {cat.icon}
              </span>
              <span className="text-sm font-semibold text-balance group-hover:text-accent group-hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
    </section>
  )
}

export default CategoryGrid