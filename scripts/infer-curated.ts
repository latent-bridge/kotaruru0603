/**
 * data/archive.raw.json のタイトルから game / category / episode / collabWith を
 * 推論し、data/archive.curated.json の videos.<videoId>._inferred に書き込む。
 *
 * - 人間が書く top-level フィールド (category / game / tags / hidden / pinned 等) は
 *   一切触らない。再実行で手動タグが吹き飛ぶことはない。
 * - 推論精度は 90% 目標。title に含まれない情報 (例: 番外編のコラボ相手) は
 *   取れないので、手動で top-level に書いて補完する。
 *
 * Usage:
 *   pnpm infer:curated
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const RAW_PATH = path.join(ROOT, "data/archive.raw.json");
const CURATED_PATH = path.join(ROOT, "data/archive.curated.json");

// --- 型 ----------------------------------------------------------------

type RawVideo = {
  videoId: string;
  title: string;
  durationSeconds: number;
  liveBroadcast: "none" | "live" | "upcoming" | "was_live";
};

type RawArchive = { videos: RawVideo[] };

type Game =
  | "Helldivers 2"
  | "Ghost of Yotei"
  | "Dave the diver"
  | "Planet of Lana"
  | "Arise";

type Category = "ポンコツだいぶ" | "ポンコツさむらい" | "ゆるげーむ";

type Inferred = {
  category?: Category;
  game?: Game;
  collabWith?: string[];
  episode?: number;
  tags?: string[];
};

type CuratedEntry = {
  _inferred?: Inferred;
  [k: string]: unknown;
};

type CuratedArchive = {
  _schema?: unknown;
  videos: Record<string, CuratedEntry>;
};

// --- 推論ルール --------------------------------------------------------

const GAME_PATTERNS: Array<{ game: Game; regexes: RegExp[] }> = [
  {
    game: "Helldivers 2",
    regexes: [
      /Helldivers\s*2/i,
      /Hell\s*divers\s*2/i,
      /ヘルダイバー\s*2/,
      /へるだいばー\s*2/,
      /ヘルダイブ/,
    ],
  },
  {
    game: "Ghost of Yotei",
    regexes: [/Ghost\s*of\s*Yotei/i, /GhostofYotei/i],
  },
  {
    game: "Dave the diver",
    regexes: [/Dave\s*the\s*diver/i, /Davethediver/i],
  },
  {
    game: "Planet of Lana",
    regexes: [
      /planetoflana/i,
      /Plan(?:e|et)\s*of\s*Lana/i,
      /プラネット\s*オブ\s*ラナ/,
      /プラネットオブラナ/,
    ],
  },
  {
    game: "Arise",
    regexes: [/Arise\s*:\s*a\s*simple\s*story/i, /\[Arise\]/i],
  },
  {
    game: "Prince of Persia",
    regexes: [
      /Prince\s*of\s*Persia/i,
      /失われた王冠/,
      /ポンコツ\s*Prince/i,
    ],
  },
];

const GAME_TO_CATEGORY: Record<Game, Category> = {
  "Helldivers 2": "ポンコツだいぶ",
  "Ghost of Yotei": "ポンコツさむらい",
  "Dave the diver": "ゆるげーむ",
  "Planet of Lana": "ゆるげーむ",
  Arise: "ゆるげーむ",
  "Prince of Persia": "ゆるげーむ",
};

const KANJI_NUM: Record<string, number> = {
  一: 1, 二: 2, 三: 3, 四: 4, 五: 5,
  六: 6, 七: 7, 八: 8, 九: 9, 十: 10,
};

function inferGame(title: string): Game | undefined {
  for (const { game, regexes } of GAME_PATTERNS) {
    if (regexes.some((r) => r.test(title))) return game;
  }
  return undefined;
}

function inferEpisode(title: string): number | undefined {
  // #21, #19, #1.5 — require non-alphanumeric or end after the number
  const hash = title.match(/#(\d+(?:\.\d+)?)(?![a-zA-Z0-9_])/);
  if (hash) return parseFloat(hash[1]);

  // 第八章, 第九章 (kanji 1-10, 十一-十九)
  const kanji = title.match(/第([一二三四五六七八九十]+)章/);
  if (kanji) {
    const s = kanji[1];
    if (s.length === 1) return KANJI_NUM[s];
    // 十一 = 11, 十二 = 12, ... 十九 = 19
    if (s.startsWith("十") && s.length === 2) {
      const tail = KANJI_NUM[s[1]];
      if (tail !== undefined) return 10 + tail;
    }
    // 二十 = 20, 三十 = 30, etc
    if (s.endsWith("十") && s.length === 2) {
      const head = KANJI_NUM[s[0]];
      if (head !== undefined) return head * 10;
    }
    return undefined;
  }

  // 第1章, 第9章 (arabic)
  const arabic = title.match(/第(\d+)章/);
  if (arabic) return parseInt(arabic[1], 10);

  return undefined;
}

const HONORIFICS = /お姉様|お兄さん|先輩|後輩|せんぱい|師匠|親分/;

function hasHonorific(name: string): boolean {
  return HONORIFICS.test(name);
}

type CollabInfo = { names: string[]; isExplicit: boolean };

/**
 * タイトルから collab 相手を抽出。
 * - "XXX と(初)?コラボ"  → 確実な collab (誰相手でも抽出)
 * - "XXX と共に"          → 名前に敬称がある時だけ (タマキと共に等の非コラボを除外)
 */
