import type { TeamSpace } from "@/lib/types";
import { createDefaultBlocks } from "@/lib/default-blocks";

const cityJuniorsBlocks = createDefaultBlocks();

export const MOCK_TEAMS: TeamSpace[] = [
  {
    id: "team_city_juniors",
    slug: "city-juniors",
    name: "City Juniors U12",
    logoUrl: undefined,
    primaryColor: "#0c4a6e",
    secondaryColor: "#0ea5e9",
    themeId: "ocean_aqua",
    plan: "pro",
    tagline: "One browser page for parents, athletes, and coaches.",
    blocks: cityJuniorsBlocks.map((b) =>
      b.type === "hero"
        ? {
            ...b,
            settings: {
              quote: "Fall in love with racing together.",
              coverStyle: "gradient",
            },
          }
        : b
    ),
  },
  {
    id: "team_swim",
    slug: "riga-swim",
    name: "Riga Swim Academy",
    logoUrl: undefined,
    primaryColor: "#0369a1",
    secondaryColor: "#38bdf8",
    themeId: "premium_forest",
    plan: "club",
    tagline: "Small strokes. Big dreams — all on one page.",
    blocks: createDefaultBlocks(),
  },
  {
    id: "team_dance",
    slug: "dance-kids",
    name: "Dance Kids Studio",
    logoUrl: undefined,
    primaryColor: "#8b5cf6",
    secondaryColor: "#f472b6",
    themeId: "pastel_youth",
    plan: "free",
    tagline: "Rhythm and confidence — share one link with families.",
    blocks: createDefaultBlocks(),
  },
];

export function getTeamBySlug(slug: string): TeamSpace | undefined {
  return MOCK_TEAMS.find((t) => t.slug === slug);
}

export function getAllTeamSlugs(): string[] {
  return MOCK_TEAMS.map((t) => t.slug);
}
