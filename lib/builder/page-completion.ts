import { getBlockSettings, type SocialKey } from "@/lib/blocks/settings";
import type { TeamSpace } from "@/lib/types";
import type { BuilderBillingContext } from "@/lib/billing/builder-context-types";

export type BuilderProgressTarget =
  | "identity"
  | "cover"
  | "schedule"
  | "contacts"
  | "gallery"
  | "social"
  | "results";

export type CompletionItem = {
  id: BuilderProgressTarget;
  emoji: string;
  label: string;
  done: boolean;
  weight: number;
  /** Lower = higher priority for “next step” hints */
  priority: number;
};

const SUGGESTION_LABELS = ["Logo", "First event", "Gallery", "Contacts", "Results"] as const;

const REQUIRED_LABELS = new Set(["Team name", "Logo"]);

type HeroSettings = {
  quote: string;
  description?: string;
  city: string;
  coverImageUrl: string;
  teamPhotoUrl?: string;
  social: Partial<Record<SocialKey, string>>;
};

export function getCompletionItems(team: TeamSpace): CompletionItem[] {
  const hero = team.blocks.find((b) => b.type === "hero");
  const hs = hero ? getBlockSettings<HeroSettings>(hero) : undefined;

  const hasName = Boolean(team.name?.trim());
  const hasLogo = Boolean((team.logoUrl ?? hs?.teamPhotoUrl ?? "").trim());
  const hasCover = Boolean(hs?.coverImageUrl?.trim());

  const scheduleBlock =
    team.blocks.find((b) => b.type === "schedule") ?? team.blocks.find((b) => b.type === "calendar");
  const scheduleSettings = scheduleBlock
    ? getBlockSettings<{ externalUrl?: string; events?: unknown[] }>(scheduleBlock)
    : undefined;
  const hasSchedule = Boolean(
    scheduleBlock?.enabled &&
      ((scheduleSettings?.externalUrl?.trim() ?? "") ||
        (Array.isArray(scheduleSettings?.events) && scheduleSettings.events.length > 0)),
  );

  const contactsBlock = team.blocks.find((b) => b.type === "contacts");
  const contactsSettings = contactsBlock ? getBlockSettings<{ items?: { name?: string }[] }>(contactsBlock) : undefined;
  const hasContacts = Boolean(
    contactsBlock?.enabled && (contactsSettings?.items ?? []).some((i) => Boolean(i.name?.trim())),
  );

  const galleryBlock = team.blocks.find((b) => b.type === "gallery");
  const gallerySettings = galleryBlock
    ? getBlockSettings<{ externalUrl?: string; images?: { url?: string }[] }>(galleryBlock)
    : undefined;
  const hasGallery = Boolean(
    galleryBlock?.enabled &&
      ((gallerySettings?.externalUrl?.trim() ?? "") ||
        (gallerySettings?.images ?? []).some((img) => Boolean(img.url?.trim()))),
  );

  const hasSocial = Boolean(Object.values(hs?.social ?? {}).some((v) => Boolean(v?.trim())));
  const hasDescription = Boolean(
    team.tagline?.trim() || hs?.description?.trim() || hs?.quote?.trim(),
  );

  const resultsBlock = team.blocks.find((b) => b.type === "results");
  const resultsSettings = resultsBlock
    ? getBlockSettings<{ simpleResults?: unknown[]; competitions?: unknown[]; categories?: unknown[] }>(resultsBlock)
    : undefined;
  const hasResults = Boolean(
    resultsBlock?.enabled &&
      ((resultsSettings?.simpleResults?.length ?? 0) > 0 ||
        (resultsSettings?.competitions?.length ?? 0) > 0 ||
        (resultsSettings?.categories?.length ?? 0) > 0),
  );

  return [
    { id: "identity", emoji: "🏷️", label: "Team name", done: hasName, weight: 18, priority: 1 },
    { id: "identity", emoji: "🖼️", label: "Logo", done: hasLogo, weight: 16, priority: 2 },
    { id: "cover", emoji: "🌄", label: "Cover image", done: hasCover, weight: 10, priority: 3 },
    { id: "identity", emoji: "✍️", label: "Team description", done: hasDescription, weight: 10, priority: 4 },
    { id: "contacts", emoji: "📞", label: "Contacts", done: hasContacts, weight: 12, priority: 5 },
    { id: "schedule", emoji: "📅", label: "First event", done: hasSchedule, weight: 14, priority: 6 },
    { id: "gallery", emoji: "📸", label: "Gallery", done: hasGallery, weight: 10, priority: 7 },
    { id: "results", emoji: "🏆", label: "Results", done: hasResults, weight: 8, priority: 8 },
    { id: "social", emoji: "🔗", label: "Social links", done: hasSocial, weight: 6, priority: 9 },
  ];
}

