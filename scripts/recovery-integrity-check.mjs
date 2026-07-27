/**
 * P0-06 integrity check against an isolated restore project.
 *
 * Requires gitignored .env.recovery:
 *   RECOVERY_SUPABASE_URL=https://xxxx.supabase.co
 *   RECOVERY_SUPABASE_ANON_KEY=...
 *
 * Optional (defaults from docs baseline):
 *   RECOVERY_EXPECT_TEAM_ID=e73021ee-df96-40f0-9ca0-ba191d490c67
 *   RECOVERY_EXPECT_SLUG=stars
 *   RECOVERY_EXPECT_NAME=Dance Is
 *
 * Never points at production Vercel. Safe to run anytime.
 *
 * Usage: node scripts/recovery-integrity-check.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

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

const env = { ...loadEnvFile(".env.local"), ...loadEnvFile(".env.recovery"), ...process.env };

const recoveryUrl = (env.RECOVERY_SUPABASE_URL || "").replace(/\/$/, "");
const recoveryKey = env.RECOVERY_SUPABASE_ANON_KEY || "";
const prodUrl = (
  env.NEXT_PUBLIC_SUPABASE_URL ||
  env.SUPABASE_URL ||
  ""
).replace(/\/$/, "");

const EXPECT = {
  id: env.RECOVERY_EXPECT_TEAM_ID || "e73021ee-df96-40f0-9ca0-ba191d490c67",
  slug: env.RECOVERY_EXPECT_SLUG || "stars",
  name: env.RECOVERY_EXPECT_NAME || "Dance Is",
  publish_status: "published",
};

const results = [];

function pass(id, detail) {
  results.push({ id, status: "PASS", detail });
  console.log(`✓ ${id}: ${detail}`);
}

function fail(id, detail) {
  results.push({ id, status: "FAIL", detail });
  console.error(`✗ ${id}: ${detail}`);
}

async function rpc(baseUrl, key, name, payload) {
  const res = await fetch(`${baseUrl}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }
  return { ok: res.ok, status: res.status, json };
}

async function main() {
  if (!recoveryUrl || !recoveryKey) {
    console.error(`Missing RECOVERY_SUPABASE_URL / RECOVERY_SUPABASE_ANON_KEY.

1. Restore to a New Project (NOT in-place) from production backups.
2. Create .env.recovery (gitignored) with the NEW project URL + anon key.
3. Re-run: node scripts/recovery-integrity-check.mjs

See docs/p0-06-recovery-drill.md
`);
    process.exit(1);
  }

  if (prodUrl && recoveryUrl === prodUrl) {
    fail(
      "isolation",
      "RECOVERY_SUPABASE_URL matches production — refuse to treat prod as drill target",
    );
    process.exit(1);
  } else {
    pass("isolation", `recovery host ${new URL(recoveryUrl).host} ≠ production`);
  }

  // 1) Known published team
  const team = await rpc(recoveryUrl, recoveryKey, "get_public_team_by_slug", {
    p_slug: EXPECT.slug,
  });
  if (!team.ok) {
    fail("public_team_rpc", `HTTP ${team.status}: ${JSON.stringify(team.json).slice(0, 200)}`);
  } else {
    const rows = Array.isArray(team.json) ? team.json : team.json ? [team.json] : [];
    const row = rows[0];
    if (!row) {
      fail("public_team_row", "empty result for slug stars");
    } else {
      const checks = [
        ["id", row.id === EXPECT.id],
        ["slug", row.slug === EXPECT.slug],
        ["name", row.name === EXPECT.name],
        ["publish_status", row.publish_status === EXPECT.publish_status],
      ];
      for (const [field, ok] of checks) {
        if (ok) pass(`team_${field}`, String(row[field]));
        else fail(`team_${field}`, `got ${row[field]} expected ${EXPECT[field]}`);
      }
      if (row.logo_url && String(row.logo_url).includes(EXPECT.id)) {
        pass("team_logo_url_ref", "logo URL references team id");
      } else {
        fail("team_logo_url_ref", `unexpected logo_url: ${row.logo_url}`);
      }
    }
  }

  // 2) Missing slug should not error hard
  const missing = await rpc(recoveryUrl, recoveryKey, "get_public_team_by_slug", {
    p_slug: "__p0_06_missing__",
  });
  if (!missing.ok) {
    fail("missing_slug", `HTTP ${missing.status}`);
  } else {
    const rows = Array.isArray(missing.json) ? missing.json : [];
    if (rows.length === 0) pass("missing_slug", "empty as expected");
    else fail("missing_slug", `unexpected rows: ${rows.length}`);
  }

  // 3) Production still healthy (unchanged by isolated drill)
  try {
    const healthRes = await fetch("https://www.myteamspace.cc/api/health");
    const health = await healthRes.json();
    if (healthRes.ok && health.status === "ok" && health.checks?.supabase === "ok") {
      pass("production_untouched", `health ok commit=${String(health.commit_sha || "").slice(0, 7)}`);
    } else {
      fail("production_untouched", JSON.stringify(health).slice(0, 200));
    }
  } catch (e) {
    fail("production_untouched", e instanceof Error ? e.message : String(e));
  }

  const failed = results.filter((r) => r.status === "FAIL");
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  if (failed.length) {
    process.exit(1);
  }
  console.log("\nP0-06 integrity check PASS on isolated restore target.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
