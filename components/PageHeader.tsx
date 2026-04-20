import type { ReactNode } from "react";
import { TOKENS } from "@/lib/data";

export function PageHeader({
  prefix,
  title,
  desc,
  right,
}: {
  prefix: string;
  title: string;
  desc?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-3 mb-4 sm:mb-5">
      <div>
        <div
          className="font-mono"
          style={{
            fontSize: 10,
            color: TOKENS.mint,
            letterSpacing: "0.24em",
          }}
        >
          {prefix}
        </div>
        <h2
          className="text-[22px] sm:text-[30px]"
          style={{ fontWeight: 900, margin: "6px 0 0" }}
        >
          {title}
        </h2>
        {desc && (
          <p style={{ color: TOKENS.textMuted, marginTop: 6, fontSize: 14 }}>
            {desc}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}
