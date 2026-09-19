# Category Pagination, Popups, Header Redesign & Theme 3-Mode — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give category pages pagination (20 then +20) and article popups like the homepage, redesign the header (no Search/Subscribe, horizontally scrollable nav), and move theme to Redux with 3 persisted modes (light/dark/system, default system, no flash).

**Architecture:** Theme becomes a Redux slice (`themeSlice.js`) that hydrates from `localStorage('theme')` synchronously, resolves `system` via `matchMedia`, applies `.dark` on `documentElement`, and listens to OS changes; an inline pre-bundle script in `index.html` removes the first-paint flash. `CategoryPage.jsx` reuses the homepage's `IntersectionObserver` infinite-scroll pattern and `NewsModal` popup. `Header.jsx` drops Search/Subscribe, renders all categories in one `overflow-x-auto` row, and replaces the toggle with a 3-option theme dropdown.

**Tech Stack:** React 18.2, Vite 5, Redux Toolkit 2, react-router 7, Tailwind CSS 3.4 (class dark mode), Material Symbols.

**Spec:** `docs/superpowers/specs/2026-09-19-category-pagination-popups-header-theme-design.md` (commit `d309ec9`) — the plan argues from the spec; executors read both.

## Global Constraints

- Only the imported stylesheet is `src/styles/main.css` (`src/index.css` is unimported dead code — do not add CSS there).
- No new npm dependencies. No test framework exists — verification = `npm run build` + `npm run dev` + HTTP/behavioral checks (AGENTS.md).
- Copy is Vietnamese, consistent with existing UI: "Đang tải tin tức...", "Đang tải thêm tin tức...", "Đã hiển thị tất cả tin tức".
- Theme is persisted under the existing localStorage key `theme`; valid values `light | dark | system`; anything else (or unreadable) → `system`; default when absent → `system`.
- `document.documentElement` toggles `.dark` class — all `dark:` Tailwind classes across components keep working unchanged.
- Do not touch the exiting `/category/all` redirect, unknown-slug screen, sidebar-hide-when-empty behavior.
- Commits: one per task with a clear message; work on the current branch (`main`).

## Review Focus

- **Corrupt/absent localStorage `theme`** → must default to `system`, never throw, never crash (safety: wrap in try/catch).
- **OS scheme change while in `system` mode** → `.dark` toggles live; while in `light`/`dark` mode → ignored; never leaves the class stuck wrong.
- **First paint with stored `dark` or system-dark** → no flash of light theme (inline script + store both agree).
- **Slug change** `/category/kinh-te` → `/category/the-thao` → visible count resets to 20 (no leftover count or leftover articles from previous category).
- **Category with ≤ 20 articles** → all shown immediately, "Đã hiển thị tất cả tin tức" shows, no infinite loop of observers.
- **Header at narrow desktop width** → long labels ("Văn hóa & Giải trí", "Quốc phòng – An ninh") stay on one line and scroll horizontally, layout does not wrap/break.
- **Popup a11y** → card opens on Enter/Space; sidebar items open popup too; backdrop/Đóng closes it.

---

### Task 1: Theme slice + store wiring + no-flash script

**Files:**
- Create: `src/store/themeSlice.js`
- Modify: `src/store/index.js`
- Modify: `index.html`

**Interfaces:**
- Produces (used by Task 2):
  - `themeReducer` (default export of `themeSlice.js`)
  - `setMode(mode)` action — `mode` is `'light' | 'dark' | 'system'`
  - `selectThemeMode(state)` → current mode
  - `selectThemeResolved(state)` → `'light' | 'dark'`
  - `applyThemeClass(resolved)` — idempotent documentElement class setter
  - `listenToThemeChanges(store)` — idempotent OS-change listener

- [ ] **Step 1: Create `src/store/themeSlice.js`**

