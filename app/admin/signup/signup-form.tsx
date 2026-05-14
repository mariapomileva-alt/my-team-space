"use client";

import { createBrowserSupabase } from "@/lib/supabase/browser";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function AdminSignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (password.length < 8) {
      setErr("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setErr("Passwords do not match.");
      return;
    }
    const supabase = createBrowserSupabase();
    if (!supabase) {
      setErr(
        "This build doesn’t include Supabase settings. In Vercel → Environment Variables, add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY for Production, then Redeploy (disable “Use existing Build Cache” if the message persists).",
      );
      return;
    }
    setPending(true);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${appUrl}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    setPending(false);
    if (error) {
      setErr(error.message);
      return;
    }
    if (data.session) {
      router.replace(next);
      router.refresh();
      return;
    }
    setDone(true);
  }

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Create your coach account</h1>
      <p className="mt-1 text-base font-medium text-zinc-700">One email, one password—that&apos;s your key to the editor.</p>
      <p className="mt-3 text-sm leading-relaxed text-zinc-600">
        You&apos;ll use these details every time you come back to update your team page. Your login is stored securely.
        Already registered?{" "}
        <Link href="/admin/login" className="font-semibold text-indigo-600 underline">
          Sign in here
        </Link>
        .
      </p>

      {done ? (
        <p className="mt-6 rounded-xl bg-sky-50 px-4 py-3 text-sm leading-relaxed text-sky-950 ring-1 ring-sky-100">
          If we sent you a confirmation email, tap the link inside—then{" "}
          <Link href="/admin/login?registered=1" className="font-semibold underline">
            sign in
          </Link>{" "}
          to open your dashboard. No email? You may already be in—try signing in.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-500">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-500">Password (8+ characters)</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"
              placeholder="At least 8 characters"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-500">Confirm password</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-zinc-900 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {pending ? "One moment…" : "Get started"}
          </button>
        </form>
      )}

      {err ? <p className="mt-4 text-sm text-red-600">{err}</p> : null}

      <p className="mt-8 text-center text-sm text-zinc-600">
        Already have an account?{" "}
        <Link href="/admin/login" className="font-semibold text-indigo-700 underline">
          Sign in
        </Link>
      </p>
      <p className="mt-4 text-center text-xs text-zinc-500">
        <Link href="/" className="underline">
          Back to home
        </Link>
      </p>
    </>
  );
}
