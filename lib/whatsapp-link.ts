/** Free WhatsApp "click to chat" — parent taps Send in WhatsApp (no Twilio). */
export function whatsappClickToChatUrl(phone: string, message: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildPollNotifyMessage(
  teamName: string,
  question: string,
  voterName: string,
  optionLabel: string,
): string {
  const qPart = question ? `"${question}"` : "Quick poll";
  return `MyTeamSpace · ${teamName}\n${qPart}\n${voterName} → ${optionLabel}`;
}
