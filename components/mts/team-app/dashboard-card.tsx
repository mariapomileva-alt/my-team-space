"use client";

import { mtsTypeLabel, mtsTypeTitleXs } from "@/lib/typography";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

/** Half-width tile title — wraps cleanly, max 2 lines. */
export const dashboardTileTitle = cn(
  mtsTypeTitleXs,
  "min-w-0 break-words [overflow-wrap:anywhere] line-clamp-2",
);

/** Secondary line under title or stat. */
export const dashboardTileMeta =
  "min-w-0 break-words text-[11px] font-medium leading-snug [overflow-wrap:anywhere] line-clamp-2 text-[color:var(--mts-muted)]";

export function dashboardTileStatClass(value: string) {
  const trimmed = value.trim();
  const long = trimmed.length > 12 || (/\s/.test(trimmed) && trimmed.length > 7);
  return cn(
    "min-w-0 font-bold text-[color:var(--mts-text)] break-words [overflow-wrap:anywhere]",
    long ? "text-[13px] leading-snug line-clamp-2" : "text-xl tabular-nums leading-none tracking-tight",
  );
}

export function DashboardCard({
  onClick,
  children,
  className,
  accent,
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.2), duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.985 }}
      className={cn(
        "mts-app-surface mts-app-surface--interactive group flex h-full min-w-0 w-full flex-col overflow-hidden rounded-[1.25rem] text-left",
        featured ? "min-h-[156px] p-4" : compact ? "p-3" : "p-3.5",
        className,
      )}
    >
      {children}
    </motion.button>
  );
}

export function DashboardLabel({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-2 flex min-w-0 items-center justify-between gap-1.5">
      <p className={cn(mtsTypeLabel, "min-w-0 truncate")}>{children}</p>
      {action ? <span className="shrink-0">{action}</span> : null}
    </div>
  );
}

export function DashboardChevron() {
  return (
    <span
      className="whitespace-nowrap text-[10px] font-semibold text-[color:var(--mts-muted)] opacity-50 transition group-hover:text-[color:var(--mts-primary)] group-hover:opacity-100"
      aria-hidden
    >
      Open ›
    </span>
  );
}
