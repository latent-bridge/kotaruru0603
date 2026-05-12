"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PALETTE, FONTS, SUPPORT } from "@/lib/mochi";
import { MochiButton, EyebrowChip } from "@/components/mochi-ui";
import { EntryIcon } from "@/components/EntryIcon";
import { Icon } from "@/components/Icon";

const CHAT_API_BASE =
  process.env.NEXT_PUBLIC_CHAT_API_BASE ?? "https://chat.latent-bridge.com";

// AuthPill が書く /me キャッシュ。投げ銭ページでも初回ペイントの「ログイン状態
// 不明」フラッシュを避けるために流用する (TTL 切れなら無視して再 fetch)。
const ME_CACHE_KEY = "lb_me_cache_v1";

const MIN_AMOUNT = SUPPORT.minAmount;

type User = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  has_discord: boolean;
  has_google: boolean;
  has_email: boolean;
  tag: string;
};

type AuthState =
  | { status: "loading" }
  | { status: "anonymous" }
  | { status: "authenticated"; user: User };

const TONE_BG: Record<string, string> = {
  coral: PALETTE.coral,
  lilac: PALETTE.lilac,
  mint: PALETTE.mint,
  cream: PALETTE.cream,
  sky: PALETTE.sky,
};

function readMeCache(): AuthState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(ME_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { user: User | null; expires: number };
    if (parsed.expires <= Date.now()) return null;
    return parsed.user
      ? { status: "authenticated", user: parsed.user }
      : { status: "anonymous" };
  } catch {
    return null;
  }
}

