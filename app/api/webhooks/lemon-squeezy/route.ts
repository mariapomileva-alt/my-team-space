import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Canonical Lemon Squeezy webhook — configure only this URL in Lemon dashboard. */
export const CANONICAL_LEMON_WEBHOOK_PATH = "/api/lemonsqueezy/webhook";

/**
 * Legacy duplicate endpoint — intentionally does not process webhooks so Lemon cannot
 * double-apply subscription updates if both URLs were ever configured.
 *
 * @deprecated Use {@link CANONICAL_LEMON_WEBHOOK_PATH}
 */
export async function GET() {
  return deprecatedResponse();
}

/** @deprecated Use {@link CANONICAL_LEMON_WEBHOOK_PATH} */
export async function POST() {
  return deprecatedResponse();
}

function deprecatedResponse() {
  return NextResponse.json(
    {
      deprecated: true,
      canonical: CANONICAL_LEMON_WEBHOOK_PATH,
      message:
        "This legacy webhook URL is disabled. Point Lemon Squeezy to the canonical webhook path only.",
    },
    { status: 410 },
  );
}
