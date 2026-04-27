// Build-time content fetch. Pulls admin-edited schedule from chat-api into a
// JSON file consumed by lib/mochi.ts. Run before `next build`.
//
// Designed to be safe in CI: a fetch failure does NOT fail the build. The
// existing data/schedule.json (or the inline fallback in lib/mochi.ts) keeps
// the site renderable. CI will retry on the next dispatch.

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

const SITE_ID = process.env.SITE_ID ?? "kotaruru0603";
const API_BASE =
  process.env.CHAT_API_BASE ?? "https://chat.latent-bridge.com";

type ScheduleEntry = {
  date: string;
  title: string | null;
  time: string | null;
  category: string | null;
  emoji: string | null;
  note: string | null;
};

const DAYS_TO_FETCH = 14;

async function main() {
  // Fetch a wider window than the public site renders (7 days) so a near-term
  // edit during the build window doesn't wipe out the next week.
  const url = `${API_BASE}/public/schedule/${SITE_ID}?days=${DAYS_TO_FETCH}`;
  console.log(`[fetch-content] GET ${url}`);
  let entries: ScheduleEntry[] = [];
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[fetch-content] non-ok status ${res.status}, skipping`);
      return;
    }
    const body = (await res.json()) as { entries: ScheduleEntry[] };
    entries = body.entries ?? [];
  } catch (err) {
    console.warn(`[fetch-content] fetch failed: ${(err as Error).message}, skipping`);
    return;
  }

  if (entries.length === 0) {
    console.log("[fetch-content] no admin entries yet, leaving existing JSON");
    return;
  }

  const outPath = join(process.cwd(), "data", "schedule.json");
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify({ entries }, null, 2) + "\n", "utf8");
  console.log(`[fetch-content] wrote ${entries.length} entries → ${outPath}`);
}

main().catch((err) => {
  console.error("[fetch-content] unexpected error:", err);
  // Still exit 0 — content fetch is best-effort.
  process.exit(0);
});
