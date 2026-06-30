"use client";

import { BuilderGuideContent } from "@/components/builder/builder-guide-content";
import Link from "next/link";

export function TeamGuideClient({
  teamId,
  teamName,
  showAcademyHub = false,
}: {
  teamId: string;
  teamName: string;
  showAcademyHub?: boolean;
}) {
  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <header className="sticky top-0 z-10 border-b border-zinc-200/60 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link
            href={`/admin/team/${teamId}/build`}
            className="text-sm font-semibold text-violet-700 transition hover:text-violet-900"
          >
            ← Back to builder
          </Link>
          <p className="truncate text-sm font-bold text-zinc-900">{teamName}</p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">How it works</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-zinc-500">
            Everything in the builder — what each block and tool does for your team and parents.
          </p>
        </div>
        <BuilderGuideContent isAcademy={showAcademyHub} />
      </main>
    </div>
  );
}
