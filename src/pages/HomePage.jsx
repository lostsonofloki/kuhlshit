import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import data from "../data/data.json";
import SEO from "../components/SEO";
import SiteWideJsonLd from "../components/SiteWideJsonLd";
import { GLOBAL_SEO_DEFAULT_PROPS } from "../constants/seoDefaults";
import CreatorCategories from "../components/CreatorCategories";
import ClosedOnSundayLivePromo from "../components/ClosedOnSundayLivePromo";
import UpcomingAtAlsStrip from "../components/UpcomingAtAlsStrip";
import AlsPackageStoreJingle from "../components/AlsPackageStoreJingle";
import SmartImage from "../components/SmartImage";
import "./HomePage.css";

const CREATOR_SUBTITLE = [
  "Musicians",
  "Painters",
  "Poets",
  "Photographers",
  "Filmmakers",
];

const FIRE_CAMINO_JINGLE_URL = data.artists.find((a) => a.id === "fire-camino")
  ?.jingle?.audioUrl;

/** How often the home “Meet the Creators” trio advances through the full roster. */
const MEET_CREATORS_ROTATE_MS = 6000;

/** PorchFest hub event for Vault teaser — not every `porchfest.events` row is a PorchFest festival. */
function selectVaultTeaserEvent(events) {
  if (!events?.length) return null;
  const byId = events.find((e) => e.id === "pf-001");
  if (byId) return byId;
  const byName = events.find((e) =>
    /porchfest/i.test(e.name || "")
  );
  if (byName) return byName;
  const bySlug = events.find(
    (e) => e.slug && /porchfest/i.test(String(e.slug))
  );
  if (bySlug) return bySlug;
  return [...events].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )[0];
}

/** Fallback CTA when `vaultLinks` is absent — label from event name/date, not a hard-coded year. */
function revisitPorchFestLabel(event) {
  if (!event) return "Revisit PorchFest";
  const fromName = String(event.name || "").match(/(20\d{2})/);
  if (fromName) return `Revisit PorchFest ${fromName[1]}`;
  const d = event.date;
  if (d && /^\d{4}-\d{2}-\d{2}$/.test(String(d)))
    return `Revisit PorchFest ${String(d).slice(0, 4)}`;
  if (/porchfest/i.test(String(event.name || ""))) return `Revisit ${event.name}`;
  return "Revisit PorchFest";
}

function HomePage() {
  const [rotateIndex, setRotateIndex] = useState(0);
  const [vaultEvent, setVaultEvent] = useState(null);
  /** Bumps when the local clock hour changes so the hourly shuffle can refresh. */
  const [hourSeed, setHourSeed] = useState(() => new Date().getHours());

  useEffect(() => {
    const tick = () => {
      const h = new Date().getHours();
      setHourSeed((prev) => (prev !== h ? h : prev));
    };
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  /**
   * Full roster from `data.artists`, order shuffled with a seed derived from the viewer’s
   * local clock hour (checked every minute). Order stays stable until the hour changes.
   */
  const shuffledArtists = useMemo(() => {
    const allArtists = [...data.artists];
    if (!allArtists.length) return [];

    const seededRandom = (index) => {
      const x = Math.sin(hourSeed * 1000 + index) * 10000;
      return x - Math.floor(x);
    };

    const shuffled = [...allArtists];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(i) * (i + 1));
      const temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
    return shuffled;
  }, [hourSeed]);

  useEffect(() => {
    setRotateIndex(0);
  }, [hourSeed]);

  const featuredArtists = useMemo(() => {
    if (!shuffledArtists.length) return [];
    const n = shuffledArtists.length;
    const count = Math.min(3, n);
    return Array.from({ length: count }, (_, k) => shuffledArtists[(rotateIndex + k) % n]);
  }, [shuffledArtists, rotateIndex]);

  useEffect(() => {
    if (!shuffledArtists.length) return undefined;
    const id = window.setInterval(() => {
      setRotateIndex((i) => (i + 1) % shuffledArtists.length);
    }, MEET_CREATORS_ROTATE_MS);
    return () => window.clearInterval(id);
  }, [shuffledArtists.length, hourSeed]);

  useEffect(() => {
    // Vault teaser: prefer the main PorchFest festival (pf-001), not other dated hub items.
    const teaser = selectVaultTeaserEvent(data.porchfest?.events);
    if (teaser) setVaultEvent(teaser);
  }, []);

  return (
    <>
      <SEO {...GLOBAL_SEO_DEFAULT_PROPS} />
      <SiteWideJsonLd />
      <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-title-wrapper">
            <p className="hero-welcome">
              <span className="hero-brand-mark">Kuhl Shit</span>
              <span className="hero-welcome-sep"> — </span>
              <span className="hero-welcome-tagline">a home for creators</span>
            </p>
            <h1 className="hero-title">Kuhlshit.com</h1>
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
              to="/porchfest"
              className="btn btn-ghost hero-tertiary-cta"
            >
              PorchFest archive
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
          sizes="(max-width: 768px) 140px, 220px"
          loading="eager"
          fetchPriority="high"
        />
      </section>

      <div className="home-listening-lounge">
        <ClosedOnSundayLivePromo />
        <UpcomingAtAlsStrip />
        {FIRE_CAMINO_JINGLE_URL ? (
          <AlsPackageStoreJingle audioUrl={FIRE_CAMINO_JINGLE_URL} />
        ) : null}
      </div>

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
              Listening-room performances — short sets to camera. (Tell people to bring a chair.)
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
                : [vaultEvent.location?.city, vaultEvent.location?.state]
                    .filter(Boolean)
                    .join(", ") || "Columbus, MS"}
            </p>
            <p className="vault-teaser-body">
              {vaultEvent.description ||
                "Our first field test. Three days, dozens of bands, one yard in Columbus, MS — the spark that proved this platform belongs in the wild. The lineup lives on for the artists who played it."}
            </p>
            <div className="vault-teaser-actions">
              {vaultEvent.vaultLinks ? (
                <>
                  <Link
                    to={vaultEvent.vaultLinks.primary.to}
                    className="btn btn-secondary"
                  >
                    {vaultEvent.vaultLinks.primary.label}
                  </Link>
                  <Link
                    to={vaultEvent.vaultLinks.secondary.to}
                    className="btn btn-ghost"
                  >
                    {vaultEvent.vaultLinks.secondary.label}
                  </Link>
                  {vaultEvent.vaultLinks.tertiary ? (
                    <Link
                      to={vaultEvent.vaultLinks.tertiary.to}
                      className="btn btn-ghost"
                    >
                      {vaultEvent.vaultLinks.tertiary.label}
                    </Link>
                  ) : null}
                </>
              ) : (
                <>
                  <Link to="/porchfest" className="btn btn-secondary">
                    {revisitPorchFestLabel(vaultEvent)}
                  </Link>
                  <Link to="/porchfest/artists" className="btn btn-ghost">
                    See the Artists
                  </Link>
                </>
              )}
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
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 320px"
                    className={
                      artist.cardImageFit === "contain"
                        ? "artist-image-fit-contain"
                        : ""
                    }
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
    </>
  );
}

export default HomePage;
