import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import data from '../data/data.json'
import './PorchFestPage.css'

function PorchFestPage() {
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    const upcomingEvents = data.porchfest.events
      .filter(event => new Date(event.date) >= new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date))
    setEvents(upcomingEvents)
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="porchfest-page">
      <div className="page-header">
        <h1>PorchFest</h1>
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
                    <p className="event-time">
                      {formatTime(event.time)} - {formatTime(event.endTime)}
                    </p>
                    <p className="event-location">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {event.location.venue && <span>{event.location.venue} • </span>}
                      {event.location.address}, {event.location.city}, {event.location.state}
                    </p>
                    <p className="event-days">
                      <span className="days-highlight">Friday • Saturday • Sunday</span>
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
                          <h4 className="day-title">{daySchedule.day}</h4>
                          <div className="artist-list">
                            {daySchedule.artists.map((artistName, artistIndex) => (
                              <div key={artistIndex} className="artist-item">
                                <span className="artist-bullet">♪</span>
                                <span className="artist-name">{artistName}</span>
                              </div>
                            ))}
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

      <div className="back-link-container">
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    </div>
  )
}

export default PorchFestPage
