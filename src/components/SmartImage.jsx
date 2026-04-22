import { forwardRef } from 'react'

/**
 * <SmartImage> renders a <picture> with a .webp source (+ responsive srcset)
 * when the `src` points at a local raster image under /resources. Falls back
 * to a plain <img> for SVGs, remote URLs, or already-webp paths.
 *
 * scripts/optimize-images.mjs emits:
 *   foo/photo-1.jpg         (full-width fallback, resized + mozjpeg)
 *   foo/photo-1.webp        (full-width webp, up to MAX_WIDTH=1400)
 *   foo/photo-1@480.webp    (small variant for mobile cards)
 *   foo/photo-1@960.webp    (medium variant for tablet)
 *
 * Supply a `sizes` prop so the browser picks the smallest variant that fits
 * (e.g. "(max-width:640px) 160px, 320px" for a small thumbnail grid).
 *
 * Defaults: loading="lazy", decoding="async" (override for LCP images).
 */
const RASTER_RE = /\.(jpe?g|png)(\?.*)?$/i
const VARIANT_WIDTHS = [480, 960]

const SmartImage = forwardRef(function SmartImage(
  {
    src,
    alt = '',
    loading = 'lazy',
    decoding = 'async',
    fetchPriority,
    sizes,
    ...rest
  },
  ref,
) {
  if (!src) return null

  const isLocalRaster =
    RASTER_RE.test(src) && !/^https?:\/\//i.test(src)

  const commonImgProps = {
    src,
    alt,
    loading,
    decoding,
    ...(fetchPriority ? { fetchpriority: fetchPriority } : {}),
    ...rest,
    ref,
  }

  if (!isLocalRaster) {
    return <img {...commonImgProps} />
  }

  const basePath = src.replace(RASTER_RE, '')
  const query = (src.match(RASTER_RE)?.[2]) || ''
  const fullWebp = `${basePath}.webp${query}`

  // srcset: small + medium + full, each with their rendered width in px.
  // "1400w" is the upper cap from MAX_WIDTH in the optimizer.
  const srcSetParts = VARIANT_WIDTHS.map((w) => `${basePath}@${w}.webp${query} ${w}w`)
  srcSetParts.push(`${fullWebp} 1400w`)
  const srcSet = srcSetParts.join(', ')

  // Default sizes: matches the common "card in a grid" case. Callers can
  // override with a tighter hint.
  const resolvedSizes = sizes || '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px'

  return (
    <picture>
      <source srcSet={srcSet} sizes={resolvedSizes} type="image/webp" />
      <img {...commonImgProps} />
    </picture>
  )
})

export default SmartImage
