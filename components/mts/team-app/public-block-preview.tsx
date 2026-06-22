"use client";

import { PaymentLinkCard } from "@/components/blocks/payment-link-card";
import { PollVote } from "@/components/blocks/poll-vote";
import { CampTripConfirm } from "@/components/blocks/camp-trip-confirm";
import { QuickActionsGrid } from "@/components/blocks/quick-actions-grid";
import { TeamShopSectionList } from "@/components/blocks/team-shop-grid";
import { SectionFeaturedItem, SectionListRow } from "@/components/mts/team-app/dashboard-card";
import { getDashboardData } from "@/lib/blocks/block-dashboard-data";
import {
  computeResultsBoard,
  resolveResultsBoardSettings,
  resultsBoardHasContent,
} from "@/lib/blocks/results-board";
import {
  getBlockSettings,
  type ListBlockSettings,
  type PaymentLinkSettings,
  type PollSettings,
  type QuickActionsSettings,
  type TeamShopSettings,
} from "@/lib/blocks/settings";
import { mtsTypeSectionNote } from "@/lib/typography";
import type { BlockInstance, TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { useMemo } from "react";

export type PublicPreviewStats = { total: number; preview: number };

export function hasPublicBlockContent(team: TeamSpace, block: BlockInstance): boolean {
  const data = getDashboardData(team, block);
  switch (block.type) {
    case "schedule":
      return (data.schedule?.events.length ?? 0) > 0;
    case "contacts": {
      const s = getBlockSettings<ListBlockSettings>(block);
      return (s.items ?? []).some((i) => i.name?.trim());
    }
    case "results":
      return resultsBoardHasContent(resolveResultsBoardSettings(block));
    case "gallery":
      return (data.gallery?.images.length ?? 0) > 0;
    case "camp_trip": {
      const s = getBlockSettings<ListBlockSettings>(block);
      return (s.items ?? []).some((i) => i.title?.trim());
    }
    case "achievements":
      return (data.achievements?.cards.length ?? 0) > 0;
    case "polls": {
      const s = getBlockSettings<PollSettings>(block);
      return Boolean(s.question?.trim());
    }
    case "payments": {
      const s = getBlockSettings<PaymentLinkSettings>(block);
      return Boolean(s.title?.trim() || s.paymentUrl?.trim());
    }
    case "team_feed":
      return (data.team_feed?.posts.length ?? 0) > 0;
    case "quick_actions": {
      const s = getBlockSettings<QuickActionsSettings>(block);
      return (s.actions ?? []).some((a) => a.title?.trim() && a.url?.trim());
    }
    case "team_shop": {
      const s = getBlockSettings<TeamShopSettings>(block);
      return (s.products ?? []).some((p) => p.name?.trim());
    }
    case "documents":
      return (data.documents?.docs.length ?? 0) > 0;
    case "attendance":
      return Boolean(data.attendance?.label);
    case "integrations":
      return (data.integrations?.previews.length ?? 0) > 0;
    case "quick_links":
      return (data.quick_links?.labels.length ?? 0) > 0;
    case "calendar":
      return Boolean(data.calendar);
    case "weather":
      return Boolean(data.weather);
    case "countdown":
      return Boolean(data.countdown);
    case "birthdays":
      return (data.birthdays?.items.length ?? 0) > 0;
    case "sponsors":
      return (data.sponsors?.names.length ?? 0) > 0;
    case "resources": {
      const s = getBlockSettings<{ items: { title?: string; fileUrl?: string; url?: string }[] }>(block);
      return (s.items ?? []).some((r) => r.title?.trim() && (r.fileUrl || r.url)?.trim());
    }
    default:
      return false;
  }
}

export function usePublicPreviewStats(team: TeamSpace, block: BlockInstance): PublicPreviewStats {
  const data = getDashboardData(team, block);
  switch (block.type) {
    case "schedule": {
      const n = data.schedule?.events.length ?? 0;
      return { total: n, preview: Math.min(n, 4) };
    }
    case "contacts": {
      const s = getBlockSettings<ListBlockSettings>(block);
      const n = (s.items ?? []).filter((i) => i.name?.trim()).length;
      return { total: n, preview: Math.min(n, 3) };
    }
    case "gallery": {
      const n = data.gallery?.images.length ?? 0;
      return { total: n, preview: Math.min(n, 3) };
    }
    case "documents": {
      const n = data.documents?.docs.length ?? 0;
      return { total: n, preview: Math.min(n, 3) };
    }
    case "camp_trip": {
      const s = getBlockSettings<ListBlockSettings>(block);
      const n = (s.items ?? []).filter((i) => i.title?.trim()).length;
      return { total: n, preview: Math.min(n, 2) };
    }
    case "achievements": {
      const n = data.achievements?.cards.length ?? 0;
      return { total: n, preview: Math.min(n, 2) };
    }
    case "team_feed": {
      const n = data.team_feed?.posts.length ?? 0;
      return { total: n, preview: 1 };
    }
    case "integrations": {
      const n = data.integrations?.previews.length ?? 0;
      return { total: n, preview: Math.min(n, 3) };
    }
    case "quick_links": {
      const n = data.quick_links?.labels.length ?? 0;
      return { total: n, preview: Math.min(n, 4) };
    }
    case "birthdays": {
      const n = data.birthdays?.items.length ?? 0;
      return { total: n, preview: Math.min(n, 3) };
    }
    case "sponsors": {
      const n = data.sponsors?.names.length ?? 0;
      return { total: n, preview: Math.min(n, 3) };
    }
    case "team_shop": {
      const s = getBlockSettings<TeamShopSettings>(block);
      const n = (s.products ?? []).filter((p) => p.name?.trim()).length;
      return { total: n, preview: Math.min(n, 3) };
    }
    case "resources": {
      const s = getBlockSettings<{ items: { title?: string; fileUrl?: string; url?: string }[] }>(block);
      const n = (s.items ?? []).filter((r) => r.title?.trim() && (r.fileUrl || r.url)?.trim()).length;
      return { total: n, preview: Math.min(n, 3) };
    }
    case "results":
      return { total: 1, preview: 1 };
    default:
      return { total: 1, preview: 1 };
  }
}

function SchedulePreview({ team, block }: { team: TeamSpace; block: BlockInstance }) {
  const d = getDashboardData(team, block).schedule;
  if (!d?.events.length) return null;
  const rows = d.events.slice(0, 4);
  return (
    <div className="space-y-1">
      {rows.map((ev, i) => (
        <div
          key={`${ev.title}-${ev.day}`}
          className={cn(
            "rounded-lg px-2.5 py-2",
            i % 2 === 0 ? "bg-rose-50/45" : "bg-transparent",
          )}
        >
          <p className="text-[12px] font-semibold text-[color:var(--mts-text)]">
            {ev.day} · {ev.title}
          </p>
          <p className="mt-0.5 text-[11px] text-[color:var(--mts-muted)]">
            {[ev.time, ev.location].filter(Boolean).join(" · ")}
          </p>
        </div>
      ))}
    </div>
  );
}

function ContactsPreview({ block }: { block: BlockInstance }) {
  const s = getBlockSettings<ListBlockSettings>(block);
  const items = (s.items ?? []).filter((row) => row.name?.trim()).slice(0, 3);
  if (!items.length) return null;
  return (
    <ul className="space-y-2.5">
      {items.map((c) => (
        <li key={c.id} className="flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-2.5">
            {c.photoUrl?.trim() ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.photoUrl} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-white" />
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-[11px] font-bold text-neutral-600">
                {c.name!.slice(0, 1).toUpperCase()}
              </span>
            )}
            <span className="min-w-0">
              <span className="block text-[12px] font-semibold text-[color:var(--mts-text)]">{c.name}</span>
              {c.role ? (
                <span className="block text-[10px] text-[color:var(--mts-muted)]">{c.role}</span>
              ) : null}
            </span>
          </span>
          {c.url?.trim() ? (
            <a className="shrink-0 text-[11px] font-semibold text-violet-600" href={c.url}>
              Contact
            </a>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function ResultsPreview({ block }: { block: BlockInstance }) {
  const settings = useMemo(() => resolveResultsBoardSettings(block), [block]);
  const data = useMemo(
    () => computeResultsBoard(settings, { categoryId: "all", period: "season" }),
    [settings],
  );
  if (!resultsBoardHasContent(settings)) return null;
  const leader = data.leaderboard[0];
  const latest = data.competitions[0];
  const topHighlight = latest?.topThree[0];
  const rows = data.leaderboard.slice(0, 3);

  if (topHighlight) {
    return (
      <div className="space-y-2">
        <SectionFeaturedItem
          title={`${topHighlight.medal} ${topHighlight.name}`}
          meta={latest?.name}
        />
        {leader ? (
          <p className={cn(mtsTypeSectionNote, "mt-1")}>
            Season leader · {leader.athleteName} · {leader.totalPoints} pts
          </p>
        ) : null}
      </div>
    );
  }

  if (rows.length > 0) {
    return (
      <div className="space-y-1">
        {rows.map((row) => (
          <SectionListRow
            key={row.athleteKey}
            title={`#${row.rank} ${row.athleteName}`}
            meta={String(row.totalPoints)}
          />
        ))}
      </div>
    );
  }

  return null;
}

function GalleryPreview({ team, block }: { team: TeamSpace; block: BlockInstance }) {
  const d = getDashboardData(team, block).gallery;
  const imgs = d?.images.slice(0, 3) ?? [];
  if (!imgs.length) return null;
  return (
    <div>
      <p className="mb-2 text-[10px] text-[color:var(--mts-muted)]">
        {d!.images.length} photo{d!.images.length === 1 ? "" : "s"}
      </p>
      <div className="flex min-w-0 gap-2">
        {imgs.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-[color:var(--mts-page-bg)] ring-1 ring-[color:var(--mts-card-border)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

function TripsPreview({ block }: { block: BlockInstance }) {
  const s = getBlockSettings<ListBlockSettings & { confirmationsEnabled?: boolean }>(block);
  const items = (s.items ?? []).filter((row) => row.title?.trim()).slice(0, 2);
  if (!items.length) return null;
  return (
    <div className="space-y-2.5">
      {items.map((row) => (
        <div key={row.id} className="rounded-xl bg-neutral-50/90 px-2.5 py-2 ring-1 ring-[color:var(--mts-card-border)]/40">
          <p className="text-[12px] font-semibold text-[color:var(--mts-text)]">{row.title}</p>
          {row.body ? <p className="mt-0.5 text-[10px] text-[color:var(--mts-muted)]">{row.body}</p> : null}
          {s.confirmationsEnabled !== false ? (
            <div className="mt-2">
              <CampTripConfirm eventId={row.id} title={row.title ?? ""} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function AchievementsPreview({ team, block }: { team: TeamSpace; block: BlockInstance }) {
  const d = getDashboardData(team, block).achievements;
  if (!d?.cards.length) return null;
  return (
    <div className="team-public-inner-grid-2">
      {d.cards.slice(0, 2).map((c, i) => (
        <div
          key={`${c.title}-${i}`}
          className="rounded-xl bg-amber-50/90 p-2.5 ring-1 ring-amber-100/70"
        >
          <span className="text-lg" aria-hidden>
            {c.icon}
          </span>
          <p className="mt-1 text-[11px] font-bold text-amber-950">{c.title}</p>
          {c.player ? <p className="text-[10px] text-[color:var(--mts-muted)]">{c.player}</p> : null}
        </div>
      ))}
    </div>
  );
}

export function PublicBlockPreview({
  team,
  block,
}: {
  team: TeamSpace;
  block: BlockInstance;
}) {
  const data = getDashboardData(team, block);

  switch (block.type) {
    case "schedule":
      return <SchedulePreview team={team} block={block} />;

    case "contacts":
      return <ContactsPreview block={block} />;

    case "results":
      return <ResultsPreview block={block} />;

    case "gallery":
      return <GalleryPreview team={team} block={block} />;

    case "camp_trip":
      return <TripsPreview block={block} />;

    case "achievements":
      return <AchievementsPreview team={team} block={block} />;

    case "polls": {
      const s = getBlockSettings<PollSettings>(block);
      if (!s.question?.trim()) return null;
      return <PollVote teamSlug={team.slug} blockId={block.id} settings={s} />;
    }

    case "payments": {
      const s = getBlockSettings<PaymentLinkSettings>(block);
      return (
        <div className="min-w-0 overflow-hidden">
          <PaymentLinkCard
            title={s.title}
            description={s.description}
            buttonLabel={s.buttonLabel}
            paymentUrl={s.paymentUrl}
            variant="compact"
            className="border-0 bg-transparent p-0 shadow-none ring-0"
          />
        </div>
      );
    }

    case "team_feed": {
      const post = data.team_feed?.posts[0];
      if (!post) return null;
      return <SectionFeaturedItem title={post.title} note={post.body || undefined} />;
    }

    case "quick_actions": {
      const s = getBlockSettings<QuickActionsSettings>(block);
      if (!s.actions?.length) return null;
      return <QuickActionsGrid actions={s.actions} compact />;
    }

    case "team_shop": {
      const s = getBlockSettings<TeamShopSettings>(block);
      return <TeamShopSectionList products={s.products ?? []} max={3} />;
    }

    case "documents": {
      const docs = data.documents?.docs.slice(0, 3) ?? [];
      if (!docs.length) return null;
      return (
        <div className="space-y-0">
          {docs.map((doc) => (
            <SectionListRow key={doc.title} title={doc.title} />
          ))}
        </div>
      );
    }

    case "resources": {
      const s = getBlockSettings<{ items: { id?: string; title?: string }[] }>(block);
      const items = (s.items ?? []).filter((r) => r.title?.trim()).slice(0, 3);
      if (!items.length) return null;
      return (
        <div className="space-y-0">
          {items.map((doc) => (
            <SectionListRow key={doc.id ?? doc.title} title={doc.title!} />
          ))}
        </div>
      );
    }

    case "attendance": {
      const d = data.attendance;
      if (!d) return null;
      return <SectionFeaturedItem title={d.label} note="Athletes on the team" />;
    }

    case "integrations": {
      const previews = data.integrations?.previews.slice(0, 3) ?? [];
      if (!previews.length) return null;
      return (
        <div className="space-y-0">
          {previews.map((p) => (
            <SectionListRow key={p.label} title={p.label} meta={p.host} />
          ))}
        </div>
      );
    }

    case "quick_links": {
      const labels = data.quick_links?.labels.slice(0, 4) ?? [];
      if (!labels.length) return null;
      return (
        <div className="space-y-0">
          {labels.map((label) => (
            <SectionListRow key={label} title={label} />
          ))}
        </div>
      );
    }

    case "calendar": {
      const d = data.calendar;
      if (!d) return null;
      return (
        <SectionFeaturedItem
          title={d.externalUrl ? "Season calendar" : "Season"}
          note={d.externalUrl ? "View full schedule" : undefined}
        />
      );
    }

    case "weather": {
      const d = data.weather;
      if (!d) return null;
      return (
        <SectionFeaturedItem
          title={d.temp ?? "—"}
          note={[d.note, d.location].filter(Boolean).join(" · ") || undefined}
        />
      );
    }

    case "countdown": {
      const d = data.countdown;
      if (!d) return null;
      return (
        <SectionFeaturedItem
          title={d.parts ? `${d.parts.days} days` : "Soon"}
          note={d.label || undefined}
        />
      );
    }

    case "birthdays": {
      const items = data.birthdays?.items.slice(0, 3) ?? [];
      if (!items.length) return null;
      return (
        <div className="space-y-0">
          {items.map((b) => (
            <SectionListRow key={b.name} title={b.name} meta={b.date} />
          ))}
        </div>
      );
    }

    case "sponsors": {
      const names = data.sponsors?.names.slice(0, 3) ?? [];
      if (!names.length) return null;
      return (
        <div className="space-y-0">
          {names.map((name) => (
            <SectionListRow key={name} title={name} />
          ))}
        </div>
      );
    }

    default:
      return null;
  }
}
