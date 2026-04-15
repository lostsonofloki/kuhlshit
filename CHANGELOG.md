# Changelog

All notable changes to this project will be documented in this file.

## [2.2.1] - 2026-04-15

### 📱 Mobile UX and Layout Stabilization
- ✅ Fixed PorchFest event header/action responsiveness across mobile/tablet/desktop breakpoints
- ✅ Removed duplicate calendar CTAs in PorchFest event actions and kept top-level calendar controls
- ✅ Corrected calendar button copy consistency (Google/Apple labels)
- ✅ Fixed text truncation caused by cross-page `.event-description` style collision
- ✅ Scoped header search button styles to prevent mobile icon/button regressions

### 🔗 Share and Viral Hook
- ✅ Added floating **Share Artist** button on artist detail pages
- ✅ Implemented native Web Share API payload (`title`, `text`, current URL)
- ✅ Added clipboard fallback + inline feedback toast when native share is unavailable

### 🌍 Social Card Reliability
- ✅ Hardened Open Graph/Twitter image metadata for Facebook crawler compatibility
- ✅ Switched to canonical `www` image URLs and added secure/type/alt metadata fields
- ✅ Added image URL cache-busting query parameter for faster social cache refresh

### 🧭 PorchFest Information Density
- ✅ Added and refined PorchFest artist discovery grid UX
- ✅ Removed clashing duplicate lineup presentation from PorchFest detail card flow
- ✅ Kept `/porchfest/artists` focused on real current data (removed premature category placeholders)

## [2.2.0] - 2026-04-15

### 🚀 PorchFest UX Improvements
- ✅ Added **Add to Calendar** actions for PorchFest events (PorchFest page + Home event card)
- ✅ Added a mobile floating **Map** quick-action button after scroll
- ✅ Improved PorchFest event visibility by keeping event cards available beyond event date filtering
- ✅ Removed poster download action from PorchFest page for a cleaner flow

### 🌐 Social Preview / SEO
- ✅ Added baseline Open Graph + Twitter tags in `index.html` for PorchFest launch sharing
- ✅ Added reusable `SEO` component for route-level metadata overrides
- ✅ Wired SEO overrides into `PorchFestPage` and `ArtistDetailPage` so artist shares use artist-specific title/image/description
- ✅ Added `seoDefaults` constants and `VITE_SITE_ORIGIN` support for absolute share URLs

### 📶 Resilience / Offline Fallback
- ✅ Added `useCachedFestivalData` hook to cache festival data in `localStorage`
- ✅ Runtime data fetch now falls back to cached payload (or bundled data) on failure
- ✅ Integrated cached data flow into `PorchFestPage` and `ArtistDetailPage`

### 🎨 UI Polish and Content Cleanup
- ✅ Fixed cross-page CSS class collision that broke Artist Detail social buttons
- ✅ Standardized merch image card sizing with fixed aspect-ratio frames
- ✅ Removed `& More!` lineup placeholder entry that generated unwanted `-more-` route slugs
- ✅ Removed Facebook video rotator embeds causing "video unavailable / cannot be embedded" errors

## [2.1.0] - 2026-04-13

