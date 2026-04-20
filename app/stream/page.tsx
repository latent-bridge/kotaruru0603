import { TOKENS } from "@/lib/data";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import { Chat } from "@/components/Chat";
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
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-3 lg:gap-4">
        <div>
          <YouTubePlayer videoId={videoId} />
          <div
            style={{
              ...panel,
              padding: 16,
              marginTop: 14,
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
        </div>
        <Chat />
      </div>
    </div>
  );
}