function inferCollabWith(title: string): CollabInfo {
  const names = new Set<string>();
  let isExplicit = false;

  // Pattern A: XXXと(初)?コラボ  — 明示的なコラボキーワード
  const patA = /(?:[\[［【\s、，]|^)([^\[\]［］【】、，\s#]{2,20}?)と(?:初)?コラボ/g;
  let m: RegExpExecArray | null;
  while ((m = patA.exec(title)) !== null) {
    names.add(m[1]);
    isExplicit = true;
  }

  // Pattern B: XXXと共に  — 敬称を持つ名前のみ採用
  const patB = /(?:[\[［【\s、，]|^)([^\[\]［］【】、，\s#]{2,20}?)と共に/g;
  while ((m = patB.exec(title)) !== null) {
    if (hasHonorific(m[1])) {
      names.add(m[1]);
      isExplicit = true;
    }
    // else: タマキと共に 等は無視 (ゲーム内キャラの可能性)
  }

  return { names: Array.from(names), isExplicit };
}

function inferCategory(
  game: Game | undefined,
  isClip: boolean,
): Category | undefined {
  // category は「ゲーム軸」に一本化する。コラボかどうかは collabWith で
  // 独立に表現するので、こらぼ回でも game-derived category を立てる
  // (以前は collab なら game を捨てて "こらぼ" を出していた)。
  if (isClip) return undefined;
  if (game) return GAME_TO_CATEGORY[game];
  return undefined;
}

function isClipVideo(raw: RawVideo): boolean {
  return raw.durationSeconds < 180 && raw.liveBroadcast === "none";
}

function inferOne(raw: RawVideo): Inferred {
  const isClip = isClipVideo(raw);
  const game = inferGame(raw.title);
  const collab = inferCollabWith(raw.title);
  const category = inferCategory(game, isClip);
  const episode = inferEpisode(raw.title);

  const inferred: Inferred = {};
  if (category) inferred.category = category;
  if (game) inferred.game = game;
  if (episode !== undefined) inferred.episode = episode;
  if (collab.names.length > 0) inferred.collabWith = collab.names;
  return inferred;
}

// --- main -------------------------------------------------------------

function readJson<T>(p: string): T {
  return JSON.parse(fs.readFileSync(p, "utf-8")) as T;
}

function writeJson(p: string, data: unknown): void {
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n");
}

function shallowEqual(a: Inferred, b: Inferred): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function main() {
  const raw = readJson<RawArchive>(RAW_PATH);
  const curated = readJson<CuratedArchive>(CURATED_PATH);
  if (!curated.videos) curated.videos = {};

  let added = 0;
  let updated = 0;
  let unchanged = 0;
  const unclassified: string[] = [];

  for (const v of raw.videos) {
    const newInferred = inferOne(v);
    const existing = curated.videos[v.videoId] ?? {};
    const oldInferred: Inferred = (existing._inferred as Inferred) ?? {};

    if (!existing._inferred) {
      added += 1;
    } else if (!shallowEqual(oldInferred, newInferred)) {
      updated += 1;
    } else {
      unchanged += 1;
    }

    existing._inferred = newInferred;
    curated.videos[v.videoId] = existing;

    if (!newInferred.category && !isClipVideo(v)) {
      unclassified.push(`${v.videoId}  ${v.title}`);
    }
  }

  writeJson(CURATED_PATH, curated);

  console.log(`inferred on ${raw.videos.length} videos:`);
  console.log(`  added (new entry):     ${added}`);
  console.log(`  updated (infer drift): ${updated}`);
  console.log(`  unchanged:             ${unchanged}`);

  if (unclassified.length > 0) {
    console.log("");
    console.log(`⚠ category 未分類の配信 (${unclassified.length}件):`);
    for (const line of unclassified) console.log(`  ${line}`);
  }

  // 分類サマリ
  const catCount: Record<string, number> = {};
  const gameCount: Record<string, number> = {};
  const collabCount: Record<string, number> = {};
  let clips = 0;
  for (const v of raw.videos) {
    const inf = (curated.videos[v.videoId]?._inferred as Inferred) ?? {};
    if (isClipVideo(v)) clips += 1;
    if (inf.category) catCount[inf.category] = (catCount[inf.category] ?? 0) + 1;
    if (inf.game) gameCount[inf.game] = (gameCount[inf.game] ?? 0) + 1;
    for (const c of inf.collabWith ?? []) collabCount[c] = (collabCount[c] ?? 0) + 1;
  }

  console.log("");
  console.log(`=== category 分布 ===`);
  for (const [k, n] of Object.entries(catCount).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k.padEnd(14)} ${n}`);
  }
  console.log(`  (くりっぷ)         ${clips}`);
  console.log("");
  console.log(`=== game 分布 ===`);
  for (const [k, n] of Object.entries(gameCount).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k.padEnd(20)} ${n}`);
  }
  console.log("");
  console.log(`=== 検出された collabWith ===`);
  for (const [k, n] of Object.entries(collabCount).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k.padEnd(20)} ${n}`);
  }
}

main();
