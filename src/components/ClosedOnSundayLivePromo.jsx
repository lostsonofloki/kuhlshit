import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { isClosedOnSundayLivePromoActive } from '../lib/closedOnSundayLivePromoSchedule'
import { ALS_SPIRITS_MAPS_URL } from '../constants/alsSpirits'
import SmartImage from './SmartImage'
import AddToCalendarRow from './AddToCalendarRow'
import data from '../data/data.json'
import './ClosedOnSundayLivePromo.css'

const MEGAN_AUG2_CALENDAR = data.artists.find((a) => a.id === 'megan-lea')?.featuredShow?.calendar

function ClosedOnSundayLivePromo() {
  const [active, setActive] = useState(() => isClosedOnSundayLivePromoActive())

  const refresh = useCallback(() => {
    setActive(isClosedOnSundayLivePromoActive())
  }, [])

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

  if (!active) return null

  return (
    <section className="cos-live-promo" aria-labelledby="cos-live-promo-heading">
      <div className="cos-live-promo-shell">
        <div className="cos-live-promo-card">
          <div className="cos-live-promo-inner">
            <div className="cos-live-promo-media">
              <SmartImage
                src="/resources/promo/megan-lea-closed-on-sunday.webp"
                alt="Porch Talk presents Closed on Sunday: Megan Lea — Al’s Spirits, Reform AL, August 2 2026 (time TBA). Promotional image."
                className="cos-live-promo-img"
                width="560"
                height="560"
                sizes="(max-width: 768px) 100vw, min(420px, 45vw)"
                enableZoom
              />
            </div>
            <div className="cos-live-promo-copy">
              <p className="cos-live-promo-kicker">Porch Talk presents</p>
              <p className="cos-live-promo-eyebrow">Next session · Aug 2</p>
              <h2 id="cos-live-promo-heading" className="cos-live-promo-title">
                Closed on Sunday
              </h2>
              <p className="cos-live-promo-artists">Megan Lea</p>
              <p className="cos-live-promo-tagline">Listening room · filmed to camera</p>
              <dl className="cos-live-promo-details">
                <div className="cos-live-promo-detail">
                  <dt>When</dt>
                  <dd>Sun Aug 2, 2026 · time TBA · CT</dd>
                </div>
                <div className="cos-live-promo-detail">
                  <dt>Where</dt>
                  <dd>
                    <a
                      href={ALS_SPIRITS_MAPS_URL}
                      className="cos-live-promo-venue"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Al&apos;s Spirits &amp; Music · Reform, AL
                    </a>
                  </dd>
                </div>
              </dl>
              <div className="cos-live-promo-actions">
                <Link to="/porchfest/artists/megan-lea" className="btn btn-primary cos-live-promo-btn">
                  Megan Lea profile
                </Link>
                <Link to="/closed-on-sundays" className="btn btn-secondary cos-live-promo-btn">
                  Series archive
                </Link>
              </div>
              {MEGAN_AUG2_CALENDAR ? (
                <AddToCalendarRow
                  calendar={MEGAN_AUG2_CALENDAR}
                  profilePath="/porchfest/artists/megan-lea"
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
