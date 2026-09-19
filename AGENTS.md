# AGENTS.md

## Project Overview
- **Name**: news-page
- **Type**: React news application (Vue/Vite)
- **Tech Stack**: React 18.2, Vite, TypeScript, Redux Toolkit, React Router, Tailwind CSS
- **Purpose**: Daily news feed showing technology, business, sports, and lifestyle articles

## Entry Points & Commands

### Development
```bash
# Start development server
cd news-page
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```

### Testing
```bash
# Run tests (if any)
npm test
```

### Deployment
```bash
# Build and deploy (requires CI/CD configuration)
npm run build
```

## Architecture

### Core Components
- **App.jsx** - Main application container
- **main.jsx** - Entry point rendering the app
- **src/store/** - Redux state management (newsSlice.js)
- **src/components/** - Reusable UI components (ArticleDetailPage, CategoryFilter, etc.)
- **src/data/** - Data sources (newsData.js, rssData.js)
- **src/styles/** - Global styles (main.css)

### State Management
- Uses **Redux Toolkit** for global state (newsSlice.js)
- Article data fetched from local JSON files or RSS API
- Dark mode implemented via Tailwind CSS classes

### Routing
- **React Router DOM** v7 for navigation
- Pages: Home, LatestNewsSidebar, FeaturedArticles, Category pages, EditorPicks, Hero, Footer

## Key Conventions

### File Structure
- `src/` - Source code
  - `components/` - React components
  - `data/` - Data modules
  - `store/` - Redux slices and store setup
  - `styles/` - CSS/Tailwind configurations
  - `main.jsx` - Application entry point
  - `index.css` - Global styles
- `public/` - Static assets (currently minimal)
- `dist/` - Build output

### Naming & Patterns
- Component files: `{prefix}.jsx` (e.g., `ArticleDetailPage.jsx`)
- Slug-based identifiers in routes (e.g., category slugs)
- Tailwind color palette: primary (#0f66bd), accent (#9A7B4F), background-light (#F9F9F9), background-dark (#101922)
- Fonts: Inter (body), Playfair Display (featured), Work Sans (headings)

### Build Configuration
- **Vite** with `@vitejs/plugin-react`
- **Tailwind CSS** via `tailwind.config.js` with dark mode support
- PostCSS for CSS processing

## Common Workflows

1. **Development**
   ```bash
   cd news-page
   npm run dev
   # Visit http://localhost:3000
   ```

2. **Running Tests**
   ```bash
   npm test
   ```

3. **Building for Production**
   ```bash
   npm run build
   ```

4. **Preview Build**
   ```bash
   npm run preview
   ```

## Verification Rules

**IMPORTANT**: Before reporting any task as complete, you MUST:
1. Run `npm run build` and ensure it passes without errors
2. Run `npm run dev` and verify the page loads without:
   - Console errors (SyntaxError, ReferenceError, etc.)
   - White screen / blank page
   - Loading spinners that never disappear
   - Network errors (failed API calls)
3. Test the actual functionality works (navigation, data fetching, etc.)

## Troubleshooting

- **Hot Module Replacement**: Ensure `npm run dev` is used for live reload
- **Redux DevTools**: Enable in development for state debugging
- **Tailwind Classes**: Check that class names match `tailwind.config.js` definitions
- **RSS Feed**: The `rss-proxy` middleware handles external RSS feeds; ensure network connectivity

## Environment
- Node.js 18+ (for React 18)
- Tailwind CSS 3.x
- Vite 5.x
- React Router 7.x
- Redux Toolkit 2.x

## Notes
- The project uses a local RSS proxy (`/api/rss`) for fetching news
- All article data is loaded from `src/data/` modules
- No database layer - pure client-side state management
- Dark mode is implemented via Tailwind CSS `dark:` prefix
