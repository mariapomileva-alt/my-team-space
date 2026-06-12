"use client";

import { TeamShareBar } from "@/components/builder/team-share-bar";
import type { ReactNode } from "react";
import { BUILDER_TOOLBAR_SURFACE } from "@/lib/builder/layout";
import Link from "next/link";
import { motion } from "framer-motion";

export function BuilderToolbar({
  teamName,
  saveLabel,
  saveState,
  saveError,
  pending,
  publicUrl,
  parentShareUrl,
  shareHint,
  progress,
  billingStatus,
  editLocked = false,
  canPublish = true,
  onPublish,
  onPreview,
  shareExpanded = false,
}: {
  teamName: string;
  saveLabel: string;
  saveState: "idle" | "saving" | "saved" | "error";
  saveError?: string | null;
  pending: boolean;
  publicUrl: string;
  parentShareUrl: string;
  shareHint?: string;
  progress?: ReactNode;
  billingStatus?: ReactNode;
  editLocked?: boolean;
  canPublish?: boolean;
  onPublish: () => void;
  onPreview: () => void;
  /** When false, share bar is hidden until user opens overview — keeps header compact */
  shareExpanded?: boolean;
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-2 z-40 mb-3 w-full lg:top-3"
    >
      <div className={`${BUILDER_TOOLBAR_SURFACE} flex-col !items-stretch`}>
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-base font-semibold tracking-tight text-zinc-900 sm:text-[17px]">
                {teamName || "Your team"}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  saveState === "error"
                    ? "bg-red-50 text-red-700 ring-1 ring-red-100"
                    : saveState === "saving"
                      ? "bg-amber-50 text-amber-800 ring-1 ring-amber-100"
                      : "bg-zinc-100/80 text-zinc-600 ring-1 ring-zinc-200/60"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    saveState === "saving"
                      ? "animate-pulse bg-amber-400"
                      : saveState === "error"
                        ? "bg-red-500"
                        : "bg-emerald-500"
                  }`}
                  aria-hidden
                />
                {saveLabel}
              </span>
            </div>
            {saveState === "error" && saveError ? (
              <p className="mt-1 max-w-md text-[11px] leading-snug text-red-600" title={saveError}>
                {saveError}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onPreview}
              className="rounded-full border border-zinc-200/70 bg-white px-3.5 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 active:scale-[0.98]"
            >
              Preview
            </button>
            <Link
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full border border-zinc-200/70 bg-white px-3.5 py-2 text-xs font-medium text-zinc-600 sm:inline-flex hover:bg-zinc-50"
            >
              Open page
            </Link>
            {canPublish ? (
              <button
                type="button"
                disabled={pending || editLocked}
                title={
                  editLocked
                    ? "Update billing or choose your active team to publish"
                    : saveLabel.includes("Publishing locked") || saveLabel.includes("required")
                      ? saveLabel
                      : undefined
                }
                onClick={onPublish}
                className="rounded-full bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_4px_16px_-6px_rgba(124,58,237,0.45)] transition hover:bg-violet-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pending ? "Publishing…" : editLocked ? "Locked" : "Publish"}
              </button>
            ) : null}
          </div>
        </div>

        {progress ? <div className="mt-2.5 w-full border-t border-zinc-100/80 pt-2.5">{progress}</div> : null}
        {shareExpanded ? <TeamShareBar url={parentShareUrl} hint={shareHint} /> : null}
        {billingStatus && shareExpanded ? (
          <div className="mt-1 w-full border-t border-zinc-100/60 pt-1.5">{billingStatus}</div>
        ) : null}
      </div>
    </motion.header>
  );
}
