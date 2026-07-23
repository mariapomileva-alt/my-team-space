export type LemonWebhookMeta = {
  event_name?: string;
  webhook_id?: string | number;
  custom_data?: Record<string, unknown>;
};

export type LemonSubscriptionAttributes = {
  status?: string;
  customer_id?: number | string;
  variant_id?: number | string;
  renews_at?: string | null;
  ends_at?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
};

export type LemonWebhookBody = {
  meta?: LemonWebhookMeta;
  data?: {
    id?: string;
    type?: string;
    attributes?: LemonSubscriptionAttributes;
  };
};

/** Prefer renews_at (active cycle); fall back to ends_at (cancelled/expired window). */
export function extractLemonCurrentPeriodEnd(
  attrs: LemonSubscriptionAttributes | null | undefined,
): string | null {
  if (!attrs) return null;
  const renews = typeof attrs.renews_at === "string" ? attrs.renews_at.trim() : "";
  if (renews) {
    const t = Date.parse(renews);
    if (!Number.isNaN(t)) return new Date(t).toISOString();
  }
  const ends = typeof attrs.ends_at === "string" ? attrs.ends_at.trim() : "";
  if (ends) {
    const t = Date.parse(ends);
    if (!Number.isNaN(t)) return new Date(t).toISOString();
  }
  return null;
}

export function extractLemonUpdatedAt(
  attrs: LemonSubscriptionAttributes | null | undefined,
): string | null {
  if (!attrs) return null;
  const raw = typeof attrs.updated_at === "string" ? attrs.updated_at.trim() : "";
  if (!raw) return null;
  const t = Date.parse(raw);
  if (Number.isNaN(t)) return null;
  return new Date(t).toISOString();
}

/**
 * Stable idempotency key for a Lemon delivery.
 * Prefer meta.webhook_id; otherwise event + subscription + updated_at/status.
 */
export function buildLemonWebhookEventKey(payload: LemonWebhookBody): string | null {
  const meta = payload.meta ?? {};
  const webhookId =
    typeof meta.webhook_id === "string"
      ? meta.webhook_id.trim()
      : typeof meta.webhook_id === "number"
        ? String(meta.webhook_id)
        : "";
  if (webhookId) return `ls:webhook:${webhookId}`;

  const eventName = typeof meta.event_name === "string" ? meta.event_name.trim() : "";
  const subId = payload.data?.id != null ? String(payload.data.id).trim() : "";
  if (!eventName || !subId) return null;

  const attrs = payload.data?.attributes ?? {};
  const updatedAt = extractLemonUpdatedAt(attrs) ?? "";
  const status = typeof attrs.status === "string" ? attrs.status.trim() : "";
  const stamp = updatedAt || status || "na";
  return `ls:fallback:${eventName}:${subId}:${stamp}`;
}

/**
 * Apply update when incoming has no timestamp, stored has none, or incoming is same/newer.
 * Reject strictly older Lemon updated_at to survive out-of-order delivery.
 */
export function shouldApplyLemonSubscriptionUpdate(
  storedLemonUpdatedAt: string | null | undefined,
  incomingLemonUpdatedAt: string | null | undefined,
): boolean {
  if (!incomingLemonUpdatedAt) return true;
  if (!storedLemonUpdatedAt) return true;
  const incoming = Date.parse(incomingLemonUpdatedAt);
  const stored = Date.parse(storedLemonUpdatedAt);
  if (Number.isNaN(incoming) || Number.isNaN(stored)) return true;
  return incoming >= stored;
}
