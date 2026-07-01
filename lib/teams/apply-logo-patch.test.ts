import { describe, expect, it } from "vitest";
import { createDefaultBlocks } from "@/lib/default-blocks";
import { applyTeamLogoPatch } from "@/lib/teams/apply-logo-patch";
import type { TeamSpace } from "@/lib/types";

function baseTeam(): TeamSpace {
  return {
    id: "team-1",
    slug: "runners",
    name: "Runners",
    primaryColor: "#000",
    secondaryColor: "#fff",
    themeId: "ocean_aqua",
    plan: "pro",
    blocks: createDefaultBlocks(),
    subscriptionStatus: "trialing",
    publishStatus: "draft",
  };
}

describe("applyTeamLogoPatch", () => {
  it("sets logoUrl and hero teamPhotoUrl together", () => {
    const url = "https://cdn.example/logo.webp";
    const next = applyTeamLogoPatch(baseTeam(), url);
    expect(next.logoUrl).toBe(url);
    const hero = next.blocks.find((b) => b.type === "hero");
    expect((hero?.settings as { teamPhotoUrl?: string }).teamPhotoUrl).toBe(url);
  });

  it("clears logo when url is empty", () => {
    const withLogo = applyTeamLogoPatch(baseTeam(), "https://cdn.example/logo.webp");
    const cleared = applyTeamLogoPatch(withLogo, "");
    expect(cleared.logoUrl).toBeUndefined();
    const hero = cleared.blocks.find((b) => b.type === "hero");
    expect((hero?.settings as { teamPhotoUrl?: string }).teamPhotoUrl).toBe("");
  });
});
