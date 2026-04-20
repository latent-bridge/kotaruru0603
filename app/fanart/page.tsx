import { PageHeader } from "@/components/PageHeader";
import { FANARTS, TOKENS } from "@/lib/data";

export default function FanartPage() {
  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6 max-w-[1200px] mx-auto">
      <PageHeader prefix="// INTEL FROM CREW" title="ファンアート" />
      <div
        style={{
          columnCount: 2,
          columnGap: 12,
        }}
        className="md:[column-count:4]"
      >
        {FANARTS.map((f) => (
          <div
            key={f.id}
            style={{
              breakInside: "avoid",
              marginBottom: 12,
              background: `hsl(${f.hue}, 25%, 12%)`,
              borderRadius: 6,
              overflow: "hidden",
              position: "relative",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div
              style={{
                height: f.h,
                width: "100%",
                background: `linear-gradient(140deg, hsl(${f.hue}, 40%, 30%), hsl(${f.hue + 30}, 30%, 15%))`,
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0 6px, transparent 6px 16px)",
                }}
              />
              <div
                className="font-mono"
                style={{
                  position: "absolute",
                  bottom: 8,
                  left: 10,
                  fontSize: 9,
                  color: "#e6edea99",
                  letterSpacing: "0.12em",
                }}
              >
                FAN ART / placeholder
              </div>
            </div>
            <div
              className="flex justify-between font-mono"
              style={{ padding: "8px 10px", fontSize: 10 }}
            >
              <span style={{ color: "#cad3cf" }}>{f.by}</span>
              <span style={{ color: TOKENS.pink }}>♥ {f.likes}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
