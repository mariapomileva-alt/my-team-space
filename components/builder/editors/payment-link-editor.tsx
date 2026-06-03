"use client";

import { getBlockSettings, type PaymentLinkSettings } from "@/lib/blocks/settings";
import type { BlockInstance } from "@/lib/types";

const fieldClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100";

function fieldLabel(text: string) {
  return <p className="mb-1 text-xs font-semibold text-zinc-600">{text}</p>;
}

export function PaymentLinkEditor({
  block,
  onPatchBlock,
}: {
  block: BlockInstance;
  onPatchBlock: (id: string, p: Partial<BlockInstance>) => void;
}) {
  const s = getBlockSettings<PaymentLinkSettings>(block);
  const set = (patch: Partial<PaymentLinkSettings>) =>
    onPatchBlock(block.id, { settings: { ...s, ...patch } });

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">
        One main payment for your team — membership, camp, competition, or donations. Paste a Revolut,
        PayPal, Stripe, Wise, or bank link. For multiple products, use Team Shop instead.
      </p>
      <div>
        {fieldLabel("Payment title")}
        <input
          className={fieldClass}
          placeholder="Monthly Membership"
          value={s.title}
          onChange={(e) => set({ title: e.target.value })}
        />
      </div>
      <div>
        {fieldLabel("Description (optional)")}
        <textarea
          className={`${fieldClass} min-h-[80px] resize-y`}
          placeholder="Monthly fee: €50 per athlete. Please pay before the 5th of each month."
          value={s.description}
          onChange={(e) => set({ description: e.target.value })}
          rows={3}
        />
      </div>
      <div>
        {fieldLabel("Payment button text")}
        <input
          className={fieldClass}
          placeholder="Pay Membership"
          value={s.buttonLabel}
          onChange={(e) => set({ buttonLabel: e.target.value })}
        />
      </div>
      <div>
        {fieldLabel("Payment URL")}
        <input
          className={fieldClass}
          type="url"
          placeholder="https://revolut.me/your-team or PayPal / Stripe link"
          value={s.paymentUrl}
          onChange={(e) => set({ paymentUrl: e.target.value })}
        />
      </div>
    </div>
  );
}
