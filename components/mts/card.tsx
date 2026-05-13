import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/** Premium rounded surface inside `.mts-shell` */
export function MtsCard({ children, className }: Props) {
  return (
    <div
      className={cn(
        "mts-card border text-[color:var(--mts-text)] motion-safe:transition-[transform,box-shadow] motion-safe:duration-300",
        className
      )}
    >
      {children}
    </div>
  );
}

export function MtsBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[var(--mts-accent-soft)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--mts-primary)]">
      {children}
    </span>
  );
}
