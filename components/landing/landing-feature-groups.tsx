"use client";

import { motion } from "framer-motion";

type FeatureGroup = {
  id: string;
  label: string;
  hint: string;
  accent: string;
  features: {
    title: string;
    description: string;
    preview: React.ReactNode;
  }[];
};

function MiniSchedule() {
  return (
    <div className="space-y-1.5 rounded-xl bg-neutral-50 p-2.5 ring-1 ring-neutral-100">
      <div className="rounded-lg bg-violet-600 px-2.5 py-1.5 text-[10px] font-semibold text-white">
        Practice today · 18:00
      </div>
      <div className="flex justify-between px-1 text-[10px] text-neutral-500">
        <span>Wed · Technique</span>
        <span>17:30</span>
      </div>
      <div className="flex justify-between px-1 text-[10px] text-neutral-500">
        <span>Sat · Showcase</span>
        <span>11:00</span>
      </div>
    </div>
  );
}

function MiniContacts() {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-neutral-50 p-2.5 ring-1 ring-neutral-100">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fuchsia-100 text-sm font-bold text-fuchsia-700">
        DS
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold text-neutral-800">Coach Maria</p>
        <p className="text-[10px] text-neutral-400">Dance Stars · Riga</p>
      </div>
      <span className="text-[10px] font-semibold text-violet-600">Call</span>
    </div>
  );
}

function MiniAnnouncement() {
  return (
    <div className="rounded-xl bg-sky-50 px-2.5 py-2 ring-1 ring-sky-100">
      <p className="text-[9px] font-semibold uppercase tracking-wide text-sky-700">Update</p>
      <p className="mt-0.5 text-[10px] font-medium leading-snug text-sky-900">
        Recital costumes — pick up Friday at studio
      </p>
    </div>
  );
}

function MiniPayment() {
  return (
    <div className="rounded-xl bg-neutral-50 p-2.5 ring-1 ring-neutral-100">
      <p className="text-[10px] font-semibold text-neutral-800">March fee</p>
      <p className="text-[9px] text-neutral-400">€45 · membership</p>
      <div className="mt-2 rounded-lg bg-neutral-900 py-1.5 text-center text-[10px] font-semibold text-white">
        Pay online
      </div>
    </div>
  );
}

function MiniGallery() {
  const colors = ["bg-rose-200", "bg-violet-200", "bg-amber-200"];
  return (
    <div className="flex gap-1.5">
      {colors.map((c) => (
        <div key={c} className={`h-14 w-11 shrink-0 rounded-lg ${c} ring-1 ring-black/[0.04]`} />
      ))}
      <div className="flex h-14 w-11 items-center justify-center rounded-lg bg-neutral-100 text-[10px] font-semibold text-neutral-500 ring-1 ring-neutral-200/80">
        +12
      </div>
    </div>
  );
}

function MiniAchievements() {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      <div className="rounded-lg bg-amber-50 p-2 text-center ring-1 ring-amber-100">
        <span className="text-lg" aria-hidden>
          🏆
        </span>
        <p className="mt-0.5 text-[9px] font-bold text-amber-900">Gold solo</p>
      </div>
      <div className="rounded-lg bg-violet-50 p-2 text-center ring-1 ring-violet-100">
        <span className="text-lg" aria-hidden>
          ⭐
        </span>
        <p className="mt-0.5 text-[9px] font-bold text-violet-900">Team spirit</p>
      </div>
    </div>
  );
}

function MiniResults() {
  return (
    <div className="space-y-1.5">
      {[
        { name: "Sofia K.", medal: "🥇" },
        { name: "Relay team", medal: "🥈" },
      ].map((row) => (
        <div key={row.name} className="flex items-center justify-between rounded-lg bg-neutral-50 px-2 py-1.5 text-[10px]">
          <span className="font-medium text-neutral-700">{row.name}</span>
          <span>{row.medal}</span>
        </div>
      ))}
    </div>
  );
}

function MiniQrShare() {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-neutral-50 p-2.5 ring-1 ring-neutral-100">
      <div className="grid h-12 w-12 shrink-0 grid-cols-3 gap-0.5 rounded-md bg-white p-1 ring-1 ring-neutral-200">
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            className={`rounded-[1px] ${i % 3 === 0 || i === 4 ? "bg-neutral-800" : "bg-neutral-200"}`}
            aria-hidden
          />
        ))}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-neutral-800">myteamspace.cc/dance-stars</p>
        <p className="text-[9px] text-neutral-400">Scan or copy · share once</p>
      </div>
    </div>
  );
}

