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
          🎸 <strong>PorchFest 2026 — Apr 17-19</strong> Columbus, MS
          <span className="announcement-pricing">
            <span className="price-badge">$10/Day</span>
            <span className="price-badge highlight">$20 Weekend Pass</span>
          </span>
          <span className="announcement-note">Tickets at the Door</span>
        </span>
        <button className="announcement-dismiss" onClick={handleDismiss} aria-label="Dismiss">
          ✕
        </button>
      </div>
    </div>
  )
}

export default AnnouncementBar
