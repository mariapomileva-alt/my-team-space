import { verifyLemonWebhookSignature } from "@/lib/lemon/verify-webhook-signature";
import { processLemonSqueezyWebhook, type LemonWebhookBody } from "@/lib/lemon/process-webhook";
import {
  captureMonitoringException,
  createRequestId,
  logger,
  MonitoringEvents,
  runWithMonitoringContextAsync,
  trackEvent,
  withDurationLog,
} from "@/lib/monitoring";
import { NextResponse } from "next/server";

export async function handleLemonSqueezyWebhookRequest(request: Request) {
  const request_id = createRequestId();

  return runWithMonitoringContextAsync(
    { request_id, route: "/api/lemonsqueezy/webhook", action: "lemon_webhook" },
    async () => {
      const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
      if (!secret) {
        trackEvent(MonitoringEvents.webhook_failed, { error_code: "WEBHOOK_NOT_CONFIGURED", status: 500 });
        return NextResponse.json({ error: "Lemon Squeezy webhook not configured" }, { status: 500 });
      }

      const rawBody = await request.text();
      const sig = request.headers.get("X-Signature");
      if (!verifyLemonWebhookSignature(rawBody, sig, secret)) {
        trackEvent(MonitoringEvents.webhook_failed, { error_code: "INVALID_SIGNATURE", status: 400 });
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }

      let payload: LemonWebhookBody;
      try {
        payload = JSON.parse(rawBody) as LemonWebhookBody;
      } catch {
        trackEvent(MonitoringEvents.webhook_failed, { error_code: "INVALID_JSON", status: 400 });
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
      }

      trackEvent(MonitoringEvents.webhook_received, {
        event_name: payload.meta?.event_name ?? "unknown",
        status: "received",
      });

      try {
        await withDurationLog("webhook", "process_lemon_webhook", async () => {
          await processLemonSqueezyWebhook(payload);
        });
      } catch (e) {
        captureMonitoringException(e, { action: "lemon_webhook" });
        trackEvent(MonitoringEvents.webhook_failed, {
          error_code: "HANDLER_FAILED",
          status: 500,
          event_name: payload.meta?.event_name ?? "unknown",
        });
        logger.error("webhook_handler_failed", {
          event: MonitoringEvents.webhook_failed,
          error_code: "HANDLER_FAILED",
          status: 500,
        });
        return NextResponse.json({ error: "handler failed" }, { status: 500 });
      }

      return NextResponse.json({ received: true }, { headers: { "x-request-id": request_id } });
    },
  );
}
