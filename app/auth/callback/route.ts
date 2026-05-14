import { createServerClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";
  const oidcError = searchParams.get("error");
  const errorCode = searchParams.get("error_code");

  if (!code && (oidcError || errorCode)) {
    const login = new URL("/admin/login", origin);
    if (errorCode === "otp_expired" || oidcError === "access_denied") {
      login.searchParams.set("error", "link_expired");
    } else {
      login.searchParams.set("error", "auth_denied");
    }
    return NextResponse.redirect(login);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/admin/login?error=missing_code`);
  }

  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) {
    return NextResponse.redirect(`${origin}/admin/login?error=config`);
  }

  const response = NextResponse.redirect(`${origin}${next}`);

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/admin/login?error=${encodeURIComponent(error.message)}`);
  }

  return response;
}
