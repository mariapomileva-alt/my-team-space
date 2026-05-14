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
  if (m.includes("invalid login credentials")) {
    return (
      "That email and password don’t match an account we know. Check for typos, try the other email if you have two, " +
      "or use Create an account. If you just registered, open the confirmation email first—until then, sign-in may fail."
    );
  }
  return raw;
}
