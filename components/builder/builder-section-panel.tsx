"use client";

import { BUILDER_SECTION_LABELS, type BuilderSection } from "@/lib/blocks/meta";
import { BUILDER_SECTION_STYLES } from "@/lib/blocks/builder-section-styles";
import { BUILDER_SECTION_SURFACE } from "@/lib/builder/layout";
import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function BuilderSectionPanel({
  section,
  blockCount,
  children,
}: {
  section: BuilderSection;
  blockCount: number;
  children: ReactNode;
}) {
  const meta = BUILDER_SECTION_LABELS[section];
  const skin = BUILDER_SECTION_STYLES[section];

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(BUILDER_SECTION_SURFACE, skin.gradient, skin.border)}
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ${skin.badge}`}
          >
            <span aria-hidden>{skin.emoji}</span>
            {meta.title}
          </span>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-600">{meta.hint}</p>
        </div>
        <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-zinc-500 ring-1 ring-black/[0.04]">
          {blockCount} block{blockCount === 1 ? "" : "s"}
        </span>
      </div>
      {children}
    </motion.section>
  );
}
