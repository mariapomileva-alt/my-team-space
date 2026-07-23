# MyTeamSpace — Pre-Launch Production Audit

**Date:** 14 July 2026 (updated 22 July 2026 after production deploy + smoke)  
**Branch:** `pre-launch-audit`  
**Site:** https://www.myteamspace.cc/  
**Target:** 200 paying coaches by September 2026; infrastructure headroom for **500 teams** without data loss or manual firefighting.

**Security milestone (P0-01, P0-04, P0-02, P0-05):** ✅ **Deployed and verified** on production (21 Jul 2026).

| Field | Value |
|-------|--------|
| Production commit | `c4096db470b5fea4f19cca0320805af2f5a8bfe7` |
| Vercel deployment | `dpl_Ac3s8mgr8JgtHMNuJL2xrEN2Km5D` |
| Production URL | https://www.myteamspace.cc |
| Migrations applied | SQL Editor, 21 Jul 2026 (order `…120000` → `…150000`) |
| Smoke (owner) | Login, builder Live·Saved (Dance Stars), public page, autosave OK |

---

## Security milestone status (22 Jul 2026)

| ID | Status | Migration | Tests | Notes |
|----|--------|-----------|-------|-------|
| **P0-01** | ✅ Deployed & verified | `20260714120000_prevent_unauthorized_team_members_insert.sql` | `lib/security/team-members-insert.test.ts` | Dropped `team_members_insert_own`; INSERT only via `create_team` / `accept_team_admin_invite` RPCs |
| **P0-04** | ✅ Deployed & verified | `20260714130000_prevent_team_role_escalation.sql` | `lib/security/team-role-escalation.test.ts` | `team_members_guard` trigger; `update_team_staff_role` RPC; invite ON CONFLICT DO NOTHING |
| **P0-02** | ✅ Deployed & verified | `20260714140000_restrict_public_team_rpc_fields.sql` | `lib/security/public-team-fields.test.ts` | Explicit public DTO; `filter_public_page_settings`; `verify_team_access` + `/api/teams/[slug]/verify-access` |
| **P0-05** | ✅ Deployed & verified | `20260714150000_restrict_public_team_access_to_published.sql` | `lib/security/public-team-publish.test.ts` | Anon RPC + content RLS require `publish_status = published`; `get_member_team_by_slug` for coach draft preview |
| P0-03 | ✅ Fixed on branch | — | `lib/billing/publish-access.test.ts` | Server `assertCanPublishTeam` on publish only; autosave unchanged |
| P0-06 | ⏳ Partial | — | — | Pro + daily backups + PITR confirmed by owner (Jul 2026); formal recovery drill still open |
| P0-07 | ✅ Fixed on branch | — | `lib/monitoring/monitoring.test.ts` | Sentry (optional DSN) + structured logs + `/api/health` + docs |
| P0-08 | ✅ Fixed on branch | `20260723120000_lemon_webhook_dedup_and_period_end.sql` | `lib/lemon/webhook-payload.test.ts` | Dedup via `lemon_webhook_events`; pass `current_period_end`; skip older `lemon_updated_at` |

### Commits (security milestone)

1. `security: prevent unauthorized team membership insertion`
2. `security: prevent team role self-escalation`
3. `security: restrict public team RPC fields`
4. `security: restrict public team access to published pages`

### Production migrations (applied)

Applied via Supabase SQL Editor in order:

1. `20260714120000_prevent_unauthorized_team_members_insert.sql`
2. `20260714130000_prevent_team_role_escalation.sql`
3. `20260714140000_restrict_public_team_rpc_fields.sql`
4. `20260714150000_restrict_public_team_access_to_published.sql`

Live RPC check after apply: `get_public_team_by_slug`, `verify_team_access`, `get_member_team_by_slug` all respond.  
Note: CLI `schema_migrations` may still be empty (SQL Editor path); optional `migration repair` later.

### Remaining security risk (after milestone)

