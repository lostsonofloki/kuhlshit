const PROMO_TIMEZONE = 'America/Chicago'

/** After Huey & Jacob’s live taping window (May 3, 2026 4:30 PM CT). */
const PROMO_START = { y: 2026, m: 5, d: 3, h: 16, min: 30 }

/** Through end of Megan’s Aug 2, 2026 taping day (Chicago wall clock). */
const PROMO_END = { y: 2026, m: 8, d: 2, h: 23, min: 59 }

function zonedWallParts(date, timeZone) {
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  })
  const parts = f.formatToParts(date)
  const v = (type) => {
    const p = parts.find((x) => x.type === type)
    return p ? Number(p.value) : 0
  }
  return {
    y: v('year'),
    m: v('month'),
    d: v('day'),
    h: v('hour'),
    min: v('minute'),
  }
}

/** True if `a` is strictly before `b` in calendar order (same fields). */
function isBeforeParts(a, b) {
  if (a.y !== b.y) return a.y < b.y
  if (a.m !== b.m) return a.m < b.m
  if (a.d !== b.d) return a.d < b.d
  if (a.h !== b.h) return a.h < b.h
  return a.min < b.min
}

/**
 * Homepage Closed on Sunday live promo: on after the May 3, 2026 Huey/Jacob
 * window and through late Aug 2, 2026 CT (Megan taping day + buffer).
 */
export function isClosedOnSundayLivePromoActive(now = new Date()) {
  const cur = zonedWallParts(now, PROMO_TIMEZONE)
  if (isBeforeParts(cur, PROMO_START)) return false
  if (isBeforeParts(PROMO_END, cur)) return false
  return true
}
