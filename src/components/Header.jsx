import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { NEWS_CATEGORIES } from '../data/rssData.js'
import { setMode, selectThemeMode, selectThemeResolved } from '../store/themeSlice'
import { setDataSource, selectDataSource, setMixSources, selectMixSources } from '../store/settingsSlice'
import { fetchNews } from '../store'

const THEME_OPTIONS = [
  { value: 'light', label: 'Sáng', icon: 'light_mode' },
  { value: 'dark', label: 'Tối', icon: 'dark_mode' },
  { value: 'system', label: 'Theo hệ thống', icon: 'brightness_auto' },
]

const SOURCE_OPTIONS = [
  { value: 'rss', label: 'RSS trực tiếp', short: 'RSS', icon: 'rss_feed' },
  { value: 'supabase', label: 'Tafu Hub', short: 'Tafu Hub', icon: 'database' },
]

const PROMINENT_CATEGORY_IDS = ['tin-tuc', 'giao-duc', 'the-thao', 'kinh-te', 'suc-khoe', 'doi-song']

function Header() {
  const dispatch = useDispatch()
  const location = useLocation()
  const mode = useSelector(selectThemeMode)
  const resolved = useSelector(selectThemeResolved)
  const dataSource = useSelector(selectDataSource)
  const mix = useSelector(selectMixSources)
  
  const [themeOpen, setThemeOpen] = useState(false)
  const [sourceOpen, setSourceOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false)

  const themeRef = useRef(null)
  const sourceRef = useRef(null)
  const moreRef = useRef(null)
  const mobileRef = useRef(null)
  const mobileSettingsRef = useRef(null)

  // Scroll to top on route change & close menus
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setMobileMenuOpen(false)
    setMobileSettingsOpen(false)
    setMoreOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onPointerDown = (event) => {
      if (themeRef.current && !themeRef.current.contains(event.target)) {
        setThemeOpen(false)
      }
      if (sourceRef.current && !sourceRef.current.contains(event.target)) {
        setSourceOpen(false)
      }
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setMoreOpen(false)
      }
      if (mobileRef.current && !mobileRef.current.contains(event.target)) {
        setMobileMenuOpen(false)
      }
      if (mobileSettingsRef.current && !mobileSettingsRef.current.contains(event.target)) {
        setMobileSettingsOpen(false)
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
          <Link
            to="/"
            aria-label="Tafu Hub - Trang chủ"
            onClick={() => {
              if (location.pathname === '/') dispatch(fetchNews({ offset: 0, limit: 50 }))
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="flex shrink-0 items-center gap-2.5 text-xl font-bold font-serif text-text-light dark:text-text-dark group animate-pageFadeInUp stagger-1 sm:text-2xl"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-md transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105 sm:h-10 sm:w-10">
              <span className="material-symbols-outlined text-[22px]">newspaper</span>
            </div>
            <span className="hidden bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent transition-opacity group-hover:opacity-90 sm:inline">
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
                <div className="absolute left-0 top-full mt-2 w-56 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2 shadow-lg z-50">
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
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            {/* Mobile Navigation Dropdown */}
            <div className="relative md:hidden" ref={mobileRef}>
              <button
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="flex max-w-[42vw] items-center gap-1.5 rounded-lg border border-border-light bg-black/5 px-3 py-2 text-sm font-medium text-text-light dark:border-border-dark dark:bg-white/5 dark:text-text-dark"
              >
                <span className="truncate">{mobileButtonLabel}</span>
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

            {/* Mobile settings combines data source, mixing, and theme controls. */}
            <div className="relative md:hidden" ref={mobileSettingsRef}>
              <button
                type="button"
                onClick={() => setMobileSettingsOpen((open) => !open)}
                className="flex h-10 items-center gap-1.5 rounded-lg border border-border-light px-2.5 text-sm font-medium text-text-light hover:bg-black/5 dark:border-border-dark dark:text-text-dark dark:hover:bg-white/10"
                aria-label="Cài đặt nguồn tin và giao diện"
                aria-expanded={mobileSettingsOpen}
                aria-controls="mobile-settings-popover"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[20px]">tune</span>
                <span className="hidden min-[390px]:inline">Cài đặt</span>
              </button>
              {mobileSettingsOpen && (
                <div id="mobile-settings-popover" aria-label="Cài đặt nguồn tin và giao diện" className="absolute right-0 top-full z-50 mt-2 max-h-[75vh] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-border-light bg-background-light p-3 shadow-xl animate-fadeIn dark:border-border-dark dark:bg-background-dark">
                  <section aria-labelledby="mobile-source-heading">
                    <h2 id="mobile-source-heading" className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">
                      Nguồn dữ liệu
                    </h2>
                    {SOURCE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={dataSource === option.value}
                        onClick={() => {
                          if (dataSource !== option.value) dispatch(setDataSource(option.value))
                        }}
                        className="flex min-h-11 w-full items-center gap-3 rounded-lg px-2 text-left text-sm text-text-light hover:bg-black/5 dark:text-text-dark dark:hover:bg-white/10"
                      >
                        <span className="material-symbols-outlined text-lg">{option.icon}</span>
                        <span>{option.label}</span>
                        <span className="material-symbols-outlined ml-auto text-lg text-accent" aria-hidden="true">
                          {dataSource === option.value ? 'radio_button_checked' : 'radio_button_unchecked'}
                        </span>
                      </button>
                    ))}
                  </section>

                  <div className="my-3 border-t border-border-light dark:border-border-dark" />

                  <button
                    type="button"
                    aria-pressed={mix}
                    onClick={() => dispatch(setMixSources(!mix))}
                    className="flex min-h-11 w-full items-center gap-3 rounded-lg px-2 text-left text-sm text-text-light hover:bg-black/5 dark:text-text-dark dark:hover:bg-white/10"
                  >
                    <span className="material-symbols-outlined text-lg">shuffle</span>
                    <span className="flex-1">Trộn nguồn tin</span>
                    <span className="material-symbols-outlined text-lg text-accent" aria-hidden="true">
                      {mix ? 'toggle_on' : 'toggle_off'}
                    </span>
                  </button>

                  <div className="my-3 border-t border-border-light dark:border-border-dark" />

                  <section aria-labelledby="mobile-theme-heading">
                    <h2 id="mobile-theme-heading" className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">
                      Giao diện
                    </h2>
                    {THEME_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={mode === option.value}
                        onClick={() => dispatch(setMode(option.value))}
                        className="flex min-h-11 w-full items-center gap-3 rounded-lg px-2 text-left text-sm text-text-light hover:bg-black/5 dark:text-text-dark dark:hover:bg-white/10"
                      >
                        <span className="material-symbols-outlined text-lg">{option.icon}</span>
                        <span>{option.label}</span>
                        <span className="material-symbols-outlined ml-auto text-lg text-accent" aria-hidden="true">
                          {mode === option.value ? 'radio_button_checked' : 'radio_button_unchecked'}
                        </span>
                      </button>
                    ))}
                  </section>
                </div>
              )}
            </div>

            {/* Data Source Toggle (saved in localStorage) */}
            <div className="relative hidden md:block" ref={sourceRef}>
              <button
                onClick={() => setSourceOpen((open) => !open)}
                className="flex h-10 cursor-pointer items-center gap-1.5 rounded-full px-2.5 text-text-muted-light dark:text-text-muted-dark hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                title="Cài đặt: nguồn dữ liệu"
                aria-label="Nguồn dữ liệu"
                aria-haspopup="menu"
                aria-expanded={sourceOpen}
              >
                <span className="material-symbols-outlined">settings</span>
                <span className="hidden sm:inline text-xs font-semibold">
                  {SOURCE_OPTIONS.find((option) => option.value === dataSource)?.short}
                </span>
              </button>
              {sourceOpen && (
                <div role="menu" aria-label="Nguồn dữ liệu" className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2 shadow-lg animate-fadeIn z-50">
                  <p className="px-3 pt-1 pb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">
                    Nguồn dữ liệu
                  </p>
                  {SOURCE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      role="menuitemradio"
                      aria-checked={dataSource === option.value}
                      onClick={() => {
                        if (dataSource !== option.value) dispatch(setDataSource(option.value))
                        setSourceOpen(false)
                      }}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-text-light dark:text-text-dark hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">{option.icon}</span>
                      {option.label}
                      <span className="ml-auto material-symbols-outlined text-[18px] text-accent">
                        {dataSource === option.value ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                    </button>
                  ))}
                  <div className="my-2 border-t border-border-light dark:border-border-dark" />
                  <button
                    role="menuitemcheckbox"
                    aria-checked={mix}
                    onClick={() => dispatch(setMixSources(!mix))}
                    className="flex w-full cursor-pointer items-start gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-text-light dark:text-text-dark hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">shuffle</span>
                    <span className="flex-1">
                      Trộn nguồn tin
                      <span className="block text-xs font-normal text-text-muted-light dark:text-text-muted-dark">
                        Không để quá 2 bài cùng báo liền nhau
                      </span>
                    </span>
                    <span className="material-symbols-outlined text-[18px] text-accent">
                      {mix ? 'toggle_on' : 'toggle_off'}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <div className="relative hidden md:block" ref={themeRef}>
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
