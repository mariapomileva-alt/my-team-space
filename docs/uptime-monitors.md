# Uptime monitors (UptimeRobot)

Do **not** POST to the Lemon webhook without a valid signature.

## Automated setup (API v3)

```bash
# Main API key in .env.local (gitignored) — never commit
node scripts/setup-uptimerobot.mjs
```

Dry run: `UPTIMEROBOT_DRY_RUN=1 node scripts/setup-uptimerobot.mjs`  
Test alert cycle: `UPTIMEROBOT_SEND_TEST_ALERT=1 node scripts/setup-uptimerobot.mjs`  
(pause → start on Health monitor)

## Monitors (live)

| Name | URL | Type | Interval | Expect |
|------|-----|------|----------|--------|
| MyTeamSpace Production Homepage | https://www.myteamspace.cc/ | HTTP | 5 min | 2xx/3xx |
| MyTeamSpace Production Health | https://www.myteamspace.cc/api/health | Keyword | 5 min | keyword `"status":"ok"` must exist (`ALERT_NOT_EXISTS`) |
| MyTeamSpace Public Page | https://www.myteamspace.cc/stars | Keyword | 5 min | keyword `Dance Is` must exist (`ALERT_NOT_EXISTS`) |

Alert contacts: existing account Email contact, Up + Down. Free plan: `threshold=0` (no “2 consecutive failures” setting). Custom User-Agent / SSL expiry reminder via API are Pro/blocked on Free.

## Alert contacts

- Email: account default / existing contacts only — do not invent addresses in git
- Optional Slack / Telegram: only with your confirmation + secret stored outside the repo

## Do not monitor with anonymous traffic

- `/api/lemonsqueezy/webhook` POST (or unsigned GET spam)
- `/api/admin/**` authenticated routes

Webhook health: Sentry + structured `webhook_*` logs + Lemon delivery log.

## Pause / maintenance

1. Before a planned production migration: pause the three monitors **or** create a Maintenance Window in UptimeRobot and attach them.
2. After migration: resume monitors; confirm all Up + health keyword still matches.
3. Incidents: monitor detail → Logs.

Full playbook: `docs/monitoring.md`
