import type { TeamSpace } from "@/lib/types";
import { createDefaultBlocks } from "@/lib/default-blocks";

const sharkyBlocks = createDefaultBlocks();

export const MOCK_TEAMS: TeamSpace[] = [
  {
    id: "team_sharky",
    slug: "sharky",
    name: "Sharky Triathlon Team",
    logoUrl: undefined,
    primaryColor: "#0c4a6e",
    secondaryColor: "#0ea5e9",
    themeId: "sharky_aqua",
    plan: "pro",
    tagline: "Одна страница в браузере для родителей, детей и тренера.",
    blocks: sharkyBlocks.map((b) =>
      b.type === "hero"
        ? {
            ...b,
            settings: {
              quote: "Влюбляйтесь в старт вместе.",
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
    tagline: "Маленькие гребки — большие мечты. Всё на одной странице.",
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
    tagline: "Ритм и уверенность — делитесь одной ссылкой с родителями.",
    blocks: createDefaultBlocks(),
  },
];

export function getTeamBySlug(slug: string): TeamSpace | undefined {
  return MOCK_TEAMS.find((t) => t.slug === slug);
}

export function getAllTeamSlugs(): string[] {
  return MOCK_TEAMS.map((t) => t.slug);
}
