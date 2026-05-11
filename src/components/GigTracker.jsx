import { useEffect, useMemo } from 'react'
import './GigTracker.css'

function sortedShows(list) {
  if (!Array.isArray(list) || list.length === 0) return []
  return [...list].sort((a, b) => {
    const da = String(a.sortDate || '').trim()
    const db = String(b.sortDate || '').trim()
    if (da && db) return da.localeCompare(db)
    if (da) return -1
    if (db) return 1
    return String(a.when || '').localeCompare(String(b.when || ''))
  })
}

function GigTracker({ artistSlug, upcomingShows }) {
  const shows = useMemo(() => sortedShows(upcomingShows), [upcomingShows])
  const hasManual = shows.length > 0
  const hasBit = Boolean(artistSlug)

  useEffect(() => {
    if (!hasBit) return

    if (!window.Bandsintown) {
      const script = document.createElement('script')
      script.src = 'https://widget.bandsintown.com/main.min.js'
      script.async = true
      document.body.appendChild(script)
    } else if (window.Bandsintown.render) {
      setTimeout(() => {
        window.Bandsintown.render()
      }, 100)
    }
  }, [artistSlug, hasBit])

  if (!hasManual && !hasBit) return null

  return (
    <div className="gig-tracker" key={`${artistSlug || 'na'}-${shows.length}`}>
      <h3 className="gig-tracker-title">Live Dates</h3>
      {hasManual ? (
        <ul className="gig-tracker-manual-list" aria-label="Upcoming performances">
          {shows.map((show, i) => {
            const venueLine = show.venueLine || show.where
            return (
              <li
                key={`${show.sortDate || i}-${show.title || ''}`}
                className="gig-tracker-manual-item"
              >
                <div className="gig-tracker-manual-when">{show.when}</div>
                <div className="gig-tracker-manual-title">{show.title}</div>
                {venueLine ? (
                  show.mapUrl ? (
                    <a
                      href={show.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gig-tracker-manual-venue"
                    >
                      {venueLine}
                    </a>
                  ) : (
                    <div className="gig-tracker-manual-venue">{venueLine}</div>
                  )
                ) : null}
                {show.supporting ? (
                  <div className="gig-tracker-manual-supporting">{show.supporting}</div>
                ) : null}
                {show.notes && !show.supporting ? (
                  <div className="gig-tracker-manual-supporting">{show.notes}</div>
                ) : null}
              </li>
            )
          })}
        </ul>
      ) : null}
      {hasBit ? (
        <a
          className="bit-widget-initializer"
          data-artist-name={artistSlug}
          data-background-color="transparent"
          data-text-color="#c9b896"
          data-link-color="#d48c29"
          data-button-text-color="#d48c29"
          data-button-background-color="transparent"
          data-button-border-color="#d48c29"
          data-button-border-width="1px"
          data-button-border-radius="4px"
          data-separator-color="rgba(255,255,255,0.1)"
          data-display-limit="5"
          data-display-local-dates="false"
          data-display-past-dates="false"
          data-display-play-my-city="false"
          data-font="inherit"
        ></a>
      ) : null}
    </div>
  )
}

export default GigTracker