```js
import { createSlice } from '@reduxjs/toolkit';

const THEME_KEY = 'theme';
const VALID_MODES = ['light', 'dark', 'system'];

function readStoredMode() {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return VALID_MODES.includes(value) ? value : 'system';
  } catch (error) {
    return 'system';
  }
}

function systemPrefersDark() {
  return typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false;
}

function resolveMode(mode) {
  return mode === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : mode;
}

export function applyThemeClass(resolved) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: readStoredMode(),
    resolved: resolveMode(readStoredMode()),
  },
  reducers: {
    setMode(state, action) {
      const mode = VALID_MODES.includes(action.payload) ? action.payload : 'system';
      state.mode = mode;
      state.resolved = resolveMode(mode);
      try {
        localStorage.setItem(THEME_KEY, mode);
      } catch (error) {
        /* storage unavailable: keep in-memory mode */
      }
      applyThemeClass(state.resolved);
    },
  },
});

export const { setMode } = themeSlice.actions;
export const selectThemeMode = (state) => state.theme.mode;
export const selectThemeResolved = (state) => state.theme.resolved;

export function listenToThemeChanges(store) {
  if (typeof window === 'undefined' || !window.matchMedia) return;
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const onChange = () => {
    if (store.getState().theme.mode === 'system') {
      store.dispatch(setMode('system'));
    }
  };
  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', onChange);
  } else {
    mediaQuery.addListener(onChange);
  }
}

export default themeSlice.reducer;
```

- [ ] **Step 2: Wire the store — rewrite `src/store/index.js`**

```js
import { configureStore } from '@reduxjs/toolkit';
import newsReducer from './newsSlice';
import themeReducer, { applyThemeClass, listenToThemeChanges } from './themeSlice';

const store = configureStore({
  reducer: {
    news: newsReducer,
    theme: themeReducer,
  },
});

applyThemeClass(store.getState().theme.resolved);
listenToThemeChanges(store);

export default store;
```

- [ ] **Step 3: Add the no-flash inline script to `index.html` (inside `<head>`, before the `</head>` closing tag and before the module script)**

```html
    <script>
      (function () {
        try {
          var mode = localStorage.getItem('theme');
          var dark =
            mode === 'dark' ||
            ((mode === 'system' || mode === null) &&
              window.matchMedia('(prefers-color-scheme: dark)').matches);
          document.documentElement.classList.toggle('dark', dark);
        } catch (e) {}
      })();
    </script>
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: `vite build` succeeds (`✓ built in ...s`).

- [ ] **Step 5: Verify dev server + inline script**

Run: `npm run dev` (background), then `curl -s http://localhost:3000/ | grep -n "prefers-color-scheme"` and `curl -s http://localhost:3000/ | grep -n "src/styles/main.css"`.
Expected: both grep hits — the theme script is emitted in `index.html` and the stylesheet is `main.css` (not `index.css`).
Manual check (browser): set `localStorage.theme='dark'`, reload → page is dark immediately with no light flash; `localStorage.theme='system'` + devtools `Emulate prefers-color-scheme: dark` → dark, switch emulation to light → site follows. Kill dev server when done.

- [ ] **Step 6: Commit**

```bash
git add src/store/themeSlice.js src/store/index.js index.html
git commit -m "feat: theme slice with light/dark/system modes and no-flash bootstrap"
```

---

### Task 2: Header redesign + theme dropdown

**Files:**
- Modify: `src/components/Header.jsx`
- Modify: `src/styles/main.css`

**Interfaces:**
- Consumes: `setMode`, `selectThemeMode`, `selectThemeResolved` from `src/store/themeSlice.js` (Task 1).
- Produces: none (Header is leaf).

- [ ] **Step 1: Rewrite `src/components/Header.jsx`**

Replace the whole file body with:

