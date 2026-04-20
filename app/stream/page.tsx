import { TOKENS } from "@/lib/data";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import { YouTubeChat } from "@/components/YouTubeChat";
import { LiveBadge } from "@/components/LiveBadge";
import { streamerConfig } from "@/config/streamer.config";

const panel = {
  background: TOKENS.panelBg,
  border: `1px solid ${TOKENS.panelBorder}`,
  borderRadius: 10,
};

export default function StreamPage() {
  const videoId = streamerConfig.platforms.youtube.liveVideoId;
  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-3 lg:gap-4">
        <div>
          <YouTubePlayer videoId={videoId} />

          {/* Status strip — sits below the player, NOT overlaid on it */}
          <div
            className="flex items-center gap-3 flex-wrap"
            style={{
              ...panel,
              padding: "10px 14px",
              marginTop: 10,
              borderColor: TOKENS.mintDim,
            }}
          >
            <LiveBadge liveOn />
            <span
              className="font-mono"
              style={{
                fontSize: 10,
                color: TOKENS.textMuted,
                letterSpacing: "0.18em",
              }}
            >
              SOURCE / YOUTUBE
            </span>
            <span style={{ flex: 1 }} />
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono"
              style={{
                fontSize: 10,
                color: TOKENS.mint,
                letterSpacing: "0.16em",
                textDecoration: "none",
                border: `1px solid ${TOKENS.mintDim}`,
                padding: "4px 8px",
                borderRadius: 4,
              }}
            >
              YOUTUBE で開く ↗
            </a>
          </div>

          {/* Editorial "now playing" card — clearly our own UI, not YouTube data */}
          <div
            style={{
              ...panel,
              padding: 16,
              marginTop: 10,
              borderColor: TOKENS.mintDim,
            }}
          >
            <div
              className="font-mono"
              style={{
                fontSize: 10,
                color: TOKENS.mint,
                letterSpacing: "0.22em",
              }}
            >
              NOW PLAYING
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, marginTop: 6 }}>
              【VALORIS:ZERO】今週こそレディアント帯キープ
            </div>
            <div
              style={{
                color: TOKENS.textMuted,
                marginTop: 6,
                fontSize: 13,
              }}
            >
              エイム練習 → ランクマ → 時間余ったら雑談。途中参加OKです。
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {["FPS", "ランクマ", "ソロ", "日本語"].map((t) => (
                <span
                  key={t}
                  className="font-mono"
                  style={{
                    fontSize: 10,
                    padding: "4px 8px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 999,
                    color: "#cad3cf",
                  }}
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>

          <p
            className="font-mono"
            style={{
              marginTop: 8,
              fontSize: 9,
              color: TOKENS.textFaint,
              letterSpacing: "0.14em",
            }}
          >
            LIVE PLAYBACK & CHAT POWERED BY YOUTUBE.
            視聴者数・チャットの一次情報は YouTube プレイヤー側を参照してください。
          </p>
        </div>

        <YouTubeChat videoId={videoId} />
      </div>
    </div>
  );
}
