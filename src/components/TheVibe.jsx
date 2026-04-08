import './TheVibe.css'

function TheVibe() {
  return (
    <section className="the-vibe">
      <div className="vibe-bg">
        <img src="/resources/porchfest/vibe.jpg" alt="PorchFest 2026 Vibe" className="vibe-bg-image" />
        <div className="vibe-overlay"></div>
      </div>
      <div className="vibe-content">
        <h2 className="vibe-title">PorchFest 26</h2>
        <p className="vibe-subtitle">Three Days. Three Stages. All Porch.</p>
        <p className="vibe-desc">Folk • Rock • Blues • Americana • Good Vibes</p>
        <div className="vibe-details">
          <span className="vibe-tag">Apr 17-19</span>
          <span className="vibe-tag">Columbus, MS</span>
          <span className="vibe-tag">Munson & Brothers</span>
        </div>
      </div>
    </section>
  )
}

export default TheVibe
