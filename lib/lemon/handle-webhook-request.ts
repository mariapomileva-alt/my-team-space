import { verifyLemonWebhookSignature } from "@/lib/lemon/verify-webhook-signature";
import { processLemonSqueezyWebhook, type LemonWebhookBody } from "@/lib/lemon/process-webhook";
import { NextResponse } from "next/server";

export async function handleLemonSqueezyWebhookRequest(request: Request) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Lemon Squeezy webhook not configured" }, { status: 500 });
  }

  const rawBody = await request.text();
  const sig = request.headers.get("X-Signature");
  if (!verifyLemonWebhookSignature(rawBody, sig, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let payload: LemonWebhookBody;
  try {
    payload = JSON.parse(rawBody) as LemonWebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    await processLemonSqueezyWebhook(payload);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
