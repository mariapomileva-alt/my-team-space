"use client";

import Link from "next/link";
import { BuilderSectionIcon } from "@/components/builder/builder-section-icon";
import type { BuilderIconId } from "@/lib/builder/section-icons";
import { ADMIN_CARD, ADMIN_CARD_PAD } from "@/lib/admin/admin-layout";
import { cn } from "@/lib/utils/cn";

const ACTIONS: { id: string; label: string; icon: BuilderIconId; href: (id: string) => string }[] = [
  { id: "event", label: "Add Event", icon: "calendar", href: (id) => `/admin/team/${id}/calendar` },
  { id: "result", label: "Add Result", icon: "trophy", href: (id) => `/admin/team/${id}/results` },
  { id: "photo", label: "Add Photo", icon: "image", href: (id) => `/admin/team/${id}/build?focus=sections` },
  { id: "announce", label: "Add Announcement", icon: "megaphone", href: (id) => `/admin/team/${id}/build?focus=sections` },
  { id: "invite", label: "Invite Member", icon: "users", href: (id) => `/admin/team/${id}/members` },
];

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
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700"
              aria-hidden
            >
              <BuilderSectionIcon icon={action.icon} size="md" />
            </span>
            <span className="text-[12px] font-semibold leading-tight text-zinc-800">{action.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
