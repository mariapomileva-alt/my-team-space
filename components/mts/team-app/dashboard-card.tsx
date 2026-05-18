"use client";

import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function DashboardCard({
  onClick,
  children,
  className,
  accent,
  index = 0,
  compact,
}: {
  onClick: () => void;
  children: ReactNode;
  className?: string;
  accent?: "indigo" | "sky" | "emerald" | "amber" | "rose" | "violet" | "neutral";
  index?: number;
  compact?: boolean;
}) {
  const accentRing =
    accent === "sky"
      ? "hover:border-sky-200"
      : accent === "emerald"
        ? "hover:border-emerald-200"
        : accent === "amber"
          ? "hover:border-amber-200"
          : accent === "rose"
            ? "hover:border-rose-200"
            : accent === "violet"
              ? "hover:border-violet-200"
              : "hover:border-indigo-200";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.2), duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.985 }}
      className={cn(
        "group flex h-full w-full flex-col overflow-hidden rounded-[1.25rem] border border-neutral-200/90 bg-white text-left shadow-[0_4px_20px_-12px_rgba(15,23,42,0.14)] ring-1 ring-neutral-100/80 transition",
        accentRing,
        compact ? "p-3" : "p-3.5",
        className,
      )}
    >
      {children}
    </motion.button>
  );
}

export function DashboardLabel({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{children}</p>
      {action}
    </div>
  );
}

export function DashboardChevron() {
  return (
    <span className="text-[11px] font-semibold text-neutral-300 transition group-hover:text-indigo-500" aria-hidden>
      Open ›
    </span>
  );
}
