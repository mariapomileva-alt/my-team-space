# Security milestone — production deployment record

**Date:** 21–22 July 2026  
**Branch:** `pre-launch-audit`  
**Status:** Deployed and owner smoke verified

## What shipped

| P0 | Result |
|----|--------|
| P0-01 | Deployed & verified |
| P0-04 | Deployed & verified |
| P0-02 | Deployed & verified |
| P0-05 | Deployed & verified |

## Production identifiers

| Item | Value |
|------|--------|
| Git commit | `c4096db470b5fea4f19cca0320805af2f5a8bfe7` |
| Vercel deployment ID | `dpl_Ac3s8mgr8JgtHMNuJL2xrEN2Km5D` |
| Production URL | https://www.myteamspace.cc |
| Deployment URL | https://my-team-space-84tkstey8-marija-s-projects1.vercel.app |
| Inspect | https://vercel.com/marija-s-projects1/my-team-space/Ac3s8mgr8JgtHMNuJL2xrEN2Km5D |
| Supabase project ref | `yundypamrubdrbmnilgi` |

## Migrations

Applied via **SQL Editor** (not `db push`), order:

1. `20260714120000_prevent_unauthorized_team_members_insert.sql`
2. `20260714130000_prevent_team_role_escalation.sql`
3. `20260714140000_restrict_public_team_rpc_fields.sql`
4. `20260714150000_restrict_public_team_access_to_published.sql`

Post-apply API check (anon): `get_public_team_by_slug`, `verify_team_access`, `get_member_team_by_slug` all respond.

## Smoke (owner, Dance Stars)

- Login / dashboard / builder: OK (Live · Saved)
- Public page open: OK
- Autosave: OK (owner confirmation)
- Incognito / public view: OK (owner confirmation)

## Not started

- P0-03 — server-side publish billing check
- P0-07 — error monitoring
- P0-08 — webhook dedup + `current_period_end`
- P0-06 — formal recovery drill (Pro / backups / PITR already confirmed by owner)

## Optional follow-up

Sync CLI migration history with:

```bash
npx supabase migration repair --status applied 20260714120000
npx supabase migration repair --status applied 20260714130000
npx supabase migration repair --status applied 20260714140000
npx supabase migration repair --status applied 20260714150000
```

(Requires database password / linked project.)
