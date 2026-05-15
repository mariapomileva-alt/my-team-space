/** Maps common Supabase Auth API messages to clearer copy for coaches. */
export function formatAuthErrorMessage(raw: string): string {
  const m = raw.toLowerCase();
  if (m.includes("email not confirmed") || m.includes("not confirmed")) {
    return "Please confirm your email first—check your inbox (and spam) for the link we sent, then try signing in again.";
  }
  if (m.includes("rate limit") || m.includes("email rate limit")) {
    return (
      "Too many emails were sent from this app in a short time (Supabase’s limit). " +
      "Wait about an hour, then try again—or sign in if you already confirmed your email. " +
      "Check spam for an earlier message. For higher volume, add custom SMTP in Supabase → Authentication → Emails."
    );
  }
  if (m.includes("already registered") || m.includes("user already exists")) {
    return "This email is already registered. Use Sign in instead.";
  }
  if (m.includes("error sending magic link") || m.includes("sending magic link")) {
    return (
      "We couldn’t send the magic-link email (SMTP or provider limits). Try Continue with Google, or Email & password—or fix SMTP under Supabase → Authentication → Emails."
    );
  }
  if (m.includes("provider is not enabled") || m.includes("unsupported provider")) {
    return (
      "Google sign-in isn’t enabled yet. In Supabase → Authentication → Providers, turn on Google and add your Google OAuth Client ID and secret."
    );
  }
  if (m.includes("confirmation email") || m.includes("error sending confirmation")) {
    return (
      "We couldn’t send the confirmation email (SMTP misconfigured, limits, or provider blocking). " +
      "Use Sign up with Google above—no email needed—or in Supabase turn off “Confirm email” under Authentication → Providers → Email, or fix SMTP under Authentication → Emails."
    );
  }
  if (m.includes("invalid login credentials")) {
    return (
      "That email and password don’t match an account we know. Check for typos, try the other email if you have two, " +
      "or use Create an account. If you just registered, open the confirmation email first—until then, sign-in may fail."
    );
  }
  return raw;
}
