import { PageHeader } from "@/components/PageHeader";
import { MEMBERSHIPS, TOKENS } from "@/lib/data";
import { Button } from "@/components/Button";

const panel = {
  background: TOKENS.panelBg,
  border: `1px solid ${TOKENS.panelBorder}`,
  borderRadius: 10,
};

export default function MemberPage() {
  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6 max-w-[1200px] mx-auto">
      <PageHeader
        prefix="// JOIN SQUAD"
        title="メンバーシップ"
        desc="支援してくれる皆さんありがとう。無理しない範囲で、続けられるやつを。"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {MEMBERSHIPS.map((m, i) => (
          <div
            key={m.tier}
            style={{
              ...panel,
              padding: 22,
              borderColor: i === 1 ? TOKENS.mintDim : TOKENS.panelBorder,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {i === 1 && (
              <div
                className="font-mono"
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  background: TOKENS.mint,
                  color: "#06070a",
                  fontSize: 9,
                  padding: "3px 8px",
                  letterSpacing: "0.2em",
                  fontWeight: 700,
                }}
              >
                RECOMMENDED
              </div>
            )}
            <div style={{ fontSize: 32 }}>{m.emoji}</div>
            <div
              className="font-mono"
              style={{
                fontSize: 11,
                color: TOKENS.mint,
                letterSpacing: "0.22em",
                marginTop: 10,
              }}
            >
              {m.tier}
            </div>
            <div style={{ fontSize: 30, fontWeight: 900, marginTop: 6 }}>
              ¥{m.price.toLocaleString()}{" "}
              <span
                style={{
                  fontSize: 12,
                  color: TOKENS.textMuted,
                  fontWeight: 400,
                }}
              >
                / 月
              </span>
            </div>
            <ul
              className="flex flex-col gap-2"
              style={{
                listStyle: "none",
                padding: 0,
                margin: "18px 0 22px",
              }}
            >
              {m.perks.map((p) => (
                <li
                  key={p}
                  className="flex gap-2"
                  style={{ fontSize: 13, color: "#cad3cf" }}
                >
                  <span style={{ color: TOKENS.mint }}>▸</span>
                  {p}
                </li>
              ))}
            </ul>
            <Button primary={i === 1}>
              {i === 1 ? "参加する →" : "選ぶ"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
