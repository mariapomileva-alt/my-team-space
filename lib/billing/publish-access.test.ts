import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  defaultBuilderBillingContext,
  type BuilderBillingContext,
} from "@/lib/billing/builder-context-types";

function billing(partial: Partial<BuilderBillingContext>): BuilderBillingContext {
  return { ...defaultBuilderBillingContext("draft"), ...partial };
}

describe("P0-03 — publishRequiresCheckout", () => {
  const envKeys = [
    "LEMONSQUEEZY_API_KEY",
    "LEMONSQUEEZY_STORE_ID",
    "LEMONSQUEEZY_TEAM_VARIANT_ID",
    "LEMONSQUEEZY_SINGLE_TEAM_VARIANT_ID",
    "LEMONSQUEEZY_VARIANT_ID",
    "LEMONSQUEEZY_ACADEMY_VARIANT_ID",
    "NEXT_PUBLIC_APP_URL",
  ] as const;

  let snapshot: Record<string, string | undefined>;

  beforeEach(() => {
    snapshot = {};
    for (const key of envKeys) {
      snapshot[key] = process.env[key];
    }
  });

  afterEach(() => {
    for (const key of envKeys) {
      if (snapshot[key] === undefined) delete process.env[key];
      else process.env[key] = snapshot[key];
    }
    vi.resetModules();
  });

  function configureBilling(on: boolean) {
    if (on) {
      process.env.LEMONSQUEEZY_API_KEY = "test-key";
      process.env.LEMONSQUEEZY_STORE_ID = "1";
      process.env.LEMONSQUEEZY_TEAM_VARIANT_ID = "team-var";
      process.env.LEMONSQUEEZY_ACADEMY_VARIANT_ID = "academy-var";
      process.env.NEXT_PUBLIC_APP_URL = "https://www.myteamspace.cc";
    } else {
      for (const key of envKeys) delete process.env[key];
    }
  }

  async function loadPublishAccess() {
    vi.resetModules();
    return import("@/lib/billing/publish-access");
  }

  it("allows publish when billing env is not configured", async () => {
    configureBilling(false);
    const { publishRequiresCheckout } = await loadPublishAccess();
    expect(
      publishRequiresCheckout(billing({ billingActive: false, hasLemonSubscription: false })),
    ).toBe(false);
  });

  it("allows publish when billing is active (trialing/active)", async () => {
    configureBilling(true);
    const { publishRequiresCheckout } = await loadPublishAccess();
    expect(publishRequiresCheckout(billing({ billingActive: true, hasLemonSubscription: false }))).toBe(
      false,
    );
  });

  it("allows publish when Lemon subscription id exists even if inactive", async () => {
    configureBilling(true);
    const { publishRequiresCheckout } = await loadPublishAccess();
    expect(publishRequiresCheckout(billing({ billingActive: false, hasLemonSubscription: true }))).toBe(
      false,
    );
  });

  it("blocks publish when inactive and no Lemon subscription", async () => {
    configureBilling(true);
    const { publishRequiresCheckout } = await loadPublishAccess();
    expect(publishRequiresCheckout(billing({ billingActive: false, hasLemonSubscription: false }))).toBe(
      true,
    );
  });

  it("allows publish when billing context is missing", async () => {
    configureBilling(true);
    const { publishRequiresCheckout } = await loadPublishAccess();
    expect(publishRequiresCheckout(null)).toBe(false);
    expect(publishRequiresCheckout(undefined)).toBe(false);
  });

  it("exposes a stable checkout message for UI and server", async () => {
    const { PUBLISH_CHECKOUT_MESSAGE } = await loadPublishAccess();
    expect(PUBLISH_CHECKOUT_MESSAGE).toMatch(/Subscribe to publish/i);
  });
});

describe("P0-03 — saveTeamContent publish gate contract", () => {
  it("server actions call assertCanPublishTeam only on publish option", async () => {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const src = readFileSync(
      join(process.cwd(), "app/admin/(protected)/team/[teamId]/server-actions.ts"),
      "utf8",
    );
    expect(src).toMatch(/assertCanPublishTeam/);
    expect(src).toMatch(/if \(options\?\.publish\)/);
    expect(src).toMatch(/await assertCanPublishTeam\(supabase, user\.id, teamId\)/);
  });
});
