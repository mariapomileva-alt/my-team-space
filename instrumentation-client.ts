import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN?.trim() || process.env.SENTRY_DSN?.trim();

if (dsn) {
  Sentry.init({
    dsn,
    environment:
      process.env.SENTRY_ENVIRONMENT?.trim() ||
      process.env.NEXT_PUBLIC_VERCEL_ENV?.trim() ||
      process.env.NODE_ENV ||
      "development",
    release:
      process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.trim() ||
      process.env.VERCEL_GIT_COMMIT_SHA?.trim() ||
      undefined,
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
  });
}
