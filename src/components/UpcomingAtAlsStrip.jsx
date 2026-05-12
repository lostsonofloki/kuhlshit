import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import data from '../data/data.json'
import { getUpcomingCosHubRowsForDisplay } from '../lib/closedOnSundayHubEvents'
import './UpcomingAtAlsStrip.css'

const HEADING_ID = 'home-upcoming-als-heading'

function UpcomingAtAlsStrip() {
  const rows = useMemo(
    () =>
      getUpcomingCosHubRowsForDisplay(data.porchfest?.events || [], data.artists || [], {
        limit: 3,
        now: new Date(),
      }),
    [],
  )

  if (rows.length === 0) return null

  return (
    <section className="als-upcoming-strip" aria-labelledby={HEADING_ID}>
      <h2 id={HEADING_ID} className="als-upcoming-strip__heading">
        Upcoming Closed on Sundays
      </h2>
      <ul className="als-upcoming-strip__list">
        {rows.map(({ event: e, dateLabel, title, whenExtra, artistName, profileTo }) => {
          const primary = artistName || title
          const nameEl =
            profileTo && artistName ? (
              <Link to={profileTo} className="als-upcoming-strip__title-link">
                {primary}
              </Link>
            ) : (
              <span className="als-upcoming-strip__title">{primary}</span>
            )
          return (
            <li key={e.id} className="als-upcoming-strip__item">
              <time className="als-upcoming-strip__date" dateTime={e.date}>
                {dateLabel}
              </time>
              <span className="als-upcoming-strip__title-wrap">
                {nameEl}
                {whenExtra ? (
                  <span className="als-upcoming-strip__when ui-meta">{whenExtra}</span>
                ) : null}
              </span>
            </li>
          )
        })}
      </ul>
      <p className="als-upcoming-strip__footer">
        <Link to="/closed-on-sundays" className="als-upcoming-strip__schedule-link">
          Full schedule →
        </Link>
      </p>
    </section>
  )
}

export default UpcomingAtAlsStrip
