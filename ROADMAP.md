# MASTER ROADMAP: KUHLSHIT.COM

Status key: `[done]` `[in-progress]` `[pending]`

## CURRENT FOCUS (Post-PorchFest — 2026)

Priorities until the data layer and public site are clearly ahead of “backend for payments.” **Paid tiers / billing provider choice are deferred** until you explicitly prioritize monetization.

- [in-progress] **The Vault:** permanent archive for past events (galleries, credits, accurate links).
- [pending] **Supabase foundation:** CLI migrations in-repo, schema aligned to `data.json`, import/seed + parity checks, adapter + env toggle + JSON fallback.
- [pending] **Ship one vertical slice:** e.g. artists (or events) read from Supabase in production only after shadow/parity is boring; rollback is one flag flip.
- [pending] **Quality gates:** no mobile regression on critical routes; staging or shadow logging before wide cutover.

**Out of scope for this window:** Stripe/Paddle, subscription webhooks, Professional tier launch (see `KUHL_HQ.md` when you revive revenue).

---

## Artist bios: placeholder → real copy (one-by-one)

**Goal:** Replace thin or tagline-only PorchFest blurbs in [`src/data/data.json`](src/data/data.json) with proper EPK-style bios (voice, place, releases, links to story). Tackle **one artist per pass**; check off here or in git when done.

**A — Tagline ends with `Performing at PorchFest 2026.`** (period)

- [ ] `the-wright-moves` — The Moves (formerly The Wright Moves)
- [ ] `bb-palmer` — B.B. Palmer
- [ ] `ming-donkey` — Ming Donkey
- [ ] `jonny-hollis` — Jonny Hollis
- [ ] `j-d-spencer` — JD Spencer
- [ ] `tyler-tisdale` — Tyler Tisdale
- [ ] `ritch-henderson` — Ritch Henderson
- [ ] `elliot-devaughn` — Elliot Devaughn *(long bio already; optional: drop or rewrite trailing “Performing at PorchFest 2026.” line only)*

**B — Tagline ends with `Performing at PorchFest 2026!`** (exclamation)

- [ ] `the-stifftones` — The Stifftones
- [ ] `katie-burkhardt` — Katie Burkhardt
- [ ] `hayden-hunter-and-the-yearly-trials` — Hayden Hunter & The Yearly Trials
- [ ] `taylor-hollingsworth` — Taylor Hollingsworth
- [ ] `will-stewart` — Will Stewart
- [ ] `shake-it-like-a-caveman` — Shake It Like a Caveman
- [ ] `haysop` — Haysop
- [ ] `ham-bagby` — Ham Bagby

**C — Other one-liner / minimal PorchFest mentions**

- [ ] `phillip-savell` — Phillip Savell (`Musician performing at PorchFest 2026.`)
- [ ] `brad-and-wes` — Brad & Wes (`Rockabilly duo performing at PorchFest 2026.`)
- [ ] `john-keys` — John Keys (short Sunday line)
- [ ] `too-darn-loud` — Too Darn Loud *(has more copy; still tighten if desired)*

**Not in this list:** Artists with bespoke bios only (e.g. Fire Camino, Honey Boy and Boots, Hunter Myers, Kyla Diane, Abe Partridge, Huey, Jacob Kynard, Megan Lea, etc.) — add a row here if you decide they need a refresh too.

---

## PHASE 1: THE PORCHFEST GAUNTLET (Apr 2026) — complete

- [done] PWA/Mobile Polish: Full-screen mode, address bar removal.
- [done] Social Previews (SEO): Robust OG tags for link sharing.
- [done] Information Density: Grid-based artist discovery.
- [done] Offline Resilience: LocalStorage caching of artist data.
- [done] Flair: Site-wide "Louie the Dalmatian" 1-in-500 logic.

## PHASE 2: THE GLOBAL EPK ENGINE (Post-Festival)

- [pending] Modular Architecture: UI that morphs for Musicians, Painters, and Poets.
- [pending] Agnostic Event Tracker: Manual local show entry + API fallbacks.
- [pending] Sovereign Profiles: Professional digital homes for worldwide creators.

## PHASE 3: COMMUNITY & SCALING

- [pending] Artist Studio: Supabase-powered login for creators to claim profiles (after DB reads are stable; billing still optional).
- [pending] Aesthetic Discovery: Search by "Vibe" (Industrial, Gothic, etc.).
- [pending] Direct Pipeline: 0% fee support buttons (Venmo, Bandcamp, etc.).
- [pending] The Vault: Permanent media archive for past events.
