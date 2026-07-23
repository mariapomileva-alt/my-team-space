import { describe, expect, it } from "vitest";
import {
  buildLemonWebhookEventKey,
  extractLemonCurrentPeriodEnd,
  extractLemonUpdatedAt,
  shouldApplyLemonSubscriptionUpdate,
  type LemonWebhookBody,
} from "@/lib/lemon/webhook-payload";

function subscriptionPayload(partial: {
  event_name?: string;
  webhook_id?: string | number;
  id?: string;
  status?: string;
  renews_at?: string | null;
  ends_at?: string | null;
  updated_at?: string | null;
  variant_id?: number;
}): LemonWebhookBody {
  return {
    meta: {
      event_name: partial.event_name ?? "subscription_updated",
      webhook_id: partial.webhook_id,
      custom_data: { user_id: "user-1" },
    },
    data: {
      id: partial.id ?? "sub_100",
      type: "subscriptions",
      attributes: {
        status: partial.status ?? "active",
        customer_id: 9,
        variant_id: partial.variant_id ?? 111,
        renews_at: partial.renews_at === undefined ? "2026-08-01T00:00:00.000000Z" : partial.renews_at,
        ends_at: partial.ends_at === undefined ? null : partial.ends_at,
        updated_at: partial.updated_at === undefined ? "2026-07-20T12:00:00.000000Z" : partial.updated_at,
      },
    },
  };
}

describe("P0-08 — Lemon webhook payload helpers", () => {
  it("extracts current_period_end from renews_at", () => {
    expect(
      extractLemonCurrentPeriodEnd({
        renews_at: "2026-08-01T00:00:00.000000Z",
        ends_at: "2026-07-15T00:00:00.000000Z",
      }),
    ).toBe("2026-08-01T00:00:00.000Z");
  });

  it("falls back to ends_at when renews_at is missing", () => {
    expect(
      extractLemonCurrentPeriodEnd({
        renews_at: null,
        ends_at: "2026-09-10T15:30:00.000000Z",
      }),
    ).toBe("2026-09-10T15:30:00.000Z");
  });

  it("returns null when period end fields are absent (must not wipe stored value)", () => {
    expect(extractLemonCurrentPeriodEnd({ status: "active" })).toBeNull();
    expect(extractLemonCurrentPeriodEnd({ renews_at: null, ends_at: null })).toBeNull();
    expect(extractLemonCurrentPeriodEnd(undefined)).toBeNull();
  });

  it("builds idempotent event key from webhook_id", () => {
    const a = buildLemonWebhookEventKey(subscriptionPayload({ webhook_id: "wh_abc" }));
    const b = buildLemonWebhookEventKey(subscriptionPayload({ webhook_id: "wh_abc", status: "cancelled" }));
    expect(a).toBe("ls:webhook:wh_abc");
    expect(a).toBe(b);
  });

  it("uses stable fallback key when webhook_id is missing", () => {
    const key = buildLemonWebhookEventKey(
      subscriptionPayload({
        webhook_id: undefined,
        event_name: "subscription_updated",
        id: "55",
        updated_at: "2026-07-20T12:00:00.000000Z",
      }),
    );
    expect(key).toBe("ls:fallback:subscription_updated:55:2026-07-20T12:00:00.000Z");
  });

  it("replay of the same delivery produces the same event key", () => {
    const payload = subscriptionPayload({ webhook_id: "wh_replay_1" });
    expect(buildLemonWebhookEventKey(payload)).toBe(buildLemonWebhookEventKey(payload));
  });

  it("rejects older lemon updated_at (out-of-order)", () => {
    expect(
      shouldApplyLemonSubscriptionUpdate("2026-07-20T12:00:00.000Z", "2026-07-19T12:00:00.000Z"),
    ).toBe(false);
  });

  it("accepts same or newer lemon updated_at", () => {
    expect(
      shouldApplyLemonSubscriptionUpdate("2026-07-20T12:00:00.000Z", "2026-07-20T12:00:00.000Z"),
    ).toBe(true);
    expect(
      shouldApplyLemonSubscriptionUpdate("2026-07-20T12:00:00.000Z", "2026-07-21T12:00:00.000Z"),
    ).toBe(true);
  });

  it("preserves apply when timestamps are missing (keeps existing billing path usable)", () => {
    expect(shouldApplyLemonSubscriptionUpdate("2026-07-20T12:00:00.000Z", null)).toBe(true);
    expect(shouldApplyLemonSubscriptionUpdate(null, "2026-07-20T12:00:00.000Z")).toBe(true);
    expect(shouldApplyLemonSubscriptionUpdate(null, null)).toBe(true);
  });

  it("normalizes lemon updated_at", () => {
    expect(extractLemonUpdatedAt({ updated_at: "2026-07-20T12:00:00.000000Z" })).toBe(
      "2026-07-20T12:00:00.000Z",
    );
    expect(extractLemonUpdatedAt({ updated_at: "not-a-date" })).toBeNull();
  });
});

describe("P0-08 — process-webhook contract", () => {
  it("passes current_period_end and lemon_updated_at into upsert RPC", async () => {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const src = readFileSync(join(process.cwd(), "lib/lemon/process-webhook.ts"), "utf8");
    expect(src).toMatch(/claim_lemon_webhook_event/);
    expect(src).toMatch(/p_current_period_end/);
    expect(src).toMatch(/p_lemon_updated_at/);
    expect(src).toMatch(/shouldApplyLemonSubscriptionUpdate/);
    expect(src).toMatch(/extractLemonCurrentPeriodEnd/);
  });

  it("migration adds webhook events table and period-end-safe upsert", async () => {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const sql = readFileSync(
      join(process.cwd(), "supabase/migrations/20260723120000_lemon_webhook_dedup_and_period_end.sql"),
      "utf8",
    );
    expect(sql).toMatch(/create table if not exists public\.lemon_webhook_events/i);
    expect(sql).toMatch(/claim_lemon_webhook_event/i);
    expect(sql).toMatch(/p_current_period_end/i);
    expect(sql).toMatch(/p_lemon_updated_at/i);
    expect(sql).toMatch(/current_period_end = coalesce\(excluded\.current_period_end/i);
    expect(sql).toMatch(/p_lemon_updated_at < v_existing_updated/i);
  });
});