```jsx
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { NEWS_CATEGORIES } from '../data/rssData.js'
import { setMode, selectThemeMode, selectThemeResolved } from '../store/themeSlice'

const THEME_OPTIONS = [
  { value: 'light', label: 'Sáng', icon: 'light_mode' },
  { value: 'dark', label: 'Tối', icon: 'dark_mode' },
  { value: 'system', label: 'Theo hệ thống', icon: 'brightness_auto' },
]

function Header() {
  const dispatch = useDispatch()
  const mode = useSelector(selectThemeMode)
  const resolved = useSelector(selectThemeResolved)
  const [menuOpen, setMenuOpen] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    const onPointerDown = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  return (
    <header className="bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-10">
            <a className="shrink-0 text-2xl font-bold font-serif text-text-light dark:text-text-dark" href="/">
              The Chronicle
            </a>
            <nav className="no-scrollbar hidden overflow-x-auto md:flex items-center gap-8">
              <Link className="whitespace-nowrap text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark link-underline" to="/">
                Trang chủ
              </Link>
              {NEWS_CATEGORIES.filter((cat) => cat.id !== 'all').map((cat) => (
                <Link key={cat.id} className="whitespace-nowrap text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark link-underline" to={`/category/${cat.id}`}>
                  {cat.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="relative flex shrink-0 items-center" ref={wrapperRef}>
            <button
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-text-muted-light dark:text-text-muted-dark hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              title="Chọn giao diện"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              {resolved === 'dark' ? (
                <span className="material-symbols-outlined">dark_mode</span>
              ) : (
                <span className="material-symbols-outlined">light_mode</span>
              )}
            </button>
            {menuOpen && (
              <div role="menu" className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2 shadow-lg">
                {THEME_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    role="menuitemradio"
                    aria-checked={mode === option.value}
                    onClick={() => {
                      dispatch(setMode(option.value))
                      setMenuOpen(false)
                    }}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-text-light dark:text-text-dark hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">{option.icon}</span>
                    {option.label}
                    <span className="ml-auto material-symbols-outlined text-[18px] text-accent">
                      {mode === option.value ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
```

Note: the old local `isDarkMode` state and its two `useEffect`s, the Search button and the Subscribe link are all removed.

- [ ] **Step 2: Add `.no-scrollbar` utility to `src/styles/main.css` (append at end of file)**

```css
/* Hide horizontal scrollbar on scrollable nav rows */
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: `vite build` succeeds.

- [ ] **Step 4: Verify dev server + theme dropdown behavior**

Run: `npm run dev` (background), `curl -s http://localhost:3000/` twice, first with empty localStorage, then `localStorage.theme='dark'`.
Expected: page HTML loads (curl 200); in browser: header shows logo, nav with all 12 categories on ONE scrollable row (no wrapping; longest labels visible by scrolling), no "Search" and no "Subscribe"; clicking the theme icon opens a menu with 3 rows labeled Sáng / Tối / Theo hệ thống; the current mode shows a filled check; clicking Dark immediately darkens and persists across reload; clicking outside closes the menu. Kill dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.jsx src/styles/main.css
git commit -m "feat: header without search/subscribe, scrollable nav, 3-mode theme dropdown"
```

---

### Task 3: CategoryPage infinite scroll (20 first, +20)

**Files:**
- Modify: `src/components/CategoryPage.jsx`

**Interfaces:**
- Consumes: `categoryArticles` from `selectCategoryArticles(state)` (existing selector).
- Produces: `visibleCount` slice of rendered article list; reset on slug change (behavior used by Task 4's popup rendering).

- [ ] **Step 1: Add pagination state + sentinel to `CategoryPage.jsx`**

Add a module-scope constant at the top of the file (after the imports):

```jsx
const CATEGORY_PAGE_SIZE = 20
```

Then add component state right after `const { slug } = useParams()`:

```jsx
  const [visibleCount, setVisibleCount] = React.useState(CATEGORY_PAGE_SIZE)
  const sentinelRef = useRef(null)
```

Add a reset-on-slug effect (right after the existing `fetchCategoryNews` effect):

```jsx
  useEffect(() => {
    setVisibleCount(CATEGORY_PAGE_SIZE)
  }, [slug])
```

Add the infinite-scroll effect (after the sidebar calculation, before the `slug === 'all'` check):

```jsx
  const hasMoreCategory = visibleCount < categoryArticles.length

  useEffect(() => {
    if (hasMoreCategory) {
      const sentinel = sentinelRef.current
      if (!sentinel) return
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setVisibleCount((prev) =>
              Math.min(prev + CATEGORY_PAGE_SIZE, categoryArticles.length)
            )
          }
        },
        { rootMargin: '400px' }
      )
      observer.observe(sentinel)
      return () => observer.disconnect()
    }
  }, [hasMoreCategory, categoryArticles.length])
