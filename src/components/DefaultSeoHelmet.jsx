import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { GLOBAL_SEO_DEFAULT_PROPS } from "../constants/seoDefaults";
import { getSiteOrigin, toAbsoluteUrl } from "../utils/siteOrigin";

/**
 * Fallback document head for routes that do not render `<SEO />`.
 * Overridden by nested `<SEO>` from react-helmet-async (deeper route wins).
 */
export default function DefaultSeoHelmet() {
  const { pathname } = useLocation();
  const origin = getSiteOrigin();
  const path = pathname || "/";
  const pageUrl = `${origin}${path}`;
  const d = GLOBAL_SEO_DEFAULT_PROPS;
  const absoluteImage = toAbsoluteUrl(origin, d.image);

  return (
    <Helmet prioritizeSeoTags>
      <meta
        name="google-site-verification"
        content="wgvVXUsy95uI5x_V7p6XBfbhkdkZMpCwUh1oqMvXcEI"
      />
      <title>{d.title}</title>
      <meta name="description" content={d.description} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={d.title} />
      <meta property="og:description" content={d.description} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:url" content={pageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={d.title} />
      <meta name="twitter:description" content={d.description} />
      <meta name="twitter:image" content={absoluteImage} />
    </Helmet>
  );
}
