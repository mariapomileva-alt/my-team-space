"use client";

import { BUILDER_PANEL_DESC, BUILDER_PANEL_TITLE } from "@/lib/builder/layout";
import { AnimatePresence, motion } from "framer-motion";
import { useState, type ReactNode } from "react";

export function BuilderCollapsiblePanel({
  title,
  description,
  summary,
  headerRight,
  defaultExpanded = true,
  className,
  children,
}: {
  title: string;
  description?: string;
  summary?: ReactNode;
  headerRight?: ReactNode;
  defaultExpanded?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <motion.section className={className}>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-start justify-between gap-3 text-left"
        aria-expanded={expanded}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className={BUILDER_PANEL_TITLE}>{title}</h2>
            {!expanded && summary ? summary : null}
          </div>
          {description ? <p className={BUILDER_PANEL_DESC}>{description}</p> : null}
        </div>
        <div className="flex shrink-0 items-start gap-2">
          {headerRight}
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.22 }}
            className="mt-0.5 text-sm text-zinc-400"
            aria-hidden
          >
            ▾
          </motion.span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.section>
  );
}
