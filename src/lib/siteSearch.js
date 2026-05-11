/**
 * Client-side search over bundled festival data (artists + PorchFest events).
 * @param {string} query
 * @param {{ artists?: unknown[], porchfest?: { events?: unknown[] } }} data
 */
export function searchSite(query, data) {
  const q = String(query || "").trim().toLowerCase()
  if (!q) {
    return { artists: [], events: [] }
  }

  const artistResults = (data.artists || []).filter((artist) => {
    const nameMatch = artist.name.toLowerCase().includes(q)
    const locationMatch = artist.location?.toLowerCase().includes(q) ?? false
    const bioMatch = artist.bio?.toLowerCase().includes(q)
    return nameMatch || locationMatch || bioMatch
  })

  const events = data.porchfest?.events || []
  const eventResults = events.filter((event) => {
    const nameMatch = event.name.toLowerCase().includes(q)
    const locationMatch =
      event.location?.city?.toLowerCase().includes(q) ||
      event.location?.state?.toLowerCase().includes(q)
    const descMatch = event.description?.toLowerCase().includes(q)
    return nameMatch || locationMatch || descMatch
  })

  return { artists: artistResults, events: eventResults }
}
