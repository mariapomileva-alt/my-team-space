/** Shared builder page geometry — keep toolbar, panels, and grid aligned */

export const BUILDER_PAGE_GUTTER = "px-4 sm:px-6";

export const BUILDER_PAGE_SHELL = `mx-auto w-full max-w-[1280px] ${BUILDER_PAGE_GUTTER}`;

/** White settings card (team colors, privacy) */
export const BUILDER_PANEL_SURFACE =
  "w-full overflow-hidden rounded-[1.75rem] border border-zinc-200/90 bg-white/90 p-6 shadow-[0_4px_32px_-16px_rgba(15,23,42,0.1)] backdrop-blur-sm";

/** Left column + sticky preview */
export const BUILDER_WORKSPACE_GRID =
  "grid w-full grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8";

export const BUILDER_EDITOR_COLUMN = "min-w-0 w-full space-y-10 overflow-x-clip";

export const BUILDER_PREVIEW_COLUMN =
  "mx-auto hidden w-full max-w-[360px] shrink-0 lg:sticky lg:top-[5.75rem] lg:z-20 lg:col-start-2 lg:row-start-1 lg:mx-0 lg:block lg:w-[360px] lg:max-w-[360px] lg:justify-self-end";
