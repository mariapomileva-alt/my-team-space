/** Shared builder page geometry — keep toolbar, panels, and grid aligned */

import { cn } from "@/lib/utils/cn";

export const BUILDER_PAGE_GUTTER = "px-4 sm:px-6";

export const BUILDER_PAGE_SHELL = `mx-auto w-full max-w-[1440px] ${BUILDER_PAGE_GUTTER}`;

/** Outer shell: toolbar + settings panels + block sections */
export const BUILDER_RADIUS_SHELL = "rounded-2xl";

/** Pickers inside a panel (palette, visibility, block cards) */
export const BUILDER_RADIUS_CHOICE = "rounded-xl";

export const BUILDER_PANEL_PADDING = "p-4 sm:p-5";

const BUILDER_PANEL_SHADOW =
  "shadow-[0_4px_32px_-16px_rgba(15,23,42,0.1)]";

/** White settings card (team colors, privacy, payments) */
export const BUILDER_PANEL_SURFACE = cn(
  "w-full overflow-hidden border border-zinc-200/90 bg-white/95 backdrop-blur-sm",
  BUILDER_RADIUS_SHELL,
  BUILDER_PANEL_PADDING,
  BUILDER_PANEL_SHADOW,
);

/** Sticky top bar — same outer radius & horizontal rhythm as panels */
export const BUILDER_TOOLBAR_SURFACE = cn(
  "flex w-full flex-wrap items-center justify-between gap-3 border border-white/60 bg-white/80 backdrop-blur-xl",
  BUILDER_RADIUS_SHELL,
  "p-3 sm:p-4",
  "shadow-[0_8px_32px_-12px_rgba(99,102,241,0.2),0_0_0_1px_rgba(255,255,255,0.8)_inset]",
);

/** Colored block section wrapper */
export const BUILDER_SECTION_SURFACE = cn(
  "w-full overflow-hidden border bg-gradient-to-br",
  BUILDER_RADIUS_SHELL,
  BUILDER_PANEL_PADDING,
  "shadow-[0_4px_32px_-16px_rgba(15,23,42,0.08)]",
);

export const BUILDER_PANEL_TITLE = "text-sm font-bold tracking-tight text-zinc-900";
export const BUILDER_PANEL_DESC = "mt-0.5 text-[13px] leading-snug text-zinc-500";

export const BUILDER_INSET_WELL = cn(
  "space-y-3 bg-zinc-50/80",
  BUILDER_RADIUS_CHOICE,
  "p-3.5 sm:p-4",
);

export const BUILDER_FIELD_INPUT = cn(
  "w-full border border-zinc-200/90 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition",
  BUILDER_RADIUS_CHOICE,
  "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
);

const BUILDER_CHOICE_BASE = cn(
  "border text-left transition-all duration-200",
  BUILDER_RADIUS_CHOICE,
  "p-3.5 sm:p-4",
);

const BUILDER_CHOICE_SELECTED =
  "border-indigo-400 bg-indigo-50/50 shadow-[0_0_0_3px_rgba(99,102,241,0.15)]";

const BUILDER_CHOICE_IDLE =
  "border-zinc-200/90 bg-white hover:border-indigo-300 hover:shadow-md";

export function builderChoiceClass(selected: boolean, extra?: string) {
  return cn(BUILDER_CHOICE_BASE, selected ? BUILDER_CHOICE_SELECTED : BUILDER_CHOICE_IDLE, extra);
}

/** Desktop workspace — editor ~54% / preview ~46% */
export const BUILDER_PREVIEW_WIDTH_PX = 480;

export const BUILDER_WORKSPACE_GRID =
  "grid w-full grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(400px,46%)] lg:gap-7 xl:gap-8";

export const BUILDER_EDITOR_COLUMN = "min-w-0 w-full space-y-5 overflow-x-clip lg:space-y-6";

export const BUILDER_PREVIEW_COLUMN = cn(
  "mx-auto hidden w-full shrink-0",
  "lg:sticky lg:top-[4.75rem] lg:z-10 lg:col-start-2 lg:row-start-1",
  "lg:mx-0 lg:block lg:w-full lg:max-w-none lg:justify-self-stretch",
  "lg:max-h-[calc(100dvh-5.5rem)] lg:overflow-y-auto lg:overscroll-contain",
);
