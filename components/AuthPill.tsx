"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

type AuthState =
  | { status: "loading" }
  | { status: "anonymous" }
  | { status: "authenticated"; user: User };

const CACHE_KEY = "lb_me_cache_v1";
const CACHE_TTL_MS = 60_000;

function readCache(): AuthState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(CACHE_KEY);
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

function writeCache(user: User | null) {
  try {
    window.sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ user, expires: Date.now() + CACHE_TTL_MS }),
    );
  } catch {
    /* sessionStorage unavailable */
  }
}

export function AuthPill() {
  const [state, setState] = useState<AuthState>({ status: "loading" });

  useEffect(() => {
    const cached = readCache();
    if (cached) setState(cached);

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${CHAT_API_BASE}/me`, {
          credentials: "include",
        });
        if (cancelled) return;
        if (res.status === 200) {
          const user = (await res.json()) as User;
          writeCache(user);
          setState({ status: "authenticated", user });
        } else {
          writeCache(null);
          setState({ status: "anonymous" });
        }
      } catch {
        if (!cancelled) setState({ status: "anonymous" });
      }
    })();

    function handleUserUpdated(e: Event) {
      const detail = (e as CustomEvent<User | null>).detail;
      if (detail) {
        writeCache(detail);
        setState({ status: "authenticated", user: detail });
      } else {
        writeCache(null);
        setState({ status: "anonymous" });
      }
    }
    window.addEventListener("lb:user-updated", handleUserUpdated);

    return () => {
      cancelled = true;
      window.removeEventListener("lb:user-updated", handleUserUpdated);
    };
  }, []);

  if (state.status === "loading") {
    return <div style={{ width: 120, height: 28 }} aria-hidden />;
  }

  if (state.status === "anonymous") {
    return (
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <Link href="/login/" style={pillStyle(false)}>
          ログイン
        </Link>
        <Link href="/register/" style={pillStyle(true)}>
          とうろく
        </Link>
      </div>
    );
  }

  return <UserMenu user={state.user} onLogout={() => setState({ status: "anonymous" })} />;
}

function UserMenu({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    try {
      await fetch(`${CHAT_API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      /* logout is best-effort */
    }
    try {
      window.sessionStorage.removeItem(CACHE_KEY);
    } catch {
      /* ignore */
    }
    onLogout();
    setOpen(false);
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "4px 10px 4px 4px",
          background: PALETTE.paper,
          border: `2px solid ${PALETTE.ink}`,
          borderRadius: 999,
          cursor: "pointer",
          fontFamily: FONTS.body,
        }}
        aria-expanded={open}
      >
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt=""
            width={24}
            height={24}
            style={{ borderRadius: "50%", display: "block" }}
          />
        ) : (
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: PALETTE.cream,
            }}
          />
        )}
        <span style={{ fontSize: 12, fontWeight: 700, color: PALETTE.ink }}>
          {user.display_name}
        </span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 6px)",
            minWidth: 180,
            background: "#fff",
            border: `2px solid ${PALETTE.ink}`,
            borderRadius: 14,
            padding: 8,
            boxShadow: `3px 3px 0 ${PALETTE.ink}`,
            zIndex: 20,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: PALETTE.inkDim,
              fontFamily: FONTS.mono,
              padding: "2px 8px 6px",
              letterSpacing: 0.5,
            }}
          >
            {providerStatus(user)}
          </div>
          <Link
            href="/settings/"
            onClick={() => setOpen(false)}
            style={menuItemStyle(PALETTE.ink)}
          >
            せってい
          </Link>
          <button
            onClick={handleLogout}
            style={{
              ...menuItemStyle(PALETTE.accent),
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontFamily: FONTS.body,
            }}
          >
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
}

function providerStatus(user: User): string {
  const linked: string[] = [];
  if (user.has_discord) linked.push("Discord");
  if (user.has_google) linked.push("YouTube");
  if (linked.length === 0) return "IdP 未連携";
  return `${linked.join(" ・ ")} 連携済`;
}

function menuItemStyle(color: string): React.CSSProperties {
  return {
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "6px 8px",
    fontSize: 12,
    color,
    fontWeight: 700,
    textDecoration: "none",
    borderRadius: 6,
  };
}

function pillStyle(filled: boolean): React.CSSProperties {
  return {
    padding: "5px 12px",
    borderRadius: 999,
    border: `2px solid ${PALETTE.ink}`,
    background: filled ? PALETTE.cream : "transparent",
    color: PALETTE.ink,
    fontSize: 12,
    fontWeight: 700,
    textDecoration: "none",
  };
}
