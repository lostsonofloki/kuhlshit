import { useCallback, useMemo } from 'react'
import { getSiteOrigin, toAbsoluteUrl } from '../utils/siteOrigin'
import {
  buildGoogleCalendarAllDayUrl,
  buildAllDayICS,
  downloadICSFile,
} from '../lib/calendarLinks'
import './AddToCalendarRow.css'

/**
 * @param {object} props
 * @param {{ allDayStart: string, allDayEndExclusive: string, title: string, location?: string, fileSlug?: string, detailLine?: string }} props.calendar
 * @param {string} [props.profilePath]
 * @param {string} [props.seriesPath]
 * @param {string} [props.className]
 * @param {string} [props.customDetails] When set, replaces default Closed-on-Sundays boilerplate as first paragraph.
 * @param {boolean} [props.includeSeriesHub]
 * @param {string} [props.labelText]
 */
function AddToCalendarRow({
  calendar,
  profilePath = '',
  seriesPath = '/closed-on-sundays',
  className = '',
  customDetails = '',
  includeSeriesHub = true,
  labelText = 'Save the date',
}) {
  const origin = getSiteOrigin()
  const details = useMemo(() => {
    const custom = typeof customDetails === 'string' ? customDetails.trim() : ''
    if (custom) {
      const bits = [custom]
      if (profilePath) {
        bits.push(`Artist profile: ${toAbsoluteUrl(origin, profilePath)}`)
      }
      if (includeSeriesHub && seriesPath) {
        bits.push(`Closed on Sundays (YouTube series hub): ${toAbsoluteUrl(origin, seriesPath)}`)
      }
      return bits.join('\n\n')
    }
    const bits = [
      'Porch Talk presents Closed on Sundays — 3:00 PM Central Time.',
      calendar.detailLine?.trim() ||
        'Solo set at the listed venue (3:00 PM Central Time).',
    ]
    if (profilePath) {
      bits.push(`Artist profile: ${toAbsoluteUrl(origin, profilePath)}`)
    }
    if (includeSeriesHub && seriesPath) {
      bits.push(`Closed on Sundays (YouTube series hub): ${toAbsoluteUrl(origin, seriesPath)}`)
    }
    return bits.join('\n\n')
  }, [origin, profilePath, seriesPath, calendar.detailLine, customDetails, includeSeriesHub])

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
    const uidRaw = String(calendar.fileSlug || `closed-on-sunday-${calendar.allDayStart}`)
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-|-$/g, '') || 'event'
    const uid = `${uidRaw}@kuhlshit.com`
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
    <div className={`add-to-calendar-row ${className}`.trim()} role="group" aria-label={labelText}>
      <span className="add-to-calendar-row-label">{labelText}</span>
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
