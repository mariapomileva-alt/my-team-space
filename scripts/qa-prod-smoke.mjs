/**
 * Production smoke checks that do not require coach session or Lemon dashboard.
 * Usage: node scripts/qa-prod-smoke.mjs
 */
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SITE = process.env.QA_SITE ?? "https://myteamspace.cc";
const SLUG = process.env.QA_TEAM_SLUG ?? "stars";

function loadEnvFile(file) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) return {};
  const out = {};
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

const env = { ...loadEnvFile(".env.local"), ...process.env };
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;

const results = [];

function pass(id, detail) {
  results.push({ id, status: "PASS", detail });
  console.log(`✓ ${id}: ${detail}`);
}

function fail(id, detail) {
  results.push({ id, status: "FAIL", detail });
  console.error(`✗ ${id}: ${detail}`);
}

async function checkWebhooks() {
  const canonical = await fetch(`${SITE}/api/lemonsqueezy/webhook`);
  const canonicalText = await canonical.text();
  if (canonical.ok && canonicalText.includes("webhook endpoint ready")) {
    pass("webhook-canonical", `GET ${canonical.status}`);
  } else {
    fail("webhook-canonical", `unexpected ${canonical.status}: ${canonicalText.slice(0, 80)}`);
  }

  const legacy = await fetch(`${SITE}/api/webhooks/lemon-squeezy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
  const legacyBody = await legacy.json().catch(() => ({}));
  if (legacy.status === 410 && legacyBody.deprecated === true) {
    pass("webhook-legacy-disabled", "POST returns 410 deprecated");
  } else {
    fail("webhook-legacy-disabled", `status ${legacy.status} body ${JSON.stringify(legacyBody)}`);
  }
}

function nextOccurrence(ev, from) {
  const parseTime = (time) => {
    const m = /^(\d{1,2}):(\d{2})$/.exec(String(time).trim());
    if (!m) return { hours: 12, minutes: 0 };
    return { hours: Number(m[1]), minutes: Number(m[2]) };
  };
  const time = parseTime(ev.time);
  const targetDow = ((ev.dayOfWeek % 7) + 7) % 7;
  const candidate = new Date(from);
  candidate.setSeconds(0, 0);
  const currentDow = candidate.getDay();
  const daysAhead = (targetDow - currentDow + 7) % 7;
  candidate.setDate(candidate.getDate() + daysAhead);
  candidate.setHours(time.hours, time.minutes, 0, 0);
  if (candidate <= from) candidate.setDate(candidate.getDate() + 7);
  return candidate;
}

function upcomingFromBlocks(blocks, limit = 4) {
  const candidates = (blocks ?? [])
    .filter((b) => b.enabled !== false && (b.type === "schedule" || b.type === "calendar"))
    .map((b) => b.settings)
    .filter(Boolean);
  const settings = candidates.find(
    (s) => s.mode !== "external" && (s.events ?? []).some((ev) => ev.title?.trim()),
  );
  if (!settings) return [];
  const now = new Date();
  return (settings.events ?? [])
    .filter((ev) => ev.title?.trim())
    .map((ev) => ({
      id: ev.id,
      title: ev.title.trim(),
      starts_at: nextOccurrence(ev, now).toISOString(),
      location: ev.location?.trim() || null,
    }))
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at))
    .slice(0, limit);
}

async function checkPublicTeam() {
  const pageRes = await fetch(`${SITE}/${SLUG}`, { redirect: "follow" });
  const html = await pageRes.text();
  if (!pageRes.ok) {
    fail("public-page", `/${SLUG} → ${pageRes.status}`);
    return;
  }
  pass("public-page", `/${SLUG} → ${pageRes.status}`);

  if (html.includes("not live yet") || html.includes("Coach preview")) {
    fail("public-published", "page shows draft/preview gate for anonymous users");
  } else {
    pass("public-published", "anonymous page is live (no draft gate)");
  }

  if (html.includes("hero-card")) pass("public-hero", "hero-card in HTML");
  else fail("public-hero", "hero-card missing");

  if (html.includes("team-module-card")) pass("public-module-grid", "module cards rendered");
  else fail("public-module-grid", "team-module-card missing");

  const legacy = await fetch(`${SITE}/team/${SLUG}`, { redirect: "manual" });
  if ([301, 302, 307, 308].includes(legacy.status)) {
    const loc = legacy.headers.get("location") ?? "";
    pass("legacy-redirect", `/team/${SLUG} → ${legacy.status} ${loc}`);
  } else {
    fail("legacy-redirect", `/team/${SLUG} → ${legacy.status}`);
  }

  if (!supabaseUrl || !anonKey) {
    console.warn("  (skip blocks RPC — no Supabase env)");
    return;
  }

  const supabase = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
  const { data, error } = await supabase.rpc("get_public_team_by_slug", { p_slug: SLUG });
  if (error || !data?.length) {
    fail("public-rpc", error?.message ?? "team not found");
    return;
  }

  const row = data[0];
  const blocks = row.blocks ?? [];
  const enabled = blocks.filter((b) => b.enabled !== false);
  pass("public-rpc", `${enabled.length} enabled blocks in DB`);

  const types = new Set(enabled.map((b) => b.type));
  for (const t of ["hero", "schedule", "gallery", "contacts"]) {
    if (types.has(t)) pass(`block-${t}`, "enabled in teams.blocks");
    else console.log(`  · block-${t}: not enabled (informational)`);
  }

  const upcoming = upcomingFromBlocks(blocks, 4);
  if (types.has("schedule") || types.has("calendar")) {
    const sched = blocks.find((b) => b.type === "schedule");
    const cal = blocks.find((b) => b.type === "calendar");
    const eventCount =
      (sched?.settings?.events?.length ?? 0) + (cal?.settings?.events?.length ?? 0);
    if (upcoming.length > 0) {
      pass("schedule-admin-sync", `${upcoming.length} upcoming from blocks (e.g. "${upcoming[0].title}")`);
    } else if (
      sched?.settings?.mode === "external" &&
      (!cal?.settings?.events?.length || cal?.settings?.mode === "external")
    ) {
      pass("schedule-admin-sync", "external calendar mode — admin list intentionally empty");
    } else {
      console.log(`  · schedule-admin-sync: ${eventCount} events in blocks but none upcoming (check modes)`);
    }
  }
}

async function checkRoutes() {
  for (const route of ["/", "/pricing", "/admin", "/showcase/teams"]) {
    const res = await fetch(`${SITE}${route}`, { redirect: "follow" });
    if (res.ok) pass(`route-${route}`, String(res.status));
    else fail(`route-${route}`, String(res.status));
  }
}

async function main() {
  console.log(`QA smoke — ${SITE} (team: /${SLUG})\n`);
  await checkWebhooks();
  await checkRoutes();
  await checkPublicTeam();

  const failed = results.filter((r) => r.status === "FAIL");
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  if (failed.length) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
