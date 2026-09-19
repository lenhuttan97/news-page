import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { NEWS_CATEGORIES } from '../data/rssData.js'
import { setMode, selectThemeMode, selectThemeResolved } from '../store/themeSlice'

const THEME_OPTIONS = [
  { value: 'light', label: 'Sáng', icon: 'light_mode' },
  { value: 'dark', label: 'Tối', icon: 'dark_mode' },
  { value: 'system', label: 'Theo hệ thống', icon: 'brightness_auto' },
]

const PROMINENT_CATEGORY_IDS = ['tin-tuc', 'giao-duc', 'the-thao', 'kinh-te', 'suc-khoe', 'doi-song']

function Header() {
  const dispatch = useDispatch()
  const location = useLocation()
  const mode = useSelector(selectThemeMode)
  const resolved = useSelector(selectThemeResolved)
  
  const [themeOpen, setThemeOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const themeRef = useRef(null)
  const moreRef = useRef(null)
  const mobileRef = useRef(null)

  // Scroll to top on route change & close menus
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setMobileMenuOpen(false)
    setMoreOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onPointerDown = (event) => {
      if (themeRef.current && !themeRef.current.contains(event.target)) {
        setThemeOpen(false)
      }
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setMoreOpen(false)
      }
      if (mobileRef.current && !mobileRef.current.contains(event.target)) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  const prominentCategories = NEWS_CATEGORIES.filter((cat) => PROMINENT_CATEGORY_IDS.includes(cat.id))
  const otherCategories = NEWS_CATEGORIES.filter((cat) => cat.id !== 'all' && !PROMINENT_CATEGORY_IDS.includes(cat.id))

  const currentSlug = location.pathname.startsWith('/category/') ? location.pathname.replace('/category/', '') : ''
  const currentCatObj = NEWS_CATEGORIES.find((cat) => cat.id === currentSlug)
  const mobileButtonLabel = currentCatObj ? currentCatObj.label : 'Trang chủ'

  return (
    <header className="bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark sticky top-0 z-40">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Left: Logo */}
          <Link className="shrink-0 flex items-center gap-2.5 text-2xl font-bold font-serif text-text-light dark:text-text-dark group" to="/">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-md group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">newspaper</span>
            </div>
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              Tafu Hub
            </span>
          </Link>

          {/* Center: Categories Navigation (Centered) */}
          <nav className="hidden md:flex items-center justify-center gap-6 lg:gap-8 flex-1 mx-6">
            {prominentCategories.map((cat) => (
              <Link
                key={cat.id}
                className={`text-sm font-medium transition-colors link-underline whitespace-nowrap ${
                  currentSlug === cat.id
                    ? 'text-accent font-semibold'
                    : 'text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark'
                }`}
                to={`/category/${cat.id}`}
              >
                {cat.label}
              </Link>
            ))}

            {/* More / Dropdown Categories */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen((open) => !open)}
                className="flex items-center gap-1 text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors cursor-pointer"
                aria-expanded={moreOpen}
              >
                Khác
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </button>
              {moreOpen && (
                <div className="absolute left-0 top-full mt-2 w-56 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2 shadow-lg animate-fadeIn z-50">
                  {otherCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.id}`}
                      onClick={() => setMoreOpen(false)}
                      className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                        currentSlug === cat.id
                          ? 'bg-accent/10 text-accent font-semibold'
                          : 'text-text-light dark:text-text-dark hover:bg-black/5 dark:hover:bg-white/10'
                      }`}
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right: Mobile & Theme Toggles */}
          <div className="flex items-center gap-3">
            {/* Mobile Navigation Dropdown */}
            <div className="relative md:hidden" ref={mobileRef}>
              <button
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg border border-border-light dark:border-border-dark text-text-light dark:text-text-dark bg-black/5 dark:bg-white/5"
              >
                <span>{mobileButtonLabel}</span>
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </button>
              {mobileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2 shadow-lg animate-fadeIn z-50 max-h-[70vh] overflow-y-auto">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                      !currentSlug ? 'bg-accent/10 text-accent font-semibold' : 'text-text-light dark:text-text-dark hover:bg-black/5 dark:hover:bg-white/10'
                    }`}
                  >
                    Trang chủ
                  </Link>
                  {NEWS_CATEGORIES.filter(cat => cat.id !== 'all').map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.id}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                        currentSlug === cat.id ? 'bg-accent/10 text-accent font-semibold' : 'text-text-light dark:text-text-dark hover:bg-black/5 dark:hover:bg-white/10'
                      }`}
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <div className="relative" ref={themeRef}>
              <button
                onClick={() => setThemeOpen((open) => !open)}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-text-muted-light dark:text-text-muted-dark hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                title="Chọn giao diện"
                aria-haspopup="menu"
                aria-expanded={themeOpen}
              >
                {resolved === 'dark' ? (
                  <span className="material-symbols-outlined">dark_mode</span>
                ) : (
                  <span className="material-symbols-outlined">light_mode</span>
                )}
              </button>
              {themeOpen && (
                <div role="menu" className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2 shadow-lg animate-fadeIn z-50">
                  {THEME_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      role="menuitemradio"
                      aria-checked={mode === option.value}
                      onClick={() => {
                        dispatch(setMode(option.value))
                        setThemeOpen(false)
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
      </div>
    </header>
  )
}

export default Header
