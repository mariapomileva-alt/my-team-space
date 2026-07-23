# Production dashboard links

Keep this page bookmarked for ops.

## Live systems

| System | URL |
|--------|-----|
| Production site | https://www.myteamspace.cc |
| Health | https://www.myteamspace.cc/api/health |
| Public monitor target | https://www.myteamspace.cc/stars |
| Canonical Lemon webhook | https://www.myteamspace.cc/api/lemonsqueezy/webhook |
| Admin login | https://www.myteamspace.cc/admin/login |

## Platforms

| Platform | URL / notes |
|----------|-------------|
| Vercel project | https://vercel.com/marija-s-projects1/my-team-space |
| Vercel production deployments | https://vercel.com/marija-s-projects1/my-team-space/deployments?filter=production |
| Vercel logs | Project → Logs (filter Production) |
| Vercel notifications | Project/Account → Settings → Notifications |
| Supabase project | https://supabase.com/dashboard/project/yundypamrubdrbmnilgi |
| Supabase status / backups | Project → Settings → Infrastructure / Database → Backups; https://status.supabase.com |
| GitHub repo | https://github.com/mariapomileva-alt/my-team-space |
| Lemon Squeezy | https://app.lemonsqueezy.com (Webhooks → delivery log) |
| Sentry | Your Sentry org project (DSN in Vercel; do not paste private project URLs with tokens here) |
| UptimeRobot | https://uptimerobot.com/dashboard (after login; no secret dashboard URLs in git) |

Uptime setup: `docs/monitoring.md` + `node scripts/setup-uptimerobot.mjs`

## Current production identifiers

| Field | Value (update after each prod deploy) |
|-------|----------------------------------------|
| Branch | `pre-launch-audit` |
| Last known monitoring commit | `40bb1bf` prod health; harden health + uptime docs pending next deploy |
| UptimeRobot monitors | Homepage / Health / Public Page (`/stars`) — live |
| Last known P0-08 deploy | `0ea2bc7` / `dpl_KnF3pf6WZLXXYbfGnss4XKst4MEV` |
| Preview example | Vercel Preview URLs (SSO protected) |

## SSL / domain (checked)

| Check | Result |
|-------|--------|
| Canonical | `https://www.myteamspace.cc` |
| Apex redirect | `https://myteamspace.cc` → 307 → www (no loop) |
| www cert | Valid (~expires 2026-10-12; Vercel auto-renew) |
| apex cert | Valid (~expires 2026-10-14; Vercel auto-renew) |

## Quick commands

```bash
curl -s https://www.myteamspace.cc/api/health | jq .

# Confirm webhook alive (GET only — do not POST without signature)
curl -s https://www.myteamspace.cc/api/lemonsqueezy/webhook

# Create / verify UptimeRobot monitors (needs Main API key in shell)
node scripts/setup-uptimerobot.mjs
```
