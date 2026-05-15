/** Only allow in-app redirects after auth (blocks open redirects). */
export function safeNextPath(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/admin";
  if (raw.includes("://")) return "/admin";
  return raw;
}
