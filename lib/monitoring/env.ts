/** Shared monitoring env metadata (safe for logs / Sentry tags). */

export function monitoringEnvironment(): string {
  return (
    process.env.SENTRY_ENVIRONMENT?.trim() ||
    process.env.VERCEL_ENV?.trim() ||
    process.env.NODE_ENV ||
    "development"
  );
}

export function monitoringCommitSha(): string {
  return (
    process.env.VERCEL_GIT_COMMIT_SHA?.trim() ||
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.trim() ||
    process.env.GIT_COMMIT_SHA?.trim() ||
    "unknown"
  );
}

export function monitoringAppVersion(): string {
  return process.env.npm_package_version?.trim() || "0.1.0";
}

export function isSentryEnabled(): boolean {
  return Boolean(
    process.env.SENTRY_DSN?.trim() || process.env.NEXT_PUBLIC_SENTRY_DSN?.trim(),
  );
}

export function sentryDsn(): string | undefined {
  return (
    process.env.SENTRY_DSN?.trim() ||
    process.env.NEXT_PUBLIC_SENTRY_DSN?.trim() ||
    undefined
  );
}
