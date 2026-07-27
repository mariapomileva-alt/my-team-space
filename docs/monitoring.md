# Production monitoring (P0-07)

**Branch:** `pre-launch-audit`  
**Status:** App monitoring shipped; UptimeRobot production monitors live (API v3 + `scripts/setup-uptimerobot.mjs`)

## Services

| Service | Role | Status |
|---------|------|--------|
| **Structured logs** | JSON logs to Vercel/runtime stdout | ✅ Always on |
| **Sentry** | Error monitoring (React + server) | Optional (DSN in Vercel) |
| **UptimeRobot** | External uptime + keyword checks | ✅ 3 production monitors |
| **Vercel Logs / Deployments** | Deploy + runtime log stream | ✅ Built-in |
| **Supabase** | DB/auth/storage dashboards | ✅ Built-in |

## External uptime monitors (target)

| Name | URL | Interval | Expect | Alert |
|------|-----|----------|--------|-------|
| MyTeamSpace Production Homepage | https://www.myteamspace.cc/ | 5 min | HTTP 200 | Down after ≥2 failures*; recovery yes |
| MyTeamSpace Production Health | https://www.myteamspace.cc/api/health | 5 min | 200 + keyword `"status":"ok"` | same |
| MyTeamSpace Public Page | https://www.myteamspace.cc/stars | 5 min | 200 + keyword `Dance Is` | same |

\* Free UptimeRobot plan alerts on first confirmed down (`threshold=0`; consecutive-failure threshold is Pro). SSL expiry reminder via API is blocked on Free — enable in dashboard if the UI offers it.

**Do not** ping `/api/lemonsqueezy/webhook` with anonymous GET/POST — signature required; use Sentry + `webhook_*` logs instead.

### Setup (one-time)

1. Create **Main API Key**: [UptimeRobot](https://uptimerobot.com) → My Settings → API Settings  
2. Export locally (never commit): `export UPTIMEROBOT_API_KEY='…'`  
3. Optional: store same var in Vercel → Environment Variables (Production, encrypted) for future CI runs  
4. Run: `node scripts/setup-uptimerobot.mjs`  
5. Optional test alert: `UPTIMEROBOT_SEND_TEST_ALERT=1 node scripts/setup-uptimerobot.mjs`  
6. Confirm account email contact is active in UptimeRobot (do not invent emails in git)

### Notifications

- Email: existing UptimeRobot alert contact (`enableNotificationsFor: UpAndDown` → down + recovery)  
- Slack / Telegram: only after you confirm a webhook/bot and store the secret outside git  
- Events: down, up (recovery); SSL expiry reminder — enable in UptimeRobot UI on Free if available

### Ops playbook

| Action | How |
|--------|-----|
| Pause monitors | UptimeRobot → monitor → Pause (or API `editMonitor` status=0) |
| Maintenance window | Dashboard → Maintenance Windows → create window; attach monitors |
| Last incident | Monitor → Logs / Incidents |
| Change email | My Settings → Alert Contacts → edit / verify |
| Change Slack | Alert Contacts → add Slack after you provide webhook URL privately |
| On alert | Open health URL → Vercel Logs → Supabase status → recent deploys; see `docs/production-recovery.md` |

## What is collected (app)

- Environment, app version, commit SHA
- `request_id` (correlation id; header on health)
- `user_id`, `team_id`, `subscription_id` when known (IDs only)
- Route / action / duration / status / error_code
- Business events (see list below)
- Exceptions via Sentry when DSN is set

## What is NOT collected / NOT exposed on health

- `access_code`, `invite_token`, passwords, JWT, cookies, Authorization
- Lemon / Supabase secrets, connection strings
- Table names, service-role status, raw DB/RPC error messages
- Email bodies; parent/coach free-text from blocks
- `env_missing` lists; `supabase_detail`

Scrubbing: `lib/monitoring/scrub.ts`

Public `/api/health` fields only: `status`, `version`, `commit_sha`, `environment`, `timestamp`, opaque `checks` (`ok` \| `degraded` \| `error`). Dependency failures affect `status` / HTTP 503 without leaking internals. UptimeRobot User-Agents are not written as info logs (reduces noise).

## Business events

`signup_success`, `login_success`, `team_created`, `academy_created`,  
`publish_started|success|failed`, `autosave_started|failed`,  
`gallery_upload|gallery_upload_failed`,  
`checkout_started|completed`, `subscription_created|cancelled`,  
`webhook_received|processed|duplicate|stale|failed`

## How to find issues

| Problem | Where |
|---------|--------|
| User error | Sentry → filter `user.id` or tag `team_id` + `request_id` |
| Publish | Vercel Logs / Sentry → event `publish_failed` |
| Webhook | Vercel Logs → `webhook_*` events; Lemon dashboard delivery log |
| Upload | event `gallery_upload_failed` |
| Slow ops | event `slow_operation` (over threshold) |
| Site down | UptimeRobot → then health + Vercel + Supabase |

## Health

`GET https://www.myteamspace.cc/api/health`

## Env vars

```
SENTRY_DSN=...
NEXT_PUBLIC_SENTRY_DSN=...
SENTRY_ENVIRONMENT=production
UPTIMEROBOT_API_KEY=...   # Main API key; scripts/CI only — never NEXT_PUBLIC_
```

## Vercel deployment alerts (manual in Dashboard)

Path: Vercel → Project **my-team-space** → **Settings** → **Notifications** (or account **Settings** → **Notifications**)

Enable if available:

- Production deployment failed  
- Production deployment cancelled / errored  
- Domain / configuration errors  
- Usage / spend thresholds (optional)

Do **not** disable Deployment Protection on Preview.

See also: `docs/production-dashboard.md`, `docs/launch-day-checklist.md`, `docs/uptime-monitors.md`