- **P0-03:** Coach can still publish without server-side subscription check.
- **P0-08:** Duplicate webhook events may double-process; `current_period_end` not persisted.
- **P0-07:** No error monitoring / deploy alerts yet.
- **Storage:** Public `team-assets` bucket unchanged (P1).

---

## Executive summary

### Readiness verdict

| Target | Verdict | Confidence |
|--------|---------|------------|
| **200 paying clients** | **Not ready without P0-03+ ops fixes** | Medium — security milestone done; billing publish gate + monitoring remain |
| **500 teams (platform)** | **Conditionally ready after P0 + P1** | Medium — DB model scales per-tenant; ops/monitoring weak |

### What breaks first if 500 teams sign up tomorrow

1. **You won't know anything broke** — no error monitoring, no failed-save/webhook alerts (silent failures already happened with Vercel deploys).
2. **Billing edge cases** — publish can bypass checkout on server (P0-03); webhook has no event dedup (P0-08).
3. **Write amplification on `teams` table** — autosave every 1.5s per active builder session; optimistic-lock conflicts under parallel tabs/devices (recoverable but noisy).
4. **Supabase Storage + bandwidth** — public `team-assets` bucket; heavy galleries → egress and storage growth (see `docs/infrastructure-capacity.md`).

### Must fix before sales (P0)

