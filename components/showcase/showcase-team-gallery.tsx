"use client";

import { BuilderPreviewViewport } from "@/components/builder/builder-preview-viewport";
import { MtsTeamLogo } from "@/components/mts/media/mts-media";
import { HERO_VARIANT_META } from "@/lib/blocks/hero-layout";
import type { ShowcaseTeamCard } from "@/lib/showcase/demo-teams";
import { getTheme } from "@/lib/themes";
import { cn } from "@/lib/utils/cn";
import type { TeamSpace } from "@/lib/types";
import { SHOWCASE_PHONE_H } from "@/lib/builder/preview";
import type { CSSProperties } from "react";

function ShowcasePhonePreview({ team }: { team: TeamSpace }) {
  return (
    <BuilderPreviewViewport
      team={team}
      mode="mobile"
      phoneHeight={SHOWCASE_PHONE_H}
    />
  );
}

function themePalette(themeId: ShowcaseTeamCard["team"]["themeId"]) {
  const vars = getTheme(themeId).cssVars as Record<string, string>;
  return {
    primary: vars["--mts-primary"] ?? "#6366f1",
    accent: vars["--mts-accent"] ?? "#f472b6",
    pageBg: vars["--mts-page-bg"] ?? "#f4f4f5",
  };
}

function ShowcaseThemeSwatches({
  primary,
  accent,
  label,
}: {
  primary: string;
  accent: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex gap-1" aria-hidden>
        <span
          className="h-4 w-4 rounded-full border border-black/10 shadow-sm"
          style={{ background: primary }}
          title="Primary"
        />
        <span
          className="h-4 w-4 rounded-full border border-black/10 shadow-sm"
          style={{ background: accent }}
          title="Accent"
        />
      </span>
      <span className="text-[10px] font-semibold text-zinc-600">{label}</span>
    </div>
  );
}

export function ShowcaseTeamGallery({ teams }: { teams: ShowcaseTeamCard[] }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-zinc-200/80">
      <header className="mx-auto max-w-6xl px-6 py-12 text-center">
        <span className="inline-block rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
          MyTeamSpace Constructor
        </span>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
          6 команд — как в конструкторе
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-zinc-600">
          Живые превью на тех же компонентах, что у родителей: 6 hero-layout, editorial-секции ниже шапки
          (расписание, галерея, контакты). В каждом телефоне — листай вниз.
        </p>
        <p className="mx-auto mt-2 text-[13px] font-medium text-violet-700">
          <a href="https://www.myteamspace.cc/showcase/teams" className="underline underline-offset-2">
            myteamspace.cc/showcase/teams
          </a>
        </p>
      </header>

      <div className="mx-auto grid max-w-[1500px] gap-12 px-4 pb-20 sm:px-6 lg:grid-cols-2 xl:grid-cols-3">
        {teams.map((card) => {
          const palette = themePalette(card.team.themeId);
          return (
            <article
              key={card.team.id}
              className="flex flex-col rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.2)]"
              style={{
                background: `linear-gradient(180deg, #ffffff 0%, color-mix(in srgb, ${palette.primary} 4%, white) 100%)`,
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
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-violet-600">
                    {card.sportRu}
                  </p>
                  <h2 className="mt-0.5 text-lg font-bold text-zinc-900">{card.team.name}</h2>
                  <p className="mt-0.5 text-sm text-zinc-500">{card.team.tagline}</p>
                  <div className="mt-2.5">
                    <ShowcaseThemeSwatches
                      primary={palette.primary}
                      accent={palette.accent}
                      label={card.presetLabel}
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-indigo-800">
                      Hero: {HERO_VARIANT_META[card.heroLayout].label}
                    </span>
                  </div>
                </div>
              </div>

              <p className="mb-2 text-center text-[11px] font-semibold text-zinc-500">
                Превью страницы — листай внутри телефона
              </p>
              <div className="flex justify-center">
                <div
                  className="origin-top scale-[0.92] sm:scale-100"
                  style={{
                    width: 320,
                    filter: `drop-shadow(0 12px 28px color-mix(in srgb, ${palette.primary} 18%, transparent))`,
                  }}
                >
                  <ShowcasePhonePreview team={card.team} />
                </div>
              </div>

              <div className="mt-4 border-t border-zinc-100 pt-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                  Как собрать в builder
                </p>
                <ol className="mt-2 space-y-1">
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
            </article>
          );
        })}
      </div>
    </div>
  );
}
