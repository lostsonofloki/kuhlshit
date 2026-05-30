/**
 * Baseline share tags for the global platform.
 * Kept in sync with the static `<head>` tags in `index.html` and `public/manifest.json`.
 *
 * Route-level `<SEO />` overrides `DefaultSeoHelmet` in `App.jsx`; baseline tags
 * stay aligned with this object when no route-specific `<SEO />` is mounted.
 *
 * Default share art: `public/resources/share/kuhlshit-og.png`. Bump `?v=` in
 * `index.html` when replacing that file.
 */
export const GLOBAL_SEO_DEFAULT_PROPS = {
  title: "Kuhlshit.com — A Home for Musicians, Painters, and Poets",
  description:
    "Find musicians, painters, poets, and more on Kuhlshit.com — discover artists, Porch Talk interviews, Closed on Sundays (listening-room performances, short sets to camera — bring a chair in the room), PorchFest in Columbus MS, and The Vault.",
  image: "/resources/share/kuhlshit-og.png",
  path: "/",
};

/** Festival-specific tags used by `/porchfest` archive pages and artist detail fallbacks. */
export const PORCHFEST_SEO_DEFAULT_PROPS = {
  title: "PorchFest 2026 (archived) | kuhlshit.com",
  description:
    "PorchFest 2026 in Columbus, MS has concluded. Browse the archived lineup and schedule, visit The Vault for history and media, and follow Closed on Sundays and Porch Talk for ongoing content.",
  image: "/resources/porchfest/poster.jpg",
  path: "/porchfest",
};

/** Index pages beyond home — explicit titles avoid relying only on `DefaultSeoHelmet`. */
export const ARTISTS_INDEX_SEO = {
  title: "Creators | kuhlshit.com",
  description:
    "Browse musicians, visual artists, and writers building homes on the internet through kuhlshit.com.",
  image: GLOBAL_SEO_DEFAULT_PROPS.image,
  path: "/artists",
};

export const WHATS_KUHL_SEO = {
  title: "What's Kuhl | Partners & affiliates | kuhlshit.com",
  description:
    "Sponsors, labels, studios, and partners in the Kuhl orbit — including MARS (MacGown Art Retreat & Studio) and the Del Rendon Foundation.",
  image: GLOBAL_SEO_DEFAULT_PROPS.image,
  path: "/whats-kuhl",
};

export const PORCHFEST_ARTISTS_INDEX_SEO = {
  title: "PorchFest lineup | kuhlshit.com",
  description:
    "PorchFest artists, schedule context, and links to creator profiles — Munson & Brothers, Columbus MS.",
  image: PORCHFEST_SEO_DEFAULT_PROPS.image,
  path: "/porchfest/artists",
};

export const PORCH_TALK_SEO = {
  title: "Porch Talk | Creator Interviews & Stories | Kuhlshit.com",
  description:
    "Porch Talk on Kuhlshit.com — creator interviews, performances, and stories from our YouTube playlist.",
  image: GLOBAL_SEO_DEFAULT_PROPS.image,
  path: "/porch-talk",
};

export const CLOSED_ON_SUNDAYS_SEO = {
  title: "Closed on Sundays | Listening-room performances | Kuhlshit.com",
  description:
    "Closed on Sundays — listening-room performances: short sets to camera on Kuhlshit.com and YouTube. In person at Al's: bring a chair. Browse the playlist archive or jump to PorchFest.",
  image: GLOBAL_SEO_DEFAULT_PROPS.image,
  path: "/closed-on-sundays",
};

export const SPOTCHECK_SEO = {
  title: "Spot Check | kuhlshit.com",
  description:
    "A small off-menu page on kuhlshit.com — you found the spot check.",
  image: GLOBAL_SEO_DEFAULT_PROPS.image,
  path: "/spotcheck",
};

export const POETS_WRITERS_COMING_SOON_SEO = {
  title: "Poets & Writers — Coming soon | kuhlshit.com",
  description:
    "Dedicated homes for poets and writers are coming to kuhlshit.com. Join the creator waitlist for early access.",
  image: GLOBAL_SEO_DEFAULT_PROPS.image,
  path: "/poets-writers",
};
