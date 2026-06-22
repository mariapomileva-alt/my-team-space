import { describe, expect, it } from "vitest";
import { createDefaultBlocks } from "@/lib/default-blocks";
import type { BlockInstance, TeamSpace } from "@/lib/types";
import {
  filterBlocksForPublicDisplay,
  hasPublicBlockContent,
} from "@/lib/blocks/public-block-visibility";

const LOGO = "https://example.com/logo.png";
const COVER = "https://example.com/cover.jpg";

function elenaTeam(blocks: BlockInstance[], extra?: Partial<TeamSpace>): TeamSpace {
  return {
    id: "elena_test",
    slug: "elena-trust-test",
    name: "Elena Juniors",
    logoUrl: LOGO,
    primaryColor: "#0c4a6e",
    secondaryColor: "#0ea5e9",
    themeId: "ocean_aqua",
    plan: "pro",
    publishStatus: "published",
    blocks,
    ...extra,
  };
}

function patchHero(blocks: BlockInstance[], patch: Record<string, unknown>) {
  return blocks.map((b) =>
    b.type === "hero" ? { ...b, settings: { ...b.settings, ...patch } } : b,
  );
}

function patchBlock(blocks: BlockInstance[], type: BlockInstance["type"], patch: Partial<BlockInstance>) {
  return blocks.map((b) => (b.type === type ? { ...b, ...patch, settings: { ...b.settings, ...patch.settings } } : b));
}

describe("Elena trust — minimal published page", () => {
  it("shows only hero when coach added name, logo and cover only", () => {
    const blocks = patchHero(createDefaultBlocks(), {
      coverImageUrl: COVER,
      teamPhotoUrl: LOGO,
      social: {},
    });
    const team = elenaTeam(blocks);

    const visible = filterBlocksForPublicDisplay(team, team.blocks.filter((b) => b.enabled));

    expect(visible.map((b) => b.type)).toEqual(["hero"]);
    expect(hasPublicBlockContent(team, team.blocks.find((b) => b.type === "announcement_bar")!)).toBe(false);
    expect(hasPublicBlockContent(team, team.blocks.find((b) => b.type === "schedule")!)).toBe(false);
    expect(hasPublicBlockContent(team, team.blocks.find((b) => b.type === "gallery")!)).toBe(false);
    expect(hasPublicBlockContent(team, team.blocks.find((b) => b.type === "contacts")!)).toBe(false);
  });

  it("never surfaces generic announcement copy", () => {
    const bar = createDefaultBlocks().find((b) => b.type === "announcement_bar")!;
    const team = elenaTeam([bar]);
    expect(hasPublicBlockContent(team, { ...bar, enabled: true, settings: { message: "" } })).toBe(false);
    expect(hasPublicBlockContent(team, { ...bar, enabled: true, settings: { message: "   " } })).toBe(false);
  });
});

describe("Elena trust — schedule + WhatsApp", () => {
  it("shows hero and schedule only; WhatsApp lives on hero, empty contacts stay hidden", () => {
    let blocks = patchHero(createDefaultBlocks(), {
      coverImageUrl: COVER,
      teamPhotoUrl: LOGO,
      social: { whatsapp: "+37120000000" },
    });
    blocks = patchBlock(blocks, "schedule", {
      settings: {
        mode: "manual",
        externalUrl: "",
        events: [
          {
            id: "evt_1",
            title: "Training",
            eventType: "training",
            dayOfWeek: 2,
            time: "18:00",
            location: "Main hall",
            repeat: "weekly",
            ends: "never",
          },
        ],
      },
    });
    const team = elenaTeam(blocks);
    const visible = filterBlocksForPublicDisplay(team, team.blocks.filter((b) => b.enabled));

    expect(visible.map((b) => b.type)).toEqual(["hero", "schedule"]);
    expect(hasPublicBlockContent(team, team.blocks.find((b) => b.type === "contacts")!)).toBe(false);
    expect(hasPublicBlockContent(team, team.blocks.find((b) => b.type === "gallery")!)).toBe(false);

    const hero = visible.find((b) => b.type === "hero")!;
    const social = (hero.settings as { social?: { whatsapp?: string } }).social;
    expect(social?.whatsapp).toBe("+37120000000");
  });
});
