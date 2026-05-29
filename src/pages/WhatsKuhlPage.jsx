import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import SmartImage from "../components/SmartImage";
import { WHATS_KUHL_SEO } from "../constants/seoDefaults";
import whatsKuhl from "../data/whatsKuhl.json";
import "./WhatsKuhlPage.css";

function ExternalLink({ href, className, children }) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

function AffiliateContact({ contact }) {
  if (!contact) return null;
  return (
    <div className="whats-kuhl-contact">
      {contact.hours ? (
        <p className="whats-kuhl-contact-line">{contact.hours}</p>
      ) : null}
      {contact.email ? (
        <p className="whats-kuhl-contact-line">
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </p>
      ) : null}
      {contact.phone ? (
        <p className="whats-kuhl-contact-line">
          <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}>
            {contact.phone}
          </a>
        </p>
      ) : null}
    </div>
  );
}

function MarsActions({ affiliate }) {
  return (
    <div className="whats-kuhl-actions">
      <ExternalLink href={affiliate.website} className="btn btn-primary">
        Visit MARS
      </ExternalLink>
      {affiliate.profilePath ? (
        <Link to={affiliate.profilePath} className="btn btn-secondary">
          Joe&apos;s profile
        </Link>
      ) : null}
      {affiliate.residencyProgramUrl ? (
        <ExternalLink
          href={affiliate.residencyProgramUrl}
          className="btn btn-secondary"
        >
          Residency program
        </ExternalLink>
      ) : null}
      {affiliate.applicationPdf ? (
        <ExternalLink
          href={affiliate.applicationPdf}
          className="btn btn-secondary"
        >
          Application (PDF)
        </ExternalLink>
      ) : null}
    </div>
  );
}

function DelRendonActions({ affiliate }) {
  return (
    <div className="whats-kuhl-actions">
      <ExternalLink href={affiliate.website} className="btn btn-primary">
        Visit foundation
      </ExternalLink>
      {affiliate.contact?.email ? (
        <a
          href={`mailto:${affiliate.contact.email}`}
          className="btn btn-secondary"
        >
          Contact
        </a>
      ) : null}
    </div>
  );
}

function AffiliateActions({ affiliate }) {
  if (affiliate.id === "mars") return <MarsActions affiliate={affiliate} />;
  if (affiliate.id === "del-rendon-foundation") {
    return <DelRendonActions affiliate={affiliate} />;
  }
  return (
    <div className="whats-kuhl-actions">
      {affiliate.website ? (
        <ExternalLink href={affiliate.website} className="btn btn-primary">
          Visit website
        </ExternalLink>
      ) : null}
    </div>
  );
}

function WhatsKuhlPage() {
  return (
    <>
      <SEO {...WHATS_KUHL_SEO} />
      <div className="whats-kuhl-page">
        <header className="whats-kuhl-header">
          <p className="whats-kuhl-eyebrow">Partners &amp; affiliates</p>
          <h1>What&apos;s Kuhl</h1>
          <p className="whats-kuhl-lede">{whatsKuhl.intro}</p>
        </header>

        <div className="whats-kuhl-list">
          {whatsKuhl.affiliates.map((affiliate) => (
            <article key={affiliate.id} className="whats-kuhl-card">
              {affiliate.imageUrl ? (
                <div className="whats-kuhl-card-image">
                  <SmartImage
                    src={affiliate.imageUrl}
                    alt={affiliate.name}
                    sizes="(max-width: 768px) 100vw, 480px"
                    loading="lazy"
                  />
                </div>
              ) : null}
              <div className="whats-kuhl-card-body">
                <h2>{affiliate.name}</h2>
                {affiliate.tagline ? (
                  <p className="whats-kuhl-tagline">{affiliate.tagline}</p>
                ) : null}
                {(affiliate.body || []).map((paragraph, i) => (
                  <p key={i} className="whats-kuhl-copy">
                    {paragraph}
                  </p>
                ))}
                <AffiliateContact contact={affiliate.contact} />
                <AffiliateActions affiliate={affiliate} />
              </div>
            </article>
          ))}
        </div>

        <div className="whats-kuhl-back">
          <Link to="/" className="back-link">
            ← Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}

export default WhatsKuhlPage;
