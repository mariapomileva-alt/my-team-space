"use client";

import { TeamShell } from "@/components/mts/team-shell";
import { TeamPageBlocks } from "@/components/mts/team-page-blocks";
import {
  BUILDER_DESKTOP_CHROME_H,
  BUILDER_DESKTOP_FRAME_H,
  BUILDER_PHONE_H,
  BUILDER_PHONE_HOME_H,
  BUILDER_PHONE_NOTCH_H,
  BUILDER_PHONE_VIEWPORT_H,
  BUILDER_PHONE_W,
  BUILDER_PREVIEW_COLUMN_W,
  type BuilderPreviewMode,
} from "@/lib/builder/preview";
import type { TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, type CSSProperties, type RefObject } from "react";

function scrollPreviewToBlock(viewport: HTMLElement, target: Element) {
  const vpRect = viewport.getBoundingClientRect();
  const tRect = target.getBoundingClientRect();
  const offset = tRect.top - vpRect.top - vpRect.height / 2 + tRect.height / 2;
  viewport.scrollTop += offset;
}

function usePreviewFocus(
  viewportRef: RefObject<HTMLDivElement | null>,
  focusBlockId: string | null | undefined,
  team: TeamSpace,
) {
  useEffect(() => {
    const root = viewportRef.current;
    if (!root) return;
    root.querySelectorAll("[data-preview-block-id].preview-block-focus").forEach((el) => {
      el.classList.remove("preview-block-focus");
    });
    if (!focusBlockId) return;
    const target = root.querySelector(`[data-preview-block-id="${focusBlockId}"]`);
    if (!target) return;
    target.classList.add("preview-block-focus");
    scrollPreviewToBlock(root, target);
  }, [focusBlockId, team, viewportRef]);
}

function PreviewContent({
  team,
  focusBlockId,
}: {
  team: TeamSpace;
  focusBlockId?: string | null;
}) {
  return (
    <TeamShell themeId={team.themeId} preview>
      <TeamPageBlocks team={team} hasAccess previewBlockId={focusBlockId} />
    </TeamShell>
  );
}

export function BuilderPreviewViewport({
  team,
  mode,
  focusBlockId,
  className,
  phoneClassName,
  desktopClassName,
}: {
  team: TeamSpace;
  mode: BuilderPreviewMode;
  focusBlockId?: string | null;
  className?: string;
  phoneClassName?: string;
  desktopClassName?: string;
}) {
  const mobileRef = useRef<HTMLDivElement>(null);
  const desktopRef = useRef<HTMLDivElement>(null);

  usePreviewFocus(mobileRef, focusBlockId, team);
  usePreviewFocus(desktopRef, focusBlockId, team);

  const phoneStyle = {
    "--preview-phone-w": `${BUILDER_PHONE_W}px`,
    "--preview-phone-h": `${BUILDER_PHONE_H}px`,
    "--preview-phone-notch": `${BUILDER_PHONE_NOTCH_H}px`,
    "--preview-phone-home": `${BUILDER_PHONE_HOME_H}px`,
    "--preview-phone-viewport": `${BUILDER_PHONE_VIEWPORT_H}px`,
  } as CSSProperties;

  return (
    <div className={cn("builder-preview-stage relative w-full", className)} data-preview-mode={mode}>
      <AnimatePresence mode="wait" initial={false}>
        {mode === "mobile" ? (
          <motion.div
            key="mobile"
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={cn("mx-auto flex justify-center", phoneClassName)}
            style={phoneStyle}
          >
            <div
              className="builder-phone-frame relative shrink-0 overflow-hidden rounded-[2rem] border-[6px] border-zinc-900/95 bg-zinc-950 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.45),0_0_0_1px_rgba(255,255,255,0.06)_inset]"
              style={{
                width: BUILDER_PHONE_W,
                height: BUILDER_PHONE_H,
              }}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-center bg-zinc-900"
                style={{ height: BUILDER_PHONE_NOTCH_H }}
              >
                <span className="h-1 w-12 rounded-full bg-zinc-600" aria-hidden />
              </div>
              <div
                ref={mobileRef}
                className="builder-preview-viewport absolute inset-x-0 z-0 overflow-x-hidden overflow-y-auto overscroll-contain"
                style={{ top: BUILDER_PHONE_NOTCH_H, height: BUILDER_PHONE_VIEWPORT_H }}
              >
                <PreviewContent team={team} focusBlockId={focusBlockId} />
              </div>
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-center bg-zinc-900"
                style={{ height: BUILDER_PHONE_HOME_H }}
              >
                <span className="h-0.5 w-16 rounded-full bg-zinc-600" aria-hidden />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="desktop"
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={cn("mx-auto w-full", desktopClassName)}
            style={{ maxWidth: BUILDER_PREVIEW_COLUMN_W }}
          >
            <div className="builder-desktop-frame overflow-hidden rounded-2xl border border-zinc-200/60 bg-zinc-100/90 shadow-[0_16px_48px_-20px_rgba(15,23,42,0.18)] ring-1 ring-black/[0.03]">
              <div
                className="flex items-center gap-1.5 border-b border-zinc-200/80 bg-zinc-50/95 px-2.5"
                style={{ height: BUILDER_DESKTOP_CHROME_H }}
              >
                <span className="h-2 w-2 rounded-full bg-red-400/90" aria-hidden />
                <span className="h-2 w-2 rounded-full bg-amber-400/90" aria-hidden />
                <span className="h-2 w-2 rounded-full bg-emerald-400/90" aria-hidden />
                <span className="ml-1 min-w-0 flex-1 truncate rounded-md bg-white px-2 py-0.5 text-[9px] text-zinc-400 ring-1 ring-zinc-200/80">
                  myteamspace.cc/team/{team.slug}
                </span>
              </div>
              <div
                ref={desktopRef}
                className="builder-preview-viewport builder-desktop-viewport overflow-x-hidden overflow-y-auto bg-white"
                style={{ height: BUILDER_DESKTOP_FRAME_H - BUILDER_DESKTOP_CHROME_H }}
              >
                <PreviewContent team={team} focusBlockId={focusBlockId} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
