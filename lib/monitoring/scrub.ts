/** Keys that must never appear in logs or Sentry payloads. */
export const SENSITIVE_LOG_KEYS = [
  "access_code",
  "accessCode",
  "invite_token",
  "inviteToken",
  "password",
  "token",
  "authorization",
  "cookie",
  "cookies",
  "jwt",
  "secret",
  "api_key",
  "apiKey",
  "service_role",
  "serviceRole",
  "LEMONSQUEEZY_API_KEY",
  "LEMONSQUEEZY_WEBHOOK_SECRET",
  "SUPABASE_SERVICE_ROLE_KEY",
  "email_body",
  "emailBody",
  "rawBody",
  "raw_body",
] as const;

const SENSITIVE_SET = new Set(SENSITIVE_LOG_KEYS.map((k) => k.toLowerCase()));

function isSensitiveKey(key: string): boolean {
  const lower = key.toLowerCase();
  if (SENSITIVE_SET.has(lower)) return true;
  if (lower.includes("password")) return true;
  if (lower.includes("secret")) return true;
  if (lower.includes("authorization")) return true;
  if (lower.endsWith("_token") || lower.endsWith("token")) return true;
  if (lower.includes("cookie")) return true;
  if (lower.includes("jwt")) return true;
  return false;
}

/** Deep-scrub objects for safe logging / error reporting. */
export function scrubSensitive<T>(input: T, depth = 0): T {
  if (input == null || depth > 6) return input;
  if (typeof input === "string") {
    if (input.length > 500 && /eyJ[a-zA-Z0-9_-]+\./.test(input)) return "[redacted-jwt]" as T;
    return input;
  }
  if (Array.isArray(input)) {
    return input.map((item) => scrubSensitive(item, depth + 1)) as T;
  }
  if (typeof input === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
      if (isSensitiveKey(key)) {
        out[key] = "[redacted]";
        continue;
      }
      out[key] = scrubSensitive(value, depth + 1);
    }
    return out as T;
  }
  return input;
}
