import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { isLivePromoActive } from '../lib/hueyLivePromo'
import SmartImage from './SmartImage'
import './ClosedOnSundayLivePromo.css'

const ALS_SPIRITS_MAPS_URL =
  'https://www.google.com/maps/place/Al%E2%80%99s+Spirits+and+Music/@33.3782126,-88.0138816,16z/data=!3m1!4b1!4m6!3m5!1s0x888667d5b332ffd5:0x5867b2cdbe5ef2ff!8m2!3d33.3782081!4d-88.0113067!16s%2Fg%2F11c2p93cdp?entry=ttu&g_ep=EgoyMDI2MDQyNy4wIKXMDSoASAFQAw%3D%3D'

function ClosedOnSundayLivePromo() {
  const [active, setActive] = useState(() => isLivePromoActive())

  const refresh = useCallback(() => {
    setActive(isLivePromoActive())
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
      <div className="cos-live-promo-inner">
        <div className="cos-live-promo-media">
          <SmartImage
            src="/resources/promo/huey-jacob-closed-on-sunday.png"
            alt="Porch Talk presents Closed on Sunday: Huey and Jacob Kynard duo — Al’s Spirits, Reform AL, May 3 2026 at 3:00 PM. Promotional poster."
            className="cos-live-promo-img"
            width="560"
            height="560"
            sizes="(max-width: 768px) 100vw, min(420px, 45vw)"
          />
        </div>
        <div className="cos-live-promo-copy">
          <p className="cos-live-promo-eyebrow">Live this weekend</p>
          <h2 id="cos-live-promo-heading" className="cos-live-promo-title">
            Closed on Sunday
          </h2>
          <p className="cos-live-promo-artists">Huey &amp; Jacob Kynard</p>
          <p className="cos-live-promo-meta">
            Sun May 3, 2026 · 3:00 PM CT
            <br />
            <a
              href={ALS_SPIRITS_MAPS_URL}
              className="cos-live-promo-venue"
              target="_blank"
              rel="noopener noreferrer"
            >
              Al&apos;s Spirits &amp; Music · Reform, AL
            </a>
          </p>
          <div className="cos-live-promo-actions">
            <Link to="/porchfest/artists/huey" className="btn btn-primary cos-live-promo-btn">
              Huey profile
            </Link>
            <Link
              to="/porchfest/artists/jacob-kynard"
              className="btn btn-secondary cos-live-promo-btn"
            >
              Jacob Kynard profile
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ClosedOnSundayLivePromo
