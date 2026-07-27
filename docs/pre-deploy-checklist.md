# Pre-deploy checklist — MyTeamSpace

Run this **before every production deployment**, especially migrations or billing changes.

---

## 1. Code quality (local / CI)

- [ ] `npm test` — all pass
- [ ] `npx tsc --noEmit` — no errors
- [ ] `npm run build` — succeeds
- [ ] No unintended changes to `teams.blocks` normalization / `map-row.ts`
- [ ] No changes to Lemon variant IDs without dashboard update
- [ ] No `service_role` key in client code

---

## 2. Database (if migrations included)

- [ ] Migration is **additive** (no DROP COLUMN / DROP TABLE without manual plan)
- [ ] Migration tested on **staging** or local Supabase
- [ ] `supabase_migrations.schema_migrations` on prod reviewed
- [ ] **Backup confirmed** (daily backup + PITR window noted)
- [ ] Rollback plan written (see `docs/production-recovery.md`)
- [ ] `RUN_*.sql` manual scripts **not** used instead of versioned migrations

---

## 3. Environment variables (Vercel Production)

### Required — app won't work without

- [ ] `SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (server only)
- [ ] `NEXT_PUBLIC_SITE_URL` = `https://www.myteamspace.cc`

### Required — billing

- [ ] `LEMONSQUEEZY_API_KEY`
- [ ] `LEMONSQUEEZY_STORE_ID`
- [ ] `LEMONSQUEEZY_TEAM_VARIANT_ID` (or approved alias)
- [ ] `LEMONSQUEEZY_ACADEMY_VARIANT_ID`
- [ ] `LEMONSQUEEZY_WEBHOOK_SECRET`
- [ ] `NEXT_PUBLIC_APP_URL` = `https://www.myteamspace.cc`

### Optional

- [ ] `RESEND_API_KEY` + `RESEND_FROM_EMAIL` (staff invites)
- [ ] `TWILIO_*` (poll notifications)

---

## 4. External services

- [ ] Lemon webhook URL = `https://www.myteamspace.cc/api/lemonsqueezy/webhook`
- [ ] Legacy webhook URL **removed** from Lemon (or returns 410)
- [ ] Supabase Auth redirect URLs include `https://www.myteamspace.cc/auth/callback`
- [ ] Google OAuth provider enabled in Supabase (if using Google login)

---

## 5. Smoke test (after deploy)

- [ ] https://www.myteamspace.cc/ loads (new deploy visible)
- [ ] `/examples` images load
- [ ] `/admin/login` loads
- [ ] `GET /api/lemonsqueezy/webhook` returns ready message
- [ ] Known public team slug loads (if exists)
- [ ] Builder autosave on test team (staging or personal test account)
- [ ] Vercel deployment status = **Ready** (not Error)

---

## 6. Post-deploy

- [ ] Record deployment ID + git SHA in team log
- [ ] Monitor Vercel logs 15 min for 5xx
- [ ] If billing change: trigger test webhook in Lemon test mode

---

## Do not deploy if

- Production build failed locally
- Migration not reviewed
- Friday evening without on-call coverage (recommended policy)
