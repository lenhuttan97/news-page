# Design Spec: Category Pagination, Popups, Header Redesign, Theme 3-Mode

Date: 2026-09-19
Status: Approved (in-chat design reviewed by user)
Applies to: news-page app (React 18 + Vite + Redux Toolkit + react-router 7 + Tailwind CSS)

## Context

The app fetches per-category RSS feeds with `fetchCategoryNews(slug)` and renders
all fetched articles at once on `/category/:slug`. The homepage already has an
infinite-scroll pattern (IntersectionObserver, +6 per batch) and article popups
(`NewsModal`). The header renders all 12 category labels inline, so long labels
(e.g. "Văn hóa & Giải trí", "Quốc phòng – An ninh") break the layout. Theme is
managed by local state inside `Header.jsx` with only two values, so there is no
way to follow the OS and it flashes/resets on entry.

## Goals

1. Category pages show the first 20 articles, then load 20 more per infinite scroll.
2. Category article cards (and sidebar "Latest News" items) open the same popup as the homepage.
3. Header redesign: remove Search + Subscribe; 12-category nav in one horizontally scrollable row.
4. Theme managed in Redux with 3 modes (light / dark / system), default `system`, persisted, no flash.

## Design

### 1. Theme → Redux (new `src/store/themeSlice.js`)

State shape:

```js
{ mode: 'system' | 'light' | 'dark', resolved: 'light' | 'dark' }
```

- `mode` is initialized from `localStorage('theme')`, validated against
  `['light','dark','system']`, defaulting to `system`. Invalid/corrupt value
  falls back to `system`.
- `resolved` is computed synchronously at slice init:
  - `mode === 'system'` → `matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'`
  - otherwise `mode`.
- Reducer `setMode(mode)`:
  - sets `mode`, recomputes `resolved` (for `system` via `matchMedia`),
  - writes `localStorage('theme') = mode`,
  - applies/removes `.dark` class on `document.documentElement` immediately.
- `store/index.js`:
  - adds `theme: themeReducer`,
  - at module load applies the class from the initial slice state (side effect;
    must run before first paint),
  - calls a top-level `listenToThemeChanges(store)` exported from
    `themeSlice.js` from `store/index.js` module scope, registering a
    `matchMedia` change listener: when `mode === 'system'`, re-resolve and
    re-apply the class on OS change.
- `index.html`: tiny inline script before the module bundle reads the same
  `localStorage('theme')` + `matchMedia`, sets `document.documentElement.classList`
  to avoid a flash of the wrong theme. This mirrors the Redux init (single source
  of truth for `mode` is `localStorage`; Redux hydrates from it).
- Public selectors: `selectThemeMode`, `selectThemeResolved`.

### 2. Theme UI (Header dropdown)

Replace the existing toggle button with a dropdown:

- A circular icon button showing current state icon:
  - `resolved === 'dark'` → `dark_mode`; else `light_mode`.
- On click opens a small menu with 3 radio rows:
  - `light_mode` – Sáng (Light)
  - `dark_mode` – Tối (Dark)
  - `brightness_auto` – Theo hệ thống (System)
- Each row dispatches `setMode`. Active mode is highlighted via filled radio
  bullet (Material Symbols `radio_button_checked`/`radio_button_unchecked`).
- Click outside closes the menu (`useRef` on the wrapper + `mousedown` doc
  listener, following existing patterns).
- Close the menu after selecting.

### 3. CategoryPage: pagination + popups

- Local state:
  - `visibleCount` initialized to 20 (named constant `CATEGORY_PAGE_SIZE = 20`).
  - `selectedArticle` for the popup.
  - `sentinelRef` for the infinite-scroll trigger (pattern from `App.jsx`).
- `displayed = categoryArticles.slice(0, visibleCount)`; render `displayed`.
- `IntersectionObserver` on sentinel with `rootMargin: '400px'`; when intersecting,
  `setVisibleCount(v => Math.min(v + CATEGORY_PAGE_SIZE, categoryArticles.length))`.
- Reset `visibleCount` to `CATEGORY_PAGE_SIZE` when `slug` changes (effect).
- Sentinel area shows "Đang tải thêm tin tức..." while `hasMore`, and "Đã hiển thị
  tất cả tin tức" when exhausted (match homepage copy).
- Article card: keep the existing `<article>` card markup and add `onClick={() => setSelectedArticle(article)}`, `cursor-pointer`, `role="button"`, `tabIndex={0}`, and `onKeyDown` firing on Enter/Space (a11y).
- Sidebar "Latest News" items: same `onClick` → popup.
- Render `<NewsModal news={selectedArticle} onClose={...} />` at root when set.
- Keep existing unknown-slug screen, `/category/all` redirect, sidebar hide-when-empty.

### 4. Header redesign

- Remove the Search button and Subscribe link.
- Nav (`.hidden md:flex` becomes visible): keep single row
  `flex items-center gap-8 overflow-x-auto no-scrollbar` so all 12 categories
  scroll horizontally instead of wrapping/breaking.
- Add `.no-scrollbar` utility in `src/styles/main.css` (the stylesheet actually
  imported by `main.jsx` — note `src/index.css` is currently unimported dead
  code; do NOT add the utility there):
  `::-webkit-scrollbar { display:none }` + `scrollbar-width:none; scrollbar-color:transparent`.
- Keep logo + right-side cluster; right cluster now holds only the theme dropdown.
- Mobile: nav stays as-is (hidden below `md`); unchanged behavior.

## Files

| File | Change |
| --- | --- |
| `src/store/themeSlice.js` | new — theme slice, init, `setMode`, listen helper |
| `src/store/index.js` | add theme reducer, apply-class side effect, start OS listener |
| `src/main.jsx` | ensure listener starts (or do it via `store/index.js` import) |
| `src/components/Header.jsx` | remove search/subscribe/toggle; scrollable nav; theme dropdown |
| `src/components/CategoryPage.jsx` | pagination (20/+20), popups, sentinel, reset |
| `src/styles/main.css` | `.no-scrollbar` utility (imported stylesheet) |
| `index.html` | inline theme script (before bundle) |

No new dependencies. Existing `dark:` Tailwind classes across all components keep
working because the theme drives `document.documentElement` class.

## Error handling / edge cases

- `localStorage` unavailable (private mode): wrap access in try/catch; default `system`.
- Category returns fewer than 20 items: `slice` yields fewer, sentinel hidden, "all shown".
- OS theme changes while in `system` mode: listener re-applies class; in
  `light`/`dark` modes it is ignored (but listener still runs; no-op).
- No articles (error): existing red-error screen unchanged.

## Testing / verification

Per AGENTS.md — must pass before reporting complete:
1. `npm run build` succeeds.
2. `npm run dev` loads without console errors.
3. Functional checks:
   - `/category/kinh-te` renders exactly 20 items first, grows by 20 on scroll,
     eventually shows "Đã hiển thị tất cả tin tức".
   - Clicking a category card and a sidebar item opens the popup; close works.
   - Header: no Search/Subscribe; long category labels scroll horizontally,
     do not break layout.
   - Theme: default `system`; choosing Dark persists across reload; choosing
     System follows an OS-side scheme change (emulate via devtools); no
     flash on load in dark/system-dark.