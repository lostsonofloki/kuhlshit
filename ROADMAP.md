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
