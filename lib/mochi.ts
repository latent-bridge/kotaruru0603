// MOCHI HOUSE design data for ruru's fan-site.
// 見た目はもちもち路線、ストリーマー識別情報 (name/handle) のみ ruru に差し替え。

import { STREAMER } from "./data";

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
  category: Category;
  emoji: string;
  note: string;
};

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

export const MOCHI = {
  streamer: {
    name: "ruruのおへや",
    shortName: "ruru",
    handle: STREAMER.handle,
    tagline:
      "ふぁんさいとへ ようこそ ♡\nきょうのよていや、おとどけもの、\nぜんぶ ここに おいてあります。",
  },

  today: {
    dateLabel: "04 / 21 (tue)",
    title: "おえかきはいしん ✎",
    time: "よる 21:00 〜 らいぶ",
    countdown: "06:38:12",
    tags: ["#おえかき", "#ゆるく", "#みまもりかんげい"],
    isLive: true,
    liveViewers: "4,208",
  },

  bottomCards: [
    { t: "おしゃべり", jp: "らいぶへ", c: "coral" as const, ic: "🎙", sub: "いま 4,208 にんがみてるよ" },
    { t: "おもいで", jp: "あーかいぶ", c: "lilac" as const, ic: "📼", sub: "みのがしもここで ♡" },
    { t: "おとどけもの", jp: "ぐっず", c: "mint" as const, ic: "🎁", sub: "あたらしいの 3つ" },
  ],

  schedule: [
    { day: "mon", weekday: "げつ", dateLabel: "4.21", title: "おえかきはいしん", time: "よる 21:00 〜", category: "おえかき" as Category, emoji: "✎", note: "きょうは さむねをかくよ" },
    { day: "tue", weekday: "か", dateLabel: "4.22", title: "おやすみ", time: "おやすみします", category: "おやすみ" as Category, emoji: "💤", note: "ぐっすり ねむります" },
    { day: "wed", weekday: "すい", dateLabel: "4.23", title: "ゆるゲーム", time: "よる 20:00 〜", category: "げーむ" as Category, emoji: "🎮", note: "しんさくのほのぼのゲームをやるよ" },
    { day: "thu", weekday: "もく", dateLabel: "4.24", title: "おしゃべり ♡", time: "よる 21:00 〜", category: "おしゃべり" as Category, emoji: "🎙", note: "あつまれて、まったりね〜" },
    { day: "fri", weekday: "きん", dateLabel: "4.25", title: "うたわく vol.3", time: "よる 22:00 〜", category: "うた" as Category, emoji: "🎤", note: "しんきょく はつこうかい ♡" },
    { day: "sat", weekday: "ど", dateLabel: "4.26", title: "こらぼ、ゲストさん ♡", time: "よる 20:00 〜", category: "おはなし" as Category, emoji: "🤝", note: "ひみつの ゲストさんと" },
    { day: "sun", weekday: "にち", dateLabel: "4.27", title: "めんげん、よやすみ", time: "よる 19:00 〜", category: "めんばー" as Category, emoji: "🌷", note: "めんばーさん ありがと" },
  ] as ScheduleEntry[],

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