function MiniMobile() {
  return (
    <div className="mx-auto w-[88px] rounded-[1rem] border-[3px] border-neutral-800 bg-white p-1 shadow-sm">
      <div className="h-1 w-8 mx-auto rounded-full bg-neutral-200" />
      <div className="mt-1 space-y-1 rounded-lg bg-violet-50 p-1.5">
        <div className="h-1.5 w-full rounded bg-violet-300/80" />
        <div className="h-1 w-[66%] rounded bg-neutral-200" />
        <div className="h-4 rounded bg-white ring-1 ring-violet-100" />
      </div>
    </div>
  );
}

function MiniEdit() {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-emerald-50/80 px-2.5 py-2 ring-1 ring-emerald-100">
      <span className="text-emerald-600" aria-hidden>
        ✓
      </span>
      <div>
        <p className="text-[10px] font-semibold text-emerald-900">Saved</p>
        <p className="text-[9px] text-emerald-700/80">Parents see it now</p>
      </div>
    </div>
  );
}

function MiniOneLink() {
  return (
    <div className="rounded-xl border border-dashed border-violet-200 bg-violet-50/50 px-2.5 py-2 text-center">
      <p className="text-[10px] font-semibold text-violet-800">Your team URL</p>
      <p className="mt-0.5 text-[9px] text-violet-600/80">Bookmark-friendly · opens in browser</p>
    </div>
  );
}

const GROUPS: FeatureGroup[] = [
  {
    id: "essentials",
    label: "Everyday essentials",
    hint: "Solve urgent parent questions first",
    accent: "text-sky-700 bg-sky-50 ring-sky-100",
    features: [
      {
        title: "Schedule",
        description: "Practice times and events — parents check once, not every group chat.",
        preview: <MiniSchedule />,
      },
      {
        title: "Contacts",
        description: "Coach and club details in one tap — no digging through messages.",
        preview: <MiniContacts />,
      },
      {
        title: "Updates",
        description: "Announcements that stay visible until you change them.",
        preview: <MiniAnnouncement />,
      },
      {
        title: "Payments",
        description: "One clear fee link — membership, camp, or competition.",
        preview: <MiniPayment />,
      },
    ],
  },
  {
    id: "pride",
    label: "Build trust & pride",
    hint: "Make your team look as good as it feels",
    accent: "text-amber-800 bg-amber-50 ring-amber-100",
    features: [
      {
        title: "Gallery",
        description: "New recital photos — families scroll, share, and feel proud.",
        preview: <MiniGallery />,
      },
      {
        title: "Achievements",
        description: "Trophies and highlights kids love to show friends.",
        preview: <MiniAchievements />,
      },
      {
        title: "Results",
        description: "Competition results and standings — celebrate wins together.",
        preview: <MiniResults />,
      },
    ],
  },
  {
    id: "time",
    label: "Save coach time",
    hint: "Less admin, more coaching",
    accent: "text-violet-700 bg-violet-50 ring-violet-100",
    features: [
      {
        title: "QR & share",
        description: "Print a QR for the studio wall or paste the link once in WhatsApp.",
        preview: <MiniQrShare />,
      },
      {
        title: "Mobile-first",
        description: "Parents open on any phone — your page looks great on every screen.",
        preview: <MiniMobile />,
      },
      {
        title: "Easy editing",
        description: "Change a time or add photos — saved in seconds, live immediately.",
        preview: <MiniEdit />,
      },
      {
        title: "One link",
        description: "Replace scattered docs and chat threads with one team home.",
        preview: <MiniOneLink />,
      },
    ],
  },
];

export function LandingFeatureGroupsSection() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-16 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6C5CE7]">What you get</p>
        <h2 className="mt-3 font-[family-name:var(--font-brand)] text-3xl font-bold tracking-tight text-[#1A1C23] sm:text-4xl">
          Every parent question, answered on one page.
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-neutral-500">
          Turn on only what your team uses. Parents get clarity — you get fewer repeat messages.
        </p>
      </motion.div>

      <div className="mt-10 space-y-12 sm:mt-12">
        {GROUPS.map((group, gi) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-32px" }}
            transition={{ duration: 0.5, delay: gi * 0.05 }}
          >
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${group.accent}`}
                >
                  {group.label}
                </span>
                <p className="mt-2 text-sm text-neutral-500">{group.hint}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.features.map((feature) => (
                <article
                  key={feature.title}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-100/90 bg-white shadow-[0_2px_24px_-12px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex min-h-[88px] items-center border-b border-neutral-50 bg-neutral-50/40 p-3">
                    {feature.preview}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-[15px] font-semibold text-neutral-900">{feature.title}</h3>
                    <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-neutral-500">{feature.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
