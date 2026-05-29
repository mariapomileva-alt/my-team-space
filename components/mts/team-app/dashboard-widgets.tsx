"use client";

import { ResultsBoardTeaser } from "@/components/results/results-board-teaser";
import { DashboardCard, DashboardChevron, DashboardLabel } from "@/components/mts/team-app/dashboard-card";
import { getDashboardData } from "@/lib/blocks/block-dashboard-data";
import type { BlockInstance, BlockLayout, TeamSpace } from "@/lib/types";
import { motion } from "framer-motion";

function RingProgress({ value, size = 52 }: { value: number; size?: number }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg width={size} height={size} className="-rotate-90" aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth="5" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#10b981"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

export function ScheduleDashboardCard({
  team,
  block,
  onOpen,
  index,
  compact,
  featured,
}: {
  team: TeamSpace;
  block: BlockInstance;
  onOpen: () => void;
  index: number;
  compact?: boolean;
  featured?: boolean;
}) {
  const d = getDashboardData(team, block).schedule!;
  const next = d.next ?? d.events[0];
  return (
    <DashboardCard onClick={onOpen} index={index} accent="sky" compact={compact} featured={featured}>
      <DashboardLabel action={<DashboardChevron />}>Schedule</DashboardLabel>
      <p className="text-[15px] font-bold leading-tight text-neutral-900">{next.title}</p>
      <p className="mt-0.5 text-[12px] font-semibold text-sky-600">
        {next.day} · {next.time}
      </p>
      {!compact && d.events.length > 1 ? (
        <ul className="mt-2.5 space-y-1 border-t border-neutral-100 pt-2">
          {d.events.slice(1, 3).map((ev) => (
            <li key={`${ev.title}-${ev.day}`} className="flex justify-between text-[11px] text-neutral-500">
              <span className="truncate pr-2">{ev.title}</span>
              <span className="shrink-0 font-medium text-neutral-400">{ev.day}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-auto pt-2 text-[10px] font-medium text-neutral-400">{d.events.length} this week</p>
    </DashboardCard>
  );
}

export function AttendanceDashboardCard({
  team,
  block,
  onOpen,
  index,
  compact,
  featured,
}: {
  team: TeamSpace;
  block: BlockInstance;
  onOpen: () => void;
  index: number;
  compact?: boolean;
  featured?: boolean;
}) {
  const d = getDashboardData(team, block).attendance!;
  return (
    <DashboardCard onClick={onOpen} index={index} accent="emerald" compact={compact} featured={featured}>
      <DashboardLabel action={<DashboardChevron />}>Attendance</DashboardLabel>
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <RingProgress value={d.weeklyRate} size={compact ? 46 : 52} />
          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-emerald-700">
            {d.weeklyRate}%
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-neutral-900">{d.label}</p>
          <p className="text-[11px] text-neutral-500">Weekly check-in</p>
        </div>
      </div>
      <div className="mt-2.5 flex h-9 items-end justify-between gap-1" aria-hidden>
        {d.weekBars.map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-md bg-emerald-400/85"
            initial={{ height: 4 }}
            animate={{ height: `${Math.max(28, Math.round(h * 0.34))}%` }}
            transition={{ delay: 0.04 * i, duration: 0.35 }}
          />
        ))}
      </div>
    </DashboardCard>
  );
}

export function TripsDashboardCard({
  team,
  block,
  onOpen,
  index,
}: {
  team: TeamSpace;
  block: BlockInstance;
  onOpen: () => void;
  index: number;
}) {
  const d = getDashboardData(team, block).camp_trip!;
  const first = d.items[0];
  return (
    <DashboardCard onClick={onOpen} index={index} accent="amber" compact>
      <DashboardLabel action={<span className="text-base" aria-hidden>🚌</span>}>Trips</DashboardLabel>
      <p className="line-clamp-2 text-[13px] font-bold leading-snug text-neutral-900">{first.title}</p>
      {first.body ? <p className="mt-0.5 line-clamp-2 text-[11px] text-neutral-500">{first.body}</p> : null}
      <div className="mt-2 flex gap-1">
        {d.items.slice(0, 4).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i === 0 ? "bg-amber-400" : "bg-amber-100"}`}
          />
        ))}
      </div>
    </DashboardCard>
  );
}

export function RulesDashboardCard({
  team,
  block,
  onOpen,
  index,
}: {
  team: TeamSpace;
  block: BlockInstance;
  onOpen: () => void;
  index: number;
}) {
  const d = getDashboardData(team, block).documents!;
  return (
    <DashboardCard onClick={onOpen} index={index} accent="neutral" compact>
      <DashboardLabel action={<span className="text-base" aria-hidden>📋</span>}>Rules</DashboardLabel>
      <p className="text-2xl font-bold tabular-nums text-neutral-900">{d.docs.length}</p>
      <p className="text-[11px] font-medium text-neutral-500">documents</p>
      <ul className="mt-2 space-y-1">
        {d.docs.slice(0, 2).map((doc) => (
          <li key={doc.title} className="truncate text-[11px] text-neutral-600">
            · {doc.title}
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}

export function PollDashboardCard({
  team,
  block,
  onOpen,
  index,
}: {
  team: TeamSpace;
  block: BlockInstance;
  onOpen: () => void;
  index: number;
}) {
  const d = getDashboardData(team, block).polls!;
  return (
    <DashboardCard onClick={onOpen} index={index} accent="violet" compact>
      <DashboardLabel action={<span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-[9px] font-bold text-violet-700">Vote</span>}>
        Poll
      </DashboardLabel>
      <p className="line-clamp-3 text-[12px] font-semibold leading-snug text-neutral-800">{d.question}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {d.options.slice(0, 2).map((o) => (
          <span key={o} className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-700 ring-1 ring-violet-100">
            {o}
          </span>
        ))}
      </div>
    </DashboardCard>
  );
}

export function AnnouncementDashboardCard({
  team,
  block,
  onOpen,
  index,
}: {
  team: TeamSpace;
  block: BlockInstance;
  onOpen: () => void;
  index: number;
}) {
  const d = getDashboardData(team, block).team_feed!;
  const post = d.posts[0];
  return (
    <DashboardCard
      onClick={onOpen}
      index={index}
      accent="indigo"
      compact
      className="bg-gradient-to-br from-indigo-600 to-violet-600 !border-indigo-500/20 !ring-indigo-400/20"
    >
      <DashboardLabel action={<span className="text-[9px] font-bold text-white/80">NEW</span>}>
        <span className="text-white/70">News</span>
      </DashboardLabel>
      <p className="line-clamp-2 text-[12px] font-bold leading-snug text-white">{post.title}</p>
      {post.body ? <p className="mt-0.5 line-clamp-2 text-[11px] text-white/75">{post.body}</p> : null}
    </DashboardCard>
  );
}

export function AchievementsRail({
  team,
  block,
  onOpen,
  index,
}: {
  team: TeamSpace;
  block: BlockInstance;
  onOpen: () => void;
  index: number;
}) {
  const d = getDashboardData(team, block).achievements!;
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="col-span-1 sm:col-span-2"
    >
      <div className="mb-2 flex items-center justify-between px-0.5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Cups & achievements</p>
        <button
          type="button"
          onClick={onOpen}
          className="text-[11px] font-semibold text-indigo-600 active:opacity-70"
        >
          See all ›
        </button>
      </div>
      <div className="dashboard-rail -mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1">
        {d.cards.map((c, i) => (
          <button
            key={`${c.title}-${i}`}
            type="button"
            onClick={onOpen}
            className="dashboard-rail-item min-w-[132px] shrink-0 snap-start rounded-2xl border border-amber-100/90 bg-gradient-to-br from-amber-50 to-white p-3 text-left shadow-sm ring-1 ring-amber-100/60 active:scale-[0.98]"
          >
            <span className="text-2xl">{c.icon}</span>
            <p className="mt-1.5 line-clamp-2 text-[12px] font-bold leading-tight text-neutral-900">{c.title}</p>
            {c.player ? <p className="mt-0.5 truncate text-[10px] font-medium text-amber-800/80">{c.player}</p> : null}
          </button>
        ))}
      </div>
    </motion.section>
  );
}

export function GalleryStackCard({
  team,
  block,
  onOpen,
  index,
}: {
  team: TeamSpace;
  block: BlockInstance;
  onOpen: () => void;
  index: number;
}) {
  const d = getDashboardData(team, block).gallery!;
  const imgs = d.images.slice(0, 3);
  const placeholders = [
    "from-rose-200 to-orange-100",
    "from-sky-200 to-indigo-100",
    "from-violet-200 to-fuchsia-100",
  ];

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="group col-span-1 flex w-full items-stretch gap-3 rounded-[1.35rem] border border-neutral-200/90 bg-white p-3.5 text-left shadow-[0_4px_20px_-12px_rgba(15,23,42,0.14)] ring-1 ring-neutral-100/80 sm:col-span-2"
    >
      <div className="relative h-[88px] w-[100px] shrink-0">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`absolute inset-0 overflow-hidden rounded-xl border-2 border-white shadow-md bg-gradient-to-br ${placeholders[i]}`}
            style={{
              transform: `rotate(${i === 0 ? -6 : i === 1 ? 4 : 0}deg) translate(${i * 6}px, ${i * 3}px)`,
              zIndex: 3 - i,
            }}
          >
            {imgs[i] ? (
              <img src={imgs[i]} alt="" className="h-full w-full object-cover" />
            ) : null}
          </motion.div>
        ))}
        {d.albumMode ? (
          <span className="absolute bottom-1 right-0 z-10 rounded-full bg-white/95 px-1.5 py-0.5 text-[9px] font-bold text-rose-600 shadow">
            Album
          </span>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Team gallery</p>
        <p className="mt-0.5 text-[15px] font-bold text-neutral-900">
          {imgs.length ? `${imgs.length}+ photos` : "Photo memories"}
        </p>
        <p className="mt-0.5 text-[12px] text-neutral-500">Tap to browse trainings & events</p>
        <span className="mt-2 text-[11px] font-semibold text-indigo-600">Open gallery ›</span>
      </div>
    </motion.button>
  );
}

export function ResultsRail({
  team,
  block,
  onOpen,
  index,
  layout,
}: {
  team: TeamSpace;
  block: BlockInstance;
  onOpen: () => void;
  index: number;
  layout?: BlockLayout;
}) {
  return (
    <ResultsBoardTeaser
      team={team}
      block={block}
      onOpen={onOpen}
      index={index}
      layout={layout}
    />
  );
}

export function CompactStatCard({
  team,
  block,
  onOpen,
  index,
  compact = true,
  featured,
}: {
  team: TeamSpace;
  block: BlockInstance;
  onOpen: () => void;
  index: number;
  compact?: boolean;
  featured?: boolean;
}) {
  const data = getDashboardData(team, block);
  let emoji = "✨";
  let label = "More";
  let stat = "—";
  let sub = "Tap to open";

  if (data.calendar) {
    emoji = "🗓️";
    label = "Calendar";
    stat = data.calendar.externalUrl ? "Live" : "Season";
    sub = data.calendar.externalUrl ? "Linked" : "Full view";
  } else if (data.contacts) {
    emoji = "👋";
    label = "Contacts";
    stat = String(data.contacts.items.length);
    sub = data.contacts.items[0]?.name ?? "Coaches";
  } else if (data.quick_links) {
    emoji = "🔗";
    label = "Social";
    stat = String(data.quick_links.labels.length);
    sub = data.quick_links.labels.join(" · ");
  } else if (data.weather) {
    emoji = "🌤️";
    label = "Venue";
    stat = data.weather.temp ?? "—";
    sub = data.weather.note ?? data.weather.location ?? "";
  } else if (data.countdown) {
    emoji = "⏱️";
    label = "Countdown";
    stat = data.countdown.parts ? `${data.countdown.parts.days}d` : "Soon";
    sub = data.countdown.label;
  } else if (data.birthdays) {
    emoji = "🎂";
    label = "Birthdays";
    stat = String(data.birthdays.items.length);
    sub = data.birthdays.items[0]?.name ?? "";
  } else if (data.sponsors) {
    emoji = "🤝";
    label = "Partners";
    stat = String(data.sponsors.names.length);
    sub = data.sponsors.names[0] ?? "";
  }

  return (
    <DashboardCard onClick={onOpen} index={index} compact={compact} featured={featured}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-xl" aria-hidden>
          {emoji}
        </span>
        <DashboardChevron />
      </div>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">{label}</p>
      <p className="text-xl font-bold tabular-nums text-neutral-900">{stat}</p>
      <p className="line-clamp-2 text-[10px] text-neutral-500">{sub}</p>
    </DashboardCard>
  );
}
