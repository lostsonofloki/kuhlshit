import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { POETS_WRITERS_COMING_SOON_SEO } from "../constants/seoDefaults";
import "./ComingSoonPage.css";

function ComingSoonPage() {
  return (
    <>
      <SEO {...POETS_WRITERS_COMING_SOON_SEO} />
      <div className="coming-soon-page coming-soon-page--writer">
        <div className="coming-soon-card">
          <p className="coming-soon-eyebrow">Coming soon</p>
          <h1>Poets &amp; Writers</h1>
          <p className="coming-soon-lede">
            Distraction-free reading. Your words, not our chrome. We&apos;re
            building dedicated homes for poets, essayists, and storytellers —
            the same care musicians and visual artists already get on
            kuhlshit.com.
          </p>
          <div className="coming-soon-actions">
            <Link
              to="/waitlist?source=poets-writers"
              className="btn btn-primary"
            >
              Join the waitlist
            </Link>
            <Link to="/artists" className="btn btn-secondary">
              Meet the artists
            </Link>
          </div>
          <p className="coming-soon-note">
            Want a writer profile when we launch? Tell us on the waitlist —
            earliest folks get first pick of handles.
          </p>
        </div>
        <Link to="/" className="coming-soon-back">
          ← Back to Home
        </Link>
      </div>
    </>
  );
}

export default ComingSoonPage;
