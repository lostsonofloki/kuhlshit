import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './AnnouncementBar.css'

const STORAGE_KEY = 'kuhlshit-waitlist-bar-dismissed'

function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === 'true') {
      setDismissed(true)
    }
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem(STORAGE_KEY, 'true')
  }

  if (dismissed) return null

  return (
    <div className="announcement-bar">
      <div className="announcement-bar-content">
        <span className="announcement-text">
          <span className="announcement-main">
            <strong>New on the porch:</strong>{" "}
            <Link to="/closed-on-sundays" className="announcement-link-strong">
              Closed on Sundays
            </Link>
            {" and "}
            <Link to="/porch-talk" className="announcement-link-strong">
              PorchTalk
            </Link>
            .
          </span>
          <span className="announcement-note hide-mobile">
            Past fest weekends live in{" "}
            <Link to="/vault">The Vault</Link>
            . Creators:{" "}
            <Link to="/waitlist" className="announcement-waitlist-link">
              waitlist
            </Link>
            .
          </span>
        </span>
        <button className="announcement-dismiss" onClick={handleDismiss} aria-label="Dismiss">
          ✕
        </button>
      </div>
    </div>
  )
}

export default AnnouncementBar
