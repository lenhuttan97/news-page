import React, { useRef, useState } from 'react'

const SWIPE_PX = 40

// Article photo slideshow: whole photo visible (no crop), caption under it like
// a print caption, thumbnails to jump. Arrow keys work when it has focus.
function ImageCarousel({ images, title }) {
  const [index, setIndex] = useState(0)
  const pointerX = useRef(null)
  const thumbsRef = useRef(null)
  const count = images.length
  const current = images[index]

  const go = (next) => {
    const target = (next + count) % count
    setIndex(target)
    thumbsRef.current?.children[target]?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }

  const onKeyDown = (event) => {
    if (event.key === 'ArrowLeft') go(index - 1)
    else if (event.key === 'ArrowRight') go(index + 1)
    else return
    event.preventDefault()
  }

  const onPointerUp = (event) => {
    if (pointerX.current === null) return
    const delta = event.clientX - pointerX.current
    pointerX.current = null
    if (Math.abs(delta) > SWIPE_PX) go(delta < 0 ? index + 1 : index - 1)
  }

  const arrow =
    'absolute top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary cursor-pointer'

  return (
    <section
      aria-roledescription="carousel"
      aria-label={`Ảnh trong bài: ${title}`}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="mb-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary rounded-t-xl"
    >
      <div
        className="relative aspect-[16/10] w-full overflow-hidden rounded-t-xl bg-background-dark select-none touch-pan-y"
        onPointerDown={(event) => {
          pointerX.current = event.clientX
        }}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          pointerX.current = null
        }}
      >
        <img
          key={current.url}
          src={current.url}
          alt={current.alt || current.caption || title}
          loading="eager"
          decoding="async"
          draggable={false}
          className="h-full w-full object-contain carousel-fade"
        />
        {count > 1 && (
          <>
            <button type="button" onClick={() => go(index - 1)} className={`${arrow} left-3`} aria-label="Ảnh trước">
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button type="button" onClick={() => go(index + 1)} className={`${arrow} right-3`} aria-label="Ảnh sau">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
            <p
              aria-live="polite"
              className="absolute bottom-3 right-3 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium tabular-nums text-white backdrop-blur-sm"
            >
              {index + 1} / {count}
            </p>
          </>
        )}
      </div>

      {current.caption && (
        <p className="px-6 pt-3 font-serif text-sm italic leading-snug text-text-muted-light dark:text-text-muted-dark">
          {current.caption}
        </p>
      )}

      {count > 1 && (
        <div ref={thumbsRef} className="flex gap-2 overflow-x-auto px-6 pt-3 pb-2 themed-scrollbar">
          {images.map((image, i) => (
            <button
              key={image.url}
              type="button"
              onClick={() => go(i)}
              aria-label={`Xem ảnh ${i + 1}`}
              aria-current={i === index}
              className={`h-14 w-20 shrink-0 overflow-hidden rounded-md transition cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                i === index ? 'ring-2 ring-primary ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img src={image.url} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

export default ImageCarousel
