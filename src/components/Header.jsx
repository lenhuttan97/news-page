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