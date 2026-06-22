"use client";

import {
  mtsTypeItemTitle,
  mtsTypeSectionAction,
  mtsTypeSectionLead,
  mtsTypeSectionMeta,
  mtsTypeSectionNote,
  mtsTypeSectionTitle,
  mtsTypeTitle,
} from "@/lib/typography";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

/** Content headline inside a section — wraps cleanly, max 2 lines. */
export const dashboardTileTitle = cn(
  mtsTypeItemTitle,
  "min-w-0 break-words [overflow-wrap:anywhere] line-clamp-2",
);

/** Secondary line under title or stat. */
export const dashboardTileMeta = cn(mtsTypeSectionMeta, "min-w-0 break-words [overflow-wrap:anywhere] line-clamp-2");

export function dashboardTileStatClass(value: string) {
  const trimmed = value.trim();
  const long = trimmed.length > 12 || (/\s/.test(trimmed) && trimmed.length > 7);
  return cn(
    mtsTypeItemTitle,
    "min-w-0 break-words [overflow-wrap:anywhere]",
    long ? "line-clamp-2 text-[15px]" : "text-[17px] sm:text-lg",
  );
}

export function DashboardCard({
  onClick,
  children,
  className,
  index = 0,
  compact,
  featured,
}: {
  onClick: () => void;
  children: ReactNode;
  className?: string;
  accent?: "indigo" | "sky" | "emerald" | "amber" | "rose" | "violet" | "neutral";
  index?: number;
  compact?: boolean;
  featured?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.025, 0.15), duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "team-page-section group flex w-full min-w-0 flex-col text-left",
        featured ? "gap-3.5" : compact ? "gap-2.5" : "gap-3",
        className,
      )}
    >
      {children}
    </motion.button>
  );
}

export function DashboardLabel({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="team-page-section__head flex min-w-0 items-center justify-between gap-3">
      <h2 className={cn(mtsTypeSectionTitle, "min-w-0 flex-1")}>{children}</h2>
      {action ? <span className="team-page-section__action-slot shrink-0">{action}</span> : null}
    </div>
  );
}

export function SectionAction() {
  return (
    <span className="team-page-section__action" aria-hidden>
      <span className={cn(mtsTypeSectionAction, "team-page-section__action-arrow")}>→</span>
    </span>
  );
}

/** @deprecated use SectionAction */
export function DashboardChevron() {
  return <SectionAction />;
}

/** Primary content block directly under the section header. */
export function SectionBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("team-page-section__body space-y-1", className)}>{children}</div>;
}

/** List row inside a section — editorial, scannable. */
export function SectionListRow({
  title,
  meta,
  note,
  className,
}: {
  title: string;
  meta?: string;
  note?: string;
  className?: string;
}) {
  return (
    <div className={cn("team-page-section__list-row flex min-w-0 gap-3 py-2", className)}>
      <div className="min-w-0 flex-1">
        <p className={cn(mtsTypeItemTitle, "text-[14px] sm:text-[15px]")}>{title}</p>
        {note ? <p className={cn(mtsTypeSectionNote, "mt-0.5")}>{note}</p> : null}
      </div>
      {meta ? <p className={cn(mtsTypeSectionMeta, "shrink-0 pt-0.5 text-right tabular-nums")}>{meta}</p> : null}
    </div>
  );
}

/** Featured row for schedule / hero item within a section. */
export function SectionFeaturedItem({
  title,
  meta,
  note,
}: {
  title: string;
  meta?: string;
  note?: string;
}) {
  return (
    <div className="team-page-section__featured">
      <p className={cn(mtsTypeItemTitle, "min-w-0 break-words")}>{title}</p>
      {meta ? <p className={cn(mtsTypeSectionMeta, "mt-1.5")}>{meta}</p> : null}
      {note ? <p className={cn(mtsTypeSectionNote, "mt-1")}>{note}</p> : null}
    </div>
  );
}
