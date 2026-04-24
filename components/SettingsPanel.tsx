"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PALETTE, FONTS } from "@/lib/mochi";

const CHAT_API_BASE =
  process.env.NEXT_PUBLIC_CHAT_API_BASE ?? "https://chat.latent-bridge.com";

type User = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  has_discord: boolean;
  has_google: boolean;
  has_email: boolean;
  tag: string;
};

type LinkState =
  | { status: "loading" }
  | { status: "anonymous" }
  | { status: "authenticated"; user: User };

type ProviderId = "discord" | "google";

type ProviderConfig = {
  id: ProviderId;
  label: string;
  linkedLabel: string;
  background: string;
  color: string;
  check: (user: User) => boolean;
};

const PROVIDERS: ProviderConfig[] = [
  {
    id: "google",
    label: "YouTube",
    linkedLabel: "YouTube に れんけいずみ",
    background: "#fff",
    color: PALETTE.ink,
    check: (u) => u.has_google,
  },
  {
    id: "discord",
    label: "Discord",
    linkedLabel: "Discord に れんけいずみ",
    background: "#5865F2",
    color: "#fff",
    check: (u) => u.has_discord,
  },
];

const ERROR_MESSAGES: Record<string, string> = {
  idp_in_use:
    "この連携先は すでに ほかの アカウントで 使われています。",
  last_idp: "さいごの ログインほうほうは かいじょ できません。",
  not_linked: "もともと 連携されていません。",
  not_authenticated:
    "ログインの じかんが きれたみたい。もういちど ログインしてね。",
  session_expired:
    "セッションが きれたので、もういちど ログインしてから やりなおしてね。",
  provider_not_configured: "この ログインほうほうは まだ じゅんびちゅう。",
};

