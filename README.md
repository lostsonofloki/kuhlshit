# Kuhlshit.com - React Revamp

## Project Overview

A modern React-based platform for discovering musicians, comedy acts, and community events. Built with a "dark-mode-only" industrial aesthetic inspired by Al's Spirits & Music.

## Architecture

### Tech Stack
- **React 18** - UI framework
- **React Router v6** - Client-side routing
- **Vite** - Build tool and dev server
- **CSS3** - Custom styling with CSS variables

### Project Structure

```
kuhl-shit/
├── public/
│   ├── resources/
│   │   ├── artists/             # Artist photos
│   │   ├── Porchfest26.jpg
│   │   └── LouDog.svg           # Easter egg image
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Navigation header
│   │   ├── Footer.jsx           # Site footer with dev credit
│   │   ├── ArtistCard.jsx       # Artist preview card
│   │   ├── SearchBar.jsx        # Search input component
│   │   ├── TrinityPlayer.jsx    # Video player for Still sessions
│   │   ├── GigTracker.jsx       # Bandsintown live date widget
│   │   └── LouieEasterEgg.jsx   # Hidden dalmatian Easter egg
│   ├── pages/
│   │   ├── HomePage.jsx         # Landing page with hero
│   │   ├── ArtistsPage.jsx      # Artist listing with filters
│   │   ├── ArtistDetailPage.jsx # Individual artist page
│   │   ├── FeaturedArtistsPage.jsx # PorchFest featured artists
│   │   ├── PorchFestPage.jsx    # Event calendar
│   │   ├── PorchTalkPage.jsx    # YouTube integration
│   │   ├── ClosedOnSundaysPage.jsx # YouTube playlist browser
│   │   ├── SearchPage.jsx       # Tag-first search engine
│   │   └── SpotCheckPage.jsx    # 🤫 Secret Easter egg page
│   ├── data/
│   │   └── data.json            # Centralized data store
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # Entry point
│   ├── index.css                # Global styles
│   └── App.css                  # App-specific styles
├── index.html
├── package.json
└── vite.config.js
```

## Features

### Phase 1: Infrastructure ✅
- **Data Decoupling**: All artist info in centralized `data.json`
- **Dynamic Routing**: Single artist template generates pages on-the-fly
- **Easy Artist Addition**: Add new artists in 30 seconds via JSON

### Phase 2: Still UI ✅
- **Trinity Player**: Custom video layout showing all three segments (Electric → Interview → Acoustic)
- **PorchTalk Integration**: Deep dive section on every artist page

### Phase 3: Vibe Engine ✅
- **Atmospheric Tagging**: Tags like #Gritty, #Soulful, #Rough-In-The-Middle, #LateNight
- **Tag-First Search**: Search bar prioritizes vibe matching over exact names
- **Minimalist UI**: Center-stage search bar

### Phase 4: Expansion ✅
- **Comedy Portal**: "Still Funny" section with Set → Interview → Story format
- **PorchFest Hub**: Dynamic event calendar with vibe-based lineup display

## Design Philosophy

### Look & Feel
- **Dark Mode Only**: Industrial grays, blacks, wood-grain textures
- **Raw Over Polished**: High-res photography with clean, gritty UI
- **Digital Front Porch**: Welcoming, authentic, community-focused

### Color Palette
```css
--color-bg-primary: #121212      /* Deep black */
--color-bg-secondary: #1a1a1a    /* Charcoal */
--color-accent-primary: #d48c29  /* Whiskey amber */
--color-text-primary: #e8dcc4    /* Warm cream */
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:3000`

### Build

```bash
npm run build
```

Output in `dist/` directory

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
npm run lint:fix
```

### Mobile route audit (Playwright)

Runs a smoke check of all routes at a phone-sized viewport. Start the production preview first (e.g. `npm run preview`), then in another terminal:

```bash
set BASE_URL=http://localhost:4173
npm run audit:mobile
```

On macOS/Linux: `BASE_URL=http://localhost:4173 npm run audit:mobile`

