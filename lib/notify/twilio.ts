import { normalizePhoneE164 } from "@/lib/phone";

export type NotifyResult = { sent: boolean; channel?: "sms" | "whatsapp"; error?: string };

export async function notifyCoachByPhone(phone: string, body: string): Promise<NotifyResult> {
  const to = normalizePhoneE164(phone);
  if (!to) return { sent: false, error: "invalid_phone" };

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return { sent: false, error: "twilio_not_configured" };

  const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM;
  if (whatsappFrom) {
    const r = await twilioMessage(sid, token, `whatsapp:${whatsappFrom.replace(/^whatsapp:/, "")}`, `whatsapp:${to}`, body);
    if (r.ok) return { sent: true, channel: "whatsapp" };
  }

  const smsFrom = process.env.TWILIO_SMS_FROM;
  if (!smsFrom) return { sent: false, error: "no_from_number" };

  const r = await twilioMessage(sid, token, smsFrom, to, body);
  if (r.ok) return { sent: true, channel: "sms" };
  return { sent: false, error: r.error };
}

async function twilioMessage(
  sid: string,
  token: string,
  from: string,
  to: string,
  body: string,
): Promise<{ ok: boolean; error?: string }> {
  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ From: from, To: to, Body: body.slice(0, 1500) }),
  });
  if (res.ok) return { ok: true };
  const err = await res.text();
  return { ok: false, error: err.slice(0, 200) };
}
