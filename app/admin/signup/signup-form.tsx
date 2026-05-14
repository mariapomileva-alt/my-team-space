"use client";

import { formatAuthErrorMessage } from "@/lib/auth/format-auth-error";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function AdminSignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";
  const [originHint, setOriginHint] = useState<string | null>(null);
  const [alternateOrigin, setAlternateOrigin] = useState<string | null>(null);

  useEffect(() => {
    const o = window.location.origin;
    setOriginHint(o);
    try {
      const u = new URL(o);
      const host = u.hostname;
      if (host.startsWith("www.") && host.length > 4) {
        setAlternateOrigin(`${u.protocol}//${host.slice(4)}`);
      } else if (!host.startsWith("www.")) {
        setAlternateOrigin(`${u.protocol}//www.${host}`);
      } else {
        setAlternateOrigin(null);
      }
    } catch {
      setAlternateOrigin(null);
    }
  }, []);

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
        "This page can’t reach your database from the browser. In Vercel → Environment Variables (Production), set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then redeploy without build cache so the sign-up form can load them.",
      );
      return;
    }
    setPending(true);
    // Always use the tab’s origin so email links match www vs non-www and Supabase Redirect URLs.
    const appUrl = window.location.origin;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${appUrl}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    setPending(false);
    if (error) {
      setErr(formatAuthErrorMessage(error.message));
      return;
    }
    if (data.session) {
      router.replace(next);
      router.refresh();
      return;
    }
    // Email confirmations on: no session yet. Empty identities usually means this email is already registered.
    const identities = data.user?.identities ?? [];
    if (data.user && identities.length === 0) {
      setErr(
        "This email is already registered. Use Sign in below—or reset the password from the login page if you forgot it.",
      );
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

      <div className="mt-5 space-y-2">
        <GoogleAuthButton nextPath={next} onError={setErr} label="Sign up with Google" />
        <p className="text-center text-xs leading-relaxed text-zinc-500">
          No confirmation email—enable Google under Supabase → Authentication → Providers.
        </p>
      </div>

      <div className="relative my-5" aria-hidden>
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-200" />
        </div>
        <div className="relative flex justify-center text-xs font-medium uppercase tracking-wide text-zinc-400">
          <span className="bg-white px-3">or email</span>
        </div>
      </div>

      <p className="mt-4 rounded-lg bg-zinc-50 px-3 py-2 text-xs leading-relaxed text-zinc-600 ring-1 ring-zinc-100">
        <span className="font-semibold text-zinc-700">Email link setup:</span> In Supabase open{" "}
        <span className="font-medium">Authentication → URL configuration</span>. Under{" "}
        <span className="font-medium">Redirect URLs</span>, add every hostname you use, for example:{" "}
        {originHint ? (
          <>
            <code className="mt-1 block break-all rounded bg-white px-2 py-1 font-mono text-[11px] text-zinc-800">
              {originHint}/auth/callback
            </code>
            {alternateOrigin ? (
              <code className="mt-1 block break-all rounded bg-white px-2 py-1 font-mono text-[11px] text-zinc-800">
                {alternateOrigin}/auth/callback
              </code>
            ) : null}
          </>
        ) : (
          <span className="font-mono text-[11px]">https://your-domain/auth/callback</span>
        )}
        <span className="mt-1 block">
          Set <span className="font-medium">Site URL</span> to the same host you usually open (with or without{" "}
          <code className="rounded bg-white px-1 font-mono text-[11px]">www</code>).
        </span>
      </p>

      {done ? (
        <div className="mt-6 space-y-3 rounded-xl bg-sky-50 px-4 py-3 text-sm leading-relaxed text-sky-950 ring-1 ring-sky-100">
          <p>
            If we sent you a confirmation email, tap the link inside—then{" "}
            <Link href="/admin/login?registered=1" className="font-semibold underline">
              sign in
            </Link>{" "}
            to open your dashboard. No email? You may already be in—try signing in.
          </p>
          <button
            type="button"
            onClick={() => setDone(false)}
            className="text-left text-sm font-semibold text-indigo-700 underline decoration-indigo-300 underline-offset-2 hover:text-indigo-800"
          >
            Show the sign-up form again
          </button>
        </div>
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
