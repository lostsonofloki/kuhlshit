import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import data from "../data/data.json";
import SEO from "../components/SEO";
import ImageLightbox from "../components/ImageLightbox";
import { GLOBAL_SEO_DEFAULT_PROPS } from "../constants/seoDefaults";
import { getChicagoDateKey } from "../lib/closedOnSundayHubEvents";
import "./VaultPage.css";

/** Last calendar day of the event (YYYY-MM-DD), for comparing to “today”. */
function getEventEndYmd(event) {
  if (event?.endDate && /^\d{4}-\d{2}-\d{2}$/.test(String(event.endDate)))
    return String(event.endDate);
  if (event?.date && /^\d{4}-\d{2}-\d{2}$/.test(String(event.date)))
    return String(event.date);
  return "";
}

/** True once the event’s last day is strictly before today (America/Chicago). */
function isPastVaultEvent(event, now = new Date()) {
  const end = getEventEndYmd(event);
  if (!end) return false;
  const today = getChicagoDateKey(now);
  if (!today) return false;
  return end < today;
}

function formatDateRange(event) {
  if (!event?.date) return "";
  const start = new Date(`${event.date}T00:00:00`);
  const end = event.endDate ? new Date(`${event.endDate}T00:00:00`) : start;
  const fmt = (d) =>
    d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const year = start.getFullYear();
  if (start.getTime() === end.getTime()) return `${fmt(start)}, ${year}`;
  return `${fmt(start)} – ${fmt(end)}, ${year}`;
}

/** Full-quality zoom on /vault only for Barbi’s film gallery (see data `gallery.credit.name`). */
function isBarbiVaultGallery(event) {
  const name = event?.gallery?.credit?.name;
  return typeof name === "string" && name.trim().toLowerCase() === "barbi";
}

function VaultGalleryGrid({ event, onOpen, lightboxEnabled }) {
  const photos = event.gallery.photos;
  const resolveSrc = (u) =>
    typeof u === "string" ? u : u?.src ?? "";
  const zoomUrls = lightboxEnabled
    ? photos.map((u) => resolveSrc(u))
    : [];

  return (
    <div className="vault-gallery-grid">
      {photos.map((photoUrl, photoIndex) => (
        <figure
          key={`${event.id}-${photoUrl}-${photoIndex}`}
          className="vault-gallery-item"
        >
          {lightboxEnabled ? (
            <button
              type="button"
              className="vault-gallery-trigger"
              aria-label={`Open larger view: ${event.name} photo ${photoIndex + 1}`}
              onClick={() =>
                onOpen({
                  urls: zoomUrls,
                  index: photoIndex,
                  alt: `${event.name} gallery photo`,
                })
              }
            >
              <img
                src={resolveSrc(photoUrl)}
                alt={`${event.name} gallery photo`}
                className="vault-gallery-image"
                loading="lazy"
                decoding="async"
              />
            </button>
          ) : (
            <div className="vault-gallery-thumb">
              <img
                src={resolveSrc(photoUrl)}
                alt={`${event.name} gallery photo`}
                className="vault-gallery-image"
                loading="lazy"
                decoding="async"
              />
            </div>
          )}
        </figure>
      ))}
    </div>
  );
}

