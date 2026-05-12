/** Hub rows in `data.json` → `porchfest.events` for the Closed on Sundays series (filmed for YouTube). */
const HUB_PREFIX = 'closed-on-sundays-'
const CHICAGO = 'America/Chicago'

/**
 * Today as YYYY-MM-DD in Chicago wall calendar (for comparing to `event.date`).
 */
export function getChicagoDateKey(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: CHICAGO,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)
  const y = parts.find((p) => p.type === 'year')?.value
  const m = parts.find((p) => p.type === 'month')?.value
  const d = parts.find((p) => p.type === 'day')?.value
  if (!y || !m || !d) return ''
  return `${y}-${m}-${d}`
}

export function isClosedOnSundayHubEvent(e) {
  return (
    e &&
    typeof e.id === 'string' &&
    e.id.startsWith(HUB_PREFIX) &&
    typeof e.date === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(e.date)
  )
}

/** @param {unknown[]} events */
export function getClosedOnSundayHubEvents(events) {
  if (!Array.isArray(events)) return []
  return events.filter(isClosedOnSundayHubEvent)
}

/**
 * Hub dates on or after “today” (Chicago). Sorted soonest first.
 * @param {unknown[]} events
 */
export function getUpcomingClosedOnSundayHubEventsSorted(events, now = new Date()) {
  const today = getChicagoDateKey(now)
  if (!today) return []
  return getClosedOnSundayHubEvents(events)
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Past hub dates (strictly before today, Chicago). Newest first.
 * @param {unknown[]} events
 */
export function getPastClosedOnSundayHubEventsSorted(events, now = new Date()) {
  const today = getChicagoDateKey(now)
  if (!today) return []
  return getClosedOnSundayHubEvents(events)
    .filter((e) => e.date < today)
    .sort((a, b) => b.date.localeCompare(a.date))
}

/**
 * Next hub date (soonest future or same-day), or null.
 * @param {unknown[]} events
 */
export function getNextClosedOnSundayHubEvent(events, now = new Date()) {
  const list = getUpcomingClosedOnSundayHubEventsSorted(events, now)
  return list[0] || null
}

/** `/porchfest/artists/megan-lea` or `/artists/megan-lea` → `megan-lea` */
export function artistIdFromCreatorProfilePath(path) {
  if (typeof path !== 'string') return null
  const porch = path.match(/^\/porchfest\/artists\/([^/]+)\/?$/)
  if (porch) return porch[1]
  const creators = path.match(/^\/artists\/([^/]+)\/?$/)
  return creators ? creators[1] : null
}

export function formatCosHubDateShort(ymd) {
  if (!ymd || typeof ymd !== 'string') return ''
  const [y, mo, d] = ymd.split('-').map((x) => parseInt(x, 10))
  if (!y || !mo || !d) return ymd
  const utcNoon = Date.UTC(y, mo - 1, d, 12, 0, 0)
  return new Intl.DateTimeFormat('en-US', {
    timeZone: CHICAGO,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(utcNoon))
}

/**
 * Upcoming hub rows with display fields (artist from `vaultLinks.secondary`, optional `featuredShow.when`).
 * @param {unknown[]} events
 * @param {unknown[]} artists
 * @param {{ limit?: number, now?: Date }} [opts]
 */
export function getUpcomingCosHubRowsForDisplay(events, artists, opts = {}) {
  const limit = opts.limit ?? Infinity
  const now = opts.now ?? new Date()
  const list = getUpcomingClosedOnSundayHubEventsSorted(events, now).slice(0, limit)
  const artistList = Array.isArray(artists) ? artists : []
  return list.map((e) => {
    const to = e.vaultLinks?.secondary?.to
    const artistId = artistIdFromCreatorProfilePath(to || '')
    const artist = artistId ? artistList.find((a) => a.id === artistId) : null
    const title = e.name || 'Closed on Sunday'
    const whenExtra =
      artist?.featuredShow?.when && artist.featuredShow.calendar?.allDayStart === e.date
        ? artist.featuredShow.when
        : null
    return {
      event: e,
      dateLabel: formatCosHubDateShort(e.date),
      title,
      whenExtra,
      profileTo: typeof to === 'string' && to ? to : null,
      artistName: artist?.name ?? null,
    }
  })
}
