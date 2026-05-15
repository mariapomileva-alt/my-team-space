import { createBrowserClient } from "@supabase/ssr";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type BrowserSupabase = NonNullable<ReturnType<typeof createBrowserSupabase>>;

let runtimeConfig: { url: string; anonKey: string } | null = null;
let runtimeConfigPromise: Promise<{ url: string; anonKey: string } | null> | null = null;

async function loadRuntimeConfig(): Promise<{ url: string; anonKey: string } | null> {
  if (runtimeConfig) return runtimeConfig;
  if (!runtimeConfigPromise) {
    runtimeConfigPromise = fetch("/api/auth/public-config")
      .then(async (res) => {
        if (!res.ok) return null;
        const data = (await res.json()) as { url?: string; anonKey?: string };
        if (!data.url || !data.anonKey) return null;
        return { url: data.url, anonKey: data.anonKey };
      })
      .catch(() => null);
  }
  runtimeConfig = await runtimeConfigPromise;
  return runtimeConfig;
}

/** Browser Supabase client: uses build-time NEXT_PUBLIC_* or runtime /api/auth/public-config. */
export async function getBrowserSupabase(): Promise<BrowserSupabase | null> {
  const direct = createBrowserSupabase();
  if (direct) return direct;

  const cfg = await loadRuntimeConfig();
  if (!cfg) return null;
  return createBrowserClient(cfg.url, cfg.anonKey);
}
