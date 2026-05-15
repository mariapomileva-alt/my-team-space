"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/** Replaces stale ?error=config when /api/auth/public-config proves env is fine. */
export function LoginConfigNotice() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isConfigError = searchParams.get("error") === "config";
  const [status, setStatus] = useState<"idle" | "checking" | "ok" | "missing">(
    isConfigError ? "checking" : "idle",
  );

  useEffect(() => {
    if (!isConfigError) return;
    let cancelled = false;
    fetch("/api/auth/public-config")
      .then((res) => {
        if (cancelled) return;
        if (res.ok) {
          setStatus("ok");
          router.replace("/admin/login", { scroll: false });
        } else {
          setStatus("missing");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("missing");
      });
    return () => {
      cancelled = true;
    };
  }, [isConfigError, router]);

  if (!isConfigError || status === "idle" || status === "checking") return null;

  if (status === "ok") {
    return (
      <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-relaxed text-emerald-950">
        Supabase is connected. Use <strong>Continue with Google</strong> or email and password below to sign in.
      </p>
    );
  }

  return (
    <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950">
      The app couldn&apos;t load your session on the server. In{" "}
      <strong className="font-semibold text-amber-900">Vercel → Environment Variables</strong> (Production), set{" "}
      <code className="rounded bg-amber-100/90 px-1 text-xs">SUPABASE_URL</code> and{" "}
      <code className="rounded bg-amber-100/90 px-1 text-xs">SUPABASE_ANON_KEY</code> (or the{" "}
      <code className="rounded bg-amber-100/90 px-1 text-xs">NEXT_PUBLIC_*</code> pair), then{" "}
      <Link href="/api/auth/public-config" className="font-semibold underline">
        check this link
      </Link>{" "}
      shows <code className="rounded bg-amber-100/90 px-1 text-xs">url</code> and{" "}
      <code className="rounded bg-amber-100/90 px-1 text-xs">anonKey</code>, then redeploy.
    </p>
  );
}
