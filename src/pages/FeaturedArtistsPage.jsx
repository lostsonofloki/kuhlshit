import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import data from '../data/data.json'
import './FeaturedArtists.css'

function FeaturedArtistsPage() {
  const [artists, setArtists] = useState([])
  const [selectedDay, setSelectedDay] = useState('all')

  useEffect(() => {
    // Extract artists from PorchFest lineup
    const event = data.porchfest.events[0]
    if (event && event.lineup) {
      const allArtists = []
      
      event.lineup.forEach(daySchedule => {
        daySchedule.artists.forEach(artistName => {
          // Find matching artist in data for image/info
          const artistData = data.artists.find(a => 
            a.name.toLowerCase() === artistName.toLowerCase() ||
            a.name.toLowerCase().includes(artistName.toLowerCase()) ||
            artistName.toLowerCase().includes(a.name.toLowerCase())
          )
          
          allArtists.push({
            name: artistName,
            day: daySchedule.day,
            id: artistName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            imageUrl: artistData?.imageUrl?.trim() || null,
            genre: artistData?.genre || null
          })
        })
      })

      setArtists(allArtists)
    }
  }, [])

  const filteredArtists = selectedDay === 'all' 
    ? artists 
    : artists.filter(artist => artist.day === selectedDay)

  const days = ['all', 'Friday', 'Saturday', 'Sunday']

  return (
    <div className="featured-artists-page">
      <div className="page-header">
        <h1>PorchFest 2026 Artists</h1>
        <p>Meet the talented musicians performing at PorchFest 2026</p>
        <p className="event-dates">April 17-19 • <a href="https://www.google.com/maps/place/Munson+and+Brothers+Trading+Post/@33.4944198,-88.4322622,16z/data=!4m6!3m5!1s0x8886eb05721234f7:0x28b28ed87d3c2534!8m2!3d33.496184!4d-88.4307709!16s%2Fg%2F11fj2fw9ny?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" style={{ color: '#d48c29', textDecoration: 'underline' }}>Munson & Brothers</a> • Columbus, MS</p>
      </div>

      {/* Day Filter */}
      <div className="day-filter">
        {days.map(day => (
          <button
            key={day}
            className={`filter-btn ${selectedDay === day ? 'active' : ''}`}
            onClick={() => setSelectedDay(day)}
          >
            {day === 'all' ? 'All Days' : day}
          </button>
        ))}
      </div>

      {/* Artists Grid */}
      <div className="artists-grid">
        {filteredArtists.map(artist => (
          <Link key={artist.id} to={`/porchfest/artists/${artist.id}`} className="artist-card">
            <div className="artist-image">
              {artist.imageUrl ? (
                <img src={artist.imageUrl} alt={artist.name} onError={(e) => {
                  e.target.style.display = 'none'
                  const placeholder = e.target.nextElementSibling
                  if (placeholder) placeholder.classList.add('visible')
                }} />
              ) : null}
              <div className={`artist-placeholder ${!artist.imageUrl ? 'visible' : ''}`}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </div>
            </div>
            <div className="artist-info">
              <h3>{artist.name}</h3>
              <span className="artist-day">{artist.day}</span>
            </div>
          </Link>
        ))}
      </div>

      {filteredArtists.length === 0 && (
        <div className="no-artists">
          <p>No artists found for this day</p>
        </div>
      )}

      {/* Back Link */}
      <div className="back-link-container">
        <Link to="/porchfest" className="back-link">← Back to PorchFest</Link>
      </div>
    </div>
  )
}

export default FeaturedArtistsPage
