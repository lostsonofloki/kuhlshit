import { Link } from "react-router-dom";
import { ALS_SPIRITS_MAPS_URL } from "../constants/alsSpirits";
import "./AlsPackageStoreJingle.css";

/**
 * Fire Camino jingle for Al's Spirits & Music / Package Store (Reform, AL).
 * @param {{ audioUrl: string; showProfileLink?: boolean }} props
 */
export default function AlsPackageStoreJingle({
  audioUrl,
  showProfileLink = true,
}) {
  if (!audioUrl) return null;

  return (
    <section
      className="als-jingle"
      aria-labelledby="als-jingle-heading"
    >
      <div className="als-jingle-inner">
        <p className="als-jingle-eyebrow">Al&apos;s Spirits &amp; Music</p>
        <h2 id="als-jingle-heading" className="als-jingle-title">
          Package Store jingle
        </h2>
        <p className="als-jingle-copy">
          Fire Camino wrote this for Al&apos;s Spirits &amp; Music in Reform,
          AL.
        </p>
        <audio
          className="als-jingle-audio"
          controls
          preload="none"
          aria-label="Al's Spirits and Music jingle by Fire Camino"
        >
          <source src={audioUrl} type="audio/mp4" />
        </audio>
        <div className="als-jingle-actions">
          <a
            href={ALS_SPIRITS_MAPS_URL}
            className="btn btn-secondary als-jingle-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            Al&apos;s on Maps
          </a>
          {showProfileLink ? (
            <Link
              to="/porchfest/artists/fire-camino"
              className="btn btn-primary als-jingle-btn"
            >
              Fire Camino profile
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
