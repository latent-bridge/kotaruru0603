import { PALETTE, FONTS } from "@/lib/mochi";

export default function DesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: PALETTE.bg,
        color: PALETTE.ink,
        fontFamily: FONTS.body,
        minHeight: "100vh",
        backgroundImage: `radial-gradient(${PALETTE.coral}30 1.5px, transparent 1.5px)`,
        backgroundSize: "22px 22px",
        overflowX: "hidden",
      }}
    >
      {children}
    </div>
  );
}
