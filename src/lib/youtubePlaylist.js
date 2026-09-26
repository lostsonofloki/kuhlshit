const UNAVAILABLE_TITLES = new Set(['deleted video', 'private video'])

function thumbnailUrl(snippet) {
  const thumbs = snippet?.thumbnails
  return thumbs?.high?.url || thumbs?.medium?.url || thumbs?.default?.url || ''
}

/** Playlist rows YouTube keeps after a video is removed or made private. */
export function isUnavailablePlaylistItem(item) {
  const snippet = item?.snippet
  const videoId = snippet?.resourceId?.videoId
  if (typeof videoId !== 'string' || !videoId) return true
  const title = typeof snippet.title === 'string' ? snippet.title.trim().toLowerCase() : ''
  if (UNAVAILABLE_TITLES.has(title)) return true
  if (!thumbnailUrl(snippet)) return true
  return false
}

/**
 * Drop unavailable rows and repeat video ids (playlists sometimes list the same upload twice).
 * @param {unknown[]} items
 */
export function mapPlaylistItemsToVideos(items) {
  const seen = new Set()
  const out = []
  for (const item of items || []) {
    if (isUnavailablePlaylistItem(item)) continue
    const snippet = item.snippet
    const videoId = snippet.resourceId.videoId
    if (seen.has(videoId)) continue
    seen.add(videoId)
    out.push({
      id: videoId,
      videoId,
      title: typeof snippet.title === 'string' ? snippet.title : '',
      description: typeof snippet.description === 'string' ? snippet.description : '',
      thumbnail: thumbnailUrl(snippet),
      publishedAt: snippet.publishedAt,
    })
  }
  return out
}
