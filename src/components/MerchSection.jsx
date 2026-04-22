import { Link } from 'react-router-dom'
import SmartImage from './SmartImage'
import './MerchSection.css'

function MerchSection() {
  return (
    <section className="merch-section">
      <div className="merch-container">
        {/* Top Row: Merch Images */}
        <div className="merch-image-row">
          <div className="merch-image-card">
            <SmartImage
              src="/resources/porchfest/tshirts.jpg"
              alt="White Skeleton Cat Tee"
              className="merch-image"
              width="600"
              height="600"
            />
          </div>
          <div className="merch-image-card">
            <SmartImage
              src="/resources/porchfest/black-tee.jpg"
              alt="Black Skeleton Cat Tee"
              className="merch-image"
              width="600"
              height="600"
            />
          </div>
        </div>

        {/* Bottom Row: Centered Text & CTA */}
        <div className="merch-text-block">
          <h2 className="merch-title">Support the Porch</h2>
          <p className="merch-subtitle">Official PorchFest &apos;26 Gear</p>
          <p className="merch-location">Available at the Merch Table Beside the Stage</p>
          <p className="merch-payment">Cash, Venmo, CashApp, PayPal accepted</p>
          <div className="merch-cta">
            <Link to="/porchfest" className="btn btn-primary merch-btn">See the Lineup →</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MerchSection