P0-01, P0-04, P0-02, P0-05 — **deployed and verified on production**.  
Still required: **P0-03, P0-07, P0-08** (+ formal recovery drill for P0-06) — see [Risk table](#risk-table).

### Can wait until after first 50 customers (P2/P3)

Marketing polish, Lighthouse micro-optimizations, full load-test automation on staging, version history for blocks, subdomain split.

---

## Current state snapshot (14 Jul 2026)

### Tooling

| Check | Result |
|-------|--------|
| `npm test` | **92/92 passed** (20 files) |
| `npx tsc --noEmit` | **Pass** |
| `npm run build` | **Pass** |
| `npm run lint` | **31 errors, ~2963 warnings** — majority from static `docs/` export artifacts, not app source |

### Deployment reality

- **Production host:** Vercel (`server: Vercel` on `www.myteamspace.cc`).
- **GitHub → Vercel auto-deploy:** unreliable — multiple failed builds (TypeScript) left production stale; manual `vercel deploy --prod` required.
- **Legacy `docs/` folder:** static GitHub Pages export (May 2026); **not** the live SaaS app. README still describes Pages workflow — operational confusion risk.
- **CI:** `.github/workflows/ci.yml` — tests + typecheck only; **no deploy, no E2E**.

---

## Architecture map

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Browser (marketing + builder + public pages)                           │
│  Next.js 16 App Router · React 19 · Tailwind · Framer Motion          │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌───────────────┐     ┌─────────────────┐     ┌─────────────────────┐
│ middleware.ts │     │ Server Actions  │     │ API Routes          │
│ session refresh│    │ saveTeamContent │     │ /api/lemonsqueezy/  │
│ OAuth redirect │    │ createTeam*     │     │   webhook (canonical)│
│ canonical host │    │ billing/checkout│     │ /api/admin/teams/   │
└───────────────┘     │ team-admin      │     │   [id]/upload       │
                      └────────┬────────┘     │ /api/teams/.../poll │
                               │               └──────────┬──────────┘
                               ▼                          │
                    ┌──────────────────────┐              │
                    │ Supabase (single     │◄─────────────┘
                    │ project, multi-tenant)│
                    │ · Auth (Google, email)│
                    │ · Postgres + RLS      │
                    │ · Storage team-assets │
                    │ · RPCs (SECURITY      │
                    │   DEFINER)            │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │ Lemon Squeezy        │
                    │ checkout + webhooks  │
                    └──────────────────────┘
```

### Frontend

| Area | Path | Notes |
|------|------|-------|
| Marketing | `app/page.tsx`, `components/landing/*`, `components/marketing/*` | Static + client sections |
| Examples | `app/examples/page.tsx`, `lib/showcase/example-teams.ts` | Portfolio demos; external Unsplash URLs |
| Public team | `app/[slug]/page.tsx` | ISR `revalidate=60`; cache tag 15s |
| Admin hub | `app/admin/(protected)/page.tsx` | Academy dashboard |
| Builder | `components/builder/team-page-builder.tsx` | Autosave 1500ms |
| Block render | `components/blocks/*`, `components/blocks/registry.tsx` | 23 block types |

### Server actions (primary mutations)

| File | Actions |
|------|---------|
| `app/admin/actions.ts` | `createFirstTeamAction`, `createTeamAction` |
| `app/admin/(protected)/team/[teamId]/server-actions.ts` | `loadTeamForBuilder`, `saveTeamContent`, `addTeamUpdate`, `addAchievement` |
| `app/admin/team-admin-actions.ts` | Staff invites, accept invite |
| `app/admin/billing-actions.ts` | `setPrimaryTeamAction`, `assertCanEditTeam` |
| `app/admin/lemon-actions.ts` | Checkout, billing portal |
| `lib/admin/checkout-actions.ts` | `startCheckoutFormAction` |

### API routes

| Route | Purpose |
|-------|---------|
| `/api/lemonsqueezy/webhook` | **Canonical** billing webhook |
| `/api/webhooks/lemon-squeezy` | **410 deprecated** (correct) |
| `/api/admin/teams/[teamId]/upload` | Image/file upload → Storage |
| `/api/teams/[teamSlug]/verify-access` | Server-side private/mixed access code check |
| `/api/teams/[teamSlug]/poll-vote` | Public poll votes |
| `/auth/callback` | OAuth / magic link |

### Supabase tables (production)

| Table | Role |
|-------|------|
| `teams` | **Source of truth** for page content (`blocks` jsonb), publish flag, privacy, denormalized billing flags |
| `team_members` | Coach / assistant membership |
| `coach_subscriptions` | Account-level Lemon billing (1 row per coach) |
| `schedule_events`, `team_updates`, `achievements` | Relational content when blocks disabled |
| `poll_votes` | Public poll responses |
| `team_admin_invites` | Assistant invites (RLS deny-all; RPC only) |
| `team_billing` | **Legacy unused** |

### Storage

- **Bucket:** `team-assets` (public read)
- **Path:** `{team_id}/{folder}/{timestamp-random}.{ext}`
- **Limit:** 5 MB / file; client-side WebP compression for images (`lib/media/compress-image.ts`)

### Auth flow

Signup/login → Supabase Auth → `requireAuth()` on `(protected)` routes → `team_members` for tenant access.  
**Gap:** no `signOut` implementation in app; no password reset UI.

### Billing flow

Pricing CTA → signup (if needed) → `startCheckoutForPlan` → Lemon checkout → webhook → `upsert_coach_subscription_from_lemon` (service role) → `sync_coach_team_subscriptions`.

### Publish flow

Client `publish()` → `saveTeamContent(..., { publish: true })` → `teams.publish_status = 'published'` → `revalidateTag(public-team:{slug})`.  
**No separate published snapshot** — after first publish, autosave updates live content immediately.

### Autosave flow

`TeamPageBuilder` dirty state → 1500ms debounce → `saveTeamContent` with `updated_at` optimistic lock → on conflict `STALE_TEAM_VERSION` + reload.

### Public renderer

`loadPublicTeamBySlug` → RPC + relational fetches → gates on `publish_status`, `subscription_status`, privacy → `TeamPublicPage`.

### Academy flow

`coach_subscriptions.plan_type = academy`, `team_limit = 20`; `create_team` RPC enforces cap with advisory lock; dashboard loads all owned teams (max 20).

### Cron / jobs

**None.**

### Webhooks

Lemon Squeezy → HMAC verify → `processLemonSqueezyWebhook` → upsert subscription → revalidate paths.

### Analytics / monitoring

**None** (no Sentry, PostHog, uptime checks).

---

## Risk table

| ID | Sev | Probability | Impact | Affected flow | Evidence | Safe fix | Regression risk | Effort |
|----|-----|-------------|--------|---------------|----------|----------|-----------------|--------|
| P0-01 | P0 | ~~High~~ | Critical | Tenant isolation | ~~`team_members_insert_own`~~ **Deployed & verified** | — | — | — |
| P0-02 | P0 | ~~High~~ | Critical | Public privacy | ~~`SELECT *` RPC~~ **Deployed & verified** | — | — | — |
| P0-03 | P0 | Medium | High | Billing / go-live | ~~client-only gate~~ **Fixed on branch** — `assertCanPublishTeam` in `saveTeamContent` | Deploy after review | Low | S |
| P0-04 | P0 | ~~Medium~~ | High | Role security | ~~`team_members_update_own`~~ **Deployed & verified** | — | — | — |
| P0-05 | P0 | ~~Medium~~ | High | Content leak | ~~RLS ignores publish~~ **Deployed & verified** | — | — | — |
| P0-06 | P0 | Low | Critical | DR | No documented backup/restore runbook (until this audit) | `docs/production-recovery.md` + verify Supabase PITR | None | S |
| P0-07 | P0 | High | High | Operations | ~~No monitoring~~ **Fixed on branch** — Sentry hooks + JSON logs + health | Set Sentry DSN + UptimeRobot | Low | S |
| P0-08 | P0 | Medium | Medium | Billing accuracy | ~~no dedup / period end~~ **Fixed on branch** — claim event + renews_at/ends_at + ordering | Apply migration + deploy | Low | M |
| P1-01 | P1 | High | High | Data loss | Settings page autosave (`team-settings-client.tsx`) without `updated_at` lock | Reuse `saveTeamContent` or add locking | Low | S |
| P1-02 | P1 | Medium | Medium | Autosave | Silent failures on `persist(true)` | Surface error state in UI | Low | S |
| P1-03 | P1 | Medium | Medium | Auth UX | No logout, no password reset | Add sign-out + reset flow | Low | S |
| P1-04 | P1 | High | Medium | Deploy | GitHub→Vercel auto-deploy failed silently | Fix CI build; Vercel integration; deploy hook alert | Low | S |
| P1-05 | P1 | Medium | Medium | Security | Public Storage bucket — path guessing exposes assets | Accept for MVP OR signed URLs for private teams | Medium | L |
| P1-06 | P1 | Low | Medium | Billing RPC | Some `SECURITY DEFINER` helpers lack explicit REVOKE FROM PUBLIC | Audit grants on `coach_*` functions | Low | S |
| P1-07 | P1 | Medium | Medium | Schema drift | Parallel `RUN_*.sql` vs migrations | Single migration path; verify prod `supabase_migrations` | Medium | M |
| P1-08 | P1 | Medium | Medium | Tests | No tests for `saveTeamContent`, webhook POST, tenant isolation | Add regression tests (see below) | Low | M |
| P2-01 | P2 | Medium | Low | Performance | Academy hub loads full `blocks` for all teams for completion % | Project only needed fields or cache summaries | Low | M |
| P2-02 | P2 | Medium | Low | Data | No `blocks` size limit — large JSON payloads | Server max size + gallery count soft limits | Medium | M |
| P2-03 | P2 | Low | Low | Marketing | `startPlan` query ignored on signup page | Wire signup to checkout intent | Low | S |
| P3-01 | P3 | Low | Low | DX | 2963 lint warnings in `docs/` static export | Exclude `docs/` from lint or remove stale export | None | S |

---

## Data safety

| Question | Current state |
|----------|---------------|
| Draft storage | **No separate draft** — `teams.blocks` is live document |
| Published storage | `teams.publish_status` flag only |
| Source of truth | `teams.blocks` + metadata columns |
| Empty overwrite risk | Low on read (normalize merges defaults); save accepts client JSON as-is |
| JSON parse failure | `map-row.ts` normalizes on load; corrupt DB healed on next save |
| Schema validation before write | **None** on server |
| JSON size limit | **None** on `blocks` |
| Optimistic concurrency | **Yes** — `updated_at` on builder save |
| Version history | **None** |
| Transactions | Single-row updates; webhook RPC is transactional |
| Storage orphan cleanup | **None** automated |

**Minimal safe recommendation (no big rewrite):**

1. Confirm Supabase **daily backups + PITR** on paid plan.
2. Add **pre-migration backup** step to `docs/pre-deploy-checklist.md`.
3. Optional: `teams_blocks_revisions` append-only table (last 5 revisions) — P2, not required for launch if backups verified.

---

## Security summary

| Area | Status |
|------|--------|
| RLS enabled | Yes on all tenant tables |
| Tenant isolation | **Deployed & verified** — P0-01/02/04/05 on production |
| Billing writes | Correct — client cannot UPDATE `coach_subscriptions` |
| Service role | Server-only (`lib/supabase/admin.ts` + `server-only`) |
| Webhook signature | HMAC verified |
| Legacy webhook | Correctly returns 410 |
| Upload auth | Membership check + team-scoped path |
| Secrets in client | Only anon key (expected) |

**Security regression tests (added on `pre-launch-audit`):**

- `lib/security/team-members-insert.test.ts` — INSERT policy removal
- `lib/security/team-role-escalation.test.ts` — role guard trigger + RPC
- `lib/security/public-team-fields.test.ts` — public DTO allowlist, page_settings filter
- `lib/security/public-team-publish.test.ts` — publish_status visibility rules

**Still recommended on staging (live PostgREST):**

- User A cannot read/update User B's team via PostgREST
- Publish without active subscription returns 403 (P0-03)

---

## Performance (measured vs estimated)

| Surface | Measurement status | Notes |
|---------|-------------------|-------|
| Homepage | Not instrumented in CI | Marketing static + client hero |
| Builder | Not load-tested | 1.5s autosave debounce |
| Public page | ISR 60s page / 15s data cache | Good for read-heavy |
| Lighthouse | **Not run in this audit** | Manual run recommended before launch |

**Known bottlenecks (code review):**

- Full `teams` row fetched for every public page view (includes large `blocks` jsonb)
- Gallery loads all image URLs from blocks (lazy loading depends on component implementation)
- No CDN in front of Supabase Storage (relies on Supabase egress)

---

## Load test plan (not executed on production)

**Environment:** Staging Supabase project mirroring RLS + migrations, Vercel preview deployment, Lemon test mode.

**Synthetic marker:** `page_settings._loadTest = true` on test teams for safe deletion script.

**Scenarios:**

| Scenario | Target | Pass criteria |
|----------|--------|---------------|
| Public page reads | 50 → 100 concurrent | p95 < 2s, error < 1% |
| Builder autosave | 25 concurrent coaches | p95 save < 3s, no STALE storm > 5% |
| Login burst | 20 signups/min | no auth errors |
| Webhook burst | 50 replayed events | idempotent state, no duplicate charges |

**Cleanup:** `DELETE FROM teams WHERE page_settings->>'_loadTest' = 'true'` + Storage list by team_id prefix.

See `docs/infrastructure-capacity.md` for capacity math.

---

## Test coverage gaps

| Scenario | Covered? |
|----------|----------|
| Plan catalog / checkout payload | Yes (`pricing-regression.test.ts`) |
| Coach entitlements | Yes (`coach-entitlements.test.ts`) |
| Legacy webhook 410 | Yes |
| Auth flows | **No** |
| saveTeamContent / publish | **No** |
| Webhook signature + processing | **No** |
| Block save round-trip | Partial (visibility, schedule) |
| RLS tenant isolation | Partial (migration SQL + helpers; live policy tests pending) |
| Upload validation | **No** |

---

## Marketing / sellability (Stage 10)

| Criterion | Assessment |
|-----------|------------|
| 5-second clarity | **Good** after recent hero ("One link. No more group chat chaos.") |
| Problem/solution | Clear for parents/coaches |
| Real outcome visible | **Strong** on `/examples` (after Unsplash URL fix) |
| Demo quality | 3 portfolio examples — good |
| Trust before pay | Trial on CTA; needs billing truth alignment (7-day trial in Lemon) |
| Pricing clarity | €29 / €199 documented |
| CTA | "Start 7-day free trial" on landing |

**Product idea alignment:** One beautiful space for schedule, updates, photos, achievements, payments — demonstrated on examples page.

**Do not add** fake customer counts. Demo content is clearly portfolio-style.

---

## Launch readiness checklist

See `docs/launch-checklist.md`.

---

## Recommended fix order (post-report)

### Phase 1 — P0 only (1–2 weeks)

1. ~~Fix `team_members` INSERT/UPDATE policies (P0-01, P0-04)~~ ✅
2. ~~Public-safe `get_public_team_by_slug` (P0-02)~~ ✅
3. Server-side publish billing gate (P0-03)
4. ~~Tighten public-read RLS (P0-05)~~ ✅
5. Monitoring + deploy alerts (P0-07)
6. Verify Supabase backups (P0-06)
7. Webhook `current_period_end` + idempotency (P0-08)

### Phase 2 — P1 before scaling past 50 customers

Settings autosave lock, auth logout/reset, security tests, migration path cleanup.

### Phase 3 — P2 backlog

Blocks size limits, revision log, performance instrumentation, staging load tests.

---

## Manual actions required (owner)

### Supabase

- [ ] Confirm production on **Pro plan** with **PITR** enabled
- [ ] Apply security migrations `20260714120000` … `20260714150000` (see [Security milestone](#security-milestone-status-14-jul-2026))
- [ ] Verify all prior migrations applied (`20260514120000` … `20260613120000`)
- [ ] Remove reliance on manual `RUN_*.sql` in production
- [ ] Review Storage usage alerts
- [ ] Rotate service role key if ever exposed

### Vercel

- [ ] Confirm Git integration on `main` → production
- [ ] Enable deployment failure notifications
- [ ] Set all env vars (see `docs/pre-deploy-checklist.md`)
- [ ] Consider Pro if bandwidth exceeds Hobby limits

### Lemon Squeezy

- [ ] Webhook URL: `https://www.myteamspace.cc/api/lemonsqueezy/webhook` only
- [ ] Verify Team + Academy variant IDs match `lib/billing/config.ts`
- [ ] Confirm 7-day trial configured in variants (matches marketing copy)

### DNS

- [ ] `myteamspace.cc` → Vercel (apex redirect to www)
- [ ] `www.myteamspace.cc` → Vercel production

### Monitoring (minimal)

- [ ] Uptime monitor on `/` and `/api/lemonsqueezy/webhook` GET
- [ ] Error tracking (Sentry) on server actions + webhook route

---

## What was intentionally not changed in this audit

- Builder architecture
- Block schema / `teams.blocks` format
- Lemon variant IDs
- Public renderer block components (`TeamPageBlocks`, `TeamShell`, etc.)
- Billing plan mapping logic
- UI / marketing (except prior landing work on `main`)

**Minimal exceptions for security milestone:** `TeamAccessGate` (server verify instead of client secret compare), `app/[slug]/page.tsx` member fallback for coach draft preview, `lib/teams/map-row.ts` public `page_settings` filter.

---

## Appendix: Key file index

| Concern | Files |
|---------|-------|
| Save/publish | `app/admin/(protected)/team/[teamId]/server-actions.ts` |
| Autosave | `components/builder/team-page-builder.tsx` |
| Public load | `lib/teams/public.ts`, `lib/teams/member.ts`, `app/[slug]/page.tsx` |
| Access verify | `app/api/teams/[teamSlug]/verify-access/route.ts`, `components/mts/team-access-gate.tsx` |
| Security tests | `lib/security/*.test.ts` |
| RLS | `supabase/migrations/20260714120000` … `20260714150000` |
| Upload | `app/api/admin/teams/[teamId]/upload/route.ts` |
| Image compress | `lib/media/compress-image.ts` |