### 🎤 Tour Date Integration
- ✅ Added Bandsintown live date widget to artist detail pages
- ✅ `GigTracker` component with dynamic script injection
- ✅ 1-in-500 random chance to show Louie Easter egg on any page
- ✅ Secret page at `/spotcheck`
- ✅ Widget uses dark theme with gold (#E08E36) accent colors
- ✅ Hide empty tour dates automatically

#### Artists With Tour Dates
- The Stifftones
- Taylor Hollingsworth
- B.B. Palmer
- Will Stewart
- Shake It Like a Caveman
- Hayden Hunter & The Yearly Trials
- Haysop
- Ritch Henderson
- Katie Burkhardt

### 🎵 Expanded Music Streaming Links
- ✅ Added Amazon Music, Shazam, SoundCloud, Bandcamp to Listen section
- ✅ Scraped Bandsintown profiles for accurate streaming links via Playwright
- ✅ Updated music links for The Stifftones, Taylor Hollingsworth, Will Stewart, Shake It Like a Caveman, Haysop, and Ritch Henderson

### 📝 Artist Bio Updates
- ✅ The Stifftones — full story: hearse living, 200k miles, Shaun & Rachel Stief
- ✅ Taylor Hollingsworth — full bio: "Yahola" album, Conor Oberst tours, Dead Fingers
- ✅ Hayden Hunter & The Yearly Trials — Americana/alt-country bio
- ✅ Katie Burkhardt — folk/alternative singer-songwriter bio
- ✅ Haysop — Tuscaloosa band, Cornelius Chapel Records
- ✅ Will Stewart — "Space Twang" from Birmingham
- ✅ Shake It Like a Caveman — one-man band dance party bio

### 👤 New Artist Profile
- ✅ Brad & Wes (Rockabilly) — added to Sunday lineup with photo

### 🎨 Design Updates
- ✅ "Munson & Brothers" links now open Google Maps everywhere
- ✅ Developer credit added to footer ("Built by Josh Jenkins")
- ✅ Footer links to linktr.ee/sonofloke
- ✅ Live Dates section styled to match site aesthetic

### 🥚 Easter Egg
- ✅ Louie the Dalmatian hidden on random edge of any page (1-in-500 chance)
- ✅ Click Louie to reveal secret `/spotcheck` page
- ✅ Re-rolls on every route change

## [2.0.0] - 2026-03-31

### 🎉 Major Features

#### Artist Management
- ✅ Added 22+ artist profiles with photos, bios, and social links
- ✅ Created Featured Artists page (`/porchfest/artists`)
- ✅ Implemented artist detail pages (`/porchfest/artists/:id`)
- ✅ Added hourly rotating featured artists on homepage
- ✅ Individual artist pages with:
  - Full biography
  - Social media links (Instagram, Facebook, Twitter/X, TikTok)
  - Music streaming links (Spotify, Apple Music, YouTube, Bandcamp, SoundCloud)
  - Closed on Sundays video performances
  - Performance day information

#### Artists Added
**Friday Lineup:**
- The Stifftones
- Fire Camino
- Katie Burkhardt
- Elliot Devaughn
- Phillip Savell
- The Wright Moves

**Saturday Lineup:**
- Honey Boy and Boots
- Hayden Hunter & The Yearly Trials
- Camm Lewis
- Taylor Hollingsworth
- Will Stewart
- B.B. Palmer
- Shake It Like a Caveman
- Gordon Licciardi
- Ritch Henderson

**Sunday Lineup:**
- Ming Donkey
- Jonny Hollis
- The Kites
- Haysop
- J.D. Spencer
- Tyler Tisdale
- Brad & Wes (Rockabilly) ![Brad and Wes](Brad and Wes.png)

#### Mobile-First Design
- ✅ Implemented mobile-first responsive CSS
- ✅ Added hamburger menu for mobile navigation
- ✅ Animated slide-in mobile menu with staggered animations
- ✅ Responsive grids for all content sections
- ✅ Touch-friendly buttons and navigation

#### Closed on Sundays Integration
- ✅ YouTube playlist integration
- ✅ Episode grid with thumbnails
- ✅ Search functionality
- ✅ Load more episodes functionality
- ✅ All videos from the Closed on Sundays YouTube channel

#### PorchFest 2026
- ✅ Fixed event dates to April 17-19, 2026
- ✅ Full lineup display by day (Friday, Saturday, Sunday)
- ✅ Event location and time information
- ✅ Artist count per day

### 🔒 Security & Configuration

#### API Key Management
- ✅ Moved all API keys to `.env` file
- ✅ Added `.env` to `.gitignore`
- ✅ Created `.env.example` template
- ✅ Updated all source files to use `import.meta.env.VITE_*`
- ✅ Added validation for missing API keys

#### Environment Variables
```
VITE_YOUTUBE_API_KEY=your_api_key_here
VITE_YOUTUBE_PLAYLIST_ID=PLzKakvgn9O5SVJcmGFIRc77zk8Asib1Ek
```

### 🎨 Design Updates

#### Branding
- ✅ Updated "Al's Spirits" to "Al's Spirits & Music"
- ✅ Removed "Pull up a chair for" from hero section
- ✅ Removed "Artwork by Abe Partridge" from footer
- ✅ Updated hero title to "Welcome You to Kuhlshit.com"

#### Color Scheme
- ✅ All pages use consistent dark industrial theme
- ✅ Closed on Sundays page updated to match site colors
- ✅ Gold accent color (#d48c29) throughout

### 🛠️ Technical Improvements

#### Routing
- ✅ Added `vercel.json` for SPA routing on Vercel
- ✅ Fixed 404 errors on client-side routes
- ✅ All routes now work properly on production

#### Build & Deployment
- ✅ Vite build configuration
- ✅ Automatic deployments to Vercel
- ✅ Optimized bundle sizes

#### Code Quality
- ✅ Removed unused vibe filtering functionality
- ✅ Cleaned up 12 individual artist scraper files
- ✅ Consolidated to general scraper scripts
- ✅ Removed all hardcoded API keys from source

### 📁 File Structure

#### New Files
- `vercel.json` - Vercel configuration for SPA routing
- `.env.example` - Environment variable template
- `CHANGELOG.md` - This changelog
- `public/_redirects` - Redirect rules for Vercel
- `src/pages/FeaturedArtistsPage.jsx` - Featured artists page
- `src/pages/ArtistDetailPage.jsx` - Individual artist pages
- `src/pages/ClosedOnSundaysPage.jsx` - Closed on Sundays page
- Multiple CSS files for new pages

#### Removed Files
- `src/pages/ComedyPage.jsx` - Removed comedy section
- `src/components/VibeTag.jsx` - Removed vibe filtering
- `src/components/VibeTag.css`
- 12 individual artist scraper files

### 📝 Content Updates

#### Data
- ✅ All artist data in `src/data/data.json`
- ✅ No location references in artist bios (per request)
- ✅ Clean, professional bios for all artists
- ✅ Complete social media and streaming links

#### Images
- ✅ 20+ artist photos added to `public/resources/artists/`
- ✅ SVG placeholder for missing photos
- ✅ All images properly optimized

### 🐛 Bug Fixes

- ✅ Fixed PorchFest dates (April 17-19, not 16-18)
- ✅ Fixed date display timezone issues
- ✅ Fixed artist photo 404 errors
- ✅ Fixed mobile menu not closing on navigation
- ✅ Fixed YouTube API key exposure
- ✅ Fixed client-side routing 404 on Vercel

### 📦 Dependencies

```json
{
  "playwright": "^1.58.2",
  "playwright-extra": "^4.3.6",
  "puppeteer-extra-plugin-stealth": "^2.11.2",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0"
}
```

### 🚀 Deployment

- **Platform:** Vercel
- **URL:** https://kuhlshit.vercel.app
- **Auto-deploy:** Enabled on push to main branch

---

## [1.0.0] - Previous Version

### Initial Release
- Basic React application structure
- Simple navigation
- Minimal artist information

---

## Security Notice

⚠️ **IMPORTANT:** Never commit `.env` file to GitHub. All API keys must remain in `.env` which is gitignored.

To get started:
1. Copy `.env.example` to `.env`
2. Add your YouTube API key
3. Run `npm run dev`

---

*Generated on 2026-03-31*
