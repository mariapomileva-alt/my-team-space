/** OAuth / email links must land on this route so we can exchange the code for a session. */
export function authCallbackUrl(origin: string, nextPath = "/admin"): string {
  const next = nextPath.startsWith("/") ? nextPath : "/admin";
  return `${origin.replace(/\/$/, "")}/auth/callback?next=${encodeURIComponent(next)}`;
}