export function SupportPanel() {
  const [auth, setAuth] = useState<AuthState>({ status: "loading" });

  useEffect(() => {
    const cached = readMeCache();
    if (cached) setAuth(cached);

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${CHAT_API_BASE}/me`, {
          credentials: "include",
        });
        if (cancelled) return;
        if (res.status === 200) {
          setAuth({ status: "authenticated", user: (await res.json()) as User });
        } else {
          setAuth({ status: "anonymous" });
        }
      } catch {
        if (!cancelled) setAuth({ status: "anonymous" });
      }
    })();

    function onUserUpdated(e: Event) {
      const detail = (e as CustomEvent<User | null>).detail;
      setAuth(
        detail
          ? { status: "authenticated", user: detail }
          : { status: "anonymous" },
      );
    }
    window.addEventListener("lb:user-updated", onUserUpdated);
    return () => {
      cancelled = true;
      window.removeEventListener("lb:user-updated", onUserUpdated);
    };
  }, []);

  return (
    <main
      className="max-w-[1200px] mx-auto px-5 md:px-8 relative"
      style={{ paddingBottom: 60 }}
    >
      <Header />
      <PreparingNotice />
      <div
        className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 md:gap-5"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div>
          {auth.status === "loading" && <LoadingCard />}
          {auth.status === "anonymous" && <LoginGate />}
          {auth.status === "authenticated" && <TipForm user={auth.user} />}
        </div>
        <SideColumn />
      </div>
    </main>
  );
}

function Header() {
  return (
    <header style={{ padding: "18px 0 16px", position: "relative", zIndex: 1 }}>
      <EyebrowChip>
        <Icon name="cloud" size={12} /> THANK YOU <Icon name="cloud" size={12} />
      </EyebrowChip>
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
          おうえん（投げ銭）
        </span>
      </h1>
      <p
        style={{
          fontSize: 13,
          color: PALETTE.inkDim,
          lineHeight: 1.8,
          maxWidth: 560,
          margin: 0,
          whiteSpace: "pre-line",
        }}
      >
        {SUPPORT.tagline}
      </p>
    </header>
  );
}

function PreparingNotice() {
  return (
    <div
      role="note"
      style={{
        position: "relative",
        zIndex: 1,
        background: "#fff",
        border: `2px solid ${PALETTE.ink}`,
        borderRadius: 14,
        padding: "10px 14px",
        fontSize: 12.5,
        color: PALETTE.inkDim,
        lineHeight: 1.7,
        marginBottom: 18,
        boxShadow: `3px 3px 0 ${PALETTE.inkSoft}`,
        display: "flex",
        gap: 8,
        alignItems: "flex-start",
      }}
    >
      <span style={{ flexShrink: 0, marginTop: 2 }}>
        <Icon name="cloud" size={13} accent={PALETTE.accent} />
      </span>
      <span>
        <strong style={{ color: PALETTE.ink, fontWeight: 900 }}>
          けっさい（おしはらい）の しくみは ただいま じゅんびちゅうです。
        </strong>{" "}
        いまは がめんの かくにん用。もうすこしで、ここから ほんとうに おくれるように なります 🙏
      </span>
    </div>
  );
}

function LoginGate() {
  return (
    <div style={cardStyle}>
      <div style={{ marginBottom: 10 }}>
        <EyebrowChip>
          <Icon name="cloud" size={12} /> LOGIN <Icon name="cloud" size={12} />
        </EyebrowChip>
      </div>
      <h2
        style={{
          fontSize: 18,
          fontWeight: 900,
          color: PALETTE.ink,
          margin: "4px 0 8px",
        }}
      >
        おうえんするには ログインしてね
      </h2>
      <p
        style={{
          fontSize: 13,
          color: PALETTE.inkDim,
          lineHeight: 1.8,
          margin: "0 0 16px",
        }}
      >
        だれからの おうえんか わかるように、ログイン（または とうろく）してから
        おくってね。
        <br />
        おなまえは アカウントの ものが つかわれるよ。
      </p>
      <div className="flex gap-3 flex-wrap">
        <MochiButton href="/login/">ログイン</MochiButton>
        <MochiButton href="/register/" variant="cream">
          とうろく
        </MochiButton>
      </div>
    </div>
  );
}

function TipForm({ user }: { user: User }) {
  // 既定は 500 円 (presets[1])。
  const [presetAmount, setPresetAmount] = useState<number>(
    SUPPORT.presets[1].amount,
  );
  const [custom, setCustom] = useState("");
  const [msg, setMsg] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const customNum = custom.trim() ? parseInt(custom, 10) || 0 : null;
  const amount = customNum != null ? customNum : presetAmount;
  const valid = amount >= MIN_AMOUNT;

  function handleSend() {
    if (!valid) return;
    // 決済バックエンド: ここで Stripe Checkout セッションを作って
    // window.location へリダイレクトする (architecture.md の Phase 1)。
    // 現状はUIのみ — 押すと準備中の案内を出す。
    setNotice(
      `「${amount.toLocaleString()}えん」を おくる じゅんびは できてるよ。あとは けっさいの しくみを つなぐだけ — もうちょっと まってね 🙏`,
    );
  }

  return (
    <div style={cardStyle}>
      <Label>きんがく を えらぶ</Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {SUPPORT.presets.map((p) => {
          const active = customNum == null && presetAmount === p.amount;
          return (
            <button
              key={p.amount}
              type="button"
              onClick={() => {
                setPresetAmount(p.amount);
                setCustom("");
                setNotice(null);
              }}
              aria-pressed={active}
              style={{
                textAlign: "left",
                padding: "12px 12px 13px",
                background: active ? `${PALETTE.coral}22` : "#fff",
                border: `2.5px solid ${active ? PALETTE.coral : PALETTE.ink}`,
                boxShadow: `2px 2px 0 ${active ? PALETTE.coral : PALETTE.inkSoft}`,
                borderRadius: 14,
                cursor: "pointer",
                fontFamily: FONTS.body,
                color: PALETTE.ink,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  background: TONE_BG[p.tone] ?? PALETTE.cream,
                  border: `2px solid ${PALETTE.ink}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                <EntryIcon
                  value={p.icon}
                  size={20}
                  accent={PALETTE.ink}
                  inline={false}
                />
              </div>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 15,
                  fontWeight: 900,
                  color: active ? PALETTE.accent : PALETTE.ink,
                }}
              >
                ¥{p.amount.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, fontWeight: 900, marginTop: 2 }}>
                {p.label}
              </div>
              <div
                style={{
                  fontSize: 10.5,
                  color: PALETTE.inkDim,
                  marginTop: 4,
                  lineHeight: 1.45,
                }}
              >
                {p.blurb}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 18 }}>
        <Label>じぶんで きめる（¥{MIN_AMOUNT}〜）</Label>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 16,
              fontWeight: 900,
              color: PALETTE.inkDim,
            }}
          >
            ¥
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={MIN_AMOUNT}
            step={100}
            value={custom}
            onChange={(e) => {
              setCustom(e.target.value);
              setNotice(null);
            }}
            placeholder="すきな きんがく"
            style={{ ...inputStyle, fontFamily: FONTS.mono, flex: 1 }}
          />
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <Label>ひとこと（あってもなくても・140もじ）</Label>
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value.slice(0, 140))}
          rows={3}
          placeholder="えーる とか かんそう とか"
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
        />
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 10,
            color: PALETTE.inkDim,
            textAlign: "right",
            marginTop: 4,
          }}
        >
          {msg.length} / 140
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 8,
          background: PALETTE.paper,
          border: `2px solid ${PALETTE.ink}`,
          borderRadius: 12,
          padding: "10px 12px",
        }}
      >
        <Icon name="heart" size={13} accent={PALETTE.accent} />
        <span style={{ fontSize: 12.5, color: PALETTE.ink, fontWeight: 700 }}>
          「{user.display_name}」 として おくります
        </span>
        <Link
          href="/settings/"
          style={{
            marginLeft: "auto",
            fontSize: 11.5,
            fontWeight: 900,
            color: PALETTE.accent,
            textDecoration: "underline",
            textDecorationStyle: "dashed",
          }}
        >
          なまえを かえる →
        </Link>
      </div>

      <button
        type="button"
        onClick={handleSend}
        disabled={!valid}
        style={{
          width: "100%",
          marginTop: 18,
          padding: "14px 18px",
          background: valid ? PALETTE.coral : PALETTE.inkSoft,
          color: valid ? "#fff" : PALETTE.inkDim,
          fontSize: 15,
          fontWeight: 900,
          fontFamily: FONTS.body,
          letterSpacing: 0.3,
          border: `2.5px solid ${valid ? PALETTE.ink : "transparent"}`,
          boxShadow: valid ? `3px 3px 0 ${PALETTE.ink}` : "none",
          borderRadius: 14,
          cursor: valid ? "pointer" : "not-allowed",
        }}
      >
        {valid
          ? `¥${amount.toLocaleString()} を おくる →`
          : `¥${MIN_AMOUNT} いじょうで おくれるよ`}
      </button>

      {notice && (
        <div
          role="status"
          style={{
            marginTop: 12,
            background: `${PALETTE.mint}33`,
            border: `2px solid ${PALETTE.ink}`,
            borderRadius: 12,
            padding: "10px 12px",
            fontSize: 12.5,
            color: PALETTE.ink,
            lineHeight: 1.7,
            boxShadow: `2px 2px 0 ${PALETTE.inkSoft}`,
          }}
        >
          {notice}
        </div>
      )}

      <p
        style={{
          fontSize: 11,
          color: PALETTE.inkDim,
          lineHeight: 1.7,
          marginTop: 12,
          marginBottom: 0,
        }}
      >
        ※ おうえんは サービスの せいしつじょう へんきん できません。はいしんちゅうに
        よみあげる ことが あります。
      </p>
    </div>
  );
}

