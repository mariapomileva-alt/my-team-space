"use client";

import { ImageUploadField } from "@/components/builder/media/image-upload-field";
import {
  getBlockSettings,
  newTeamShopProduct,
  type TeamShopSettings,
} from "@/lib/blocks/settings";
import type { BlockInstance } from "@/lib/types";

const fieldClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100";

function fieldLabel(text: string) {
  return <p className="mb-1 text-xs font-semibold text-zinc-600">{text}</p>;
}

export function TeamShopEditor({
  block,
  teamId,
  onPatchBlock,
}: {
  block: BlockInstance;
  teamId: string;
  onPatchBlock: (id: string, p: Partial<BlockInstance>) => void;
}) {
  const s = getBlockSettings<TeamShopSettings>(block);
  const products = s.products ?? [];

  const set = (patch: Partial<TeamShopSettings>) =>
    onPatchBlock(block.id, { settings: { ...s, ...patch } });

  const updateProduct = (id: string, patch: Partial<(typeof products)[0]>) => {
    set({
      products: products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    });
  };

  const removeProduct = (id: string) => {
    set({ products: products.filter((p) => p.id !== id) });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">
        Show team merch with photos and prices — each product links to your Shopify, order form, WhatsApp, or any shop
        page. No cart or checkout inside MyTeamSpace.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          {fieldLabel("Section title (optional)")}
          <input
            className={fieldClass}
            placeholder="Team Shop"
            value={s.sectionTitle ?? ""}
            onChange={(e) => set({ sectionTitle: e.target.value })}
          />
        </div>
        <div>
          {fieldLabel("Subtitle (optional)")}
          <input
            className={fieldClass}
            placeholder="Order team merch and equipment here."
            value={s.subtitle ?? ""}
            onChange={(e) => set({ subtitle: e.target.value })}
          />
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-rose-200 bg-gradient-to-br from-rose-50/80 to-orange-50/40 px-5 py-8 text-center">
          <p className="text-base font-bold text-zinc-900">Add your first product</p>
          <p className="mt-2 text-sm text-zinc-600">
            Upload a photo, add a price, and link it to your order form, shop, or WhatsApp.
          </p>
          <button
            type="button"
            onClick={() => set({ products: [newTeamShopProduct()] })}
            className="mt-4 rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            + Add product
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="rounded-2xl border border-rose-100 bg-gradient-to-b from-rose-50/30 to-white p-4 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wide text-rose-800/80">
                  Product {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeProduct(product.id)}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                >
                  Remove
                </button>
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,140px)_1fr]">
                <ImageUploadField
                  teamId={teamId}
                  label="Product photo"
                  folder="shop"
                  aspect="square"
                  value={product.imageUrl}
                  onChange={(url) => updateProduct(product.id, { imageUrl: url })}
                  hint="Upload or paste image URL"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    {fieldLabel("Product name")}
                    <input
                      className={fieldClass}
                      placeholder="Sharky Team T-Shirt"
                      value={product.name}
                      onChange={(e) => updateProduct(product.id, { name: e.target.value })}
                    />
                  </div>
                  <div>
                    {fieldLabel("Price (optional)")}
                    <input
                      className={fieldClass}
                      placeholder="€25"
                      value={product.price ?? ""}
                      onChange={(e) => updateProduct(product.id, { price: e.target.value })}
                    />
                  </div>
                  <div>
                    {fieldLabel("Button text")}
                    <input
                      className={fieldClass}
                      placeholder="Order now"
                      value={product.buttonLabel}
                      onChange={(e) => updateProduct(product.id, { buttonLabel: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    {fieldLabel("Description (optional)")}
                    <textarea
                      className={`${fieldClass} min-h-[72px] resize-y`}
                      placeholder="Official team training shirt. Available in kids and adult sizes."
                      value={product.description ?? ""}
                      onChange={(e) => updateProduct(product.id, { description: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    {fieldLabel("Product URL")}
                    <input
                      className={fieldClass}
                      type="url"
                      placeholder="Shopify, Google Form, WhatsApp, Revolut, or any order link"
                      value={product.productUrl}
                      onChange={(e) => updateProduct(product.id, { productUrl: e.target.value })}
                    />
                    <p className="mt-1 text-[11px] text-zinc-500">
                      Shopify, Printful, order forms, WhatsApp — any valid link works.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {products.length > 0 ? (
        <button
          type="button"
          onClick={() => set({ products: [...products, newTeamShopProduct()] })}
          className="w-full rounded-xl border border-dashed border-rose-200 bg-rose-50/50 px-4 py-3 text-sm font-semibold text-rose-800 transition hover:bg-rose-50"
        >
          + Add product
        </button>
      ) : null}
    </div>
  );
}
