"use client";

import {
  BUILDER_SECTION_LABELS,
  BUILDER_SECTION_ORDER,
  getCoachHelpBlocksBySection,
  getCoachHelpSections,
  getCoachHelpTools,
  type CoachHelpBlockGuide,
  type CoachHelpSection,
} from "@/lib/builder/coach-help-content";
import { cn } from "@/lib/utils/cn";

function OverviewList({ sections }: { sections: CoachHelpSection[] }) {
  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div key={section.id} className="rounded-2xl border border-violet-100/80 bg-violet-50/30 px-4 py-3">
          <p className="text-[14px] font-semibold text-zinc-900">
            <span className="mr-1.5" aria-hidden>
              {section.emoji}
            </span>
            {section.title}
          </p>
          <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-zinc-600">
            {section.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet-400" aria-hidden />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function BlockGuideCard({ block, compact }: { block: CoachHelpBlockGuide; compact?: boolean }) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-zinc-100 bg-white px-3.5 py-3 shadow-[0_1px_12px_-6px_rgba(15,23,42,0.08)]",
        compact && "py-2.5",
      )}
    >
      <div className="flex items-start gap-2.5">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-50 text-lg"
          aria-hidden
        >
          {block.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[13px] font-semibold text-zinc-900">{block.title}</h3>
          <p className="mt-0.5 text-[12px] leading-relaxed text-zinc-500">{block.howItWorks}</p>
        </div>
      </div>
    </article>
  );
}

export function BuilderGuideContent({
  isAcademy = false,
  className,
}: {
  isAcademy?: boolean;
  className?: string;
}) {
  const overview = getCoachHelpSections({ isAcademy });

  const blocksBySection = getCoachHelpBlocksBySection();
  const tools = getCoachHelpTools();

  return (
    <div className={cn("space-y-8", className)}>
      <OverviewList sections={overview} />

      <section>
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">Coach tools</h3>
        <p className="mt-1 text-[13px] text-zinc-500">Built into the builder — not shown on the public page unless noted.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {tools.map((tool) => (
            <BlockGuideCard key={tool.id} block={tool} />
          ))}
        </div>
      </section>

      {BUILDER_SECTION_ORDER.map((section) => {
        const blocks = blocksBySection[section];
        const label = BUILDER_SECTION_LABELS[section];
        return (
          <section key={section}>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
              {label.title} blocks
            </h3>
            <p className="mt-1 text-[13px] text-zinc-500">{label.hint}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {blocks.map((block) => (
                <BlockGuideCard key={block.id} block={block} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
