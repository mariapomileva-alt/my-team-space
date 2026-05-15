"use client";

import { setBrowserSupabaseConfig } from "@/lib/supabase/browser-config-inject";
import { useLayoutEffect } from "react";

/** Passes server-read Supabase URL + anon key into client auth (no build-time NEXT_PUBLIC required). */
export function SupabaseConfigInjector({
  url,
  anonKey,
  children,
}: {
  url?: string;
  anonKey?: string;
  children: React.ReactNode;
}) {
  useLayoutEffect(() => {
    if (url && anonKey) {
      setBrowserSupabaseConfig({ url, anonKey });
    } else {
      setBrowserSupabaseConfig(null);
    }
    return () => setBrowserSupabaseConfig(null);
  }, [url, anonKey]);

  return children;
}
