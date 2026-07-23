# Production dashboard links

Keep this page bookmarked for ops.

## Live systems

| System | URL |
|--------|-----|
| Production site | https://www.myteamspace.cc |
| Health | https://www.myteamspace.cc/api/health |
| Canonical Lemon webhook | https://www.myteamspace.cc/api/lemonsqueezy/webhook |
| Admin login | https://www.myteamspace.cc/admin/login |

## Platforms

| Platform | URL / notes |
|----------|-------------|
| Vercel project | https://vercel.com/marija-s-projects1/my-team-space |
| Vercel deployments | Project → Deployments (check Production Ready) |
| Vercel logs | Project → Logs (filter Production) |
| Supabase project | https://supabase.com/dashboard/project/yundypamrubdrbmnilgi |
| Supabase logs | Project → Logs (API / Postgres / Auth) |
| GitHub repo | https://github.com/mariapomileva-alt/my-team-space |
| Lemon Squeezy | https://app.lemonsqueezy.com (Webhooks → delivery log) |
| Sentry | Create project → paste DSN into Vercel env (see `docs/monitoring.md`) |
| UptimeRobot | Configure monitors from `docs/uptime-monitors.md` |

## Current production identifiers

| Field | Value (update after each prod deploy) |
|-------|----------------------------------------|
| Branch | `pre-launch-audit` |
| Last known monitoring commit | set after P0-07 deploy |
| Last known P0-08 deploy | `0ea2bc7` / `dpl_KnF3pf6WZLXXYbfGnss4XKst4MEV` |
| Preview example | Vercel Preview URLs (SSO protected) |

## Quick commands

```bash
# Local health shape check against production
curl -s https://www.myteamspace.cc/api/health | jq .

# Confirm webhook alive (GET only — do not POST without signature)
curl -s https://www.myteamspace.cc/api/lemonsqueezy/webhook
```
