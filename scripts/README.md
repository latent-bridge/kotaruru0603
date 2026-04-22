# scripts

ビルドから切り離された手動実行用のスクリプト群。
Next のビルド (`pnpm build`) はこれらを呼ばない。

## fetch-archive.ts

ruru の YouTube チャンネル (`config/streamer.config.ts` の `channelId`) から全アップロード動画を取得し、`data/archive.raw.json` に書き出す。

### データ層の役割分担

| ファイル | 生成 | 編集者 | 役割 |
|---|---|---|---|
| `data/archive.raw.json` | スクリプトが全面上書き | スクリプトのみ | YouTube の客観データ |
| `data/archive.curated.json` | 手動編集 | 人間 | カテゴリ / タグ / 固定 / 非表示 |

**スクリプトは curated に一切触らない。**
videoId を primary key にしているので、何度再取得しても手で付けたタグは消えない。

### セットアップ (初回のみ)

1. [Google Cloud Console](https://console.cloud.google.com/) で **YouTube Data API v3** を有効化
2. 「API キー」を発行 (OAuth ではなく API キーで可。公開情報しか読まないため)
3. 発行したキーを `.env.local` に書く:

```bash
echo 'YOUTUBE_API_KEY=AIza...' > .env.local
```

`.env*` は `.gitignore` 済。

### 実行

```bash
pnpm fetch:archive
```

出力例:

```
channel:  UCSJ4gkVC6NrvII8umztf0Ow
uploads:  UUSJ4gkVC6NrvII8umztf0Ow
listing videoIds...
  playlist page 1: +50 (total 50)
  playlist page 2: +50 (total 100)
  ...
found 247 videos
  video batch 1/5... +50
  ...

wrote data/archive.raw.json
  added:   3
  updated: 47
  removed: 0
  total:   247
```

その後 `git diff data/archive.raw.json` で差分を確認し、納得したら commit。

### 更新タイミング

ビルドとは紐付けていない。必要な時だけ人間が叩く:

- 新規配信がアーカイブ化された時
- 再生数/高評価の数字を更新したい時
- カテゴリ付けを始める前の事前取得

### API コスト

- `channels.list` (1 unit) + `playlistItems.list` (1 unit / 50件) + `videos.list` (1 unit / 50件)
- 500 本規模で合計 ~21 units/回 (日次クォータ 10,000)
- 無料枠で余裕

### 冪等性

既存 `archive.raw.json` を読み、差分 (追加/更新/削除) をターミナルに出す。
何度叩いても、出てくる JSON は同じチャンネル状態なら同じ (配列順は publishedAt 降順で安定)。