function SideColumn() {
  return (
    <aside style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <RecentSupporters />
      <PromiseCard />
    </aside>
  );
}

function RecentSupporters() {
  return (
    <div style={{ ...cardStyle, padding: "14px 16px" }}>
      <div style={{ marginBottom: 10 }}>
        <EyebrowChip>
          <Icon name="cloud" size={12} /> RECENT <Icon name="cloud" size={12} />
        </EyebrowChip>
      </div>
      <h3
        style={{
          fontSize: 16,
          fontWeight: 900,
          color: PALETTE.ink,
          margin: "4px 0 10px",
        }}
      >
        さいきんの おうえん
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {SUPPORT.recent.map((r, i) => (
          <div
            key={i}
            style={{
              background: PALETTE.paper,
              border: `2px solid ${PALETTE.inkSoft}`,
              borderRadius: 12,
              padding: "9px 11px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: 900,
                  color: PALETTE.ink,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {r.name}
              </span>
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 12.5,
                  fontWeight: 900,
                  color: PALETTE.accent,
                  flexShrink: 0,
                }}
              >
                ¥{r.amount.toLocaleString()}
              </span>
            </div>
            {r.msg && (
              <div
                style={{
                  fontSize: 11,
                  color: PALETTE.inkDim,
                  marginTop: 4,
                  lineHeight: 1.55,
                }}
              >
                {r.msg}
              </div>
            )}
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 10,
          fontSize: 9.5,
          fontFamily: FONTS.mono,
          color: PALETTE.inkDim,
          letterSpacing: 0.4,
        }}
      >
        ※ いまは デモ ひょうじ
      </div>
    </div>
  );
}

function PromiseCard() {
  const items = [
    "きんがくは ¥100 から。むりは しないでね",
    "おなまえは アカウントの ものが つかわれます",
    "ひとことは はいしんで よみあげる ことが あります",
    "サービスの せいしつじょう、へんきんは できません",
  ];
  return (
    <div style={{ ...cardStyle, padding: "14px 16px" }}>
      <div style={{ marginBottom: 10 }}>
        <EyebrowChip>
          <Icon name="cloud" size={12} /> OYAKUSOKU <Icon name="cloud" size={12} />
        </EyebrowChip>
      </div>
      <h3
        style={{
          fontSize: 16,
          fontWeight: 900,
          color: PALETTE.ink,
          margin: "4px 0 10px",
        }}
      >
        おねがい と おやくそく
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
        {items.map((t, i) => (
          <li
            key={i}
            style={{
              fontSize: 11.5,
              lineHeight: 1.6,
              color: PALETTE.ink,
              paddingLeft: 18,
              position: "relative",
            }}
          >
            <span style={{ position: "absolute", left: 0 }}>
              <Icon name="heart" size={11} accent={PALETTE.coral} />
            </span>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

function LoadingCard() {
  return (
    <div
      style={{
        ...cardStyle,
        textAlign: "center",
        padding: "50px 20px",
        color: PALETTE.inkDim,
        fontSize: 13,
      }}
    >
      よみこみちゅう…
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: `2.5px solid ${PALETTE.ink}`,
  borderRadius: 18,
  boxShadow: `3px 3px 0 ${PALETTE.ink}`,
  padding: "18px 18px 20px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minWidth: 0,
  padding: "9px 12px",
  fontSize: 14,
  fontFamily: FONTS.body,
  color: PALETTE.ink,
  background: PALETTE.paper,
  border: `2px solid ${PALETTE.ink}`,
  borderRadius: 10,
  outline: "none",
  boxSizing: "border-box",
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontFamily: FONTS.mono,
        fontWeight: 900,
        color: PALETTE.inkDim,
        letterSpacing: 1,
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}
