"use client";

import { BuilderPreviewViewport } from "@/components/builder/builder-preview-viewport";
import { MtsTeamLogo } from "@/components/mts/media/mts-media";
import { HERO_VARIANT_META } from "@/lib/blocks/hero-layout";
import { SHOWCASE_PHONE_H } from "@/lib/builder/preview";
import type { ShowcaseTeamCard } from "@/lib/showcase/demo-teams";
import { getTheme } from "@/lib/themes";
import type { TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";

const SPORT_LABELS: Record<string, string> = {
  "Танцевальная секция": "Dance studio",
  "Баскетбольный кружок": "Basketball club",
  "Хоккейная команда": "Hockey team",
  "Плавательная команда": "Swim club",
  "Балетная студия": "Ballet studio",
  "Теннисная академия": "Tennis academy",
};

const BLOCK_LABELS: Record<string, string> = {
  schedule: "Schedule",
  gallery: "Gallery",
  contacts: "Contacts",
  results: "Results",
  achievements: "Achievements",
  payments: "Payments",
  polls: "Polls",
  countdown: "Countdown",
  team_shop: "Shop",
  camp_trip: "Trips",
  attendance: "Attendance",
  integrations: "Links",
  announcement_bar: "Updates",
  team_feed: "Feed",
  weather: "Weather",
  sponsors: "Sponsors",
};

function themePalette(themeId: ShowcaseTeamCard["team"]["themeId"]) {
  const vars = getTheme(themeId).cssVars as Record<string, string>;
  return {
    primary: vars["--mts-primary"] ?? "#6366f1",
    accent: vars["--mts-accent"] ?? "#f472b6",
    pageBg: vars["--mts-page-bg"] ?? "#f4f4f5",
  };
}

function pageBlockTags(team: TeamSpace) {
  return team.blocks
    .filter((block) => block.enabled && block.type !== "hero" && block.type !== "announcement_bar")
    .slice(0, 5)
    .map((block) => BLOCK_LABELS[block.type] ?? block.type);
}

function ExamplePhonePreview({ team }: { team: TeamSpace }) {
  return <BuilderPreviewViewport team={team} mode="mobile" phoneHeight={SHOWCASE_PHONE_H} />;
}

export function TeamExamplesGallery({ teams }: { teams: ShowcaseTeamCard[] }) {
  return (
    <div className="mx-auto grid max-w-[1500px] gap-8 px-6 pb-20 sm:px-8 lg:grid-cols-2 xl:grid-cols-3">
      {teams.map((card, index) => {
        const palette = themePalette(card.team.themeId);
        const sport = SPORT_LABELS[card.sportRu] ?? card.sportRu;
        const tags = pageBlockTags(card.team);

        return (
          <motion.article
            key={card.team.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-24px" }}
            transition={{ duration: 0.45, delay: index * 0.04 }}
            className="flex flex-col rounded-3xl border border-neutral-100 bg-white p-5 shadow-[0_16px_48px_-24px_rgba(15,23,42,0.12)]"
            style={{
              background: `linear-gradient(180deg, #ffffff 0%, color-mix(in srgb, ${palette.primary} 3%, white) 100%)`,
            }}
          >
            <div className="mb-4 flex gap-3">
              <div
                className="shrink-0 rounded-2xl p-1 ring-2 ring-offset-2"
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
                  className="h-14 w-14 mts-media-frame--logo-hero-card"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6C5CE7]">{sport}</p>
                <h2 className="mt-0.5 text-lg font-bold text-[#1A1C23]">{card.team.name}</h2>
                <p className="mt-0.5 text-sm text-neutral-500">{card.team.tagline}</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[10px] font-semibold text-violet-800 ring-1 ring-violet-100">
                    {HERO_VARIANT_META[card.heroLayout].label}
                  </span>
                  <span className="rounded-full bg-neutral-50 px-2.5 py-0.5 text-[10px] font-semibold text-neutral-600 ring-1 ring-neutral-100">
                    {card.presetLabel}
                  </span>
                </div>
              </div>
            </div>

            <p className="mb-2 text-center text-[11px] font-medium text-neutral-400">
              Scroll inside — real page, real blocks
            </p>
            <div className="flex justify-center">
              <div
                className="origin-top scale-[0.9] sm:scale-95"
                style={{
                  width: 320,
                  filter: `drop-shadow(0 12px 28px color-mix(in srgb, ${palette.primary} 14%, transparent))`,
                }}
              >
                <ExamplePhonePreview team={card.team} />
              </div>
            </div>

            <div className="mt-4 border-t border-neutral-100 pt-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">On this page</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      "rounded-full bg-neutral-50 px-2.5 py-1 text-[11px] font-medium text-neutral-600 ring-1 ring-neutral-100",
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
