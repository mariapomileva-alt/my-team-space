import * as Sentry from "@sentry/nextjs";
import {
  isSentryEnabled,
  monitoringAppVersion,
  monitoringCommitSha,
  monitoringEnvironment,
  sentryDsn,
} from "@/lib/monitoring/env";
import { getMonitoringContext } from "@/lib/monitoring/logger";
import { scrubSensitive } from "@/lib/monitoring/scrub";

let initialized = false;

export function initSentry(runtime: "nodejs" | "edge" | "client"): void {
  if (initialized || !isSentryEnabled()) return;
  const dsn = sentryDsn();
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: monitoringEnvironment(),
    release: monitoringCommitSha(),
    tracesSampleRate: monitoringEnvironment() === "production" ? 0.1 : 0,
    sendDefaultPii: false,
    beforeSend(event) {
      return scrubSensitive(event);
    },
  });

  Sentry.setTags({
    runtime,
    app_version: monitoringAppVersion(),
    commit_sha: monitoringCommitSha(),
  });

  initialized = true;
}

export function captureMonitoringException(
  error: unknown,
  extra?: Record<string, unknown>,
): void {
  if (!isSentryEnabled()) return;
  const ctx = getMonitoringContext();
  Sentry.withScope((scope) => {
    if (ctx.request_id) scope.setTag("request_id", ctx.request_id);
    if (ctx.user_id) scope.setUser({ id: ctx.user_id });
    if (ctx.team_id) scope.setTag("team_id", ctx.team_id);
    if (ctx.subscription_id) scope.setTag("subscription_id", ctx.subscription_id);
    if (ctx.route) scope.setTag("route", ctx.route);
    if (ctx.action) scope.setTag("action", ctx.action);
    if (extra) scope.setExtras(scrubSensitive(extra));
    Sentry.captureException(error);
  });
}

export function captureMonitoringMessage(
  message: string,
  level: "info" | "warning" | "error" = "info",
  extra?: Record<string, unknown>,
): void {
  if (!isSentryEnabled()) return;
  const ctx = getMonitoringContext();
  Sentry.withScope((scope) => {
    if (ctx.request_id) scope.setTag("request_id", ctx.request_id);
    if (extra) scope.setExtras(scrubSensitive(extra));
    Sentry.captureMessage(message, level);
  });
}
