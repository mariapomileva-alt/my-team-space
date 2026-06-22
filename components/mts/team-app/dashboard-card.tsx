"use client";

import {
  mtsTypeSectionLead,
  mtsTypeSectionLink,
  mtsTypeSectionMeta,
  mtsTypeSectionTitle,
  mtsTypeTitle,
} from "@/lib/typography";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

/** Content headline inside a section — wraps cleanly, max 2 lines. */
export const dashboardTileTitle = cn(
  mtsTypeSectionLead,
  "min-w-0 break-words [overflow-wrap:anywhere] line-clamp-2",
);

/** Secondary line under title or stat. */
export const dashboardTileMeta = cn(mtsTypeSectionMeta, "min-w-0 break-words [overflow-wrap:anywhere] line-clamp-2");

export function dashboardTileStatClass(value: string) {
  const trimmed = value.trim();
  const long = trimmed.length > 12 || (/\s/.test(trimmed) && trimmed.length > 7);
  return cn(
    mtsTypeSectionLead,
    "min-w-0 break-words [overflow-wrap:anywhere]",
    long ? "line-clamp-2" : "text-[17px] sm:text-lg",
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
        featured ? "gap-3 py-1" : compact ? "gap-2 py-0.5" : "gap-2.5 py-1",
        className,
      )}
    >
      {children}
    </motion.button>
  );
}

export function DashboardLabel({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="team-page-section__head mb-0.5 flex min-w-0 items-baseline justify-between gap-3">
      <h2 className={cn(mtsTypeSectionTitle, "min-w-0")}>{children}</h2>
      {action ? <span className="shrink-0">{action}</span> : null}
    </div>
  );
}

export function DashboardChevron() {
  return <span className={mtsTypeSectionLink} aria-hidden>→</span>;
}

/** List row inside a section — editorial, not widget-like. */
export function SectionListRow({
  title,
  meta,
  className,
}: {
  title: string;
  meta?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 items-baseline justify-between gap-3 py-1.5", className)}>
      <span className={cn(mtsTypeTitle, "min-w-0 text-[13px] font-medium leading-snug")}>{title}</span>
      {meta ? <span className={cn(mtsTypeSectionMeta, "shrink-0 text-right")}>{meta}</span> : null}
    </div>
  );
}
