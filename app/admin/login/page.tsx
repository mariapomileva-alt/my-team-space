"use client";

import { createBrowserSupabase } from "@/lib/supabase/browser";
import Link from "next/link";
import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const supabase = createBrowserSupabase();
    if (!supabase) {
      setErr("Supabase is not configured (missing env).");
      return;
    }
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${appUrl}/auth/callback?next=/admin` },
    });
    if (error) {
      setErr(error.message);
      return;
    }
    setSent(true);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-2xl font-bold text-zinc-900">Coach login</h1>
      <p className="mt-2 text-sm text-zinc-600">We&apos;ll email you a magic link to myteamspace.cc/admin</p>
      {sent ? (
        <p className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900 ring-1 ring-emerald-100">Check your inbox for the login link.</p>
      ) : (
        <form onSubmit={sendLink} className="mt-6 space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"
          />
          <button type="submit" className="w-full rounded-full bg-zinc-900 py-2.5 text-sm font-semibold text-white">
            Send magic link
          </button>
        </form>
      )}
      {err ? <p className="mt-4 text-sm text-red-600">{err}</p> : null}
      <p className="mt-8 text-center text-xs text-zinc-500">
        <Link href="/" className="underline">
          Back to home
        </Link>
      </p>
    </div>
  );
}
