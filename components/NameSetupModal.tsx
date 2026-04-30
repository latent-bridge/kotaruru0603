"use client";

import { useEffect, useState } from "react";
import { PALETTE, FONTS } from "@/lib/mochi";
import { Icon } from "@/components/Icon";

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

const NAME_MAX = 32;

export function NameSetupModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${CHAT_API_BASE}/me`, {
          credentials: "include",
        });
        if (cancelled || res.status !== 200) return;
        const u = (await res.json()) as User;
        if (!u.display_name) setOpen(true);
      } catch {
        /* ignore — anonymous or network blip */
      }
    })();

    function handleUserUpdated(e: Event) {
      const detail = (e as CustomEvent<User | null>).detail;
      if (!detail) {
        setOpen(false);
        return;
      }
      setOpen(!detail.display_name);
    }
    window.addEventListener("lb:user-updated", handleUserUpdated);

    return () => {
      cancelled = true;
      window.removeEventListener("lb:user-updated", handleUserUpdated);
    };
  }, []);

  async function submit() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("なまえを いれてね");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${CHAT_API_BASE}/me/name`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        user?: User;
        error?: string;
        max?: number;
      };
      if (res.ok && body.user) {
        try {
          window.sessionStorage.removeItem("lb_me_cache_v1");
        } catch {
          /* ignore */
        }
        window.dispatchEvent(
          new CustomEvent("lb:user-updated", { detail: body.user }),
        );
      } else {
        const msg = (() => {
          switch (body.error) {
            case "empty_name":
              return "なまえを いれてね";
            case "name_too_long":
              return `${body.max ?? NAME_MAX}もじ までに してね`;
            case "invalid_chars":
              return "つかえない もじ が はいってるよ";
            case "not_authenticated":
              return "ログインしなおして ください";
            default:
              return `ほぞん しっぱい (${res.status})`;
          }
        })();
        setError(msg);
      }
    } catch {
      setError("つうしん しっぱい");
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal
      aria-labelledby="name-setup-title"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(58,46,42,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        zIndex: 100,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          background: "#fff",
          border: `3px solid ${PALETTE.ink}`,
          borderRadius: 22,
          boxShadow: `5px 5px 0 ${PALETTE.ink}`,
          padding: "24px 22px",
        }}
      >
        <h2
          id="name-setup-title"
          style={{
            fontFamily: FONTS.body,
            fontSize: 22,
            fontWeight: 900,
            color: PALETTE.ink,
            margin: "0 0 8px",
            lineHeight: 1.2,
          }}
        >
          <span
            style={{
              background: `linear-gradient(180deg, transparent 60%, ${PALETTE.cream}cc 60%)`,
            }}
          >
            なまえを きめてね <Icon name="heart" size={14} />
          </span>
        </h2>
        <p
          style={{
            fontSize: 12,
            color: PALETTE.inkDim,
            marginBottom: 16,
            lineHeight: 1.7,
          }}
        >
          サイトで ひょうじされる なまえだよ。
          <br />
          あとで せっていから かえられるよ。
        </p>

        <label
          htmlFor="name-setup-input"
          style={{
            display: "block",
            fontSize: 11,
            fontFamily: FONTS.mono,
            color: PALETTE.inkDim,
            letterSpacing: 0.8,
            marginBottom: 6,
          }}
        >
          なまえ (1〜{NAME_MAX}もじ)
        </label>
        <input
          id="name-setup-input"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !busy && name.trim()) {
              e.preventDefault();
              submit();
            }
          }}
          maxLength={64}
          disabled={busy}
          autoFocus
          style={{
            width: "100%",
            padding: "10px 14px",
            fontSize: 15,
            fontFamily: FONTS.body,
            color: PALETTE.ink,
            background: PALETTE.paper,
            border: `2px solid ${PALETTE.ink}`,
            borderRadius: 12,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        {error && (
          <div
            role="alert"
            style={{
              marginTop: 8,
              fontSize: 11,
              color: PALETTE.accent,
              fontWeight: 700,
            }}
          >
            {error}
          </div>
        )}
        <button
          type="button"
          onClick={submit}
          disabled={busy || !name.trim()}
          style={{
            marginTop: 16,
            width: "100%",
            padding: "12px 16px",
            borderRadius: 12,
            border: `2px solid ${PALETTE.ink}`,
            background:
              busy || !name.trim() ? PALETTE.inkSoft : PALETTE.accent,
            color: busy || !name.trim() ? PALETTE.inkDim : "#fff",
            fontSize: 14,
            fontWeight: 900,
            fontFamily: FONTS.body,
            cursor: busy || !name.trim() ? "not-allowed" : "pointer",
          }}
        >
          {busy ? "..." : "はじめる"}
        </button>
      </div>
    </div>
  );
}
