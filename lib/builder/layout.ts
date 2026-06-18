/** Shared builder page geometry — keep toolbar, panels, and grid aligned */

import { cn } from "@/lib/utils/cn";

export const BUILDER_PAGE_GUTTER = "px-4 sm:px-6";

export const BUILDER_PAGE_SHELL = `mx-auto w-full max-w-[1520px] ${BUILDER_PAGE_GUTTER}`;

/** Outer shell: toolbar + settings panels + block sections */
export const BUILDER_RADIUS_SHELL = "rounded-2xl";

/** Pickers inside a panel (palette, visibility, block cards) */
export const BUILDER_RADIUS_CHOICE = "rounded-xl";

export const BUILDER_PANEL_PADDING = "p-5 sm:p-6";

const BUILDER_PANEL_SHADOW =
  "shadow-[0_2px_24px_-12px_rgba(15,23,42,0.08)]";

/** White settings card (team colors, privacy, payments) */
export const BUILDER_PANEL_SURFACE = cn(
  "w-full overflow-hidden border border-zinc-200/50 bg-white/90 backdrop-blur-sm",
  BUILDER_RADIUS_SHELL,
  BUILDER_PANEL_PADDING,
  BUILDER_PANEL_SHADOW,
);

/** Sticky top bar — compact premium SaaS header */
export const BUILDER_TOOLBAR_SURFACE = cn(
  "flex w-full flex-wrap items-center justify-between gap-3 border border-zinc-200/40 bg-white/85 backdrop-blur-xl",
  BUILDER_RADIUS_SHELL,
  "px-5 py-3.5 sm:px-6 sm:py-4",
  "shadow-[0_4px_24px_-16px_rgba(15,23,42,0.1)]",
);

/** Colored block section wrapper */
export const BUILDER_SECTION_SURFACE = cn(
  "w-full overflow-hidden border bg-gradient-to-br",
  BUILDER_RADIUS_SHELL,
  BUILDER_PANEL_PADDING,
  "shadow-[0_2px_24px_-12px_rgba(15,23,42,0.06)]",
);

export const BUILDER_PANEL_TITLE = "text-[15px] font-semibold tracking-tight text-zinc-900";
export const BUILDER_PANEL_DESC = "mt-0.5 text-[13px] leading-snug text-zinc-500";

export const BUILDER_INSET_WELL = cn(
  "space-y-3 bg-zinc-50/60",
  BUILDER_RADIUS_CHOICE,
  "p-3.5 sm:p-4",
);

export const BUILDER_FIELD_INPUT = cn(
  "w-full border border-zinc-200/70 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition",
  BUILDER_RADIUS_CHOICE,
  "focus:border-violet-300 focus:ring-2 focus:ring-violet-100/80",
);

const BUILDER_CHOICE_BASE = cn(
  "border text-left transition-all duration-200",
  BUILDER_RADIUS_CHOICE,
  "p-3.5 sm:p-4",
);

const BUILDER_CHOICE_SELECTED =
  "border-violet-300/80 bg-violet-50/40 shadow-[0_0_0_3px_rgba(139,92,246,0.1)]";

const BUILDER_CHOICE_IDLE =
  "border-zinc-200/60 bg-white hover:border-violet-200/80 hover:shadow-[0_4px_16px_-12px_rgba(15,23,42,0.1)]";

export function builderChoiceClass(selected: boolean, extra?: string) {
  return cn(BUILDER_CHOICE_BASE, selected ? BUILDER_CHOICE_SELECTED : BUILDER_CHOICE_IDLE, extra);
}

/** Desktop workspace — sidebar + editor + preview */
export const BUILDER_PREVIEW_WIDTH_PX = 480;

export const BUILDER_WORKSPACE_ROW = "flex w-full items-start gap-6 xl:gap-7";

export const BUILDER_WORKSPACE_GRID =
  "grid w-full min-w-0 flex-1 grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(380px,42%)] lg:gap-7 xl:gap-8";

export const BUILDER_EDITOR_COLUMN = "min-w-0 w-full space-y-5 overflow-x-clip lg:space-y-6";

export const BUILDER_PREVIEW_COLUMN = cn(
  "mx-auto hidden w-full shrink-0",
  "lg:sticky lg:top-[4.25rem] lg:z-10 lg:col-start-2 lg:row-start-1",
  "lg:mx-0 lg:block lg:w-full lg:max-w-none lg:justify-self-stretch",
  "lg:max-h-[calc(100dvh-5rem)] lg:overflow-y-auto lg:overscroll-contain",
);

/** Premium preview chrome wrapper */
export const BUILDER_PREVIEW_CHROME = cn(
  "rounded-[1.35rem] border border-zinc-200/50 bg-gradient-to-b from-zinc-50/80 via-white to-white p-4 sm:p-5",
  "shadow-[0_8px_40px_-20px_rgba(139,92,246,0.12)]",
);
