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
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-2 z-50 mb-3 w-full lg:top-3"
    >
      <motion.div className={`${BUILDER_TOOLBAR_SURFACE} flex-col !items-stretch`}>
        <div className="flex w-full flex-wrap items-center justify-between gap-2 sm:gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-600">Page builder</p>
          <h1 className="truncate text-base font-bold tracking-normal text-zinc-900 sm:text-lg">{teamName}</h1>
          <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-zinc-500">
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                saveState === "saving"
                  ? "animate-pulse bg-amber-400"
                  : saveState === "error"
                    ? "bg-red-500"
                    : "bg-emerald-500"
              }`}
              aria-hidden
            />
            {saveLabel}
          </p>
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
            className="rounded-full border border-zinc-200/90 bg-white/90 px-3.5 py-2 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 active:scale-[0.98]"
          >
            Preview
          </button>
          <Link
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full border border-zinc-200/90 bg-white/90 px-3.5 py-2 text-xs font-semibold text-zinc-600 sm:inline-flex"
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
              className="rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-[0_6px_24px_-6px_rgba(99,102,241,0.55)] transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? "Publishing…" : editLocked ? "Publish locked" : "Publish ✦"}
            </button>
          ) : null}
        </div>
        </div>
        {progress ? <div className="mt-2 w-full border-t border-zinc-100/80 pt-2">{progress}</div> : null}
        <TeamShareBar url={parentShareUrl} hint={shareHint} />
        {billingStatus ? <div className="mt-1 w-full border-t border-zinc-100/60 pt-1.5">{billingStatus}</div> : null}
      </motion.div>
    </motion.div>
  );
}
