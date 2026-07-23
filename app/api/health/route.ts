import { isBillingConfigured } from "@/lib/billing/config";
import {
  monitoringAppVersion,
  monitoringCommitSha,
  monitoringEnvironment,
} from "@/lib/monitoring/env";
import { createRequestId, logger } from "@/lib/monitoring/logger";
import { createPublicSupabase } from "@/lib/supabase/public-client";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CheckStatus = "ok" | "degraded" | "error";

const UPTIME_UA =
  /uptimerobot|betteruptime|better stack|checkly|pingdom|statuscake/i;

async function checkSupabase(): Promise<CheckStatus> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    if (!url || !key) return "error";

    const supabase = createPublicSupabase();
    // Lightweight RPC probe — nonexistent slug returns [] quickly.
    const { error } = await supabase.rpc("get_public_team_by_slug", {
      p_slug: "__healthcheck__",
    });
    if (error) return "degraded";
    return "ok";
  } catch {
    return "error";
  }
}

function checkEnv(): CheckStatus {
  const required = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ] as const;
  for (const key of required) {
    const alt = key === "NEXT_PUBLIC_SUPABASE_URL" ? "SUPABASE_URL" : "SUPABASE_ANON_KEY";
    if (!process.env[key]?.trim() && !process.env[alt]?.trim()) return "error";
  }
  return "ok";
}

export async function GET(request: NextRequest) {
  const request_id = createRequestId();
  const started = Date.now();

  const envStatus = checkEnv();
  const supabaseStatus = await checkSupabase();
  const lemon = isBillingConfigured() ? "ok" : "degraded";

  const checks = {
    app: "ok" as CheckStatus,
    env: envStatus,
    supabase: supabaseStatus,
    lemon_config: lemon as CheckStatus,
  };

  const overall: CheckStatus =
    checks.env === "error" || checks.supabase === "error"
      ? "error"
      : checks.supabase === "degraded" || checks.lemon_config === "degraded"
        ? "degraded"
        : "ok";

  // Public payload: safe fields only — no missing-env names, DB errors, or internals.
  const body = {
    status: overall,
    version: monitoringAppVersion(),
    commit_sha: monitoringCommitSha(),
    environment: monitoringEnvironment(),
    timestamp: new Date().toISOString(),
    checks,
  };

  const ua = request.headers.get("user-agent") ?? "";
  if (!UPTIME_UA.test(ua)) {
    logger.info("health_check", {
      event: "health_check",
      request_id,
      route: "/api/health",
      action: "GET",
      status: overall,
      duration_ms: Date.now() - started,
    });
  }

  return NextResponse.json(body, {
    status: overall === "error" ? 503 : 200,
    headers: {
      "Cache-Control": "no-store",
      "x-request-id": request_id,
    },
  });
}
