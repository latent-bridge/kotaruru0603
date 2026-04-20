export type Streamer = {
  name: string;
  nameRomaji: string;
  handle: string;
  tagline: string;
  bio: string;
  stats: { followers: string; subs: string; streams: string; years: string };
  games: string[];
  socials: { k: string; label: string; url: string }[];
};

export const STREAMER: Streamer = {
  name: "ruru",
  nameRomaji: "RURU",
  handle: "@KOTARURU0603",
  tagline: "FPSやってる。たまにチル。よろしく。",
  bio: "主にFPSをやってる配信者。真面目に勝ちにいくけど、試合外はゆるめ。月と黒猫と辛いラーメンが好き。一緒に遊べるファンミ、月イチでやってます。",
  stats: {
    followers: "348,211",
    subs: "12,804",
    streams: "1,420",
    years: "4.2",
  },
  games: ["VALORIS:ZERO", "APEX ROUTE", "ARENA CODE 7", "Stardrop Cafe", "おえかきの森"],
  socials: [
    { k: "yt", label: "YouTube", url: "https://www.youtube.com/@KOTARURU0603" },
    { k: "x", label: "X / Twitter", url: "https://x.com/KOTARURU0603" },
    { k: "discord", label: "Discord", url: "#" },
  ],
};

export const SCHEDULE = [
  { day: "MON", date: 4, jp: "月", title: "VALORIS:ZERO ランクマ", time: "21:00 - 24:00", tag: "FPS", note: "今週こそレディアント" },
  { day: "TUE", date: 5, jp: "火", title: "OFF", time: "-", tag: "OFF", note: "おやすみ。寝てます。" },
  { day: "WED", date: 6, jp: "水", title: "APEX ROUTE スクリム", time: "20:00 - 23:00", tag: "FPS", note: "スクリム後ちょっとチル雑談" },
  { day: "THU", date: 7, jp: "木", title: "Stardrop Cafe", time: "22:00 - 01:00", tag: "CHILL", note: "農業 & 雑談" },
  { day: "FRI", date: 8, jp: "金", title: "ARENA CODE 7 新作", time: "21:00 - 25:00", tag: "FPS", note: "初見プレイ、絶対叫ぶ" },
  { day: "SAT", date: 9, jp: "土", title: "ファンミ コラボ", time: "20:00 - 23:00", tag: "COLLAB", note: "リスナー参加型カスタム" },
  { day: "SUN", date: 10, jp: "日", title: "おえかき配信", time: "14:00 - 17:00", tag: "CHILL", note: "サムネ描く" },
] as const;

export const ARCHIVES = [
  { id: 1, title: "【VALORIS】レディアント帯ランクマ、今日こそキープ", views: "128K", dur: "3:42:18", tag: "FPS", days: 2 },
  { id: 2, title: "【APEX】スクリム終わり雑談、今週の反省会", views: "64K", dur: "1:28:04", tag: "FPS", days: 3 },
  { id: 3, title: "【ARENA CODE 7】初見プレイ、叫びまくり", views: "212K", dur: "4:05:33", tag: "FPS", days: 5 },
  { id: 4, title: "【Stardrop Cafe】農業するだけのやつ", views: "42K", dur: "2:58:51", tag: "CHILL", days: 6 },
  { id: 5, title: "【雑談】深夜、ラーメン食べながら質問に答える", views: "88K", dur: "1:52:22", tag: "CHILL", days: 8 },
  { id: 6, title: "【VALORIS】久々のカスタム、リスナーとコーチング", views: "56K", dur: "2:12:08", tag: "FPS", days: 10 },
] as const;

export const GOODS = [
  { id: "g1", name: "ruruポンコツロゴ Tee", price: 3800, kind: "APPAREL", color: "#0b0b0f", accent: "#a3ffd6" },
  { id: "g2", name: "マウスパッド / XL", price: 4600, kind: "GEAR", color: "#15151c", accent: "#ff7ab8" },
  { id: "g3", name: "アクリルスタンド", price: 2200, kind: "FIGURE", color: "#1a1423", accent: "#c4a3ff" },
  { id: "g4", name: "ステッカーセット", price: 980, kind: "PAPER", color: "#1b1b22", accent: "#ffe486" },
  { id: "g5", name: "月夜のフーディー", price: 7400, kind: "APPAREL", color: "#0d1018", accent: "#a3ffd6" },
  { id: "g6", name: "缶バッジ 12種ランダム", price: 440, kind: "PAPER", color: "#1b1b22", accent: "#ff7ab8" },
] as const;

