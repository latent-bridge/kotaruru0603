"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { PALETTE, FONTS } from "@/lib/mochi";

const CHAT_API_BASE =
  process.env.NEXT_PUBLIC_CHAT_API_BASE ?? "https://chat.latent-bridge.com";

type Mode = "login" | "register";

const ERROR_MESSAGES: Record<string, string> = {
  not_registered: "まだ登録されていません。「とうろく」からはじめてください。",
  already_registered: "すでに登録済みのアカウントです。「ログイン」に進んでください。",
  state_mismatch: "時間が経ちすぎて認証情報が無効になりました。もう一度やりなおしてください。",
  missing_code: "認証コードが受け取れませんでした。もう一度やりなおしてください。",
  token_exchange_failed: "Discord との通信に失敗しました。少し待ってから再試行してください。",
  token_exchange_error: "Discord との通信中にエラーが発生しました。",
  user_fetch_failed: "Discord のユーザー情報が取得できませんでした。",
  user_fetch_error: "Discord のユーザー情報取得中にエラーが発生しました。",
  access_denied: "認可がキャンセルされました。",
};

function AuthPanelInner({ mode }: { mode: Mode }) {
  const params = useSearchParams();
  const errorCode = params?.get("error");
  const errorMessage = errorCode ? ERROR_MESSAGES[errorCode] : null;

  const altHref = mode === "login" ? "/register/" : "/login/";
  const altLabel = mode === "login" ? "とうろく" : "ログイン";
  const title = mode === "login" ? "ログイン" : "とうろく";
  const lead =
    mode === "login"
      ? "いつものアカウントでログインして、ざつだんに参加しよう ♡"
      : "はじめまして！ Discord アカウントで新しく登録するよ ♡";
  const buttonLabel =
    mode === "login" ? "Discord でログイン" : "Discord で登録";

  const discordStartUrl = useMemo(() => {
    const url = new URL(`${CHAT_API_BASE}/auth/discord/start`);
    url.searchParams.set("mode", mode);
    if (typeof window !== "undefined") {
      url.searchParams.set("return_to", window.location.origin);
    }
    return url.toString();
  }, [mode]);

  return (
    <main
      style={{
        maxWidth: 520,
        margin: "0 auto",
        padding: "40px 20px 80px",
      }}
    >
      <h1
        style={{
          fontFamily: FONTS.body,
          fontWeight: 900,
          fontSize: "clamp(28px, 5vw, 40px)",
          color: PALETTE.ink,
          marginBottom: 12,
        }}
      >
        <span
          style={{
            background: `linear-gradient(180deg, transparent 60%, ${PALETTE.cream}cc 60%)`,
          }}
        >
          {title}
        </span>
      </h1>

      <p
        style={{
          fontSize: 14,
          color: PALETTE.inkDim,
          lineHeight: 1.8,
          marginBottom: 28,
        }}
      >
        {lead}
      </p>

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

      <a
        href={discordStartUrl}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: "14px 22px",
          background: "#5865F2",
          color: "#fff",
          border: `3px solid ${PALETTE.ink}`,
          borderRadius: 18,
          boxShadow: `4px 4px 0 ${PALETTE.ink}`,
          fontSize: 15,
          fontWeight: 900,
          textDecoration: "none",
          marginBottom: 18,
        }}
      >
        <DiscordMark />
        {buttonLabel}
      </a>

      <div
        style={{
          textAlign: "center",
          fontSize: 12,
          color: PALETTE.inkDim,
        }}
      >
        {mode === "login" ? "まだアカウントがない？" : "もう登録してる？"}{" "}
        <Link
          href={altHref}
          style={{
            color: PALETTE.accent,
            fontWeight: 700,
            textDecoration: "underline",
          }}
        >
          {altLabel}はこちら
        </Link>
      </div>
    </main>
  );
}

function DiscordMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.078.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.078-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export function AuthPanel({ mode }: { mode: Mode }) {
  return (
    <Suspense fallback={null}>
      <AuthPanelInner mode={mode} />
    </Suspense>
  );
}
