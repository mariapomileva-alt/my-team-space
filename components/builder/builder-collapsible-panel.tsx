"use client";

import { BUILDER_PANEL_DESC, BUILDER_PANEL_TITLE } from "@/lib/builder/layout";
import { AnimatePresence, motion } from "framer-motion";
import { useState, type ReactNode } from "react";

export function BuilderCollapsiblePanel({
  title,
  description,
  summary,
  headerRight,
  expanded: expandedProp,
  onExpandedChange,
  defaultExpanded = true,
  density = "default",
  className,
  children,
}: {
  title: string;
  description?: string;
  summary?: ReactNode;
  headerRight?: ReactNode;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  defaultExpanded?: boolean;
  /** compact = header card; emphasis = sections hero */
  density?: "compact" | "default" | "emphasis";
  className?: string;
  children: ReactNode;
}) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const controlled = expandedProp !== undefined;
  const expanded = controlled ? expandedProp : internalExpanded;
  const titleClass =
    density === "emphasis"
      ? "text-[16px] font-semibold tracking-tight text-zinc-900"
      : BUILDER_PANEL_TITLE;
  const descClass =
    density === "compact" ? "mt-0 text-[12px] leading-snug text-zinc-500" : BUILDER_PANEL_DESC;
  const bodySpacing = density === "compact" ? "mt-3" : density === "emphasis" ? "mt-4" : "mt-4";

  function setExpanded(next: boolean) {
    if (!controlled) setInternalExpanded(next);
    onExpandedChange?.(next);
  }

  return (
    <motion.section className={className}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start justify-between gap-2.5 text-left"
        aria-expanded={expanded}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className={titleClass}>{title}</h2>
            {!expanded && summary ? summary : null}
          </div>
          {description ? <p className={descClass}>{description}</p> : null}
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
            <div className={bodySpacing}>{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.section>
  );
}
