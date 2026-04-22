import { Link } from 'react-router-dom'
import ScheduleBadges from './ScheduleBadges'
import SmartImage from './SmartImage'
import './ArtistCard.css'

function ArtistCard({ artist, scheduleStatus }) {
  const { id, name, location, thumbnailUrl } = artist

  return (
    <Link to={`/artists/${id}`} className="artist-card">
      <div className="artist-card-image">
        {thumbnailUrl ? (
          <SmartImage
            src={thumbnailUrl}
            alt={name}
            width="300"
            height="300"
            onError={(e) => {
              e.target.style.display = 'none'
              const picture = e.target.closest('picture')
              const placeholder = (picture || e.target).nextElementSibling
              placeholder?.classList.add('visible')
            }}
          />
        ) : null}
        <div className="artist-placeholder">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </div>
        <div className="artist-card-overlay">
          <div className="play-icon">▶</div>
        </div>
      </div>

      <div className="artist-card-content">
        <h3 className="artist-card-name">
          <span className="artist-card-name-text">{name}</span>
          <ScheduleBadges status={scheduleStatus} />
        </h3>
        <p className="artist-card-location">{location}</p>
      </div>
    </Link>
  )
}

export default ArtistCard
