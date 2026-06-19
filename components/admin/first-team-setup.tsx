"use client";

import { createFirstTeamAction, createTeamAction } from "@/app/admin/actions";
import {
  formatPublicPageLink,
  isValidPageLink,
  pageLinkFromName,
  sanitizePageLinkInput,
} from "@/lib/teams/page-link";
import { cn } from "@/lib/utils/cn";
import { useMemo, useState } from "react";

const SPORTS = [
  "Dance",
  "Hip-hop",
  "Football",
  "Basketball",
  "Swimming",
  "Gymnastics",
  "Volleyball",
  "Tennis",
  "Martial arts",
  "Other",
];

type Props = {
  siteOrigin: string;
  /** Additional team for Academy coaches */
  variant?: "first" | "additional";
  disabled?: boolean;
};

export function FirstTeamSetup({ siteOrigin, variant = "first", disabled }: Props) {
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [city, setCity] = useState("");
  const [pageLink, setPageLink] = useState("");
  const [linkTouched, setLinkTouched] = useState(false);

  const suggestedLink = useMemo(() => pageLinkFromName(name), [name]);
  const effectiveLink = sanitizePageLinkInput(linkTouched ? pageLink : suggestedLink);
  const previewUrl = effectiveLink ? formatPublicPageLink(siteOrigin, effectiveLink) : "";
  const linkValid = effectiveLink.length >= 2 && isValidPageLink(effectiveLink);

  const action = variant === "first" ? createFirstTeamAction : createTeamAction;

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold tracking-tight text-zinc-900">
        {variant === "first" ? "Set up your first team page" : "Create a new team"}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">
        {variant === "first"
          ? "Tell us a few basics — then we'll open the page builder so you can add your logo, schedule, and photos."
          : "Choose a page link and team name. You'll land in the builder right away."}
      </p>

      <form action={action} className="mt-6 space-y-4">
        <div>
          <label htmlFor="team-name" className="text-xs font-semibold text-zinc-500">
            Team name
          </label>
          <input
            id="team-name"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"
            placeholder="Rhythm Juniors"
          />
        </div>

        {variant === "first" ? (
          <>
            <div>
              <label htmlFor="team-sport" className="text-xs font-semibold text-zinc-500">
                Team type / sport
              </label>
              <input
                id="team-sport"
                name="sport"
                list="sport-suggestions"
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"
                placeholder="Hip-hop"
              />
              <datalist id="sport-suggestions">
                {SPORTS.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>

            <div>
              <label htmlFor="team-city" className="text-xs font-semibold text-zinc-500">
                City
              </label>
              <input
                id="team-city"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"
                placeholder="Riga"
              />
            </div>
          </>
        ) : null}

        <div>
          <label htmlFor="page-link" className="text-xs font-semibold text-zinc-500">
            Your page link
          </label>
          <p className="mt-0.5 text-[11px] text-zinc-500">This is the link you will send to parents.</p>
          <div className="mt-2 rounded-xl border border-zinc-200 bg-zinc-50/80 px-3 py-2.5">
            <p className="font-mono text-sm text-zinc-800">
              myteamspace.cc/
              <span className="font-semibold text-violet-700">{effectiveLink || "your-team"}</span>
            </p>
          </div>
          <input
            id="page-link"
            name="pageLink"
            value={linkTouched ? pageLink : suggestedLink}
            onChange={(e) => {
              setLinkTouched(true);
              setPageLink(sanitizePageLinkInput(e.target.value));
            }}
            pattern="[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?"
            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"
            placeholder="rhythm-juniors"
          />
          {!linkValid && effectiveLink.length > 0 ? (
            <p className="mt-1 text-xs text-amber-700">Use letters, numbers, and hyphens only.</p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={disabled || !name.trim() || !linkValid}
          className={cn(
            "w-full rounded-full bg-violet-600 py-3 text-sm font-semibold text-white shadow-sm transition",
            "hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          {variant === "first" ? "Create page & open builder" : "Create team & open builder"}
        </button>
      </form>

      {previewUrl ? (
        <p className="mt-3 text-center text-[11px] text-zinc-500">
          Preview: <span className="font-mono">{previewUrl.replace(/^https?:\/\//, "")}</span>
        </p>
      ) : null}
    </section>
  );
}
