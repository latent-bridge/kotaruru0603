"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PALETTE, FONTS } from "@/lib/mochi";
import {
  memories,
  queryMemories,
  CATEGORIES,
  GAMES,
  type Category,
  type Game,
  type Kind,
} from "@/lib/archive";
import { EyebrowChip, Kumo, Onigiri } from "@/components/mochi-ui";
import {
  ArchiveCard,
  ClipCard,
  CATEGORY_COLORS,
  COLLAB_COLOR,
} from "@/components/archive-ui";

/** カテゴリチップで選べる値: 個別 Category / "collab"(コラボのみ) / null(ぜんぶ) */
type CategoryFilter = Category | "collab" | null;

type SortKey = "newest" | "oldest" | "popular" | "series";

const SORT_LABELS: Record<SortKey, string> = {
  newest: "あたらしい順",
  oldest: "ふるい順",
  popular: "にんき順",
  series: "シリーズ順",
};

export default function ArchivePage() {
  const [kind, setKind] = useState<Kind>("stream");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");

  const streamTotal = useMemo(
    () => memories.filter((m) => m.kind === "stream").length,
    [],
  );
  const clipTotal = useMemo(
    () => memories.filter((m) => m.kind === "clip").length,
    [],
  );

  const filtered = useMemo(() => {
    const isCollab = categoryFilter === "collab";
    const cat =
      kind === "stream" && categoryFilter && categoryFilter !== "collab"
        ? categoryFilter
        : null;
    return queryMemories(memories, {
      kind,
      category: cat,
      collabOnly: kind === "stream" && isCollab,
      game: kind === "stream" ? game : null,
      search,
      sort,
    });
  }, [kind, categoryFilter, game, search, sort]);

  return (
    <main className="max-w-[1200px] mx-auto px-5 md:px-10 relative">
      <header className="pt-6 md:pt-8 pb-5 md:pb-6">
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
          これまでの はいしんや くりっぷ、ぜんぶ ここに。<br />
          タブで きりかえて、すきなやつを さがしてね ♡
        </p>
      </header>

      <Kumo
        size={70}
        style={{
          position: "absolute",
          top: 60,
          right: 20,
          opacity: 0.65,
          transform: "rotate(-6deg)",
          zIndex: 0,
        }}
      />

      <KindTabs
        value={kind}
        onChange={(k) => {
          setKind(k);
          setSearch("");
        }}
        streamTotal={streamTotal}
        clipTotal={clipTotal}
      />

      {kind === "stream" ? (
        <StreamFilters
          search={search}
          setSearch={setSearch}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          game={game}
          setGame={setGame}
          sort={sort}
          setSort={setSort}
          shown={filtered.length}
          total={streamTotal}
        />
      ) : (
        <ClipFilters
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          shown={filtered.length}
          total={clipTotal}
        />
      )}

      {filtered.length === 0 ? (
        <EmptyState />
      ) : kind === "stream" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {filtered.map((m) => (
            <ArchiveCard key={m.videoId} memory={m} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {filtered.map((m) => (
            <ClipCard key={m.videoId} memory={m} />
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

      <div className="h-16" />
    </main>
  );
}

// --- KindTabs ---------------------------------------------------------

function KindTabs({
  value,
  onChange,
  streamTotal,
  clipTotal,
}: {
  value: Kind;
  onChange: (v: Kind) => void;
  streamTotal: number;
  clipTotal: number;
}) {
  const tabs: { v: Kind; label: string; count: number }[] = [
    { v: "stream", label: "はいしん", count: streamTotal },
    { v: "clip", label: "くりっぷ", count: clipTotal },
  ];
  return (
    <nav
      style={{
        display: "flex",
        gap: 2,
        marginBottom: 18,
        borderBottom: `2px solid ${PALETTE.inkSoft}`,
        position: "relative",
        zIndex: 1,
      }}
    >
      {tabs.map((t) => {
        const active = value === t.v;
        return (
          <button
            key={t.v}
            type="button"
            onClick={() => onChange(t.v)}
            style={{
              padding: "12px 20px",
              background: "transparent",
              border: "none",
              borderBottom: active
                ? `3px solid ${PALETTE.coral}`
                : `3px solid transparent`,
              color: active ? PALETTE.ink : PALETTE.inkDim,
              fontWeight: active ? 900 : 700,
              fontFamily: FONTS.body,
              fontSize: 15,
              cursor: "pointer",
              marginBottom: -2,
              display: "flex",
              alignItems: "baseline",
              gap: 6,
            }}
          >
            {t.label}
            <span
              style={{
                fontSize: 11,
                fontFamily: FONTS.mono,
                color: PALETTE.inkDim,
                fontWeight: 700,
              }}
            >
              {t.count}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

// --- StreamFilters ---------------------------------------------------

function StreamFilters({
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  game,
  setGame,
  sort,
  setSort,
  shown,
  total,
}: {
  search: string;
  setSearch: (v: string) => void;
  categoryFilter: CategoryFilter;
  setCategoryFilter: (v: CategoryFilter) => void;
  game: Game | null;
  setGame: (v: Game | null) => void;
  sort: SortKey;
  setSort: (v: SortKey) => void;
  shown: number;
  total: number;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <SearchBox value={search} onChange={setSearch} />

      <div
        className="flex flex-wrap gap-2 items-center py-3"
        style={{
          borderTop: `2px dashed ${PALETTE.inkSoft}`,
          borderBottom: `2px dashed ${PALETTE.inkSoft}`,
          marginTop: 10,
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
        <CategoryChipButton
          active={categoryFilter === null}
          onClick={() => setCategoryFilter(null)}
          label="ぜんぶ"
        />
        {CATEGORIES.map((c) => (
          <CategoryChipButton
            key={c}
            active={categoryFilter === c}
            onClick={() => setCategoryFilter(categoryFilter === c ? null : c)}
            label={c}
            color={CATEGORY_COLORS[c]}
          />
        ))}
        <CategoryChipButton
          active={categoryFilter === "collab"}
          onClick={() => setCategoryFilter(categoryFilter === "collab" ? null : "collab")}
          label="こらぼ"
          color={COLLAB_COLOR}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-3">
        <SelectField
          label="げーむ"
          value={game ?? ""}
          onChange={(v) => setGame(v === "" ? null : (v as Game))}
          options={[{ value: "", label: "ぜんぶ" }, ...GAMES.map((g) => ({ value: g, label: g }))]}
        />
        <SelectField
          label="ならび"
          value={sort}
          onChange={(v) => setSort(v as SortKey)}
          options={(Object.keys(SORT_LABELS) as SortKey[]).map((k) => ({
            value: k,
            label: SORT_LABELS[k],
          }))}
        />
        <span
          className="ml-auto"
          style={{
            fontSize: 11,
            fontFamily: FONTS.mono,
            color: PALETTE.inkDim,
            letterSpacing: 1,
          }}
        >
          {shown} / {total}
        </span>
      </div>
    </div>
  );
}

// --- ClipFilters -----------------------------------------------------

function ClipFilters({
  search,
  setSearch,
  sort,
  setSort,
  shown,
  total,
}: {
  search: string;
  setSearch: (v: string) => void;
  sort: SortKey;
  setSort: (v: SortKey) => void;
  shown: number;
  total: number;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <SearchBox value={search} onChange={setSearch} />
      <div className="flex flex-wrap items-center gap-3 mt-3">
        <SelectField
          label="ならび"
          value={sort}
          onChange={(v) => setSort(v as SortKey)}
          options={(["newest", "oldest", "popular"] as SortKey[]).map((k) => ({
            value: k,
            label: SORT_LABELS[k],
          }))}
        />
        <span
          className="ml-auto"
          style={{
            fontSize: 11,
            fontFamily: FONTS.mono,
            color: PALETTE.inkDim,
            letterSpacing: 1,
          }}
        >
          {shown} / {total}
        </span>
      </div>
    </div>
  );
}

// --- SearchBox -------------------------------------------------------

function SearchBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  // Local input state lets the textbox display the IME draft immediately,
  // while we postpone notifying the parent (and thus running the filter)
  // until composition ends. Without this, every keypress in Japanese input
  // causes the result list to flicker and the displayed text to "drop".
  const [local, setLocal] = useState(value);
  const composingRef = useRef(false);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setLocal(v);
    if (!composingRef.current) onChange(v);
  };

  return (
    <div style={{ position: "relative" }}>
      <span
        style={{
          position: "absolute",
          left: 14,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: 14,
          color: PALETTE.inkDim,
          pointerEvents: "none",
        }}
      >
        🔍
      </span>
      <input
        type="search"
        value={local}
        onChange={handleChange}
        onCompositionStart={() => {
          composingRef.current = true;
        }}
        onCompositionEnd={(e) => {
          composingRef.current = false;
          onChange((e.target as HTMLInputElement).value);
        }}
        placeholder="タイトル・ゲーム・コラボ相手で さがす"
        style={{
          width: "100%",
          padding: "11px 14px 11px 40px",
          background: "#fff",
          border: `2px solid ${PALETTE.ink}`,
          borderRadius: 14,
          fontSize: 14,
          fontFamily: FONTS.body,
          color: PALETTE.ink,
          boxShadow: `2px 2px 0 ${PALETTE.inkSoft}`,
          outline: "none",
        }}
      />
    </div>
  );
}

// --- SelectField -----------------------------------------------------

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontSize: 12,
        fontFamily: FONTS.body,
        color: PALETTE.ink,
        fontWeight: 700,
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontFamily: FONTS.mono,
          color: PALETTE.inkDim,
          letterSpacing: 1,
        }}
      >
        {label}:
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "6px 28px 6px 12px",
          background: "#fff",
          border: `2px solid ${PALETTE.ink}`,
          borderRadius: 10,
          fontSize: 12,
          fontWeight: 700,
          fontFamily: FONTS.body,
          color: PALETTE.ink,
          cursor: "pointer",
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1 L5 5 L9 1' stroke='%233a2e2a' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 10px center",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

// --- CategoryChipButton ----------------------------------------------

function CategoryChipButton({
  label,
  active,
  onClick,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: { color: string; bg: string };
}) {
  const c = color ?? { color: PALETTE.ink, bg: PALETTE.cream };
  return (
    <button
      type="button"
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
      {label}
    </button>
  );
}

// --- EmptyState ------------------------------------------------------

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
        みつからなかった
      </div>
      <div style={{ fontSize: 12, color: PALETTE.inkDim }}>
        べつの しゅるいや けんさくごで ためしてみてね ♡
      </div>
    </div>
  );
}
