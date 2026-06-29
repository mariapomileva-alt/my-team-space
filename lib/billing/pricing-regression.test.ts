import { afterEach, describe, expect, it, vi } from "vitest";
import { getPlanSpec, PLAN_CATALOG } from "@/lib/billing/plan-catalog";
import type { PlanType } from "@/lib/billing/types";
import {
  buildLemonCheckoutRequestBody,
  readCheckoutPlanType,
  readCheckoutVariantId,
} from "@/lib/lemon/build-checkout-request";
import { MARKETING_PLANS } from "@/lib/marketing/pricing";

const TEAM_VARIANT = "lemon-variant-team-29";
const ACADEMY_VARIANT = "lemon-variant-academy-199";

async function loadBillingConfig() {
  vi.resetModules();
  return import("@/lib/billing/config");
}

function stubVariantEnv() {
  vi.stubEnv("LEMONSQUEEZY_TEAM_VARIANT_ID", TEAM_VARIANT);
  vi.stubEnv("LEMONSQUEEZY_ACADEMY_VARIANT_ID", ACADEMY_VARIANT);
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("plan catalog", () => {
  it("locks Team Plan to €29/month and 1 team", () => {
    const spec = getPlanSpec("single_team");
    expect(spec.planType).toBe("single_team");
    expect(spec.displayPrice).toBe("€29");
    expect(spec.monthlyEuro).toBe(29);
    expect(spec.teamLimit).toBe(1);
  });

  it("locks Academy Plan to €199/month and 20 teams", () => {
    const spec = getPlanSpec("academy");
    expect(spec.planType).toBe("academy");
    expect(spec.displayPrice).toBe("€199");
    expect(spec.monthlyEuro).toBe(199);
    expect(spec.teamLimit).toBe(20);
  });
});

describe("Lemon variant mapping", () => {
  it("maps single_team checkout to the Team variant env", async () => {
    stubVariantEnv();
    const { variantIdForPlan } = await loadBillingConfig();
    expect(variantIdForPlan("single_team")).toBe(TEAM_VARIANT);
    expect(variantIdForPlan("single_team")).not.toBe(ACADEMY_VARIANT);
  });

  it("maps academy checkout to the Academy variant env", async () => {
    stubVariantEnv();
    const { variantIdForPlan } = await loadBillingConfig();
    expect(variantIdForPlan("academy")).toBe(ACADEMY_VARIANT);
    expect(variantIdForPlan("academy")).not.toBe(TEAM_VARIANT);
  });

  it("round-trips variant IDs back to the correct plan_type", async () => {
    stubVariantEnv();
    const { planFromVariantId } = await loadBillingConfig();

    expect(planFromVariantId(TEAM_VARIANT)).toEqual({
      planType: "single_team",
      teamLimit: PLAN_CATALOG.single_team.teamLimit,
    });
    expect(planFromVariantId(ACADEMY_VARIANT)).toEqual({
      planType: "academy",
      teamLimit: PLAN_CATALOG.academy.teamLimit,
    });
  });

  it("fails cross-mapping when variant IDs are distinct (swap guard)", async () => {
    stubVariantEnv();
    const { planFromVariantId } = await loadBillingConfig();

    expect(planFromVariantId(TEAM_VARIANT)?.planType).not.toBe("academy");
    expect(planFromVariantId(ACADEMY_VARIANT)?.planType).not.toBe("single_team");
  });
});

describe("checkout payload (mocked, no Lemon network)", () => {
  const base = {
    userId: "user-123",
    email: "coach@example.com",
    storeId: "376553",
    appUrl: "https://myteamspace.cc",
  };

  it("single_team checkout sends Team variant and plan_type single_team", async () => {
    stubVariantEnv();
    const { variantIdForPlan } = await loadBillingConfig();
    const body = buildLemonCheckoutRequestBody({
      ...base,
      plan: "single_team",
      variantId: variantIdForPlan("single_team"),
    });

    expect(readCheckoutPlanType(body)).toBe("single_team");
    expect(readCheckoutVariantId(body)).toBe(TEAM_VARIANT);
    expect(body.data.attributes.product_options.redirect_url).toBe(
      "https://myteamspace.cc/admin?checkout=success&plan=single_team",
    );
    expect(body.data.attributes.checkout_data.custom).toEqual({
      user_id: "user-123",
      plan_type: "single_team",
    });
  });

  it("academy checkout sends Academy variant and plan_type academy", async () => {
    stubVariantEnv();
    const { variantIdForPlan } = await loadBillingConfig();
    const body = buildLemonCheckoutRequestBody({
      ...base,
      plan: "academy",
      variantId: variantIdForPlan("academy"),
    });

    expect(readCheckoutPlanType(body)).toBe("academy");
    expect(readCheckoutVariantId(body)).toBe(ACADEMY_VARIANT);
    expect(body.data.attributes.product_options.redirect_url).toBe(
      "https://myteamspace.cc/admin?checkout=success&plan=academy",
    );
    expect(body.data.attributes.checkout_data.custom).toEqual({
      user_id: "user-123",
      plan_type: "academy",
    });
  });

  it("detects swapped variant IDs in checkout wiring", async () => {
    stubVariantEnv();
    const wrongBody = buildLemonCheckoutRequestBody({
      ...base,
      plan: "single_team",
      variantId: ACADEMY_VARIANT,
    });
    expect(readCheckoutPlanType(wrongBody)).toBe("single_team");
    expect(readCheckoutVariantId(wrongBody)).not.toBe(TEAM_VARIANT);
  });
});

describe("pricing UI copy", () => {
  function card(plan: PlanType) {
    const row = MARKETING_PLANS.find((p) => p.id === plan);
    if (!row) throw new Error(`Missing marketing card for ${plan}`);
    return row;
  }

  it("Team card displays €29/month and startPlan=single_team", () => {
    const team = card("single_team");
    expect(team.name).toBe(PLAN_CATALOG.single_team.label);
    expect(team.price).toBe("€29");
    expect(team.period).toBe("/month");
    expect(`${team.price}${team.period}`).toBe("€29/month");
    expect(team.href).toBe("/admin?startPlan=single_team");
  });

  it("Academy card displays €199/month and startPlan=academy", () => {
    const academy = card("academy");
    expect(academy.name).toBe(PLAN_CATALOG.academy.label);
    expect(academy.price).toBe("€199");
    expect(academy.period).toBe("/month");
    expect(`${academy.price}${academy.period}`).toBe("€199/month");
    expect(academy.href).toBe("/admin?startPlan=academy");
  });

  it("marketing prices stay aligned with billing plan catalog", () => {
    for (const plan of ["single_team", "academy"] as const) {
      const spec = getPlanSpec(plan);
      const row = card(plan);
      expect(row.price).toBe(spec.displayPrice);
      expect(row.id).toBe(spec.planType);
    }
  });
});

describe("pricing checkout button wiring", () => {
  it("hidden plan field values match marketing card ids", async () => {
    const { startCheckoutFormAction } = await import("@/lib/admin/checkout-actions");
    expect(typeof startCheckoutFormAction).toBe("function");

    for (const plan of MARKETING_PLANS) {
      expect(["single_team", "academy"]).toContain(plan.id);
      expect(plan.href).toContain(`startPlan=${plan.id}`);
    }
  });
});
