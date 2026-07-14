# Security milestone — migration deployment package

**Branch:** `pre-launch-audit`  
**Deploy commit (target):** `574ee8f0f97eb872717790a9bd06cc2d384966c2`  
**Migrations:** 4 files, apply in strict order below.

---

## Data safety confirmation

| Question | Answer |
|----------|--------|
| Deletes user rows? | **No** |
| Modifies `teams.blocks`? | **No** |
| Modifies billing / `coach_subscriptions`? | **No** |
| Deletes Storage files? | **No** |
| Changes Lemon variant IDs? | **No** |
| Requires manual production data edits? | **No** |

All migrations are **additive** (policies, functions, triggers, comments). No `DELETE`, `UPDATE`, or `TRUNCATE` on user data.

---

## Migration 1 of 4

| Field | Value |
|-------|--------|
| **Filename** | `20260714120000_prevent_unauthorized_team_members_insert.sql` |
| **P0** | P0-01 — tenant isolation |
| **Goal** | Block direct client INSERT into `team_members` (self-join to arbitrary teams) |

### Removes / replaces

| Object | Operation |
|--------|-----------|
| Policy `team_members_insert_own` on `public.team_members` | `DROP POLICY IF EXISTS` |

### Creates

| Object | Operation |
|--------|-----------|
| Comment on `public.team_members` | `COMMENT ON TABLE` |

### DDL summary

- `DROP POLICY` — yes  
- `DROP FUNCTION` — no  
- `CREATE OR REPLACE` — no  
- Locks table? | **No** — metadata only  
- Changes existing rows? | **No**  
| Idempotent / re-runnable? | **Yes** (`DROP POLICY IF EXISTS`) |
| **Estimated duration** | **< 1 second** |

### Rollback SQL

```sql
create policy team_members_insert_own on public.team_members
  for insert to authenticated
  with check (user_id = auth.uid());
```

### App compatibility

Safe with **old or new** app. No client code used direct INSERT before this change.

---

## Migration 2 of 4

| Field | Value |
|-------|--------|
| **Filename** | `20260714130000_prevent_team_role_escalation.sql` |
| **P0** | P0-04 — role self-escalation |
| **Goal** | Block direct role changes; protect last owner; secure invite accept |

### Removes / replaces

| Object | Operation |
|--------|-----------|
| Trigger `team_members_guard` | `DROP TRIGGER IF EXISTS` then recreate |
| Function `public.team_members_guard()` | `CREATE OR REPLACE` |
| Function `public.accept_team_admin_invite(text)` | `CREATE OR REPLACE` |

### Creates

| Object | Operation |
|--------|-----------|
| Trigger `team_members_guard` on `team_members` | `BEFORE UPDATE OR DELETE` |
| Function `public.update_team_staff_role(uuid, uuid, text)` | new RPC |
| Grants on `accept_team_admin_invite`, `update_team_staff_role` | `REVOKE` / `GRANT` |

### DDL summary

- `DROP POLICY` — no  
- `DROP FUNCTION` — no (trigger dropped/recreated)  
- `CREATE OR REPLACE` — yes (3 functions)  
- Locks table? | Brief row-level lock only if concurrent UPDATE/DELETE on `team_members` during apply; **no table-wide lock**  
- Changes existing rows? | **No**  
| Idempotent / re-runnable? | **Yes** |
| **Estimated duration** | **< 2 seconds** |

### Rollback SQL

```sql
drop trigger if exists team_members_guard on public.team_members;
drop function if exists public.team_members_guard();
drop function if exists public.update_team_staff_role(uuid, uuid, text);

-- Restore accept_team_admin_invite from supabase/migrations/20260529140000_team_admin_invites.sql
-- (ON CONFLICT DO UPDATE SET role = excluded.role)
```

### App compatibility

Safe with **old or new** app. Invite and `create_team` flows unchanged from user perspective.

---

## Migration 3 of 4

| Field | Value |
|-------|--------|
| **Filename** | `20260714140000_restrict_public_team_rpc_fields.sql` |
| **P0** | P0-02 — public RPC field leak |
| **Goal** | Return explicit public DTO; filter `page_settings`; server-side access verify |

