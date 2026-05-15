"use client";

import { authCallbackUrl } from "@/lib/auth/callback-url";
import { formatAuthErrorMessage } from "@/lib/auth/format-auth-error";
import { LoginConfigNotice } from "@/components/auth/login-config-notice";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { getBrowserSupabase } from "@/lib/supabase/get-browser-supabase";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginInner() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "1";
  const linkExpired = searchParams.get("error") === "link_expired";
  const authDenied = searchParams.get("error") === "auth_denied";

  const [mode, setMode] = useState<"magic" | "password">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const supabase = await getBrowserSupabase();
    if (!supabase) {
      setErr(
        "Couldn’t connect to Supabase from this page. Hard-refresh (Cmd+Shift+R), then try Continue with Google. If it persists, open /api/auth/public-config — you should see url and anonKey.",
      );
      return;
    }
    const appUrl = window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: authCallbackUrl(appUrl, "/admin") },
    });
    if (error) {
      setErr(formatAuthErrorMessage(error.message));
      return;
    }
    setSent(true);
  }

  async function signInPassword(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const supabase = await getBrowserSupabase();
    if (!supabase) {
      setErr(
        "Couldn’t connect to Supabase from this page. Hard-refresh (Cmd+Shift+R), then try Continue with Google. If it persists, open /api/auth/public-config — you should see url and anonKey.",
      );
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErr(formatAuthErrorMessage(error.message));
      return;
    }
    window.location.assign("/admin");
  }

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Welcome back</h1>
      <p className="mt-1 text-base font-medium text-zinc-700">Your team hub is right here.</p>
      <p className="mt-3 text-sm leading-relaxed text-zinc-600">
        Sign in with the email and password you used when you joined. In a few seconds you&apos;ll be back to
        updating schedules, news, and everything families see—same place, same calm flow.
      </p>

      {linkExpired || authDenied ? (
        <p className="mt-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-relaxed text-sky-950">
          {linkExpired ? (
            <>
              That email link has <strong className="font-semibold">expired</strong> or was already used. Request a
              new confirmation from{" "}
              <Link href="/admin/signup" className="font-semibold text-indigo-700 underline">
                Create an account
              </Link>
              , or sign in below if you&apos;ve already confirmed.
            </>
          ) : (
            <>
              We couldn&apos;t finish signing you in from that link. Try{" "}
              <strong className="font-semibold">Continue with Google</strong>,{" "}
              <strong className="font-semibold">Email &amp; password</strong>, or a fresh{" "}
              <strong className="font-semibold">Magic link</strong>.
            </>
          )}
        </p>
      ) : null}

      <LoginConfigNotice />

      {registered ? (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900 ring-1 ring-emerald-100">
          You&apos;re all set—account created.{" "}
          {mode === "password"
            ? "Pop in your password below and you&apos;re in."
            : "Use Continue with Google above, check your email for a link—or switch to Email & password."}
        </p>
      ) : null}

      <div className="mt-6 space-y-2">
        <GoogleAuthButton nextPath="/admin" onError={setErr} />
        <p className="text-center text-xs leading-relaxed text-zinc-500">
          Fastest way in—no magic-link email. Enable Google under Supabase → Authentication → Providers if needed.
        </p>
      </div>

      <div className="relative my-6" aria-hidden>
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-200" />
        </div>
        <div className="relative flex justify-center text-xs font-medium uppercase tracking-wide text-zinc-400">
          <span className="bg-white px-3">or</span>
        </div>
      </div>

      <div className="mt-0 flex rounded-full bg-zinc-100 p-1 text-sm font-medium text-zinc-600">
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
            Almost there—open your inbox and tap the link we sent you.
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
          <div>
            <label htmlFor="coach-email" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Email
            </label>
            <input
              id="coach-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label htmlFor="coach-password" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Password
            </label>
            <input
              id="coach-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"
            />
          </div>
          <button type="submit" className="w-full rounded-full bg-zinc-900 py-2.5 text-sm font-semibold text-white">
            Sign in
          </button>
        </form>
      )}

      {err ? <p className="mt-4 text-sm text-red-600">{err}</p> : null}

      <p className="mt-8 text-center text-sm text-zinc-600">
        New here?{" "}
        <Link href="/admin/signup" className="font-semibold text-indigo-700 underline">
          Create an account
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
