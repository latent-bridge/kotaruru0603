import { PALETTE, FONTS } from "@/lib/mochi";
import {
  MascotUsa,
  Neko,
  Kuma,
  Panda,
  Kitsune,
  Hamu,
  Pen,
  EXPRESSIONS,
  type Expression,
} from "@/components/mascots";

type Mascot = {
  Comp: React.ComponentType<{ size?: number; accent?: string; expression?: Expression }>;
  name: string;
  romaji: string;
  role: string;
  tone: string;
};

const FAMILY: Mascot[] = [
  { Comp: MascotUsa, name: "うさぎ",   romaji: "Usa",     role: "ホーム / ナビ",   tone: "やわらか・基準キャラ" },
  { Comp: Neko,      name: "ねこ",     romaji: "Neko",    role: "ざつだん / DM",   tone: "気まぐれ・チル" },
  { Comp: Kuma,      name: "くま",     romaji: "Kuma",    role: "メンバー / VIP",  tone: "どっしり・包容" },
  { Comp: Panda,     name: "ぱんだ",   romaji: "Panda",   role: "アナウンス",       tone: "強コントラスト・告知" },
  { Comp: Kitsune,   name: "きつね",   romaji: "Kitsune", role: "うた / イベント",  tone: "シャープ・特別感" },
  { Comp: Hamu,      name: "はむ",     romaji: "Hamu",    role: "スタンプ単位",     tone: "小粒・ループ表示" },
  { Comp: Pen,       name: "ぺんぎん", romaji: "Pen",     role: "らいぶ / 通知",    tone: "クール・サイン色" },
];

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

function Card({ Comp, name, role, tone }: Mascot) {
  return (
    <div
      style={{
        background: "#fff",
        border: `2.5px solid ${PALETTE.ink}`,
        borderRadius: 18,
        boxShadow: `3px 3px 0 ${PALETTE.ink}`,
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          background: PALETTE.bg,
          border: `2px solid ${PALETTE.ink}`,
          borderRadius: 12,
          padding: "16px 12px",
          display: "flex",
          justifyContent: "center",
          backgroundImage: `radial-gradient(${PALETTE.coral}30 1.2px, transparent 1.2px)`,
          backgroundSize: "16px 16px",
        }}
      >
        <Comp size={120} />
      </div>
      <div style={{ fontSize: 20, fontWeight: 900 }}>{name}</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <Tag bg={PALETTE.cream}>{role}</Tag>
      </div>
      <p style={{ fontSize: 12, color: PALETTE.inkDim, margin: 0, lineHeight: 1.6 }}>{tone}</p>
    </div>
  );
}

const CHAT_SAMPLES: { Comp: Mascot["Comp"]; who: string; msg: string; bg: string }[] = [
  { Comp: Neko, who: "ねこさん",       msg: "おはよ〜きょうも ねむい にゃ",         bg: PALETTE.lilac },
  { Comp: Pen,  who: "あおいぺんぎん", msg: "らいぶ たのしみだね！",                bg: PALETTE.mint },
  { Comp: Hamu, who: "ほっぺ",         msg: "おやつ たべた！すたんぷ もらった！", bg: PALETTE.coral },
];

const PAGE_SAMPLES: { Comp: Mascot["Comp"]; page: string; text: string }[] = [
  { Comp: MascotUsa, page: "おうち",   text: "ようこそ ♡" },
  { Comp: Pen,       page: "らいぶ",   text: "もうすぐ はじまるよ！" },
  { Comp: Kitsune,   page: "おもいで", text: "むかしの ぽんこつ、みる？" },
  { Comp: Kuma,      page: "めんばー", text: "ありがとうの きもち" },
];

