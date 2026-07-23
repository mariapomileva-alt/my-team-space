import { isBillingConfigured } from "@/lib/billing/config";
import {
  monitoringAppVersion,
  monitoringCommitSha,
  monitoringEnvironment,
} from "@/lib/monitoring/env";
import { createRequestId, logger } from "@/lib/monitoring/logger";
import { createPublicSupabase } from "@/lib/supabase/public-client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CheckStatus = "ok" | "degraded" | "error";

async function checkSupabase(): Promise<{ status: CheckStatus; detail?: string }> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    if (!url || !key) return { status: "error", detail: "missing_supabase_env" };

    const supabase = createPublicSupabase();
    // Lightweight RPC probe — nonexistent slug returns [] quickly.
    const { error } = await supabase.rpc("get_public_team_by_slug", {
      p_slug: "__healthcheck__",
    });
    if (error) return { status: "degraded", detail: error.message.slice(0, 120) };
    return { status: "ok" };
  } catch (e) {
    return { status: "error", detail: e instanceof Error ? e.message.slice(0, 120) : "supabase_unreachable" };
  }
}

function checkEnv(): { status: CheckStatus; missing: string[] } {
  const required = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ] as const;
  const missing: string[] = [];
  for (const key of required) {
    const alt = key === "NEXT_PUBLIC_SUPABASE_URL" ? "SUPABASE_URL" : "SUPABASE_ANON_KEY";
    if (!process.env[key]?.trim() && !process.env[alt]?.trim()) missing.push(key);
  }
  return { status: missing.length ? "error" : "ok", missing };
}

export async function GET() {
  const request_id = createRequestId();
  const started = Date.now();

  const envCheck = checkEnv();
  const supabase = await checkSupabase();
  const lemon = isBillingConfigured() ? "ok" : "degraded";

  const checks = {
    app: "ok" as CheckStatus,
    env: envCheck.status,
    supabase: supabase.status,
    lemon_config: lemon as CheckStatus,
  };

  const overall: CheckStatus =
    checks.env === "error" || checks.supabase === "error"
      ? "error"
      : checks.supabase === "degraded" || checks.lemon_config === "degraded"
        ? "degraded"
        : "ok";

  const body = {
    status: overall,
    version: monitoringAppVersion(),
    commit_sha: monitoringCommitSha(),
    environment: monitoringEnvironment(),
    timestamp: new Date().toISOString(),
    request_id,
    checks: {
      ...checks,
      env_missing: envCheck.missing,
      supabase_detail: supabase.detail ?? null,
    },
    duration_ms: Date.now() - started,
  };

  logger.info("health_check", {
    event: "health_check",
    request_id,
    route: "/api/health",
    action: "GET",
    status: overall,
    duration_ms: body.duration_ms,
  });

  return NextResponse.json(body, {
    status: overall === "error" ? 503 : 200,
    headers: {
      "Cache-Control": "no-store",
      "x-request-id": request_id,
    },
  });
}
