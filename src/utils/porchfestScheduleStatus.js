/**
 * LIVE / "Next up" helpers for PorchFest lineup.
 *
 * Set times are optional. Lineup entries can stay as plain strings (no badges),
 * or become objects when times are published:
 *   { "name": "The Stifftones", "start_time": "16:00", "end_time": "16:50" }
 * Times use 24h HH:MM in the viewer's local timezone, on the calendar day for that lineup block.
 */

/** @param {string|{name: string, start_time?: string, end_time?: string}} entry */
export function normalizeLineupEntry(entry) {
  if (typeof entry === 'string') {
    return { name: entry, start_time: null, end_time: null }
  }
  if (entry && typeof entry === 'object' && entry.name) {
    return {
      name: entry.name,
      start_time: entry.start_time ?? null,
      end_time: entry.end_time ?? null,
    }
  }
  return { name: String(entry), start_time: null, end_time: null }
}

/**
 * ISO date (YYYY-MM-DD) for a named festival day, from event.date (first day) + lineup index.
 * @param {{ date: string, lineup: Array<{ day: string }> }} event
 * @param {string} dayName e.g. "Friday"
 * @returns {string | null}
 */
export function getIsoDateForLineupDay(event, dayName) {
  if (!event?.date || !event?.lineup?.length) return null
  const idx = event.lineup.findIndex((b) => b.day === dayName)
  if (idx === -1) return null
  const base = new Date(`${event.date}T12:00:00`)
  base.setDate(base.getDate() + idx)
  const y = base.getFullYear()
  const m = String(base.getMonth() + 1).padStart(2, '0')
  const d = String(base.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function parseClockToDate(isoDate, hhmm) {
  if (!isoDate || !hhmm || typeof hhmm !== 'string') return null
  const m = hhmm.trim().match(/^(\d{1,2}):(\d{2})$/)
  if (!m) return null
  const h = Number(m[1], 10)
  const min = Number(m[2], 10)
  if (Number.isNaN(h) || Number.isNaN(min)) return null
  return new Date(`${isoDate}T${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}:00`)
}

function sameLocalDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/**
 * Whether "now" falls on any day of the festival (inclusive).
 * @param {Date} now
 * @param {{ date: string, endDate?: string }} event
 */
export function isDuringFestivalDates(now, event) {
  if (!event?.date) return false
  const start = new Date(`${event.date}T00:00:00`)
  const end = event.endDate
    ? new Date(`${event.endDate}T23:59:59.999`)
    : new Date(`${event.date}T23:59:59.999`)
  return now >= start && now <= end
}

/**
 * @returns {'live' | 'next' | null}
 * - `live`: now within [start, end] on the slot's day, and that day is today
 * - `next`: not yet live, starts within 30 minutes (same day)
 * - `null`: missing times, wrong day, or outside festival dates
 */
export function getSlotStatus(slot, lineupDay, event, now = new Date()) {
  const { start_time, end_time } = normalizeLineupEntry(slot)
  if (!start_time || !end_time) return null
  if (!isDuringFestivalDates(now, event)) return null

  const iso = getIsoDateForLineupDay(event, lineupDay)
  if (!iso) return null
  if (!sameLocalDay(now, new Date(`${iso}T12:00:00`))) return null

  const start = parseClockToDate(iso, start_time)
  const end = parseClockToDate(iso, end_time)
  if (!start || !end || end <= start) return null

  if (now >= start && now <= end) return 'live'

  const thirtyMin = 30 * 60 * 1000
  if (now < start && start - now <= thirtyMin) return 'next'

  return null
}

/**
 * Find status for an artist name in the first PorchFest event (by exact name match on normalized lineup entries).
 * @param {string} artistName
 * @param {{ porchfest?: { events?: unknown[] } }} data — typically `data.json` root
 */
export function getArtistSlotStatusFromData(artistName, data, now = new Date()) {
  const event = data?.porchfest?.events?.[0]
  if (!event?.lineup || !artistName) return null

  const needle = artistName.trim().toLowerCase()
  for (const block of event.lineup) {
    const day = block.day
    const artists = block.artists || []
    for (const raw of artists) {
      const slot = normalizeLineupEntry(raw)
      if (slot.name.trim().toLowerCase() !== needle) continue
      return getSlotStatus(slot, day, event, now)
    }
  }
  return null
}
