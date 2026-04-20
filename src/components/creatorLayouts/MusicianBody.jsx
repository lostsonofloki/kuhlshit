/**
 * Musician content body — the original PorchFest artist-detail layout
 * (bio → connect → videos → listen → performance).
 *
 * This is the default layout for any artist whose `creatorType` is
 * `musician` or unset; the visual-artist and writer layouts are sibling
 * components so each creator type can morph independently.
 */
export default function MusicianBody({ artist, venueMapUrl, performanceDays }) {
  return (
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
                    <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.008-.06-.05-.1-.1-.1m5.748-4.05l-.1.05c-.11 0-.2.09-.21.2l-.2 6.1.2 2.1c.01.11.1.2.21.2.1 0 .19-.09.2-.2l.22-2.1-.22-6.15c-.01-.11-.1-.2-.2-.2m2.4 1.45c-.14 0-.26.12-.26.26l-.15 4.75.15 2.07c0 .14.12.26.26.26.14 0 .25-.12.25-.26l.17-2.07-.17-4.75c0-.14-.11-.26-.25-.26m3.94-2.1c-.16 0-.3.14-.3.3v8.7l.01.01.3 2.1c.01.16.14.29.3.29.16 0 .29-.13.3-.29l.3-2.1v-.02l-.3-8.7c0-.16-.14-.3-.3-.3m4.2 2.4c-1.1-.4-2.1-.6-3.1-.6v9.1c1 0 1.9-.15 2.8-.45 2.5-.8 4.3-2.85 4.3-5.27 0-1.8-1-3.35-2.45-4.4-.5-.35-1.05-.6-1.55-.78m-9.14 6.55h.04v-3.3l-.04-.01z" />
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
                    <path d="M14.5 1.5c-1.1 0-2 .9-2 2 0 .7.4 1.3.9 1.7L7.1 11.5c-.3.4-.7.7-1.2.7-.8 0-1.5-.7-1.5-1.5 0-.4.1-.8.4-1.1L9.2 4.4c-.1-.5-.2-.9-.2-1.4 0-1.1.9-2 2-2s2 .9 2 2c0 .7-.3 1.3-.8 1.7l5.1 5.3c.3-.2.6-.4 1-.5.1-.3.1-.7.1-1 0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2c-.5 0-1-.2-1.3-.6l-5.2-5.4z" />
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

      {/* Performance (PorchFest archive) */}
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
              Performed on{" "}
              <strong>
                {performanceDays.length > 0
                  ? performanceDays.join(", ")
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
    </div>
  );
}
