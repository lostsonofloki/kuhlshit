import { useEffect } from "react";
import { PORCHFEST_SEO_DEFAULT_PROPS } from "../constants/seoDefaults";

function siteOrigin() {
  const fromEnv = import.meta.env.VITE_SITE_ORIGIN;
  if (fromEnv) return String(fromEnv).replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "https://kuhlshit.com";
}

function toAbsoluteUrl(origin, pathOrUrl) {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${origin}${path}`;
}

/**
 * @param {'property' | 'name'} attrName
 * @param {string} key
 * @param {string} content
 */
function setOrCreateMeta(attrName, key, content) {
  if (content == null || content === "") return;
  const selector =
    attrName === "property" ? `meta[property="${key}"]` : `meta[name="${key}"]`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrName, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function applyPack({
  title,
  description,
  absoluteImage,
  canonicalUrl,
  twitterCard,
}) {
  if (title) document.title = title;
  setOrCreateMeta("name", "description", description);
  setOrCreateMeta("property", "og:title", title);
  setOrCreateMeta("property", "og:description", description);
  setOrCreateMeta("property", "og:image", absoluteImage);
  setOrCreateMeta("property", "og:url", canonicalUrl);
  setOrCreateMeta("name", "twitter:card", twitterCard);
  setOrCreateMeta("name", "twitter:title", title);
  setOrCreateMeta("name", "twitter:description", description);
  setOrCreateMeta("name", "twitter:image", absoluteImage);
}

/**
 * Updates document title and OG/Twitter tags for the current route.
 * Restores `PORCHFEST_SEO_DEFAULT_PROPS` on unmount so other routes don’t keep stale artist metadata.
 *
 * @param {object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {string} [props.image] — absolute URL or site-root path (e.g. `/resources/...`)
 * @param {string} [props.path] — pathname for `og:url` (default when `canonicalUrl` omitted)
 * @param {string} [props.canonicalUrl] — full URL override for `og:url`
 * @param {string} [props.twitterCard]
 */
export default function SEO({
  title,
  description,
  image,
  path,
  canonicalUrl,
  twitterCard = "summary_large_image",
}) {
  useEffect(() => {
    const origin = siteOrigin();
    const pathname =
      path == null || path === ""
        ? "/"
        : path.startsWith("/")
          ? path
          : `/${path}`;
    const url = canonicalUrl || `${origin}${pathname}`;
    const absoluteImage = toAbsoluteUrl(origin, image);

    applyPack({
      title,
      description,
      absoluteImage,
      canonicalUrl: url,
      twitterCard,
    });

    return () => {
      const o = siteOrigin();
      const d = PORCHFEST_SEO_DEFAULT_PROPS;
      applyPack({
        title: d.title,
        description: d.description,
        absoluteImage: toAbsoluteUrl(o, d.image),
        canonicalUrl: `${o}${d.path}`,
        twitterCard: "summary_large_image",
      });
    };
  }, [title, description, image, path, canonicalUrl, twitterCard]);

  return null;
}
