/**
 * Prefer non-NEXT_PUBLIC vars on the server: they are not inlined at build time,
 * so Vercel runtime picks them up after you add them and redeploy (even with build cache).
 */

/** Auth + JS client need the project origin only, not /rest/v1/ or other API paths. */
export function normalizeSupabaseProjectUrl(raw: string | undefined): string | undefined {
  if (!raw?.trim()) return undefined;
  try {
    return new URL(raw.trim()).origin;
  } catch {
    return raw.trim().replace(/\/+$/, "");
  }
}

export function getSupabaseUrl(): string | undefined {
  const fromServer = process.env.SUPABASE_URL?.trim();
  const fromPublic = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const v = fromServer || fromPublic;
  return normalizeSupabaseProjectUrl(v);
}

export function getSupabaseAnonKey(): string | undefined {
  const fromServer = process.env.SUPABASE_ANON_KEY?.trim();
  const fromPublic = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const v = fromServer || fromPublic;
  return v || undefined;
}
