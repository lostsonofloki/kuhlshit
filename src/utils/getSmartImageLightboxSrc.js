/**
 * URL used when opening a full-size view of a SmartImage.
 * Matches the largest WebP the optimizer emits (same as the 1400w srcSet entry
 * in SmartImage); remote URLs and non-local assets pass through unchanged.
 */
const RASTER_RE = /\.(jpe?g|png)(\?.*)?$/i

export function getSmartImageLightboxSrc(src) {
  if (!src || typeof src !== 'string') return null

  if (/^https?:\/\//i.test(src)) return src

  const isLocalRaster = RASTER_RE.test(src)
  if (!isLocalRaster) return src

  const basePath = src.replace(RASTER_RE, '')
  const query = src.match(RASTER_RE)?.[2] || ''
  return `${basePath}.webp${query}`
}
