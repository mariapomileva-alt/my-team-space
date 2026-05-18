"use client";

import { MtsCard } from "@/components/mts/card";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function BlockSurface({
  embedded,
  className,
  children,
}: {
  embedded?: boolean;
  className?: string;
  children: ReactNode;
}) {
  if (embedded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className={cn("space-y-4", className)}
      >
        {children}
      </motion.div>
    );
  }
  return <MtsCard className={cn("p-5 sm:p-6", className)}>{children}</MtsCard>;
}

export function BlockHeading({
  embedded,
  children,
  className,
}: {
  embedded?: boolean;
  children: ReactNode;
  className?: string;
}) {
  if (embedded) return null;
  return <h2 className={cn("mb-4 text-lg font-bold text-[color:var(--mts-text)]", className)}>{children}</h2>;
}
