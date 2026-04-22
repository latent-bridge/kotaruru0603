/**
 * ruru の YouTube チャンネル (config/streamer.config.ts) から
 * 全アップロード動画の生データを取得して data/archive.raw.json に書き出す。
 *
 * - data/archive.curated.json は絶対に触らない (videoId を primary key とした
 *   手動キュレーション層)。
 * - 冪等: 何度叩いても安全。既存 raw JSON を読み、新規/更新/削除を diff 出力。
 * - ビルドとは無関係: 叩きたい時だけ手動で叩く → コミット → push。
 *
 * Usage:
 *   echo 'YOUTUBE_API_KEY=xxxxx' > .env.local
 *   pnpm fetch:archive
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { streamerConfig } from "../config/streamer.config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const RAW_JSON_PATH = path.join(ROOT, "data/archive.raw.json");
const ENV_LOCAL_PATH = path.join(ROOT, ".env.local");

loadEnvLocal();

const API_KEY = process.env.YOUTUBE_API_KEY;
if (!API_KEY) {
  console.error("YOUTUBE_API_KEY is not set.");
  console.error("  1. https://console.cloud.google.com/ で YouTube Data API v3 を有効化");
  console.error("  2. API キーを発行");
  console.error("  3. echo 'YOUTUBE_API_KEY=xxxxx' > .env.local");
  console.error("  4. pnpm fetch:archive");
  process.exit(1);
}

const CHANNEL_ID = streamerConfig.platforms.youtube.channelId;
const API = "https://www.googleapis.com/youtube/v3";

type RawVideo = {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  durationSeconds: number;
  viewCount: number;
  likeCount: number | null;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
    maxres: string | null;
  };
  youtubeTags: string[];
  youtubeCategoryId: string;
  liveBroadcast: "none" | "live" | "upcoming" | "was_live";
  liveDetails: {
    scheduledStartTime: string | null;
    actualStartTime: string | null;
    actualEndTime: string | null;
  } | null;
  /**
   * 過去 live 配信のチャットリプレイ iframe に渡す continuation トークン。
   * was_live かつ YouTube がチャットリプレイを保存している場合のみ非 null。
   * `live_chat_replay?continuation=TOKEN&embed_domain=...` で使用。
   */
  liveChatReplayContinuation: string | null;
};

type ArchiveRaw = {
  meta: {
    channelId: string;
    lastFetchedAt: string;
    videoCount: number;
  };
  videos: RawVideo[];
};

type YTChannelsResp = {
  items?: Array<{
    contentDetails?: { relatedPlaylists?: { uploads?: string } };
  }>;
};

type YTPlaylistItemsResp = {
  items?: Array<{
    contentDetails?: { videoId?: string };
  }>;
  nextPageToken?: string;
};

type YTVideoItem = {
  id: string;
  snippet: {
    publishedAt: string;
    title: string;
    description: string;
    thumbnails: Record<string, { url: string } | undefined>;
    tags?: string[];
    categoryId: string;
    liveBroadcastContent: "none" | "live" | "upcoming";
  };
  contentDetails: { duration: string };
  statistics: { viewCount?: string; likeCount?: string };
  liveStreamingDetails?: {
    scheduledStartTime?: string;
    actualStartTime?: string;
    actualEndTime?: string;
  };
};

type YTVideosResp = { items?: YTVideoItem[] };

function loadEnvLocal(): void {
  if (process.env.YOUTUBE_API_KEY) return;
  if (!fs.existsSync(ENV_LOCAL_PATH)) return;
  const raw = fs.readFileSync(ENV_LOCAL_PATH, "utf-8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

function parseIsoDuration(iso: string): number {
  const m = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return 0;
  const h = parseInt(m[1] ?? "0", 10);
  const mn = parseInt(m[2] ?? "0", 10);
  const s = parseInt(m[3] ?? "0", 10);
  return h * 3600 + mn * 60 + s;
}

async function yt<T>(endpoint: string, params: Record<string, string>): Promise<T> {
  const qs = new URLSearchParams({ ...params, key: API_KEY! }).toString();
  const res = await fetch(`${API}/${endpoint}?${qs}`);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`YouTube API ${res.status} ${endpoint}: ${body}`);
  }
  return (await res.json()) as T;
}

async function getUploadsPlaylistId(): Promise<string> {
  const data = await yt<YTChannelsResp>("channels", {
    part: "contentDetails",
    id: CHANNEL_ID,
  });
  const uploads = data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploads) throw new Error(`No uploads playlist for channel ${CHANNEL_ID}`);
  return uploads;
}

