/** Normalize coach/parent phone toward E.164 for Twilio (default +371 if no country code). */
export function normalizePhoneE164(raw: string, defaultCountry = "371"): string {
  let digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length <= 10 && defaultCountry) {
    digits = `${defaultCountry}${digits.replace(/^0+/, "")}`;
  }
  return `+${digits}`;
}
