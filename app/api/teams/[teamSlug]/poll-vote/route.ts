import { notifyCoachByPhone } from "@/lib/notify/twilio";
import { createPublicSupabase } from "@/lib/supabase/public-client";
import { buildPollNotifyMessage, whatsappClickToChatUrl } from "@/lib/whatsapp-link";
import { NextResponse } from "next/server";

type Body = {
  blockId?: string;
  voterName?: string;
  choice?: "yes" | "no";
  question?: string;
  optionLabel?: string;
};

export async function POST(
  req: Request,
  { params }: { params: Promise<{ teamSlug: string }> },
) {
  const { teamSlug } = await params;
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const blockId = String(body.blockId ?? "").trim();
  const voterName = String(body.voterName ?? "").trim();
  const choice = body.choice;
  const question = String(body.question ?? "").trim().slice(0, 200);
  const optionLabel = String(body.optionLabel ?? "").trim().slice(0, 80);

  if (!blockId || !voterName || (choice !== "yes" && choice !== "no")) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = createPublicSupabase();
  const { data, error } = await supabase.rpc("record_poll_vote", {
    p_slug: teamSlug,
    p_block_id: blockId,
    p_voter_name: voterName,
    p_choice: choice,
  });

  if (error) {
    const msg = error.message ?? "Vote failed";
    const status = msg.includes("not found") ? 404 : msg.includes("not available") ? 403 : 400;
    return NextResponse.json({ error: msg }, { status });
  }

  const row = data as {
    team_name?: string;
    coach_phone?: string;
  } | null;

  const teamName = row?.team_name ?? "Team";
  const coachPhone = row?.coach_phone?.trim() ?? "";
  const time = new Date().toLocaleString("en-GB", {
    timeZone: "Europe/Moscow",
    hour: "2-digit",
    minute: "2-digit",
    day: "numeric",
    month: "short",
  });

  const label = optionLabel || (choice === "yes" ? "Yes" : "No");
  const message = `${buildPollNotifyMessage(teamName, question, voterName, label)}\n${time} (MSK)`;

  let notify: { sent: boolean; channel?: string } = { sent: false };
  let whatsappUrl: string | null = null;

  if (coachPhone) {
    notify = await notifyCoachByPhone(coachPhone, message);
    if (!notify.sent) {
      whatsappUrl = whatsappClickToChatUrl(coachPhone, message);
    }
  }

  return NextResponse.json({
    ok: true,
    saved: true,
    notified: notify.sent,
    notifyChannel: notify.channel ?? null,
    whatsappUrl,
  });
}
