"use client";

import type { BlockPreviewShape } from "@/lib/blocks/meta";
import type { BlockType } from "@/lib/types";
import { motion } from "framer-motion";

/** Tiny layout illustration — Apple-widget style */
export function BlockShapePreview({
  shape,
  blockType,
  large,
}: {
  shape: BlockPreviewShape;
  blockType?: BlockType;
  large?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`relative shrink-0 overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-br from-white via-indigo-50/40 to-violet-100/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_12px_-6px_rgba(99,102,241,0.2)] ${
        large ? "h-[72px] w-[88px] p-2" : "h-14 w-[4.5rem] p-1.5"
      }`}
      aria-hidden
    >
      <ShapeInner shape={shape} blockType={blockType} large={large} />
    </motion.div>
  );
}

function ShapeInner({
  shape,
  blockType,
  large,
}: {
  shape: BlockPreviewShape;
  blockType?: BlockType;
  large?: boolean;
}) {
  if (blockType === "gallery") return <GalleryIllustration large={large} />;
  if (blockType === "calendar" || blockType === "schedule") return <CalendarIllustration large={large} />;
  if (blockType === "contacts") return <ContactsIllustration large={large} />;
  if (blockType === "results" || blockType === "achievements") return <TrophyIllustration large={large} />;
  if (blockType === "polls") return <PollIllustration large={large} />;
  if (blockType === "integrations") return <LinksIllustration large={large} />;
  if (blockType === "resources") return <DocsIllustration large={large} />;
  if (blockType === "attendance") return <AttendanceIllustration large={large} />;

  switch (shape) {
    case "bar":
      return (
        <motion.div className="flex h-full w-full flex-col justify-center gap-1 px-0.5">
          <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-violet-400 to-indigo-400" />
          <motion.div className="h-1 w-3/4 rounded-full bg-violet-200/80" />
        </motion.div>
      );
    case "hero":
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1">
          <div className="h-5 w-5 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 shadow-sm" />
          <div className="h-1 w-full max-w-[90%] rounded-full bg-indigo-200" />
          <div className="h-3 w-full max-w-[95%] rounded-lg bg-indigo-100/90" />
        </div>
      );
    case "grid":
      return <GalleryIllustration large={large} />;
    case "list":
      return (
        <div className="flex h-full w-full flex-col justify-center gap-1 px-0.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="h-1 w-1 shrink-0 rounded-full bg-indigo-400" />
              <div className="h-1 flex-1 rounded-full bg-indigo-200" style={{ opacity: 1 - i * 0.2 }} />
            </div>
          ))}
        </div>
      );
    case "stat":
      return <AttendanceIllustration large={large} />;
    case "links":
      return (
        <motion.div className="grid h-full w-full grid-cols-2 content-center gap-1 p-0.5">
          <div className="h-2 rounded-md bg-indigo-400/90" />
          <div className="h-2 rounded-md bg-pink-300/90" />
          <div className="col-span-2 h-2 rounded-md bg-violet-200" />
        </motion.div>
      );
    case "card":
    default:
      return (
        <div className="flex h-full w-full items-center justify-center p-1">
          <div className="h-full w-full rounded-lg border border-indigo-200/80 bg-white shadow-sm" />
        </div>
      );
  }
}

function CalendarIllustration({ large }: { large?: boolean }) {
  const cell = large ? "h-2 w-2" : "h-1 w-1";
  return (
    <div className="flex h-full w-full flex-col p-0.5">
      <div className="mb-0.5 flex gap-0.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div key={i} className={`${cell} rounded-[2px] bg-indigo-300/70`} />
        ))}
      </div>
      <div className="grid flex-1 grid-cols-5 gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className={`${cell} rounded-[2px] ${i === 3 ? "bg-indigo-500" : "bg-indigo-100"}`}
          />
        ))}
      </div>
    </div>
  );
}

function GalleryIllustration({ large }: { large?: boolean }) {
  const gap = large ? "gap-1" : "gap-0.5";
  const cell = large ? "rounded-md" : "rounded-[3px]";
  return (
    <div className={`grid h-full w-full grid-cols-3 ${gap} p-0.5`}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          className={`aspect-square ${cell} ${i === 0 ? "bg-gradient-to-br from-rose-300 to-orange-200" : i === 2 ? "bg-gradient-to-br from-sky-300 to-indigo-200" : "bg-indigo-200/90"}`}
          style={{ transform: i === 1 ? "rotate(-4deg)" : undefined }}
        />
      ))}
    </div>
  );
}

function ContactsIllustration({ large }: { large?: boolean }) {
  const size = large ? "h-5 w-5" : "h-3 w-3";
  return (
    <div className="flex h-full w-full items-center justify-center gap-1">
      <div className={`${size} rounded-full bg-gradient-to-br from-teal-300 to-emerald-400 ring-1 ring-white`} />
      <div className={`${size} -ml-2 rounded-full bg-gradient-to-br from-violet-300 to-indigo-400 ring-1 ring-white`} />
      <motion.div className={`${size} -ml-2 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 ring-1 ring-white`} />
    </div>
  );
}

function TrophyIllustration({ large }: { large?: boolean }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <span className={large ? "text-2xl" : "text-base"}>🏆</span>
      <div className={`mt-0.5 rounded-full bg-amber-200/80 ${large ? "h-1 w-8" : "h-0.5 w-5"}`} />
    </div>
  );
}

function PollIllustration({ large }: { large?: boolean }) {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-1 px-1">
      <div className={`rounded-full bg-violet-300/90 ${large ? "h-2" : "h-1"}`} style={{ width: "85%" }} />
      <div className={`rounded-full bg-violet-200/80 ${large ? "h-2" : "h-1"}`} style={{ width: "60%" }} />
    </div>
  );
}

function LinksIllustration({ large }: { large?: boolean }) {
  const cell = large ? "h-3 w-8" : "h-2 w-6";
  return (
    <div className="flex h-full flex-col justify-center gap-1 p-1">
      <div className={`rounded-md bg-indigo-400 ${cell}`} />
      <div className={`rounded-md bg-violet-300 ${cell}`} style={{ width: "70%" }} />
      <div className={`rounded-md bg-pink-300 ${cell}`} style={{ width: "55%" }} />
    </div>
  );
}

function DocsIllustration({ large }: { large?: boolean }) {
  return (
    <div className="flex h-full items-center justify-center gap-1 p-1">
      <span className={large ? "text-xl" : "text-sm"}>📄</span>
      <span className={large ? "text-xl" : "text-sm"}>🎵</span>
    </div>
  );
}

function AttendanceIllustration({ large }: { large?: boolean }) {
  const r = large ? 14 : 10;
  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg width={r * 2} height={r * 2} className="-rotate-90">
        <circle cx={r} cy={r} r={r - 2} fill="none" stroke="#e0e7ff" strokeWidth="2" />
        <circle
          cx={r}
          cy={r}
          r={r - 2}
          fill="none"
          stroke="#6366f1"
          strokeWidth="2"
          strokeDasharray="40 100"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
