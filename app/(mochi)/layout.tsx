import Link from "next/link";
import { MOCHI, PALETTE, FONTS } from "@/lib/mochi";
import { MochiUsa, Kumo } from "@/components/mochi-ui";
import { LiveBadge } from "@/components/live-badge";
import { AuthPill } from "@/components/AuthPill";

export default function MochiLayout({
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
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ドット背景 */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `radial-gradient(${PALETTE.coral}30 1.5px, transparent 1.5px)`,
          backgroundSize: "22px 22px",
          opacity: 0.5,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Kumo
        size={90}
        style={{
          position: "absolute",
          top: 40,
          right: 80,
          opacity: 0.9,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <Kumo
        size={60}
        style={{
          position: "absolute",
          top: 380,
          left: 40,
          opacity: 0.7,
          transform: "rotate(-8deg)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <TopBar />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
      <MochiFooter />
    </div>
  );
}

function TopBar() {
  const { streamer } = MOCHI;
  return (
    <header
      className="flex flex-wrap items-center justify-between gap-3 px-5 md:px-10 pt-5 md:pt-6 pb-3 max-w-[1280px] mx-auto"
      style={{ position: "relative", zIndex: 10 }}
    >
      <Link
        href="/"
        className="flex items-center gap-3"
        style={{ textDecoration: "none", color: PALETTE.ink }}
      >
        <MochiUsa size={42} />
        <div>
          <div
            className="text-[15px] md:text-[17px]"
            style={{ fontWeight: 900, lineHeight: 1.1 }}
          >
            {streamer.name}
          </div>
          <div
            style={{
              fontSize: 10,
              color: PALETTE.inkDim,
              fontFamily: FONTS.mono,
              letterSpacing: 0.5,
            }}
          >
            {streamer.handle}
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-2 md:gap-3 flex-wrap">
        <NavPill href="/" label="おうち" />
        <NavPill href="/schedule" label="よてい" />
        <NavPill href="/archive" label="おもいで" />
        <NavPill href="/stream" label="らいぶ" />
        <NavPill href="/chat" label="ざつだん" />
        <LiveBadge />
        <AuthPill />
      </div>
    </header>
  );
}

function NavPill({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        padding: "6px 14px",
        borderRadius: 999,
        background: "transparent",
        border: `2px solid transparent`,
        fontSize: 12,
        fontWeight: 700,
        color: PALETTE.ink,
        textDecoration: "none",
      }}
    >
      {label}
    </Link>
  );
}

function MochiFooter() {
  return (
    <footer
      className="flex flex-wrap items-center justify-between gap-3 px-5 md:px-10 py-8 md:py-10 mt-16 md:mt-20 max-w-[1280px] mx-auto"
      style={{
        borderTop: `2px dashed ${PALETTE.inkSoft}`,
        position: "relative",
        zIndex: 1,
      }}
    >
      <div className="flex items-center gap-2">
        <MochiUsa size={28} />
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: PALETTE.ink,
          }}
        >
          ♡ またきてね
        </span>
      </div>
      <div
        className="flex items-center gap-3"
        style={{
          fontSize: 10,
          fontFamily: FONTS.mono,
          color: PALETTE.inkDim,
          letterSpacing: 1,
        }}
      >
        <Link
          href="/privacy/"
          style={{
            color: PALETTE.inkDim,
            textDecoration: "none",
            borderBottom: `1px dotted ${PALETTE.inkSoft}`,
          }}
        >
          PRIVACY
        </Link>
        <span>MOCHI HOUSE</span>
      </div>
    </footer>
  );
}