export const FANARTS = [
  { id: "a1", by: "@mochi_draw", likes: "4.2K", h: 280, hue: 280 },
  { id: "a2", by: "@kuroneko_09", likes: "2.1K", h: 200, hue: 180 },
  { id: "a3", by: "@shiro_pen", likes: "8.8K", h: 320, hue: 330 },
  { id: "a4", by: "@rin_illust", likes: "1.6K", h: 240, hue: 220 },
  { id: "a5", by: "@aoi_fanart", likes: "3.4K", h: 280, hue: 100 },
  { id: "a6", by: "@tsuki_art", likes: "5.7K", h: 200, hue: 40 },
  { id: "a7", by: "@hoshi_brush", likes: "2.9K", h: 300, hue: 260 },
  { id: "a8", by: "@neko_paint", likes: "1.2K", h: 220, hue: 310 },
] as const;

export const MEMBERSHIPS = [
  { tier: "CREW", price: 490, emoji: "🌙", perks: ["メンバー限定バッジ", "月イチ限定配信", "Discord #crew アクセス"] },
  { tier: "SQUAD", price: 990, emoji: "🎯", perks: ["CREW特典すべて", "メンバー限定カスタム参加", "限定スタンプ×12"] },
  { tier: "ACE", price: 2400, emoji: "👑", perks: ["SQUAD特典すべて", "月イチ1on1 VC枠抽選", "ボイスメッセージ / 月1", "誕生日ボイス"] },
] as const;

export const CHAT_SAMPLES = [
  { user: "コーヒー党", msg: "エイム鬼", c: "#ff7ab8" },
  { user: "sho_1234", msg: "ナイス！！", c: "#a3ffd6" },
  { user: "kuro", msg: "ruruちゃん上手すぎｗ", c: "#c4a3ff" },
  { user: "アッシュ", msg: "そのキャラ強いの？", c: "#ffe486" },
  { user: "tsuki_mod", msg: "[MOD] リスナーさん落ち着いて〜", c: "#ff9966" },
  { user: "rin", msg: "きょうも配信ありがとう〜", c: "#a3ffd6" },
  { user: "ネコ丸", msg: "わたし今日から登録しました！", c: "#ff7ab8" },
  { user: "shiro", msg: "ｗｗｗｗｗ", c: "#c4a3ff" },
  { user: "mochi", msg: "ruru先輩〜〜！", c: "#ffe486" },
  { user: "青いペンギン", msg: "そこ逃げて！！！", c: "#a3ffd6" },
  { user: "hoshi", msg: "nice shot", c: "#ff7ab8" },
  { user: "ruru_mod", msg: "[MOD] 配信URL貼るのはやめてね", c: "#ff9966" },
  { user: "ame", msg: "ナイスクラッチ", c: "#c4a3ff" },
  { user: "tsubasa", msg: "wwwwww", c: "#ffe486" },
] as const;

export const SUPPORT = {
  tagline: "いつもありがとう。気が向いたときだけで大丈夫です。",
  presets: [
    { amount: 300, label: "こーひー", emoji: "☕", blurb: "配信前の一杯に" },
    { amount: 500, label: "おやつ", emoji: "🍫", blurb: "深夜配信のお供" },
    { amount: 1000, label: "ごはん", emoji: "🍜", blurb: "辛いラーメン1杯分" },
    { amount: 3000, label: "ガチ支援", emoji: "🎯", blurb: "新しいマウスの足しに" },
    { amount: 5000, label: "ドン", emoji: "⭐", blurb: "ありがとうございます" },
  ],
  recent: [
    { name: "アッシュ", amount: 500, msg: "今日の配信楽しかった！" },
    { name: "mochi", amount: 1000, msg: "レディアント復帰おめでとう🎉" },
    { name: "匿名", amount: 300, msg: "いつも元気もらってます" },
    { name: "kuroneko", amount: 3000, msg: "マウス買って〜" },
    { name: "rin", amount: 500, msg: "おつるる！" },
    { name: "shiro_pen", amount: 1000, msg: "ファンアート完成したら送る" },
    { name: "青いペンギン", amount: 300, msg: "ナイスクラッチでした" },
    { name: "tsuki", amount: 2000, msg: "誕生日おめでとう🎂" },
  ],
} as const;

export const NAV = [
  { key: "home", label: "HOME", path: "/" },
  { key: "stream", label: "STREAM", path: "/stream" },
  { key: "archive", label: "ARCHIVE", path: "/archive" },
  { key: "schedule", label: "SCHEDULE", path: "/schedule" },
  { key: "goods", label: "GOODS", path: "/goods" },
  { key: "fanart", label: "FAN ART", path: "/fanart" },
  { key: "member", label: "MEMBER", path: "/member" },
  { key: "support", label: "TIP", path: "/support" },
] as const;

export const TOKENS = {
  mint: "#a3ffd6",
  mintDim: "rgba(163,255,214,0.18)",
  pink: "#ff7ab8",
  bg: "#06070a",
  textPrimary: "#e6edea",
  textMuted: "#8a9690",
  textFaint: "#5d6a66",
  panelBg: "rgba(255,255,255,0.02)",
  panelBorder: "rgba(255,255,255,0.06)",
  mono: "'JetBrains Mono', ui-monospace, monospace",
} as const;
