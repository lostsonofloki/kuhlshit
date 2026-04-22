import data from '../data/data.json'
import './TheVibe.css'

function TheVibe() {
  const venueMapUrl = data.porchfest?.events?.[0]?.location?.mapUrl

  return (
    <section className="the-vibe">
      <div className="vibe-bg">
        <picture>
          <source srcSet="/resources/porchfest/vibe.webp" type="image/webp" />
          <img
            src="/resources/porchfest/vibe.jpg"
            alt="PorchFest 2026 Vibe"
            className="vibe-bg-image"
            loading="lazy"
            decoding="async"
            width="1200"
            height="800"
          />
        </picture>
        <div className="vibe-overlay"></div>
      </div>
      <div className="vibe-content">
        <h2 className="vibe-title">PorchFest 26</h2>
        <p className="vibe-subtitle">Three Days. One Stage. All Porch.</p>
        <p className="vibe-desc">Folk • Rock • Blues • Americana • Good Vibes</p>
        <div className="vibe-details">
          <span className="vibe-tag">Apr 17-19</span>
          <span className="vibe-tag">Columbus, MS</span>
          {venueMapUrl ? (
            <a
              href={venueMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="vibe-tag"
              style={{ textDecoration: 'underline', cursor: 'pointer' }}
            >
              Munson & Brothers
            </a>
          ) : (
            <span className="vibe-tag">Munson & Brothers</span>
          )}
        </div>
      </div>
    </section>
  )
}

export default TheVibe
