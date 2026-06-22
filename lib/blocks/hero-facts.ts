import { getBlockSettings } from "@/lib/blocks/settings";
import type { TeamSpace } from "@/lib/types";

export type HeroFact = {
  icon: string;
  text: string;
};

/** Up to 3 compact trust signals from data the coach already entered. */
export function deriveHeroFacts(team: TeamSpace, city?: string | null): HeroFact[] {
  const facts: HeroFact[] = [];

  if (city?.trim()) {
    facts.push({ icon: "📍", text: city.trim() });
  }

  if (team.tagline?.trim()) {
    facts.push({ icon: "🏅", text: team.tagline.trim() });
  }

  const attendance = team.blocks.find((b) => b.type === "attendance" && b.enabled);
  if (attendance) {
    const roster = getBlockSettings<{ roster: { name?: string }[] }>(attendance).roster ?? [];
    const count = roster.filter((p) => p.name?.trim()).length;
    if (count > 0) {
      facts.push({ icon: "👥", text: `${count} athlete${count === 1 ? "" : "s"}` });
    }
  }

  if (facts.length < 3) {
    const achievements = team.blocks.find((b) => b.type === "achievements" && b.enabled);
    if (achievements) {
      const cards = getBlockSettings<{ cards: unknown[] }>(achievements).cards ?? [];
      if (cards.length > 0) {
        facts.push({
          icon: "🏆",
          text: `${cards.length} highlight${cards.length === 1 ? "" : "s"}`,
        });
      }
    }
  }

  return facts.slice(0, 3);
}