### Vercel CLI (linked project)

This repo is linked to the **kuhlshit** project on Vercel via `.vercel/project.json` (committed so teammates get the same link).

```bash
npx vercel        # deploy preview
npx vercel --prod # production
npx vercel env pull .env.local   # optional: sync env vars locally (do not commit secrets)
```

Use `--scope lostsonoflokis-projects` if your default Vercel account is not this team.

### Environment variables (Vercel)

YouTube and other **Vite** env vars use the `VITE_` prefix so they are available in the browser bundle.

- **Local:** Copy `.env.example` to `.env` and fill in values.
- **Vercel:** Set the same keys under **Project → Settings → Environment Variables** for **Production** (and **Preview** if playlist pages should work on preview deployments). Redeploy after changing variables so the build picks them up.

| Variable | Purpose |
| -------- | ------- |
| `VITE_YOUTUBE_API_KEY` | YouTube Data API key (PorchTalk, Closed on Sundays) |
| `VITE_YOUTUBE_PLAYLIST_ID` | Optional; defaults exist in code if unset |

Restrict the key in [Google Cloud Credentials](https://console.cloud.google.com/apis/credentials) (HTTP referrers for your domain, API limited to YouTube Data API v3).

## Data Schema

### Artist Object
```json
{
  "id": "artist-001",
  "name": "Artist Name",
  "location": "City, State",
  "bio": "Artist biography",
  "imageUrl": "/path/to/image.jpg",
  "thumbnailUrl": "/path/to/thumbnail.jpg",
  "vibeTags": ["Gritty", "Soulful", "LateNight"],
  "still": {
    "electricSet": { "videoId": "youtube-id", "title": "...", "duration": "MM:SS" },
    "interview": { "videoId": "youtube-id", "title": "...", "duration": "MM:SS" },
    "acousticCloser": { "videoId": "youtube-id", "title": "...", "duration": "MM:SS" }
  },
  "porchTalk": {
    "url": "https://youtube.com/...",
    "episodeId": "PT-001",
    "title": "...",
    "description": "..."
  },
  "musicLinks": {
    "spotify": "https://...",
    "appleMusic": "https://...",
    "youtube": "https://..."
  },
  "socialLinks": {
    "instagram": "https://...",
    "twitter": "https://...",
    "facebook": "https://..."
  },
  "featured": true,
  "publishDate": "2026-01-15"
}
```

## Adding New Artists

1. Open `src/data/data.json`
2. Add new artist object to the `artists` array
3. Include all required fields (see schema above)
4. Save - changes reflect immediately in dev mode

**No code changes needed!**

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with hero and featured content |
| `/artists` | Browse all artists with tag filters |
| `/porchfest/artists` | Featured Artists for PorchFest |
| `/porchfest/artists/:id` | Individual artist page with Trinity Player, Listen links, Live Dates |
| `/porchfest` | Event calendar |
| `/porch-talk` | YouTube episode browser |
| `/closed-on-sundays` | YouTube playlist browser |
| `/search` | Advanced search with vibe tags |
| `/spotcheck` | 🤫 Secret Easter egg page |

## Easter Eggs

- **Louie the Dalmatian** — 1-in-500 chance to appear on any page load at a random edge. Click to reveal the secret page.

## YouTube Integration

The app integrates with YouTube Data API for:
- PorchTalk episode listing
- Still session videos
- Comedy sets

API Key is stored in `PorchTalkPage.jsx` (should be moved to environment variables for production).

## Future Enhancements

- [ ] Migrate to Supabase/Firebase for dynamic data
- [ ] User authentication for artist submissions
- [ ] Admin dashboard for content management
- [ ] Advanced analytics
- [ ] Social sharing functionality
- [ ] Newsletter integration
- [ ] Merchandise store

## License

ISC

---

**Built with ❤️ for the Kuhlshit.com community**
**Dev Credit: Built by [Josh Jenkins](https://linktr.ee/sonofloke)
