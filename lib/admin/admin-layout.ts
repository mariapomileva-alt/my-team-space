import { cn } from "@/lib/utils/cn";

/** Premium admin spacing — calm, spacious, Apple/Notion-like */
export const ADMIN_PAGE_BG = "min-h-screen bg-[#f7f7f8]";
export const ADMIN_SHELL_MAX = "mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-8 sm:py-10";
export const ADMIN_CARD = cn(
  "rounded-3xl border border-zinc-200/50 bg-white/90 shadow-[0_8px_40px_-28px_rgba(15,23,42,0.12)] backdrop-blur-sm",
);
export const ADMIN_CARD_PAD = "p-6 sm:p-8";
export const ADMIN_SECTION_GAP = "space-y-8";
export const ADMIN_TITLE = "text-2xl font-bold tracking-tight text-zinc-900 sm:text-[1.65rem]";
export const ADMIN_SUBTITLE = "mt-2 max-w-xl text-[15px] leading-relaxed text-zinc-500";
