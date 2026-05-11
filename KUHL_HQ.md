# KUHL HQ

Living strategy and execution doc for product, pricing, and rollout decisions.

Last updated: 2026-05-11
Owners: Josh (Architecture/Dev), Alan (Business/Strategy)

---

## 1) NOW - POST-PORCHFEST

Goal: ship a credible public site (Vault, accurate event story, solid routes) while laying **Supabase foundation without rushing billing**.

PorchFest week is complete; the old lockdown rules are lifted for **structural backend work**, but still prefer **small, reversible steps** (adapter + JSON fallback, feature flags).

### 30-Minute UI Strike Plan (Immediate Pass)
- [x] **10 min - CTA hierarchy pass:** keep one primary filled button style; make secondary actions outlined.
- [x] **8 min - Mobile readability pass:** increase contrast/weight for small labels, schedule times, and footer micro text.
- [x] **7 min - Spacing rhythm pass:** normalize section spacing to a consistent 16/24/32 pattern.
- [x] **5 min - QA sweep:** test key pages at mobile widths (~390 and ~430) for clipping/crowding/readability.
- [x] **Rule:** if any single tweak takes more than 10 minutes, park it for the next polish pass.

### Next UI Polish Queue
- [ ] Add sticky mobile utility bar (`Lineup` + `Map`) if it stays unobtrusive.
- [x] Reduce heavy glow intensity slightly for a cleaner premium look. *(global shadow tokens + route CSS pass, 2026-05)*
- [x] Standardize image framing (radius/border/shadow) across artist and merch cards. *(`--radius-card`, `--border-hairline`, `--shadow-card`, shared patterns)*
- [x] Add subtle tap/hover affordance on artist cards. *(`@media (hover: hover)` on cards + discovery)*
- [x] Run final typography consistency pass (display headings + clean body/meta hierarchy). *(`h1–h4` scale, `.ui-eyebrow` / `.ui-meta` / `.text-eyebrow` / `.text-meta`, Marker limited to logo + hero; merch / Vault / Waitlist headings use Montserrat)*

### Non-Negotiables
- Protect mobile performance and route reliability.
- Prefer migration slices + parity checks over big-bang rewrites.
- Billing/paid launch stays **parked** until explicitly scheduled (no forced “Day 12 provider lock”).

### Active Checklist
- [ ] Run social preview spot-checks for primary URLs when shipping visible content changes.
- [ ] Periodic mobile smoke checks on Home, PorchFest, Artist Detail, header search, Vault, Closed on Sundays, Porch Talk.
- [ ] Keep artist + Vault data clean (images, links, lineup, archive entries).
- [ ] Log incidents + any JSON/DB fallback used during migration experiments.

### Owners / Deadlines
- Josh: backend migration slices, QA, rollback readiness.
- Alan: comms + partner/artist coordination as needed.

---

## 2) NEXT - POST-PORCHFEST 14-DAY SPRINT (REVISED)

Goal: migrate safely from static JSON to a scalable backend **without breaking UX**. Timeline below is still useful as a **sequence**, not a single uninterrupted calendar block.

### Phase A — Foundation (do first)
- Lock JSON → Supabase schema and frontend data contract (versioned SQL migrations only).
- Import/seed from real site JSON; parity checks on key pages.
- Adapter layer: env toggle + JSON fallback; shadow/compare before flipping reads.

### Phase B — Ship value without payments
- Feature flags; optional auth scaffold **only** if a slice needs accounts (no Stripe requirement).
- Custom domains / analytics / PDF press kit: follow **`ROADMAP.md` CURRENT FOCUS** and backlog scores—**do not** gate foundation work on billing.

### Phase C — When you choose monetization
- Lock billing provider; wire webhooks; align Professional tier scope with `## 3) PRODUCT`.

### Original day-by-day sketch (reference)
- **Days 1-2:** schema + contract.
- **Days 3-5:** seed + parity.
- **Days 6-8:** auth/account model + feature flags (if needed).
- **Days 9-11:** prototype custom domains (CNAME + SSL + verification).
- **Days 12-13:** analytics MVP + PDF press kit MVP *(depends on product priority; not blocked on billing until you sell)*.
- **Day 14:** private beta with creators *(optional timing)*.

### Pre-Sprint Blockers (Must Resolve First)
- [ ] Confirm migration test set uses **live** site records, not synthetic-only data.
- [ ] ~~Lock billing provider before Day 12~~ **Deferred** until Professional tier work is scheduled.

