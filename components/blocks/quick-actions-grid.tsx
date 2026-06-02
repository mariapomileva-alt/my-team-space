"use client";

import { quickActionEmoji, type QuickActionIconId } from "@/lib/quick-actions/icons";
import { toExternalHref } from "@/lib/external-url";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";

export type QuickActionDisplay = {
  id: string;
  icon: QuickActionIconId | string;
  title: string;
  url: string;
};

export function QuickActionsGrid({
  actions,
  compact = false,
  className,
}: {
  actions: QuickActionDisplay[];
  compact?: boolean;
  className?: string;
}) {
  const valid = actions
    .map((a) => {
      const href = toExternalHref(a.url);
      const title = a.title?.trim();
      if (!href || !title) return null;
      return { ...a, href, title };
    })
    .filter(Boolean) as (QuickActionDisplay & { href: string })[];

  if (valid.length === 0) {
    return (
      <p className="rounded-2xl bg-neutral-50 px-4 py-6 text-center text-sm text-neutral-500">
        Add action buttons in the builder — payments, shop, registration, and more.
      </p>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-2.5 sm:gap-3",
        compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {valid.map((action, i) => (
        <motion.a
          key={action.id}
          href={action.href}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "group flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-[1.25rem] border border-neutral-200/90 bg-white px-3 py-4 text-center shadow-[0_4px_20px_-12px_rgba(15,23,42,0.14)] ring-1 ring-neutral-100/80 transition hover:border-neutral-300/90 hover:shadow-[0_8px_28px_-14px_rgba(15,23,42,0.2)]",
            compact && "min-h-[76px] gap-1.5 py-3",
          )}
        >
          <span className={cn("leading-none", compact ? "text-2xl" : "text-[28px]")} aria-hidden>
            {quickActionEmoji(action.icon as QuickActionIconId)}
          </span>
          <span
            className={cn(
              "line-clamp-2 font-semibold text-neutral-900",
              compact ? "text-[11px] leading-tight" : "text-[12px] leading-snug sm:text-[13px]",
            )}
          >
            {action.title}
          </span>
        </motion.a>
      ))}
    </div>
  );
}
