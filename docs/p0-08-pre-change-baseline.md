# Baseline before P0-08 (Lemon webhook hardening)

**Date:** 23 July 2026  
**Branch:** `pre-launch-audit`  
**Commit:** `19a056d` (security: enforce publish billing check on server)

## Production state at this checkpoint

| Item | Value |
|------|--------|
| Live site | https://www.myteamspace.cc |
| Security P0-01/02/04/05 | Deployed & verified |
| P0-03 | Deployed (`19a056d`) |
| P0-08 | Not started |

## Rollback of later P0-08 work

Return app to this commit and redeploy:

```bash
git checkout 19a056d
npx vercel deploy --prod --yes
```

If a P0-08 migration was applied, roll it back with the SQL in that migration’s header before or after the app rollback as documented there.
