"use client";

import { PaymentLinkCard } from "@/components/blocks/payment-link-card";
import { QuickActionsGrid } from "@/components/blocks/quick-actions-grid";
import { TeamShopGrid } from "@/components/blocks/team-shop-grid";
import { ResultsBoardTeaser } from "@/components/results/results-board-teaser";
import { DashboardCard, DashboardChevron, DashboardLabel, dashboardTileMeta, dashboardTileStatClass, dashboardTileTitle } from "@/components/mts/team-app/dashboard-card";
import { getDashboardData } from "@/lib/blocks/block-dashboard-data";
import {
  getBlockSettings,
  type PaymentLinkSettings,
  type QuickActionsSettings,
  type TeamShopSettings,
} from "@/lib/blocks/settings";
import { quickActionEmoji, type QuickActionIconId } from "@/lib/quick-actions/icons";
import { mtsTypeTitleSm } from "@/lib/typography";
import type { BlockInstance, BlockLayout, TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
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
  if (!next) return null;
  const metaLine = [next.day, next.time].filter(Boolean).join(" · ");
  return (
    <DashboardCard onClick={onOpen} index={index} accent="sky" compact={compact} featured={featured}>
      <DashboardLabel action={<DashboardChevron />}>Schedule</DashboardLabel>
      <p className={compact ? dashboardTileTitle : cn(mtsTypeTitleSm, "min-w-0 line-clamp-2 break-words")}>
        {next.title}
      </p>
      <p className={cn("mt-0.5 font-semibold text-sky-600", compact ? dashboardTileMeta : "text-[12px]")}>
        {metaLine}
      </p>
      {next.location ? <p className={cn(dashboardTileMeta, "mt-0.5")}>{next.location}</p> : null}
      {!compact && d.events.length > 1 ? (
        <ul className="mt-2.5 space-y-1 border-t border-[color:var(--mts-card-border)] pt-2">
          {d.events.slice(1, 3).map((ev) => (
            <li key={`${ev.title}-${ev.day}`} className="flex justify-between text-[11px] text-[color:var(--mts-muted)]">
              <span className="truncate pr-2">{ev.title}</span>
              <span className="shrink-0 font-medium text-[color:var(--mts-muted)]">{ev.day}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-auto pt-2 text-[10px] font-medium text-[color:var(--mts-muted)]">{d.events.length} this week</p>
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
        {d.weeklyRate > 0 ? (
          <div className="relative shrink-0">
            <RingProgress value={d.weeklyRate} size={compact ? 46 : 52} />
            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-emerald-700">
              {d.weeklyRate}%
            </span>
          </div>
        ) : (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg" aria-hidden>
            ✅
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className={compact ? dashboardTileTitle : "text-[13px] font-bold text-[color:var(--mts-text)]"}>
            {d.label}
          </p>
          <p className={dashboardTileMeta}>
            {d.weeklyRate > 0 ? "Weekly check-in" : "Team roster"}
          </p>
        </div>
      </div>
      {d.weekBars.length > 0 ? (
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
      ) : null}
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
      <p className={dashboardTileTitle}>{first.title}</p>
      {first.body ? <p className={cn(dashboardTileMeta, "mt-0.5")}>{first.body}</p> : null}
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
      <p className="text-2xl font-bold tabular-nums text-[color:var(--mts-text)]">{d.docs.length}</p>
      <p className="text-[11px] font-medium text-[color:var(--mts-muted)]">documents</p>
      <ul className="mt-2 space-y-1">
        {d.docs.slice(0, 2).map((doc) => (
          <li key={doc.title} className="truncate text-[11px] text-[color:var(--mts-muted)]">
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
      <p className="line-clamp-3 break-words text-[12px] font-semibold leading-snug [overflow-wrap:anywhere] text-[color:var(--mts-text)]">
        {d.question}
      </p>
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
        <p className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--mts-muted)]">Cups & achievements</p>
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
            className="dashboard-rail-item shrink-0 snap-start rounded-2xl border border-amber-100/90 bg-gradient-to-br from-amber-50 to-white p-3 text-left shadow-sm ring-1 ring-amber-100/60 active:scale-[0.98]"
          >
            <span className="text-2xl">{c.icon}</span>
            <p className={cn(dashboardTileTitle, "mt-1.5")}>{c.title}</p>
            {c.player ? <p className={cn(dashboardTileMeta, "mt-0.5 text-amber-800/80")}>{c.player}</p> : null}
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
      className="mts-app-surface mts-app-surface--interactive group col-span-1 flex w-full items-stretch gap-3 rounded-[1.35rem] p-3.5 text-left sm:col-span-2"
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
        <p className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--mts-muted)]">Team gallery</p>
        <p className="mt-0.5 text-[15px] font-bold leading-snug text-[color:var(--mts-text)]">
          {imgs.length ? `${imgs.length}+ photos` : "Photo memories"}
        </p>
        <p className={cn(dashboardTileMeta, "mt-0.5")}>Tap to browse trainings & events</p>
        <span className="mt-2 text-[11px] font-semibold text-[color:var(--mts-primary)]">Open gallery ›</span>
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

export function PaymentDashboardCard({
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
  const s = getBlockSettings<PaymentLinkSettings>(block);
  const d = getDashboardData(team, block).payments!;

  if (featured) {
    return (
      <PaymentLinkCard
        title={s.title}
        description={s.description}
        buttonLabel={s.buttonLabel}
        paymentUrl={s.paymentUrl}
        variant="featured"
      />
    );
  }

  return (
    <DashboardCard onClick={onOpen} index={index} accent="sky" compact={compact ?? true} featured={featured}>
      <DashboardLabel action={<DashboardChevron />}>Payments</DashboardLabel>
      {compact !== false ? (
        <>
          <p className={dashboardTileTitle}>{d.title}</p>
          {d.description ? (
            <p className={cn(dashboardTileMeta, "mt-1")}>{d.description}</p>
          ) : (
            <p className={cn(dashboardTileMeta, "mt-1")}>
              {d.hasUrl ? d.buttonLabel : "Add payment link"}
            </p>
          )}
        </>
      ) : (
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-lg">
            💳
          </span>
          <div className="min-w-0 flex-1">
            <p className={cn(mtsTypeTitleSm, "min-w-0 line-clamp-2 break-words")}>{d.title}</p>
            {d.description ? (
              <p className={cn(dashboardTileMeta, "mt-0.5")}>{d.description}</p>
            ) : (
              <p className={cn(dashboardTileMeta, "mt-0.5")}>
                {d.hasUrl ? d.buttonLabel : "Add payment link"}
              </p>
            )}
          </div>
        </div>
      )}
      <p className="mt-auto truncate pt-2 text-[11px] font-semibold text-sky-600">
        {d.hasUrl ? `${d.buttonLabel} ›` : "Set up in builder ›"}
      </p>
    </DashboardCard>
  );
}

export function QuickActionsDashboardCard({
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
  const s = getBlockSettings<QuickActionsSettings>(block);
  const d = getDashboardData(team, block).quick_actions!;
  const showInlineGrid = featured || !compact;

  if (showInlineGrid && (s.actions?.length ?? 0) > 0) {
    return (
      <div className="space-y-2.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--mts-muted)]">{d.title}</p>
        <QuickActionsGrid actions={s.actions ?? []} compact={compact && !featured} />
      </div>
    );
  }

  return (
    <DashboardCard onClick={onOpen} index={index} accent="amber" compact={compact} featured={featured}>
      <DashboardLabel action={<DashboardChevron />}>{d.title}</DashboardLabel>
      {d.previews.length > 0 ? (
        <div className="mt-1 grid grid-cols-2 gap-2">
          {d.previews.map((p) => (
            <div
              key={`${p.title}-${p.icon}`}
              className="flex items-center gap-1.5 rounded-xl bg-amber-50/80 px-2 py-1.5"
            >
              <span className="text-base" aria-hidden>
                {quickActionEmoji(p.icon as QuickActionIconId)}
              </span>
              <span className="line-clamp-1 text-[11px] font-semibold text-[color:var(--mts-text)]">{p.title}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[13px] text-[color:var(--mts-muted)]">Add WhatsApp, registration, and map links</p>
      )}
      <p className="mt-auto pt-2 text-[10px] font-medium text-[color:var(--mts-muted)]">
        {d.count > 0 ? `${d.count} action${d.count === 1 ? "" : "s"}` : "Tap to set up"}
      </p>
    </DashboardCard>
  );
}

export function TeamShopDashboardCard({
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
  const s = getBlockSettings<TeamShopSettings>(block);
  const d = getDashboardData(team, block).team_shop!;
  const showInline = featured || !compact;

  if (showInline && (s.products?.length ?? 0) > 0) {
    return (
      <div className="space-y-2.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--mts-muted)]">{d.title}</p>
        <TeamShopGrid products={s.products ?? []} compact />
      </div>
    );
  }

  return (
    <DashboardCard onClick={onOpen} index={index} accent="rose" compact={compact} featured={featured}>
      <DashboardLabel action={<DashboardChevron />}>{d.title}</DashboardLabel>
      {d.previews.length > 0 ? (
        <div className="mt-2 flex gap-2 overflow-hidden">
          {d.previews.map((p) => (
            <div
              key={p.name}
              className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-rose-50 ring-1 ring-rose-100"
            >
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg">🛍</div>
              )}
            </div>
          ))}
          <div className="min-w-0 flex-1">
            <p className="line-clamp-1 text-[13px] font-bold text-[color:var(--mts-text)]">{d.previews[0]?.name}</p>
            {d.previews[0]?.price ? (
              <p className="text-[12px] font-semibold text-rose-600">{d.previews[0].price}</p>
            ) : null}
            <p className="text-[10px] text-[color:var(--mts-muted)]">{d.count} product{d.count === 1 ? "" : "s"}</p>
          </div>
        </div>
      ) : (
        <p className="text-[13px] text-[color:var(--mts-muted)]">Add uniforms, merch, and equipment</p>
      )}
    </DashboardCard>
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
  let label = "More";
  let stat = "—";
  let sub = "Tap to open";

  if (data.calendar) {
    label = "Calendar";
    stat = data.calendar.externalUrl ? "Live" : "Season";
    sub = data.calendar.externalUrl ? "Linked calendar" : "Full season view";
  } else if (data.contacts) {
    label = "Contacts";
    stat = data.contacts.items[0]?.name ?? "Coaches";
    sub = data.contacts.items[0]?.role ?? `${data.contacts.items.length} contacts`;
  } else if (data.integrations) {
    label = data.integrations.title;
    stat = data.integrations.previews[0]?.label ?? "Links";
    sub = data.integrations.previews[0]?.host ?? "Training & media";
  } else if (data.quick_links) {
    label = "Social";
    stat = String(data.quick_links.labels.length);
    sub = data.quick_links.labels.join(" · ");
  } else if (data.payments) {
    label = "Payments";
    stat = data.payments.hasUrl ? "Ready" : "—";
    sub = data.payments.title;
  } else if (data.quick_actions) {
    label = "Actions";
    stat = String(data.quick_actions.count);
    sub = data.quick_actions.previews[0]?.title ?? "Links & registration";
  } else if (data.team_shop) {
    label = "Team shop";
    stat = String(data.team_shop.count);
    sub = data.team_shop.previews[0]?.name ?? "Merch & uniforms";
  } else if (data.weather) {
    label = "Venue";
    stat = data.weather.temp?.replace(/\s+/g, "") ?? "—";
    sub = [data.weather.note, data.weather.location].filter(Boolean).join(" · ");
  } else if (data.countdown) {
    label = "Countdown";
    stat = data.countdown.parts ? `${data.countdown.parts.days}d` : "Soon";
    sub = data.countdown.label;
  } else if (data.birthdays) {
    label = "Birthdays";
    stat = String(data.birthdays.items.length);
    sub = data.birthdays.items[0]?.name ?? "";
  } else if (data.sponsors) {
    label = "Partners";
    stat = String(data.sponsors.names.length);
    sub = data.sponsors.names[0] ?? "";
  }

  return (
    <DashboardCard onClick={onOpen} index={index} compact={compact} featured={featured}>
      <DashboardLabel action={<DashboardChevron />}>{label}</DashboardLabel>
      <p className={dashboardTileStatClass(stat)}>{stat}</p>
      <p className={cn(dashboardTileMeta, "mt-0.5")}>{sub}</p>
    </DashboardCard>
  );
}
