"use client";

import type { SeasonTimelineEvent, SeasonTimelineMonth } from "@/lib/blocks/results-board";
import { mtsTypeTitleLg, mtsTypeTitleMd } from "@/lib/typography";
import { cn } from "@/lib/utils/cn";

function eventTone(kind: SeasonTimelineEvent["kind"]): string {
  switch (kind) {
    case "season_start":
      return "border-violet-200/80 bg-gradient-to-r from-violet-50/90 to-white";
    case "competition":
      return "border-zinc-200/90 bg-white shadow-[0_4px_24px_-16px_rgba(15,23,42,0.08)]";
    case "medal":
      return "border-amber-100/90 bg-amber-50/40";
    case "personal_best":
      return "border-indigo-100/90 bg-indigo-50/35";
    case "rank_up":
      return "border-emerald-100/90 bg-emerald-50/35";
    default:
      return "border-zinc-100 bg-white";
  }
}

function TimelineEventLine({ event }: { event: SeasonTimelineEvent }) {
  const isComp = event.kind === "competition";
  return (
    <li
      className={`results-timeline-event relative rounded-2xl border px-3.5 py-2.5 ${eventTone(event.kind)} ${
        isComp ? "font-semibold text-zinc-900" : "text-[13px] leading-snug text-zinc-700"
      }`}
    >
      <p>{event.story}</p>
      {event.competitionName && event.kind !== "competition" ? (
        <p className="mt-0.5 text-[10px] font-medium text-zinc-400">{event.competitionName}</p>
      ) : null}
    </li>
  );
}

export function SeasonTimelineSection({
  months,
  title,
  seasonName,
}: {
  months: SeasonTimelineMonth[];
  title: string;
  seasonName: string;
}) {
  if (months.length === 0) {
    return (
      <section className="results-timeline rounded-[1.75rem] border border-dashed border-zinc-200 bg-zinc-50/60 px-4 py-10 text-center">
        <p className="text-2xl">📖</p>
        <p className="mt-2 text-sm font-semibold text-zinc-700">Season memories will grow here</p>
        <p className="mt-1 text-[12px] text-zinc-500">Each competition adds a new chapter to your team story.</p>
      </section>
    );
  }

  return (
    <section className="results-timeline relative overflow-hidden rounded-[1.75rem] border border-zinc-100/90 bg-gradient-to-b from-[#faf9f7] via-white to-violet-50/20 px-4 py-6 sm:px-6 sm:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_0%_0%,rgba(139,92,246,0.06),transparent_55%)]" aria-hidden />

      <header className="relative mb-6 text-center sm:mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-700/70">{seasonName}</p>
        <h4 className={cn("mt-2", mtsTypeTitleLg)}>{title}</h4>
        <p className="mx-auto mt-2 max-w-xs text-[12px] leading-relaxed text-zinc-500">
          A story of competitions, medals, and moments that matter.
        </p>
      </header>

      <div className="relative space-y-8">
        {months.map((month) => (
          <article key={month.monthKey}>
            <h5 className={cn("results-timeline-month mb-3", mtsTypeTitleMd)}>
              {month.label}
            </h5>
            <ol className="results-timeline-list relative space-y-2 border-l border-zinc-200/90 pl-4 sm:pl-5">
              {month.events.map((event) => (
                <TimelineEventLine key={event.id} event={event} />
              ))}
            </ol>
          </article>
        ))}
      </div>
    </section>
  );
}