function SettingsPanelInner() {
  const [state, setState] = useState<LinkState>({ status: "loading" });
  const [busy, setBusy] = useState<ProviderId | "logout" | "name" | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [nameStatus, setNameStatus] = useState<
    { kind: "idle" } | { kind: "ok" } | { kind: "error"; message: string }
  >({ kind: "idle" });
  const params = useSearchParams();
  const errorCode = params?.get("error");
  const errorMessage = errorCode ? ERROR_MESSAGES[errorCode] : null;
  const router = useRouter();

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`${CHAT_API_BASE}/me`, {
        credentials: "include",
      });
      if (res.status === 200) {
        const user = (await res.json()) as User;
        setState({ status: "authenticated", user });
      } else {
        setState({ status: "anonymous" });
      }
    } catch {
      setState({ status: "anonymous" });
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (state.status === "anonymous" && typeof window !== "undefined") {
      window.location.replace("/login/");
    }
  }, [state.status]);

  useEffect(() => {
    if (state.status === "authenticated") {
      setNameInput(state.user.display_name);
    }
  }, [state.status]);

  async function saveName() {
    if (state.status !== "authenticated") return;
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setNameStatus({ kind: "error", message: "なまえを いれてね" });
      return;
    }
    if (trimmed === state.user.display_name) {
      setNameStatus({ kind: "idle" });
      return;
    }
    setBusy("name");
    setNameStatus({ kind: "idle" });
    try {
      const res = await fetch(`${CHAT_API_BASE}/me/name`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        user?: User;
        error?: string;
        max?: number;
      };
      if (res.ok && body.user) {
        setState({ status: "authenticated", user: body.user });
        setNameStatus({ kind: "ok" });
        try {
          window.sessionStorage.removeItem("lb_me_cache_v1");
        } catch {
          /* ignore */
        }
      } else {
        const message = (() => {
          switch (body.error) {
            case "empty_name":
              return "なまえを いれてね";
            case "name_too_long":
              return `${body.max ?? 32}もじ までに してね`;
            case "invalid_chars":
              return "つかえない もじ が はいってるよ";
            case "not_authenticated":
              return "ログインしなおして ください";
            default:
              return `ほぞん しっぱい (${res.status})`;
          }
        })();
        setNameStatus({ kind: "error", message });
      }
    } catch {
      setNameStatus({ kind: "error", message: "つうしん しっぱい" });
    } finally {
      setBusy(null);
    }
  }

  async function unlink(providerId: ProviderId) {
    if (
      !window.confirm(
        `${providerId === "discord" ? "Discord" : "YouTube"} との れんけいを かいじょしますか？`,
      )
    ) {
      return;
    }
    setBusy(providerId);
    try {
      const res = await fetch(`${CHAT_API_BASE}/auth/${providerId}/unlink`, {
        method: "POST",
        credentials: "include",
      });
      if (res.status === 200) {
        await refresh();
        router.replace("/settings/");
      } else {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        const code = body.error ?? "unknown";
        router.replace(`/settings/?error=${encodeURIComponent(code)}`);
      }
    } finally {
      setBusy(null);
    }
  }

  async function logout() {
    if (!window.confirm("ログアウトしますか？")) return;
    setBusy("logout");
    try {
      await fetch(`${CHAT_API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setBusy(null);
      try {
        window.sessionStorage.removeItem("lb_me_cache_v1");
      } catch {
        /* ignore */
      }
      window.location.href = "/";
    }
  }

  if (state.status === "loading" || state.status === "anonymous") {
    return (
      <main
        style={{
          maxWidth: 520,
          margin: "0 auto",
          padding: "60px 20px",
          textAlign: "center",
          fontSize: 13,
          color: PALETTE.inkDim,
        }}
      >
        よみこみちゅう…
      </main>
    );
  }

  const { user } = state;

  return (
    <main
      style={{
        maxWidth: 560,
        margin: "0 auto",
        padding: "40px 20px 80px",
      }}
    >
      <h1
        style={{
          fontFamily: FONTS.body,
          fontWeight: 900,
          fontSize: "clamp(26px, 4vw, 36px)",
          color: PALETTE.ink,
          marginBottom: 20,
        }}
      >
        <span
          style={{
            background: `linear-gradient(180deg, transparent 60%, ${PALETTE.cream}cc 60%)`,
          }}
        >
          せってい
        </span>
      </h1>

      {errorMessage && (
        <div
          role="alert"
          style={{
            background: "#fff",
            border: `2px solid ${PALETTE.accent}`,
            borderRadius: 14,
            padding: "12px 14px",
            fontSize: 13,
            color: PALETTE.accent,
            marginBottom: 20,
            boxShadow: `3px 3px 0 ${PALETTE.inkSoft}`,
          }}
        >
          {errorMessage}
        </div>
      )}

      <div
        style={{
          background: "#fff",
          border: `3px solid ${PALETTE.ink}`,
          borderRadius: 22,
          boxShadow: `5px 5px 0 ${PALETTE.ink}`,
          padding: "20px 22px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt=""
            width={56}
            height={56}
            style={{
              borderRadius: "50%",
              border: `2px solid ${PALETTE.ink}`,
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            aria-hidden
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: PALETTE.cream,
              border: `2px solid ${PALETTE.ink}`,
            }}
          />
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 16, fontWeight: 900, color: PALETTE.ink }}>
            {user.display_name}{" "}
            <span
              style={{
                fontFamily: FONTS.mono,
                color: PALETTE.inkDim,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              #{user.tag}
            </span>
          </span>
          <span style={{ fontSize: 10, color: PALETTE.inkDim }}>
            チャットで こう ひょうじされるよ
          </span>
        </div>
      </div>

      <h2 style={sectionHeading}>プロフィール</h2>
      <div
        style={{
          background: "#fff",
          border: `2px solid ${PALETTE.ink}`,
          borderRadius: 16,
          padding: "14px 16px",
          marginBottom: 24,
          boxShadow: `3px 3px 0 ${PALETTE.inkSoft}`,
        }}
      >
        <label
          htmlFor="display-name"
          style={{
            display: "block",
            fontSize: 11,
            fontFamily: FONTS.mono,
            color: PALETTE.inkDim,
            letterSpacing: 0.8,
            marginBottom: 6,
          }}
        >
          なまえ (1〜32もじ)
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            id="display-name"
            type="text"
            value={nameInput}
            onChange={(e) => {
              setNameInput(e.target.value);
              if (nameStatus.kind !== "idle") setNameStatus({ kind: "idle" });
            }}
            maxLength={64}
            disabled={busy !== null}
            style={{
              flex: 1,
              padding: "8px 12px",
              fontSize: 14,
              fontFamily: FONTS.body,
              color: PALETTE.ink,
              background: PALETTE.paper,
              border: `2px solid ${PALETTE.ink}`,
              borderRadius: 10,
              outline: "none",
            }}
          />
          <button
            type="button"
            onClick={saveName}
            disabled={
              busy !== null ||
              !nameInput.trim() ||
              nameInput.trim() === user.display_name
            }
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              border: `2px solid ${PALETTE.ink}`,
              background:
                busy !== null ||
                !nameInput.trim() ||
                nameInput.trim() === user.display_name
                  ? PALETTE.inkSoft
                  : PALETTE.accent,
              color:
                busy !== null ||
                !nameInput.trim() ||
                nameInput.trim() === user.display_name
                  ? PALETTE.inkDim
                  : "#fff",
              fontSize: 12,
              fontWeight: 900,
              cursor:
                busy !== null ||
                !nameInput.trim() ||
                nameInput.trim() === user.display_name
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {busy === "name" ? "..." : "ほぞん"}
          </button>
        </div>
        {nameStatus.kind === "ok" && (
          <div
            role="status"
            style={{
              marginTop: 8,
              fontSize: 11,
              color: PALETTE.mint,
              fontWeight: 700,
            }}
          >
            ほぞん しました ♡
          </div>
        )}
        {nameStatus.kind === "error" && (
          <div
            role="alert"
            style={{
              marginTop: 8,
              fontSize: 11,
              color: PALETTE.accent,
              fontWeight: 700,
            }}
          >
            {nameStatus.message}
          </div>
        )}
        <div
          style={{
            marginTop: 10,
            fontSize: 10,
            fontFamily: FONTS.mono,
            color: PALETTE.inkDim,
            letterSpacing: 0.4,
          }}
        >
          ID · #{user.tag}(へんこう できません)
        </div>
      </div>

      <h2 style={sectionHeading}>れんけい</h2>
      <div
        style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}
      >
        {PROVIDERS.map((p) => {
          const linked = p.check(user);
          return (
            <div
              key={p.id}
              style={{
                background: "#fff",
                border: `2px solid ${PALETTE.ink}`,
                borderRadius: 16,
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                boxShadow: `3px 3px 0 ${PALETTE.inkSoft}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: p.background,
                    border: `2px solid ${PALETTE.ink}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: p.color,
                    fontSize: 12,
                    fontWeight: 900,
                  }}
                >
                  {p.id === "discord" ? "D" : "G"}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: PALETTE.ink }}>
                    {p.label}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: linked ? PALETTE.accent : PALETTE.inkDim,
                      fontWeight: 700,
                    }}
                  >
                    {linked ? "れんけいずみ ♡" : "みれんけい"}
                  </span>
                </div>
              </div>
              {linked ? (
                <button
                  type="button"
                  onClick={() => unlink(p.id)}
                  disabled={busy !== null}
                  style={actionButton({
                    primary: false,
                    disabled: busy !== null,
                  })}
                >
                  {busy === p.id ? "..." : "かいじょ"}
                </button>
              ) : (
                <a
                  href={`${CHAT_API_BASE}/auth/${p.id}/start?mode=link&return_to=${encodeURIComponent(
                    typeof window !== "undefined" ? window.location.origin : "",
                  )}`}
                  style={actionButton({
                    primary: true,
                    disabled: false,
                    asAnchor: true,
                  })}
                >
                  れんけい
                </a>
              )}
            </div>
          );
        })}
      </div>

      <h2 style={sectionHeading}>アカウント</h2>
      <button
        type="button"
        onClick={logout}
        disabled={busy !== null}
        style={{
          ...actionButton({ primary: false, disabled: busy !== null }),
          width: "100%",
          padding: "12px 16px",
          fontSize: 14,
        }}
      >
        {busy === "logout" ? "..." : "ログアウト"}
      </button>
    </main>
  );
}

const sectionHeading: React.CSSProperties = {
  fontSize: 12,
  fontFamily: FONTS.mono,
  fontWeight: 900,
  color: PALETTE.inkDim,
  letterSpacing: 1.2,
  marginBottom: 10,
};

function actionButton({
  primary,
  disabled,
  asAnchor,
}: {
  primary: boolean;
  disabled: boolean;
  asAnchor?: boolean;
}): React.CSSProperties {
  return {
    padding: "7px 14px",
    borderRadius: 999,
    border: `2px solid ${PALETTE.ink}`,
    background: primary ? PALETTE.cream : "transparent",
    color: PALETTE.ink,
    fontSize: 12,
    fontWeight: 900,
    cursor: disabled ? "not-allowed" : "pointer",
    textDecoration: asAnchor ? "none" : undefined,
    opacity: disabled ? 0.5 : 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
  };
}

export function SettingsPanel() {
  return (
    <Suspense fallback={null}>
      <SettingsPanelInner />
    </Suspense>
  );
}
