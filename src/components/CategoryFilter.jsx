import { NEWS_CATEGORIES } from '../data/rssData'

const CATEGORY_ICONS = {
  all: 'article',
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

function CategoryFilter({ activeCategory, onCategoryChange }) {
  return (
    <section className="mb-8">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
        {NEWS_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`group flex flex-col items-center gap-3 text-center hover:opacity-80 transition-opacity ${
              activeCategory === cat.id
                ? 'font-semibold text-text-light dark:text-text-dark'
                : 'text-text-muted-light dark:text-text-muted-dark'
            }`}
          >
            <span className="material-symbols-outlined text-4xl text-text-muted-light dark:text-text-muted-dark group-hover:text-accent transition-colors">
              {CATEGORY_ICONS[cat.id] || 'article'}
            </span>
            <span className="text-sm font-semibold text-balance">{cat.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default CategoryFilter;
