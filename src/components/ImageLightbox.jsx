import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import './ImageLightbox.css'

/**
 * Full-screen preview. Two modes:
 * - Single `src` (used by SmartImage with enableZoom).
 * - Gallery: `urls` + `index` + `onIndexChange` for vault / multi-image.
 * URLs should be full-quality (e.g. from getSmartImageLightboxSrc).
 */
export default function ImageLightbox({
  open,
  onClose,
  src,
  alt = '',
  urls,
  index = 0,
  onIndexChange,
  title = 'Image preview',
}) {
  const titleId = useId()
  const closeRef = useRef(null)

  const list = Array.isArray(urls) && urls.length > 0 ? urls : null
  const lastIndex = list ? list.length - 1 : 0
  const safeIndex = list
    ? Math.min(Math.max(0, index), lastIndex)
    : 0
  const resolvedSrc = list ? list[safeIndex] : src
  const canNav = Boolean(list && list.length > 1)

  useEffect(() => {
    if (!open) return undefined

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (!canNav || !onIndexChange) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onIndexChange(safeIndex === 0 ? lastIndex : safeIndex - 1)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        onIndexChange(safeIndex === lastIndex ? 0 : safeIndex + 1)
      }
    }

    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose, canNav, onIndexChange, safeIndex, lastIndex])

  useEffect(() => {
    if (!open) return undefined
    const id = requestAnimationFrame(() => closeRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [open, safeIndex, resolvedSrc])

  if (!open || !resolvedSrc) return null

  const node = (
    <div
      className="image-lightbox-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div
        className="image-lightbox-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <p id={titleId} className="image-lightbox-sr-only">
          {title}
        </p>
        <button
          ref={closeRef}
          type="button"
          className="image-lightbox-close"
          onClick={onClose}
          aria-label="Close preview"
        >
          ×
        </button>
        {canNav ? (
          <>
            <button
              type="button"
              className="image-lightbox-nav image-lightbox-nav--prev"
              onClick={() =>
                onIndexChange?.(safeIndex === 0 ? lastIndex : safeIndex - 1)
              }
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              className="image-lightbox-nav image-lightbox-nav--next"
              onClick={() =>
                onIndexChange?.(safeIndex === lastIndex ? 0 : safeIndex + 1)
              }
              aria-label="Next image"
            >
              ›
            </button>
          </>
        ) : null}
        <img
          key={resolvedSrc}
          className="image-lightbox-img"
          src={resolvedSrc}
          alt={alt}
          decoding="async"
          fetchPriority="high"
        />
      </div>
    </div>
  )

  return createPortal(node, document.body)
}
