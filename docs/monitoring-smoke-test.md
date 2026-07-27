# Monitoring smoke test (P0-07)

Run after deploy. Sentry events only appear if DSN is set.

## A. Health (always)

```bash
curl -s https://www.myteamspace.cc/api/health
```

Expect: JSON with `status`, `commit_sha`, `request_id`, `environment`.

## B. Structured logs (Vercel)

1. Open builder → change text → wait for autosave.
2. Vercel → Logs → search `autosave_started` or `publish_started`.
3. Confirm log JSON has `request_id` and **no** `access_code` / tokens.

## C. Publish success

1. Owner Publish on a test-safe team.
2. Look for `publish_success` in logs (and Sentry breadcrumb if enabled).

## D. Publish failure (safe)

Without changing billing: temporarily not needed in production.  
Unit tests cover scrubbing + event names. Optional staging: call save with invalid lock to force `autosave_failed` / stale version.

## E. Upload failure (safe)

Upload a rejected type or >5MB file in builder → expect UI error and log `gallery_upload_failed` (no file contents logged).

## F. Webhook failure (safe)

```bash
curl -s -X POST https://www.myteamspace.cc/api/lemonsqueezy/webhook \
  -H 'Content-Type: application/json' \
  -d '{}'
```

Expect: 400 invalid signature; log `webhook_failed` / `INVALID_SIGNATURE`. **Do not** send real secrets.

## G. Secrets check

In any captured log/Sentry event: search `access_code`, `invite_token`, `Bearer`, `service_role` — must be absent or `[redacted]`.
