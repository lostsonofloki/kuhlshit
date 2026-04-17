import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import data from '../data/data.json'
import './ArtistsPage.css'

function ArtistsPage() {
  const [artists, setArtists] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredArtists, setFilteredArtists] = useState([])

  useEffect(() => {
    // Get all artists from data
    const allArtists = data.artists || []
    setArtists(allArtists)
    setFilteredArtists(allArtists)
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const filtered = artists.filter(artist =>
        artist.name.toLowerCase().includes(query) ||
        artist.location?.toLowerCase().includes(query) ||
        artist.genre?.toLowerCase().includes(query)
      )
      setFilteredArtists(filtered)
    } else {
      setFilteredArtists(artists)
    }
  }, [searchQuery, artists])

  const handleSearch = (e) => {
    e.preventDefault()
    const query = e.target.search.value
    setSearchQuery(query)
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  return (
    <div className="artists-page">
      <div className="page-header">
        <h1>All Artists</h1>
        <p>Discover all the talented musicians in the Kuhlshit family</p>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, location, or genre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </form>
      </div>

      {/* Results Count */}
      <div className="results-info">
        <p>{filteredArtists.length} artist{filteredArtists.length !== 1 ? 's' : ''} found</p>
        {searchQuery && (
          <button className="clear-btn" onClick={clearSearch}>
            Clear Search
          </button>
        )}
      </div>

      {/* Artists Grid */}
      {filteredArtists.length > 0 ? (
        <div className="artists-grid">
          {filteredArtists.map(artist => (
            <Link
              key={artist.id}
              to={`/porchfest/artists/${artist.id}`}
              className="artist-card"
            >
              <div className="artist-card-image">
                <img
                  src={artist.imageUrl || '/resources/placeholder-artist.svg'}
                  alt={artist.name}
                  className={artist.id === 'john-keys' ? 'artist-image-fit-contain' : ''}
                  onError={(e) => {
                    e.target.src = '/resources/placeholder-artist.svg'
                  }}
                />
                <div className="artist-card-overlay">
                  <span className="view-profile">View Profile →</span>
                </div>
              </div>
              <div className="artist-card-content">
                <h3 className="artist-name">{artist.name}</h3>
                {artist.location && (
                  <p className="artist-location">{artist.location}</p>
                )}
                {artist.genre && (
                  <p className="artist-genre">{artist.genre}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="no-artists">
          <h3>No artists found</h3>
          <p>Try adjusting your search</p>
          <button className="btn btn-primary" onClick={clearSearch}>
            Clear Search
          </button>
        </div>
      )}

      {/* Back Link */}
      <div className="back-link-container">
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    </div>
  )
}

export default ArtistsPage
