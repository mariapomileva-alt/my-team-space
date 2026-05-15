"use client";

import { authCallbackUrl } from "@/lib/auth/callback-url";
import { supabaseAuthProvidersUrl, supabaseAuthUrlConfigUrl } from "@/lib/auth/supabase-dashboard";
import { useEffect, useState } from "react";

/** One-time Supabase + Google steps so coaches can register (shown on signup for project owners). */
export function OwnerSetupChecklist() {
  const [callbacks, setCallbacks] = useState<string[]>([]);
  const providersUrl = supabaseAuthProvidersUrl();
  const urlConfigUrl = supabaseAuthUrlConfigUrl();

  useEffect(() => {
    const o = window.location.origin;
    const list = [authCallbackUrl(o)];
    try {
      const u = new URL(o);
      const host = u.hostname;
      const alt = host.startsWith("www.")
        ? `${u.protocol}//${host.slice(4)}`
        : `${u.protocol}//www.${host}`;
      if (alt !== o) list.push(authCallbackUrl(alt));
    } catch {
      /* ignore */
    }
    setCallbacks(list);
  }, []);

  return (
    <details className="mt-4 rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3 text-xs leading-relaxed text-amber-950">
      <summary className="cursor-pointer font-semibold text-amber-900">Project owner: one-time auth setup</summary>
      <ol className="mt-3 list-decimal space-y-2 pl-4">
        <li>
          <strong>Google sign-up:</strong>{" "}
          {providersUrl ? (
            <a href={providersUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-700 underline">
              Supabase → Providers → Google
            </a>
          ) : (
            "Supabase → Authentication → Providers → Google"
          )}{" "}
          — enable, paste Client ID + secret from Google Cloud. Redirect URI in Google must be{" "}
          <code className="rounded bg-white/80 px-1">https://YOUR-PROJECT.supabase.co/auth/v1/callback</code>.
        </li>
        <li>
          <strong>Redirect URLs:</strong>{" "}
          {urlConfigUrl ? (
            <a href={urlConfigUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-700 underline">
              URL configuration
            </a>
          ) : (
            "Authentication → URL configuration"
          )}{" "}
          — add:
          <ul className="mt-1 list-disc pl-4">
            {callbacks.map((c) => (
              <li key={c}>
                <code className="break-all rounded bg-white/80 px-1 font-mono text-[10px]">{c}</code>
              </li>
            ))}
          </ul>
        </li>
        <li>
          <strong>Email sign-up (no broken SMTP):</strong> Providers → Email → turn <strong>off</strong>{" "}
          &quot;Confirm email&quot;, or fix SMTP under Authentication → Emails. If custom SMTP fails, disable it and use
          Supabase default mail, or rely on Google only.
        </li>
      </ol>
    </details>
  );
}
