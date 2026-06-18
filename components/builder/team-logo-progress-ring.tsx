"use client";

import { cn } from "@/lib/utils/cn";
import Image from "next/image";

const RING_SIZE = 52;
const STROKE = 3.5;
const R = (RING_SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;
const INSET = STROKE + 3;

export function TeamLogoProgressRing({
  logoUrl,
  percent,
  size = RING_SIZE,
  className,
}: {
  logoUrl?: string;
  percent: number;
  size?: number;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = C - (clamped / 100) * C;
  const inset = (INSET / RING_SIZE) * size;

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
      aria-label={`${clamped}% ready`}
    >
      <svg
        className="absolute inset-0 -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
        aria-hidden
      >
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={R}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE}
          className="text-zinc-100"
        />
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={R}
          fill="none"
          stroke="url(#mts-progress-gradient)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
        <defs>
          <linearGradient id="mts-progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      <div
        className="absolute overflow-hidden rounded-full bg-gradient-to-br from-violet-50 to-indigo-50"
        style={{ inset }}
      >
        {logoUrl ? (
          <div className="relative h-full w-full">
            <Image src={logoUrl} alt="" fill className="object-cover" sizes="56px" unoptimized />
          </div>
        ) : (
          <span className="flex h-full w-full items-center justify-center text-lg" aria-hidden>
            🏆
          </span>
        )}
      </div>
    </div>
  );
}
