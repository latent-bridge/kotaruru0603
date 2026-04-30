import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  memories,
  findMemory,
  sameSeries,
  seriesNeighbors,
  relatedMemories,
  type Memory,
} from "@/lib/archive";

/** public/chats/{videoId}.json が存在するかを build 時に確認 */
function hasChatReplay(videoId: string): boolean {
  const p = path.resolve(process.cwd(), "public/chats", `${videoId}.json`);
  return fs.existsSync(p);
}
import { PALETTE, FONTS } from "@/lib/mochi";
import { EyebrowChip, Kumo } from "@/components/mochi-ui";
import {
  ArchiveCard,
  ClipCard,
  CategoryChip,
  CollabBadge,
  CollabChip,
} from "@/components/archive-ui";
import { ArchivePlayerWithChatToggle } from "@/components/stream-ui";
import { Emo } from "@/components/emoji";

export const dynamicParams = false;

export function generateStaticParams() {
  return memories.map((m) => ({ videoId: m.videoId }));
}

// タイトルから #hashtag ...(末尾のタグ群)を剥がす (Shorts タイトルがタグだらけの対策)
function cleanTitle(title: string): string {
  return title.replace(/\s*(?:#\S+\s*)+$/u, "").trim() || title;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ videoId: string }>;
}): Promise<Metadata> {
  const { videoId } = await params;
  const m = findMemory(videoId);
  if (!m) return { title: "みつからなかった" };
  const cleanedTitle = cleanTitle(m.title);
  const desc = m.description.slice(0, 160);
  return {
    title: `${cleanedTitle} — ruruのポンコツ部屋`,
    description: desc,
    openGraph: {
      title: cleanedTitle,
      description: desc,
      images: [m.thumbnailUrlHigh],
    },
  };
}

export default async function VideoPage({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = await params;
  const memory = findMemory(videoId);
  if (!memory) notFound();

  if (memory.kind === "clip") return <ClipDetail memory={memory} />;
  return <StreamDetail memory={memory} />;
}

// ═══════════════════════════════════════════════════════════════════════
// はいしん詳細
// ═══════════════════════════════════════════════════════════════════════

function StreamDetail({ memory }: { memory: Memory }) {
  const neighbors = seriesNeighbors(memory);
  const series = sameSeries(memory);
  const seriesIdx = series.findIndex((m) => m.videoId === memory.videoId);
  const related = relatedMemories(memory, 6);

  return (
    <main
      className="max-w-[980px] mx-auto px-5 md:px-6 relative"
      style={{ paddingBottom: 60 }}
    >
      <BackLink />

      <div style={{ marginBottom: 18 }}>
        <ArchivePlayerWithChatToggle
          videoId={memory.videoId}
          title={memory.title}
          hasChatReplay={hasChatReplay(memory.videoId)}
        />
      </div>

      <Kumo
        size={60}
        style={{
          position: "absolute",
          top: 60,
          right: 10,
          opacity: 0.55,
          transform: "rotate(8deg)",
          zIndex: 0,
        }}
      />

      <VideoHeader memory={memory} kindLabel="RE-WATCH" />

      {memory.description.trim().length > 0 && (
        <DescriptionCard description={memory.description} />
      )}

      {series.length > 1 && (
        <SeriesStrip
          memory={memory}
          series={series}
          index={seriesIdx}
          prev={neighbors.prev}
          next={neighbors.next}
        />
      )}

      {related.length > 0 && (
        <RelatedSection
          title="こんなのも"
          subtitle="にた はいしんを さがしてみた ♡"
          related={related}
          Card={ArchiveCard}
          columns="1 / sm:2 / lg:3"
        />
      )}
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// くりっぷ詳細 (縦長モバイル風)
// ═══════════════════════════════════════════════════════════════════════

function ClipDetail({ memory }: { memory: Memory }) {
  const related = relatedMemories(memory, 6);

  return (
    <main
      className="max-w-[760px] mx-auto px-5 md:px-6 relative"
      style={{ paddingBottom: 60 }}
    >
      <BackLink />

      <div style={{ display: "flex", justifyContent: "center" }}>
        <ClipPlayer memory={memory} />
      </div>

      <Kumo
        size={50}
        style={{
          position: "absolute",
          top: 80,
          right: 20,
          opacity: 0.5,
          transform: "rotate(-8deg)",
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: 560,
          margin: "18px auto 0",
          padding: "0 4px",
        }}
      >
        <VideoHeader memory={memory} kindLabel="CLIP" />
        {memory.description.trim().length > 0 && (
          <DescriptionCard description={memory.description} />
        )}
      </div>

      {related.length > 0 && (
        <RelatedSection
          title="ほかの くりっぷ"
          subtitle="みじかい おもいで ♡"
          related={related}
          Card={ClipCard}
          columns="2 / sm:3 / lg:4"
        />
      )}
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 共通部品
// ═══════════════════════════════════════════════════════════════════════

function BackLink() {
  return (
    <div style={{ padding: "18px 0 8px" }}>
      <Link
        href="/archive/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          fontFamily: FONTS.body,
          fontWeight: 700,
          color: PALETTE.inkDim,
          textDecoration: "none",
          padding: "6px 12px",
          background: "#fff",
          border: `2px solid ${PALETTE.ink}`,
          borderRadius: 999,
          boxShadow: `2px 2px 0 ${PALETTE.inkSoft}`,
        }}
      >
        ← おもいでばこへ もどる
      </Link>
    </div>
  );
}

function ClipPlayer({ memory }: { memory: Memory }) {
  return (
    <div
      style={{
        position: "relative",
        background: "#fff",
        borderRadius: 24,
        border: `3px solid ${PALETTE.ink}`,
        boxShadow: `5px 5px 0 ${PALETTE.ink}`,
        padding: 10,
        width: "100%",
        maxWidth: 360,
      }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "9 / 16",
          borderRadius: 16,
          overflow: "hidden",
          background: PALETTE.ink,
        }}
      >
        <iframe
          src={memory.youtubeEmbedUrl}
          title={memory.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
        />
      </div>
    </div>
  );
}

function VideoHeader({
  memory,
  kindLabel,
}: {
  memory: Memory;
  kindLabel: string;
}) {
  const displayTitle = cleanTitle(memory.title);
  return (
    <header style={{ marginBottom: 20 }}>
      <EyebrowChip>☁ {kindLabel} ☁</EyebrowChip>
      <h1
        style={{
          fontFamily: FONTS.body,
          fontWeight: 900,
          fontSize: "clamp(20px, 3.2vw, 28px)",
          lineHeight: 1.3,
          letterSpacing: -0.3,
          color: PALETTE.ink,
          margin: "10px 0 14px",
        }}
      >
        {displayTitle}
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 8,
          marginBottom: 10,
        }}
      >
        {memory.category && <CategoryChip category={memory.category} />}
        {memory.collabWith.length > 0 && <CollabBadge />}
        {memory.game && (
          <span
            style={{
              display: "inline-block",
              padding: "3px 10px",
              background: "#fff",
              color: PALETTE.ink,
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 999,
              border: `1.5px solid ${PALETTE.ink}`,
              fontFamily: FONTS.mono,
            }}
          >
            <Emo e="🎮" size={14} /> {memory.game}
          </span>
        )}
        {memory.episode !== null && (
          <span
            style={{
              fontSize: 12,
              fontFamily: FONTS.mono,
              color: PALETTE.inkDim,
              fontWeight: 700,
            }}
          >
            #{memory.episode}
          </span>
        )}
        {memory.collabWith.map((name) => (
          <CollabChip key={name} name={name} />
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 14,
          fontSize: 12,
          fontFamily: FONTS.mono,
          color: PALETTE.inkDim,
          letterSpacing: 0.5,
        }}
      >
        <span><Emo e="📅" size={12} /> {memory.date}</span>
        <span>⏱ {memory.duration}</span>
        <span>👀 {memory.views} views</span>
        {memory.likeCount !== null && <span>♡ {memory.likeCount}</span>}
        <a
          href={memory.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginLeft: "auto",
            fontSize: 11,
            fontFamily: FONTS.body,
            fontWeight: 900,
            color: PALETTE.ink,
            textDecoration: "none",
            background: PALETTE.cream,
            border: `2px solid ${PALETTE.ink}`,
            borderRadius: 999,
            padding: "5px 12px",
            boxShadow: `2px 2px 0 ${PALETTE.inkSoft}`,
          }}
        >
          YouTube で ひらく ↗
        </a>
      </div>
    </header>
  );
}

function DescriptionCard({ description }: { description: string }) {
  return (
    <section
      style={{
        background: "#fff",
        border: `2.5px solid ${PALETTE.ink}`,
        borderRadius: 18,
        boxShadow: `3px 3px 0 ${PALETTE.ink}`,
        padding: "16px 18px",
        marginBottom: 22,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontFamily: FONTS.mono,
          color: PALETTE.inkDim,
          fontWeight: 700,
          letterSpacing: 1,
          marginBottom: 8,
        }}
      >
        ✎ DESCRIPTION
      </div>
      <p
        style={{
          fontSize: 13,
          lineHeight: 1.75,
          color: PALETTE.ink,
          fontFamily: FONTS.body,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          margin: 0,
        }}
      >
        {description}
      </p>
    </section>
  );
}

function SeriesStrip({
  memory,
  series,
  index,
  prev,
  next,
}: {
  memory: Memory;
  series: Memory[];
  index: number;
  prev: Memory | null;
  next: Memory | null;
}) {
  return (
    <section
      style={{
        marginBottom: 22,
        padding: "14px 16px",
        background: PALETTE.paper,
        border: `2.5px dashed ${PALETTE.inkSoft}`,
        borderRadius: 18,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontFamily: FONTS.mono,
          color: PALETTE.inkDim,
          fontWeight: 700,
          letterSpacing: 1,
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span>≡ {memory.game} シリーズ</span>
        <span
          style={{
            background: PALETTE.ink,
            color: "#fff",
            padding: "2px 8px",
            borderRadius: 999,
            fontSize: 10,
            letterSpacing: 0.5,
          }}
        >
          {index + 1} / {series.length}
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        <SeriesNavItem memory={prev} dir="prev" />
        <SeriesNavItem memory={next} dir="next" />
      </div>
    </section>
  );
}

function SeriesNavItem({
  memory,
  dir,
}: {
  memory: Memory | null;
  dir: "prev" | "next";
}) {
  const label = dir === "prev" ? "← まえのかい" : "つぎのかい →";
  const align = dir === "prev" ? "flex-start" : "flex-end";

  if (!memory) {
    return (
      <div
        style={{
          padding: "10px 14px",
          background: "#fff",
          border: `2px dashed ${PALETTE.inkSoft}`,
          borderRadius: 12,
          fontSize: 11,
          color: PALETTE.inkDim,
          fontFamily: FONTS.body,
          textAlign: dir === "prev" ? "left" : "right",
          opacity: 0.5,
        }}
      >
        {label} <br /> (ここで おわり)
      </div>
    );
  }

  return (
    <Link
      href={`/archive/${memory.videoId}/`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align,
        padding: "10px 14px",
        background: "#fff",
        border: `2px solid ${PALETTE.ink}`,
        borderRadius: 12,
        boxShadow: `2px 2px 0 ${PALETTE.ink}`,
        textDecoration: "none",
        gap: 4,
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontFamily: FONTS.mono,
          color: PALETTE.inkDim,
          fontWeight: 700,
        }}
      >
        {label}
        {memory.episode !== null && ` · #${memory.episode}`}
      </span>
      <span
        style={{
          fontSize: 12,
          fontFamily: FONTS.body,
          fontWeight: 900,
          color: PALETTE.ink,
          lineHeight: 1.3,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textAlign: dir === "prev" ? "left" : "right",
        }}
      >
        {cleanTitle(memory.title)}
      </span>
    </Link>
  );
}

type RelatedColumns = "1 / sm:2 / lg:3" | "2 / sm:3 / lg:4";

function RelatedSection({
  title,
  subtitle,
  related,
  Card,
  columns,
}: {
  title: string;
  subtitle: string;
  related: Memory[];
  Card: (props: { memory: Memory }) => React.ReactNode;
  columns: RelatedColumns;
}) {
  const gridClass =
    columns === "2 / sm:3 / lg:4"
      ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section style={{ marginTop: 8 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <EyebrowChip>☁ {title} ☁</EyebrowChip>
        <span
          style={{
            fontSize: 11,
            fontFamily: FONTS.mono,
            color: PALETTE.inkDim,
          }}
        >
          {subtitle}
        </span>
      </div>
      <div className={gridClass} style={{ gap: 16 }}>
        {related.map((m) => (
          <Card key={m.videoId} memory={m} />
        ))}
      </div>
    </section>
  );
}
