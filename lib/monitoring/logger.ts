import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import {
  monitoringAppVersion,
  monitoringCommitSha,
  monitoringEnvironment,
} from "@/lib/monitoring/env";
import { scrubSensitive } from "@/lib/monitoring/scrub";

export type LogLevel = "debug" | "info" | "warn" | "error";

export type MonitoringContext = {
  request_id?: string;
  user_id?: string;
  team_id?: string;
  academy_id?: string;
  subscription_id?: string;
  route?: string;
  action?: string;
};

type Store = MonitoringContext;

const als = new AsyncLocalStorage<Store>();

export function createRequestId(): string {
  try {
    return randomUUID();
  } catch {
    return `req_${Date.now().toString(36)}`;
  }
}

export function getMonitoringContext(): MonitoringContext {
  return { ...(als.getStore() ?? {}) };
}

export function runWithMonitoringContext<T>(ctx: MonitoringContext, fn: () => T): T {
  const parent = als.getStore() ?? {};
  return als.run({ ...parent, ...ctx }, fn);
}

export async function runWithMonitoringContextAsync<T>(
  ctx: MonitoringContext,
  fn: () => Promise<T>,
): Promise<T> {
  const parent = als.getStore() ?? {};
  return als.run({ ...parent, ...ctx }, fn);
}

export function mergeMonitoringContext(patch: MonitoringContext): void {
  const store = als.getStore();
  if (!store) return;
  Object.assign(store, patch);
}

export type LogFields = MonitoringContext & {
  event?: string;
  duration_ms?: number;
  status?: string | number;
  error_code?: string;
  [key: string]: unknown;
};

function baseFields(): Record<string, unknown> {
  const ctx = getMonitoringContext();
  return scrubSensitive({
    timestamp: new Date().toISOString(),
    environment: monitoringEnvironment(),
    app_version: monitoringAppVersion(),
    commit_sha: monitoringCommitSha(),
    request_id: ctx.request_id,
    user_id: ctx.user_id,
    team_id: ctx.team_id,
    academy_id: ctx.academy_id,
    subscription_id: ctx.subscription_id,
    route: ctx.route,
    action: ctx.action,
  });
}

function write(level: LogLevel, message: string, fields?: LogFields): void {
  const payload = scrubSensitive({
    ...baseFields(),
    level,
    message,
    ...fields,
  });

  const line = JSON.stringify(payload);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  debug: (message: string, fields?: LogFields) => write("debug", message, fields),
  info: (message: string, fields?: LogFields) => write("info", message, fields),
  warn: (message: string, fields?: LogFields) => write("warn", message, fields),
  error: (message: string, fields?: LogFields) => write("error", message, fields),
};
