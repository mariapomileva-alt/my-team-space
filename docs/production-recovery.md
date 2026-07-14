# Production recovery — MyTeamSpace

**Last updated:** 14 July 2026  
**Production URL:** https://www.myteamspace.cc/  
**Supabase:** single project (multi-tenant)  
**Hosting:** Vercel project `my-team-space` (team `marija-s-projects1`)

---

## 1. Before you touch anything

1. **Stop deploying** until the incident is understood.
2. Note **time (UTC)**, **symptom**, **affected coaches/teams** (slugs, emails).
3. Capture **Vercel deployment ID** (current production) from Vercel dashboard.
4. Capture **Supabase project ref** and confirm you have **Owner** access.

---

## 2. Database backups (Supabase)

### Verify backup policy

1. Supabase Dashboard → **Project Settings → Database → Backups**
2. Confirm **daily backups** enabled (Pro plan minimum for production).
3. Confirm **Point-in-Time Recovery (PITR)** — note retention window (e.g. 7 days).

### Restore entire database (disaster)

> **Destructive to current data.** Use only for catastrophic corruption or bad migration.

1. Supabase Dashboard → **Database → Backups → Restore**
2. Choose backup timestamp **before** the incident.
3. Restore creates a **new** project or overwrites per Supabase UI flow — follow Supabase docs for your plan.
4. Update Vercel env vars if project ref changes (`SUPABASE_URL`, keys).
5. Redeploy Vercel production.
6. Verify: login, one known team slug, webhook GET health.

### Point-in-time recovery (preferred for partial window)

1. Dashboard → **Database → PITR**
2. Select timestamp just before bad migration/deploy.
3. Follow Supabase wizard to fork/restore.
4. Swap env vars to recovered instance if new project.

---

## 3. Restore a single deleted team

### If team row deleted (soft delete not implemented — row is gone)

1. Restore DB from PITR to a **temporary** fork (or use backup export).
2. Export row from `teams` where `slug = '{slug}'`.
3. Export related `team_members`, `schedule_events`, `team_updates`, `achievements`, `poll_votes`.
4. Insert into production with **same `id`** if possible (preserve Storage paths).

```sql
-- Run on production ONLY after validating exported data
-- Example pattern — adjust columns to match export
INSERT INTO public.teams (...) VALUES (...);
INSERT INTO public.team_members (...) VALUES (...);
```

### If only `blocks` corrupted

1. Supabase Table Editor → `teams` → find by `slug`
2. If `updated_at` recent and content wrong, restore `blocks` from PITR export.
3. Alternatively: coach may have browser session — check before overwrite.

---

## 4. Restore Storage files

Bucket: `team-assets`  
Path: `{team_id}/{folder}/{filename}`

### Single file missing

1. Supabase Dashboard → **Storage → team-assets**
2. Navigate to `{team_id}/`
3. If deleted: restore from **Storage backup** (if enabled) or re-upload manually.
4. Update `blocks` JSON if URL changed (coach must re-save or SQL patch `logo_url` / gallery URLs).

### Orphan cleanup mistake

- **Do not** mass-delete without `team_id` filter.
- Recovery: PITR or per-file restore from backup.

---

## 5. Bad deployment rollback (Vercel)

### Instant rollback

1. Vercel Dashboard → **my-team-space** → **Deployments**
2. Find last **Ready** deployment before incident.
3. Click **⋯ → Promote to Production** (or Rollback).
4. Verify https://www.myteamspace.cc/

### CLI rollback

```bash
cd /path/to/my-team-space
npx vercel ls my-team-space
npx vercel promote <deployment-url> --yes
```

### If rollback insufficient (schema mismatch)

1. Roll back Vercel **and** restore DB to matching migration state.
2. Never deploy new code that expects columns not in production DB.

---

## 6. Failed migration recovery

### Symptoms

- `saveTeamContent` errors mentioning missing column (`publish_status`, etc.)
- App shows "run RUN_COACH_SUBSCRIPTIONS.sql"

### Steps

1. **Do not** re-run random SQL without reading migration file.
2. Check applied migrations:

```sql
SELECT * FROM supabase_migrations.schema_migrations ORDER BY version;
```

3. Compare to repo `supabase/migrations/` — find missing version.
4. Apply **only** missing migration via `supabase db push` OR paste specific migration SQL in SQL Editor.
5. Prefer additive migrations — never DROP column in panic.

### If migration partially applied

1. Restore from PITR to before migration.
2. Fix migration script locally.
3. Re-apply on staging first.

---

## 7. Lemon Squeezy webhook incidents

### Webhook secret rotated

1. Update `LEMONSQUEEZY_WEBHOOK_SECRET` in Vercel Production env.
2. Redeploy.
3. Lemon Dashboard → resend recent failed events.

### Duplicate / wrong subscription state

1. Lemon Dashboard → Subscriptions → find customer.
2. Compare to `coach_subscriptions` row:

```sql
SELECT * FROM coach_subscriptions WHERE user_id = '{uuid}';
```

3. Manual fix (last resort): update via service role using `upsert_coach_subscription_from_lemon` RPC parameters matching Lemon payload.
4. Run `sync` by re-firing `subscription_updated` webhook from Lemon.

### Legacy double webhook URL

- Ensure Lemon points **only** to `/api/lemonsqueezy/webhook`
- `/api/webhooks/lemon-squeezy` must return **410** (verified in tests)

---

## 8. Autosave / data conflict recovery

### Coach reports "changes reverted"

1. Check `teams.updated_at` vs coach device time.
2. Likely `STALE_TEAM_VERSION` — another tab/device saved newer copy.
3. Recovery: no server history — coach must re-edit unless DB PITR export has older `blocks`.

### Prevention (post-incident)

- Enable revision log (future P2)
- Ensure settings page uses same optimistic lock as builder

---

## 9. Access control for production

| Role | Access |
|------|--------|
| Supabase Owner | DB, Storage, Auth, service role key |
| Vercel Owner | Deployments, env vars |
| Lemon Squeezy | Billing, webhooks |
| DNS (Namecheap/etc.) | Domain records |

**Service role key:** server-only (`SUPABASE_SERVICE_ROLE_KEY`). Never commit. Rotate if leaked.

---

## 10. Post-incident checklist

- [ ] Root cause documented in internal log
- [ ] Affected users notified if data impact
- [ ] Regression test added for cause
- [ ] `docs/pre-deploy-checklist.md` updated if gap found
- [ ] Monitoring alert tuned to catch recurrence

---

## Emergency contacts / links

| System | URL |
|--------|-----|
| Vercel project | https://vercel.com/marija-s-projects1/my-team-space |
| Supabase dashboard | (project-specific) |
| Lemon Squeezy | https://app.lemonsqueezy.com |
| GitHub repo | https://github.com/mariapomileva-alt/my-team-space |
| Canonical webhook | `https://www.myteamspace.cc/api/lemonsqueezy/webhook` |

---

## Rollback template (per deploy)

After each production deploy, record:

```
Date (UTC):
Git SHA:
Vercel deployment ID:
Migration versions applied:
Rollback: Vercel → promote deployment dpl_XXXX
         DB → PITR to YYYY-MM-DD HH:MM UTC if needed
```