export function builderCompletionPercent(team: TeamSpace): number {
  const items = getCompletionItems(team);
  const total = items.reduce((sum, i) => sum + i.weight, 0);
  const done = items.reduce((sum, i) => sum + (i.done ? i.weight : 0), 0);
  if (total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
}

export type SetupSnapshot = {
  percent: number;
  next: CompletionItem | null;
  completed: CompletionItem[];
  recommended: CompletionItem[];
};

export function formatSetupAction(item: CompletionItem): string {
  if (item.label === "Logo") return "Upload your team logo";
  if (item.label === "Team name") return "Add your team name";
  if (item.label === "First event") return "Add your first event";
  if (item.label === "Cover image") return "Add a cover image";
  if (item.label === "Team description") return "Write your team story";
  if (item.label === "Social links") return "Add Instagram link";
  return `Add ${item.label.toLowerCase()}`;
}

/** Action-focused setup snapshot for progress center & suggestions. */
export function getSetupSnapshot(team: TeamSpace): SetupSnapshot {
  const items = getCompletionItems(team);
  const incomplete = items.filter((i) => !i.done).sort((a, b) => a.priority - b.priority);
  const completed = items.filter((i) => i.done).sort((a, b) => a.priority - b.priority);
  return {
    percent: builderCompletionPercent(team),
    next: incomplete[0] ?? null,
    completed: completed.slice(0, 5),
    recommended: incomplete.slice(1, 4),
  };
}

export type CompletionGuidance = {
  readinessPercent: number;
  emotionalHeadline: string;
  summaryLine: string;
  primaryHeadline: string;
  primaryActionText: string;
  primaryCtaLabel: string | null;
  primaryTarget: BuilderProgressTarget;
  tone: "ready" | "almost" | "needs-work";
  doneCount: number;
  totalCount: number;
  optionalRemainingCount: number;
  completed: CompletionItem[];
  requiredMissing: CompletionItem[];
  missingForPublish: { label: string }[];
  suggestions: CompletionItem[];
  canPublish: boolean;
  isFullyReady: boolean;
};

const COMPLETED_LABELS: Record<string, string> = {
  "Team name": "Team name",
  Logo: "Logo",
  Contacts: "Contacts",
  "Cover image": "Cover image",
  "Team description": "Team description",
  Gallery: "Gallery",
  Results: "Results",
  "First event": "First event",
  "Social links": "Social links",
};

export function completedCelebrationLabel(item: CompletionItem): string {
  return COMPLETED_LABELS[item.label] ?? item.label;
}

function primaryCtaLabel(item: CompletionItem): string {
  if (item.label === "Logo") return "Upload logo";
  if (item.label === "Team name") return "Add team name";
  return `Add ${item.label.toLowerCase()}`;
}

function unlockPublishingText(item: CompletionItem): string {
  if (item.label === "Logo") return "Add your logo to unlock publishing";
  if (item.label === "Team name") return "Add your team name to unlock publishing";
  return `Add your ${item.label.toLowerCase()} to unlock publishing`;
}

function buildPrimaryAction(requiredMissing: CompletionItem[], isFullyReady: boolean) {
  if (isFullyReady) {
    return {
      primaryHeadline: "You're ready to publish",
      primaryActionText: "Your team page looks great — publish when you're ready.",
      primaryCtaLabel: null as string | null,
      primaryTarget: "identity" as BuilderProgressTarget,
    };
  }

  const first = requiredMissing[0];
  if (!first) {
    return {
      primaryHeadline: "You're almost ready to publish",
      primaryActionText: "Optional sections help parents find more info.",
      primaryCtaLabel: null,
      primaryTarget: "identity" as BuilderProgressTarget,
    };
  }

  const count = requiredMissing.length;
  const primaryHeadline =
    count === 1
      ? "One step left before publishing"
      : count === 2
        ? "Two steps left before publishing"
        : "Complete required items to publish";

  return {
    primaryHeadline,
    primaryActionText: unlockPublishingText(first),
    primaryCtaLabel: primaryCtaLabel(first),
    primaryTarget: first.id,
  };
}

export function getCompletionGuidance(team: TeamSpace): CompletionGuidance {
  const items = getCompletionItems(team);
  const completed = items.filter((i) => i.done);
  const missing = items.filter((i) => !i.done);
  const doneCount = completed.length;
  const totalCount = items.length;
  const readinessPercent = builderCompletionPercent(team);

  const hasName = items.find((i) => i.label === "Team name")?.done ?? false;
  const hasLogo = items.find((i) => i.label === "Logo")?.done ?? false;
  const canPublish = hasName && hasLogo;
  const isFullyReady = missing.length === 0;

  const requiredMissing = items.filter((i) => !i.done && REQUIRED_LABELS.has(i.label));
  const optionalRemainingCount = missing.filter((i) => !REQUIRED_LABELS.has(i.label)).length;

  const suggestions = items.filter((i) =>
    (SUGGESTION_LABELS as readonly string[]).includes(i.label),
  );

  const primary = buildPrimaryAction(requiredMissing, isFullyReady);

  let emotionalHeadline: string;
  if (isFullyReady) {
    emotionalHeadline = "You're ready to publish";
  } else if (requiredMissing.length === 1) {
    emotionalHeadline = "Only one required step remains";
  } else if (requiredMissing.length > 1) {
    emotionalHeadline = "Great start — your team page is nearly ready";
  } else {
    emotionalHeadline = "You're almost ready to publish";
  }

  const summaryParts: string[] = [`${readinessPercent}% ready`];
  if (optionalRemainingCount > 0) {
    summaryParts.push(
      `${optionalRemainingCount} optional ${optionalRemainingCount === 1 ? "item" : "items"} remaining`,
    );
  } else if (isFullyReady) {
    summaryParts.push("All sections complete");
  }

  let tone: CompletionGuidance["tone"] = "almost";
  if (isFullyReady) tone = "ready";
  else if (readinessPercent < 40) tone = "needs-work";

  return {
    readinessPercent,
    emotionalHeadline,
    summaryLine: summaryParts.join(" · "),
    ...primary,
    tone,
    doneCount,
    totalCount,
    optionalRemainingCount,
    completed,
    requiredMissing,
    missingForPublish: requiredMissing.map((i) => ({ label: i.label })),
    suggestions,
    canPublish,
    isFullyReady,
  };
}

/** Friendly toolbar status — never sounds like a hard error. */
export function builderToolbarStatusLabel(
  team: TeamSpace,
  options: {
    editLocked: boolean;
    billing: BuilderBillingContext | null;
    autosaveLabel: string;
  },
): string {
  const { editLocked, billing, autosaveLabel } = options;

  if (editLocked && billing) {
    if (billing.lockReason === "subscription_inactive") {
      return "Editing paused — update billing to continue";
    }
    if (billing.lockReason === "team_plan_locked" || billing.lockReason === "not_active_team") {
      if (billing.teamsUsed <= 1) {
        return "Setting up your team access… refresh if this stays";
      }
      return "Editing paused — make this your active team below";
    }
    return "Editing paused — check your plan in the dashboard";
  }

  const g = getCompletionGuidance(team);
  if (!g.canPublish && g.requiredMissing.length > 0) {
    if (g.requiredMissing.length === 1) {
      const label = g.requiredMissing[0]!.label;
      if (label === "Logo") return "Publishing locked — add a logo to continue";
      if (label === "Team name") return "Publishing locked — add your team name to continue";
      return "One required item missing before publishing";
    }
    return "Complete required items to unlock publishing";
  }

  return autosaveLabel;
}