async function listAllVideoIds(playlistId: string): Promise<string[]> {
  const ids: string[] = [];
  let pageToken: string | undefined;
  let page = 0;
  do {
    page += 1;
    const params: Record<string, string> = {
      part: "contentDetails",
      playlistId,
      maxResults: "50",
    };
    if (pageToken) params.pageToken = pageToken;
    const data = await yt<YTPlaylistItemsResp>("playlistItems", params);
    for (const item of data.items ?? []) {
      const v = item.contentDetails?.videoId;
      if (v) ids.push(v);
    }
    pageToken = data.nextPageToken;
    process.stdout.write(`  playlist page ${page}: +${data.items?.length ?? 0} (total ${ids.length})\n`);
  } while (pageToken);
  return ids;
}

async function fetchVideosBatch(ids: string[]): Promise<RawVideo[]> {
  const data = await yt<YTVideosResp>("videos", {
    part: "snippet,contentDetails,statistics,liveStreamingDetails",
    id: ids.join(","),
    maxResults: "50",
  });
  return (data.items ?? []).map(toRawVideo);
}

function toRawVideo(v: YTVideoItem): RawVideo {
  const live = v.liveStreamingDetails;
  const lbc = v.snippet.liveBroadcastContent;
  const liveBroadcast: RawVideo["liveBroadcast"] =
    lbc === "live" ? "live" : lbc === "upcoming" ? "upcoming" : live?.actualEndTime ? "was_live" : "none";

  return {
    videoId: v.id,
    title: v.snippet.title,
    description: v.snippet.description,
    publishedAt: v.snippet.publishedAt,
    durationSeconds: parseIsoDuration(v.contentDetails.duration),
    viewCount: parseInt(v.statistics.viewCount ?? "0", 10),
    likeCount: v.statistics.likeCount ? parseInt(v.statistics.likeCount, 10) : null,
    thumbnails: {
      default: v.snippet.thumbnails.default?.url ?? "",
      medium: v.snippet.thumbnails.medium?.url ?? "",
      high: v.snippet.thumbnails.high?.url ?? "",
      maxres: v.snippet.thumbnails.maxres?.url ?? null,
    },
    youtubeTags: v.snippet.tags ?? [],
    youtubeCategoryId: v.snippet.categoryId,
    liveBroadcast,
    liveDetails: live
      ? {
          scheduledStartTime: live.scheduledStartTime ?? null,
          actualStartTime: live.actualStartTime ?? null,
          actualEndTime: live.actualEndTime ?? null,
        }
      : null,
    liveChatReplayContinuation: null, // was_live ならあとで watch ページから埋める
  };
}

// --- チャットリプレイ continuation 取得 --------------------------------

const WATCH_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36";

/**
 * watch ページ HTML から ytInitialData を抜き出し、チャットリプレイの
 * reload continuation を返す。取得できなければ null。
 */
