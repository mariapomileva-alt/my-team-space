import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN?.trim() || process.env.NEXT_PUBLIC_SENTRY_DSN?.trim();

if (dsn) {
  Sentry.init({
    dsn,
    environment:
      process.env.SENTRY_ENVIRONMENT?.trim() || process.env.VERCEL_ENV?.trim() || process.env.NODE_ENV,
    release: process.env.VERCEL_GIT_COMMIT_SHA?.trim() || undefined,
    tracesSampleRate: 0,
    sendDefaultPii: false,
  });
}
