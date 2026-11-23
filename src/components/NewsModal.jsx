import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { NEWS_CATEGORIES } from '../data/rssData'
import { fetchStoryDetail, toParagraphs } from '../data/supabaseData'
import { imageProxyUrl } from '../data/imageProxy'
import ImageCarousel from './ImageCarousel'

function getCategoryLabel(id) {
  const found = NEWS_CATEGORIES.find((cat) => cat.id === id)
  return found ? found.label : id
}

// Same image with different resize params (?w=…) counts as a duplicate.
const imageKey = (url) => (url || '').split('?')[0]

// Lead image first (with its caption if the story has one), then the rest, deduped.
function buildSlides(leadImage, images = []) {
  const seen = new Set()
  const slides = []
  const add = (image) => {
    const key = imageKey(image?.url)
    if (!key || seen.has(key)) return
    seen.add(key)
    slides.push(image)
  }
  if (leadImage) add(images.find((image) => imageKey(image?.url) === imageKey(leadImage)) || { url: leadImage })
  images.forEach(add)
  return slides
}

// Supabase stories carry full text + images; load them when the dialog opens.
function useStoryDetail(storyId) {
  const [detail, setDetail] = useState({ status: 'idle', storyId: null })
  useEffect(() => {
    if (!storyId) return undefined
    const controller = new AbortController()
    fetchStoryDetail(storyId, controller.signal).then(
      (data) => setDetail({ status: 'ok', storyId, data }),
      (error) => {
        if (!controller.signal.aborted) setDetail({ status: 'error', storyId, message: error.message })
      },
    )
    return () => controller.abort()
  }, [storyId])
  // Derived during render: a result for another story never shows, even for one frame.
  if (!storyId) return { status: 'idle' }
  return detail.storyId === storyId ? detail : { status: 'loading' }
}

function StoryBody({ detail }) {
  if (detail.status === 'loading') {
    return (
      <div role="status" className="mb-6 space-y-2 animate-pulse">
        <span className="sr-only">Đang tải nội dung bài</span>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-3 rounded bg-gray-200 dark:bg-white/10" />
        ))}
      </div>
    )
  }
  if (detail.status === 'error') {
    return (
      <p role="alert" className="mb-6 text-sm text-red-600 dark:text-red-400">
        {detail.message}
      </p>
    )
  }
  if (detail.status !== 'ok') return null

  const { text, word_count: wordCount } = detail.data
  // Crawled bylines sometimes hold profile links: show names only.
  const authors = (detail.data.authors || []).filter((name) => !/^https?:\/\//i.test(name))

  return (
    <div className="mb-6">
      <p className="mb-4 text-xs text-text-muted-light dark:text-text-muted-dark">
        {[authors.length > 0 && `Tác giả: ${authors.join(', ')}`, Number.isFinite(wordCount) && `${wordCount} từ`]
          .filter(Boolean)
          .join(' • ')}
      </p>
      <div className="space-y-4 text-base leading-relaxed text-text-light dark:text-text-dark">
        {toParagraphs(text).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  )
}

function NewsModal({ news, onClose }) {
  const [mounted, setMounted] = useState(false)
  const detail = useStoryDetail(news?.supabaseId)
  const slides = detail.status === 'ok' ? buildSlides(news?.image, detail.data.images) : []

  useEffect(() => {
    setMounted(true)
    if (news) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [news])

  if (!mounted || !news) return null

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-modalFadeIn"
      onClick={onClose}
    >
      <div
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-xl shadow-2xl bg-background-light dark:bg-background-dark animate-modalScaleIn"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Outside the scroll area so it stays put while reading */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary cursor-pointer"
          aria-label="Đóng modal"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="max-h-[85vh] overflow-y-auto overscroll-contain themed-scrollbar">
          {slides.length > 1 ? (
            <ImageCarousel key={news.id} images={slides} title={news.title} />
          ) : news.image && (
            <img
              src={imageProxyUrl(news.image)}
              alt={news.title}
              className="mb-6 h-64 w-full rounded-t-xl object-cover"
            />
          )}

          <div className="p-6">
            <span className="mb-3 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
              {getCategoryLabel(news.category)}
            </span>

            <h2 className="mb-2 text-2xl font-bold font-serif text-text-light dark:text-text-dark">{news.title}</h2>

            <div className="mb-4 flex flex-col gap-3 text-sm text-text-muted-light dark:text-text-muted-dark sm:flex-row">
              <span>Nguồn: {news.source}</span>
              <span>•</span>
              <span>{news.pubDate ? new Date(news.pubDate).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'Không có ngày đăng'}</span>
            </div>

            <p className="mb-6 text-base leading-relaxed text-text-light dark:text-text-dark">
              {news.description || 'Chưa có mô tả.'}
            </p>

            <StoryBody detail={detail} />

            <div className="flex items-center justify-between gap-4 border-t border-border-light pt-4 dark:border-border-dark">
              <button
                onClick={onClose}
                className="font-medium text-sm text-accent transition-colors duration-200 hover:text-accent/80 cursor-pointer"
              >
                Đóng
              </button>
              <a
                href={news.link || news.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-white transition-colors duration-200 hover:bg-primary/90"
              >
                Đọc thêm
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default NewsModal
