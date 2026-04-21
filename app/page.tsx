import { STREAMER, TOKENS } from "@/lib/data";
import { Button } from "@/components/Button";
import { Countdown } from "@/components/Countdown";

const panel = {
  background: TOKENS.panelBg,
  border: `1px solid ${TOKENS.panelBorder}`,
  borderRadius: 10,
};

export default function HomePage() {
  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6 max-w-[1200px] mx-auto">
      {/* HERO */}
      <div
        className="p-4 sm:p-7"
        style={{
          ...panel,
          marginBottom: 20,
          position: "relative",
          overflow: "hidden",
          borderColor: TOKENS.mintDim,
        }}
      >
        {/* decorative grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
            backgroundImage:
              "linear-gradient(rgba(163,255,214,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(163,255,214,0.2) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage:
              "radial-gradient(circle at 80% 20%, black 30%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(circle at 80% 20%, black 30%, transparent 70%)",
          }}
        />
        {/* moon — visible also on mobile at smaller size */}
        <div
          className="absolute rounded-full w-[180px] h-[180px] sm:w-[260px] sm:h-[260px] right-[-40px] top-[-30px] sm:right-[-30px] sm:top-[-50px]"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, #f6fff9 0%, #d8e6dd 30%, #6f7d76 70%, #1f2621 100%)",
            boxShadow: `0 0 80px ${TOKENS.mint}30, inset -40px -30px 0 -10px rgba(0,0,0,0.55)`,
          }}
        />
        <div className="relative max-w-[70%] sm:max-w-[60%]">
          <div
            className="font-mono"
            style={{
              fontSize: 10,
              color: TOKENS.mint,
              letterSpacing: "0.3em",
            }}
          >
            // BRIEFING — {STREAMER.nameRomaji}
          </div>
          <h1
            className="text-[34px] sm:text-[64px]"
            style={{
              margin: "10px 0 4px",
              lineHeight: 1.0,
              fontWeight: 900,
              letterSpacing: "-0.01em",
            }}
          >
            ruruの
            <br />
            <span
              style={{
                color: TOKENS.mint,
                textShadow: `0 0 20px ${TOKENS.mint}55`,
              }}
            >
              ポンコツ部屋。
            </span>
          </h1>
          <p
            style={{
              color: TOKENS.textMuted,
              fontSize: 14,
              maxWidth: 480,
              marginTop: 12,
            }}
          >
            {STREAMER.bio}
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            <Button primary href="/stream">
              LIVE を見る →
            </Button>
            <Button href="/member">メンバーになる</Button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-5">
        {(
          [
            ["FOLLOWERS", STREAMER.stats.followers],
            ["SUBS", STREAMER.stats.subs],
            ["STREAMS", STREAMER.stats.streams],
            ["YEARS", STREAMER.stats.years],
          ] as const
        ).map(([k, v]) => (
          <div key={k} style={{ ...panel, padding: "14px 14px" }}>
            <div
              className="font-mono"
              style={{
                fontSize: 9,
                letterSpacing: "0.2em",
                color: TOKENS.textFaint,
              }}
            >
              {k}
            </div>
            <div
              className="font-mono"
              style={{
                fontSize: 22,
                fontWeight: 700,
                marginTop: 4,
                color: TOKENS.mint,
              }}
            >
              {v}
            </div>
          </div>
        ))}
      </div>

      {/* NEXT MISSION + GAMES */}
      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-3 md:gap-4">
        <div
          style={{
            ...panel,
            padding: 18,
            borderColor: TOKENS.mintDim,
          }}
        >
          <div
            className="font-mono"
            style={{
              fontSize: 10,
              color: TOKENS.mint,
              letterSpacing: "0.24em",
            }}
          >
            NEXT MISSION
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 8 }}>
            VALORIS:ZERO / ランクマ
          </div>
          <div style={{ color: TOKENS.textMuted, marginTop: 4 }}>
            4月6日 (月) 21:00 — 24:00 JST
          </div>
          <div className="flex items-center gap-3 mt-3">
            <Countdown target="21:00" />
            <Button small>リマインド</Button>
          </div>
        </div>
        <div style={{ ...panel, padding: 18 }}>
          <div
            className="font-mono"
            style={{
              fontSize: 10,
              color: TOKENS.textFaint,
              letterSpacing: "0.24em",
            }}
          >
            LOADOUT / GAMES
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {STREAMER.games.map((g) => (
              <span
                key={g}
                className="font-mono"
                style={{
                  fontSize: 11,
                  padding: "6px 9px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 4,
                  color: "#cad3cf",
                  letterSpacing: "0.08em",
                }}
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