### Removes / replaces

| Object | Operation |
|--------|-----------|
| Function `public.get_public_team_by_slug(text)` | `DROP FUNCTION` then `CREATE` (return type changes) |
| — | New: `filter_public_page_settings(jsonb)` |
| — | New: `verify_team_access(text, text)` |

### Creates

| Object | Operation |
|--------|-----------|
| `public.filter_public_page_settings` | `CREATE OR REPLACE` |
| `public.verify_team_access` | `CREATE OR REPLACE` |
| `public.get_public_team_by_slug` | explicit `RETURNS TABLE (...)` — 17 columns |
| Grants on above | `REVOKE` / `GRANT` to `anon`, `authenticated` |

### DDL summary

- `DROP FUNCTION` — **yes** (`get_public_team_by_slug`)  
- `CREATE OR REPLACE` — yes  
- Locks table? | **No**  
- Changes existing rows? | **No**  
| Idempotent / re-runnable? | **Yes** |
| **Estimated duration** | **< 2 seconds** |

### Rollback SQL

Restore from `supabase/migrations/20260514120000_saas_multitenant.sql`:

```sql
drop function if exists public.verify_team_access(text, text);
drop function if exists public.filter_public_page_settings(jsonb);

create or replace function public.get_public_team_by_slug(p_slug text)
returns setof public.teams
language sql security definer stable set search_path = public
as $$ select * from public.teams where slug = lower(trim(p_slug)) limit 1; $$;

revoke all on function public.get_public_team_by_slug(text) from public;
grant execute on function public.get_public_team_by_slug(text) to anon, authenticated;
```

Also redeploy **previous** app commit (client-side `TeamAccessGate` with `codesMatch`).

### App compatibility — **critical**

| App version | After migration 3 |
|-------------|-------------------|
| **Old app** | Published **public** pages: OK. **Private/mixed** access gate: **broken** (no `access_code` in RPC). |
| **New app** (`574ee8f`) | Needs `verify_team_access` RPC — **works** after migration 3. |

**Deploy new app within minutes after migration 3** (or apply migrations 3+4 and deploy together).

---

## Migration 4 of 4

| Field | Value |
|-------|--------|
| **Filename** | `20260714150000_restrict_public_team_access_to_published.sql` |
| **P0** | P0-05 — publish_status on public read |
| **Goal** | Anon only sees published + active/trialing teams; coach draft via member RPC |

### Removes / replaces

| Object | Operation |
|--------|-----------|
| `public.get_public_team_by_slug(text)` | `DROP` + `CREATE OR REPLACE` (adds WHERE publish filter) |
| `public.verify_team_access(text, text)` | `CREATE OR REPLACE` (published-only) |
| Policy `schedule_events_public_read` | `DROP` + `CREATE` |
| Policy `team_updates_public_read` | `DROP` + `CREATE` |
| Policy `achievements_public_read` | `DROP` + `CREATE` |

### Creates

| Object | Operation |
|--------|-----------|
| `public.get_member_team_by_slug(text)` | new RPC (`authenticated` only) |
| Updated public_read policies | require `publish_status = 'published'` |

### DDL summary

- `DROP POLICY` — yes (3 content policies)  
- `DROP FUNCTION` — yes (`get_public_team_by_slug` signature unchanged but dropped for replace)  
- `CREATE OR REPLACE` — yes  
- Locks table? | **No** on `teams`; policy swap is metadata  
- Changes existing rows? | **No**  
| Idempotent / re-runnable? | **Yes** |
| **Estimated duration** | **< 3 seconds** |

### Rollback SQL

```sql
-- Restore get_public_team_by_slug without publish filter (from migration 3 version)
-- drop function public.get_member_team_by_slug(text);

-- Restore content policies from 20260514120000_saas_multitenant.sql (subscription only, no publish_status)
```

See migration 3 rollback for `get_public_team_by_slug`; remove `publish_status` from WHERE and drop `get_member_team_by_slug`.

### App compatibility — **critical**

