"use client";

import { toExternalHref } from "@/lib/external-url";
import type { TeamShopProduct } from "@/lib/blocks/settings";
import { mtsTypeBodySm, mtsTypeTitleMd } from "@/lib/typography";
import { MtsShopPhoto } from "@/components/mts/media/mts-media";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";

function validProducts(products: TeamShopProduct[]) {
  return products
    .map((p) => {
      const href = toExternalHref(p.productUrl);
      const name = p.name?.trim();
      if (!href || !name) return null;
      return {
        ...p,
        href,
        name,
        price: p.price?.trim(),
        description: p.description?.trim(),
        buttonLabel: p.buttonLabel?.trim() || "Order now",
        imageUrl: p.imageUrl?.trim(),
      };
    })
    .filter(Boolean) as (TeamShopProduct & {
      href: string;
      name: string;
      price?: string;
      description?: string;
      buttonLabel: string;
      imageUrl?: string;
    })[];
}

export function TeamShopGrid({
  products,
  compact = false,
  className,
}: {
  products: TeamShopProduct[];
  compact?: boolean;
  className?: string;
}) {
  const valid = validProducts(products);
  if (valid.length === 0) return null;

  return (
    <div
      className={cn(
        "grid gap-4 sm:gap-5",
        compact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {valid.map((product, i) => (
        <motion.article
          key={product.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="flex flex-col overflow-hidden rounded-[1.35rem] border border-neutral-200/90 bg-white shadow-[0_8px_32px_-16px_rgba(15,23,42,0.16)] ring-1 ring-neutral-100/90"
        >
          <MtsShopPhoto
            src={product.imageUrl}
            className="bg-gradient-to-br from-rose-50 via-white to-violet-50"
            fallback={
              <div className="flex h-full w-full items-center justify-center text-5xl opacity-40" aria-hidden>
                🛍
              </div>
            }
          />
          <div className="flex flex-1 flex-col p-4 sm:p-5">
            <div className="min-w-0 flex-1">
              <h3 className={mtsTypeTitleMd}>{product.name}</h3>
              {product.price ? (
                <p className="mt-1 font-sans text-[15px] font-semibold leading-snug tracking-normal text-rose-600">
                  {product.price}
                </p>
              ) : null}
              {product.description ? (
                <p className={cn("mt-2 line-clamp-3", mtsTypeBodySm)}>{product.description}</p>
              ) : null}
            </div>
            <a
              href={product.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center rounded-2xl bg-neutral-900 px-4 text-[14px] font-semibold text-white shadow-md shadow-neutral-900/15 transition hover:bg-neutral-800 active:scale-[0.99]"
            >
              {product.buttonLabel}
            </a>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

export { validProducts as validTeamShopProducts };
