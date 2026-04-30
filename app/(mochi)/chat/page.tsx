import { PALETTE, FONTS } from "@/lib/mochi";
import { EyebrowChip, Kumo, Onigiri } from "@/components/mochi-ui";
import { FanChat } from "@/components/FanChat";
import { Icon } from "@/components/Icon";

export default function ChatPage() {
  return (
    <main
      className="max-w-[1200px] mx-auto px-5 md:px-8 relative"
      style={{ paddingBottom: 60 }}
    >
      <Kumo
        size={60}
        style={{
          position: "absolute",
          top: 40,
          right: 20,
          opacity: 0.55,
          transform: "rotate(-6deg)",
          zIndex: 0,
        }}
      />
      <Onigiri
        size={48}
        style={{
          position: "absolute",
          top: 200,
          left: 8,
          transform: "rotate(10deg)",
          opacity: 0.6,
          zIndex: 0,
        }}
      />

      <header
        style={{ padding: "18px 0 18px", position: "relative", zIndex: 1 }}
      >
        <EyebrowChip><Icon name="cloud" size={12} /> ZATSUDAN <Icon name="cloud" size={12} /></EyebrowChip>
        <h1
          style={{
            fontFamily: FONTS.body,
            fontWeight: 900,
            fontSize: "clamp(26px, 4vw, 40px)",
            lineHeight: 1.2,
            letterSpacing: -0.5,
            color: PALETTE.ink,
            margin: "10px 0 10px",
          }}
        >
          <span
            style={{
              background: `linear-gradient(180deg, transparent 60%, ${PALETTE.cream}cc 60%)`,
            }}
          >
            ざつだん べや
          </span>
        </h1>
        <p
          style={{
            fontSize: 13,
            color: PALETTE.inkDim,
            lineHeight: 1.8,
            maxWidth: 560,
            margin: 0,
          }}
        >
          はいしんが なくても、ここで みんなと はなせるよ <Icon name="heart" size={12} />
          <br />
          いつきても だれかが いるかも。
        </p>
      </header>

      <div
        className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 md:gap-5"
        style={{ position: "relative", zIndex: 1 }}
      >
        <FanChat />
        <SidePanel />
      </div>
    </main>
  );
}

function SidePanel() {
  return (
    <aside
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <RulesCard />
    </aside>
  );
}

function RulesCard() {
  const rules = [
    "あかるく、やさしく。ことばは まるく",
    "ほかのこへの わるぐちは やめてね",
    "はいしんちゅうの ネタバレは ひかえめに",
    "こまったことは もでれーたーに そうだんしてね",
  ];
  return (
    <div
      style={{
        background: "#fff",
        border: `2.5px solid ${PALETTE.ink}`,
        borderRadius: 18,
        boxShadow: `3px 3px 0 ${PALETTE.ink}`,
        padding: "14px 16px",
      }}
    >
      <div style={{ marginBottom: 10 }}>
        <EyebrowChip><Icon name="cloud" size={12} /> OKITE <Icon name="cloud" size={12} /></EyebrowChip>
      </div>
      <h3
        style={{
          fontSize: 16,
          fontWeight: 900,
          color: PALETTE.ink,
          margin: "4px 0 10px",
        }}
      >
        おねがい と やくそく
      </h3>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {rules.map((r, i) => (
          <li
            key={i}
            style={{
              fontSize: 12,
              lineHeight: 1.6,
              color: PALETTE.ink,
              paddingLeft: 18,
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: 0,
                color: PALETTE.coral,
                fontWeight: 900,
              }}
            >
              <Icon name="heart" size={11} accent={PALETTE.coral} />
            </span>
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
}
