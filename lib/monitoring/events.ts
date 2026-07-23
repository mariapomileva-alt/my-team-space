import { logger } from "@/lib/monitoring/logger";
import { scrubSensitive } from "@/lib/monitoring/scrub";

/** Canonical business events for production ops (no PII / secrets). */
export const MonitoringEvents = {
  signup_success: "signup_success",
  login_success: "login_success",
  team_created: "team_created",
  academy_created: "academy_created",
  publish_started: "publish_started",
  publish_success: "publish_success",
  publish_failed: "publish_failed",
  autosave_started: "autosave_started",
  autosave_failed: "autosave_failed",
  gallery_upload: "gallery_upload",
  gallery_upload_failed: "gallery_upload_failed",
  checkout_started: "checkout_started",
  checkout_completed: "checkout_completed",
  subscription_created: "subscription_created",
  subscription_cancelled: "subscription_cancelled",
  webhook_received: "webhook_received",
  webhook_processed: "webhook_processed",
  webhook_duplicate: "webhook_duplicate",
  webhook_failed: "webhook_failed",
  webhook_stale: "webhook_stale",
} as const;

export type MonitoringEventName = (typeof MonitoringEvents)[keyof typeof MonitoringEvents];

export function trackEvent(
  event: MonitoringEventName,
  fields?: Record<string, unknown>,
): void {
  logger.info(event, scrubSensitive({ event, ...fields }));
}
