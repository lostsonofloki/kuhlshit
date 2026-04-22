import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import data from "../data/data.json";
import CreatorCategories from "../components/CreatorCategories";
import SmartImage from "../components/SmartImage";
import "./HomePage.css";

const CREATOR_SUBTITLE = [
  "Musicians",
  "Painters",
  "Poets",
  "Photographers",
  "Filmmakers",
];

function HomePage() {
  const [featuredArtists, setFeaturedArtists] = useState([]);
  const [vaultEvent, setVaultEvent] = useState(null);

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

    // Pull the most recent PorchFest event from data to surface as a Vault teaser.
    const recent = (data.porchfest?.events || [])
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    if (recent) setVaultEvent(recent);
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-title-wrapper">
            <p className="hero-welcome">A home for creators</p>
            <h1 className="hero-title">KUHLSHIT.COM</h1>
          </div>
          <p className="hero-subtitle hero-subtitle--rotator">
            {CREATOR_SUBTITLE.map((word, idx) => (
              <span key={word} className="hero-highlight">
                {word}
                {idx < CREATOR_SUBTITLE.length - 1 ? " • " : ""}
              </span>
            ))}
          </p>

          <p className="hero-pitch">
            A global stage for musicians, painters, and poets — built by
            creators, for creators. Your own space on the web.
          </p>

          <div className="hero-buttons">
            <Link
              to="/closed-on-sundays"
              className="btn btn-primary hero-primary-cta"
            >
              Watch Closed on Sundays
            </Link>
            <Link
              to="/porch-talk"
              className="btn btn-secondary hero-secondary-cta"
            >
              PorchTalk
            </Link>
            <Link
              to="/porchfest/artists"
              className="btn btn-ghost hero-tertiary-cta"
            >
              Browse artists
            </Link>
          </div>
          <p className="hero-waitlist-note">
            Building a home for your work on the web?{" "}
            <Link to="/waitlist">Join the creator waitlist</Link>.
          </p>
        </div>
        <div className="hero-bg">
          <div className="hero-bg-overlay"></div>
        </div>

        {/* Mascot — carried over from the PorchFest identity. LCP candidate. */}
        <SmartImage
          src="/resources/porchfest/mascot-cat.png"
          alt="Kuhlshit mascot"
          className="hero-mascot"
          width="280"
          height="280"
          loading="eager"
          fetchPriority="high"
        />
      </section>

      {/* Creator Categories — what the platform supports */}
      <CreatorCategories />

      {/* Closed on Sundays + PorchTalk — primary shows */}
      <section className="section showcase-section">
        <div className="section-header">
          <h2>Watch &amp; listen</h2>
        </div>
        <div className="showcase-grid">
          <div className="showcase-card">
            <h3>Closed on Sundays</h3>
            <p>
              Live-style sets from the yard — three or four songs at a time,
              straight to camera.
            </p>
            <div className="showcase-card-actions">
              <Link to="/closed-on-sundays" className="btn btn-primary">
                All episodes
              </Link>
            </div>
          </div>
          <div className="showcase-card">
            <h3>PorchTalk</h3>
            <p>
              Conversations with the artists behind the music — stories,
              process, and what comes next.
            </p>
            <div className="showcase-card-actions">
              <Link to="/porch-talk" className="btn btn-secondary">
                Interviews &amp; more
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* From the Vault — PorchFest proof-of-concept, archived */}
      {vaultEvent ? (
        <section className="section vault-teaser-section">
          <div className="section-header">
            <h2>From the Vault</h2>
            <Link to="/vault" className="view-all">
              Enter the Vault →
            </Link>
          </div>
          <div className="vault-teaser-card">
            <div className="vault-teaser-badge">Past Event</div>
            <h3>{vaultEvent.name}</h3>
            <p className="vault-teaser-location">
              {vaultEvent.location?.venue
                ? `${vaultEvent.location.venue} • ${vaultEvent.location.city}, ${vaultEvent.location.state}`
                : "Columbus, MS"}
            </p>
            <p className="vault-teaser-body">
              Our first field test. Three days, dozens of bands, one yard in
              Columbus, MS — the spark that proved this platform belongs in the
              wild. The lineup lives on for the artists who played it.
            </p>
            <div className="vault-teaser-actions">
              <Link to="/porchfest" className="btn btn-secondary">
                Revisit PorchFest 2026
              </Link>
              <Link to="/porchfest/artists" className="btn btn-ghost">
                See the Artists
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* Artists — reframed as the global discovery hub */}
      <section className="section artists-section">
        <div className="section-header">
          <h2>Meet the Creators</h2>
          <Link to="/porchfest/artists" className="view-all">
            Browse All →
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
                  <SmartImage
                    src={artist.imageUrl || "/resources/placeholder-artist.svg"}
                    alt={artist.name}
                    width="400"
                    height="400"
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

      <section className="section waitlist-inline-section" aria-label="Creator waitlist">
        <p className="waitlist-inline">
          Musicians, painters, poets — if you want your own space here when we
          open the doors,{" "}
          <Link to="/waitlist" className="waitlist-inline-link">
            add your name to the waitlist
          </Link>
          .
        </p>
      </section>
    </div>
  );
}

export default HomePage;
