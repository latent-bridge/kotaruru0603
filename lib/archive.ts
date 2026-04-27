/**
 * アーカイブ merge 層。
 *
 *   data/archive.raw.json      (スクリプト生成、YouTube 客観データ)
 *   data/archive.curated.json  (人間が育てる、videoId → タグ)
 *        ↓ join (videoId)
 *   Memory[]                   (UI が使う型)
 *
 * raw/curated はどちらも videoId を primary key に使う。
 */

import rawJson from "@/data/archive.raw.json";
import curatedJson from "@/data/archive.curated.json";
import overridesJson from "@/data/archive.overrides.json";

// --- 列挙定義 -----------------------------------------------------------

export const GAMES = [
  "Helldivers 2",
  "Ghost of Yotei",
  "Dave the diver",
  "Planet of Lana",
  "Arise",
] as const;
export type Game = (typeof GAMES)[number];

export const CATEGORIES = [
  "ポンコツだいぶ",
  "ポンコツさむらい",
  "ゆるげーむ",
] as const;
export type Category = (typeof CATEGORIES)[number];

/**
 * 「こらぼ」は category ではなく「こらぼ相手がいるか」の独立した軸。
 * UI のフィルタチップでは他の category と並んで見えるが、内部的には
 * collabWith.length > 0 でフィルタされる。
 */
export const COLLAB_FILTER_KEY = "こらぼ" as const;
export type CollabFilterKey = typeof COLLAB_FILTER_KEY;

export type Kind = "stream" | "clip";

export type Tone = "coral" | "lilac" | "mint" | "cream";

// --- 生データ型 (raw json の shape) -------------------------------------

type RawThumbnails = {
  default: string;
  medium: string;
  high: string;
  maxres: string | null;
};

type RawVideo = {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  durationSeconds: number;
  viewCount: number;
  likeCount: number | null;
  thumbnails: RawThumbnails;
  youtubeTags: string[];
  youtubeCategoryId: string;
  liveBroadcast: "none" | "live" | "upcoming" | "was_live";
  liveDetails: {
    scheduledStartTime: string | null;
    actualStartTime: string | null;
    actualEndTime: string | null;
  } | null;
  liveChatReplayContinuation?: string | null;
};

type RawArchive = {
  meta: { channelId: string; lastFetchedAt: string; videoCount: number };
  videos: RawVideo[];
};

// --- キュレーション型 --------------------------------------------------

/**
 * infer-curated.ts が自動生成する部分。ここのフィールドは再実行で上書きされる。
 * 人間はこの層を直接編集しないこと (上書きしたい場合は top-level に書く)。
 */
export type InferredFields = {
  category?: Category;
  game?: Game;
  collabWith?: string[];
  episode?: number;
  tags?: string[];
};

export type CuratedVideo = {
  _inferred?: InferredFields;

  // 以下は人間が書くフィールド。_inferred より優先される。
  // 「infer 推論を打ち消したい」場合も top-level に値を書く (例: category を別の値に変える)。
  category?: Category;
  game?: Game;
  collabWith?: string[];
  episode?: number;
  tags?: string[];
  kind?: Kind; // clip/stream 手動上書き
  hidden?: boolean;
  pinned?: boolean;
  tone?: Tone;
  memo?: string;
};

type CuratedArchive = {
  _schema?: unknown;
  videos: Record<string, CuratedVideo>;
};

