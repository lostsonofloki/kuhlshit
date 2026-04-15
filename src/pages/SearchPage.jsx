import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import data from '../data/data.json'
import ArtistCard from '../components/ArtistCard'
import { useFestivalClock } from '../hooks/useFestivalClock'
import { getArtistSlotStatusFromData } from '../utils/porchfestScheduleStatus'
import './SearchPage.css'

function SearchPage() {
  const now = useFestivalClock()
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState({
    artists: [],
    events: []
  })

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery)
    } else {
      setResults({ artists: [], events: [] })
    }
  }, [searchQuery])

  const performSearch = (query) => {
    const searchLower = query.toLowerCase()

    const artistResults = data.artists.filter(artist => {
      const nameMatch = artist.name.toLowerCase().includes(searchLower)
      const locationMatch = artist.location?.toLowerCase().includes(searchLower) ?? false
      const bioMatch = artist.bio?.toLowerCase().includes(searchLower)
      return nameMatch || locationMatch || bioMatch
    })

    const eventResults = data.porchfest.events.filter(event => {
      const nameMatch = event.name.toLowerCase().includes(searchLower)
      const locationMatch = event.location.city.toLowerCase().includes(searchLower) ||
                           event.location.state.toLowerCase().includes(searchLower)
      const descMatch = event.description.toLowerCase().includes(searchLower)
      return nameMatch || locationMatch || descMatch
    })

    setResults({
      artists: artistResults,
      events: eventResults
    })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const query = e.target.search.value
    setSearchQuery(query)
  }

  const clearFilters = () => {
    setSearchQuery('')
  }

  const totalResults = results.artists.length + results.events.length

  return (
    <div className="search-page">
      <div className="page-header">
        <h1>Search</h1>
        <p>Discover artists and events</p>
      </div>

      <div className="search-hero">
        <form className="hero-search-form" onSubmit={handleSearch}>
          <input
            type="text"
            name="search"
            className="hero-search-input"
            placeholder="Search artists, events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <button type="submit" className="hero-search-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </form>
      </div>

      {searchQuery && (
        <div className="results-section">
          <div className="results-header">
            <h2>
              {totalResults} Result{totalResults !== 1 ? 's' : ''} Found
            </h2>
            <button className="clear-btn" onClick={clearFilters}>
              Clear All
            </button>
          </div>

          {totalResults === 0 ? (
            <div className="no-results">
              <h3>No results found</h3>
              <p>Try a different search term</p>
              <button onClick={clearFilters} className="btn btn-primary">
                Clear Search
              </button>
            </div>
          ) : (
            <>
              {results.artists.length > 0 && (
                <div className="results-category">
                  <h3 className="category-title">Artists</h3>
                  <div className="artists-grid">
                    {results.artists.map(artist => (
                      <ArtistCard
                        key={artist.id}
                        artist={artist}
                        scheduleStatus={getArtistSlotStatusFromData(artist.name, data, now)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {results.events.length > 0 && (
                <div className="results-category">
                  <h3 className="category-title">PorchFest Events</h3>
                  <div className="events-list">
                    {results.events.map(event => (
                      <Link key={event.id} to="/porchfest" className="event-result-card">
                        <div className="event-date-badge">
                          <span className="month">Apr</span>
                          <span className="day">17-19</span>
                        </div>
                        <div className="event-result-info">
                          <h4>{event.name}</h4>
                          <p className="event-location">{event.location.city}, {event.location.state}</p>
                          <p className="search-event-description">{event.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {!searchQuery && (
        <div className="browse-hints">
          <div className="hint-card">
            <h3>🔍 Search Anything</h3>
            <p>Search by artist name, location, or event</p>
          </div>
          <div className="hint-card">
            <h3>🎭 Explore Everything</h3>
            <p>Browse artists and PorchFest events all in one place</p>
          </div>
        </div>
      )}

      <div className="back-link-container">
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    </div>
  )
}

export default SearchPage
