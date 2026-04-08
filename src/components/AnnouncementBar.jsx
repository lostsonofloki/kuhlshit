import { useState, useEffect } from 'react'
import './AnnouncementBar.css'

function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('pf2026-bar-dismissed')
    if (dismissed === 'true') {
      setDismissed(true)
    }
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem('pf2026-bar-dismissed', 'true')
  }

  if (dismissed) return null

  return (
    <div className="announcement-bar">
      <div className="announcement-bar-content">
        <span className="announcement-text">
          <span className="announcement-main">
            🎸 <strong className="full-text">PorchFest 2026 — Apr 17-19</strong>
            <span className="mobile-text">PorchFest '26 — Apr 17-19</span>
          </span>
          <span className="location mobile-hide"> Columbus, MS</span>
          <span className="announcement-pricing">
            <span className="price-badge">$10/Day</span>
            <span className="price-badge highlight full-text">$20 Weekend</span>
          </span>
          <span className="announcement-note mobile-hide">Tickets at the Door</span>
        </span>
        <button className="announcement-dismiss" onClick={handleDismiss} aria-label="Dismiss">
          ✕
        </button>
      </div>
    </div>
  )
}

export default AnnouncementBar
