/** Canonical app URL for OAuth redirects (production). Set in Vercel: NEXT_PUBLIC_SITE_URL */
export function getAppOrigin(fallbackOrigin?: string): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (typeof window !== "undefined") return window.location.origin.replace(/\/$/, "");
  return fallbackOrigin?.replace(/\/$/, "") ?? "";
}

/** 308 redirect to canonical host when NEXT_PUBLIC_SITE_URL is set (fixes old domains + www). */
export function canonicalRedirectIfNeeded(request: Request): Response | null {
  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!site) return null;

  let canonical: URL;
  try {
    canonical = new URL(site);
  } catch {
    return null;
  }

  const reqUrl = new URL(request.url);
  const reqHost = reqUrl.host;
  const canonicalHost = canonical.host;

  if (reqHost === canonicalHost) return null;

  const bare = canonicalHost.startsWith("www.") ? canonicalHost.slice(4) : null;
  const withWww = bare ? `www.${bare}` : null;
  if (bare && (reqHost === bare || reqHost === withWww)) return null;

  const target = new URL(request.url);
  target.protocol = canonical.protocol;
  target.host = canonicalHost;
  return Response.redirect(target.toString(), 308);
}
