"use client";

import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { OwnerSetupChecklist } from "@/components/auth/owner-setup-checklist";
import { authCallbackUrl } from "@/lib/auth/callback-url";
import { formatAuthErrorMessage } from "@/lib/auth/format-auth-error";
import { getBrowserSupabase } from "@/lib/supabase/get-browser-supabase";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function OrDivider({ label }: { label: string }) {
  return (
    <AuthDividerShell>
      <AuthDividerLine />
      <AuthDividerLabel label={label} />
    </AuthDividerShell>
  );
}

function AuthDividerShell({ children }: { children: React.ReactNode }) {
  return <div className="relative my-6" aria-hidden>{children}</div>;
}

function AuthDividerLine() {
  return (
    <div className="absolute inset-0 flex items-center">
      <span className="w-full border-t border-zinc-200" />
    </div>
  );
}

function AuthDividerLabel({ label }: { label: string }) {
  return (
    <div className="relative flex justify-center text-xs font-medium uppercase tracking-wide text-zinc-400">
      <span className="bg-white px-3">{label}</span>
    </div>
  );
}

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
    const supabase = await getBrowserSupabase();
    if (!supabase) {
      setErr(
        "Couldn’t connect to Supabase from this page. Hard-refresh (Cmd+Shift+R), then try Sign up with Google. If it persists, open /api/auth/public-config — you should see url and anonKey.",
      );
      return;
    }
    setPending(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: authCallbackUrl(window.location.origin, next),
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
    const identities = data.user?.identities ?? [];
    if (data.user && identities.length === 0) {
      setErr(
        "This email is already registered. Sign in on the login page—or use Sign up with Google if that’s how you joined.",
      );
      return;
    }
    setDone(true);
  }

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Create your coach account</h1>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">
        Use Google for instant access, or create an account with email and password.
      </p>

      <div className="mt-6 space-y-2">
        <GoogleAuthButton nextPath={next} onError={setErr} label="Sign up with Google" />
        <p className="text-center text-xs text-zinc-500">Recommended — no confirmation email.</p>
      </div>

      <OrDivider label="or with email" />

      {done ? (
        <DoneMessage onBack={() => setDone(false)} />
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
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
          <PasswordFields
            password={password}
            setPassword={setPassword}
            confirm={confirm}
            setConfirm={setConfirm}
          />
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-zinc-900 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {pending ? "Creating account…" : "Create account with email"}
          </button>
        </form>
      )}

      {err ? <p className="mt-4 text-sm leading-relaxed text-red-600">{err}</p> : null}

      <OwnerSetupChecklist />

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

function PasswordFields({
  password,
  setPassword,
  confirm,
  setConfirm,
}: {
  password: string;
  setPassword: (v: string) => void;
  confirm: string;
  setConfirm: (v: string) => void;
}) {
  return (
    <>
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
    </>
  );
}

function DoneMessage({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-3 rounded-xl bg-sky-50 px-4 py-3 text-sm leading-relaxed text-sky-950 ring-1 ring-sky-100">
      <p>
        Check your inbox for a confirmation link (and spam). Then{" "}
        <Link href="/admin/login?registered=1" className="font-semibold underline">
          sign in
        </Link>
        . Prefer no email? Use <strong>Sign up with Google</strong> above.
      </p>
      <button type="button" onClick={onBack} className="text-left text-sm font-semibold text-indigo-700 underline">
        Back to the form
      </button>
    </div>
  );
}