async function fetchReplayContinuation(videoId: string): Promise<string | null> {
  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${videoId}&hl=en`, {
      headers: {
        "User-Agent": WATCH_UA,
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    if (!res.ok) return null;
    const html = await res.text();

    // "var ytInitialData = {...};" を探して JSON を取り出す
    const marker = "var ytInitialData = ";
    const start = html.indexOf(marker);
    if (start < 0) return null;
    const jsonStart = html.indexOf("{", start);
    if (jsonStart < 0) return null;
    const end = findBalancedJsonEnd(html, jsonStart);
    if (end < 0) return null;
    const data = JSON.parse(html.substring(jsonStart, end));
    return extractReplayContinuation(data);
  } catch {
    return null;
  }
}

/**
 * JSON.parse しやすい終端位置を探す。文字列内の `{}` はエスケープと
 * クオート状態を見て除外する。
 */
function findBalancedJsonEnd(s: string, start: number): number {
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = start; i < s.length; i += 1) {
    const c = s[i];
    if (inStr) {
      if (esc) {
        esc = false;
      } else if (c === "\\") {
        esc = true;
      } else if (c === '"') {
        inStr = false;
      }
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === "{") depth += 1;
    else if (c === "}") {
      depth -= 1;
      if (depth === 0) return i + 1;
    }
  }
  return -1;
}

function extractReplayContinuation(data: unknown): string | null {
  try {
    // contents.twoColumnWatchNextResults.conversationBar.liveChatRenderer.continuations[].reloadContinuationData.continuation
    // YouTube の HTML 変更に備えて defensive に掘る
    const d = data as Record<string, unknown>;
    const contents = d?.contents as Record<string, unknown> | undefined;
    const twoCol = contents?.twoColumnWatchNextResults as
      | Record<string, unknown>
      | undefined;
    const bar = twoCol?.conversationBar as Record<string, unknown> | undefined;
    const chat = bar?.liveChatRenderer as Record<string, unknown> | undefined;
    const continuations = chat?.continuations as unknown[] | undefined;
    if (!Array.isArray(continuations)) return null;
    for (const c of continuations) {
      const entry = c as Record<string, unknown>;
      const reload = entry?.reloadContinuationData as
        | Record<string, unknown>
        | undefined;
      const token = reload?.continuation;
      if (typeof token === "string" && token.length > 0) return token;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * was_live な動画について continuation を埋める。既存 JSON に値がある
 * ものは再利用し、未取得のものだけ並列で fetch する (最大 5 並列)。
 */
async function populateReplayContinuations(
  videos: RawVideo[],
  prior: ArchiveRaw | null,
): Promise<{ reused: number; fetched: number; failed: number }> {
  const prev = new Map<string, string | null>();
  for (const v of prior?.videos ?? []) {
    prev.set(v.videoId, v.liveChatReplayContinuation ?? null);
  }

  const stats = { reused: 0, fetched: 0, failed: 0 };
  const toFetch: RawVideo[] = [];

  for (const v of videos) {
    if (v.liveBroadcast !== "was_live") {
      v.liveChatReplayContinuation = null;
      continue;
    }
    const cached = prev.get(v.videoId);
    if (cached) {
      v.liveChatReplayContinuation = cached;
      stats.reused += 1;
    } else {
      toFetch.push(v);
    }
  }

  if (toFetch.length === 0) return stats;

  console.log(`fetching chat replay continuation for ${toFetch.length} videos...`);
  const CONCURRENCY = 5;
  for (let i = 0; i < toFetch.length; i += CONCURRENCY) {
    const batch = toFetch.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async (v) => {
        const token = await fetchReplayContinuation(v.videoId);
        v.liveChatReplayContinuation = token;
        if (token) stats.fetched += 1;
        else stats.failed += 1;
      }),
    );
    process.stdout.write(
      `  continuation ${Math.min(i + CONCURRENCY, toFetch.length)}/${toFetch.length}\n`,
    );
  }
  return stats;
}

function loadExisting(): ArchiveRaw | null {
  if (!fs.existsSync(RAW_JSON_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(RAW_JSON_PATH, "utf-8")) as ArchiveRaw;
  } catch (e) {
    console.warn(`warning: existing archive.raw.json is unreadable, starting fresh (${String(e)})`);
    return null;
  }
}

function diffSummary(prev: RawVideo[], next: RawVideo[]) {
  const prevMap = new Map(prev.map((v) => [v.videoId, v]));
  const nextIds = new Set(next.map((v) => v.videoId));
  let added = 0;
  let updated = 0;
  for (const v of next) {
    const p = prevMap.get(v.videoId);
    if (!p) added += 1;
    else if (JSON.stringify(p) !== JSON.stringify(v)) updated += 1;
  }
  const removed = prev.filter((v) => !nextIds.has(v.videoId)).length;
  return { added, updated, removed };
}

async function main() {
  console.log(`channel:  ${CHANNEL_ID}`);

  const uploadsId = await getUploadsPlaylistId();
  console.log(`uploads:  ${uploadsId}`);

  console.log(`listing videoIds...`);
  const videoIds = await listAllVideoIds(uploadsId);
  console.log(`found ${videoIds.length} videos`);

  const batches: string[][] = [];
  for (let i = 0; i < videoIds.length; i += 50) batches.push(videoIds.slice(i, i + 50));

  const videos: RawVideo[] = [];
  for (let i = 0; i < batches.length; i += 1) {
    process.stdout.write(`  video batch ${i + 1}/${batches.length}... `);
    const batchVideos = await fetchVideosBatch(batches[i]);
    videos.push(...batchVideos);
    process.stdout.write(`+${batchVideos.length}\n`);
  }

  videos.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  const existing = loadExisting();

  // was_live 動画のチャットリプレイ continuation を埋める
  const chatStats = await populateReplayContinuations(videos, existing);

  const d = existing
    ? diffSummary(existing.videos, videos)
    : { added: videos.length, updated: 0, removed: 0 };

  const out: ArchiveRaw = {
    meta: {
      channelId: CHANNEL_ID,
      lastFetchedAt: new Date().toISOString(),
      videoCount: videos.length,
    },
    videos,
  };

  fs.mkdirSync(path.dirname(RAW_JSON_PATH), { recursive: true });
  fs.writeFileSync(RAW_JSON_PATH, JSON.stringify(out, null, 2) + "\n");

  console.log("");
  console.log(`wrote ${path.relative(ROOT, RAW_JSON_PATH)}`);
  console.log(`  added:   ${d.added}`);
  console.log(`  updated: ${d.updated}`);
  console.log(`  removed: ${d.removed}`);
  console.log(`  total:   ${videos.length}`);
  console.log(`  chat replay tokens: reused=${chatStats.reused} fetched=${chatStats.fetched} failed=${chatStats.failed}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
