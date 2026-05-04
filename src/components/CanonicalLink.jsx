import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { getSiteOrigin } from "../utils/siteOrigin";

/** One canonical URL per view: `VITE_SITE_ORIGIN` or `window.location.origin` + current pathname. */
export default function CanonicalLink() {
  const { pathname } = useLocation();
  const origin = getSiteOrigin();
  const path = pathname || "/";
  const href = `${origin}${path}`;
  return (
    <Helmet>
      <link rel="canonical" href={href} />
    </Helmet>
  );
}
