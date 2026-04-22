import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import GigTracker from "../components/GigTracker";
import SEO from "../components/SEO";
import SmartImage from "../components/SmartImage";
import MusicianBody from "../components/creatorLayouts/MusicianBody";
import VisualArtistBody from "../components/creatorLayouts/VisualArtistBody";
import WriterBody from "../components/creatorLayouts/WriterBody";
import {
  GLOBAL_SEO_DEFAULT_PROPS,
  PORCHFEST_SEO_DEFAULT_PROPS,
} from "../constants/seoDefaults";
import { useCachedFestivalData } from "../hooks/useCachedFestivalData";
import { normalizeLineupEntry } from "../utils/porchfestScheduleStatus";
import { trackEvent } from "../utils/analytics";
import "./ArtistDetail.css";

function truncateMetaDescription(text, max = 155) {
  if (!text || typeof text !== "string") return "";
  const t = text.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trim()}…`;
}

function resolveCreatorType(artist) {
  const raw = String(artist?.creatorType || "musician").toLowerCase();
  if (raw === "visual" || raw === "painter" || raw === "photographer")
    return "visual";
  if (raw === "writer" || raw === "poet") return "writer";
  return "musician";
}

function ArtistDetailPage() {
  const { artistId } = useParams();
  const { data } = useCachedFestivalData();
  const [artist, setArtist] = useState(null);
  const [shareFeedback, setShareFeedback] = useState("");
  const venueMapUrl = data.porchfest?.events?.[0]?.location?.mapUrl;

  useEffect(() => {
    const foundArtist = (data?.artists || []).find(
      (a) =>
        a.id === artistId ||
        a.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === artistId,
    );
    setArtist(foundArtist || null);
  }, [artistId, data]);

  const getPerformanceDays = () => {
    const event = data.porchfest?.events?.[0];
    if (!event?.lineup || !artist) return [];
    return event.lineup
      .filter((day) =>
        (day.artists || []).some(
          (entry) =>
            normalizeLineupEntry(entry).name.trim().toLowerCase() ===
            artist.name.trim().toLowerCase(),
        ),
      )
      .map((day) => day.day);
  };

  if (!artist) {
    return (
      <>
        <SEO
          title="Artist not found | kuhlshit.com"
          description={GLOBAL_SEO_DEFAULT_PROPS.description}
          image={GLOBAL_SEO_DEFAULT_PROPS.image}
          path="/porchfest/artists"
        />
        <div className="artist-detail-page">
          <div className="loading">
            <h2>Artist not found</h2>
            <Link to="/porchfest/artists" className="btn btn-primary">
              ← Back to Artists
            </Link>
          </div>
        </div>
      </>
    );
  }

  const creatorType = resolveCreatorType(artist);
  const shareDescription =
    truncateMetaDescription(artist.bio) ||
    PORCHFEST_SEO_DEFAULT_PROPS.description;
  const shareImage =
    artist.imageUrl || artist.thumbnailUrl || PORCHFEST_SEO_DEFAULT_PROPS.image;

  const handleShareArtist = async () => {
    const shareTitle = `${artist.name} | kuhlshit.com`;
    const shareText = `Check out ${artist.name} on kuhlshit.com`;
    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        trackEvent("share", {
          method: "web_share",
          content_type: "artist",
          item_id: artist.id,
          creator_type: creatorType,
        });
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setShareFeedback("Link copied");
        window.setTimeout(() => setShareFeedback(""), 1800);
        trackEvent("share", {
          method: "clipboard",
          content_type: "artist",
          item_id: artist.id,
          creator_type: creatorType,
        });
        return;
      }
    } catch {
      // User canceled share or browser blocked clipboard; silent fallback below.
    }

    setShareFeedback("Copy this link: " + shareUrl);
    window.setTimeout(() => setShareFeedback(""), 2800);
    trackEvent("share", {
      method: "manual_copy",
      content_type: "artist",
      item_id: artist.id,
      creator_type: creatorType,
    });
  };

  const performanceDays = getPerformanceDays();

  return (
    <>
      <SEO
        title={`${artist.name} | kuhlshit.com`}
        description={shareDescription}
        image={shareImage}
        path={`/porchfest/artists/${artist.id}`}
      />
      <div
        className={`artist-detail-page artist-detail-page--${creatorType}`}
      >
        {/* Hero Section — shared across all creator types */}
        <div className="artist-hero">
          <div className="artist-hero-bg">
            {artist.imageUrl ? (
              <SmartImage
                src={artist.imageUrl}
                alt={artist.name}
                width="800"
                height="800"
                loading="eager"
                fetchPriority="high"
                onError={(e) => {
                  e.target.style.display = "none";
                  const picture = e.target.closest("picture");
                  const placeholder = (picture || e.target).nextElementSibling;
                  if (placeholder) placeholder.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className="artist-hero-placeholder"
              style={{ display: artist.imageUrl ? "none" : "flex" }}
            >
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="overlay"></div>
          </div>
          <div className="artist-hero-content">
            <h1>{artist.name}</h1>
            {artist.location && (
              <p className="artist-location">{artist.location}</p>
            )}
            {artist.genre && (
              <span className="artist-genre">{artist.genre}</span>
            )}
          </div>
        </div>

        {/* Body — morphs per creator type */}
        {creatorType === "visual" ? (
          <VisualArtistBody artist={artist} />
        ) : creatorType === "writer" ? (
          <WriterBody artist={artist} />
        ) : (
          <MusicianBody
            artist={artist}
            venueMapUrl={venueMapUrl}
            performanceDays={performanceDays}
          />
        )}

        {/* Shared: gig tracker only makes sense for musicians */}
        {creatorType === "musician" ? (
          <div className="artist-content artist-content--tail">
            <GigTracker artistSlug={artist.bandsintown_slug} />
          </div>
        ) : null}

        {/* Shared: back link */}
        <div className="artist-content artist-content--tail">
          <div className="back-link-container">
            <Link to="/porchfest/artists" className="back-link">
              ← Back to Artists
            </Link>
          </div>
        </div>

        <button
          type="button"
          className="artist-share-fab"
          onClick={handleShareArtist}
          aria-label={`Share ${artist.name} profile`}
        >
          Share Artist
        </button>
        {shareFeedback ? (
          <div className="artist-share-toast" role="status" aria-live="polite">
            {shareFeedback}
          </div>
        ) : null}
      </div>
    </>
  );
}

export default ArtistDetailPage;
