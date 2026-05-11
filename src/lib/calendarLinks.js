/**
 * Build Google Calendar "template" URLs and iCalendar (.ics) payloads for all-day events.
 * @see https://github.com/InteractionDesignFoundation/add-event-to-calendar-docs/blob/main/services/google.md
 */

/** @param {string} s */
function escapeIcsText(s) {
  return String(s || "")
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
}

/** @param {string} ymd `YYYY-MM-DD` */
function ymdToGoogleDate(ymd) {
  return String(ymd).replace(/-/g, "")
}

/**
 * @param {{
 *   title: string,
 *   details?: string,
 *   location?: string,
 *   allDayStart: string,
 *   allDayEndExclusive: string,
 * }} opts `allDayEndExclusive` is the day after the last day (ICS / Google convention).
 */
export function buildGoogleCalendarAllDayUrl({
  title,
  details = "",
  location = "",
  allDayStart,
  allDayEndExclusive,
}) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${ymdToGoogleDate(allDayStart)}/${ymdToGoogleDate(allDayEndExclusive)}`,
    details,
    location,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function formatUtcStamp(d) {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, "0")
  const day = String(d.getUTCDate()).padStart(2, "0")
  const h = String(d.getUTCHours()).padStart(2, "0")
  const min = String(d.getUTCMinutes()).padStart(2, "0")
  const sec = String(d.getUTCSeconds()).padStart(2, "0")
  return `${y}${m}${day}T${h}${min}${sec}Z`
}

/**
 * @param {{
 *   uid: string,
 *   title: string,
 *   description?: string,
 *   location?: string,
 *   allDayStart: string,
 *   allDayEndExclusive: string,
 * }} opts
 */
export function buildAllDayICS({
  uid,
  title,
  description = "",
  location = "",
  allDayStart,
  allDayEndExclusive,
}) {
  const dtStamp = formatUtcStamp(new Date())
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//kuhlshit.com//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART;VALUE=DATE:${ymdToGoogleDate(allDayStart)}`,
    `DTEND;VALUE=DATE:${ymdToGoogleDate(allDayEndExclusive)}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `LOCATION:${escapeIcsText(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
  return lines.join("\r\n")
}

/** Trigger a one-time download of an .ics file (Apple Calendar, Outlook, etc.). */
export function downloadICSFile(filename, icsBody) {
  const blob = new Blob([icsBody], { type: "text/calendar;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename.endsWith(".ics") ? filename : `${filename}.ics`
  a.rel = "noopener"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
