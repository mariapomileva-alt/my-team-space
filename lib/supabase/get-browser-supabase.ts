import { getBrowserSupabaseConfig } from "@/lib/supabase/browser-config-inject";
import { createBrowserClient } from "@supabase/ssr";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type BrowserSupabase = NonNullable<ReturnType<typeof createBrowserSupabase>>;

let runtimeConfig: { url: string; anonKey: string } | null = null;
let runtimeConfigPromise: Promise<{ url: string; anonKey: string } | null> | null = null;

async function loadRuntimeConfig(): Promise<{ url: string; anonKey: string } | null> {
  if (runtimeConfig) return runtimeConfig;
  if (!runtimeConfigPromise) {
    const endpoint =
      typeof window !== "undefined"
        ? `${window.location.origin}/api/auth/public-config`
        : "/api/auth/public-config";
    runtimeConfigPromise = fetch(endpoint, { cache: "no-store" })
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

  const injected = getBrowserSupabaseConfig();
  if (injected) return createBrowserClient(injected.url, injected.anonKey);

  const cfg = await loadRuntimeConfig();
  if (!cfg) return null;
  return createBrowserClient(cfg.url, cfg.anonKey);
}
