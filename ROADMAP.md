# MASTER ROADMAP: [KUHLSHIT.COM](http://KUHLSHIT.COM)

Status key: `[done]` `[in-progress]` `[pending]` `[parked]`

**PorchFest 2027:** Friday **April 9**, 5:00 PM–11:00 PM, and Saturday **April 10**, 12:00 PM–11:00 PM (two days — not the 2026 Fri–Sun). **Lineup includes comedians** as well as musicians (2026 was music-only). Venue and ticket model TBD; assume Columbus / Munson & Brothers and door tickets until specified.

**Shipped from cloud (2026-09-26), now on this PC:**

- [done] **Pre-meeting fixes:** PorchFest hub shows the festival only; search, playlists, and live-date lists no longer treat Closed on Sundays rows or past gigs as current PorchFest.
- [done] **Vault — past Closed on Sundays:** archive descriptions for sessions before that date read as recorded sets at Al's.
- [done] **Closed on Sundays copy:** recorded at Al’s Spirits & Music, the package store in Reform, AL. The store is the listening room (not a separate room). Shows are free; bring a chair.

---

## CURRENT FOCUS

Festival-first through the 2027 weekend. Site work is announce, lineup, artist pages, map, tickets copy, **online merch shop**, event-week stability, then Vault — plus the public identity **Artist, Comedians, and Musicians**.

- [in-progress] **Public identity:** replace Musicians / Painters / Poets / Photographers / Filmmakers with **Artist, Comedians and Musicians** (hero, home cards, `/artists` tabs, SEO). Painters, photographers, filmmakers, and poets fold under Artist. Comedians get a real browse tab (Mike Rainey lives in `data.comedy` today) **and booked PorchFest 2027 comics must appear on the festival lineup**, not only the comedy archive.
- [pending] **Online merch shop:** catalog is in `src/data/merch.json`. **`ShopPage` is not mounted**, so there is no public `/shop` until Alan's Stripe account exists. Then route it, add `https://buy.stripe.com/...` links, and set `holdCheckout` to false. Site never holds a secret key. **Does not** un-park Professional-tier subscriptions.
- [pending] **Un-archive** `/porchfest`**:** festival ids only (`pf-001` archive + `pf-2027` live); do not mix Closed on Sundays into the hub. Stop treating `events[0]` as “the” festival.
- [pending] **Save the date:** Apr 9–10, 2027 on the hub, home, calendar ICS, OG — no PorchFest header link until this ships.
- [in-progress] **The Vault:** keep 2026 film/credits accurate; 2027 gallery after the weekend.

**Parked until after Apr 10, 2027:** Supabase cutover, Professional-tier billing (Stripe/Paddle subscriptions), Artist Studio, custom domains, PDF press kits, vibe discovery. Merch checkout is **in scope** for 2027; artist-subscription billing is not. See `KUHL_HQ.md` when you revive revenue.

---



## PORCHFEST 2027 TIMELINE


| When                                  | Phase                     | Site                                                         |
| ------------------------------------- | ------------------------- | ------------------------------------------------------------ |
| Now (Aug 2026)                        | A — Un-archive + identity | Hub can host two years; triad copy live                      |
| Dates locked                          | B — Announce              | Live-mode `/porchfest`, ICS, OG, announcement                |
| Rolling → ~late Feb 2027              | C — Lineup + shop         | Musicians + comedians; merch store live enough to link       |
| ~6–8 weeks out (late Feb / early Mar) | D — Event UX + lockdown   | Sticky Lineup + Map; ticket copy; shop + merch CTAs locked   |
| **Apr 9–10, 2027**                    | E — Weekend               | Fri 5–11 PM, Sat 12–11 PM; stability only                    |
| Week after                            | F — Vault                 | 2027 film + credits; hub back to archive                     |




### Phase A — Un-archive the hub

- [done] Filter `/porchfest` so Closed on Sundays rows are not festival cards. Live year is still `pf-001` only until `pf-2027` exists.
- [pending] Look up the live festival by id, not `events[0]`.
- [pending] Hide door tickets / “add to calendar” on the **archived** 2026 event.
- [pending] Add `pf-2027` stub: `date` `2027-04-09`, `endDate` `2027-04-10`, `displayDate` `Apr 9-10`. Schedule: Friday doors `5:00 PM` / end `11:00 PM`; Saturday doors `12:00 PM` / end `11:00 PM`.
- [pending] Hero / cards / tabs / SEO: **Artist, Comedians and Musicians**. Redirect `?tab=visual` and retire `/poets-writers` as a marketed category.



### Phase B — Announce (dates are locked)

- [pending] Live-mode banner on `/porchfest` (replace archive-only header).
- [pending] Home + announcement bar point at Apr 9–10, 2027.
- [pending] `/calendar/porchfest-2027.ics`; drop hardcoded 2026 strings on the live hub.
- [pending] Poster / OG / SEO for 2027.



### Phase C — Lineup machine (rolling until ~6 weeks out)

