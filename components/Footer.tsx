import { STREAMER, TOKENS } from "@/lib/data";

export function Footer() {
  return (
    <div
      style={{
        padding: "30px 24px 40px",
        borderTop: `1px solid ${TOKENS.panelBorder}`,
        marginTop: 20,
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          className="font-mono"
          style={{ fontSize: 10, color: TOKENS.textFaint, letterSpacing: "0.2em" }}
        >
          © RURU–OPS · 2026 · UNOFFICIAL FAN SITE
        </div>
        <div className="flex gap-2">
          {STREAMER.socials.map((s) => (
            <a
              key={s.k}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono"
              style={{
                fontSize: 10,
                color: "#cad3cf",
                letterSpacing: "0.14em",
                padding: "4px 8px",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 4,
              }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
