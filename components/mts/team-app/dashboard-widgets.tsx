"use client";

import { PaymentLinkCard } from "@/components/blocks/payment-link-card";
import { QuickActionsGrid } from "@/components/blocks/quick-actions-grid";
import { TeamShopSectionList } from "@/components/blocks/team-shop-grid";
import { ResultsBoardTeaser } from "@/components/results/results-board-teaser";
import { contentLevelForInstance, sectionLevelClass } from "@/lib/blocks/content-hierarchy";
import { DashboardCard, DashboardLabel, SectionAction, SectionBody, SectionFeaturedItem, SectionListRow, dashboardTileTitle } from "@/components/mts/team-app/dashboard-card";
import { getDashboardData } from "@/lib/blocks/block-dashboard-data";
import {
  getBlockSettings,
  type PaymentLinkSettings,
  type QuickActionsSettings,
  type TeamShopSettings,
} from "@/lib/blocks/settings";
import { quickActionEmoji, type QuickActionIconId } from "@/lib/quick-actions/icons";
import { mtsTypeSectionMeta, mtsTypeSectionTitle } from "@/lib/typography";
import type { BlockInstance, BlockLayout, TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";

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
  const level = contentLevelForInstance(block);
  const metaLine = [next.day, next.time].filter(Boolean).join(" · ");
  return (
    <DashboardCard onClick={onOpen} index={index} compact={compact} featured={featured} level={level}>
      <DashboardLabel action={<SectionAction />}>Schedule</DashboardLabel>
      <SectionBody>
        <SectionFeaturedItem
          title={next.title}
          meta={metaLine}
          note={next.location || undefined}
        />
        {!compact && d.events.length > 1 ? (
          <div className="mt-2 border-t border-[color:var(--mts-section-divider,var(--mts-card-border))] pt-1">
            {d.events.slice(1, 3).map((ev) => (
              <SectionListRow
                key={`${ev.title}-${ev.day}`}
                title={ev.title}
                meta={[ev.day, ev.time].filter(Boolean).join(" · ")}
                note={ev.location || undefined}
              />
            ))}
          </div>
        ) : null}
      </SectionBody>
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
  const level = contentLevelForInstance(block);
  return (
    <DashboardCard onClick={onOpen} index={index} compact={compact} featured={featured} level={level}>
      <DashboardLabel action={<SectionAction />}>Team roster</DashboardLabel>
      <SectionBody>
        <SectionFeaturedItem title={d.label} note="Athletes on the team" />
      </SectionBody>
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
  const level = contentLevelForInstance(block);
  return (
    <DashboardCard onClick={onOpen} index={index} compact level={level}>
      <DashboardLabel action={<SectionAction />}>Trips</DashboardLabel>
      <SectionBody>
        <SectionFeaturedItem title={first.title} note={first.body || undefined} />
      </SectionBody>
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
  const level = contentLevelForInstance(block);
  return (
    <DashboardCard onClick={onOpen} index={index} compact level={level}>
      <DashboardLabel action={<SectionAction />}>Documents</DashboardLabel>
      <SectionBody className="space-y-0">
        {d.docs.slice(0, 3).map((doc) => (
          <SectionListRow key={doc.title} title={doc.title} />
        ))}
      </SectionBody>
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
  const level = contentLevelForInstance(block);
  return (
    <DashboardCard onClick={onOpen} index={index} compact level={level}>
      <DashboardLabel action={<SectionAction />}>Poll</DashboardLabel>
      <SectionBody>
        <SectionFeaturedItem title={d.question} meta={d.options.length > 0 ? d.options.join(" · ") : undefined} />
      </SectionBody>
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
  const level = contentLevelForInstance(block);
  return (
    <DashboardCard onClick={onOpen} index={index} compact level={level}>
      <DashboardLabel action={<SectionAction />}>News</DashboardLabel>
      <SectionBody>
        <SectionFeaturedItem title={post.title} note={post.body || undefined} />
      </SectionBody>
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
  const level = contentLevelForInstance(block);
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="col-span-1 sm:col-span-2"
    >
      <div className={cn("team-page-section team-page-section__rail-head px-0.5", sectionLevelClass(level))}>
        <h2 className={mtsTypeSectionTitle}>Achievements</h2>
        <button type="button" onClick={onOpen} className="team-page-section__action-slot">
          <span className="team-page-section__action">
            <span className="team-page-section__action-arrow">→</span>
          </span>
        </button>
      </div>
      <div className="dashboard-rail -mx-0.5 flex gap-3 overflow-x-auto px-0.5 pb-0.5">
        {d.cards.map((c, i) => (
          <button
            key={`${c.title}-${i}`}
            type="button"
            onClick={onOpen}
            className="dashboard-rail-item shrink-0 snap-start p-3.5 text-left transition active:opacity-80"
          >
            <span className="text-xl" aria-hidden>
              {c.icon}
            </span>
            <p className={cn(dashboardTileTitle, "mt-2")}>{c.title}</p>
            {c.player ? <p className={cn(mtsTypeSectionMeta, "mt-1")}>{c.player}</p> : null}
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
  const imgs = d.images.slice(0, 6);
  const level = contentLevelForInstance(block);

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.025 }}
      className={cn("team-page-section group w-full text-left", sectionLevelClass(level))}
    >
      <div className="team-page-section__head flex min-w-0 items-center justify-between gap-3">
        <h2 className={mtsTypeSectionTitle}>Gallery</h2>
        <span className="team-page-section__action-slot">
          <SectionAction />
        </span>
      </div>
      {imgs.length > 0 ? (
        <div className="dashboard-rail -mx-0.5 flex gap-2.5 overflow-x-auto px-0.5 pb-0.5">
          {imgs.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="h-[7.5rem] w-[6.5rem] shrink-0 snap-start overflow-hidden rounded-xl bg-[color:var(--mts-page-bg)] sm:h-[8.5rem] sm:w-[7.25rem]"
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      ) : null}
      {d.albumMode ? (
        <p className={cn(mtsTypeSectionMeta, "mt-2")}>Photo album</p>
      ) : imgs.length > 0 ? (
        <p className={cn(mtsTypeSectionMeta, "mt-2")}>
          {imgs.length} photo{imgs.length === 1 ? "" : "s"}
        </p>
      ) : null}
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
  const level = contentLevelForInstance(block);

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
    <DashboardCard onClick={onOpen} index={index} compact={compact ?? true} featured={featured} level={level}>
      <DashboardLabel action={<SectionAction />}>{d.title}</DashboardLabel>
      <SectionBody>
        <SectionFeaturedItem
          title={d.hasUrl ? d.buttonLabel : d.title}
          note={d.description || undefined}
        />
      </SectionBody>
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
  const level = contentLevelForInstance(block);
  const showInlineGrid = featured || !compact;

  if (showInlineGrid && (s.actions?.length ?? 0) > 0) {
    return (
      <div className={cn("team-page-section space-y-3 py-1", sectionLevelClass(level))}>
        <h2 className={mtsTypeSectionTitle}>{d.title}</h2>
        <QuickActionsGrid actions={s.actions ?? []} compact={compact && !featured} />
      </div>
    );
  }

  return (
    <DashboardCard onClick={onOpen} index={index} compact={compact} featured={featured} level={level}>
      <DashboardLabel action={<SectionAction />}>{d.title}</DashboardLabel>
      {d.previews.length > 0 ? (
        <SectionBody className="space-y-0">
          {d.previews.map((p) => (
            <SectionListRow
              key={`${p.title}-${p.icon}`}
              title={p.title}
              meta={quickActionEmoji(p.icon as QuickActionIconId)}
            />
          ))}
        </SectionBody>
      ) : null}
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
  const level = contentLevelForInstance(block);
  const products = s.products ?? [];
  const previews = d.previews.length > 0 ? d.previews : products.map((p) => ({ name: p.name ?? "", price: p.price }));

  return (
    <DashboardCard onClick={onOpen} index={index} compact={compact ?? true} featured={featured} level={level}>
      <DashboardLabel action={<SectionAction />}>{d.title}</DashboardLabel>
      {products.length > 0 ? (
        <SectionBody>
          <TeamShopSectionList products={products} max={featured ? 4 : 3} />
        </SectionBody>
      ) : previews.length > 0 ? (
        <SectionBody className="space-y-0">
          {previews.slice(0, 3).map((p) => (
            <SectionListRow key={p.name} title={p.name} meta={p.price} />
          ))}
        </SectionBody>
      ) : null}
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
  let headline = "—";
  let sub = "";

  if (data.calendar) {
    label = "Calendar";
    headline = data.calendar.externalUrl ? "Season calendar" : "Season";
    sub = data.calendar.externalUrl ? "View full schedule" : "Full season view";
  } else if (data.contacts) {
    label = "Contacts";
    headline = data.contacts.items[0]?.name ?? "Coaches";
    sub = data.contacts.items[0]?.role ?? "";
  } else if (data.integrations) {
    label = data.integrations.title;
    headline = data.integrations.previews[0]?.label ?? "Links";
    sub = data.integrations.previews[0]?.host ?? "";
  } else if (data.quick_links) {
    label = "Connect";
    headline = data.quick_links.labels[0] ?? "Social";
    sub = data.quick_links.labels.slice(1).join(" · ");
  } else if (data.payments) {
    label = "Payments";
    headline = data.payments.title;
    sub = data.payments.hasUrl ? data.payments.buttonLabel : "";
  } else if (data.quick_actions) {
    label = "Links";
    headline = data.quick_actions.previews[0]?.title ?? "Quick links";
    sub = data.quick_actions.count > 1 ? `${data.quick_actions.count} links` : "";
  } else if (data.team_shop) {
    label = "Shop";
    headline = data.team_shop.previews[0]?.name ?? "Team shop";
    sub = data.team_shop.previews[0]?.price ?? "";
  } else if (data.weather) {
    label = "Venue";
    headline = data.weather.temp ?? "—";
    sub = [data.weather.note, data.weather.location].filter(Boolean).join(" · ");
  } else if (data.countdown) {
    label = "Countdown";
    headline = data.countdown.parts ? `${data.countdown.parts.days} days` : "Soon";
    sub = data.countdown.label;
  } else if (data.birthdays) {
    label = "Birthdays";
    headline = data.birthdays.items[0]?.name ?? "";
    sub = data.birthdays.items[0]?.date ?? "";
  } else if (data.sponsors) {
    label = "Partners";
    headline = data.sponsors.names[0] ?? "";
    sub = data.sponsors.names.length > 1 ? `${data.sponsors.names.length} partners` : "";
  }

  const level = contentLevelForInstance(block);

  return (
    <DashboardCard onClick={onOpen} index={index} compact={compact} featured={featured} level={level}>
      <DashboardLabel action={<SectionAction />}>{label}</DashboardLabel>
      <SectionBody>
        <SectionFeaturedItem title={headline} note={sub || undefined} />
      </SectionBody>
    </DashboardCard>
  );
}
