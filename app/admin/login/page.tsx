"use client";

import { createBrowserSupabase } from "@/lib/supabase/browser";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginInner() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "1";

  const [mode, setMode] = useState<"magic" | "password">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  async function signInPassword(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const supabase = createBrowserSupabase();
    if (!supabase) {
      setErr("Supabase is not configured (missing env).");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErr(error.message);
      return;
    }
    window.location.assign("/admin");
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-zinc-900">Coach login</h1>
      <p className="mt-2 text-sm text-zinc-600">Sign in to edit your team pages. Data is stored in Supabase under your account.</p>

      {registered ? (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900 ring-1 ring-emerald-100">
          Account created. {mode === "password" ? "Sign in with your password below." : "Use magic link or password."}
        </p>
      ) : null}

      <div className="mt-6 flex rounded-full bg-zinc-100 p-1 text-sm font-medium text-zinc-600">
        <button
          type="button"
          className={`flex-1 rounded-full py-2 transition ${mode === "password" ? "bg-white text-zinc-900 shadow-sm" : ""}`}
          onClick={() => {
            setMode("password");
            setErr(null);
            setSent(false);
          }}
        >
          Email & password
        </button>
        <button
          type="button"
          className={`flex-1 rounded-full py-2 transition ${mode === "magic" ? "bg-white text-zinc-900 shadow-sm" : ""}`}
          onClick={() => {
            setMode("magic");
            setErr(null);
            setSent(false);
          }}
        >
          Magic link
        </button>
      </div>

      {mode === "magic" ? (
        sent ? (
          <p className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900 ring-1 ring-emerald-100">
            Check your inbox for the login link.
          </p>
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
        )
      ) : (
        <form onSubmit={signInPassword} className="mt-6 space-y-4">
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"
          />
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"
          />
          <button type="submit" className="w-full rounded-full bg-zinc-900 py-2.5 text-sm font-semibold text-white">
            Sign in
          </button>
        </form>
      )}

      {err ? <p className="mt-4 text-sm text-red-600">{err}</p> : null}

      <p className="mt-8 text-center text-sm text-zinc-600">
        New coach?{" "}
        <Link href="/admin/signup" className="font-semibold text-zinc-900 underline">
          Create account
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

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <LoginInner />
      </Suspense>
    </div>
  );
}
