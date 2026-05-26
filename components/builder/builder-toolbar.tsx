"use client";

import { TeamShareBar } from "@/components/builder/team-share-bar";
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
  onPublish: () => void;
  onPreview: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-3 z-50 mb-6 w-full"
    >
      <motion.div className={`${BUILDER_TOOLBAR_SURFACE} flex-col !items-stretch`}>
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-600">Building your team app</p>
          <h1 className="truncate text-lg font-bold tracking-tight text-zinc-900 sm:text-xl">{teamName}</h1>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500">
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
          <button
            type="button"
            disabled={pending}
            onClick={onPublish}
            className="rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-[0_6px_24px_-6px_rgba(99,102,241,0.55)] transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
          >
            {pending ? "Publishing…" : "Publish ✦"}
          </button>
        </div>
        </div>
        <TeamShareBar url={parentShareUrl} hint={shareHint} />
      </motion.div>
    </motion.div>
  );
}
