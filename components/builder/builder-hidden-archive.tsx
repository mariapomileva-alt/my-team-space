"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

export function BuilderHiddenArchive({
  count,
  open,
  onToggle,
  hint,
  children,
}: {
  count: number;
  open: boolean;
  onToggle: () => void;
  hint?: string;
  children: ReactNode;
}) {
  if (count === 0) return null;

  return (
    <section className="mt-6 border-t border-zinc-200/80 pt-4">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 rounded-xl px-1 py-2 text-left transition hover:bg-zinc-50"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-zinc-700">
          Hidden sections
          <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-bold tabular-nums text-zinc-500">
            {count}
          </span>
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22 }}
          className="text-sm text-zinc-400"
          aria-hidden
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            {hint ? <p className="mb-3 px-1 text-[11px] text-zinc-500">{hint}</p> : null}
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
