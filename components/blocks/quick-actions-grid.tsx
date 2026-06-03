"use client";

import { quickActionEmoji, type QuickActionIconId } from "@/lib/quick-actions/icons";
import { toExternalHref } from "@/lib/external-url";
import { mtsTypePlaceholder, mtsTypeTitleSm, mtsTypeTitleXs } from "@/lib/typography";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";

export type QuickActionDisplay = {
  id: string;
  icon: QuickActionIconId | string;
  title: string;
  url: string;
};

export function validQuickActions(actions: QuickActionDisplay[]) {
  return actions
    .map((a) => {
      const href = toExternalHref(a.url);
      const title = a.title?.trim();
      if (!href || !title) return null;
      return { ...a, href, title };
    })
    .filter(Boolean) as (QuickActionDisplay & { href: string })[];
}

export function QuickActionsGrid({
  actions,
  compact = false,
  className,
  emptyMessage,
}: {
  actions: QuickActionDisplay[];
  compact?: boolean;
  /** When true, show simple link-style rows (not product-style tiles). */
  variant?: "tiles" | "links";
  className?: string;
  emptyMessage?: string;
}) {
  const valid = validQuickActions(actions);

  if (valid.length === 0) {
    if (!emptyMessage) return null;
    return (
      <p className={cn("rounded-2xl bg-neutral-50 px-4 py-6 text-center", mtsTypePlaceholder)}>{emptyMessage}</p>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {valid.map((action, i) => (
        <motion.a
          key={action.id}
          href={action.href}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.02 }}
          whileTap={{ scale: 0.99 }}
          className={cn(
            "group flex min-h-[52px] items-center gap-3 rounded-2xl border border-neutral-200/90 bg-white px-4 py-3 shadow-[0_2px_12px_-8px_rgba(15,23,42,0.12)] ring-1 ring-neutral-100/80 transition hover:border-indigo-200/80 hover:bg-indigo-50/30",
            compact && "min-h-[48px] px-3 py-2.5",
          )}
        >
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-xl group-hover:bg-white",
              compact && "h-9 w-9 text-lg",
            )}
            aria-hidden
          >
            {quickActionEmoji(action.icon as QuickActionIconId)}
          </span>
          <span className={cn("min-w-0 flex-1", compact ? mtsTypeTitleXs : mtsTypeTitleSm)}>
            {action.title}
          </span>
          <span
            className="shrink-0 text-lg text-neutral-300 transition group-hover:text-indigo-500"
            aria-hidden
          >
            ›
          </span>
        </motion.a>
      ))}
    </div>
  );
}
