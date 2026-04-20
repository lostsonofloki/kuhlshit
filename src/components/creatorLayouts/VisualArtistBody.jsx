import { Link } from "react-router-dom";
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
    <div className="visual-body">
      {gallery.length > 0 ? (
        <div className="visual-gallery">
          {gallery.map((piece, i) => (
            <figure key={i} className="visual-gallery-item">
              <img src={piece.src} alt={piece.alt || artist.name} />
              {piece.caption ? (
                <figcaption>{piece.caption}</figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      ) : null}

      <section className="visual-statement">
        <h2>Artist Statement</h2>
        <p>{artist.bio}</p>
      </section>

      <section className="visual-inquiry">
        <h2>Interested in a piece?</h2>
        <p>
          Reach out directly — no middleman, no gallery cut. This is a
          creator-first home.
        </p>
        <div className="visual-inquiry-actions">
          <a className="btn btn-primary" href={inquiryHref}>
            {artist.inquiryEmail ? "Send an inquiry" : "Request an intro"}
          </a>
          {artist.socialLinks?.website ? (
            <a
              className="btn btn-ghost"
              href={artist.socialLinks.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit portfolio
            </a>
          ) : (
            <Link to="/waitlist" className="btn btn-ghost">
              Join the creator waitlist
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
