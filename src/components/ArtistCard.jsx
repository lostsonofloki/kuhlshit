import { Link } from 'react-router-dom'
import './ArtistCard.css'

function ArtistCard({ artist }) {
  const { id, name, location, thumbnailUrl } = artist

  return (
    <Link to={`/artists/${id}`} className="artist-card">
      <div className="artist-card-image">
        <img
          src={thumbnailUrl || '/resources/placeholder-artist.jpg'}
          alt={name}
          onError={(e) => {
            e.target.src = '/resources/placeholder-artist.jpg'
          }}
        />
        <div className="artist-card-overlay">
          <div className="play-icon">▶</div>
        </div>
      </div>

      <div className="artist-card-content">
        <h3 className="artist-card-name">{name}</h3>
        <p className="artist-card-location">{location}</p>
      </div>
    </Link>
  )
}

export default ArtistCard
