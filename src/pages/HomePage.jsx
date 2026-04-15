import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import data from "../data/data.json";
import CountdownTimer from "../components/CountdownTimer";
import TheVibe from "../components/TheVibe";
import MerchSection from "../components/MerchSection";
import "./HomePage.css";

function toCalendarDate(value, addDays = 0) {
  const base = new Date(`${value}T00:00:00`);
  base.setDate(base.getDate() + addDays);
  const y = base.getFullYear();
  const m = String(base.getMonth() + 1).padStart(2, "0");
  const d = String(base.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function buildCalendarUrl(event) {
  const title = event?.name || "PorchFest 2026";
  const location = `${event?.location?.venue || "Munson & Brothers"}, ${event?.location?.address || "301 2nd Ave N"}, ${event?.location?.city || "Columbus"}, ${event?.location?.state || "MS"}`;
  const details =
    event?.description ||
    "Live music, local vibes. Join us April 17-19 at Munson & Brothers in Columbus, MS.";
  const start = toCalendarDate(event?.date || "2026-04-17");
  const endExclusive = toCalendarDate(
    event?.endDate || event?.date || "2026-04-19",
    1,
  );
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start}/${endExclusive}`,
    details,
    location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function HomePage() {
  const [featuredArtists, setFeaturedArtists] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    // Get all artists with images
    const allArtists = data.artists.filter((artist) => artist.imageUrl);

    // Rotate featured artists based on hour of day with random shuffle
    const currentHour = new Date().getHours();
    const artistCount = allArtists.length;

    if (artistCount > 0) {
      // Create a seeded random shuffle based on current hour
      // This ensures same random selection for all users during the same hour
      const seed = currentHour;

      // Seeded random number generator
      const seededRandom = (index) => {
        const x = Math.sin(seed * 1000 + index) * 10000;
        return x - Math.floor(x);
      };

      // Fisher-Yates shuffle with seed
      const shuffled = [...allArtists];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom(i) * (i + 1));
        const temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
      }

      // Take first 3 from shuffled array
      const featured = shuffled.slice(0, 3);
      setFeaturedArtists(featured);
    }

    // Get upcoming events (sorted by date)
    const events = data.porchfest.events
      .filter((event) => new Date(event.date) >= new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 2);
    setUpcomingEvents(events);
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-title-wrapper">
            <p className="hero-welcome">Welcome You to</p>
            <h1 className="hero-title">KUHLSHIT.COM</h1>
          </div>
          <p className="hero-subtitle">
            <span className="hero-highlight">Porch Talk</span> •
            <span className="hero-highlight"> Closed on Sundays</span> •
            <span className="hero-highlight"> Al&apos;s Spirits & Music</span>
          </p>

          <CountdownTimer />

          <div className="hero-buttons">
            <Link to="/porchfest/artists" className="btn btn-primary">
              See the Lineup
            </Link>
            <Link to="/closed-on-sundays" className="btn btn-secondary">
              Closed on Sundays
            </Link>
          </div>
        </div>
        <div className="hero-bg">
          <div className="hero-bg-overlay"></div>
        </div>

        {/* Mascot - Skeleton Cat Sticker */}
        <img
          src="/resources/porchfest/mascot-cat.png"
          alt="PorchFest Mascot"
          className="hero-mascot"
        />
      </section>

      {/* PorchFest Section */}
      <section className="section porchfest-section">
        <div className="section-header">
          <h2>PorchFest 2026</h2>
          <Link to="/porchfest" className="view-all">
            Full Lineup →
          </Link>
        </div>
        <div className="events-grid">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-date-actions">
                <div className="event-date">
                  <span className="month">Apr</span>
                  <span className="day">17-19</span>
                </div>
                <a
                  href={buildCalendarUrl(event)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary home-calendar-btn"
                >
                  Add to Calendar
                </a>
              </div>
              <div className="event-content">
                <h3>{event.name}</h3>
                {event.pricing && (
                  <div className="event-pricing">
                    <span className="price-badge-small">
                      {event.pricing.dayPass}/Day
                    </span>
                    <span className="price-badge-small">
                      {event.pricing.weekendPass} Weekend Pass
                    </span>
                    <span className="price-note">{event.pricing.note}</span>
                  </div>
                )}
                <p className="event-location">
                  {event.location.mapUrl && event.location.venue ? (
                    <>
                      <a
                        href={event.location.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="event-venue-link"
                      >
                        {event.location.venue}
                      </a>
                      , {event.location.state}
                    </>
                  ) : (
                    <>
                      {event.location.venue || event.location.city},{" "}
                      {event.location.state}
                    </>
                  )}
                </p>

                {/* Schedule */}
                {event.schedule && event.schedule.length > 0 && (
                  <div className="event-schedule-home">
                    {event.schedule.map((day, i) => (
                      <span key={i} className="schedule-chip">
                        {day.day}: {day.doors}–{day.endTime}
                      </span>
                    ))}
                  </div>
                )}

                <p className="event-description">{event.description}</p>
                <div className="event-lineup">
                  <span className="lineup-label">Lineup:</span>
                  {event.lineup.map((day, i) => (
                    <span key={i} className="artist-name">
                      {day.day}: {day.artists.length} bands
                    </span>
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
            {featuredArtists.map((artist) => (
              <Link
                key={artist.id}
                to={`/porchfest/artists/${artist.id}`}
                className="artist-card"
              >
                <div className="artist-card-image">
                  <img
                    src={artist.imageUrl || "/resources/placeholder-artist.svg"}
                    alt={artist.name}
                    onError={(e) => {
                      e.target.src = "/resources/placeholder-artist.svg";
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
          <Link to="/closed-on-sundays" className="view-all">
            All Episodes →
          </Link>
        </div>
        <div className="cta-content">
          <p>Podcast/YouTube featuring musicians playing 3-4 song sets</p>
          <div className="cta-buttons">
            <Link to="/closed-on-sundays" className="btn btn-primary">
              Watch Episodes
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="cta-content">
          <h2>Explore More</h2>
          <p>Check out PorchTalk episodes and more.</p>
          <div className="cta-buttons">
            <Link to="/porch-talk" className="btn btn-primary">
              PorchTalk
            </Link>
            <Link to="/closed-on-sundays" className="btn btn-secondary">
              Closed on Sundays
            </Link>
          </div>
        </div>
      </section>

      {/* The Vibe - Full-width hero with PorchFest poster art */}
      <TheVibe />

      {/* Merch Section */}
      <MerchSection />
    </div>
  );
}

export default HomePage;