// Admin-side overrides (managed via the admin app, persisted in chat-api).
// Sparse: only fields the operator explicitly set. NULL fields fall through
// to the curated.json human top-level → _inferred → defaults chain.
type AdminOverride = {
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

const overridesByVideoId: Map<string, AdminOverride> = new Map();
{
  const raw = overridesJson as { overrides?: AdminOverride[] };
  for (const o of raw.overrides ?? []) {
    if (o.video_id) overridesByVideoId.set(o.video_id, o);
  }
}

function effective(c: CuratedVideo | undefined, videoId: string) {
  const inferred = c?._inferred ?? {};
  const ov = overridesByVideoId.get(videoId);
  // Precedence: admin override > curated top-level > _inferred > default.
  return {
    category: (ov?.category as Category | undefined) ?? c?.category ?? inferred.category,
    game: (ov?.game as Game | undefined) ?? c?.game ?? inferred.game,
    collabWith: ov?.collab_with ?? c?.collabWith ?? inferred.collabWith ?? [],
    episode: ov?.episode ?? c?.episode ?? inferred.episode,
    tags: ov?.tags ?? c?.tags ?? inferred.tags ?? [],
    kind: (ov?.kind as Kind | undefined) ?? c?.kind,
    pinned: ov?.pinned ?? c?.pinned === true,
    tone: (ov?.tone as Tone | undefined) ?? c?.tone,
  };
}

// Hidden state lookup — public listing filters these out, but admin must be
// able to see them. Exposed so callers can decide what to do.
export function isHiddenByOverride(videoId: string, curated: CuratedVideo | undefined): boolean {
  const ov = overridesByVideoId.get(videoId);
  if (ov?.hidden === true) return true;
  if (ov?.hidden === false) return false; // explicit un-hide wins over curated
  return curated?.hidden === true;
}

// --- UI が使う merged 型 -----------------------------------------------

export type Memory = {
  videoId: string;
  title: string;
  description: string; // YouTube の動画説明 (改行含む)
  publishedAt: string; // ISO
  date: string; // "2026.04.20"
  duration: string; // "4:11:00" or "3:28"
  durationSeconds: number;
  views: string; // "312" or "2.3K"
  viewCount: number;
  likeCount: number | null;
  thumbnailUrl: string;
  thumbnailUrlHigh: string; // 詳細ページ用の大きいサムネ
  youtubeUrl: string;
  youtubeEmbedUrl: string; // iframe の src
  wasLive: boolean; // 過去に live だったか
  chatReplayContinuation: string | null; // チャットリプレイ iframe 用トークン (なければ null → トグル非表示)
  kind: Kind;
  category: Category | null;
  game: Game | null;
  collabWith: string[];
  episode: number | null;
  tags: string[];
  pinned: boolean;
  tone: Tone;
};

// --- 導出ヘルパ --------------------------------------------------------

const CLIP_MAX_SECONDS = 180;

function deriveKind(raw: RawVideo, overrideKind: Kind | undefined): Kind {
  if (overrideKind) return overrideKind;
  if (raw.durationSeconds < CLIP_MAX_SECONDS && raw.liveBroadcast === "none") {
    return "clip";
  }
  return "stream";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatViews(n: number): string {
  if (n < 1000) return String(n);
  if (n < 10000) return `${(n / 1000).toFixed(1)}K`;
  if (n < 1_000_000) return `${Math.floor(n / 1000)}K`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}

const TONES: readonly Tone[] = ["coral", "lilac", "mint", "cream"];

function hashTone(videoId: string): Tone {
  let h = 0;
  for (let i = 0; i < videoId.length; i += 1) {
    h = (h * 31 + videoId.charCodeAt(i)) >>> 0;
  }
  return TONES[h % TONES.length];
}

function toMemory(raw: RawVideo, curated: CuratedVideo | undefined): Memory {
  const eff = effective(curated, raw.videoId);
  return {
    videoId: raw.videoId,
    title: raw.title,
    description: raw.description,
    publishedAt: raw.publishedAt,
    date: formatDate(raw.publishedAt),
    duration: formatDuration(raw.durationSeconds),
    durationSeconds: raw.durationSeconds,
    views: formatViews(raw.viewCount),
    viewCount: raw.viewCount,
    likeCount: raw.likeCount,
    thumbnailUrl:
      raw.thumbnails.medium || raw.thumbnails.high || raw.thumbnails.default,
    thumbnailUrlHigh:
      raw.thumbnails.maxres ||
      raw.thumbnails.high ||
      raw.thumbnails.medium ||
      raw.thumbnails.default,
    youtubeUrl: `https://www.youtube.com/watch?v=${raw.videoId}`,
    youtubeEmbedUrl: `https://www.youtube.com/embed/${raw.videoId}`,
    wasLive: raw.liveBroadcast === "was_live",
    chatReplayContinuation: raw.liveChatReplayContinuation ?? null,
    kind: deriveKind(raw, eff.kind),
    category: eff.category ?? null,
    game: eff.game ?? null,
    collabWith: eff.collabWith,
    episode: eff.episode ?? null,
    tags: eff.tags,
    pinned: eff.pinned,
    tone: eff.tone ?? hashTone(raw.videoId),
  };
}

// --- エクスポート: メモリ配列 ------------------------------------------

const rawArchive = rawJson as RawArchive;
const curatedArchive = curatedJson as CuratedArchive;

export const memories: Memory[] = rawArchive.videos
  .filter((v) => !isHiddenByOverride(v.videoId, curatedArchive.videos[v.videoId]))
  .map((v) => toMemory(v, curatedArchive.videos[v.videoId]));

// --- クエリヘルパ (page 側 useMemo 用) ---------------------------------

export type ArchiveQuery = {
  kind?: Kind;
  category?: Category | null; // null = すべて
  collabOnly?: boolean; // true = コラボ相手がいる動画のみ
  game?: Game | null; // null = すべて
  search?: string;
  sort?: "newest" | "oldest" | "popular" | "series";
};

export function queryMemories(
  base: readonly Memory[],
  q: ArchiveQuery,
): Memory[] {
  let out = base.slice();

  if (q.kind) out = out.filter((m) => m.kind === q.kind);
  if (q.category) out = out.filter((m) => m.category === q.category);
  if (q.collabOnly) out = out.filter((m) => m.collabWith.length > 0);
  if (q.game) out = out.filter((m) => m.game === q.game);

  const s = q.search?.trim().toLowerCase();
  if (s) {
    out = out.filter((m) => {
      if (m.title.toLowerCase().includes(s)) return true;
      if (m.tags.some((t) => t.toLowerCase().includes(s))) return true;
      if (m.collabWith.some((c) => c.toLowerCase().includes(s))) return true;
      if (m.game?.toLowerCase().includes(s)) return true;
      return false;
    });
  }

  const sort = q.sort ?? "newest";
  out.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (sort === "newest") return b.publishedAt.localeCompare(a.publishedAt);
    if (sort === "oldest") return a.publishedAt.localeCompare(b.publishedAt);
    if (sort === "popular") return b.viewCount - a.viewCount;
    // series: game でグルーピング、内部は episode 昇順
    const ga = a.game ?? "￿";
    const gb = b.game ?? "￿";
    if (ga !== gb) return ga.localeCompare(gb);
    return (a.episode ?? Number.MAX_SAFE_INTEGER) - (b.episode ?? Number.MAX_SAFE_INTEGER);
  });

  return out;
}

