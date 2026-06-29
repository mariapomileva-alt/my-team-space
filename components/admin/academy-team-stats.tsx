import { BuilderSectionIcon } from "@/components/builder/builder-section-icon";
import type { AcademyTeamSummary } from "@/lib/admin/load-academy-team-summaries";

export function AcademyTeamStats({ summary }: { summary: AcademyTeamSummary }) {
  const items = [
    { label: "Members", value: summary.memberCount, icon: "users" as const },
    { label: "Events", value: summary.upcomingEventCount, icon: "calendar" as const },
    { label: "Ready", value: `${summary.completionPercent}%`, icon: "layout-panel" as const },
  ];

  return (
    <dl className="mt-4 grid grid-cols-3 gap-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl bg-zinc-50 px-2.5 py-2 ring-1 ring-zinc-100">
          <dt className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
            <BuilderSectionIcon icon={item.icon} size="xs" className="opacity-70" />
            {item.label}
          </dt>
          <dd className="mt-0.5 text-sm font-bold text-zinc-900">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
