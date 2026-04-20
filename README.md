# kotaruru0603 — ruruのポンコツ部屋

ゲーム配信者 **ruru** ([@KOTARURU0603](https://x.com/KOTARURU0603)) のファンサイトデモ。
デザインリファレンス `MIDNIGHT OPS` (ダーク × ネオンミント) を Next.js (App Router) + TypeScript + Tailwind CSS v4 で実装。

- **公開URL**: https://latent-bridge.github.io/kotaruru0603/
- **GitHub**: https://github.com/latent-bridge/kotaruru0603

## 構成

```
app/
  layout.tsx          全体シェル (Topbar / Footer)
  page.tsx            HOME
  stream/page.tsx     STREAM (YouTube embed + チャット)
  archive/page.tsx    ARCHIVE
  schedule/page.tsx   SCHEDULE (週/月切替)
  goods/page.tsx      GOODS
  fanart/page.tsx     FAN ART (Masonry)
  member/page.tsx     MEMBER
components/           Topbar / Footer / LiveBadge / Button / Countdown / YouTubePlayer / Chat / ...
config/
  streamer.config.ts  配信者設定 (YouTube channelId / liveVideoId)
lib/
  data.ts             デモ用ダミーデータ (アーカイブ・グッズ・ファンアート 等)
```

## 開発

```bash
pnpm install
pnpm dev   # http://localhost:3000
```

## 静的ビルド (GitHub Pages 用)

```bash
pnpm build
# out/ に静的ファイルが生成される
```

サブパスにデプロイする場合:

```bash
NEXT_PUBLIC_BASE_PATH=/kotaruru0603 pnpm build
```

## 実装範囲

- [x] HOME (ヒーロー / スタッツ / NEXT MISSION + カウントダウン / GAMES)
- [x] STREAM (YouTube 埋め込み + 疑似チャット 自動進行)
- [x] ARCHIVE (フィルタ ALL / FPS / CHILL)
- [x] SCHEDULE (WEEK / MONTH 切替)
- [x] GOODS (プレースホルダ画像)
- [x] FAN ART (Masonry プレースホルダ)
- [x] MEMBER (3 tier カード)

未実装 / モック:
- 支援決済 (Stripe Checkout) — UI のみ
- 実 YouTube ライブ動画ID の自動検知 — 設定ファイルに固定値
- ファンアート / グッズの実画像差し替え

## 備考

- ライブ配信プラットフォームは **YouTube オンリー** 想定 (Twitch は使わない)
- デザイン仕様: 元 zip `ruru-design.zip` 内 `design_handoff_midnight_ops/README.md`
- 全体アーキテクチャ: `../../../architecture.md`
