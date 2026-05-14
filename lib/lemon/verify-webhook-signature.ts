import crypto from "node:crypto";

/** Lemon Squeezy signs the raw body; `X-Signature` is hex-encoded HMAC-SHA256 bytes. */
export function verifyLemonWebhookSignature(rawBody: string, signatureHeader: string | null, secret: string): boolean {
  if (!signatureHeader || !rawBody) return false;
  try {
    const signature = Buffer.from(signatureHeader, "hex");
    const hmac = Buffer.from(crypto.createHmac("sha256", secret).update(rawBody).digest("hex"), "hex");
    if (signature.length === 0 || hmac.length === 0 || signature.length !== hmac.length) return false;
    return crypto.timingSafeEqual(hmac, signature);
  } catch {
    return false;
  }
}
