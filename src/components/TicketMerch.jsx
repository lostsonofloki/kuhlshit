import { Link } from "react-router-dom";
import SmartImage from "./SmartImage";
import "./TicketMerch.css";

function TicketMerch() {
  return (
    <section className="ticket-merch">
      <div className="ticket-merch-inner">
        {/* Pricing */}
        <div className="ticket-pricing">
          <h2 className="ticket-merch-title">Get Your Tickets</h2>
          <div className="price-options">
            <div className="price-option">
              <span className="price-amount">$10</span>
              <span className="price-type">Day Pass</span>
            </div>
            <div className="price-divider">×</div>
            <div className="price-option featured">
              <span className="price-amount">$20</span>
              <span className="price-type">Weekend Pass</span>
            </div>
          </div>
          <p className="ticket-note">
            Tickets available at the Gate. Cash or Card accepted.
          </p>
        </div>

        {/* Merch */}
        <div className="merch-preview">
          <h2 className="ticket-merch-title">Official Merch</h2>
          <div className="merch-images">
            <div className="merch-image-wrapper">
              <div className="merch-image-frame">
                <SmartImage
                  src="/resources/porchfest/tshirts.jpg"
                  alt="PorchFest '26 T-Shirts"
                  className="merch-image"
                  width="400"
                  height="400"
                />
              </div>
              <span className="merch-image-label">T-Shirts & More</span>
            </div>
            <div className="merch-image-wrapper">
              <div className="merch-image-frame">
                <SmartImage
                  src="/resources/porchfest/black-tee.jpg"
                  alt="PorchFest '26 Black Tee"
                  className="merch-image"
                  width="400"
                  height="400"
                />
              </div>
              <span className="merch-image-label">Black Tee</span>
            </div>
          </div>
          <p className="merch-caption">
            Limited Edition — Get yours at the Merch Table, Beside the Stage
          </p>
          <Link to="/porchfest" className="btn btn-primary merch-cta-btn">
            See the Lineup →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default TicketMerch;
