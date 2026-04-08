import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import data from '../data/data.json'
import TicketMerch from '../components/TicketMerch'
import './PorchFestPage.css'

function PorchFestPage() {
  const [events, setEvents] = useState([])
  const [artistMap, setArtistMap] = useState({})

  useEffect(() => {
    const upcomingEvents = data.porchfest.events
      .filter(event => new Date(event.date) >= new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date))
    setEvents(upcomingEvents)

    // Build a lookup map: artist name -> artist object
    const map = {}
    data.artists.forEach(artist => {
      map[artist.name] = artist
    })
    setArtistMap(map)
  }, [])

  return (
    <div className="porchfest-page">
      <div className="page-header">
        <h1>PorchFest</h1>
      </div>

      {/* Official Poster */}
      <div className="poster-section">
        <div className="poster-wrapper">
          <img src="/resources/porchfest/poster.jpg" alt="PorchFest 2026 Official Poster" className="poster-image" />
          <a href="/resources/porchfest/poster.jpg" download className="poster-download">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Poster
          </a>
        </div>
      </div>

      <div className="events-section">
        {events.length > 0 ? (
          <div className="events-list">
            {events.map(event => (
              <div key={event.id} className="event-detail-card">
                <div className="event-header">
                  <div className="event-date-badge">
                    <span className="month">Apr</span>
                    <span className="day">17-19</span>
                    <span className="year">2026</span>
                  </div>
                  <div className="event-info">
                    <h2>{event.name}</h2>

                    {/* Pricing Badges */}
                    {event.pricing && (
                      <div className="pricing-row">
                        <span className="price-badge-lg">{event.pricing.dayPass}/Day</span>
                        <span className="price-badge-lg highlight">{event.pricing.weekendPass} Weekend Pass</span>
                        <span className="pricing-note">{event.pricing.note}</span>
                      </div>
                    )}

                    {/* Schedule */}
                    {event.schedule && event.schedule.length > 0 && (
                      <div className="schedule-row">
                        {event.schedule.map((day, i) => (
                          <div key={i} className="schedule-item">
                            <span className="schedule-day">{day.day}</span>
                            <span className="schedule-time">{day.doors} — {day.endTime}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="event-location">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {event.location.venue && <span>{event.location.venue} • </span>}
                      {event.location.address}, {event.location.city}, {event.location.state}
                    </p>
                  </div>
                </div>

                <div className="event-body">
                  <p className="event-description">{event.description}</p>

                  {/* Day-based Lineup */}
                  <div className="event-lineup-section">
                    <h3>Full Lineup</h3>
                    <div className="lineup-by-day">
                      {event.lineup.map((daySchedule, index) => (
                        <div key={index} className="day-schedule">
                          <h4 className="day-title">
                            {daySchedule.day}
                            {event.schedule && event.schedule[index] && (
                              <span className="day-schedule-time">{event.schedule[index].doors} — {event.schedule[index].endTime}</span>
                            )}
                          </h4>
                          <div className="artist-list">
                            {daySchedule.artists.map((artistName, artistIndex) => {
                              const artistData = artistMap[artistName]
                              if (artistData) {
                                return (
                                  <Link
                                    key={artistIndex}
                                    to={`/porchfest/artists/${artistData.id}`}
                                    className="artist-item artist-link"
                                  >
                                    <span className="artist-bullet">♪</span>
                                    <span className="artist-name">{artistName}</span>
                                    {artistData.genre && (
                                      <span className="artist-mini-genre">{artistData.genre}</span>
                                    )}
                                  </Link>
                                )
                              }
                              return (
                                <div key={artistIndex} className="artist-item">
                                  <span className="artist-bullet">♪</span>
                                  <span className="artist-name">{artistName}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="event-actions">
                    <Link to="/porchfest/artists" className="btn btn-primary">
                      View All Artists →
                    </Link>
                    {event.infoUrl && (
                      <a href={event.infoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                        More Info
                      </a>
                    )}
                    {event.location.mapUrl && (
                      <a href={event.location.mapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                        View Map
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-events">
            <h2>No Upcoming Events</h2>
            <p>Check back soon for new PorchFest dates!</p>
          </div>
        )}
      </div>

      {/* Tickets & Merch */}
      <TicketMerch />

      <div className="back-link-container">
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    </div>
  )
}

export default PorchFestPage
