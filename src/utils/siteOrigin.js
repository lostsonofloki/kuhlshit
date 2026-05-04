/**
 * Canonical host for SEO/social URLs. Prefer `VITE_SITE_ORIGIN` in production
 * (e.g. https://www.kuhlshit.com) so OG URLs stay stable on preview domains.
 */
export function getSiteOrigin() {
  const fromEnv = import.meta.env.VITE_SITE_ORIGIN;
  if (fromEnv) return String(fromEnv).replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "https://www.kuhlshit.com";
}

/** @param {string | undefined | null} pathOrUrl */
export function toAbsoluteUrl(origin, pathOrUrl) {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${origin}${path}`;
}
