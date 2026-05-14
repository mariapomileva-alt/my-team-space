import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.match(/^\/admin\/[^/]+$/) && pathname !== "/admin/login") {
    const seg = pathname.split("/")[2] ?? "";
    if (seg && seg !== "team" && seg !== "login") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
