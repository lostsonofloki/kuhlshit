import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import data from '../data/data.json'
import './ArtistDetail.css'

function ArtistDetailPage() {
  const { artistId } = useParams()
  const [artist, setArtist] = useState(null)

  useEffect(() => {
    // Find artist by ID or name slug
    const foundArtist = data.artists.find(a =>
      a.id === artistId ||
      a.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === artistId
    )

    if (foundArtist) {
      setArtist(foundArtist)
    }
  }, [artistId])

  // Look up the artist's performance day(s) from the schedule
  const getPerformanceDays = () => {
    const event = data.porchfest?.events?.[0]
    if (!event?.lineup) return []
    return event.lineup
      .filter(day => day.artists?.includes(artist.name))
      .map(day => day.day)
  }

  if (!artist) {
    return (
      <div className="artist-detail-page">
        <div className="loading">
          <h2>Artist not found</h2>
          <Link to="/porchfest/artists" className="btn btn-primary">
            ← Back to Artists
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="artist-detail-page">
      {/* Hero Section */}
      <div className="artist-hero">
        <div className="artist-hero-bg">
          {artist.imageUrl ? (
            <img src={artist.imageUrl} alt={artist.name} onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }} />
          ) : null}
          <div className="artist-hero-placeholder" style={{display: artist.imageUrl ? 'none' : 'flex'}}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="overlay"></div>
        </div>
        <div className="artist-hero-content">
          <h1>{artist.name}</h1>
          {artist.location && (
            <p className="artist-location">{artist.location}</p>
          )}
          {artist.genre && (
            <span className="artist-genre">{artist.genre}</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="artist-content">
        {/* Bio */}
        <div className="artist-section">
          <h2>About</h2>
          <p className="artist-bio">{artist.bio}</p>
        </div>

        {/* Social Links */}
        {artist.socialLinks && (artist.socialLinks.facebook || artist.socialLinks.instagram || artist.socialLinks.youtube || artist.socialLinks.website) && (
          <div className="artist-section">
            <h2>Connect</h2>
            <div className="social-links">
              {artist.socialLinks.website && (
                <a href={artist.socialLinks.website} target="_blank" rel="noopener noreferrer" className="social-link">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  <span>Website</span>
                </a>
              )}
              {artist.socialLinks.facebook && (
                <a href={artist.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="social-link">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </a>
              )}
              {artist.socialLinks.instagram && (
                <a href={artist.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="social-link">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  <span>Instagram</span>
                </a>
              )}
              {artist.socialLinks.youtube && (
                <a href={artist.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="social-link">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span>YouTube</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Videos */}
        {artist.videos && artist.videos.length > 0 && (
          <div className="artist-section">
            <h2>Videos</h2>
            <div className="videos-grid">
              {artist.videos.map((video, index) => (
                <div key={index} className="video-card">
                  <a href={video.url} target="_blank" rel="noopener noreferrer" className="video-link">
                    <div className="video-thumbnail">
                      <img src={video.thumbnail} alt={video.title} />
                      <div className="play-overlay">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="video-info">
                      <h4>{video.title}</h4>
                      <span className="video-source">{video.source}</span>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Music Links */}
        {artist.musicLinks && (artist.musicLinks.spotify || artist.musicLinks.appleMusic || artist.musicLinks.youtube) && (
          <div className="artist-section">
            <h2>Listen</h2>
            <div className="music-links">
              {artist.musicLinks.spotify && (
                <a href={artist.musicLinks.spotify} target="_blank" rel="noopener noreferrer" className="music-link">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  <span>Spotify</span>
                </a>
              )}
              {artist.musicLinks.appleMusic && (
                <a href={artist.musicLinks.appleMusic} target="_blank" rel="noopener noreferrer" className="music-link">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <span>Apple Music</span>
                </a>
              )}
              {artist.musicLinks.youtube && (
                <a href={artist.musicLinks.youtube} target="_blank" rel="noopener noreferrer" className="music-link">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span>YouTube</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Performance Day */}
        <div className="artist-section">
          <h2>PorchFest 2026</h2>
          <div className="performance-info">
            <div className="performance-day">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Performing on <strong>{getPerformanceDays().length > 0 ? getPerformanceDays().join(', ') : 'TBD'}</strong></span>
            </div>
            <div className="performance-location">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Munson & Brothers • Columbus, MS</span>
            </div>
            <div className="performance-date">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>April 17-19, 2026</span>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="back-link-container">
          <Link to="/porchfest/artists" className="back-link">← Back to Artists</Link>
        </div>
      </div>
    </div>
  )
}

export default ArtistDetailPage
