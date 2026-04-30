import { PALETTE, FONTS } from "@/lib/mochi";
import { SECTIONS } from "@/components/icons-full";

const ALL = SECTIONS.flatMap((s) => s.items);

function Tag({ children, bg = PALETTE.cream }: { children: React.ReactNode; bg?: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        background: bg,
        border: `2px solid ${PALETTE.ink}`,
        borderRadius: 8,
        fontSize: 10,
        fontWeight: 900,
        letterSpacing: 1.5,
      }}
    >
      {children}
    </span>
  );
}

export default function IconsPage() {
  const accent = PALETTE.coral;

  return (
    <main style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(28px, 5vw, 48px) clamp(16px, 4vw, 40px) 80px" }}>
      <header
        style={{
          marginBottom: 36,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <Tag>♡ ICONS · もりもり {ALL.length} ♡</Tag>
          <h1
            style={{
              fontSize: "clamp(34px, 6.5vw, 56px)",
              fontWeight: 900,
              letterSpacing: -1.6,
              lineHeight: 1.05,
              margin: "12px 0 8px",
            }}
          >
            ぽんこつべやの
            <br />
            <span style={{ background: `linear-gradient(180deg, transparent 60%, ${PALETTE.coral}80 60%)` }}>
              アイコンしゅう。
            </span>
          </h1>
          <p style={{ fontSize: 14, color: PALETTE.inkDim, lineHeight: 1.8, maxWidth: 640, margin: 0 }}>
            マスコットと同じ流儀で {ALL.length} 種類。8つのカテゴリ（はいしん・おしゃべり・おうち・たべもの・てんき・UI・さむらい・せんそう）。
          </p>
        </div>
      </header>

      <section
        style={{
          background: "#fff",
          border: `3px solid ${PALETTE.ink}`,
          borderRadius: 22,
          boxShadow: `5px 5px 0 ${PALETTE.ink}`,
          padding: "24px 22px",
          marginBottom: 44,
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: -14,
            left: 22,
            background: PALETTE.cream,
            padding: "4px 12px",
            border: `2.5px solid ${PALETTE.ink}`,
            borderRadius: 10,
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: 2,
          }}
        >
          ☆ ALL {ALL.length} ☆
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(48px, 1fr))", gap: 10, alignItems: "center" }}>
          {ALL.map(({ Comp, romaji }) => (
            <div key={romaji} style={{ display: "flex", justifyContent: "center" }}>
              <Comp size={44} accent={accent} />
            </div>
          ))}
        </div>
      </section>

      {SECTIONS.map((section) => (
        <section key={section.title} style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 14 }}>
            <h2 style={{ fontSize: "clamp(20px, 4vw, 24px)", fontWeight: 900, letterSpacing: -0.5, margin: 0 }}>{section.title}</h2>
            <span style={{ fontSize: 11, fontFamily: FONTS.mono, color: PALETTE.inkDim, letterSpacing: 1 }}>
              {section.subtitle} · {section.items.length}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
            {section.items.map(({ Comp, name, romaji }) => (
              <div
                key={romaji}
                style={{
                  background: "#fff",
                  border: `2px solid ${PALETTE.ink}`,
                  borderRadius: 14,
                  boxShadow: `2px 2px 0 ${PALETTE.ink}`,
                  padding: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    background: PALETTE.bg,
                    border: `1.5px solid ${PALETTE.ink}`,
                    borderRadius: 10,
                    padding: "14px 8px",
                    display: "flex",
                    justifyContent: "center",
                    backgroundImage: `radial-gradient(${PALETTE.coral}30 1px, transparent 1px)`,
                    backgroundSize: "12px 12px",
                  }}
                >
                  <Comp size={72} accent={accent} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 900 }}>{name}</div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
