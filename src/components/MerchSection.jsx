import { Link } from 'react-router-dom'
import './MerchSection.css'

function MerchSection() {
  return (
    <section className="merch-section">
      <div className="merch-bg">
        <img src="/resources/porchfest/shirtbanner.jpg" alt="Official PorchFest '26 Merch" className="merch-bg-image" />
        <div className="merch-overlay"></div>
      </div>
      <div className="merch-content">
        <div className="merch-product-showcase">
          <div className="merch-product-images">
            <img src="/resources/porchfest/tshirts.jpg" alt="PorchFest '26 T-Shirts" className="merch-product-image" />
            <img src="/resources/porchfest/blackshirt.jpg" alt="PorchFest '26 Black Tee" className="merch-product-image" />
          </div>
          <div className="merch-product-details">
            <h2 className="merch-title">
              <span className="merch-accent">Support the Porch</span>
            </h2>
            <p className="merch-subtitle">Official PorchFest '26 Gear</p>
            <p className="merch-location">Available at the Merch Table — Beside the Stage</p>
            <div className="merch-cta">
              <Link to="/porchfest" className="btn btn-primary merch-btn">See the Lineup →</Link>
              <span className="merch-note">Bring cash — merch available at the door</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MerchSection
