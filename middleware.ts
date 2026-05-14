import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    const { pathname, searchParams } = request.nextUrl;

    // Failed email confirm / magic link often lands on Site URL (e.g. "/") with OAuth-style query params.
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
      if (seg && seg !== "team" && seg !== "login" && seg !== "signup") {
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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
