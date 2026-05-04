import { Helmet } from "react-helmet-async";
import { GLOBAL_SEO_DEFAULT_PROPS } from "../constants/seoDefaults";
import { getSiteOrigin, toAbsoluteUrl } from "../utils/siteOrigin";

/**
 * Route-level title, description, Open Graph / Twitter. Canonical `<link>` comes from
 * `CanonicalLink` in `App.jsx` (current URL). `DefaultSeoHelmet` supplies baseline tags
 * when nested `<SEO>` does not override.
 *
 * @param {object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {string} [props.image] — absolute URL or site-root path (e.g. `/resources/...`)
 * @param {string} [props.path] — pathname for canonical + `og:url` when `canonicalUrl` omitted
 * @param {string} [props.canonicalUrl] — full URL override for canonical + `og:url`
 * @param {string} [props.twitterCard]
 * @param {string} [props.ogType] — defaults to `website`
 */
export default function SEO({
  title,
  description,
  image,
  path,
  canonicalUrl,
  twitterCard = "summary_large_image",
  ogType = "website",
}) {
  const origin = getSiteOrigin();
  const pathname =
    path == null || path === ""
      ? "/"
      : path.startsWith("/")
        ? path
        : `/${path}`;
  const url = canonicalUrl || `${origin}${pathname}`;
  const resolvedImage = image ?? GLOBAL_SEO_DEFAULT_PROPS.image;
  const absoluteImage = toAbsoluteUrl(origin, resolvedImage);

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {absoluteImage ? <meta property="og:image" content={absoluteImage} /> : null}
      <meta property="og:url" content={url} />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {absoluteImage ? <meta name="twitter:image" content={absoluteImage} /> : null}
    </Helmet>
  );
}