```

- [ ] **Step 2: Render only the visible slice**

Replace `{categoryArticles.map((article, index) => (` with `{categoryArticles.slice(0, visibleCount).map((article, index) => (`.

- [ ] **Step 3: Render the sentinel inside the column**

In the main column, right after the articles `</div>` closing the `flex flex-col space-y-8` list and inside the `lg:col-span-9` wrapper, add:

```jsx
              <div ref={sentinelRef} className="py-6 text-center">
                {hasMoreCategory ? (
                  <div>
                    <div className="loading-spinner inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full mb-2"></div>
                    <p className="text-text-muted-light dark:text-text-muted-dark text-sm">Đang tải thêm tin tức...</p>
                  </div>
                ) : (
                  categoryArticles.length > 0 && (
                    <p className="text-text-muted-light dark:text-text-muted-dark text-sm">Đã hiển thị tất cả tin tức</p>
                  )
                )}
              </div>
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: `vite build` succeeds.

- [ ] **Step 5: Verify dev server behavior**

Run: `npm run dev` (background). Open `http://localhost:3000/category/kinh-te`.
Expected: only 20 articles render initially; scrolling to the bottom appends 20 more (loading spinner between batches); after exhaustion "Đã hiển thị tất cả tin tức" appears; navigating straight from `/category/kinh-te` to `/category/the-thao` resets to 20 (URL bar edit or via the header). Kill dev server.

- [ ] **Step 6: Commit**

```bash
git add src/components/CategoryPage.jsx
git commit -m "feat: category pages paginate 20 then load 20 per scroll"
```

---

### Task 4: CategoryPage popups on cards and sidebar

**Files:**
- Modify: `src/components/CategoryPage.jsx`

**Interfaces:**
- Consumes: `NewsModal` component (`src/components/NewsModal.jsx`, props `news` + `onClose`).
- Produces: none (leaf change).

- [ ] **Step 1: Wire popup state + modal**

Add to imports: `import NewsModal from './NewsModal'`.

Add after `const sentinelRef = useRef(null)`:

```jsx
  const [selectedArticle, setSelectedArticle] = React.useState(null)
```

Render the modal at the root of the returned JSX (right before the closing `</div>` of the outer container, after `<Footer />`):

```jsx
      {selectedArticle && (
        <NewsModal news={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}
```

- [ ] **Step 2: Make article cards clickable**

In the article `<article ...>` map (Task 3), change:

```jsx
                  <article key={article.id || index} className="group block border-b border-border-light dark:border-border-dark pb-8">
```

to:

```jsx
                  <article
                    key={article.id || index}
                    onClick={() => setSelectedArticle(article)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setSelectedArticle(article)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className="group block cursor-pointer border-b border-border-light dark:border-border-dark pb-8"
                  >
```

- [ ] **Step 3: Make sidebar items clickable**

In the sidebar, replace the `<a key={item.id || index} href="#" className="group">` wrapper with:

```jsx
                    <button
                      key={item.id || index}
                      type="button"
                      onClick={() => setSelectedArticle(item)}
                      className="group w-full text-left"
                    >
```

and close it with `</button>` instead of `</a>`.

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: `vite build` succeeds.

- [ ] **Step 5: Verify dev server behavior**

Run: `npm run dev` (background). Open `http://localhost:3000/category/kinh-te`.
Expected: clicking any article card opens the popup (image/category/source/date/description + "Đọc thêm"); Enter/Space also opens on a focused card; clicking a sidebar "Latest News" item opens the same popup; backdrop click and "Đóng" close it. Kill dev server.

- [ ] **Step 6: Commit**

```bash
git add src/components/CategoryPage.jsx
git commit -m "feat: open article popups from category cards and latest-news sidebar"
```

---

### Task 5: Final acceptance + whole-branch review

**Files:**
- None (verification task).

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: `vite build` succeeds with no warnings that break the page.

- [ ] **Step 2: Dev server smoke test across routes**

Run: `npm run dev` (background).
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` → 200
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/category/kinh-te` → 200
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/category/xe` → 200
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/category/khong-ton-tai` → 200 (unknown-slug screen, not a crash)
- Manual: homepage loads and renders; category page shows 20 items + popup + scroll-to-load; header scrolls; theme dropdown works; no console errors in dev tools. Kill dev server.

- [ ] **Step 3: Whole-branch review**

Request a fresh reviewer to review the entire branch diff (from the plan's baseline commit `60d7a92`..`HEAD` for the theme/header/category work) against the spec, focusing on the Review Focus list above.

- [ ] **Step 4: Address review findings**

Fix any Critical/Important findings raised; verify again with `npm run build` + the Task 5 smoke tests; commit fixes.

- [ ] **Step 5: Record final verdict**

Add a short verdict note (pass with/without findings) to the SDD progress ledger, then report the final result to the user.