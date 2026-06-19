import { getBlockSettings } from "@/lib/blocks/settings";
import type { TeamSpace } from "@/lib/types";

export type LaunchChecklistId =
  | "team_name"
  | "logo"
  | "schedule"
  | "contacts"
  | "publish"
  | "share";

export type LaunchChecklistItem = {
  id: LaunchChecklistId;
  label: string;
  done: boolean;
  nextAction: string;
};

function hasSchedule(team: TeamSpace): boolean {
  const block =
    team.blocks.find((b) => b.type === "schedule" && b.enabled) ??
    team.blocks.find((b) => b.type === "calendar" && b.enabled);
  if (!block) return false;
  const s = getBlockSettings<{ externalUrl?: string; events?: unknown[] }>(block);
  return Boolean(
    s.externalUrl?.trim() || (Array.isArray(s.events) && s.events.length > 0),
  );
}

function hasContacts(team: TeamSpace): boolean {
  const block = team.blocks.find((b) => b.type === "contacts" && b.enabled);
  if (!block) return false;
  const s = getBlockSettings<{ items?: { name?: string }[] }>(block);
  return (s.items ?? []).some((i) => Boolean(i.name?.trim()));
}

export function getLaunchChecklist(team: TeamSpace): LaunchChecklistItem[] {
  const hero = team.blocks.find((b) => b.type === "hero");
  const hs = hero ? getBlockSettings<{ teamPhotoUrl?: string }>(hero) : undefined;
  const hasLogo = Boolean((team.logoUrl ?? hs?.teamPhotoUrl ?? "").trim());
  const isLive = team.publishStatus === "published";

  return [
    {
      id: "team_name",
      label: "Add team name",
      done: Boolean(team.name?.trim()),
      nextAction: "Add team name",
    },
    {
      id: "logo",
      label: "Add logo",
      done: hasLogo,
      nextAction: "Add logo",
    },
    {
      id: "schedule",
      label: "Add schedule",
      done: hasSchedule(team),
      nextAction: "Add schedule",
    },
    {
      id: "contacts",
      label: "Add contact info",
      done: hasContacts(team),
      nextAction: "Add contact info",
    },
    {
      id: "publish",
      label: "Publish page",
      done: isLive,
      nextAction: "Publish page",
    },
    {
      id: "share",
      label: "Share with parents",
      done: isLive,
      nextAction: "Share with parents",
    },
  ];
}

export function nextLaunchStep(team: TeamSpace): LaunchChecklistItem | null {
  return getLaunchChecklist(team).find((item) => !item.done) ?? null;
}
