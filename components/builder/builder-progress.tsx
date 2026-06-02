"use client";

import type { BlockInstance, TeamSpace } from "@/lib/types";
import { getBlockSettings, type SocialKey } from "@/lib/blocks/settings";
import { cn } from "@/lib/utils/cn";

export type BuilderProgressTarget =
  | "identity"
  | "cover"
  | "schedule"
  | "contacts"
  | "gallery"
  | "social"
  | "results";

type Item = {
  id: BuilderProgressTarget;
  emoji: string;
  label: string;
  done: boolean;
  weight: number;
};

function pct(done: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((done / total) * 100);
}

function clampPct(v: number) {
  return Math.max(0, Math.min(100, v));
}

type HeroSettings = {
  quote: string;
  description?: string;
  city: string;
  coverImageUrl: string;
  teamPhotoUrl?: string;
  social: Partial<Record<SocialKey, string>>;
};

function completionItems(team: TeamSpace): Item[] {
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
  const hasScheduleContent = Boolean(
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

  const socialDone = Boolean(Object.values(hs?.social ?? {}).some((v) => Boolean(v?.trim())));

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
    // Base identity should feel like meaningful progress
    { id: "identity", emoji: "🏷️", label: "Team name", done: hasName, weight: 22 },
    { id: "identity", emoji: "🖼️", label: "Logo", done: hasLogo, weight: 18 },
    // Optional but high-impact for polish
    { id: "cover", emoji: "🖼️", label: "Cover image", done: hasCover, weight: 10 },
    // Main blocks that make the page useful
    { id: "schedule", emoji: "📅", label: "Schedule", done: hasScheduleContent, weight: 16 },
    { id: "contacts", emoji: "📞", label: "Contacts", done: hasContacts, weight: 12 },
    { id: "gallery", emoji: "📸", label: "Gallery", done: hasGallery, weight: 10 },
    { id: "results", emoji: "🏆", label: "Results", done: hasResults, weight: 8 },
    // Nice-to-have finishing touch
    { id: "social", emoji: "🔗", label: "Social links", done: socialDone, weight: 4 },
  ];
}

function completionPercent(team: TeamSpace) {
  const items = completionItems(team);
  const total = items.reduce((sum, i) => sum + i.weight, 0);
  const done = items.reduce((sum, i) => sum + (i.done ? i.weight : 0), 0);
  return { percent: clampPct(pct(done, total)), items, done, total };
}

export function BuilderProgress({
  team,
  onJump,
  className,
}: {
  team: TeamSpace;
  onJump: (target: BuilderProgressTarget) => void;
  className?: string;
}) {
  const { items, percent } = completionPercent(team);
  const missing = items.filter((i) => !i.done);
  const nextUp = missing[0];

  const tone =
    percent === 100 ? "bg-emerald-600" : percent >= 30 ? "bg-indigo-600" : "bg-amber-500";

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-bold text-zinc-900">
            {percent === 100 ? "🎉 Your team page is fully ready!" : `Team Page Progress — ${percent}%`}
          </p>
          {percent < 30 ? (
            <p className="mt-0.5 text-[11px] font-medium text-amber-700">
              Your page is still missing a few important details.
            </p>
          ) : nextUp ? (
            <p className="mt-0.5 text-[11px] text-zinc-500">
              Next:{" "}
              <button
                type="button"
                onClick={() => onJump(nextUp.id)}
                className="font-semibold text-indigo-700 hover:underline"
              >
                {nextUp.label}
              </button>
            </p>
          ) : null}
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset",
            percent === 100
              ? "bg-emerald-50 text-emerald-700 ring-emerald-200/70"
              : percent >= 30
                ? "bg-indigo-50 text-indigo-700 ring-indigo-200/70"
                : "bg-amber-50 text-amber-800 ring-amber-200/70",
          )}
        >
          {percent === 100 ? "Ready" : "In progress"}
        </span>
      </div>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-200/70 ring-1 ring-inset ring-zinc-300/40">
        <div className={cn("h-full rounded-full transition-all duration-300", tone)} style={{ width: `${percent}%` }} />
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((it) => {
          const icon = it.done ? "✓" : "•";
          const isNext = nextUp?.label === it.label && !it.done;
          return (
            <button
              key={it.label}
              type="button"
              onClick={() => onJump(it.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ring-1 ring-inset",
                it.done
                  ? "bg-white/70 text-zinc-600 ring-zinc-200/70 hover:bg-white hover:text-zinc-900"
                  : "bg-rose-50/70 text-rose-800 ring-rose-200/70 hover:bg-rose-50",
                isNext && "shadow-[0_0_0_3px_rgba(99,102,241,0.12)] ring-indigo-200/80",
              )}
              title={it.done ? "Looks good" : "Click to jump"}
            >
              <span className="text-[12px]" aria-hidden>
                {it.emoji}
              </span>
              <span className={cn("text-[10px] font-bold", it.done ? "text-emerald-600" : "text-rose-700")} aria-hidden>
                {icon}
              </span>
              {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function builderCompletionPercent(team: TeamSpace) {
  return completionPercent(team).percent;
}