export default function MascotsPage() {
  return (
    <main style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(28px, 5vw, 48px) clamp(16px, 4vw, 40px) 80px" }}>
      <header style={{ marginBottom: 36 }}>
        <Tag>☁ MASCOT FAMILY ☁</Tag>
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
            どうぶつたち。
          </span>
        </h1>
        <p style={{ fontSize: 14, color: PALETTE.inkDim, lineHeight: 1.8, maxWidth: 600, margin: 0 }}>
          ぽんこつべや の せかいに すむ、7ひきの どうぶつたち。
        </p>
      </header>

      <section
        style={{
          background: "#fff",
          border: `3px solid ${PALETTE.ink}`,
          borderRadius: 22,
          boxShadow: `5px 5px 0 ${PALETTE.ink}`,
          padding: "28px 24px",
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
          ♡ ROLL CALL ♡
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))", gap: 12, alignItems: "end" }}>
          {FAMILY.map(({ Comp, name }) => (
            <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <Comp size={92} />
              <span style={{ fontSize: 13, fontWeight: 900 }}>{name}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 20 }}>
        {FAMILY.map((c) => (
          <Card key={c.name} {...c} />
        ))}
      </section>

      <section style={{ marginTop: 56 }}>
        <Tag>SCENES</Tag>
        <h2 style={{ fontSize: "clamp(22px, 4vw, 28px)", fontWeight: 900, letterSpacing: -0.5, margin: "10px 0 24px" }}>
          いる ばしょ
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 18 }}>
          <div
            style={{
              background: "#fff",
              border: `2.5px solid ${PALETTE.ink}`,
              borderRadius: 18,
              boxShadow: `3px 3px 0 ${PALETTE.ink}`,
              padding: 18,
              gap: 12,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {CHAT_SAMPLES.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div
                  style={{
                    background: r.bg,
                    border: `2px solid ${PALETTE.ink}`,
                    borderRadius: 999,
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <r.Comp size={38} />
                </div>
                <div
                  style={{
                    background: PALETTE.bg,
                    border: `2px solid ${PALETTE.ink}`,
                    borderRadius: 14,
                    padding: "8px 12px",
                    flex: 1,
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 900, color: PALETTE.ink }}>{r.who}</div>
                  <div style={{ fontSize: 13, color: PALETTE.ink, marginTop: 2 }}>{r.msg}</div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              background: "#fff",
              border: `2.5px solid ${PALETTE.ink}`,
              borderRadius: 18,
              boxShadow: `3px 3px 0 ${PALETTE.ink}`,
              padding: 18,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {PAGE_SAMPLES.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 10px",
                  border: `1.5px dashed ${PALETTE.inkSoft}`,
                  borderRadius: 12,
                }}
              >
                <r.Comp size={36} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 900 }}>{r.page}</div>
                  <div
                    style={{
                      fontFamily: FONTS.hand,
                      fontSize: 16,
                      color: PALETTE.ink,
                      lineHeight: 1.3,
                    }}
                  >
                    &quot;{r.text}&quot;
                  </div>
                </div>
                <span style={{ fontSize: 16, color: PALETTE.accent, fontWeight: 900 }}>→</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginTop: 64 }}>
        <Tag bg={PALETTE.lilac}>♡ EXPRESSIONS ♡</Tag>
        <h2 style={{ fontSize: "clamp(24px, 4.5vw, 32px)", fontWeight: 900, letterSpacing: -0.8, margin: "10px 0 6px" }}>
          きもち、いろいろ。
        </h2>
        <p style={{ fontSize: 13, color: PALETTE.inkDim, margin: "0 0 24px", maxWidth: 640, lineHeight: 1.7 }}>
          7ひき × 8つの きもち で、ぜんぶで <strong style={{ color: PALETTE.ink }}>56通り</strong>。
        </p>

        <div
          style={{
            background: "#fff",
            border: `2.5px solid ${PALETTE.ink}`,
            borderRadius: 18,
            boxShadow: `4px 4px 0 ${PALETTE.ink}`,
            padding: 20,
            overflowX: "auto",
          }}
        >
          <table style={{ borderCollapse: "separate", borderSpacing: 0, width: "100%", minWidth: 880 }}>
            <thead>
              <tr>
                <th
                  style={{
                    padding: "10px 8px",
                    textAlign: "left",
                    fontSize: 11,
                    fontFamily: FONTS.mono,
                    color: PALETTE.inkDim,
                    letterSpacing: 1.5,
                    borderBottom: `2px solid ${PALETTE.inkSoft}`,
                    position: "sticky",
                    left: 0,
                    background: "#fff",
                    zIndex: 1,
                  }}
                >
                  きもち
                </th>
                {FAMILY.map((c) => (
                  <th
                    key={c.romaji}
                    style={{
                      padding: "10px 4px",
                      fontSize: 11,
                      fontWeight: 900,
                      color: PALETTE.ink,
                      borderBottom: `2px solid ${PALETTE.inkSoft}`,
                    }}
                  >
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EXPRESSIONS.map((e, ri) => (
                <tr key={e.key} style={{ background: ri % 2 === 0 ? "transparent" : "#fffaf3" }}>
                  <td
                    style={{
                      padding: "10px 8px",
                      verticalAlign: "middle",
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                      background: ri % 2 === 0 ? "#fff" : "#fffaf3",
                      borderRight: `1.5px dashed ${PALETTE.inkSoft}`,
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 900, color: PALETTE.ink }}>{e.label}</div>
                    <div style={{ fontSize: 10, color: PALETTE.inkDim, marginTop: 2 }}>{e.sub}</div>
                  </td>
                  {FAMILY.map((c) => (
                    <td key={c.romaji} style={{ padding: "10px 0", textAlign: "center" }}>
                      <c.Comp size={64} expression={e.key} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
