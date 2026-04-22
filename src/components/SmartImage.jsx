import { forwardRef } from 'react'

/**
 * <SmartImage> renders a <picture> with a .webp source when the `src` points
 * at a raster image under /resources. Falls back to a plain <img> for SVGs,
 * remote URLs, or already-webp paths.
 *
 * All public/resources/*.(jpg|jpeg|png) have a sibling .webp created by
 * scripts/optimize-images.mjs, so this pairing is always safe for local assets.
 *
 * Defaults: loading="lazy", decoding="async" (override via props for LCP imgs).
 */
const RASTER_RE = /\.(jpe?g|png)(\?.*)?$/i

const SmartImage = forwardRef(function SmartImage(
  { src, alt = '', loading = 'lazy', decoding = 'async', fetchPriority, ...rest },
  ref,
) {
  if (!src) return null

  const useWebp =
    RASTER_RE.test(src) &&
    // Only swap local assets — remote URLs have no sibling webp.
    !/^https?:\/\//i.test(src)

  const commonImgProps = {
    src,
    alt,
    loading,
    decoding,
    ...(fetchPriority ? { fetchpriority: fetchPriority } : {}),
    ...rest,
    ref,
  }

  if (!useWebp) {
    return <img {...commonImgProps} />
  }

  const webpSrc = src.replace(RASTER_RE, (_m, _ext, q = '') => `.webp${q || ''}`)

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img {...commonImgProps} />
    </picture>
  )
})

export default SmartImage
