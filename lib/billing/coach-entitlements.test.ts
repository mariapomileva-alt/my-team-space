import { describe, expect, it } from "vitest";
import { buildCoachEntitlements, effectiveTeamLimit } from "@/lib/billing/coach-subscription";
import type { CoachSubscription } from "@/lib/billing/types";

function sub(partial: Partial<CoachSubscription> & Pick<CoachSubscription, "userId">): CoachSubscription {
  return {
    lemonCustomerId: null,
    lemonSubscriptionId: null,
    lemonVariantId: null,
    planType: "single_team",
    subscriptionStatus: "inactive",
    teamLimit: null,
    currentTeamCount: 0,
    primaryTeamId: null,
    currentPeriodEnd: null,
    ...partial,
  };
}

describe("effectiveTeamLimit", () => {
  it("allows first team before checkout (no subscription row)", () => {
    expect(effectiveTeamLimit(null, 0)).toBe(1);
  });

  it("grandfathers inactive coaches with existing teams", () => {
    expect(
      effectiveTeamLimit(
        sub({ userId: "u1", subscriptionStatus: "cancelled", currentTeamCount: 3, planType: "academy" }),
        3,
      ),
    ).toBe(3);
  });

  it("uses live team count when DB counter lags", () => {
    expect(
      effectiveTeamLimit(
        sub({ userId: "u1", subscriptionStatus: "cancelled", currentTeamCount: 1, planType: "academy" }),
        4,
      ),
    ).toBe(4);
  });

  it("caps active academy plan at team_limit", () => {
    expect(
      effectiveTeamLimit(
        sub({
          userId: "u1",
          subscriptionStatus: "active",
          planType: "academy",
          teamLimit: 20,
          currentTeamCount: 5,
        }),
        5,
      ),
    ).toBe(20);
  });

  it("caps active single_team at 1", () => {
    expect(
      effectiveTeamLimit(
        sub({ userId: "u1", subscriptionStatus: "active", planType: "single_team", currentTeamCount: 1 }),
        1,
      ),
    ).toBe(1);
  });
});

describe("buildCoachEntitlements", () => {
  it("lets new coaches create their first team without billing", () => {
    const ent = buildCoachEntitlements(null, 0, []);
    expect(ent.canCreateTeam).toBe(true);
    expect(ent.teamLimit).toBe(1);
    expect(ent.billingActive).toBe(true);
  });

  it("treats null plan_type as single_team for primary selection", () => {
    const ent = buildCoachEntitlements(
      sub({ userId: "u1", planType: null, subscriptionStatus: "active", primaryTeamId: null }),
      2,
      ["t1", "t2"],
    );
    expect(ent.needsPrimaryTeamSelection).toBe(true);
  });

  it("blocks create when academy is at limit", () => {
    const ent = buildCoachEntitlements(
      sub({
        userId: "u1",
        planType: "academy",
        subscriptionStatus: "active",
        teamLimit: 20,
        currentTeamCount: 20,
      }),
      20,
      Array.from({ length: 20 }, (_, i) => `t${i}`),
    );
    expect(ent.canCreateTeam).toBe(false);
    expect(ent.teamLimit).toBe(20);
  });

  it("blocks create for inactive billing even when under grandfather limit", () => {
    const ent = buildCoachEntitlements(
      sub({
        userId: "u1",
        planType: "academy",
        subscriptionStatus: "cancelled",
        currentTeamCount: 2,
      }),
      2,
      ["t1", "t2"],
    );
    expect(ent.canCreateTeam).toBe(false);
    expect(ent.teamLimit).toBe(2);
  });
});
