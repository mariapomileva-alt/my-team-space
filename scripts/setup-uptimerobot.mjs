/**
 * Create / verify MyTeamSpace production UptimeRobot monitors (API v3).
 *
 * Requires Main API key:
 *   # in .env.local (gitignored) or shell:
 *   UPTIMEROBOT_API_KEY=uXXXX...
 *   node scripts/setup-uptimerobot.mjs
 *
 * Optional:
 *   UPTIMEROBOT_DRY_RUN=1
 *   UPTIMEROBOT_SEND_TEST_ALERT=1   # pause/resume Health monitor
 *   UPTIMEROBOT_ALERT_CONTACT_ID=8651600
 *
 * Never commit the API key.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const API = "https://api.uptimerobot.com/v3";
const DRY = process.env.UPTIMEROBOT_DRY_RUN === "1";
const SEND_TEST = process.env.UPTIMEROBOT_SEND_TEST_ALERT === "1";

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
const apiKey = env.UPTIMEROBOT_API_KEY?.trim();

if (!apiKey) {
  console.error(`Missing UPTIMEROBOT_API_KEY.

1. UptimeRobot → Integrations & API → API → Main API Key
2. Add to .env.local (gitignored): UPTIMEROBOT_API_KEY=...
3. Re-run: node scripts/setup-uptimerobot.mjs
`);
  process.exit(1);
}

const MONITORS = [
  {
    friendlyName: "MyTeamSpace Production Homepage",
    url: "https://www.myteamspace.cc/",
    type: "HTTP",
  },
  {
    friendlyName: "MyTeamSpace Production Health",
    url: "https://www.myteamspace.cc/api/health",
    type: "KEYWORD",
    keywordType: "ALERT_NOT_EXISTS",
    keywordCaseType: "CaseSensitive",
    keywordValue: '"status":"ok"',
  },
  {
    friendlyName: "MyTeamSpace Public Page",
    url: "https://www.myteamspace.cc/stars",
    type: "KEYWORD",
    keywordType: "ALERT_NOT_EXISTS",
    keywordCaseType: "CaseSensitive",
    keywordValue: "Dance Is",
  },
];

async function api(method, pathName, body) {
  if (DRY && method !== "GET") {
    console.log(`[dry-run] ${method} ${pathName}`, body ?? "");
    return { dry_run: true };
  }
  const res = await fetch(`${API}${pathName}`, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`${method} ${pathName} ${res.status}: ${text.slice(0, 400)}`);
  }
  return json;
}

function maskEmail(value) {
  if (!value || !String(value).includes("@")) return value;
  const [u, d] = String(value).split("@");
  return `${u.slice(0, 2)}***@${d}`;
}

async function main() {
  const contactsPayload = await api("GET", "/alert-contacts");
  const contacts = contactsPayload?.data ?? [];
  console.log("Alert contacts:");
  for (const c of contacts) {
    console.log(
      `  id=${c.id} type=${c.type} status=${c.status} value=${maskEmail(c.value)}`,
    );
  }

  const contactId =
    env.UPTIMEROBOT_ALERT_CONTACT_ID?.trim() ||
    contacts.find((c) => c.status === "Active" && c.type === "Email")?.id ||
    contacts.find((c) => c.status === "Active")?.id;

  if (!contactId) {
    console.warn("No active alert contact — monitors will have no email alerts.");
  } else {
    console.log("Using alert contact id:", contactId);
  }

  const listed = await api("GET", "/monitors");
  const existing = listed?.data ?? [];
  const byName = new Map(existing.map((m) => [m.friendlyName, m]));

  const results = [];

  for (const spec of MONITORS) {
    let mon = byName.get(spec.friendlyName);
    if (mon) {
      console.log(`✓ exists: ${spec.friendlyName} (id=${mon.id}, status=${mon.status})`);
      results.push({ name: spec.friendlyName, id: mon.id, action: "exists", status: mon.status });
      if (
        spec.type === "KEYWORD" &&
        !DRY &&
        (mon.keywordType !== spec.keywordType || mon.keywordValue !== spec.keywordValue)
      ) {
        await api("PATCH", `/monitors/${mon.id}`, {
          keywordType: spec.keywordType,
          keywordCaseType: spec.keywordCaseType,
          keywordValue: spec.keywordValue,
        });
        console.log(`  → keyword polarity/value updated to ${spec.keywordType}`);
      }
    } else {
      const payload = {
        friendlyName: spec.friendlyName,
        url: spec.url,
        type: spec.type,
        interval: 300,
        timeout: 30,
        followRedirections: true,
      };
      if (spec.type === "KEYWORD") {
        payload.keywordType = spec.keywordType;
        payload.keywordCaseType = spec.keywordCaseType;
        payload.keywordValue = spec.keywordValue;
      }
      // Free plan: do not set sslExpirationReminder / customHttpHeaders on create (403).
      mon = await api("POST", "/monitors", payload);
      console.log(`+ created: ${spec.friendlyName} (id=${mon.id})`);
      results.push({
        name: spec.friendlyName,
        id: mon.id,
        action: "created",
        status: mon.status,
      });
    }

    if (contactId && mon?.id && !DRY) {
      const has = (mon.assignedAlertContacts ?? []).some(
        (c) => String(c.alertContactId) === String(contactId),
      );
      if (!has) {
        // Free plan forces threshold/recurrence to 0 (alert on confirmed down).
        await api("PATCH", `/monitors/${mon.id}`, {
          assignedAlertContacts: [
            { alertContactId: Number(contactId), threshold: 0, recurrence: 0 },
          ],
        });
        console.log(`  → alert contact attached`);
      }
    }
  }

  if (SEND_TEST && !DRY) {
    const health = results.find((r) => r.name === "MyTeamSpace Production Health");
    if (health?.id) {
      console.log("Test alert: pause then start Health monitor...");
      await api("POST", `/monitors/${health.id}/pause`);
      await new Promise((r) => setTimeout(r, 2500));
      await api("POST", `/monitors/${health.id}/start`);
      console.log("Pause/start issued — check email for down/up (may take a few minutes).");
    }
  }

  const finalList = DRY ? existing : ((await api("GET", "/monitors"))?.data ?? []);
  console.log("\nDone. Current monitors:");
  for (const m of finalList.filter((x) =>
    String(x.friendlyName || "").startsWith("MyTeamSpace"),
  )) {
    console.log(
      `  ${m.friendlyName}: ${m.status} (${m.type}) ${m.url} keyword=${m.keywordValue || "-"}`,
    );
  }
  console.log(`
Notes:
- Interval: 5 minutes; follow redirects: on
- Free plan: consecutive-failure threshold unavailable (threshold=0)
- Free plan: SSL expiration reminder via API often blocked — enable in dashboard if offered
- Do NOT monitor /api/lemonsqueezy/webhook with anonymous pings
- Maintenance: pause monitors or create a Maintenance Window before migrations
`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
