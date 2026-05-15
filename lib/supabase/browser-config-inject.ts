export type BrowserSupabaseConfig = { url: string; anonKey: string };

let injected: BrowserSupabaseConfig | null = null;

export function setBrowserSupabaseConfig(cfg: BrowserSupabaseConfig | null) {
  injected = cfg;
}

export function getBrowserSupabaseConfig(): BrowserSupabaseConfig | null {
  return injected;
}
