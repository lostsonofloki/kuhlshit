import { Link } from "react-router-dom";
import data from "../data/data.json";
import SEO from "../components/SEO";
import "./VaultPage.css";

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

function VaultPage() {
  const events = (data.porchfest?.events || [])
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <>
      <SEO
        title="The Vault | kuhlshit.com"
        description="Archived events from kuhlshit.com — every show, every lineup, every proof of concept."
        image="/resources/porchfest/poster.jpg"
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
          {events.length === 0 ? (
            <p className="vault-empty">
              No events archived yet. Check back after the next field test.
            </p>
          ) : (
            events.map((event) => (
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
                    {event.location?.venue
                      ? `${event.location.venue} • ${event.location.city}, ${event.location.state}`
                      : `${event.location?.city ?? ""}, ${event.location?.state ?? ""}`}
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
                    <Link to="/porchfest" className="btn btn-secondary">
                      Revisit the event page
                    </Link>
                    <Link to="/porchfest/artists" className="btn btn-ghost">
                      Browse the lineup
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>

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
