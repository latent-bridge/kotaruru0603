// MOCHI HOUSE design data for ruru's fan-site.
// 見た目はもちもち路線、ストリーマー識別情報 (name/handle) のみ ruru に差し替え。

import { STREAMER } from "./data";
// Admin-edited schedule, populated by `pnpm fetch:content` at build time.
// Empty { entries: [] } in development → DEFAULT_SCHEDULE below is used.
import adminSchedule from "@/data/schedule.json";

export type Category =
  | "おしゃべり"
  | "げーむ"
  | "おえかき"
  | "うた"
  | "おはなし"
  | "めんばー"
  | "おやすみ";

export type ScheduleEntry = {
  day: string;
  weekday: string;
  dateLabel: string;
  title: string;
  time: string;
  tags: string[];
  emoji: string;
  note: string;
};

export function isOffEntry(e: ScheduleEntry): boolean {
  return e.tags.includes("おやすみ");
}

const DEFAULT_TAG_COLOR = { color: "#857670", bg: "#f0e8df" };

// Schedule-tag colors. Inherits the archive Category palette for any tag that
// happens to overlap, plus schedule-only labels (コラボ etc.). New shared
// preset tags should land in CATEGORY_COLOR; schedule-only ones go below.
function tagColorOverrides(): Record<string, { color: string; bg: string }> {
  return {
    ...(CATEGORY_COLOR as Record<string, { color: string; bg: string }>),
    コラボ: { color: "#c26a50", bg: "#fad8c8" },
  };
}

export function tagColor(tag: string): { color: string; bg: string } {
  return tagColorOverrides()[tag] ?? DEFAULT_TAG_COLOR;
}

export type Memory = {
  id: string;
  title: string;
  date: string;
  duration: string;
  views: string;
  category: Category;
  emoji: string;
  tone: "coral" | "lilac" | "mint" | "cream";
};

const DEFAULT_SCHEDULE: ScheduleEntry[] = [
  { day: "mon", weekday: "げつ", dateLabel: "4.21", title: "ポンコツダイバー #22", time: "よる 21:00 〜", tags: ["げーむ"], emoji: "🎮", note: "Helldivers 2 さんかがた。ほのぼの えんせい" },
  { day: "tue", weekday: "か", dateLabel: "4.22", title: "ポンコツ侍 第十章", time: "よる 21:00 〜", tags: ["げーむ"], emoji: "⚔", note: "Ghost of Yotei Legends のつづき。やりなおすの なんかい目かな…" },
  { day: "wed", weekday: "すい", dateLabel: "4.23", title: "おやすみ", time: "おやすみします", tags: ["おやすみ"], emoji: "💤", note: "すこし やすませてください 🙇" },
  { day: "thu", weekday: "もく", dateLabel: "4.24", title: "Dave the diver (ひさびさ)", time: "よる 20:00 〜", tags: ["げーむ"], emoji: "🐟", note: "しばらく はなれてたから おさらいから" },
  { day: "fri", weekday: "きん", dateLabel: "4.25", title: "ポンコツダイバー #23 [こらぼ]", time: "よる 21:00 〜", tags: ["おはなし", "げーむ"], emoji: "🤝", note: "アリンお姉様と ヘルダイブ よてい ♡" },
  { day: "sat", weekday: "ど", dateLabel: "4.26", title: "ゆるゲームわく", time: "よる 20:00 〜", tags: ["げーむ"], emoji: "🎮", note: "しんさく ためしてみたいのが あるの" },
  { day: "sun", weekday: "にち", dateLabel: "4.27", title: "ざつだん & つぎのよてい", time: "よる 21:00 〜", tags: ["おしゃべり"], emoji: "🎙", note: "のんびり はなして、らいしゅうの ながれ きめたい" },
];

type AdminScheduleEntry = {
  date?: string;
  title?: string | null;
  time?: string | null;
  tags?: string[] | null;
  // legacy field — older fetched JSON may still carry it
  category?: string | null;
  emoji?: string | null;
  note?: string | null;
};

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
const WEEKDAY_JP = ["にち", "げつ", "か", "すい", "もく", "きん", "ど"] as const;

function jstYmd(d: Date): string {
  // Asia/Tokyo calendar date as YYYY-MM-DD. Build by formatting parts so we
  // don't drift on DST-less timezones.
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(d);
}

// Build the next 7 days starting from today (JST). Days without an admin
// entry render as a "未定" placeholder so the public week always shows 7
// cards. Future "next 14 days" expansion is a one-line constant change here.
function resolveSchedule(): ScheduleEntry[] {
  const entries = (adminSchedule as { entries?: AdminScheduleEntry[] }).entries;
  if (!entries || entries.length === 0) return DEFAULT_SCHEDULE;

  const byDate = new Map<string, AdminScheduleEntry>();
  for (const e of entries) if (e.date) byDate.set(e.date, e);

  const todayJst = jstYmd(new Date());
  const baseMs = Date.parse(todayJst + "T00:00:00Z");
  const result: ScheduleEntry[] = [];
  for (let i = 0; i < 7; i += 1) {
    const d = new Date(baseMs + i * 86400_000);
    const iso = d.toISOString().slice(0, 10);
    const month = Number.parseInt(iso.slice(5, 7), 10);
    const day = Number.parseInt(iso.slice(8, 10), 10);
    const dow = d.getUTCDay();
    const e = byDate.get(iso);
    let tags: string[] = [];
    if (e?.tags && Array.isArray(e.tags)) {
      tags = e.tags.filter((t) => typeof t === "string" && t.trim().length > 0);
    } else if (e?.category) {
      tags = [e.category];
    }
    result.push({
      day: DAY_KEYS[dow],
      weekday: WEEKDAY_JP[dow],
      dateLabel: `${month}.${day}`,
      title: e?.title || "未定",
      time: e?.time || "",
      tags,
      emoji: e?.emoji || (e ? "" : "💭"),
      note: e?.note || "",
    });
  }
  return result;
}