### Optional Later Blockers (when starting paid features)
- [ ] Lock billing provider (Stripe vs Paddle) before shipping subscription webhooks.

### Launch Gates
- [ ] JSON and DB responses match for all core routes.
- [ ] No mobile performance regression on critical pages.
- [ ] CNAME beta passes successful end-to-end tests.
- [ ] Free tier remains polished and fully credible.

---

## 3) PRODUCT

### Mission
Build a clean, fast, artist-first profile engine for musicians, painters, poets, and writers.

### Tier Definitions
- **Core (Free):**
  - Hosted profile URL
  - Mobile-first EPK layout
  - Direct support links (0% platform cut)
  - Event/gig listing support
- **Professional (Paid):**
  - Custom domain (CNAME)
  - One-click PDF press kit export
  - Deeper analytics
  - Expanded media/embed limits

### Feature Matrix (Working Draft)
| Feature | Core | Professional |
|---|---|---|
| Hosted artist profile | Yes | Yes |
| Direct tip/support links | Yes | Yes |
| Event tracker | Yes | Yes |
| Custom domain | No | Yes |
| PDF press kit export | No | Yes |
| Advanced analytics | No | Yes |
| Expanded media limits | No | Yes |

### Not Building Yet
- Multi-tier paid plans beyond Professional.
- Broad automation flows before data model stabilizes.
- Public CNAME rollout before private beta succeeds.

---

## 4) REVENUE

### Pricing Hypothesis
- Professional: **$9/month** or **$90/year** (working default).
- Founding offer: first 50 creators at **$5/month** (lifetime rate).
- Concierge setup: **$99-$299** one-time, based on migration complexity.

### Revenue Channels
- Subscription split between Business/Hosting and Development/Maintenance.
- Concierge setup fees for manual migrations.
- Private contract work for custom enterprise/high-tier requests.

### Decisions Pending
- [ ] Billing provider lock (only when paid tier implementation begins).
- [ ] Annual discount amount and trial policy
- [ ] Refund and cancellation policy wording

---

## 5) TECH DECISION LOG

Use this table to track architecture/product decisions.

| Date | Decision | Why | Owner | Revisit |
|---|---|---|---|---|
| 2026-04-15 | PorchFest runs on JSON first | Lowest risk during event-week launch window | Josh | Post-PorchFest |
| 2026-04-15 | Tier naming uses Core / Professional | Clearer than prior naming, easier to market | Josh + Alan | 30 days |
| 2026-04-15 | Monetize tools, not artist payouts | Preserves artist trust and product differentiation | Josh + Alan | Ongoing |
| 2026-04-16 | CNAME launches behind private beta first | Reduces support burden and de-risks domain onboarding | Josh | After first 10 beta accounts |

---

## 6) RISKS + MITIGATIONS

| Risk | Impact | Mitigation | Owner |
|---|---|---|---|
| CNAME setup/support burden | High | Private beta first, clear DNS docs, verification flow | Josh |
| Migration regressions | High | Adapter layer + feature flags + JSON fallback | Josh |
| Scope creep after festival | Medium | Enforce launch gates + sprint plan | Josh + Alan |
| Weak paid conversion | Medium | Keep free tier strong, price simply, prove Pro value | Alan |

---

## 7) BACKLOG (SCORED)

Score formula: `Impact * Confidence / Effort`

| Idea | Impact (1-5) | Effort (1-5) | Confidence (1-5) | Score | Status |
|---|---:|---:|---:|---:|---|
| Custom domain onboarding wizard | 5 | 4 | 4 | 5.0 | next |
| PDF press kit generator | 4 | 3 | 4 | 5.3 | next |
| Professional analytics dashboard | 4 | 3 | 3 | 4.0 | next |
| Artist self-service editor | 5 | 5 | 3 | 3.0 | active |
| Discovery by vibe/subculture | 4 | 4 | 3 | 3.0 | parked |
| Media archive ("The Vault") | 4 | 4 | 2 | 2.0 | in-progress |

---

## 8) NOTES FOR AI COLLABORATION

When pasting context into Claude/ChatGPT:
- Emphasize mobile-first reliability and speed.
- Keep the Core/Professional split intact.
- Prioritize seamless JSON -> database migration with minimal UI churn.
- Protect the artist-first principle: 0% platform cut on artist earnings.
