import JsonLd from "./JsonLd";
import { GLOBAL_SEO_DEFAULT_PROPS } from "../constants/seoDefaults";
import { getSiteOrigin, toAbsoluteUrl } from "../utils/siteOrigin";

/** WebSite + Organization for the home page (stable site identity). */
export default function SiteWideJsonLd() {
  const origin = getSiteOrigin();
  const siteUrl = `${origin}/`;
  const logoUrl = toAbsoluteUrl(origin, GLOBAL_SEO_DEFAULT_PROPS.image);

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${origin}/#organization`,
        name: "Kuhlshit",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: logoUrl,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        url: siteUrl,
        name: "Kuhlshit.com",
        description: GLOBAL_SEO_DEFAULT_PROPS.description,
        publisher: { "@id": `${origin}/#organization` },
      },
    ],
  };

  return <JsonLd id="jsonld-site" data={data} />;
}
