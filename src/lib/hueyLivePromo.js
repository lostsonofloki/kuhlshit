const PROMO_TIMEZONE = 'America/Chicago'
const PROMO_END = { y: 2026, m: 5, d: 3, h: 16, min: 30 }

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

/** True while current time in Chicago is strictly before promo end (May 3, 2026 4:30 PM CT). */
export function isLivePromoActive(now = new Date()) {
  const cur = zonedWallParts(now, PROMO_TIMEZONE)
  const e = PROMO_END
  if (cur.y !== e.y) return cur.y < e.y
  if (cur.m !== e.m) return cur.m < e.m
  if (cur.d !== e.d) return cur.d < e.d
  return cur.h < e.h || (cur.h === e.h && cur.min < e.min)
}