function VaultPage() {
  const { archivedEvents, hasEventsButNonePast } = useMemo(() => {
    const raw = data.porchfest?.events || [];
    const past = raw
      .filter((e) => isPastVaultEvent(e))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    return {
      archivedEvents: past,
      hasEventsButNonePast: raw.length > 0 && past.length === 0,
    };
  }, []);

  const [lightbox, setLightbox] = useState(null);

  return (
    <>
      <SEO
        title="The Vault | kuhlshit.com"
        description="Archived events from kuhlshit.com — every show, every lineup, every proof of concept."
        image={GLOBAL_SEO_DEFAULT_PROPS.image}
        path="/vault"
      />
      <div className="vault-page">
        <header className="vault-header">
          <p className="vault-eyebrow">The Vault</p>
          <h1>Every show we&apos;ve ever built still lives here.</h1>
          <p className="vault-subtitle">
            A permanent archive of past events, lineups, and the artists who
            made them real. Nothing gets deleted — this archive keeps the
            history.
          </p>
        </header>

        <section className="vault-events">
          {archivedEvents.length === 0 ? (
            <p className="vault-empty">
              {hasEventsButNonePast
                ? "Nothing in the Vault yet for completed runs — every event on file is still upcoming (or its dates could not be read as a past end date). Once the last day of a run has passed, it appears here automatically."
                : "No event rows are loaded yet. When we add field tests to the schedule, finished runs will show up here after their last day."}
            </p>
          ) : (
            archivedEvents.map((event) => (
              <article key={event.id} className="vault-event-card">
                <div className="vault-event-body">
                  <div className="vault-event-meta">
                    <span className="vault-event-badge">Archived</span>
                    <span className="vault-event-date">
                      {formatDateRange(event)}
                    </span>
                  </div>
                  <h2>{event.name}</h2>
                  <p className="vault-event-location">
                    {event.location?.mapUrl ? (
                      <a
                        href={event.location.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {event.location?.venue
                          ? `${event.location.venue} • ${event.location.city}, ${event.location.state}`
                          : `${event.location?.city ?? ""}, ${event.location?.state ?? ""}`}
                      </a>
                    ) : event.location?.venue ? (
                      `${event.location.venue} • ${event.location.city}, ${event.location.state}`
                    ) : (
                      `${event.location?.city ?? ""}, ${event.location?.state ?? ""}`
                    )}
                  </p>
                  {event.description ? (
                    <p className="vault-event-description">
                      {event.description}
                    </p>
                  ) : null}
                  <div className="vault-event-lineup">
                    {(event.lineup || []).map((day, i) => (
                      <span key={i} className="vault-event-lineup-chip">
                        {day.day}: {day.artists?.length ?? 0} acts
                      </span>
                    ))}
                  </div>
                  <div className="vault-event-actions">
                    {event.vaultLinks ? (
                      <>
                        <Link
                          to={event.vaultLinks.primary.to}
                          className="btn btn-secondary"
                        >
                          {event.vaultLinks.primary.label}
                        </Link>
                        <Link
                          to={event.vaultLinks.secondary.to}
                          className="btn btn-ghost"
                        >
                          {event.vaultLinks.secondary.label}
                        </Link>
                        {event.vaultLinks.tertiary ? (
                          <Link
                            to={event.vaultLinks.tertiary.to}
                            className="btn btn-ghost"
                          >
                            {event.vaultLinks.tertiary.label}
                          </Link>
                        ) : null}
                      </>
                    ) : (
                      <>
                        <Link to="/porchfest" className="btn btn-secondary">
                          Revisit the event page
                        </Link>
                        <Link to="/porchfest/artists" className="btn btn-ghost">
                          Browse the lineup
                        </Link>
                      </>
                    )}
                  </div>
                  {event.gallery?.photos?.length > 0 ? (
                    <section className="vault-gallery" aria-label={event.gallery.title}>
                      <div className="vault-gallery-header">
                        <h3>{event.gallery.title || "Event Gallery"}</h3>
                        <p className="vault-gallery-credit">
                          Photos by{" "}
                          <span>{event.gallery.credit?.name || "Unknown"}</span>
                          {event.gallery.credit?.instagramUrl ? (
                            <>
                              {" "}
                              •{" "}
                              <a
                                href={event.gallery.credit.instagramUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Instagram
                              </a>
                            </>
                          ) : null}
                          {event.gallery.credit?.email ? (
                            <>
                              {" "}
                              •{" "}
                              <a href={`mailto:${event.gallery.credit.email}`}>
                                {event.gallery.credit.email}
                              </a>
                            </>
                          ) : null}
                        </p>
                      </div>
                      <VaultGalleryGrid
                        event={event}
                        onOpen={setLightbox}
                        lightboxEnabled={isBarbiVaultGallery(event)}
                      />
                    </section>
                  ) : null}
                </div>
              </article>
            ))
          )}
        </section>

        <ImageLightbox
          open={lightbox != null}
          onClose={() => setLightbox(null)}
          urls={lightbox?.urls}
          index={lightbox?.index ?? 0}
          onIndexChange={(i) =>
            setLightbox((s) => (s ? { ...s, index: i } : s))
          }
          alt={lightbox?.alt ?? ""}
        />

        <section className="vault-footer-cta">
          <h3>Want your show in here someday?</h3>
          <p>
            The Vault is how we prove this platform works in the wild. If
            you&apos;re putting on an event — local or global — we&apos;d love
            to be the home for it.
          </p>
          <Link to="/waitlist" className="btn btn-primary hero-cta--waitlist">
            Join the Waitlist
          </Link>
        </section>
      </div>
    </>
  );
}

export default VaultPage;
