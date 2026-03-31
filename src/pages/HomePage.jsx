import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import data from '../data/data.json'
import './HomePage.css'

function HomePage() {
  const [featuredArtists, setFeaturedArtists] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])

  useEffect(() => {
    // Get all artists with images
    const allArtists = data.artists.filter(artist => artist.imageUrl)

    // Rotate featured artists based on hour of day with random shuffle
    const currentHour = new Date().getHours()
    const artistCount = allArtists.length

    if (artistCount > 0) {
      // Create a seeded random shuffle based on current hour
      // This ensures same random selection for all users during the same hour
      const seed = currentHour

      // Seeded random number generator
      const seededRandom = (index) => {
        const x = Math.sin(seed * 1000 + index) * 10000
        return x - Math.floor(x)
      }

      // Fisher-Yates shuffle with seed
      const shuffled = [...allArtists]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom(i) * (i + 1))
        const temp = shuffled[i]
        shuffled[i] = shuffled[j]
        shuffled[j] = temp
      }

      // Take first 3 from shuffled array
      const featured = shuffled.slice(0, 3)
      setFeaturedArtists(featured)
    }

    // Get upcoming events (sorted by date)
    const events = data.porchfest.events
      .filter(event => new Date(event.date) >= new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 2)
    setUpcomingEvents(events)
  }, [])

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome You to Kuhlshit.com</h1>
          <p className="hero-subtitle">
            <span className="hero-highlight">Porch Talk</span> •
            <span className="hero-highlight"> Closed on Sundays</span> •
            <span className="hero-highlight"> Al's Spirits & Music</span>
          </p>
          <div className="hero-buttons">
            <Link to="/porchfest/artists" className="btn btn-primary">
              PorchFest Artists
            </Link>
            <Link to="/closed-on-sundays" className="btn btn-secondary">
              Closed on Sundays
            </Link>
          </div>
        </div>
        <div className="hero-bg">
          <div className="hero-bg-overlay"></div>
        </div>
      </section>

      {/* PorchFest Section */}
      <section className="section porchfest-section">
        <div className="section-header">
          <h2>PorchFest 2026</h2>
          <Link to="/porchfest" className="view-all">Full Lineup →</Link>
        </div>
        <div className="events-grid">
          {upcomingEvents.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-date">
                <span className="month">Apr</span>
                <span className="day">17-19</span>
              </div>
              <div className="event-content">
                <h3>{event.name}</h3>
                <p className="event-location">{event.location.venue || event.location.city}, {event.location.state}</p>
                <p className="event-description">{event.description}</p>
                <div className="event-lineup">
                  <span className="lineup-label">Lineup:</span>
                  {event.lineup.slice(0, 2).map((day, i) => (
                    <span key={i} className="artist-name">{day.day}: {day.artists.length} bands</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Artists Section */}
      <section className="section artists-section">
        <div className="section-header">
          <h2>Featured Artists</h2>
          <Link to="/porchfest/artists" className="view-all">
            View All Artists →
          </Link>
        </div>
        {featuredArtists.length > 0 ? (
          <div className="artists-grid">
            {featuredArtists.map(artist => (
              <Link key={artist.id} to={`/porchfest/artists/${artist.id}`} className="artist-card">
                <div className="artist-card-image">
                  <img
                    src={artist.imageUrl || '/resources/placeholder-artist.jpg'}
                    alt={artist.name}
                    onError={(e) => {
                      e.target.src = '/resources/placeholder-artist.jpg'
                    }}
                  />
                  <div className="artist-card-overlay">
                    <div className="play-icon">▶</div>
                  </div>
                </div>
                <div className="artist-card-content">
                  <h3 className="artist-card-name">{artist.name}</h3>
                  {artist.genre && (
                    <p className="artist-card-genre">{artist.genre}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="no-artists">
            <p>Artists will be announced soon!</p>
          </div>
        )}
      </section>

      {/* Closed on Sundays Section */}
      <section className="section closed-on-sundays-section">
        <div className="section-header">
          <h2>Closed on Sundays</h2>
          <Link to="/closed-on-sundays" className="view-all">All Episodes →</Link>
        </div>
        <div className="cta-content">
          <p>Podcast/YouTube featuring musicians playing 3-4 song sets</p>
          <div className="cta-buttons">
            <Link to="/closed-on-sundays" className="btn btn-primary">Watch Episodes</Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="cta-content">
          <h2>Explore More</h2>
          <p>Check out PorchTalk episodes and more.</p>
          <div className="cta-buttons">
            <Link to="/porch-talk" className="btn btn-primary">PorchTalk</Link>
            <Link to="/closed-on-sundays" className="btn btn-secondary">Closed on Sundays</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
