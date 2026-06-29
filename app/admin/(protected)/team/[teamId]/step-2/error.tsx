"use client";

import Link from "next/link";

export default function TeamStep2Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 py-16 text-center text-zinc-900">
      <p className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Team builder</p>
      <h1 className="mt-3 max-w-md text-xl font-bold tracking-tight">This page couldn&apos;t load</h1>
      <p className="mt-2 max-w-sm text-sm text-zinc-600">
        A server error occurred. You can reload or go back to your teams.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          Reload
        </button>
        <Link
          href="/admin"
          className="rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
        >
          All teams
        </Link>
      </div>
    </div>
  );
}