Same add-artist path: drop photo in `Artist/`, copy to `public/resources/artists/<slug>/`, `node scripts/optimize-images.mjs`, then `data.json`.

- [pending] Lineup as data: Friday Apr 9 (5:00 PM–11:00 PM) / Saturday Apr 10 (12:00 PM–11:00 PM). **Musicians and comedians** in the same day groups. Timed `{ name, start_time, end_time }` when set times exist (unlocks LIVE/NEXT).
- [pending] Comedian profiles on the hub (same photo → `Artist/` → optimize → `data.json` path, or link `data.comedy` into `pf-2027` lineup so comics are not a separate dead end).
- [pending] Link lineup by **artist id** (avoid `the-moves` vs `the-wright-moves` slug mismatches).
- [pending] Real bios for **booked 2027** musicians and comedians; 2026 leftover taglines below.
- [pending] Optional: show `lineupImageUrl` as a shareable schedule graphic.
- [pending] **Merch shop:** pick provider; catalog 2027 (and evergreen) items; replace `TicketMerch` “beside the stage” CTA with **Buy** links. Hide shop CTAs on the 2026 archive event.



### Phase D — Event UX + lockdown (~late Feb / early Mar 2027)

- [pending] Sticky mobile **Lineup + Map** bar (deferred after 2026). Reuse day-jump anchors + map FAB.
- [pending] Ticket copy: door vs advance — display-only unless a seller is chosen. Festival **tickets** can stay gate sales; **merch** is online.
- [pending] Shop linked from `/porchfest`, home, and header/footer. Mobile smoke: Home, `/porchfest`, artist detail, map FAB, merch checkout (or outbound shop).
- [pending] **Lockdown:** no new features, JSON-only edits, OG spot-checks. Shop stays up.



### Phase E — Weekend (Apr 9–10, 2027)

- [pending] Stability and data fixes only (times, cancellations, merch).
- [pending] LIVE/NEXT if slots have times.



### Phase F — Vault (week of Apr 12, 2027)

- [pending] `pf-2027` `gallery` + photographer credit.
- [pending] Hub flips to archive; 2026 stays in The Vault.

---



## Artist bios: placeholder → real copy (one-by-one)

**Goal:** Replace thin or tagline-only PorchFest blurbs in `[src/data/data.json](src/data/data.json)` with proper EPK-style bios. Tackle **one artist per pass**. For 2027 bookings, write real copy; for 2026-only acts, past-tense or leave archive as-is.

**2027 bookings:** add a row here when an act is confirmed (musicians **and** comedians).

**2027 comedians:** add a row when a comic is booked.

**A — Tagline ends with** `Performing at PorchFest 2026.` (period)

- [ ] `the-wright-moves` — The Moves (formerly The Wright Moves)
- [ ] `bb-palmer` — B.B. Palmer
- [ ] `ming-donkey` — Ming Donkey
- [ ] `jonny-hollis` — Jonny Hollis
- [ ] `j-d-spencer` — JD Spencer
- [ ] `tyler-tisdale` — Tyler Tisdale
- [ ] `ritch-henderson` — Ritch Henderson
- [ ] `elliot-devaughn` — Elliot Devaughn *(long bio already; optional: drop or rewrite trailing “Performing at PorchFest 2026.” line only)*

**B — Tagline ends with** `Performing at PorchFest 2026!` (exclamation)

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

**Not in this list:** Artists with bespoke bios only (e.g. Fire Camino, Drew and Courtney Blackwell, Hunter Myers, Kyla Diane, Abe Partridge, Huey, Jacob Kynard, Megan Lea, etc.) — add a row here if you decide they need a refresh too.

---



## PHASE 1: THE PORCHFEST GAUNTLET (Apr 2026) — complete

- [done] PWA/Mobile Polish: Full-screen mode, address bar removal.
- [done] Social Previews (SEO): Robust OG tags for link sharing.
- [done] Information Density: Grid-based artist discovery.
- [done] Offline Resilience: LocalStorage caching of artist data.
- [done] Flair: Site-wide "Louie the Dalmatian" 1-in-500 logic.



## PHASE 2: THE GLOBAL EPK ENGINE — parked (after Apr 10, 2027)

- [parked] Modular Architecture: UI that morphs for **Artist, Comedians, and Musicians** (identity copy is CURRENT FOCUS; full EPK engine is not).
- [parked] Agnostic Event Tracker: Manual local show entry + API fallbacks.
- [parked] Sovereign Profiles: Professional digital homes for worldwide creators.



## PHASE 3: COMMUNITY & SCALING — parked (after Apr 10, 2027)

- [parked] Artist Studio: Supabase-powered login for creators to claim profiles (after DB reads are stable; billing still optional).
- [parked] Aesthetic Discovery: Search by "Vibe" (Industrial, Gothic, etc.).
- [parked] Direct Pipeline: 0% fee support buttons (Venmo, Bandcamp, etc.).
- [in-progress] The Vault: Permanent media archive for past events.

