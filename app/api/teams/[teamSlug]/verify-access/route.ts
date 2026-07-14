import { createPublicSupabase } from "@/lib/supabase/public-client";
import { TEAM_ACCESS_GRANTED, teamAccessCookieName } from "@/lib/team-access";
import { normalizeTeamSlug } from "@/lib/teams/public-url";
import { NextResponse } from "next/server";

type Body = { code?: string };

const COOKIE_MAX_AGE = 60 * 60 * 24 * 90;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ teamSlug: string }> },
) {
  const { teamSlug } = await params;
  const slug = normalizeTeamSlug(teamSlug);
  if (!slug) {
    return NextResponse.json({ error: "Invalid team" }, { status: 400 });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const code = String(body.code ?? "").trim();
  if (!code) {
    return NextResponse.json({ error: "Code required" }, { status: 400 });
  }

  const supabase = createPublicSupabase();
  const { data, error } = await supabase.rpc("verify_team_access", {
    p_slug: slug,
    p_code: code,
  });

  if (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 400 });
  }

  if (data !== true) {
    return NextResponse.json({ error: "Invalid code" }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(teamAccessCookieName(slug), TEAM_ACCESS_GRANTED, {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
