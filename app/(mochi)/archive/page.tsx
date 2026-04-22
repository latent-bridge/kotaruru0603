"use client";

import { useMemo, useState } from "react";
import { MOCHI, PALETTE, FONTS, CATEGORY_COLOR, type Category } from "@/lib/mochi";
import { MemoryCard, EyebrowChip, Kumo, Onigiri } from "@/components/mochi-ui";

type Filter = "ぜんぶ" | Category;

const FILTERS: Filter[] = [
  "ぜんぶ",
  "おしゃべり",
  "げーむ",
  "おえかき",
  "うた",
  "おはなし",
  "めんばー",
];

export default function ArchivePage() {
  const [active, setActive] = useState<Filter>("ぜんぶ");

  const filtered = useMemo(() => {
    if (active === "ぜんぶ") return MOCHI.memories;
    return MOCHI.memories.filter((m) => m.category === active);
  }, [active]);

  return (
    <main className="max-w-[1200px] mx-auto px-5 md:px-10 relative">
      <header className="pt-6 md:pt-8 pb-6 md:pb-8">
        <EyebrowChip>☁ MEMORY BOX ☁</EyebrowChip>
        <h1
          className="text-[40px] md:text-[56px]"
          style={{
            fontFamily: FONTS.body,
            fontWeight: 900,
            letterSpacing: -1,
            lineHeight: 1,
            color: PALETTE.ink,
            margin: "10px 0 0",
          }}
        >
          <span
            style={{
              background: `linear-gradient(180deg, transparent 60%, ${PALETTE.coral}80 60%)`,
            }}
          >
            おもいでばこ。
          </span>
        </h1>
        <p
          className="text-[13px] md:text-[14px] mt-4 md:mt-5 max-w-[520px]"
          style={{ color: PALETTE.inkDim, lineHeight: 1.9 }}
        >
          これまでの はいしんが ぜんぶ ここに。<br />
          すきな しゅるいで しぼって、きになるやつだけ みれるよ ♡
        </p>
      </header>

      <Kumo
        size={70}
        style={{
          position: "absolute",
          top: 80,
          right: 20,
          opacity: 0.65,
          transform: "rotate(-6deg)",
          zIndex: 0,
        }}
      />

      <nav
        className="flex flex-wrap gap-2 items-center py-3 mb-8"
        style={{
          borderTop: `2px dashed ${PALETTE.inkSoft}`,
          borderBottom: `2px dashed ${PALETTE.inkSoft}`,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontFamily: FONTS.mono,
            color: PALETTE.inkDim,
            letterSpacing: 1,
            marginRight: 4,
          }}
        >
          しゅるい:
        </span>
        {FILTERS.map((f) => (
          <FilterChip
            key={f}
            filter={f}
            active={active === f}
            onClick={() => setActive(f)}
          />
        ))}
        <span
          className="ml-auto"
          style={{
            fontSize: 11,
            fontFamily: FONTS.mono,
            color: PALETTE.inkDim,
            letterSpacing: 1,
          }}
        >
          {filtered.length} / {MOCHI.memories.length}
        </span>
      </nav>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {filtered.map((m) => (
            <MemoryCard key={m.id} memory={m} />
          ))}
        </div>
      )}

      <Onigiri
        size={56}
        style={{
          position: "absolute",
          bottom: 60,
          left: 10,
          transform: "rotate(-10deg)",
          opacity: 0.8,
          zIndex: 0,
        }}
      />
    </main>
  );
}

function FilterChip({
  filter,
  active,
  onClick,
}: {
  filter: Filter;
  active: boolean;
  onClick: () => void;
}) {
  const isAll = filter === "ぜんぶ";
  const c = isAll
    ? { color: PALETTE.ink, bg: PALETTE.cream }
    : CATEGORY_COLOR[filter as Category];

  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px",
        background: active ? PALETTE.ink : c.bg,
        color: active ? "#fff" : c.color,
        border: `2px solid ${PALETTE.ink}`,
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: FONTS.body,
        boxShadow: active ? `2px 2px 0 ${PALETTE.inkSoft}` : "none",
      }}
    >
      {filter}
    </button>
  );
}

function EmptyState() {
  return (
    <div
      className="text-center py-16"
      style={{
        background: "#fff",
        border: `2.5px dashed ${PALETTE.inkSoft}`,
        borderRadius: 18,
      }}
    >
      <div style={{ fontSize: 42, marginBottom: 10 }}>☁</div>
      <div
        style={{
          fontSize: 16,
          fontWeight: 900,
          color: PALETTE.ink,
          marginBottom: 6,
        }}
      >
        まだ ないみたい
      </div>
      <div
        style={{
          fontSize: 12,
          color: PALETTE.inkDim,
        }}
      >
        ほかの しゅるいを みてみてね ♡
      </div>
    </div>
  );
}
