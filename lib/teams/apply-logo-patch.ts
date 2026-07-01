import type { TeamSpace } from "@/lib/types";

/** Keep team.logoUrl and hero.teamPhotoUrl in sync (single state update). */
export function applyTeamLogoPatch(team: TeamSpace, url: string): TeamSpace {
  const trimmed = url.trim();
  return {
    ...team,
    logoUrl: trimmed || undefined,
    blocks: team.blocks.map((block) => {
      if (block.type !== "hero") return block;
      const settings =
        block.settings && typeof block.settings === "object"
          ? { ...block.settings }
          : {};
      return {
        ...block,
        settings: {
          ...settings,
          teamPhotoUrl: trimmed,
        },
      };
    }),
  };
}
