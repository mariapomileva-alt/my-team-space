import { canonicalRedirectIfNeeded } from "@/lib/auth/app-origin";
import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    const canonical = canonicalRedirectIfNeeded(request);
    if (canonical) return canonical;

    const { pathname, searchParams } = request.nextUrl;

    // OAuth / magic link sometimes lands with ?code= on Site URL "/" or "/admin" instead of /auth/callback.
    const code = searchParams.get("code");
    if (code && (pathname === "/" || pathname === "/admin")) {
      const cb = new URL("/auth/callback", request.url);
      cb.searchParams.set("code", code);
      const state = searchParams.get("state");
      if (state) cb.searchParams.set("state", state);
      const next = searchParams.get("next") ?? (pathname === "/admin" ? "/admin" : undefined);
      if (next) cb.searchParams.set("next", next);
      return NextResponse.redirect(cb);
    }

    const oidcError = searchParams.get("error");
    const errorCode = searchParams.get("error_code");
    if (oidcError && pathname === "/") {
      const loginUrl = new URL("/admin/login", request.url);
      if (errorCode === "otp_expired" || oidcError === "access_denied") {
        loginUrl.searchParams.set("error", "link_expired");
      } else {
        loginUrl.searchParams.set("error", "auth_denied");
      }
      return NextResponse.redirect(loginUrl);
    }

    if (pathname.match(/^\/admin\/[^/]+$/) && pathname !== "/admin/login") {
      const seg = pathname.split("/")[2] ?? "";
      if (seg && seg !== "team" && seg !== "login" && seg !== "signup" && seg !== "accept-invite") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }

    return await updateSession(request);
  } catch {
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: [
    "/",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
