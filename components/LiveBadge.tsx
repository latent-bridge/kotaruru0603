import { TOKENS } from "@/lib/data";

export function LiveBadge({ liveOn = false, compact = false }: { liveOn?: boolean; compact?: boolean }) {
  return (
    <div
      className="font-mono inline-flex items-center"
      style={{
        gap: 6,
        padding: compact ? "4px 8px" : "6px 10px",
        border: `1px solid ${liveOn ? TOKENS.mint : "rgba(255,255,255,0.1)"}`,
        borderRadius: 4,
        background: liveOn ? "rgba(163,255,214,0.08)" : "transparent",
        fontSize: 10,
        letterSpacing: "0.18em",
        color: liveOn ? TOKENS.mint : "#6c7673",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: liveOn ? TOKENS.mint : "#6c7673",
          boxShadow: liveOn ? `0 0 8px ${TOKENS.mint}` : "none",
          animation: liveOn ? "a-pulse 1.2s ease-in-out infinite" : "none",
        }}
      />
      {liveOn ? "LIVE NOW" : "OFFLINE"}
    </div>
  );
}
