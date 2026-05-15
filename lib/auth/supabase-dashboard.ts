import { getSupabaseUrl } from "@/lib/supabase/env";

export function supabaseProjectRef(): string | null {
  const url = getSupabaseUrl();
  if (!url) return null;
  try {
    const host = new URL(url).hostname;
    const ref = host.split(".")[0];
    return ref && ref !== "localhost" ? ref : null;
  } catch {
    return null;
  }
}

export function supabaseAuthProvidersUrl(): string | null {
  const ref = supabaseProjectRef();
  return ref ? `https://supabase.com/dashboard/project/${ref}/auth/providers` : null;
}

export function supabaseAuthUrlConfigUrl(): string | null {
  const ref = supabaseProjectRef();
  return ref ? `https://supabase.com/dashboard/project/${ref}/auth/url-configuration` : null;
}

export function supabaseAuthEmailsUrl(): string | null {
  const ref = supabaseProjectRef();
  return ref ? `https://supabase.com/dashboard/project/${ref}/auth/templates` : null;
}
