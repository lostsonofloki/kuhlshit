# 9-DAY TECHNICAL ROADMAP: PORCHFEST 2026 LAUNCH

**Target:** April 17, 2026  
**Status:** Base site functional, needs conversion  
**Launch:** 9 days out

---

## PHASE 1: IMMEDIATE URGENCY (Days 1-2)

| Day | Task | Components | Deliverable |
|-----|------|-----------|-------------|
| **Apr 8 (Tue)** | **Sticky Announcement Bar** | **CREATE:** `src/components/AnnouncementBar.jsx` + `.css`<br>**MODIFY:** `src/App.jsx` (insert below `<Header />`) | Dismissible gold bar: *"PorchFest 2026 — Apr 17-19 • Columbus, MS"*. `position: sticky; top: 0; z-index: 999`. Persists dismissal via `localStorage`. |
| **Apr 8 (Tue)** | **Hero CTA Copy** ✅ | Already done | "See the Lineup" + mobile gap fix |
| **Apr 9 (Wed)** | **Countdown Timer** | **CREATE:** `src/components/CountdownTimer.jsx` + `.css`<br>**MODIFY:** `src/pages/HomePage.jsx` (embed in hero) | Live countdown: *"X Days, X Hours, X Minutes Until PorchFest 2026"`. Falls back to "LIVE NOW" or "Ended" post-event. |
| **Apr 9 (Wed)** | **Header/Bar Integration** | **MODIFY:** `src/App.jsx`, `src/components/Header.css` | Adjust Header `z-index: 1001`. Announcement bar at `z-index: 999`. Header offset by bar height. |

---

## PHASE 2: VISUAL EXPERIENCE (Days 3-5)

| Day | Task | Components | Deliverable |
|-----|------|-----------|-------------|
| **Apr 10 (Thu)** | **Stage/Time Metadata** | **MODIFY:** `src/data/data.json` — extend `lineup` from `string[]` to `{ name, stage, setTime }[]` | Single source of truth for all 21+ artists with stage assignments and set times. |
| **Apr 10 (Thu)** | **ArtistCard Enhancement** | **MODIFY:** `src/components/ArtistCard.jsx` + `.css` | Add `stage`/`setTime` props rendered as badges below genre. Image hover: `scale(1.08)`, gold glow `box-shadow: 0 0 20px rgba(212, 140, 41, 0.4)`. |
| **Apr 11 (Fri)** | **PorchFest Page Overhaul** | **MODIFY:** `src/pages/PorchFestPage.jsx` + `.css` | Text-only lineup → responsive grid of ArtistCard components grouped by day. Cards show: image, name, genre, stage, set time. "View Full Profile" links to artist detail. |
| **Apr 12 (Sat)** | **ArtistDetailPage Stage Info** | **MODIFY:** `src/pages/ArtistDetailPage.jsx` + `.css` | "Performing at [Stage] — [Time]" badge above bio. |
| **Apr 12 (Sat)** | **Lineup Image Optimization** | **MODIFY:** `public/resources/` | Compress `Porchfest26lineup.jpg` if > 500KB. Add WebP fallback. Lazy-load. |

---

## PHASE 3: LOGISTICS & VIRAL HOOK (Days 6-9)

| Day | Task | Components | Deliverable |
|-----|------|-----------|-------------|
| **Apr 13 (Sun)** | **Embedded Google Map** | **CREATE:** `src/components/MapEmbed.jsx` (optional)<br>**MODIFY:** `src/pages/PorchFestPage.jsx` | Responsive iframe for Munson & Brothers, 301 2nd Ave N, Columbus, MS. `width: 100%; height: 300px; border-radius: 12px;`. Parking notes, venue hours. |
| **Apr 13 (Sun)** | **Festival Info Section** | **MODIFY:** `src/data/data.json` (add to event), `PorchFestPage.jsx` | Add fields: `parking`, `rules`, `weatherPlan`, `contact`. Render as collapsible accordion below map. |
| **Apr 14 (Mon)** | **Share to Social** | **CREATE:** `src/components/ShareButtons.jsx` + `.css`<br>**MODIFY:** `src/pages/ArtistDetailPage.jsx` | Per-artist share bar: Facebook, X/Twitter, Instagram (copy link), native Web Share API. Pre-filled URL: `"Check out {artist} at PorchFest 2026! 🎸 kuhlshit.com/porchfest/artists/{id}"`. |
| **Apr 14 (Mon)** | **OG Meta Tags** | **MODIFY:** `index.html` | `og:title`, `og:image`, `og:description`, `og:url` for rich link previews. Use `Porchfest26.jpg` as default. |
| **Apr 15 (Tue)** | **Mobile Responsive Audit** | Manual testing | iPhone 14/15, Samsung Galaxy, iPad. No overflow, 44px+ touch targets, single-col grid, countdown legible, map doesn't break layout. |
| **Apr 16 (Wed)** | **Performance Polish** | All pages | Lazy-load images below fold. Preload hero background. LCP < 2.5s on 3G. Fix z-index conflicts. Test announcement bar dismiss persistence. Validate all external links open in new tabs. |
| **Apr 17 (Thu)** | **LAUNCH DAY** | Deploy & verify | Everything live, no console errors, all artists rendering with stages/times, map loading, share buttons functional. |

---

## RECOMMENDED DATA STRUCTURE

Add to `src/data/data.json` as a new top-level key:

```json
{
  "festival": {
    "name": "PorchFest 2026",
    "dates": { "start": "2026-04-17", "end": "2026-04-19" },
    "location": {
      "name": "Munson & Brothers",
      "address": "301 2nd Ave N",
      "city": "Columbus",
      "state": "MS",
      "zip": "39701",
      "mapUrl": "https://maps.google.com/?q=Munson+Brothers+Columbus+MS",
      "embedUrl": "https://www.google.com/maps/embed?pb=...",
      "parking": "Street parking available. Lot behind venue."
    },
    "stages": [
      { "id": "main-porch", "name": "Main Porch", "description": "" },
      { "id": "side-yard", "name": "Side Yard", "description": "" },
      { "id": "back-stage", "name": "Back Stage", "description": "" }
    ],
    "schedule": {
      "Friday": [
        { "artistId": "honey-boy-and-boots", "stage": "main-porch", "startTime": "17:00", "endTime": "18:00" }
      ],
      "Saturday": [
        { "artistId": "haysop", "stage": "main-porch", "startTime": "14:00", "endTime": "15:00" }
      ],
      "Sunday": [
        { "artistId": "ming-donkey", "stage": "side-yard", "startTime": "13:00", "endTime": "14:00" }
      ]
    },
    "rules": ["No outside alcohol", "All ages welcome", "Rain or shine"],
    "contact": { "email": "", "phone": "" }
  }
}
```

---

## PRIORITY MATRIX

| Impact | Effort | Task |
|--------|--------|------|
| **HIGH** | **LOW** | Announcement bar, CTA copy, Countdown timer, OG meta tags |
| **HIGH** | **MEDIUM** | ArtistCard stage/time, PorchFest page grid, Share buttons |
| **HIGH** | **HIGH** | Embedded map, Full data migration to schedule structure |
| **MEDIUM** | **LOW** | Lineup image optimization, Festival info accordion |
| **MEDIUM** | **MEDIUM** | Mobile audit, Performance tuning |

---

**No bullshit. Start with the announcement bar.**
