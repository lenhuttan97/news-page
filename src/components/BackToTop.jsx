import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => {
      if (window.scrollY > 150) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  if (!mounted || !visible) return null

  return ReactDOM.createPortal(
    <button
      onClick={scrollToTop}
      aria-label="Cuộn lên đầu trang"
      className="fixed bottom-6 right-6 z-[99999] flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-accent text-white shadow-2xl hover:bg-accent/90 focus:outline-none transition-all duration-300"
    >
      <span className="material-symbols-outlined text-2xl font-bold">arrow_upward</span>
    </button>,
    document.body
  )
}
