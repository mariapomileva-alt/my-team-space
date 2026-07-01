"use client";

import { BuilderPreviewViewport } from "@/components/builder/builder-preview-viewport";
import { MtsTeamLogo } from "@/components/mts/media/mts-media";
import { HERO_VARIANT_META } from "@/lib/blocks/hero-layout";
import { SHOWCASE_PHONE_H } from "@/lib/builder/preview";
import type { ShowcaseTeamCard } from "@/lib/showcase/demo-teams";
import { getTheme } from "@/lib/themes";
import type { BlockInstance, TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";

const BLOCK_ICONS: Record<string, string> = {
  schedule: "📅",
  gallery: "📸",
  contacts: "💬",
  results: "🏆",
  achievements: "⭐",
  payments: "💳",
  polls: "✋",
  countdown: "⏳",
  team_shop: "👕",
  camp_trip: "🚌",
  attendance: "✅",
  integrations: "🔗",
  team_feed: "📰",
  weather: "🌤️",
  sponsors: "🤝",
};

function themePalette(themeId: ShowcaseTeamCard["team"]["themeId"]) {
  const vars = getTheme(themeId).cssVars as Record<string, string>;
  return {
    primary: vars["--mts-primary"] ?? "#6366f1",
    accent: vars["--mts-accent"] ?? "#f472b6",
    pageBg: vars["--mts-page-bg"] ?? "#f4f4f5",
  };
}

function enabledModules(team: TeamSpace) {
  return team.blocks.filter(
    (block) => block.enabled && block.type !== "hero" && block.type !== "announcement_bar",
  );
}

function moduleStrip(blocks: BlockInstance[], limit = 6) {
  return blocks.slice(0, limit).map((block) => ({
    type: block.type,
    icon: BLOCK_ICONS[block.type] ?? "◆",
  }));
}

function ShowcasePhonePreview({ team }: { team: TeamSpace }) {
  return <BuilderPreviewViewport team={team} mode="mobile" phoneHeight={SHOWCASE_PHONE_H} />;
}

function ShowcaseDayClock({
  teams,
  locale,
}: {
  teams: ShowcaseTeamCard[];
  locale: "ru" | "en";
}) {
  return (
    <div className="relative mx-auto max-w-5xl px-2">
      <div
        className="pointer-events-none absolute inset-x-8 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-amber-300/70 to-violet-400/50 sm:block"
        aria-hidden
      />
      <ol className="grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-2">
        {teams.map((card, index) => {
          const palette = themePalette(card.team.themeId);
          const moment = locale === "ru" ? card.day.momentRu : card.day.momentEn;
          return (
            <li
              key={card.team.id}
              className="group relative flex flex-col items-center text-center"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div
                className="relative z-[1] flex h-14 w-14 flex-col items-center justify-center rounded-2xl border border-white/80 bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.2)] ring-1 ring-black/[0.04] transition group-hover:-translate-y-0.5"
                style={{
                  boxShadow: `0 10px 28px -14px color-mix(in srgb, ${palette.primary} 35%, transparent)`,
                }}
              >
                <span className="text-[10px] font-bold tabular-nums tracking-tight text-zinc-900">
                  {card.day.clockTime}
                </span>
                <span className="mt-0.5 text-base leading-none" aria-hidden>
                  {card.structure.icon}
                </span>
              </div>
              <span className="mt-2 text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                {moment}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function ShowcaseStatPill({
  icon,
  value,
  label,
  accent,
}: {
  icon: string;
  value: string;
  label: string;
  accent: string;
}) {
  return (
    <div
      className="flex min-w-0 flex-1 flex-col items-center rounded-2xl border border-white/60 bg-white/90 px-2 py-2.5 text-center shadow-sm ring-1 ring-black/[0.03]"
      style={{ background: `color-mix(in srgb, ${accent} 6%, white)` }}
    >
      <span className="text-sm" aria-hidden>
        {icon}
      </span>
      <span className="mt-0.5 text-sm font-bold tabular-nums text-zinc-900">{value}</span>
      <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-zinc-500">{label}</span>
    </div>
  );
}

function ShowcaseTeamCard({
  card,
  index,
  locale,
  showBuilderSteps,
}: {
  card: ShowcaseTeamCard;
  index: number;
  locale: "ru" | "en";
  showBuilderSteps?: boolean;
}) {
  const palette = themePalette(card.team.themeId);
  const modules = enabledModules(card.team);
  const strip = moduleStrip(modules);
  const sport = locale === "ru" ? card.sportRu : card.sportEn;
  const moment = locale === "ru" ? card.day.momentRu : card.day.momentEn;
  const structureLabel = locale === "ru" ? card.structure.labelRu : card.structure.labelEn;
  const scrollHint =
    locale === "ru" ? "Листай внутри телефона ↓" : "Scroll inside the phone ↓";
  const modulesLabel = locale === "ru" ? "модулей" : "modules";
  const layoutLabel = locale === "ru" ? "шапка" : "header";
  const themeLabel = locale === "ru" ? "тема" : "theme";
  const structureTitle = locale === "ru" ? "Структура" : "Structure";
  const builderTitle = locale === "ru" ? "Как собрать" : "Build it";

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-32px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-zinc-200/70 bg-white shadow-[0_24px_64px_-32px_rgba(15,23,42,0.22)]"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-40 blur-2xl"
        style={{ background: palette.accent }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full opacity-30 blur-2xl"
        style={{ background: palette.primary }}
        aria-hidden
      />

      <div className="relative border-b border-zinc-100/80 px-5 pb-4 pt-5">
        <div className="flex items-start gap-4">
          <div
            className="flex shrink-0 flex-col items-center justify-center rounded-2xl px-3 py-2.5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
            style={{
              background: `linear-gradient(145deg, color-mix(in srgb, ${palette.primary} 12%, white), white)`,
              border: `1px solid color-mix(in srgb, ${palette.primary} 18%, transparent)`,
            }}
          >
            <span className="text-lg leading-none" aria-hidden>
              {card.day.clockIcon}
            </span>
            <span className="mt-1 font-[family-name:var(--font-brand)] text-xl font-bold tabular-nums tracking-tight text-zinc-900">
              {card.day.clockTime}
            </span>
            <span className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.16em] text-zinc-500">
              {moment}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white"
                style={{ background: palette.primary }}
              >
                <span aria-hidden>{card.structure.icon}</span>
                {structureLabel}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
                {sport}
              </span>
            </div>
            <div className="mt-2 flex gap-3">
              <div
                className="shrink-0 rounded-xl p-0.5 ring-2 ring-offset-1"
                style={
                  {
                    "--tw-ring-color": palette.primary,
                    background: palette.pageBg,
                  } as CSSProperties
                }
              >
                <MtsTeamLogo
                  src={card.team.logoUrl}
                  teamName={card.team.name}
                  className="h-11 w-11 mts-media-frame--logo-hero-card"
                />
              </div>
              <div className="min-w-0">
                <h2 className="font-[family-name:var(--font-brand)] text-lg font-bold leading-tight text-zinc-900 sm:text-xl">
                  {card.team.name}
                </h2>
                <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-zinc-500">{card.team.tagline}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <ShowcaseStatPill
            icon="🧩"
            value={String(modules.length)}
            label={modulesLabel}
            accent={palette.primary}
          />
          <ShowcaseStatPill
            icon="◻️"
            value={`#${HERO_VARIANT_META[card.heroLayout].number}`}
            label={layoutLabel}
            accent={palette.accent}
          />
          <ShowcaseStatPill
            icon="🎨"
            value={card.presetLabel.split(" ")[0] ?? card.presetLabel}
            label={themeLabel}
            accent={palette.primary}
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {strip.map((mod) => (
            <span
              key={mod.type}
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-50 text-sm ring-1 ring-zinc-100"
              title={mod.type}
            >
              <span aria-hidden>{mod.icon}</span>
            </span>
          ))}
        </div>
      </div>

      <p className="relative px-5 pt-3 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
        {scrollHint}
      </p>
      <div className="relative flex justify-center px-3 pb-4 pt-1">
        <div
          className="origin-top scale-[0.88] sm:scale-[0.94]"
          style={{
            width: 320,
            filter: `drop-shadow(0 16px 32px color-mix(in srgb, ${palette.primary} 20%, transparent))`,
          }}
        >
          <ShowcasePhonePreview team={card.team} />
        </div>
      </div>

      <div className="relative mt-auto border-t border-zinc-100 bg-zinc-50/60 px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">{structureTitle}</p>
        <p className="mt-1 text-[13px] font-medium text-zinc-700">
          <span className="mr-1.5" aria-hidden>
            {card.structure.icon}
          </span>
          {structureLabel}
          <span className="mx-2 text-zinc-300">·</span>
          <span className="text-zinc-500">{HERO_VARIANT_META[card.heroLayout].label}</span>
        </p>

        {showBuilderSteps ? (
          <div className="mt-3 border-t border-zinc-200/60 pt-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">{builderTitle}</p>
            <ol className="mt-2 space-y-1.5">
              {card.builderSteps.map((step, i) => (
                <li key={step} className="flex gap-2 text-[12px] leading-snug text-zinc-600">
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                      "bg-violet-100 text-violet-700",
                    )}
                  >
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}

export function ShowcaseDayGallery({
  teams,
  locale,
  showBuilderSteps = false,
}: {
  teams: ShowcaseTeamCard[];
  locale: "ru" | "en";
  showBuilderSteps?: boolean;
}) {
  const sorted = [...teams].sort((a, b) => a.day.clockTime.localeCompare(b.day.clockTime));

  return (
    <>
      <ShowcaseDayClock teams={sorted} locale={locale} />
      <div className="mx-auto mt-10 grid max-w-[1500px] gap-8 px-4 sm:px-6 lg:grid-cols-2 xl:grid-cols-3">
        {sorted.map((card, index) => (
          <ShowcaseTeamCard
            key={card.team.id}
            card={card}
            index={index}
            locale={locale}
            showBuilderSteps={showBuilderSteps}
          />
        ))}
      </div>
    </>
  );
}
