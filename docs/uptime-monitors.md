# Uptime monitors (UptimeRobot or equivalent)

Do **not** POST to the Lemon webhook without a valid signature.

## Monitors to create

| Name | URL | Type | Interval | Expect |
|------|-----|------|----------|--------|
| Homepage | https://www.myteamspace.cc/ | HTTP(S) | 5 min | 200 |
| Login | https://www.myteamspace.cc/admin/login | HTTP(S) | 5 min | 200 |
| Health | https://www.myteamspace.cc/api/health | HTTP(S) | 5 min | 200 + JSON `status` is `ok` or `degraded` |
| Public team page | https://www.myteamspace.cc/{your-live-slug} | HTTP(S) | 5 min | 200 |

Replace `{your-live-slug}` with a known published team (e.g. Dance Stars slug).

## Alert contacts

- Email: your ops inbox
- Optional: Telegram / Slack webhook from UptimeRobot

## Keyword checks (optional)

For `/api/health`, keyword: `"status":"ok"` **or** alert only on HTTP ≥ 500 (degraded lemon_config still returns 200).

## Do not monitor with anonymous POST

- `/api/lemonsqueezy/webhook` POST
- `/api/admin/**` authenticated routes