export const MOCHI = {
  streamer: {
    name: "ruru",
    shortName: "ruru",
    handle: STREAMER.handle,
    tagline:
      "ふぁんさいとへ ようこそ ♡\nきょうのよていや これまでの はいしん、\nぜんぶ ここに おいてあります。",
  },

  bottomCards: [
    { t: "おしゃべり", jp: "らいぶへ", c: "coral" as const, ic: "🎙", sub: "いま 4,208 にんがみてるよ" },
    { t: "おもいで", jp: "あーかいぶ", c: "lilac" as const, ic: "📼", sub: "みのがしもここで ♡" },
    { t: "おとどけもの", jp: "ぐっず", c: "mint" as const, ic: "🎁", sub: "あたらしいの 3つ" },
  ],

  schedule: resolveSchedule(),

  memories: [
    { id: "m01", title: "はじめてのはいしん", date: "2021.03.14", duration: "4:12", views: "128K", category: "おしゃべり" as Category, emoji: "✨", tone: "coral" as const },
    { id: "m02", title: "10まんにん ありがとう", date: "2023.08.02", duration: "3:28", views: "94K", category: "おしゃべり" as Category, emoji: "💝", tone: "coral" as const },
    { id: "m03", title: "さんしゅうねん きねん", date: "2024.03.14", duration: "5:02", views: "202K", category: "おしゃべり" as Category, emoji: "🎂", tone: "cream" as const },
    { id: "m04", title: "うたわく vol.12", date: "2024.02.10", duration: "2:58", views: "72K", category: "うた" as Category, emoji: "🎤", tone: "lilac" as const },
    { id: "m05", title: "おえかき、さむねづくり", date: "2024.11.05", duration: "3:14", views: "38K", category: "おえかき" as Category, emoji: "✎", tone: "mint" as const },
    { id: "m06", title: "こらぼ、あさまでおはなし", date: "2024.09.21", duration: "4:10", views: "66K", category: "おはなし" as Category, emoji: "🤝", tone: "cream" as const },
    { id: "m07", title: "ほらーがめ たえきゅう", date: "2024.10.12", duration: "4:18", views: "48K", category: "げーむ" as Category, emoji: "👻", tone: "lilac" as const },
    { id: "m08", title: "りすなーさん さんかがた", date: "2025.10.08", duration: "2:12", views: "24K", category: "げーむ" as Category, emoji: "🎮", tone: "mint" as const },
    { id: "m09", title: "あさ かつ、こーひーおしゃべり", date: "2024.08.02", duration: "1:28", views: "22K", category: "おしゃべり" as Category, emoji: "☕", tone: "cream" as const },
    { id: "m10", title: "めんげん、えんちょうせん", date: "2025.01.18", duration: "2:42", views: "6K", category: "めんばー" as Category, emoji: "🌷", tone: "coral" as const },
    { id: "m11", title: "しんさくゲーム しょけんプレイ", date: "2024.06.14", duration: "4:32", views: "84K", category: "げーむ" as Category, emoji: "🕹", tone: "mint" as const },
    { id: "m12", title: "あすMR、まったり", date: "2024.04.02", duration: "1:15", views: "42K", category: "おしゃべり" as Category, emoji: "🌙", tone: "lilac" as const },
  ] as Memory[],

  letters: [
    { from: "こーひーとう", excerpt: "いつも はいしん たのしみにしてます ♡ せんしゅうの うたわく、さいこうでした！", date: "4.20" },
    { from: "りん", excerpt: "はじめまして。きょうから ふぁんです、なかよくしてください〜", date: "4.18" },
    { from: "あおいぺんぎん", excerpt: "しんやのからおけ さいこうでした。こんど りくえすとしていいですか？", date: "4.16" },
  ],
};

export const CATEGORY_COLOR: Record<Category, { color: string; bg: string }> = {
  おしゃべり: { color: "#c25470", bg: "#fbe0e4" },
  げーむ: { color: "#7a6bb4", bg: "#e2dff2" },
  おえかき: { color: "#5a8870", bg: "#d6e6d8" },
  うた: { color: "#a68248", bg: "#f6e8b0" },
  おはなし: { color: "#c26a50", bg: "#fad8c8" },
  めんばー: { color: "#8060a8", bg: "#e6d8ee" },
  おやすみ: { color: "rgba(58,46,42,0.4)", bg: "transparent" },
};

export const PALETTE = {
  bg: "#fdf3ea",
  paper: "#fffaf3",
  coral: "#f0a0ae",
  lilac: "#b4aedc",
  mint: "#a6d4bf",
  cream: "#f0d88a",
  accent: "#d06a7e",
  ink: "#3a2e2a",
  inkDim: "#857670",
  inkSoft: "rgba(58,46,42,0.14)",
};

export const TONE_BG: Record<Memory["tone"], string> = {
  coral: "#fbe0e4",
  lilac: "#e2dff2",
  mint: "#d8ecde",
  cream: "#f8ecc0",
};

export const FONTS = {
  body:
    '"Zen Maru Gothic", "M PLUS Rounded 1c", "Hiragino Maru Gothic Pro", sans-serif',
  hand: '"Kalam", "Caveat", cursive',
  mono: 'ui-monospace, "JetBrains Mono", monospace',
};
