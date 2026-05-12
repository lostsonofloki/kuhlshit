/**
 * Resolve an all-day calendar payload for a manual `upcomingShows[]` entry.
 * Uses explicit `show.calendar` when present; otherwise synthesizes an all-day
 * block when `sortDate` is YYYY-MM-DD and the `when` line does not include a
 * wall-clock time (avoids misrepresenting e.g. "6:00 PM" gigs as all-day).
 */

/** @param {string} ymd */
export function addOneDayYmd(ymd) {
  const m = String(ymd || '').match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return ''
  const y = Number(m[1])
  const mo = Number(m[2]) - 1
  const d = Number(m[3])
  const t = Date.UTC(y, mo, d, 12, 0, 0)
  const next = new Date(t + 86400000)
  const yy = next.getUTCFullYear()
  const mm = String(next.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(next.getUTCDate()).padStart(2, '0')
  return `${yy}-${mm}-${dd}`
}

/** @param {string} [when] */
export function whenLineHasWallClock(when) {
  return /\d{1,2}:\d{2}\s*(?:AM|PM)\b/i.test(String(when || ''))
}

/**
 * @param {object} show
 * @param {{ artistName?: string, artistId?: string }} ctx
 * @returns {{ allDayStart: string, allDayEndExclusive: string, title: string, location: string, fileSlug: string, detailLine?: string } | null}
 */
export function resolveCalendarForUpcomingShow(show, ctx = {}) {
  if (!show || typeof show !== 'object') return null

  const c = show.calendar
  if (
    c &&
    typeof c.allDayStart === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(c.allDayStart) &&
    typeof c.allDayEndExclusive === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(c.allDayEndExclusive) &&
    typeof c.title === 'string' &&
    c.title.trim()
  ) {
    return {
      allDayStart: c.allDayStart,
      allDayEndExclusive: c.allDayEndExclusive,
      title: c.title.trim(),
      location: typeof c.location === 'string' && c.location.trim() ? c.location.trim() : '',
      fileSlug:
        typeof c.fileSlug === 'string' && c.fileSlug.trim()
          ? c.fileSlug.trim()
          : `gig-${c.allDayStart}-${(ctx.artistId || 'artist').replace(/[^a-z0-9-]/gi, '')}`,
      detailLine: typeof c.detailLine === 'string' ? c.detailLine.trim() : '',
    }
  }

  const sortDate = typeof show.sortDate === 'string' ? show.sortDate.trim() : ''
  if (!/^\d{4}-\d{2}-\d{2}$/.test(sortDate)) return null
  if (whenLineHasWallClock(show.when)) return null

  const venue = show.where || show.venueLine || ''
  const title =
    typeof show.title === 'string' && show.title.trim()
      ? show.title.trim()
      : ctx.artistName || 'Live date'

  const detailBits = [show.when, show.supporting, show.notes].filter(
    (x) => typeof x === 'string' && x.trim(),
  )
  const detailLine = detailBits.length ? detailBits.join(' · ') : ''

  const aid = typeof ctx.artistId === 'string' && ctx.artistId.trim() ? ctx.artistId.trim() : 'artist'
  return {
    allDayStart: sortDate,
    allDayEndExclusive: addOneDayYmd(sortDate),
    title,
    location: venue,
    fileSlug: `gig-${sortDate}-${aid.replace(/[^a-z0-9-]/gi, '')}`,
    detailLine,
  }
}
