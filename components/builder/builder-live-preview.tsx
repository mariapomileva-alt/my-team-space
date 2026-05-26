"use client";

import { TeamShell } from "@/components/mts/team-shell";
import { TeamPageBlocks } from "@/components/mts/team-page-blocks";
import type { TeamSpace } from "@/lib/types";
import { useEffect, useRef } from "react";

const PHONE_W = 360;
const PHONE_H = 612;
const NOTCH_H = 28;
const HOME_H = 24;
const VIEWPORT_H = PHONE_H - NOTCH_H - HOME_H;

function scrollPreviewToBlock(viewport: HTMLElement, target: Element) {
  const vpRect = viewport.getBoundingClientRect();
  const tRect = target.getBoundingClientRect();
  const offset = tRect.top - vpRect.top - vpRect.height / 2 + tRect.height / 2;
  viewport.scrollTop += offset;
}

export function BuilderLivePreview({
  team,
  focusBlockId,
}: {
  team: TeamSpace;
  focusBlockId?: string | null;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);

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
  }, [focusBlockId, team]);

  return (
    <div className="builder-live-preview flex flex-col items-center">
      <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
        Live preview
      </p>

      <div
        className="builder-phone-frame relative box-border shrink-0 overflow-hidden rounded-[2.25rem] border-[7px] border-zinc-900/95 bg-zinc-900 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.45)]"
        style={{ width: PHONE_W, height: PHONE_H, minHeight: PHONE_H, maxHeight: PHONE_H }}
      >
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex items-center justify-center bg-zinc-900"
          style={{ height: NOTCH_H }}
        >
          <span className="h-1 w-16 rounded-full bg-zinc-700" aria-hidden />
        </div>

        <div
          ref={viewportRef}
          className="builder-preview-viewport absolute left-0 right-0 z-0 overflow-x-hidden overflow-y-auto overscroll-contain bg-[#f8fafc]"
          style={{ top: NOTCH_H, height: VIEWPORT_H, width: "100%" }}
        >
          <TeamShell themeId={team.themeId} preview>
            <TeamPageBlocks team={team} hasAccess previewBlockId={focusBlockId} />
          </TeamShell>
        </div>

        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center bg-zinc-900"
          style={{ height: HOME_H }}
        >
          <span className="h-1 w-24 rounded-full bg-zinc-700" aria-hidden />
        </div>
      </div>

      <p className="mt-3 max-w-[280px] text-center text-[11px] leading-relaxed text-zinc-500">
        Phone-sized frame — scroll inside to see the full app.
      </p>
    </div>
  );
}
