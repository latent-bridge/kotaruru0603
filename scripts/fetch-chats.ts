/**
 * data/archive.raw.json の was_live 動画について、yt-dlp でチャットリプレイ
 * JSON を取得し、必要最小限に絞って public/chats/{videoId}.json に書き出す。
 *
 * ランタイムではこの JSON を fetch() で読み、YouTube IFrame Player の
 * `getCurrentTime()` と同期して自前 UI で描画する (stream-ui の ChatReplay)。
 *
 * Usage:
 *   pnpm fetch:chats           # 未取得分のみ
 *   pnpm fetch:chats -- --force  # 全件強制再取得
 */

import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const RAW_JSON_PATH = path.join(ROOT, "data/archive.raw.json");
const OUT_DIR = path.join(ROOT, "public/chats");
const TMP_DIR = path.join(ROOT, "tmp");
const YT_DLP = path.join(ROOT, ".venv/bin/yt-dlp");

const force = process.argv.includes("--force");

// --- 型 ---------------------------------------------------------------

type RawVideo = {
  videoId: string;
  title: string;
  liveBroadcast: "none" | "live" | "upcoming" | "was_live";
};

type ArchiveRaw = { videos: RawVideo[] };

/** 簡素化後 1 行ぶん */
type Msg = {
  t: number; // offsetMs
  a: string; // author display name
  m: string; // flattened message (emoji は ":id:" プレースホルダ)
  p: string; // avatar URL (small)
  b?: string[]; // badges (存在時のみ)
  s?: number; // super chat amount (存在時のみ, 表示だけに使用)
  c?: string; // super chat background color hex (存在時)
};

// --- 取得 -------------------------------------------------------------

function runYtDlp(videoId: string, outPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const args = [
      "--skip-download",
      "--write-subs",
      "--sub-langs",
      "live_chat",
      "--no-warnings",
      "--quiet",
      "-o",
      outPath.replace(/\.live_chat\.json$/, ".%(ext)s"),
      `https://www.youtube.com/watch?v=${videoId}`,
    ];
    const child = spawn(YT_DLP, args, { stdio: ["ignore", "ignore", "pipe"] });
    let err = "";
    child.stderr.on("data", (d) => {
      err += d.toString();
    });
    child.on("close", (code) => {
      if (code !== 0) {
        console.error(`    yt-dlp exit ${code}: ${err.slice(0, 200)}`);
        resolve(false);
      } else if (!fs.existsSync(outPath)) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
    child.on("error", (e) => {
      console.error(`    spawn error: ${e}`);
      resolve(false);
    });
  });
}

// --- 変換 -------------------------------------------------------------

type Run =
  | { text: string }
  | { emoji: { emojiId?: string; shortcuts?: string[]; image?: unknown } };

function flattenRuns(runs: Run[] | undefined): string {
  if (!Array.isArray(runs)) return "";
  return runs
    .map((r) => {
      if ("text" in r && typeof r.text === "string") return r.text;
      if ("emoji" in r) {
        const e = r.emoji;
        const id = e?.shortcuts?.[0] ?? e?.emojiId;
        return id ? `:${id}:` : "";
      }
      return "";
    })
    .join("");
}

function extractBadges(tm: Record<string, unknown>): string[] | undefined {
  const arr = tm.authorBadges as unknown;
  if (!Array.isArray(arr) || arr.length === 0) return undefined;
  const out: string[] = [];
  for (const b of arr) {
    const br = (b as Record<string, unknown>)
      ?.liveChatAuthorBadgeRenderer as Record<string, unknown> | undefined;
    const icon = (br?.icon as Record<string, unknown> | undefined)?.iconType;
    const tooltip = br?.tooltip;
    if (typeof icon === "string") out.push(icon); // MODERATOR / VERIFIED / OWNER
    else if (typeof tooltip === "string") out.push(tooltip); // 会員バッジなど
  }
  return out.length > 0 ? out : undefined;
}

function extractAvatar(tm: Record<string, unknown>): string {
  const photo = tm.authorPhoto as Record<string, unknown> | undefined;
  const thumbs = photo?.thumbnails as
    | Array<{ url?: string; width?: number }>
    | undefined;
  if (!Array.isArray(thumbs)) return "";
  // prefer 32x / small
  const sorted = [...thumbs].sort((a, b) => (a.width ?? 0) - (b.width ?? 0));
  return sorted[0]?.url ?? "";
}

