"use client";

import Link from "next/link";
import { ADMIN_CARD, ADMIN_CARD_PAD } from "@/lib/admin/admin-layout";
import { cn } from "@/lib/utils/cn";

const ACTIONS = [
  { id: "event", label: "Add Event", emoji: "📅", href: (id: string) => `/admin/team/${id}/calendar` },
  { id: "result", label: "Add Result", emoji: "🏆", href: (id: string) => `/admin/team/${id}/results` },
  { id: "photo", label: "Add Photo", emoji: "📸", href: (id: string) => `/admin/team/${id}/build?focus=sections` },
  { id: "announce", label: "Add Announcement", emoji: "📣", href: (id: string) => `/admin/team/${id}/build?focus=sections` },
  { id: "invite", label: "Invite Member", emoji: "👥", href: (id: string) => `/admin/team/${id}/members` },
] as const;

export function TeamQuickActions({ teamId, className }: { teamId: string; className?: string }) {
  return (
    <section className={cn(ADMIN_CARD, ADMIN_CARD_PAD, className)}>
      <h2 className="text-base font-bold text-zinc-900">Quick actions</h2>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {ACTIONS.map((action) => (
          <Link
            key={action.id}
            href={action.href(teamId)}
            className="flex flex-col items-center gap-2 rounded-2xl border border-zinc-100 bg-zinc-50/60 px-3 py-4 text-center transition hover:border-violet-100 hover:bg-violet-50/40 active:scale-[0.98]"
          >
            <span className="text-2xl" aria-hidden>
              {action.emoji}
            </span>
            <span className="text-[12px] font-semibold leading-tight text-zinc-800">{action.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
