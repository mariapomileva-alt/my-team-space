/**
 * Prefer non-NEXT_PUBLIC vars on the server: they are not inlined at build time,
 * so Vercel runtime picks them up after you add them and redeploy (even with build cache).
 */
export function getSupabaseUrl(): string | undefined {
  const fromServer = process.env.SUPABASE_URL?.trim();
  const fromPublic = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const v = fromServer || fromPublic;
  return v || undefined;
}

export function getSupabaseAnonKey(): string | undefined {
  const fromServer = process.env.SUPABASE_ANON_KEY?.trim();
  const fromPublic = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const v = fromServer || fromPublic;
  return v || undefined;
}
