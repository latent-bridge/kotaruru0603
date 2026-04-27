// Build-time content fetch. Pulls admin-edited content from chat-api into JSON
// files consumed by lib/mochi.ts and lib/archive.ts. Run before `next build`.
//
// Also stages archive raw/curated/overrides under public/data/ so the admin
// app can fetch them cross-origin (GitHub Pages serves with ACAO: *).
//
// Designed to be safe in CI: a fetch failure does NOT fail the build. The
// existing committed data/*.json (or inline fallbacks) keep the site
// renderable. CI will retry on the next dispatch.

import { writeFile, mkdir, copyFile } from "node:fs/promises";
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

type ArchiveOverride = {
  video_id: string;
  category: string | null;
  game: string | null;
  collab_with: string[] | null;
  episode: number | null;
  tags: string[] | null;
  kind: string | null;
  hidden: boolean | null;
  pinned: boolean | null;
  tone: string | null;
  memo: string | null;
};

const DAYS_TO_FETCH = 14;

async function fetchSchedule() {
  const url = `${API_BASE}/public/schedule/${SITE_ID}?days=${DAYS_TO_FETCH}`;
  console.log(`[fetch-content] GET ${url}`);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[fetch-content] schedule non-ok ${res.status}, skipping`);
      return;
    }
    const body = (await res.json()) as { entries: ScheduleEntry[] };
    const entries = body.entries ?? [];
    if (entries.length === 0) {
      console.log("[fetch-content] no admin schedule entries yet");
      return;
    }
    const outPath = join(process.cwd(), "data", "schedule.json");
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, JSON.stringify({ entries }, null, 2) + "\n", "utf8");
    console.log(`[fetch-content] wrote ${entries.length} schedule entries`);
  } catch (err) {
    console.warn(`[fetch-content] schedule fetch failed: ${(err as Error).message}`);
  }
}

async function fetchArchiveOverrides() {
  const url = `${API_BASE}/public/archive/overrides/${SITE_ID}`;
  console.log(`[fetch-content] GET ${url}`);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[fetch-content] archive overrides non-ok ${res.status}`);
      // Still write an empty file so lib/archive.ts can import it deterministically.
      await writeOverrides([]);
      return;
    }
    const body = (await res.json()) as { overrides: ArchiveOverride[] };
    const overrides = body.overrides ?? [];
    await writeOverrides(overrides);
    console.log(`[fetch-content] wrote ${overrides.length} archive overrides`);
  } catch (err) {
    console.warn(`[fetch-content] archive overrides fetch failed: ${(err as Error).message}`);
    await writeOverrides([]);
  }
}

async function writeOverrides(overrides: ArchiveOverride[]) {
  const outPath = join(process.cwd(), "data", "archive.overrides.json");
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify({ overrides }, null, 2) + "\n", "utf8");
}

// Stage raw / curated / overrides under public/data/ so the admin app can
// fetch them cross-origin. lib/archive.ts continues to import the originals
// from data/ at build time; these are the runtime-fetchable copies.
async function exposeAdminData() {
  const targets = [
    "archive.raw.json",
    "archive.curated.json",
    "archive.overrides.json",
  ];
  const dst = join(process.cwd(), "public", "data");
  await mkdir(dst, { recursive: true });
  for (const f of targets) {
    const src = join(process.cwd(), "data", f);
    try {
      await copyFile(src, join(dst, f));
    } catch (err) {
      console.warn(`[fetch-content] copy ${f} skipped: ${(err as Error).message}`);
    }
  }
}

async function main() {
  await fetchSchedule();
  await fetchArchiveOverrides();
  await exposeAdminData();
}

main().catch((err) => {
  console.error("[fetch-content] unexpected error:", err);
  // Still exit 0 — content fetch is best-effort.
  process.exit(0);
});
