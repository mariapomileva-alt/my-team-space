import { createClient } from "@supabase/supabase-js";

/**
 * Anonymous Supabase client (no cookies / no user session).
 * Use for public team pages only — RLS allows anon SELECT where policies permit.
 * Keeps `/team/[slug]` compatible with ISR and `unstable_cache` (no `cookies()` dynamic).
 */
export function createPublicSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
