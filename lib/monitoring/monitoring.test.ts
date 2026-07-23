import { describe, expect, it, vi } from "vitest";
import { scrubSensitive, SENSITIVE_LOG_KEYS } from "@/lib/monitoring/scrub";
import {
  createRequestId,
  logger,
  runWithMonitoringContextAsync,
  getMonitoringContext,
} from "@/lib/monitoring/logger";
import { MonitoringEvents, trackEvent } from "@/lib/monitoring/events";
import { PerfThresholdsMs } from "@/lib/monitoring/perf";

describe("P0-07 — monitoring scrub + logger", () => {
  it("redacts access_code, invite_token, secrets, and jwt-like keys", () => {
    const scrubbed = scrubSensitive({
      team_id: "t1",
      access_code: "secret-code",
      invite_token: "magic",
      authorization: "Bearer abc",
      cookie: "session=1",
      LEMONSQUEEZY_WEBHOOK_SECRET: "whsec",
      nested: { password: "x", ok: true },
    });
    expect(scrubbed.team_id).toBe("t1");
    expect(scrubbed.access_code).toBe("[redacted]");
    expect(scrubbed.invite_token).toBe("[redacted]");
    expect(scrubbed.authorization).toBe("[redacted]");
    expect(scrubbed.cookie).toBe("[redacted]");
    expect(scrubbed.LEMONSQUEEZY_WEBHOOK_SECRET).toBe("[redacted]");
    expect(scrubbed.nested).toEqual({ password: "[redacted]", ok: true });
    expect(SENSITIVE_LOG_KEYS).toContain("access_code");
  });

  it("propagates request_id through async monitoring context", async () => {
    const request_id = createRequestId();
    await runWithMonitoringContextAsync({ request_id, team_id: "team-a", action: "publish" }, async () => {
      expect(getMonitoringContext().request_id).toBe(request_id);
      expect(getMonitoringContext().team_id).toBe("team-a");
      expect(getMonitoringContext().action).toBe("publish");
    });
  });

  it("emits structured JSON logs with request_id and without secrets", async () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    const request_id = "req-test-1";
    await runWithMonitoringContextAsync({ request_id, team_id: "t1" }, async () => {
      trackEvent(MonitoringEvents.publish_success, {
        status: "ok",
        access_code: "should-not-leak",
      });
    });
    expect(spy).toHaveBeenCalled();
    const line = String(spy.mock.calls.at(-1)?.[0] ?? "");
    const parsed = JSON.parse(line) as Record<string, unknown>;
    expect(parsed.event).toBe("publish_success");
    expect(parsed.request_id).toBe(request_id);
    expect(parsed.access_code).toBe("[redacted]");
    expect(parsed.level).toBe("info");
    expect(parsed.timestamp).toBeTruthy();
    spy.mockRestore();
  });

  it("defines performance thresholds for publish/autosave/db/webhook", () => {
    expect(PerfThresholdsMs.publish).toBe(3000);
    expect(PerfThresholdsMs.autosave).toBe(1000);
    expect(PerfThresholdsMs.db_query).toBe(500);
    expect(PerfThresholdsMs.webhook).toBe(2000);
  });

  it("exposes critical business event names", () => {
    expect(MonitoringEvents.webhook_duplicate).toBe("webhook_duplicate");
    expect(MonitoringEvents.publish_failed).toBe("publish_failed");
    expect(MonitoringEvents.gallery_upload_failed).toBe("gallery_upload_failed");
  });
});

describe("P0-07 — health endpoint contract", () => {
  it("health route exists and returns monitoring fields", async () => {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const src = readFileSync(join(process.cwd(), "app/api/health/route.ts"), "utf8");
    expect(src).toMatch(/commit_sha/);
    expect(src).toMatch(/environment/);
    expect(src).toMatch(/get_public_team_by_slug/);
    expect(src).toMatch(/isBillingConfigured/);
  });
});
