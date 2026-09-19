# News Page — Modern React News Application

A sleek, lightning-fast, and responsive daily news application built with **React**, **Vite**, **Tailwind CSS**, **Redux Toolkit**, and **React Router**. It provides curated feeds and live RSS updates across various categories including Technology, Business, Sports, and Lifestyle.

---

## 🚀 Features

- **Rich News Feed**: Explore featured articles, top breaking news, editorial picks, and longform reads.
- **Category Browsing**: Dedicated category pages and filters for Technology, Business, Sports, Lifestyle, and more with paginated or infinite scroll experiences.
- **Live RSS Integration**: Seamlessly fetches and parses RSS feeds via local proxy middleware (`/api/rss`).
- **Interactive Modals & Article Details**: Read full articles in immersive detail pages or pop-up news modals.
- **Dark / Light Mode**: Fully supports theme switching utilizing Tailwind CSS classes.
- **Robust UI/UX**: Includes loading skeleton states, error boundaries, back-to-top navigation, and responsive mobile-first layouts.
- **State Management**: Powered by Redux Toolkit for efficient global state handling (news and theme slices).

---

## 🛠️ Tech Stack

- **Framework**: React 18.2
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3.4 & PostCSS
- **State Management**: Redux Toolkit & React-Redux
- **Routing**: React Router DOM v7
- **Deployment**: Vercel ready (`vercel.json`)

---

## 📁 Project Structure

```text
news-page/
├── api/                  # Serverless / API proxy endpoints (e.g. RSS proxy)
├── src/
│   ├── components/       # Reusable UI components (Header, Hero, NewsCard, Modals, etc.)
│   ├── data/             # Static data sources & RSS configurations
│   ├── hooks/            # Custom React hooks (e.g. useLoadingTimer)
│   ├── store/            # Redux store & slices (newsSlice, themeSlice)
│   ├── styles/           # Global styles and Tailwind directives (main.css)
│   ├── App.jsx           # Main application root component
│   ├── main.jsx          # Application entry point
│   └── router.jsx        # Route definitions
├── public/               # Static assets
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.js        # Vite build configuration
└── package.json          # Project dependencies & scripts
```

---

## ⚙️ Getting Started

### Prerequisites

Ensure you have **Node.js 18+** installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lenhuttan97/news-page.git
   cd news-page
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## 🚀 Running the Application

### Development Server
Start the local development server with Vite:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or the port specified in your terminal) to view it in your browser.

### Production Build
Build the application for production:
```bash
npm run build
```

### Preview Production Build
Preview the production build locally:
```bash
npm run preview
```

---

## 🚢 Deployment

This project is configured for deployment on modern static hosting platforms like **Vercel** or **Netlify**.

- **Vercel**: Simply link your GitHub repository to Vercel. The included `vercel.json` ensures smooth routing and serverless function routing for RSS feeds.
- **Manual Build**: Run `npm run build` and deploy the `dist/` directory to your hosting provider of choice.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