// --- 詳細ページ用ヘルパ ------------------------------------------------

export function findMemory(videoId: string): Memory | undefined {
  return memories.find((m) => m.videoId === videoId);
}

/**
 * 同じゲームの配信を episode / publishedAt 昇順で返す。
 * (番外編や episode 不明なものは末尾に publishedAt 順)
 */
export function sameSeries(memory: Memory): Memory[] {
  if (!memory.game) return [];
  return memories
    .filter((m) => m.kind === "stream" && m.game === memory.game)
    .sort((a, b) => {
      if (a.episode !== null && b.episode !== null) return a.episode - b.episode;
      if (a.episode !== null) return -1;
      if (b.episode !== null) return 1;
      return a.publishedAt.localeCompare(b.publishedAt);
    });
}

export function seriesNeighbors(memory: Memory): {
  prev: Memory | null;
  next: Memory | null;
} {
  const series = sameSeries(memory);
  const idx = series.findIndex((m) => m.videoId === memory.videoId);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? series[idx - 1] : null,
    next: idx < series.length - 1 ? series[idx + 1] : null,
  };
}

// --- live / upcoming 判別 ----------------------------------------------

export type StreamState =
  | { kind: "live"; memory: Memory; actualStartAt: Date | null; videoId: string }
  | { kind: "upcoming"; memory: Memory | null; scheduledAt: Date; videoId: string }
  | { kind: "none" };

