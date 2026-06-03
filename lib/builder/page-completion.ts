import { getBlockSettings, type SocialKey } from "@/lib/blocks/settings";
import type { TeamSpace } from "@/lib/types";

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

const SUGGESTION_LABELS = ["Logo", "Schedule", "Contacts"] as const;

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
    { id: "identity", emoji: "🏷️", label: "Team name", done: hasName, weight: 22, priority: 1 },
    { id: "identity", emoji: "🖼️", label: "Logo", done: hasLogo, weight: 18, priority: 2 },
    { id: "schedule", emoji: "📅", label: "Schedule", done: hasSchedule, weight: 16, priority: 3 },
    { id: "contacts", emoji: "📞", label: "Contacts", done: hasContacts, weight: 12, priority: 4 },
    { id: "cover", emoji: "🌄", label: "Cover image", done: hasCover, weight: 10, priority: 5 },
    { id: "gallery", emoji: "📸", label: "Gallery", done: hasGallery, weight: 10, priority: 6 },
    { id: "results", emoji: "🏆", label: "Results", done: hasResults, weight: 8, priority: 7 },
    { id: "social", emoji: "🔗", label: "Social links", done: hasSocial, weight: 4, priority: 8 },
  ];
}

export function builderCompletionPercent(team: TeamSpace): number {
  const items = getCompletionItems(team);
  const total = items.reduce((sum, i) => sum + i.weight, 0);
  const done = items.reduce((sum, i) => sum + (i.done ? i.weight : 0), 0);
  if (total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
}

export type CompletionGuidance = {
  statusTitle: string;
  helperText: string;
  nextStep: string;
  tone: "ready" | "almost" | "needs-work";
  doneCount: number;
  totalCount: number;
  remainingCount: number;
  completed: CompletionItem[];
  completedCelebrations: string[];
  requiredMissing: CompletionItem[];
  publishRemainingMessage: string | null;
  suggestions: CompletionItem[];
  canPublish: boolean;
  isFullyReady: boolean;
};

const COMPLETED_LABELS: Record<string, string> = {
  "Team name": "Team name added",
  Logo: "Logo added",
  Schedule: "Schedule added",
  Contacts: "Contacts added",
  "Cover image": "Cover image added",
  Gallery: "Gallery added",
  Results: "Results added",
  "Social links": "Social links added",
};

export function completedCelebrationLabel(item: CompletionItem): string {
  return COMPLETED_LABELS[item.label] ?? `${item.label} added`;
}

export function requiredPublishAction(item: CompletionItem): string {
  if (item.label === "Logo") return "Add your logo.";
  if (item.label === "Team name") return "Add your team name.";
  return `Add your ${item.label.toLowerCase()}.`;
}

function buildPublishRemainingMessage(requiredMissing: CompletionItem[]): string | null {
  if (requiredMissing.length === 0) return null;
  const action = requiredPublishAction(requiredMissing[0]!);
  if (requiredMissing.length === 1) {
    return `Only 1 required item remains before publishing:\n${action}`;
  }
  const actions = requiredMissing.map(requiredPublishAction).join(" ");
  return `Only ${requiredMissing.length} required items remain before publishing:\n${actions}`;
}

function buildNextStep(
  items: CompletionItem[],
  hasName: boolean,
  hasLogo: boolean,
  isFullyReady: boolean,
): string {
  if (isFullyReady) return "";
  if (!hasName) return "Add your team name — then you're ready to publish.";
  if (!hasLogo) return "Add your logo — then you're ready to publish.";
  const next = items
    .filter((i) => !i.done)
    .sort((a, b) => a.priority - b.priority)[0];
  if (!next) return "You're ready to publish whenever you like.";
  return `Consider adding ${next.label.toLowerCase()} to make your page even better.`;
}

export function getCompletionGuidance(team: TeamSpace): CompletionGuidance {
  const items = getCompletionItems(team);
  const completed = items.filter((i) => i.done);
  const missing = items.filter((i) => !i.done);
  const doneCount = completed.length;
  const totalCount = items.length;

  const hasName = items.find((i) => i.label === "Team name")?.done ?? false;
  const hasLogo = items.find((i) => i.label === "Logo")?.done ?? false;
  const canPublish = hasName && hasLogo;
  const isFullyReady = missing.length === 0;

  const requiredMissing = items.filter(
    (i) => !i.done && (i.label === "Team name" || i.label === "Logo"),
  );

  const suggestions = items.filter((i) =>
    (SUGGESTION_LABELS as readonly string[]).includes(i.label),
  );

  const hasOpenSuggestions = suggestions.some((i) => !i.done);

  let statusTitle: string;
  let helperText: string;
  let tone: CompletionGuidance["tone"];

  const remainingCount = missing.length;

  if (isFullyReady) {
    statusTitle = "You're all set";
    helperText = "Your team page is ready for families.";
    tone = "ready";
  } else if (!hasName || !hasLogo) {
    statusTitle = "You're almost done";
    helperText =
      doneCount >= totalCount - 2
        ? "Just one more step and you can publish."
        : "Great start — keep going, you're on the right track.";
    tone = doneCount >= 4 ? "almost" : "needs-work";
  } else if (canPublish) {
    statusTitle = "You're almost done";
    helperText = hasOpenSuggestions
      ? "You can publish now — extra sections help parents even more."
      : "You can publish now. Nice work.";
    tone = "almost";
  } else {
    statusTitle = "You're almost done";
    helperText = "You're making great progress on your team page.";
    tone = "almost";
  }

  return {
    statusTitle,
    helperText,
    nextStep: buildNextStep(items, hasName, hasLogo, isFullyReady),
    tone,
    doneCount,
    totalCount,
    remainingCount,
    completed,
    completedCelebrations: completed.map(completedCelebrationLabel),
    requiredMissing,
    publishRemainingMessage: buildPublishRemainingMessage(requiredMissing),
    suggestions,
    canPublish,
    isFullyReady,
  };
}
