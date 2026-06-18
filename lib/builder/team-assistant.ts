import { getCompletionItems, type BuilderProgressTarget } from "@/lib/builder/page-completion";
import { BLOCK_META } from "@/lib/blocks/meta";
import { getBlockSettings } from "@/lib/blocks/settings";
import type { TeamSpace } from "@/lib/types";

export type AssistantSuggestion = {
  id: string;
  emoji: string;
  label: string;
  description: string;
  done: boolean;
  href: string;
  priority: number;
};

const BLOCK_HINTS: Partial<Record<string, { label: string; description: string; href: string }>> = {
  gallery: {
    label: "Add a gallery",
    description: "Show camps, competitions and training moments.",
    href: "sections",
  },
  payments: {
    label: "Add payment link",
    description: "Let parents pay fees in one trusted place.",
    href: "sections",
  },
  team_feed: {
    label: "Publish your first update",
    description: "Keep families in the loop with news and announcements.",
    href: "sections",
  },
  contacts: {
    label: "Add coach information",
    description: "Help parents know who to contact.",
    href: "sections",
  },
  achievements: {
    label: "Upload team achievements",
    description: "Celebrate wins and milestones with pride.",
    href: "sections",
  },
  results: {
    label: "Add competition results",
    description: "Display rankings and race outcomes.",
    href: "results",
  },
  schedule: {
    label: "Add your first event",
    description: "Publish upcoming races, matches and training.",
    href: "calendar",
  },
  calendar: {
    label: "Create your calendar",
    description: "Share what's coming up for the team.",
    href: "calendar",
  },
};

function buildHref(teamId: string, segment: string): string {
  if (segment === "sections" || segment === "header" || segment === "settings") {
    return `/admin/team/${teamId}/build?focus=${segment}`;
  }
  return `/admin/team/${teamId}/${segment}`;
}

export function getTeamAssistantSuggestions(team: TeamSpace, teamId: string): AssistantSuggestion[] {
  const items = getCompletionItems(team);
  const suggestions: AssistantSuggestion[] = [];

  for (const item of items.filter((i) => !i.done)) {
    let segment = "build";
    if (item.id === "schedule") segment = "calendar";
    if (item.id === "results") segment = "results";
    if (item.id === "contacts") segment = "members";
    if (item.id === "identity" || item.id === "cover" || item.id === "social") segment = "build?focus=header";

    suggestions.push({
      id: `completion-${item.label}`,
      emoji: item.emoji,
      label:
        item.label === "Logo"
          ? "Upload your team logo"
          : item.label === "Team name"
            ? "Add your team name"
            : `Add ${item.label.toLowerCase()}`,
      description:
        item.label === "Schedule"
          ? "Publish upcoming races, matches and training sessions."
          : item.label === "Gallery"
            ? "Show team photos, camps and competition moments."
            : `Complete your ${item.label.toLowerCase()} to build parent trust.`,
      done: false,
      href: buildHref(teamId, segment),
      priority: item.priority,
    });
  }

  for (const block of team.blocks) {
    const hint = BLOCK_HINTS[block.type];
    if (!hint || block.enabled) continue;
    const meta = BLOCK_META[block.type];
    suggestions.push({
      id: `block-${block.type}`,
      emoji: meta?.emoji ?? "✨",
      label: hint.label,
      description: hint.description,
      done: false,
      href: buildHref(teamId, hint.href),
      priority: 20 + (meta?.priority ?? 0),
    });
  }

  const hero = team.blocks.find((b) => b.type === "hero");
  const hs = hero ? getBlockSettings<{ description?: string; quote?: string }>(hero) : undefined;
  if (!team.tagline?.trim() && !hs?.description?.trim() && !hs?.quote?.trim()) {
    suggestions.push({
      id: "description",
      emoji: "✍️",
      label: "Write your team story",
      description: "A short motto or description helps parents feel your team spirit.",
      done: false,
      href: buildHref(teamId, "build?focus=header"),
      priority: 5,
    });
  }

  const seen = new Set<string>();
  return suggestions
    .filter((s) => {
      if (seen.has(s.label)) return false;
      seen.add(s.label);
      return true;
    })
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3);
}

export type { BuilderProgressTarget };
