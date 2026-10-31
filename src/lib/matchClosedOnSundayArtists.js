import { compactSearchText, normalizeSearchText } from '../utils/searchMatch.js'

const STOP = new Set(['and', 'the', 'a', 'an', 'with', 'w'])

/**
 * YouTube titles sometimes use a stage name the profile does not.
 * Phrases are matched as whole words after the same normalization as site search.
 */
const ALIASES_BY_ID = {
  haysop: ['jameson hubbard'],
  'honey-boy-and-boots': ['honeyboy and boots', 'honey boy and boots'],
  'fire-camino': ['firecamino'],
  'bb-palmer': ['bb palmer'],
}

function cleanTitle(title) {
  return typeof title === 'string' ? title.replace(/\u200b/g, '') : ''
}

function significantTokens(normalized) {
  return normalized.split(' ').filter((token) => token && !STOP.has(token) && token.length >= 3)
}

function containsPhrase(haystack, phrase) {
  if (!phrase) return false
  return ` ${haystack} `.includes(` ${phrase} `)
}

/**
 * Artists whose profile belongs on a Closed on Sundays upload.
 * Compares the YouTube title and description to profile names.
 * A stored video id, the profile name, or a known alias all count.
 * @param {unknown[]} artists
 * @param {{ title?: string, description?: string, videoId?: string }} video
 */
export function matchArtistsForClosedOnSundayVideo(artists, video) {
  const title = normalizeSearchText(cleanTitle(video?.title))
  const description = normalizeSearchText(cleanTitle(video?.description))
  const haystack = [title, description].filter(Boolean).join(' ')
  const titleCompact = compactSearchText(cleanTitle(video?.title))
  const descriptionCompact = compactSearchText(cleanTitle(video?.description))
  const videoId = typeof video?.videoId === 'string' ? video.videoId : ''
  const titleWords = new Set(title.split(' ').filter(Boolean))

  const matches = []
  for (const artist of artists || []) {
    if (!artist || typeof artist.id !== 'string' || typeof artist.name !== 'string') continue

    const storedHit =
      videoId &&
      Array.isArray(artist.videos) &&
      artist.videos.some((entry) => entry && entry.videoId === videoId)

    const nameNorm = normalizeSearchText(artist.name)
    const aliases = ALIASES_BY_ID[artist.id] || []
    const phrases = [nameNorm, ...aliases.map((alias) => normalizeSearchText(alias))].filter(Boolean)
    const phraseHit = phrases.some((phrase) => {
      if (containsPhrase(haystack, phrase)) return true
      const compact = compactSearchText(phrase)
      return compact.length >= 6 && (titleCompact.includes(compact) || descriptionCompact.includes(compact))
    })
    const tokens = significantTokens(nameNorm)
    const tokenHit = tokens.length >= 2 && tokens.every((token) => titleWords.has(token))

    if (!storedHit && !phraseHit && !tokenHit) continue

    let order = Number.POSITIVE_INFINITY
    for (const phrase of phrases) {
      const index = haystack.indexOf(phrase)
      if (index >= 0) order = Math.min(order, index)
    }
    for (const token of tokens) {
      const index = title.indexOf(token)
      if (index >= 0) order = Math.min(order, index)
    }
    matches.push({ artist, order })
  }

  matches.sort((a, b) => a.order - b.order || a.artist.name.localeCompare(b.artist.name))
  return matches.map((entry) => entry.artist)
}

/**
 * Profile chips for a Closed on Sundays video card.
 * @param {unknown[]} artists
 * @param {{ title?: string, videoId?: string }} video
 */
export function closedOnSundayProfileTags(artists, video) {
  return matchArtistsForClosedOnSundayVideo(artists, video).map((artist) => {
    const image = artist.imageUrl || artist.thumbnailUrl
    return {
      id: artist.id,
      name: artist.name,
      to: `/artists/${artist.id}`,
      image: typeof image === 'string' ? image : '',
    }
  })
}
