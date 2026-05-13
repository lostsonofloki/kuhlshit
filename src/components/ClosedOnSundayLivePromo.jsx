import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { isClosedOnSundayLivePromoActive } from '../lib/closedOnSundayLivePromoSchedule'
import {
  artistIdFromCreatorProfilePath,
  formatCosHubDateShort,
  getNextClosedOnSundayHubEvent,
} from '../lib/closedOnSundayHubEvents'
import SmartImage from './SmartImage'
import FeaturedShowWhereLine from './FeaturedShowWhereLine'
import AddToCalendarRow from './AddToCalendarRow'
import data from '../data/data.json'
import './ClosedOnSundayLivePromo.css'

function promoHeroImageSrc(artist) {
  if (artist?.id === 'megan-lea') return '/resources/promo/megan-lea-closed-on-sunday.webp'
  return artist?.imageUrl || artist?.thumbnailUrl || ''
}

function ClosedOnSundayLivePromo() {
  const [active, setActive] = useState(() => isClosedOnSundayLivePromoActive())
  /** Bumps on the same interval as `refresh` so `nextEvent` recomputes after midnight CT. */
  const [, setTick] = useState(0)
  const bump = useCallback(() => setTick((n) => n + 1), [])

  const refresh = useCallback(() => {
    setActive(isClosedOnSundayLivePromoActive())
    bump()
  }, [bump])

  useEffect(() => {
    refresh()
    const id = window.setInterval(refresh, 60_000)
    const onVis = () => {
      if (document.visibilityState === 'visible') refresh()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [refresh])

  const nextEvent = getNextClosedOnSundayHubEvent(data.porchfest?.events || [], new Date())

  let featuredArtist = null
  if (nextEvent?.vaultLinks?.secondary?.to) {
    const id = artistIdFromCreatorProfilePath(nextEvent.vaultLinks.secondary.to)
    if (id) featuredArtist = (data.artists || []).find((a) => a.id === id) || null
  }

  const heroSrc = promoHeroImageSrc(featuredArtist)
  const profilePath = nextEvent?.vaultLinks?.secondary?.to || '/artists/megan-lea'
  const profileLabel = featuredArtist?.name
    ? `${featuredArtist.name} profile`
    : 'Artist profile'

  const whenLine =
    featuredArtist?.featuredShow?.when ||
    (nextEvent?.date ? `${formatCosHubDateShort(nextEvent.date)} · time TBA · CT` : '')
  const whereLine =
    featuredArtist?.featuredShow?.where || "Al's Spirits & Music · Reform, AL"

  const calendar =
    featuredArtist?.featuredShow?.calendar &&
    featuredArtist.featuredShow.calendar.allDayStart === nextEvent?.date
      ? featuredArtist.featuredShow.calendar
      : null

  const eyebrowDate = nextEvent?.date ? formatCosHubDateShort(nextEvent.date) : ''
  const artistLine =
    featuredArtist?.name ||
    nextEvent?.name?.replace(/^Closed on Sundays?:\s*/i, '') ||
    'TBA'
  const imgAlt = nextEvent?.name
    ? `${nextEvent.name} — Closed on Sundays at Al's Spirits & Music, Reform, AL. Promotional image.`
    : 'Closed on Sundays — promotional image.'

  if (!active || !nextEvent) return null

  return (
    <section className="cos-live-promo" aria-labelledby="cos-live-promo-heading">
      <div className="cos-live-promo-shell">
        <div className="cos-live-promo-card">
          <div className="cos-live-promo-inner">
            <div className="cos-live-promo-media">
              {heroSrc ? (
                <SmartImage
                  src={heroSrc}
                  alt={imgAlt}
                  className="cos-live-promo-img"
                  width="560"
                  height="560"
                  sizes="(max-width: 768px) 100vw, min(420px, 45vw)"
                  enableZoom
                />
              ) : null}
            </div>
            <div className="cos-live-promo-copy">
              <p className="cos-live-promo-kicker">Porch Talk presents</p>
              <p className="cos-live-promo-eyebrow">
                Next session{eyebrowDate ? ` · ${eyebrowDate}` : ''}
              </p>
              <h2 id="cos-live-promo-heading" className="cos-live-promo-title">
                Closed on Sundays
              </h2>
              <p className="cos-live-promo-artists">{artistLine}</p>
              <p className="cos-live-promo-tagline">Listening room · filmed to camera</p>
              <dl className="cos-live-promo-details">
                <div className="cos-live-promo-detail">
                  <dt>When</dt>
                  <dd>{whenLine || 'Date TBA'}</dd>
                </div>
                <div className="cos-live-promo-detail">
                  <dt>Where</dt>
                  <FeaturedShowWhereLine
                    where={whereLine}
                    hrefOverride={nextEvent?.location?.mapUrl}
                    as="dd"
                    className=""
                    linkClassName="cos-live-promo-venue"
                  />
                </div>
              </dl>
              <div className="cos-live-promo-actions">
                <Link to={profilePath} className="btn btn-primary cos-live-promo-btn">
                  {profileLabel}
                </Link>
                <Link to="/closed-on-sundays" className="btn btn-secondary cos-live-promo-btn">
                  Series &amp; upcoming
                </Link>
              </div>
              {calendar ? (
                <AddToCalendarRow
                  calendar={calendar}
                  profilePath={profilePath}
                  className="cos-live-promo-footnote"
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ClosedOnSundayLivePromo
