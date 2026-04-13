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
        <p className="vibe-subtitle">Three Days. One Stage. All Porch.</p>
        <p className="vibe-desc">Folk • Rock • Blues • Americana • Good Vibes</p>
        <div className="vibe-details">
          <span className="vibe-tag">Apr 17-19</span>
          <span className="vibe-tag">Columbus, MS</span>
          <a href="https://www.google.com/maps/place/Munson+and+Brothers+Trading+Post/@33.4944198,-88.4322622,16z/data=!4m6!3m5!1s0x8886eb05721234f7:0x28b28ed87d3c2534!8m2!3d33.496184!4d-88.4307709!16s%2Fg%2F11fj2fw9ny?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="vibe-tag" style={{ textDecoration: 'underline', cursor: 'pointer' }}>Munson & Brothers</a>
        </div>
      </div>
    </section>
  )
}

export default TheVibe
