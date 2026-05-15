import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";
import { NextResponse } from "next/server";

/** Public anon key + project URL for browser auth when NEXT_PUBLIC_* was not baked into the client bundle. */
export async function GET() {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  if (!url || !anonKey) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }
  return NextResponse.json(
    { url, anonKey },
    {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    },
  );
}
