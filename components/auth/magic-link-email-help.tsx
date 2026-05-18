"use client";

import {
  supabaseAuthEmailsUrl,
  supabaseAuthProvidersUrl,
  supabaseAuthSmtpUrl,
} from "@/lib/auth/supabase-dashboard";

/** Shown when magic-link send fails or from login magic-tab help. */
export function MagicLinkEmailHelp({ compact }: { compact?: boolean }) {
  const smtpUrl = supabaseAuthSmtpUrl();
  const providersUrl = supabaseAuthProvidersUrl();
  const templatesUrl = supabaseAuthEmailsUrl();

  return (
    <details
      className={`rounded-xl border border-amber-200/90 bg-amber-50/80 text-xs leading-relaxed text-amber-950 ${compact ? "px-3 py-2" : "px-4 py-3"}`}
      open={!compact}
    >
      <summary className="cursor-pointer font-semibold text-amber-900">
        Why magic link email fails (fix in Supabase)
      </summary>
      <ol className="mt-2 list-decimal space-y-2 pl-4">
        <li>
          <strong>Custom SMTP broken</strong> — most common. In{" "}
          {smtpUrl ? (
            <a href={smtpUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-700 underline">
              Authentication → Emails → SMTP
            </a>
          ) : (
            "Supabase → Authentication → Emails → SMTP"
          )}
          , either fix host/port/user/password (Resend: <code className="rounded bg-white/70 px-0.5">smtp.resend.com</code>
          , user <code className="rounded bg-white/70 px-0.5">resend</code>, password = API key) or{" "}
          <strong>turn off custom SMTP</strong> to use Supabase&apos;s default sender.
        </li>
        <li>
          <strong>Free-tier limit</strong> — default Supabase mail is ~2–4 emails/hour per project. Wait an hour or add
          SMTP (Resend, SendGrid, etc.).
        </li>
        <li>
          <strong>Email provider off</strong> —{" "}
          {providersUrl ? (
            <a href={providersUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-700 underline">
              Providers → Email
            </a>
          ) : (
            "Providers → Email"
          )}{" "}
          must be enabled; &quot;Confirm email&quot; can stay off for coaches if you use password or Google.
        </li>
        <li>
          <strong>Workaround now:</strong> use <strong>Continue with Google</strong> or <strong>Email &amp; password</strong> on
          this page — no outbound email needed.
        </li>
      </ol>
      {templatesUrl ? (
        <p className="mt-2 text-[11px] text-amber-800/90">
          Templates:{" "}
          <a href={templatesUrl} target="_blank" rel="noopener noreferrer" className="underline">
            Auth email templates
          </a>
        </p>
      ) : null}
    </details>
  );
}
