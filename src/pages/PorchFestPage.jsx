import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import data from '../data/data.json'
import TicketMerch from '../components/TicketMerch'
import ScheduleBadges from '../components/ScheduleBadges'
import { useFestivalClock } from '../hooks/useFestivalClock'
import { getSlotStatus } from '../utils/porchfestScheduleStatus'
import './PorchFestPage.css'

function PorchFestPage() {
  const now = useFestivalClock()
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
                      {event.location.venue && (
                        <>
                          {event.location.mapUrl ? (
                            <a
                              href={event.location.mapUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="event-venue-link"
                            >
                              {event.location.venue}
                            </a>
                          ) : (
                            <span>{event.location.venue}</span>
                          )}
                          <span> • </span>
                        </>
                      )}
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
                            {daySchedule.artists.map((artistEntry, artistIndex) => {
                              const artistName =
                                typeof artistEntry === 'string' ? artistEntry : artistEntry?.name
                              const slotStatus = getSlotStatus(artistEntry, daySchedule.day, event, now)
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
                                    <ScheduleBadges status={slotStatus} />
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
                                  <ScheduleBadges status={slotStatus} />
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
                    {event.location.website && (
                      <a href={event.location.website} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                        Venue website
                      </a>
                    )}
                    {event.location.socialLinks && (
                      <div className="venue-socials">
                        {event.location.socialLinks.facebook && (
                          <a href={event.location.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                          </a>
                        )}
                        {event.location.socialLinks.instagram && (
                          <a href={event.location.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                          </a>
                        )}
                      </div>
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