/**
 * 予定時刻を過ぎた upcoming は「たぶん始まってる」とみなして live 扱いにする猶予時間。
 * YouTube のラベル更新 (upcoming → live) には 1-2 分遅延があるので、6時間あれば
 * 実用上十分。これ以上古い upcoming は放置配信とみなして候補から外す。
 */
const UPCOMING_GRACE_MS = 6 * 60 * 60 * 1000;

export function getStreamState(now: Date = new Date()): StreamState {
  // 1. 明示的に liveBroadcast === "live"
  for (const raw of rawArchive.videos) {
    if (raw.liveBroadcast !== "live") continue;
    const memory = findMemory(raw.videoId) ?? null;
    if (!memory) continue;
    return {
      kind: "live",
      memory,
      actualStartAt: raw.liveDetails?.actualStartTime
        ? new Date(raw.liveDetails.actualStartTime)
        : null,
      videoId: raw.videoId,
    };
  }

  // 2. upcoming 候補 を scheduledAt 昇順で集める
  const upcomingList = rawArchive.videos
    .filter(
      (v) =>
        v.liveBroadcast === "upcoming" && v.liveDetails?.scheduledStartTime,
    )
    .map((v) => ({
      raw: v,
      at: new Date(v.liveDetails!.scheduledStartTime!),
    }))
    .sort((a, b) => a.at.getTime() - b.at.getTime());

  // 3. 予定時刻を過ぎた直近 upcoming → たぶん配信中扱い
  const pastWithinGrace = upcomingList.find((x) => {
    const diff = now.getTime() - x.at.getTime();
    return diff >= 0 && diff < UPCOMING_GRACE_MS;
  });
  if (pastWithinGrace) {
    const memory = findMemory(pastWithinGrace.raw.videoId) ?? null;
    if (memory) {
      return {
        kind: "live",
        memory,
        actualStartAt: pastWithinGrace.at,
        videoId: pastWithinGrace.raw.videoId,
      };
    }
  }

  // 4. 未来の upcoming が 1 件でもあれば最も近いものを返す
  const futureUpcoming = upcomingList.find(
    (x) => x.at.getTime() > now.getTime(),
  );
  if (futureUpcoming) {
    const memory = findMemory(futureUpcoming.raw.videoId);
    return {
      kind: "upcoming",
      memory: memory ?? null,
      scheduledAt: futureUpcoming.at,
      videoId: futureUpcoming.raw.videoId,
    };
  }

  return { kind: "none" };
}

/**
 * 関連動画を score 順に返す。同じ kind (stream/clip) の中でのみ探す。
 *  +100: 同じ game
 *  + 50: collabWith が重なる
 *  + 20: 同じ category
 * 候補がゼロの場合は、同じ kind の最新を publishedAt 降順で詰める。
 */
export function relatedMemories(memory: Memory, limit = 6): Memory[] {
  const pool = memories.filter(
    (m) => m.videoId !== memory.videoId && m.kind === memory.kind,
  );

  const scored = pool.map((m) => {
    let score = 0;
    if (memory.game && m.game === memory.game) score += 100;
    if (memory.category && m.category === memory.category) score += 20;
    for (const c of memory.collabWith) {
      if (m.collabWith.includes(c)) score += 50;
    }
    return { m, score };
  });

  const ranked = scored
    .filter((x) => x.score > 0)
    .sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      return b.m.publishedAt.localeCompare(a.m.publishedAt);
    })
    .map((x) => x.m);

  if (ranked.length >= limit) return ranked.slice(0, limit);

  // fallback: kind が合う最新で残りを埋める
  const usedIds = new Set(ranked.map((m) => m.videoId));
  const fillers = pool
    .filter((m) => !usedIds.has(m.videoId))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return [...ranked, ...fillers].slice(0, limit);
}
