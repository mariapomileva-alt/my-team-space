# Launch-day checklist (2 minutes)

Open `docs/production-dashboard.md` first.

## Go / no-go

| # | Check | How | Pass |
|---|-------|-----|------|
| 1 | Vercel Production Ready | Vercel → Deployments | ☐ |
| 2 | Deploy SHA matches expected | Vercel deployment detail / `/api/health` → `commit_sha` | ☐ |
| 3 | Health OK | https://www.myteamspace.cc/api/health | ☐ |
| 4 | Homepage loads | https://www.myteamspace.cc/ | ☐ |
| 5 | Login loads | https://www.myteamspace.cc/admin/login | ☐ |
| 6 | Public team page loads | known live slug in Incognito | ☐ |
| 7 | Supabase project healthy | Dashboard green / no incident | ☐ |
| 8 | Backups / PITR | Supabase → Database → Backups | ☐ |
| 9 | Lemon webhook URL | Lemon → Webhooks → `…/api/lemonsqueezy/webhook` | ☐ |
| 10 | Storage | Upload small image in builder (optional) | ☐ |
| 11 | Error rate | Sentry (if configured) or Vercel Logs — no spike | ☐ |
| 12 | Uptime monitors green | UptimeRobot | ☐ |

## If anything fails

1. Do **not** push more features.
2. Check Vercel Logs + Supabase Logs.
3. Roll back Vercel to previous Ready production deployment if needed.
4. For DB issues, use `docs/production-recovery.md`.
