"use client";

import { ShowcaseDayGallery } from "@/components/showcase/showcase-day-gallery";
import type { ShowcaseTeamCard } from "@/lib/showcase/demo-teams";

export function ShowcaseTeamGallery({ teams }: { teams: ShowcaseTeamCard[] }) {
  return (
    <div className="min-h-screen bg-[#f4f3f0]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(251,191,36,0.14),transparent),radial-gradient(ellipse_60%_40%_at_90%_20%,rgba(139,92,246,0.08),transparent)]"
        aria-hidden
      />

      <header className="relative mx-auto max-w-5xl px-6 pb-4 pt-12 text-center sm:pt-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-white/90 px-4 py-1.5 shadow-sm">
          <span className="text-sm" aria-hidden>
            🕐
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-amber-800">
            Ритм дня · 6 структур
          </span>
        </div>
        <h1 className="mt-5 font-[family-name:var(--font-brand)] text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-[2.6rem]">
          Один день — шесть команд
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-zinc-600">
          Утренние сборы, городские кружки, студии и академии — каждая структура живёт в своём часе.
          Живые превью на тех же компонентах, что у родителей.
        </p>
        <p className="mx-auto mt-3 text-[13px] font-medium text-violet-700">
          <a href="https://www.myteamspace.cc/showcase/teams" className="underline underline-offset-2">
            myteamspace.cc/showcase/teams
          </a>
        </p>
      </header>

      <section className="mx-auto max-w-5xl px-6 pb-6">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: "🌅", title: "Утро", text: "Сборы в 06:30 — плавание и утренние турниры" },
            { icon: "☀️", title: "День", text: "Матчи и тренировки — кружки и академии" },
            { icon: "🌇", title: "Вечер", text: "Студии и репетиции после школы" },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/80 bg-white/70 px-4 py-3.5 text-left shadow-sm backdrop-blur-sm"
            >
              <p className="flex items-center gap-2 text-[14px] font-bold text-zinc-900">
                <span aria-hidden>{item.icon}</span>
                {item.title}
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-zinc-500">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-20 pt-4">
        <ShowcaseDayGallery teams={teams} locale="ru" showBuilderSteps />
      </section>
    </div>
  );
}
