# Audit fixes — merged report

Consolidates outcomes from the parallel fix passes (Batch A — data & featured copy, Batch B — React pages, Batch C — HTML/SEO/nav, plus the combined “apply audit fixes” run). Generated from agent summaries and verified against `git diff --stat` (16 files touched in the current working tree).

---

## Executive summary

- **Goal:** Address copy inconsistencies, PorchFest tense/branding, Elliott naming, unsafe assumptions in COS/YouTube UI, false “artist not found” flash, vault empty messaging, promo/profile link correctness, Meet the Creators hourly shuffle behavior, OG/Twitter image alt text, and **Porch Talk** naming in nav/SEO—without broad refactors.
- **Verification:** `npm run lint` and `npm run build` were reported **passing** after these changes.
- **Scope note:** Some agents worked overlapping areas; the repo state reflects the **union** of edits (see file list below).

---

## Files changed (current tree)

| Area | Path |
|------|------|
| Docs / meta | `CHANGELOG.md`, `ROADMAP.md` |
| Shell | `index.html` |
| Components | `AddToCalendarRow.jsx`, `ClosedOnSundayLivePromo.jsx`, `Footer.jsx`, `Header.jsx`, `UpcomingAtAlsStrip.jsx` |
| Constants | `seoDefaults.js` |
| Data | `src/data/data.json`, `src/data/artists.json` |
| Pages | `ArtistDetailPage.jsx`, `ClosedOnSundaysPage.jsx`, `FeaturedArtistsPage.jsx`, `HomePage.jsx`, `VaultPage.jsx` |

---

## Track A — Data & featured copy (`data.json`, `FeaturedArtistsPage.jsx`)

- **`metadata.totalArtists`:** Set to match the real length of the `artists` array (reported as **34**).
- **PorchFest in bios:** Normalized festival branding where needed (e.g. “Performed at **PorchFest** …”); asset paths/filenames containing `Porchfest` were left alone when they are URL/path segments.
- **Elliott Devaughn:** Display **`name`** aligned to **“Elliott Devaughn”** for `elliot-devaughn`; route **`id`** and resource paths under `elliot-devaughn` unchanged. PorchFest lineup string updated to **“Elliott Devaughn”** where it still said “Elliot”.
- **Brad & Wes:** Bio line **“Rockabilly duo performing at PorchFest 2026.”** intentionally **unchanged** (exception to past-tense sweep).
- **`FeaturedArtistsPage.jsx`:** Headline and lead copy reframed so PorchFest 2026 reads as a **past / archived** weekend, consistent with bios.

---

## Track B — React behavior & UX

- **`ClosedOnSundaysPage.jsx`:** Hardened YouTube playlist mapping so `title` / `description` are safe strings before `.substring` / `.toLowerCase`. Past/upcoming COS sections use a periodic **`now`** tick (e.g. ~60s) so lists don’t freeze across the Chicago date boundary.
- **`ClosedOnSundayLivePromo.jsx`:** Removed incorrect **Megan Lea** default for profile navigation when `vaultLinks.secondary` is missing; profile CTA only when a real profile path exists; calendar/profile wiring aligned with `AddToCalendarRow` (series hub still via default `seriesPath`). Hero imagery tied to the resolved artist’s own images (no special-case wrong-artist asset).
- **`ArtistDetailPage.jsx`:** Resolved artist from bundled `data` (with fallback when cached festival data omits newer slugs) to avoid a **false “Artist not found”** flash on first paint for valid routes.
- **`HomePage.jsx`:** Vault teaser fallback CTA label derived from the **event** (name/year), not a hard-coded year string. Meet the Creators shuffle: **hour-based seed** aligned with a **~60s** check and effect deps so order can refresh when the local hour changes.
- **`VaultPage.jsx`:** Past-only filter retained; **empty states** distinguish “events exist but none are in the past yet / unreadable dates” vs “no rows at all.”
- **`UpcomingAtAlsStrip.jsx`:** Same **`now`** tick pattern as COS upcoming where applicable so rows aren’t stuck on a mount-time date.

---

## Track C — HTML, SEO, nav

- **`index.html`:** **`og:image:alt`** (and **`twitter:image:alt`**) updated to describe the actual global share image (`kuhlshit-og.png` / Porch Talk sunglasses art), not mismatched generic copy.
- **`seoDefaults.js`:** `PORCHFEST_SEO_DEFAULT_PROPS.description` uses **“Porch Talk”** (spaced) for consistency.
- **`Header.jsx` / `Footer.jsx`:** Nav labels use **“Porch Talk”**; routes remain **`/porch-talk`**.
- **`AddToCalendarRow.jsx`:** Default calendar detail copy updated for **3:00 PM Central Time** (COS scheduling) where applicable from the earlier time sweep.

---

## Track — Legacy `artists.json`

- **`src/data/artists.json`:** Small alignment (e.g. Elliott / Moves naming) when touched by the fix pass; **note:** the live app imports **`data.json`**, not `artists.json`, but keeping both aligned reduces confusion.

---

## Verification

| Check | Result |
|--------|--------|
| `npm run lint` | Pass (per agent runs) |
| `npm run build` | Pass (Vite + sitemap) |

---

## Residual / follow-ups (not blocking)

1. **Other “PorchTalk” strings:** Some pages (`HomePage`, `AnnouncementBar`, `PorchFestPage`, `CreatorCategories`, etc.) may still use **PorchTalk** in headings or comments; only **Header/Footer** and one **SEO** string were normalized in Batch C.
2. **`ArtistDetailPage` / `FeaturedArtistsPage`:** Still anchored to **`porchfest.events[0]`** for some festival context; not refactored to avoid larger schedule/routing risk.
3. **Sub-minute midnight accuracy:** Hub “today” can lag by up to the **tick interval** (~60s); accepted tradeoff vs tighter polling.
4. **Route-level Helmet:** `SEO.jsx` / `DefaultSeoHelmet` may not emit `og:image:alt` per route; global default lives in **`index.html`**.
5. **`GLOBAL_SEO_DEFAULT_PROPS.description` vs `index.html`:** Wording may still differ slightly; full normalization was out of scope.

---

## Suggested next steps (optional)

- Grep remaining **`PorchTalk`** in `src/` and normalize visible copy where it should read **Porch Talk**.
- If `artists.json` is dead weight, document or remove to avoid drift from `data.json`.
- After the next production deploy, smoke **Vault** (past-only), **Closed on Sundays** (playlist + upcoming), and **Artist** profiles for `elliot-devaughn` and a COS promo artist.
