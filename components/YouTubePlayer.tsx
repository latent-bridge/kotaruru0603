import { TOKENS } from "@/lib/data";

type Props = { videoId: string };

/**
 * YouTube embed. The iframe area itself stays untouched (no overlay)
 * to comply with YouTube embed terms. Decorative framing lives strictly
 * outside the iframe rect.
 */
export function YouTubePlayer({ videoId }: Props) {
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0`;
  return (
    <div
      style={{
        position: "relative",
        padding: 10,
        borderRadius: 12,
        background: "rgba(163,255,214,0.04)",
        border: `1px solid ${TOKENS.mintDim}`,
      }}
    >
      <CornerBrackets />
      <div
        style={{
          position: "relative",
          aspectRatio: "16 / 9",
          background: "#000",
          borderRadius: 6,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <iframe
          src={src}
          title="ruru live stream (YouTube)"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
        />
      </div>
    </div>
  );
}

function CornerBrackets() {
  const c = TOKENS.mint;
  const arm = 14;
  const inset = 2;
  const common = { position: "absolute" as const, width: arm, height: arm, pointerEvents: "none" as const };
  return (
    <>
      <span style={{ ...common, top: inset, left: inset, borderTop: `1px solid ${c}`, borderLeft: `1px solid ${c}` }} />
      <span style={{ ...common, top: inset, right: inset, borderTop: `1px solid ${c}`, borderRight: `1px solid ${c}` }} />
      <span style={{ ...common, bottom: inset, left: inset, borderBottom: `1px solid ${c}`, borderLeft: `1px solid ${c}` }} />
      <span style={{ ...common, bottom: inset, right: inset, borderBottom: `1px solid ${c}`, borderRight: `1px solid ${c}` }} />
    </>
  );
}
