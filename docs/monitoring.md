# Production monitoring (P0-07)

**Branch:** `pre-launch-audit`  
**Status:** Code shipped; Sentry + UptimeRobot require manual account setup

## Services

| Service | Role | Status |
|---------|------|--------|
| **Structured logs** | JSON logs to Vercel/runtime stdout | ✅ Always on |
| **Sentry** | Error monitoring (React + server) | ⏳ Needs DSN env vars |
| **UptimeRobot** (or similar) | Uptime pings | ⏳ Manual setup |
| **Vercel Logs** | Deploy + runtime log stream | ✅ Built-in |
| **Supabase** | DB/auth/storage dashboards | ✅ Built-in |

## What is collected

- Environment, app version, commit SHA
- `request_id` (correlation id)
- `user_id`, `team_id`, `subscription_id` when known (IDs only)
- Route / action / duration / status / error_code
- Business events (see list below)
- Exceptions via Sentry when DSN is set

## What is NOT collected

- `access_code`, `invite_token`
- passwords, JWT, cookies, Authorization headers
- Lemon / Supabase secrets
- Email bodies
- Parent/coach free-text content from blocks

Scrubbing: `lib/monitoring/scrub.ts`

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

## Health

`GET https://www.myteamspace.cc/api/health`

Returns: `status`, `version`, `commit_sha`, `environment`, `timestamp`, checks.

## Env vars (manual)

```
SENTRY_DSN=...
NEXT_PUBLIC_SENTRY_DSN=...   # same project DSN for browser
SENTRY_ENVIRONMENT=production
```

Optional: `SENTRY_AUTH_TOKEN` only if you later enable Sentry build plugin (not required now).

## Alerts to configure in Sentry / UptimeRobot

**Critical:** publish_failed, webhook_failed, health 503, spike 5xx spike, storage upload failed  
**Warning:** slow_operation (publish/autosave/db), degraded health (lemon_config)

See also: `docs/production-dashboard.md`, `docs/launch-day-checklist.md`, `docs/uptime-monitors.md`
