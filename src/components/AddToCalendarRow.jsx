import { useCallback, useMemo } from 'react'
import { getSiteOrigin, toAbsoluteUrl } from '../utils/siteOrigin'
import {
  buildGoogleCalendarAllDayUrl,
  buildAllDayICS,
  downloadICSFile,
} from '../lib/calendarLinks'
import './AddToCalendarRow.css'

/**
 * @param {{
 *   calendar: {
 *     allDayStart: string,
 *     allDayEndExclusive: string,
 *     title: string,
 *     location?: string,
 *     fileSlug?: string,
 *     detailLine?: string,
 *   },
 *   profilePath?: string,
 *   seriesPath?: string,
 *   className?: string,
 * }} props
 */
function AddToCalendarRow({
  calendar,
  profilePath = '',
  seriesPath = '/closed-on-sundays',
  className = '',
}) {
  const origin = getSiteOrigin()
  const details = useMemo(() => {
    const bits = [
      'Porch Talk presents Closed on Sunday — time TBA (Central Time).',
      calendar.detailLine?.trim() ||
        'Solo set at the listed venue (time TBA, Central Time).',
    ]
    if (profilePath) {
      bits.push(`Artist profile: ${toAbsoluteUrl(origin, profilePath)}`)
    }
    if (seriesPath) {
      bits.push(`Closed on Sundays (YouTube series hub): ${toAbsoluteUrl(origin, seriesPath)}`)
    }
    return bits.join('\n\n')
  }, [origin, profilePath, seriesPath, calendar.detailLine])

  const googleHref = useMemo(
    () =>
      buildGoogleCalendarAllDayUrl({
        title: calendar.title,
        details,
        location: calendar.location || '',
        allDayStart: calendar.allDayStart,
        allDayEndExclusive: calendar.allDayEndExclusive,
      }),
    [calendar, details],
  )

  const onDownloadApple = useCallback(() => {
    const uid = `closed-on-sunday-${calendar.allDayStart}@kuhlshit.com`
    const slug =
      calendar.fileSlug ||
      String(calendar.title || 'event')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    const ics = buildAllDayICS({
      uid,
      title: calendar.title,
      description: details,
      location: calendar.location || '',
      allDayStart: calendar.allDayStart,
      allDayEndExclusive: calendar.allDayEndExclusive,
    })
    downloadICSFile(`${slug}.ics`, ics)
  }, [calendar, details])

  return (
    <div className={`add-to-calendar-row ${className}`.trim()} role="group" aria-label="Save the date">
      <span className="add-to-calendar-row-label">Save the date</span>
      <p className="add-to-calendar-row-links">
        <a
          href={googleHref}
          target="_blank"
          rel="noopener noreferrer"
          className="add-to-calendar-link"
        >
          Google Calendar
        </a>
        <span className="add-to-calendar-sep" aria-hidden="true">
          ·
        </span>
        <button type="button" className="add-to-calendar-link" onClick={onDownloadApple}>
          Apple / Outlook (.ics)
        </button>
      </p>
    </div>
  )
}

export default AddToCalendarRow
