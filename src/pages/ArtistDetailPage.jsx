import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import GigTracker from "../components/GigTracker";
import SEO from "../components/SEO";
import { PORCHFEST_SEO_DEFAULT_PROPS } from "../constants/seoDefaults";
import { useCachedFestivalData } from "../hooks/useCachedFestivalData";
import { normalizeLineupEntry } from "../utils/porchfestScheduleStatus";
import "./ArtistDetail.css";

function truncateMetaDescription(text, max = 155) {
  if (!text || typeof text !== "string") return "";
  const t = text.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trim()}…`;
}

function ArtistDetailPage() {
  const { artistId } = useParams();
  const { data } = useCachedFestivalData();
  const [artist, setArtist] = useState(null);
  const venueMapUrl = data.porchfest?.events?.[0]?.location?.mapUrl;

  useEffect(() => {
    // Find artist by ID or name slug
    const foundArtist = (data?.artists || []).find(
      (a) =>
        a.id === artistId ||
        a.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === artistId,
    );

    if (foundArtist) {
      setArtist(foundArtist);
    } else {
      setArtist(null);
    }
  }, [artistId, data]);

  // Look up the artist's performance day(s) from the schedule
  const getPerformanceDays = () => {
    const event = data.porchfest?.events?.[0];
    if (!event?.lineup) return [];
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
          description={PORCHFEST_SEO_DEFAULT_PROPS.description}
          image={PORCHFEST_SEO_DEFAULT_PROPS.image}
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

  const shareDescription =
    truncateMetaDescription(artist.bio) ||
    PORCHFEST_SEO_DEFAULT_PROPS.description;
  const shareImage =
    artist.imageUrl || artist.thumbnailUrl || PORCHFEST_SEO_DEFAULT_PROPS.image;

  return (
    <>
      <SEO
        title={`${artist.name} | PorchFest 2026 | kuhlshit.com`}
        description={shareDescription}
        image={shareImage}
        path={`/porchfest/artists/${artist.id}`}
      />
      <div className="artist-detail-page">
        {/* Hero Section */}
        <div className="artist-hero">
          <div className="artist-hero-bg">
            {artist.imageUrl ? (
              <img
                src={artist.imageUrl}
                alt={artist.name}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextElementSibling.style.display = "flex";
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

        {/* Content */}
        <div className="artist-content">
          {/* Bio */}
          <div className="artist-section">
            <h2>About</h2>
            <p className="artist-bio">{artist.bio}</p>
          </div>

          {/* Social Links */}
          {artist.socialLinks &&
            (artist.socialLinks.facebook ||
              artist.socialLinks.instagram ||
              artist.socialLinks.youtube ||
              artist.socialLinks.website) && (
              <div className="artist-section">
                <h2>Connect</h2>
                <div className="social-links">
                  {artist.socialLinks.website && (
                    <a
                      href={artist.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="artist-social-link"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      <span>Website</span>
                    </a>
                  )}
                  {artist.socialLinks.facebook && (
                    <a
                      href={artist.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="artist-social-link"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span>Facebook</span>
                    </a>
                  )}
                  {artist.socialLinks.instagram && (
                    <a
                      href={artist.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="artist-social-link"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="2"
                          y="2"
                          width="20"
                          height="20"
                          rx="5"
                          ry="5"
                        />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                      <span>Instagram</span>
                    </a>
                  )}
                  {artist.socialLinks.youtube && (
                    <a
                      href={artist.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="artist-social-link"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                      <span>YouTube</span>
                    </a>
                  )}
                </div>
              </div>
            )}

          {/* Videos */}
          {artist.videos && artist.videos.length > 0 && (
            <div className="artist-section">
              <h2>Videos</h2>
              <div className="videos-grid">
                {artist.videos.map((video, index) => (
                  <div key={index} className="video-card">
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="video-link"
                    >
                      <div className="video-thumbnail">
                        <img src={video.thumbnail} alt={video.title} />
                        <div className="play-overlay">
                          <svg
                            width="60"
                            height="60"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="video-info">
                        <h4>{video.title}</h4>
                        <span className="video-source">{video.source}</span>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Music Links */}
          {artist.musicLinks &&
            (artist.musicLinks.spotify ||
              artist.musicLinks.appleMusic ||
              artist.musicLinks.youtube ||
              artist.musicLinks.amazonMusic ||
              artist.musicLinks.shazam ||
              artist.musicLinks.soundcloud ||
              artist.musicLinks.bandcamp) && (
              <div className="artist-section">
                <h2>Listen</h2>
                <div className="music-links">
                  {artist.musicLinks.spotify && (
                    <a
                      href={artist.musicLinks.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="music-link"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                      <span>Spotify</span>
                    </a>
                  )}
                  {artist.musicLinks.appleMusic && (
                    <a
                      href={artist.musicLinks.appleMusic}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="music-link"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                      </svg>
                      <span>Apple Music</span>
                    </a>
                  )}
                  {artist.musicLinks.youtube && (
                    <a
                      href={artist.musicLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="music-link"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                      <span>YouTube</span>
                    </a>
                  )}
                  {artist.musicLinks.soundcloud && (
                    <a
                      href={artist.musicLinks.soundcloud}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="music-link"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.008-.06-.05-.1-.1-.1m-.899.828c-.06 0-.091.037-.104.094L0 14.479l.172 1.282c.013.06.045.094.104.094.055 0 .096-.037.111-.094l.194-1.282-.194-1.332c-.015-.06-.056-.094-.111-.094m1.848-.789c-.063 0-.114.043-.122.107l-.221 2.105.221 2.059c.008.063.059.107.122.107.063 0 .114-.044.122-.107l.247-2.059-.247-2.105c-.008-.064-.059-.107-.122-.107m.824-.164c-.073 0-.128.049-.136.122l-.209 2.269.209 2.13c.008.073.063.122.136.122.071 0 .129-.049.137-.122l.233-2.13-.233-2.269c-.008-.073-.066-.122-.137-.122m.824-.087c-.083 0-.144.063-.15.145l-.196 2.356.196 2.189c.006.081.067.145.15.145.082 0 .145-.064.153-.145l.219-2.189-.22-2.356c-.007-.082-.07-.145-.152-.145m.824-.112c-.093 0-.162.072-.168.164l-.182 2.468.182 2.237c.006.094.075.164.168.164.092 0 .164-.07.17-.164l.205-2.237-.205-2.468c-.006-.092-.078-.164-.17-.164m.824-.102c-.103 0-.18.078-.186.182l-.169 2.57.169 2.279c.006.104.083.182.186.182.102 0 .181-.078.187-.182l.19-2.279-.19-2.57c-.006-.104-.085-.182-.187-.182m.824-.087c-.113 0-.197.087-.203.2l-.156 2.657.156 2.316c.006.113.09.2.203.2.111 0 .197-.087.203-.2l.176-2.316-.176-2.657c-.006-.113-.092-.2-.203-.2m.824-.102c-.121 0-.212.096-.219.217l-.144 2.759.144 2.354c.007.122.098.217.219.217.12 0 .213-.095.22-.217l.162-2.354-.162-2.759c-.007-.121-.1-.217-.22-.217m.824-.087c-.13 0-.23.105-.236.235l-.131 2.846.131 2.392c.006.131.106.235.236.235.129 0 .231-.104.238-.235l.147-2.392-.148-2.846c-.006-.13-.108-.235-.238-.235m.824-.061c-.141 0-.246.114-.252.253l-.119 2.907.119 2.429c.006.14.111.253.252.253.139 0 .246-.113.253-.253l.134-2.429-.134-2.907c-.007-.139-.114-.253-.253-.253m.824-.061c-.15 0-.263.12-.27.27l-.107 2.968.107 2.466c.007.15.12.27.27.27.148 0 .263-.12.27-.27l.12-2.466-.12-2.968c-.007-.15-.122-.27-.27-.27m.824-.044c-.16 0-.281.128-.287.287l-.095 3.012.095 2.499c.006.16.127.287.287.287.159 0 .282-.127.289-.287l.107-2.499-.107-3.012c-.007-.159-.13-.287-.289-.287m.824-.044c-.17 0-.296.137-.304.304l-.082 3.056.082 2.533c.008.169.134.304.304.304.169 0 .297-.135.305-.304l.092-2.533-.092-3.056c-.008-.167-.136-.304-.305-.304m.824-.027c-.18 0-.314.144-.32.322l-.07 3.083.07 2.566c.006.179.14.322.32.322.178 0 .314-.143.321-.322l.079-2.566-.08-3.083c-.006-.178-.142-.322-.32-.322m.824-.027c-.19 0-.33.152-.337.34l-.057 3.11.057 2.598c.007.19.147.34.337.34.189 0 .331-.15.338-.34l.064-2.598-.064-3.11c-.007-.188-.149-.34-.338-.34m2.063.34c-.135 0-.263.03-.38.082-.138-1.084-.883-1.86-1.785-2.015-.112-.019-.226-.029-.34-.029-.213 0-.42.033-.62.097-.093.029-.13.054-.142.115-.005.027.006.06.027.082.016.016.041.03.073.036.011.002.024.003.038.003.041 0 .08-.008.115-.024.155-.057.322-.087.493-.087.093 0 .186.009.277.028.773.142 1.403.787 1.538 1.682.007.047.047.082.096.082.026 0 .051-.01.07-.028.019-.017.03-.042.03-.069v-.007c-.003-.057-.004-.114-.004-.17 0-.455-.37-.825-.826-.825m1.657-.302c-.088 0-.17.008-.252.024-.16.032-.144.083-.128.136.008.027.026.052.05.073.024.02.053.034.083.04.012.002.023.003.034.003.043 0 .083-.01.119-.028.058-.029.12-.044.185-.044.144 0 .26.117.26.26s-.116.26-.26.26c-.112 0-.208-.07-.248-.17-.016-.04-.046-.07-.086-.084-.018-.006-.038-.01-.058-.01-.032 0-.063.01-.088.028-.026.018-.045.044-.056.073-.011.03-.013.063-.006.094.007.031.024.06.049.082.116.101.27.157.434.157.404 0 .734-.329.734-.734 0-.404-.33-.733-.734-.733m1.657-.027c-.124 0-.242.026-.35.072-.07.03-.108.08-.108.142 0 .03.008.059.023.084.016.026.038.047.064.063.026.015.055.024.084.025.011 0 .022 0 .033-.002.066-.013.134-.02.204-.02.326 0 .592.265.592.592s-.266.592-.592.592c-.163 0-.31-.066-.416-.172-.036-.036-.086-.056-.14-.056-.03 0-.06.006-.088.018-.057.023-.1.066-.123.122-.023.056-.02.118.01.172.01.018.023.035.039.05.162.154.378.24.612.24.564 0 1.023-.46 1.023-1.023 0-.564-.459-1.023-1.023-1.023m1.657-.027c-.144 0-.283.02-.414.058-.097.028-.16.086-.18.165-.008.032-.012.065-.012.099 0 .102.042.195.108.261.034.034.078.058.128.068.033.007.067.01.101.01.088 0 .172-.028.242-.078.037-.026.067-.06.088-.1.021-.04.032-.084.032-.13 0-.023-.002-.046-.006-.069-.008-.046-.028-.09-.059-.127-.03-.037-.069-.066-.114-.084-.03-.012-.062-.018-.095-.018-.016 0-.032.002-.048.004-.08.012-.156.04-.225.082-.037.022-.067.053-.087.091-.02.038-.03.08-.03.124 0 .045.01.087.03.125.02.038.05.069.087.091.074.044.16.068.25.068.066 0 .129-.012.187-.034.037-.014.069-.036.096-.065.027-.029.046-.064.057-.102.011-.038.015-.078.012-.118-.003-.04-.013-.079-.031-.114-.018-.036-.043-.067-.074-.092-.03-.026-.066-.045-.105-.057-.03-.009-.061-.013-.093-.013m1.657-.027c-.156 0-.306.03-.442.086-.107.044-.176.108-.204.188-.012.034-.017.07-.017.107 0 .108.042.206.11.274.034.034.078.058.128.068.033.007.067.01.101.01.088 0 .172-.028.242-.078.037-.026.067-.06.088-.1.021-.04.032-.084.032-.13 0-.023-.002-.046-.006-.069-.008-.046-.028-.09-.059-.127-.03-.037-.069-.066-.114-.084-.03-.012-.062-.018-.095-.018-.016 0-.032.002-.048.004-.08.012-.156.04-.225.082-.037.022-.067.053-.087.091-.02.038-.03.08-.03.124 0 .045.01.087.03.125.02.038.05.069.087.091.074.044.16.068.25.068.066 0 .129-.012.187-.034.037-.014.069-.036.096-.065.027-.029.046-.064.057-.102.011-.038.015-.078.012-.118-.003-.04-.013-.079-.031-.114-.018-.036-.043-.067-.074-.092-.03-.026-.066-.045-.105-.057-.03-.009-.061-.013-.093-.013" />
                      </svg>
                      <span>SoundCloud</span>
                    </a>
                  )}
                  {artist.musicLinks.amazonMusic && (
                    <a
                      href={artist.musicLinks.amazonMusic}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="music-link"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M14.7 15.4c0-.4.1-.8.1-1.2 0-3.3-2.2-5.3-5.2-5.3-3 0-5.2 2-5.2 5.3 0 .4 0 .8.1 1.2C2.5 14.1 1.3 12.1 1.3 9.5c0-4.3 3.6-7.5 7.9-7.5 4.3 0 7.9 3.2 7.9 7.5 0 2.6-1.2 4.6-3.2 5.9l-.2-.2zm-6.5 2c0-.9.6-1.5 1.5-1.5s1.5.6 1.5 1.5-.6 1.5-1.5 1.5-1.5-.6-1.5-1.5zm9.7 1.4c-1.2-.7-1.9-2-2.3-3.5.2-.1.4-.3.6-.4.4.2.8.4 1.2.5-.4-1.3-1.2-2.5-2.4-3.3-.2.1-.4.2-.6.3.3.4.5.8.7 1.3-.2.2-.4.3-.6.5 1 .9 1.6 2.1 1.8 3.5-.2.4-.3.8-.4 1.1l.6.6c.4-.1.9-.2 1.4-.6z" />
                      </svg>
                      <span>Amazon Music</span>
                    </a>
                  )}
                  {artist.musicLinks.shazam && (
                    <a
                      href={artist.musicLinks.shazam}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="music-link"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M14.5 1.5c-1.1 0-2 .9-2 2 0 .7.4 1.3.9 1.7L7.1 11.5c-.3.4-.7.7-1.2.7-.8 0-1.5-.7-1.5-1.5 0-.4.1-.8.4-1.1L9.2 4.4c-.1-.5-.2-.9-.2-1.4 0-1.1.9-2 2-2s2 .9 2 2c0 .7-.3 1.3-.8 1.7l5.1 5.3c.3-.2.6-.4 1-.5.1-.3.1-.7.1-1 0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2c-.5 0-1-.2-1.3-.6l-5.2-5.4zM5.9 15.9c.1.1.2.2.3.3l-.9.9c-.5.5-1.3.8-2.1.8-.8 0-1.6-.3-2.1-.8L.1 16.1l-.9.9c-.5.5-1.3.8-2.1.8-.8 0-1.6-.3-2.1-.8l-1-1c-.5-.5-1.3-.8-2.1-.8-.8 0-1.6.3-2.1.8l-1 1c-.5.5-1.3.8-2.1.8-.8 0-1.6-.3-2.1-.8l-1-1z" />
                      </svg>
                      <span>Shazam</span>
                    </a>
                  )}
                  {artist.musicLinks.bandcamp && (
                    <a
                      href={artist.musicLinks.bandcamp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="music-link"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M0 18.75l7.437-13.5H24l-7.438 13.5z" />
                      </svg>
                      <span>Bandcamp</span>
                    </a>
                  )}
                </div>
              </div>
            )}

          {/* Performance Day */}
          <div className="artist-section">
            <h2>PorchFest 2026</h2>
            <div className="performance-info">
              <div className="performance-day">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>
                  Performing on{" "}
                  <strong>
                    {getPerformanceDays().length > 0
                      ? getPerformanceDays().join(", ")
                      : "TBD"}
                  </strong>
                </span>
              </div>
              <div className="performance-location">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {venueMapUrl ? (
                  <a
                    href={venueMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="performance-venue-map-link"
                  >
                    Munson & Brothers • Columbus, MS
                  </a>
                ) : (
                  <span>Munson & Brothers • Columbus, MS</span>
                )}
              </div>
              <div className="performance-date">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>April 17-19, 2026</span>
              </div>
            </div>
          </div>

          {/* Gig Tracker */}
          <GigTracker artistSlug={artist.bandsintown_slug} />

          {/* Back Link */}
          <div className="back-link-container">
            <Link to="/porchfest/artists" className="back-link">
              ← Back to Artists
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default ArtistDetailPage;