function transform(rawNdjson: string): Msg[] {
  const out: Msg[] = [];
  for (const line of rawNdjson.split("\n")) {
    if (!line) continue;
    let obj: Record<string, unknown>;
    try {
      obj = JSON.parse(line);
    } catch {
      continue;
    }
    const action = obj.replayChatItemAction as
      | Record<string, unknown>
      | undefined;
    if (!action) continue;
    const offsetMs = parseInt(String(action.videoOffsetTimeMsec ?? "0"), 10);
    const actions = action.actions as unknown[] | undefined;
    if (!Array.isArray(actions)) continue;
    for (const a of actions) {
      const add = (a as Record<string, unknown>).addChatItemAction as
        | Record<string, unknown>
        | undefined;
      const item = add?.item as Record<string, unknown> | undefined;
      if (!item) continue;
      const text = item.liveChatTextMessageRenderer as
        | Record<string, unknown>
        | undefined;
      const paid = item.liveChatPaidMessageRenderer as
        | Record<string, unknown>
        | undefined;
      const tm = text ?? paid;
      if (!tm) continue; // engagement banner / membership join 等はスキップ

      const authorName =
        (tm.authorName as { simpleText?: string } | undefined)?.simpleText ??
        "";
      const msg = flattenRuns(
        (tm.message as { runs?: Run[] } | undefined)?.runs,
      );
      const photo = extractAvatar(tm);
      const badges = extractBadges(tm);

      const entry: Msg = {
        t: offsetMs,
        a: authorName,
        m: msg,
        p: photo,
      };
      if (badges) entry.b = badges;
      if (paid) {
        const amount = (paid.purchaseAmountText as { simpleText?: string })
          ?.simpleText;
        const bgColor = paid.bodyBackgroundColor as number | undefined;
        if (amount) entry.s = 1; // flag as super chat; TODO could store string
        if (typeof amount === "string") (entry as unknown as { sa: string }).sa = amount;
        if (typeof bgColor === "number")
          entry.c = "#" + (bgColor & 0xffffff).toString(16).padStart(6, "0");
      }
      out.push(entry);
    }
  }
  out.sort((a, b) => a.t - b.t);
  return out;
}

// --- main -------------------------------------------------------------

async function main() {
  if (!fs.existsSync(YT_DLP)) {
    console.error(
      `yt-dlp not found at ${YT_DLP}. Run once:\n  python3 -m venv .venv && .venv/bin/pip install yt-dlp`,
    );
    process.exit(1);
  }

  const archive: ArchiveRaw = JSON.parse(
    fs.readFileSync(RAW_JSON_PATH, "utf-8"),
  );
  const targets = archive.videos.filter((v) => v.liveBroadcast === "was_live");
  console.log(`target was_live videos: ${targets.length}`);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(TMP_DIR, { recursive: true });

  const stats = { skipped: 0, fetched: 0, empty: 0, failed: 0 };

  for (let i = 0; i < targets.length; i += 1) {
    const v = targets[i];
    const outJson = path.join(OUT_DIR, `${v.videoId}.json`);
    if (!force && fs.existsSync(outJson)) {
      stats.skipped += 1;
      continue;
    }

    const rawPath = path.join(TMP_DIR, `${v.videoId}.live_chat.json`);
    if (fs.existsSync(rawPath)) fs.unlinkSync(rawPath);

    process.stdout.write(
      `  [${i + 1}/${targets.length}] ${v.videoId} ${v.title.slice(0, 40)}... `,
    );

    const ok = await runYtDlp(v.videoId, rawPath);
    if (!ok) {
      stats.failed += 1;
      process.stdout.write("FAIL\n");
      continue;
    }

    const raw = fs.readFileSync(rawPath, "utf-8");
    const msgs = transform(raw);
    fs.writeFileSync(outJson, JSON.stringify(msgs));
    fs.unlinkSync(rawPath);

    if (msgs.length === 0) stats.empty += 1;
    stats.fetched += 1;
    process.stdout.write(`${msgs.length} msgs\n`);
  }

  console.log("");
  console.log(`done:`);
  console.log(`  skipped (already have): ${stats.skipped}`);
  console.log(`  fetched:                ${stats.fetched}`);
  console.log(`  empty (no messages):    ${stats.empty}`);
  console.log(`  failed:                 ${stats.failed}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
