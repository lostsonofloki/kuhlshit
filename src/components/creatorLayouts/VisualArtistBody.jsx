import { Link } from "react-router-dom";
import SmartImage from "../SmartImage";
import "./VisualArtistBody.css";

/**
 * Visual-artist layout: the image is the hero, the text is supporting cast.
 * `artist.gallery` is expected to be an array of `{ src, alt, caption? }` objects.
 * Falls back to `artist.imageUrl` when no gallery is provided so early profiles
 * still render something meaningful.
 */
export default function VisualArtistBody({ artist }) {
  const gallery =
    Array.isArray(artist.gallery) && artist.gallery.length > 0
      ? artist.gallery
      : artist.imageUrl
        ? [{ src: artist.imageUrl, alt: artist.name }]
        : [];

  const inquiryHref = artist.inquiryEmail
    ? `mailto:${artist.inquiryEmail}?subject=${encodeURIComponent(
        `Inquiry about ${artist.name}`,
      )}`
    : "/waitlist?source=inquiry";

  return (
    <div className="artist-content visual-body">
      {gallery.length > 0 ? (
        <div className="visual-gallery">
          {gallery.map((piece, i) => (
            <figure key={i} className="visual-gallery-item">
              <SmartImage
                src={piece.src}
                alt={piece.alt || artist.name}
                sizes="(max-width: 768px) 100vw, 50vw"
                enableZoom
              />
              {piece.caption ? (
                <figcaption>{piece.caption}</figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      ) : null}

      <div className="artist-section visual-statement">
        <h2>Artist Statement</h2>
        <p className="artist-bio" style={{ whiteSpace: "pre-line" }}>
          {artist.bio}
        </p>
      </div>

      <div className="artist-section artist-section--featured-show visual-inquiry">
        <h2>Interested in a piece?</h2>
        <p className="featured-show-billing">
          Contact {artist.name} directly for availability, pricing, and studio
          visits.
        </p>
        <div className="visual-inquiry-actions">
          <a className="btn btn-primary" href={inquiryHref}>
            {artist.inquiryEmail ? "Send an inquiry" : "Request an intro"}
          </a>
          {artist.socialLinks?.website ? (
            <a
              className="btn btn-secondary"
              href={artist.socialLinks.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit portfolio
            </a>
          ) : (
            <Link to="/waitlist" className="btn btn-secondary">
              Join the creator waitlist
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
