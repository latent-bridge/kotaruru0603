"use client";

import { useState } from "react";
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

const ACCENTS = ["#f0a0ae", "#b4aedc", "#a6d4bf", "#f0d88a"];

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

function Card({ Comp, name, romaji, role, tone }: Mascot) {
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 20, fontWeight: 900 }}>{name}</span>
        <span style={{ fontSize: 11, fontFamily: FONTS.mono, color: PALETTE.inkDim, letterSpacing: 1 }}>
          {romaji}
        </span>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <Tag bg={PALETTE.cream}>{role}</Tag>
      </div>
      <p style={{ fontSize: 12, color: PALETTE.inkDim, margin: 0, lineHeight: 1.6 }}>{tone}</p>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 8,
          padding: "10px 12px",
          background: "#fffaf3",
          border: `1.5px dashed ${PALETTE.inkSoft}`,
          borderRadius: 10,
        }}
      >
        {[24, 36, 56, 80].map((s) => (
          <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <Comp size={s} />
            <span style={{ fontSize: 9, fontFamily: FONTS.mono, color: PALETTE.inkDim }}>{s}</span>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "10px 12px",
          background: "#fffaf3",
          border: `1.5px dashed ${PALETTE.inkSoft}`,
          borderRadius: 10,
        }}
      >
        {ACCENTS.map((a) => (
          <div key={a} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 }}>
            <Comp size={36} accent={a} />
            <span style={{ fontSize: 8, fontFamily: FONTS.mono, color: PALETTE.inkDim }}>{a.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Playground() {
  const [charIdx, setCharIdx] = useState(0);
  const [expr, setExpr] = useState<Expression>("smile");
  const [accent, setAccent] = useState<string>(PALETTE.coral);

  const C = FAMILY[charIdx];

  return (
    <div
      style={{
        background: "#fff",
        border: `2.5px solid ${PALETTE.ink}`,
        borderRadius: 18,
        boxShadow: `4px 4px 0 ${PALETTE.ink}`,
        padding: "clamp(16px, 3vw, 24px)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
        gap: 24,
        alignItems: "stretch",
      }}
    >
      <div
        style={{
          background: PALETTE.bg,
          border: `2px solid ${PALETTE.ink}`,
          borderRadius: 14,
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          backgroundImage: `radial-gradient(${accent}40 1.4px, transparent 1.4px)`,
          backgroundSize: "18px 18px",
        }}
      >
        <C.Comp size={200} expression={expr} accent={accent} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <span style={{ fontSize: 18, fontWeight: 900 }}>{C.name}</span>
          <span style={{ fontSize: 11, fontFamily: FONTS.mono, color: PALETTE.inkDim, letterSpacing: 1.2 }}>
            {C.romaji} · {expr}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <div style={{ fontSize: 11, fontFamily: FONTS.mono, color: PALETTE.inkDim, letterSpacing: 1.5, marginBottom: 8 }}>
            CHARACTER
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(48px, 1fr))", gap: 6 }}>
            {FAMILY.map((c, i) => (
              <button
                key={c.romaji}
                onClick={() => setCharIdx(i)}
                style={{
                  background: i === charIdx ? PALETTE.cream : "#fff",
                  border: `2px solid ${PALETTE.ink}`,
                  boxShadow: i === charIdx ? `2px 2px 0 ${PALETTE.ink}` : "none",
                  borderRadius: 10,
                  padding: "8px 4px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  transition: "transform 0.08s",
                  transform: i === charIdx ? "translate(-1px, -1px)" : "none",
                }}
              >
                <c.Comp size={36} expression={expr} accent={accent} />
                <span style={{ fontSize: 10, fontWeight: 700 }}>{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, fontFamily: FONTS.mono, color: PALETTE.inkDim, letterSpacing: 1.5, marginBottom: 8 }}>
            EXPRESSION
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
            {EXPRESSIONS.map((e) => (
              <button
                key={e.key}
                onClick={() => setExpr(e.key)}
                style={{
                  background: e.key === expr ? PALETTE.cream : "#fff",
                  border: `2px solid ${PALETTE.ink}`,
                  boxShadow: e.key === expr ? `2px 2px 0 ${PALETTE.ink}` : "none",
                  borderRadius: 10,
                  padding: "8px 6px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  transform: e.key === expr ? "translate(-1px, -1px)" : "none",
                }}
              >
                <C.Comp size={36} expression={e.key} accent={accent} />
                <span style={{ fontSize: 11, fontWeight: 900 }}>{e.label}</span>
                <span style={{ fontSize: 9, fontFamily: FONTS.mono, color: PALETTE.inkDim }}>{e.key}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, fontFamily: FONTS.mono, color: PALETTE.inkDim, letterSpacing: 1.5, marginBottom: 8 }}>
            ACCENT
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[PALETTE.coral, ...ACCENTS].map((a, i) => (
              <button
                key={`${a}-${i}`}
                onClick={() => setAccent(a)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: `2px solid ${PALETTE.ink}`,
                  background: a,
                  cursor: "pointer",
                  boxShadow: a === accent ? `2px 2px 0 ${PALETTE.ink}` : "none",
                  transform: a === accent ? "translate(-1px, -1px)" : "none",
                }}
              />
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: "auto",
            padding: "12px 14px",
            background: "#fffaf3",
            border: `1.5px dashed ${PALETTE.inkSoft}`,
            borderRadius: 10,
            fontFamily: FONTS.mono,
            fontSize: 12,
            color: PALETTE.ink,
            lineHeight: 1.6,
          }}
        >
          <span style={{ color: PALETTE.inkDim }}>{"<"}</span>
          <span style={{ color: PALETTE.accent, fontWeight: 700 }}>{C.romaji}</span>
          <span> expression=</span>
          <span style={{ color: "#a06030" }}>&quot;{expr}&quot;</span>
          {accent !== PALETTE.coral && (
            <>
              <span> accent=</span>
              <span style={{ color: "#a06030" }}>&quot;{accent}&quot;</span>
            </>
          )}
          <span> /</span>
          <span style={{ color: PALETTE.inkDim }}>{">"}</span>
        </div>
      </div>
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
            MochiUsa と同じ流儀で描いた SVG キャラ。すべて 80×80 viewBox · 太さ 2px の ink ストローク · コーラルのほっぺ。{" "}
            <code style={{ fontFamily: FONTS.mono, color: PALETTE.accent, fontWeight: 700 }}>
              {`<Neko size={42} />`}
            </code>{" "}
            のように 1:1 で MochiUsa と置き換え可能。
          </p>
        </div>
        <div
          style={{
            padding: "14px 18px",
            background: "#fff",
            border: `2.5px solid ${PALETTE.ink}`,
            borderRadius: 14,
            boxShadow: `3px 3px 0 ${PALETTE.ink}`,
            fontSize: 11,
            fontFamily: FONTS.mono,
            color: PALETTE.inkDim,
            letterSpacing: 1,
            lineHeight: 1.7,
          }}
        >
          <div>
            <strong style={{ color: PALETTE.ink }}>FAMILY</strong> · 7 / 7
          </div>
          <div>
            <strong style={{ color: PALETTE.ink }}>STROKE</strong> · 2px ink
          </div>
          <div>
            <strong style={{ color: PALETTE.ink }}>VIEWBOX</strong> · 80 × 80
          </div>
          <div>
            <strong style={{ color: PALETTE.ink }}>PROPS</strong> · size / accent
          </div>
        </div>
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
        <Tag>USAGE</Tag>
        <h2 style={{ fontSize: "clamp(22px, 4vw, 28px)", fontWeight: 900, letterSpacing: -0.5, margin: "10px 0 24px" }}>
          つかいどころ サンプル
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
            <div style={{ fontSize: 12, fontFamily: FONTS.mono, color: PALETTE.inkDim, letterSpacing: 1 }}>
              CASE A — ざつだん の アバター
            </div>
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
            <div style={{ fontSize: 12, fontFamily: FONTS.mono, color: PALETTE.inkDim, letterSpacing: 1 }}>
              CASE B — ページごとの 案内役
            </div>
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
          全 7 キャラ × 8 表情 ＝ <strong style={{ color: PALETTE.ink }}>56通り</strong>。{" "}
          <code style={{ fontFamily: FONTS.mono, color: PALETTE.accent }}>{`<Neko expression="excited" />`}</code> のように{" "}
          <code style={{ fontFamily: FONTS.mono }}>expression</code> プロップひとつで切替可能。
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
                  EXPRESSION
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
                    <div style={{ fontSize: 10, fontFamily: FONTS.mono, color: PALETTE.inkDim, letterSpacing: 1 }}>
                      {e.key}
                    </div>
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

      <section style={{ marginTop: 64 }}>
        <Tag bg={PALETTE.mint}>★ TRY IT ★</Tag>
        <h2 style={{ fontSize: "clamp(24px, 4.5vw, 32px)", fontWeight: 900, letterSpacing: -0.8, margin: "10px 0 24px" }}>
          ためしてみる
        </h2>
        <Playground />
      </section>

      <p
        style={{
          marginTop: 60,
          fontSize: 12,
          color: PALETTE.inkDim,
          lineHeight: 1.8,
          padding: "14px 16px",
          background: "#fffaf3",
          border: `1.5px dashed ${PALETTE.inkSoft}`,
          borderRadius: 10,
        }}
      >
        <strong style={{ color: PALETTE.ink }}>備考:</strong> 各キャラは{" "}
        <code style={{ fontFamily: FONTS.mono }}>size</code>、<code style={{ fontFamily: FONTS.mono }}>accent</code>
        （ほっぺ＆耳の色）、<code style={{ fontFamily: FONTS.mono }}>expression</code>（8種）を受け取ります。
        表情は目・口・装飾の3レイヤーで構築され、すべてのキャラで共通の API。
        配信の状態 / 通知 / DMリアクションなど、UI 状態にバインドして自動で表情を切り替える運用が可能。
      </p>
    </main>
  );
}
