import type { BlockType } from "@/lib/types";

/** Coach-friendly explanations when editing a block in the builder. */
export const BLOCK_COACH_COPY: Partial<Record<BlockType, string>> = {
  gallery: "Show team photos, camps, competitions and training moments.",
  results: "Display competition results and rankings.",
  schedule: "Publish upcoming races, matches and training sessions.",
  calendar: "Share what's coming up — practices, games and travel.",
  team_feed: "Post updates parents and athletes will actually read.",
  contacts: "Help families know who to call or message.",
  achievements: "Celebrate podiums, medals and personal bests.",
  hero: "Your team's first impression — logo, name and story.",
  quick_actions: "One-tap shortcuts for parents on mobile.",
  payments: "Collect fees with a trusted payment link.",
};

export function coachBlockDescription(type: BlockType, fallback: string): string {
  return BLOCK_COACH_COPY[type] ?? fallback;
}
