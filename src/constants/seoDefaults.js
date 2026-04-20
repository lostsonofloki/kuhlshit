/**
 * Baseline share tags for the global platform.
 * Kept in sync with the static `<head>` tags in `index.html` and `public/manifest.json`.
 *
 * `SEO.jsx` restores these defaults on unmount so routes without their own
 * `<SEO>` (home, waitlist, vault) always fall back to the global story.
 */
export const GLOBAL_SEO_DEFAULT_PROPS = {
  title: "Kuhlshit.com — A Home for Musicians, Painters, and Poets",
  description:
    "A global platform for musicians, visual artists, and writers building their own homes on the internet.",
  image: "/resources/porchfest/poster.jpg",
  path: "/",
};

/** Festival-specific tags used by `/porchfest` archive pages and artist detail fallbacks. */
export const PORCHFEST_SEO_DEFAULT_PROPS = {
  title: "PorchFest 2026 | kuhlshit.com",
  description:
    "Live music, local vibes. The April 17-19 field test at Munson & Brothers in Columbus, MS — archived in The Vault.",
  image: "/resources/porchfest/poster.jpg",
  path: "/porchfest",
};
