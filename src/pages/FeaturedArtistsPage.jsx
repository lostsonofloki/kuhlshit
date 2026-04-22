import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import data from '../data/data.json'
import ScheduleBadges from '../components/ScheduleBadges'
import SmartImage from '../components/SmartImage'
import { useFestivalClock } from '../hooks/useFestivalClock'
import { getArtistSlotStatusFromData } from '../utils/porchfestScheduleStatus'
import './FeaturedArtists.css'

function FeaturedArtistsPage() {
  const now = useFestivalClock()
  const venueMapUrl = data.porchfest?.events?.[0]?.location?.mapUrl
  const [artists, setArtists] = useState([])
  const [selectedDay, setSelectedDay] = useState('all')

  useEffect(() => {
    // Extract artists from PorchFest lineup
    const event = data.porchfest.events[0]
    if (event && event.lineup) {
      const allArtists = []
      
      event.lineup.forEach(daySchedule => {
        daySchedule.artists.forEach(entry => {
          const artistName = typeof entry === 'string' ? entry : entry?.name
          if (!artistName) return
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
        <p className="event-dates">
          April 17-19 •{' '}
          {venueMapUrl ? (
            <a
              href={venueMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#d48c29', textDecoration: 'underline' }}
            >
              Munson & Brothers
            </a>
          ) : (
            'Munson & Brothers'
          )}{' '}
          • Columbus, MS
        </p>
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
                <SmartImage
                  src={artist.imageUrl}
                  alt={artist.name}
                  width="400"
                  height="400"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    const picture = e.target.closest('picture')
                    const placeholder = (picture || e.target).nextElementSibling
                    if (placeholder) placeholder.classList.add('visible')
                  }}
                />
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
              <h3 className="featured-artist-title">
                <span>{artist.name}</span>
                <ScheduleBadges status={getArtistSlotStatusFromData(artist.name, data, now)} />
              </h3>
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
