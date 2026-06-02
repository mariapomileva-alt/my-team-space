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
  headline: string;
  tone: "ready" | "almost" | "needs-work";
  completed: CompletionItem[];
  nextSteps: CompletionItem[];
  canPublish: boolean;
  isFullyReady: boolean;
};

export function getCompletionGuidance(team: TeamSpace): CompletionGuidance {
  const items = getCompletionItems(team);
  const completed = items.filter((i) => i.done);
  const missing = items.filter((i) => !i.done).sort((a, b) => a.priority - b.priority);

  const hasName = items.find((i) => i.label === "Team name")?.done ?? false;
  const hasLogo = items.find((i) => i.label === "Logo")?.done ?? false;
  const canPublish = hasName && hasLogo;
  const isFullyReady = missing.length === 0;

  let headline: string;
  let tone: CompletionGuidance["tone"];

  if (isFullyReady) {
    headline = "🎉 Your team page is fully ready!";
    tone = "ready";
  } else if (!hasName) {
    headline = "🟡 Add your team name";
    tone = "needs-work";
  } else if (!hasLogo) {
    headline = "🟡 Add logo to publish";
    tone = "needs-work";
  } else if (canPublish) {
    headline = "🟢 Ready to publish";
    tone = "almost";
  } else {
    const next = missing[0];
    headline = next ? `🟡 Add ${next.label.toLowerCase()}` : "🟡 Keep building your page";
    tone = "needs-work";
  }

  return {
    headline,
    tone,
    completed,
    nextSteps: missing.slice(0, 4),
    canPublish,
    isFullyReady,
  };
}
