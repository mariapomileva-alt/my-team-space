# Launch checklist — MyTeamSpace

**Target:** Active sales September 2026 · **200 paying coaches** · infra headroom **500 teams**

Use with `docs/pre-launch-audit.md` and `docs/infrastructure-capacity.md`.

---

## Must do before sales (P0)

### Security & data isolation

- [ ] **P0-01** Fix `team_members` INSERT — block self-join to arbitrary teams
- [ ] **P0-04** Block self role escalation (`assistant` → `coach`)
- [ ] **P0-02** Replace `get_public_team_by_slug` with public-safe column projection
- [ ] **P0-05** Add `publish_status = 'published'` to public-read RLS on content tables
- [ ] Security regression tests for tenant isolation

### Billing & go-live

- [ ] **P0-03** Server-side `publishRequiresCheckout` in `saveTeamContent`
- [ ] **P0-08** Webhook writes `current_period_end`; consider event idempotency table
- [ ] Lemon 7-day trial matches marketing copy on site
- [ ] Single Team: cannot create 2nd team (verified E2E)
- [ ] Academy: 20-team cap enforced (verified E2E)

### Operations & recovery

- [ ] **P0-06** Supabase Pro + PITR verified; recovery drill once
- [ ] **P0-07** Error monitoring (Sentry or equivalent) on server actions + webhook
- [ ] Uptime monitor on `/` and webhook GET
- [ ] Vercel deploy-failure alerts enabled
- [ ] `docs/production-recovery.md` read by operator

### Deploy pipeline

- [ ] GitHub `main` → Vercel production auto-deploy working
- [ ] CI green on `main` before each release
- [ ] `docs/pre-deploy-checklist.md` used for every release

---

## Should do before 200 customers (P1)

### Data integrity

- [ ] **P1-01** Settings page autosave uses `updated_at` optimistic lock
- [ ] **P1-02** Builder shows error on failed silent autosave
- [ ] Integration tests for `saveTeamContent` + stale version

### Auth completeness

- [ ] **P1-03** Sign out button + `signOut` implementation
- [ ] Password reset flow (`resetPasswordForEmail`)
- [ ] `startPlan` query honored on signup → checkout path

### Schema & ops

- [ ] **P1-07** Production DB matches migration chain (no drift from `RUN_*.sql`)
- [ ] Drop or document legacy `team_billing` table
- [ ] **P1-06** REVOKE PUBLIC on billing SECURITY DEFINER functions

### Performance baseline

- [ ] Lighthouse on homepage + one heavy public team page (record scores)
- [ ] Autosave p95 measured on staging load test

---

## Can wait until after first 50 customers (P2/P3)

- [ ] `teams.blocks` size limit + gallery count guidance
- [ ] Limited revision history for `teams.blocks`
- [ ] Academy dashboard — don't load full blocks for all teams
- [ ] Private Storage + signed URLs
- [ ] Staging environment with automated load tests
- [ ] Marketing: header CTA trial copy alignment
- [ ] Remove stale `docs/` GitHub Pages export from repo or README clarity
- [ ] Lint cleanup for static `docs/` artifacts

---

## Product / marketing readiness

- [ ] Hero communicates "one link" value in < 10 seconds
- [ ] `/examples` — 3 demos with working photos and realistic content
- [ ] Pricing page — trial + €29 / €199 clear
- [ ] No fake customer testimonials
- [ ] Support contact visible (`/support`)
- [ ] Legal pages live (`/terms`, `/privacy`, `/cookies`)

---

## Launch day

- [ ] Final smoke test on production (see pre-deploy checklist)
- [ ] Lemon webhook delivery green (last 24h)
- [ ] Supabase Storage usage < 70% plan
- [ ] On-call person identified for first 72 hours
- [ ] Rollback deployment ID recorded

---

## Success metrics (first 30 days post-launch)

| Metric | Target |
|--------|--------|
| Signup → first team created | > 60% |
| First publish | > 40% of teams |
| Checkout completion | track in Lemon |
| Webhook failure rate | < 0.1% |
| Autosave error rate | < 1% |
| Public page 5xx | 0 |

---

## Sign-off

| Area | Owner | Date | Ready? |
|------|-------|------|--------|
| Security P0 | | | ☐ |
| Billing | | | ☐ |
| Supabase / backups | | | ☐ |
| Vercel / deploy | | | ☐ |
| Monitoring | | | ☐ |
| Marketing / demos | | | ☐ |
| **Overall launch** | | | ☐ |
