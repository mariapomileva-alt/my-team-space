import { handleLemonSqueezyWebhookRequest } from "@/lib/lemon/handle-webhook-request";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Lemon Squeezy webhook — configure URL: https://myteamspace.cc/api/lemonsqueezy/webhook */
export async function GET() {
  return new NextResponse("LemonSqueezy webhook endpoint ready", {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function POST(request: Request) {
  return handleLemonSqueezyWebhookRequest(request);
}
