"use client";

import { useState } from "react";
import { SUPPORT, TOKENS } from "@/lib/data";

const panel = {
  background: TOKENS.panelBg,
  border: `1px solid ${TOKENS.panelBorder}`,
  borderRadius: 10,
};

export default function SupportPage() {
  const [name, setName] = useState("");
  const [sel, setSel] = useState<number>(500);
  const [custom, setCustom] = useState("");
  const [msg, setMsg] = useState("");
  const amt = custom ? parseInt(custom, 10) || 0 : sel;

  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6 max-w-[1200px] mx-auto">
      <div style={{ marginBottom: 20 }}>
        <div
          className="font-mono"
          style={{
            fontSize: 11,
            color: TOKENS.mint,
            letterSpacing: "0.18em",
          }}
        >
          &gt; /tip — one-shot
        </div>
        <h2
          className="text-[26px] sm:text-[36px]"
          style={{
            margin: "6px 0 6px",
            fontWeight: 800,
            letterSpacing: "-0.01em",
          }}
        >
          投げ銭
        </h2>
        <p
          style={{
            fontSize: 13,
            color: "#cad3cf",
            margin: 0,
            lineHeight: 1.7,
          }}
        >
          {SUPPORT.tagline}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-4 md:gap-6">
        <div style={{ ...panel, padding: 22 }}>
          <div
            className="font-mono"
            style={{
              fontSize: 10,
              color: TOKENS.textMuted,
              letterSpacing: "0.15em",
              marginBottom: 12,
            }}
          >
            &gt; select amount
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {SUPPORT.presets.map((p) => {
              const active = !custom && sel === p.amount;
              return (
                <button
                  key={p.amount}
                  onClick={() => {
                    setSel(p.amount);
                    setCustom("");
                  }}
                  style={{
                    padding: "14px 10px",
                    cursor: "pointer",
                    textAlign: "left",
                    background: active
                      ? "rgba(163,255,214,0.12)"
                      : "rgba(255,255,255,0.02)",
                    border: active
                      ? `1px solid ${TOKENS.mint}`
                      : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 10,
                    color: "#ebefec",
                    fontFamily: "inherit",
                  }}
                >
                  <div style={{ fontSize: 20 }}>{p.emoji}</div>
                  <div
                    className="font-mono"
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      marginTop: 4,
                      color: active ? TOKENS.mint : "#ebefec",
                    }}
                  >
                    ¥{p.amount.toLocaleString()}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: TOKENS.textMuted,
                      marginTop: 2,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {p.label}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#cad3cf",
                      marginTop: 6,
                      lineHeight: 1.4,
                    }}
                  >
                    {p.blurb}
                  </div>
                </button>
              );
            })}
          </div>

          <Field label="> or enter custom amount (JPY)">
            <input
              type="number"
              min={100}
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="¥ ___"
              className="font-mono"
              style={inputStyle}
            />
          </Field>

          <Field label="> display name (匿名可)">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 24))}
              placeholder="ハンドル名 / 匿名希望は空欄のまま"
              style={inputStyle}
            />
          </Field>

          <Field label="> message (optional, 140)">
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value.slice(0, 140))}
              rows={3}
              placeholder="エールとか感想とか"
              style={{ ...inputStyle, resize: "vertical" }}
            />
            <div
              className="font-mono"
              style={{
                fontSize: 10,
                color: "#6b7079",
                textAlign: "right",
                marginTop: 4,
              }}
            >
              {msg.length} / 140
            </div>
          </Field>

          <button
            className="font-mono"
            disabled={amt < 100}
            style={{
              width: "100%",
              marginTop: 14,
              padding: "14px 18px",
              background: TOKENS.mint,
              color: "#0a0b10",
              border: 0,
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.1em",
              cursor: amt < 100 ? "not-allowed" : "pointer",
              opacity: amt >= 100 ? 1 : 0.4,
            }}
          >
            &gt; SEND ¥{amt.toLocaleString()}
          </button>
          <div
            style={{
              fontSize: 11,
              color: TOKENS.textMuted,
              marginTop: 10,
              lineHeight: 1.6,
            }}
          >
            ※ 支援金は無形サービスの性質上、返金できません。配信内で読まれる場合があります。
          </div>
        </div>

        <div style={{ ...panel, padding: 20 }}>
          <div
            className="font-mono"
            style={{
              fontSize: 10,
              color: TOKENS.textMuted,
              letterSpacing: "0.15em",
              marginBottom: 12,
            }}
          >
            &gt; recent supporters
          </div>
          <div className="flex flex-col gap-2.5">
            {SUPPORT.recent.map((r, i) => (
              <div
                key={i}
                style={{
                  padding: 12,
                  background: "rgba(0,0,0,0.25)",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div className="flex justify-between items-baseline gap-2">
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#ebefec",
                    }}
                  >
                    {r.name}
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 12,
                      color: TOKENS.mint,
                      fontWeight: 700,
                    }}
                  >
                    ¥{r.amount.toLocaleString()}
                  </span>
                </div>
                {r.msg && (
                  <div
                    style={{
                      fontSize: 11,
                      color: "#cad3cf",
                      marginTop: 4,
                      lineHeight: 1.5,
                    }}
                  >
                    {r.msg}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  background: "rgba(0,0,0,0.35)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#ebefec",
  padding: "12px 14px",
  borderRadius: 10,
  fontSize: 14,
  fontFamily: "inherit",
  outline: "none",
} as const;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 16 }}>
      <div
        className="font-mono"
        style={{
          fontSize: 10,
          color: TOKENS.textMuted,
          letterSpacing: "0.15em",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}