| App version | After migration 4 |
|-------------|-------------------|
| **Old app** | Published pages: OK. **Coach draft preview**: **broken** (no `get_member_team_by_slug`). |
| **New app** | Requires migration 4 for draft preview + `loadMemberTeamBySlug`. |

---

## Apply order (production)

```
1. 20260714120000_prevent_unauthorized_team_members_insert.sql
2. 20260714130000_prevent_team_role_escalation.sql
3. 20260714140000_restrict_public_team_rpc_fields.sql
4. 20260714150000_restrict_public_team_access_to_published.sql
```

**How:** Supabase Dashboard → SQL Editor → paste **one file at a time** → Run → confirm success before next.  
Or: `supabase db push` from linked project (same order).

**Total estimated time:** under 10 seconds of SQL execution.

---

## Step 4 — Backup gate (Supabase checklist)

**Do not apply migrations until you complete this checklist in the Supabase Dashboard.**  
The agent cannot confirm backup status — **you** must verify.

### 1. Check current Supabase plan

1. Open [https://supabase.com/dashboard](https://supabase.com/dashboard)  
2. Select **production** project  
3. **Project Settings → Billing** (or Organization billing)  
4. Note plan name: **Free / Pro / Team / Enterprise**

📸 Save: plan name + project ref (e.g. `abcdefghijklmnop`).

### 2. Check daily backups

1. **Project Settings → Database → Backups**  
2. Confirm **Daily backups** are listed and **enabled** (Pro+ feature)  
3. If on **Free** plan: daily backups may be **limited or unavailable** → see blocking risk below

📸 Save: backup schedule screenshot.

### 3. Check PITR (Point-in-Time Recovery)

1. Same **Database → Backups** page  
2. Look for **Point in Time Recovery** / **PITR** toggle  
3. Note: **Enabled** or **Disabled**

**If PITR is disabled on Free plan:** this is a **blocking risk** for production migration without a manual safety net.

**Minimum safe options before migrate:**

| Option | Effort |
|--------|--------|
| **Upgrade to Pro** and enable PITR | Recommended for production SaaS |
| **Manual logical backup** | Dashboard → Database → Backups → Download, or `pg_dump` via connection string |
| **Clone project** | Create new Supabase project from backup (if available) for rehearsal |

### 4. Confirm a fresh restore point

1. On Backups page, note **latest backup timestamp** (UTC)  
2. Timestamp should be **within last 24 hours**  
3. If a manual backup is taken today, note that time as **pre-migration restore point**

📸 Save: **Last backup:** `YYYY-MM-DD HH:MM UTC`

### 5. Where to see last backup time

- **Dashboard → Project Settings → Database → Backups** → “Last backup” / backup list  
- PITR: recovery window shows earliest restorable time

### 6. How to restore if migration fails

| Scenario | Action |
|----------|--------|
| **PITR enabled** | Database → Backups → **Restore** to timestamp **just before** migration start. Confirm downtime window with Supabase docs. |
| **Daily backup only** | Restore from latest daily snapshot (may lose up to ~24h of data) |
| **Migration SQL wrong** | Run rollback SQL from sections above per migration (reverse order 4→1) |
| **App broken** | Vercel → Deployments → **Promote** previous production deployment (record SHA before deploy) |

### 7. Values to save before migration

| Item | Example |
|------|---------|
| Pre-migration UTC time | `2026-07-14 13:00 UTC` |
| Production Vercel commit SHA | `abc1234` (current `main`) |
| New deploy commit SHA | `574ee8f` |
| Supabase project ref | `xyz...` |
| Plan + PITR status | `Pro, PITR on` |
| Last backup timestamp | from dashboard |

### 8. Export current definitions (optional but recommended)

**Supabase Dashboard:**

1. **Database → Roles / Policies** — screenshot or export RLS for `team_members`, `schedule_events`, `team_updates`, `achievements`  
2. **Database → Functions** — note versions of `get_public_team_by_slug`, `accept_team_admin_invite`  
3. **SQL Editor** — run and save output:

```sql
-- Policies on team_members
select polname, polcmd from pg_policy
join pg_class on pg_policy.polrelid = pg_class.oid
where relname = 'team_members';

-- Public functions of interest
select proname, pg_get_function_identity_arguments(oid) as args
from pg_proc
where pronamespace = 'public'::regnamespace
  and proname in (
    'get_public_team_by_slug',
    'get_member_team_by_slug',
    'verify_team_access',
    'accept_team_admin_invite',
    'create_team'
  );
```

Save results as `pre-migration-snapshot-YYYY-MM-DD.sql.txt`.

---

## Step 5 — Production deployment runbook

### Compatibility verdict

| Order | Safe? |
|-------|-------|
| **Migrations 1→4, then app deploy** | ✅ **Recommended** |
| App before migrations | ❌ **Unsafe** — `verify_team_access`, `get_member_team_by_slug` missing; private pages and draft preview fail |
| Migrations 3–4 without new app | ⚠️ **Degraded** — published public OK; private/mixed gate + coach draft preview broken until new app |
| Migrations 1–2 only, delay 3–4 | ✅ **Safe** short-term with old app |

**Minimal incompatibility window:** Apply migrations **3 and 4** in the same session, then deploy commit `574ee8f` within **≤ 15 minutes**.

### Runbook (execute in order)

| # | Action | Owner |
|---|--------|-------|
| 1 | Complete [Backup gate](#step-4--backup-gate-supabase-checklist) | You |
| 2 | Record current **production** Vercel commit SHA: `git rev-parse origin/main` or Vercel UI | You |
| 3 | In Vercel, identify **previous successful production deployment** for rollback (⋯ → Promote) | You |
| 4 | Note migration start time **UTC** | You |
| 5 | Apply migration `20260714120000` → confirm success | You |
| 6 | Apply migration `20260714130000` → confirm success | You |
| 7 | Apply migration `20260714140000` → confirm success | You |
| 8 | Apply migration `20260714150000` → confirm success | You |
| 9 | **Deploy** `pre-launch-audit` @ `574ee8f` to **Production** (merge PR or Vercel promote preview) | You / CI |
| 10 | Vercel → Deployment **Ready** + no build errors | Verify |
| 11 | Vercel **Logs** — no spike in 5xx (15 min) | Verify |
| 12 | Run `docs/security-production-smoke-test.md` | You |
| 13 | On PASS: update `docs/pre-launch-audit.md`, commit deployment record | Agent / You |
| 14 | On FAIL: **Stop** — rollback app first, then SQL rollback 4→1 if needed | You |

### Rollback order (critical failure)

1. **Vercel:** Promote previous production deployment (step 3)  
2. **Supabase:** Run rollback SQL for migration 4, then 3, then 2, then 1 (if app rollback insufficient)  
3. Re-run smoke test on rolled-back stack  
4. Document incident before retry

---

## Vercel Preview notes (pre-migration)

Preview with **production Supabase** but **without** migrations 3–4:

| Feature | Preview behavior |
|---------|------------------|
| Homepage, login, signup, dashboard shell | ✅ Testable |
| Builder rendering | ✅ Testable |
| Published public page | ✅ Likely OK (old RPC) |
| `/api/teams/.../verify-access` | ❌ Fails until migration 3 |
| Private/mixed access gate (new code) | ❌ Until migration 3 |
| Coach draft preview (new code) | ❌ Until migration 4 |
| Destructive writes | **Do not** run on production data |

Preview should use **Preview env vars** in Vercel — do not add production `SUPABASE_SERVICE_ROLE_KEY` unless a specific admin route requires it (webhooks should not run on preview).

---

## Acceptance criteria (security milestone delivered)

- [ ] All 4 migrations applied without error  
- [ ] Production on commit `574ee8f` (or newer docs commit after smoke)  
- [ ] Vercel deployment successful  
- [ ] 92 tests pass on branch  
- [ ] Smoke test A–H pass  
- [ ] No new mass 5xx in logs  
- [ ] `docs/pre-launch-audit.md` updated with deployed + verified status  

Only then start **P0-03**.
