/**
 * Thin, safe wrapper around the global `gtag` loaded by `index.html`.
 * No-ops in SSR, dev without GA, or if the tag hasn't booted yet,
 * so callers can fire events without guarding every site.
 *
 * @param {string} name — GA4 event name (e.g. `share`, `louie_spotted`, `waitlist_submit`).
 * @param {Record<string, unknown>} [params] — event parameters; kept small (<25 keys, ≤100 chars each).
 */
export function trackEvent(name, params = {}) {
  if (typeof window === "undefined") return;
  const gtag = window.gtag;
  if (typeof gtag !== "function") return;
  try {
    gtag("event", name, params);
  } catch {
    // Analytics must never break the UI.
  }
}
