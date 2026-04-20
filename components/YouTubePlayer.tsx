import { TOKENS } from "@/lib/data";
import { LiveBadge } from "./LiveBadge";

type Props = {
  videoId: string;
};

export function YouTubePlayer({ videoId }: Props) {
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&modestbranding=1&rel=0`;
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: "16 / 9",
        background: "#000",
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <iframe
        src={src}
        title="ruru live stream"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
      />
      {/* Top overlay (LIVE badge + viewers) — sits over the iframe but is purely visual */}
      <div
        className="pointer-events-none"
        style={{
          position: "absolute",
          top: 10,
          right: 12,
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <LiveBadge liveOn compact />
        <span
          className="font-mono"
          style={{
            fontSize: 10,
            color: "#cad3cf",
            padding: "4px 8px",
            borderRadius: 4,
            background: "rgba(0,0,0,0.5)",
          }}
        >
          👁 4,208
        </span>
      </div>
      {/* HUD overlay — top left mission text */}
      <div
        className="pointer-events-none font-mono"
        style={{
          position: "absolute",
          top: 10,
          left: 12,
          fontSize: 10,
          color: TOKENS.mint,
          letterSpacing: "0.18em",
          padding: "4px 8px",
          background: "rgba(0,0,0,0.45)",
          borderRadius: 4,
        }}
      >
        ROUND 08 / 12 • KDA 18/6/4
      </div>
    </div>
  );
}
