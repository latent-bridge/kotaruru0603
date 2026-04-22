import { PALETTE, FONTS } from "@/lib/mochi";

export default function OverlayPage() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        padding: 48,
        fontFamily: FONTS.body,
      }}
    >
      <div
        style={{
          padding: "16px 28px",
          background: PALETTE.coral,
          color: "#fff",
          border: `3px solid ${PALETTE.ink}`,
          borderRadius: 20,
          boxShadow: `5px 5px 0 ${PALETTE.ink}`,
          fontSize: 32,
          fontWeight: 900,
          letterSpacing: 1,
          animation:
            "overlay-in 1.2s ease-out both, overlay-float 4s ease-in-out 1.2s infinite",
        }}
      >
        ようこそ ♡
      </div>
    </div>
  );
}
