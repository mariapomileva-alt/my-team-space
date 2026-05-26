/** Shared builder page geometry — keep toolbar, panels, and grid aligned */

import { cn } from "@/lib/utils/cn";

export const BUILDER_PAGE_GUTTER = "px-4 sm:px-6";

export const BUILDER_PAGE_SHELL = `mx-auto w-full max-w-[1280px] ${BUILDER_PAGE_GUTTER}`;

/** Outer shell: toolbar + settings panels + block sections */
export const BUILDER_RADIUS_SHELL = "rounded-2xl";

/** Pickers inside a panel (palette, visibility, block cards) */
export const BUILDER_RADIUS_CHOICE = "rounded-xl";

export const BUILDER_PANEL_PADDING = "p-5 sm:p-6";

const BUILDER_PANEL_SHADOW =
  "shadow-[0_4px_32px_-16px_rgba(15,23,42,0.1)]";

/** White settings card (team colors, privacy, payments) */
export const BUILDER_PANEL_SURFACE = cn(
  "w-full overflow-hidden border border-zinc-200/90 bg-white/90 backdrop-blur-sm",
  BUILDER_RADIUS_SHELL,
  BUILDER_PANEL_PADDING,
  BUILDER_PANEL_SHADOW,
);

/** Sticky top bar — same outer radius & horizontal rhythm as panels */
export const BUILDER_TOOLBAR_SURFACE = cn(
  "flex w-full flex-wrap items-center justify-between gap-3 border border-white/60 bg-white/75 backdrop-blur-xl",
  BUILDER_RADIUS_SHELL,
  BUILDER_PANEL_PADDING,
  "shadow-[0_8px_40px_-12px_rgba(99,102,241,0.25),0_0_0_1px_rgba(255,255,255,0.8)_inset]",
);

/** Colored block section wrapper */
export const BUILDER_SECTION_SURFACE = cn(
  "w-full overflow-hidden border bg-gradient-to-br",
  BUILDER_RADIUS_SHELL,
  BUILDER_PANEL_PADDING,
  "shadow-[0_4px_32px_-16px_rgba(15,23,42,0.08)]",
);

export const BUILDER_PANEL_TITLE = "text-sm font-bold tracking-tight text-zinc-900";
export const BUILDER_PANEL_DESC = "mt-1 text-sm text-zinc-500";

export const BUILDER_INSET_WELL = cn(
  "space-y-3 bg-zinc-50",
  BUILDER_RADIUS_CHOICE,
  "p-4",
);

export const BUILDER_FIELD_INPUT = cn(
  "w-full border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition",
  BUILDER_RADIUS_CHOICE,
  "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
);

const BUILDER_CHOICE_BASE = cn(
  "border text-left transition-all duration-200",
  BUILDER_RADIUS_CHOICE,
  "p-4",
);

const BUILDER_CHOICE_SELECTED =
  "border-indigo-400 bg-indigo-50/50 shadow-[0_0_0_3px_rgba(99,102,241,0.15)]";

const BUILDER_CHOICE_IDLE =
  "border-zinc-200/90 bg-white hover:border-indigo-300 hover:shadow-md";

export function builderChoiceClass(selected: boolean, extra?: string) {
  return cn(BUILDER_CHOICE_BASE, selected ? BUILDER_CHOICE_SELECTED : BUILDER_CHOICE_IDLE, extra);
}

/** Left column + sticky preview */
export const BUILDER_WORKSPACE_GRID =
  "grid w-full grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8";

export const BUILDER_EDITOR_COLUMN = "min-w-0 w-full space-y-8 overflow-x-clip";

export const BUILDER_PREVIEW_COLUMN =
  "mx-auto hidden w-full max-w-[360px] shrink-0 lg:sticky lg:top-[5.75rem] lg:z-10 lg:col-start-2 lg:row-start-1 lg:mx-0 lg:block lg:w-[360px] lg:max-w-[360px] lg:justify-self-end";
