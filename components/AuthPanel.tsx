"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PALETTE, FONTS } from "@/lib/mochi";
import { Icon } from "@/components/Icon";

const CHAT_API_BASE =
  process.env.NEXT_PUBLIC_CHAT_API_BASE ?? "https://chat.latent-bridge.com";

type Mode = "login" | "register";
type ProviderId = "discord" | "google";

type ProviderConfig = {
  id: ProviderId;
  label: { login: string; register: string };
  background: string;
  color: string;
  Mark: () => React.ReactElement;
};

const PROVIDERS: ProviderConfig[] = [
  {
    id: "google",
    label: { login: "YouTube でログイン", register: "YouTube で登録" },
    background: "#fff",
    color: PALETTE.ink,
    Mark: GoogleMark,
  },
  {
    id: "discord",
    label: { login: "Discord でログイン", register: "Discord で登録" },
    background: "#5865F2",
    color: "#fff",
    Mark: DiscordMark,
  },
];

const ERROR_MESSAGES: Record<string, string> = {
  not_registered: "まだ登録されていません。「とうろく」からはじめてください。",
  already_registered:
    "すでに登録済みのアカウントです。「ログイン」に進んでください。",
  email_conflict:
    "このメールアドレスは別のアカウントで使われています。連携で統合してください。",
  state_mismatch:
    "時間が経ちすぎて認証情報が無効になりました。もう一度やりなおしてください。",
  missing_code: "認証コードが受け取れませんでした。もう一度やりなおしてください。",
  token_exchange_failed:
    "認証サービスとの通信に失敗しました。少し待ってから再試行してください。",
  token_exchange_error: "認証サービスとの通信中にエラーが発生しました。",
  user_fetch_failed: "ユーザー情報が取得できませんでした。",
  user_fetch_error: "ユーザー情報取得中にエラーが発生しました。",
  access_denied: "認可がキャンセルされました。",
  provider_not_configured: "このログイン方法はまだ準備中です。",
  missing_token: "ログインリンクが正しくありません。もういちど メールを送ってね。",
  invalid_token: "ログインリンクが見つかりません。もういちど メールを送ってね。",
  token_used: "このログインリンクは すでに使われています。あたらしく メールを送ってね。",
  token_expired: "ログインリンクの 有効期限が きれました。もういちど メールを送ってね。",
};

type EmailStatus =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "sent"; email: string; devLink?: string }
  | { kind: "error"; message: string };

function AuthPanelInner({ mode }: { mode: Mode }) {
  const params = useSearchParams();
  const errorCode = params?.get("error");
  const errorMessage = errorCode ? ERROR_MESSAGES[errorCode] : null;

  const [emailInput, setEmailInput] = useState("");
  const [emailStatus, setEmailStatus] = useState<EmailStatus>({ kind: "idle" });
  // Populated on mount only — reading window.location during render would
  // cause SSR/client hydration mismatch (server has no window).
  const [returnTo, setReturnTo] = useState("");
  useEffect(() => {
    setReturnTo(window.location.origin);
  }, []);

  const altHref = mode === "login" ? "/register/" : "/login/";
  const altLabel = mode === "login" ? "とうろく" : "ログイン";
  const title = mode === "login" ? "ログイン" : "とうろく";
  const lead: React.ReactNode =
    mode === "login" ? (
      <>いつものアカウントでログインして、ざつだんに参加しよう <Icon name="heart" size={14} /></>
    ) : (
      <>はじめまして！ すきなサービスで 登録してね <Icon name="heart" size={14} /></>
    );

  const startUrls = useMemo(() => {
    return Object.fromEntries(
      PROVIDERS.map((p) => {
        const url = new URL(`${CHAT_API_BASE}/auth/${p.id}/start`);
        url.searchParams.set("mode", mode);
        if (returnTo) url.searchParams.set("return_to", returnTo);
        return [p.id, url.toString()];
      }),
    ) as Record<ProviderId, string>;
  }, [mode, returnTo]);

  async function submitEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = emailInput.trim();
    if (!trimmed) {
      setEmailStatus({ kind: "error", message: "メールアドレスを 入力してね。" });
      return;
    }
    setEmailStatus({ kind: "submitting" });
    try {
      const res = await fetch(`${CHAT_API_BASE}/auth/email/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: trimmed, mode, return_to: returnTo }),
      });
      if (res.status === 400) {
        setEmailStatus({
          kind: "error",
          message: "メールアドレスの 形が おかしいみたい。",
        });
        return;
      }
      if (res.status === 404) {
        setEmailStatus({
          kind: "error",
          message: ERROR_MESSAGES.not_registered,
        });
        return;
      }
      if (res.status === 409) {
        setEmailStatus({
          kind: "error",
          message: ERROR_MESSAGES.already_registered,
        });
        return;
      }
      if (!res.ok) {
        setEmailStatus({
          kind: "error",
          message: "送信に しっぱいしたよ。少し待ってから もういちど ためしてね。",
        });
        return;
      }
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        dev?: boolean;
        magic_link?: string;
      };
      setEmailStatus({
        kind: "sent",
        email: trimmed,
        devLink: data.dev ? data.magic_link : undefined,
      });
    } catch {
      setEmailStatus({
        kind: "error",
        message: "送信に しっぱいしたよ。ネットワークを 確認してね。",
      });
    }
  }

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

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginBottom: 18,
        }}
      >
        {PROVIDERS.map((p) => (
          <a
            key={p.id}
            href={startUrls[p.id]}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "14px 22px",
              background: p.background,
              color: p.color,
              border: `3px solid ${PALETTE.ink}`,
              borderRadius: 18,
              boxShadow: `4px 4px 0 ${PALETTE.ink}`,
              fontSize: 15,
              fontWeight: 900,
              textDecoration: "none",
            }}
          >
            <p.Mark />
            {p.label[mode]}
          </a>
        ))}
      </div>

      <div
        aria-hidden
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          margin: "18px 0 14px",
          color: PALETTE.inkDim,
          fontSize: 11,
          letterSpacing: 2,
        }}
      >
        <span style={{ flex: 1, height: 1, background: `${PALETTE.ink}22` }} />
        または
        <span style={{ flex: 1, height: 1, background: `${PALETTE.ink}22` }} />
      </div>

      {emailStatus.kind === "sent" ? (
        <div
          role="status"
          style={{
            background: "#fff",
            border: `3px solid ${PALETTE.ink}`,
            borderRadius: 18,
            padding: "16px 18px",
            boxShadow: `4px 4px 0 ${PALETTE.ink}`,
            marginBottom: 18,
          }}
        >
          <p
            style={{
              fontSize: 14,
              fontWeight: 900,
              color: PALETTE.ink,
              marginBottom: 6,
            }}
          >
            メールを 送ったよ <Icon name="heart" size={14} />
          </p>
          <p style={{ fontSize: 12, color: PALETTE.inkDim, lineHeight: 1.7 }}>
            <strong style={{ color: PALETTE.ink }}>{emailStatus.email}</strong> に
            ログイン用の リンクを 送ったよ。
            メールを ひらいて、リンクを おしてね。
            <br />
            (15分で きえちゃうから はやめにね)
          </p>
          {emailStatus.devLink && (
            <div
              style={{
                marginTop: 12,
                padding: "10px 12px",
                background: `${PALETTE.cream}55`,
                border: `2px dashed ${PALETTE.ink}`,
                borderRadius: 12,
                fontSize: 11,
                color: PALETTE.inkDim,
                lineHeight: 1.6,
              }}
            >
              <p style={{ margin: "0 0 6px", fontWeight: 700 }}>
                [開発モード] メールは 送られていないよ
              </p>
              <a
                href={emailStatus.devLink}
                style={{
                  color: PALETTE.accent,
                  fontWeight: 700,
                  textDecoration: "underline",
                  wordBreak: "break-all",
                }}
              >
                ここを おして ログイン
              </a>
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              setEmailStatus({ kind: "idle" });
              setEmailInput("");
            }}
            style={{
              marginTop: 10,
              background: "none",
              border: "none",
              color: PALETTE.accent,
              fontSize: 12,
              fontWeight: 700,
              textDecoration: "underline",
              cursor: "pointer",
              padding: 0,
            }}
          >
            別のメールで やりなおす
          </button>
        </div>
      ) : (
        <form
          onSubmit={submitEmail}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 18,
          }}
        >
          <label
            htmlFor="auth-email"
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: PALETTE.ink,
            }}
          >
            メールアドレスで {mode === "login" ? "ログイン" : "とうろく"}
          </label>
          <input
            id="auth-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            disabled={emailStatus.kind === "submitting"}
            style={{
              padding: "12px 14px",
              border: `3px solid ${PALETTE.ink}`,
              borderRadius: 14,
              fontSize: 15,
              background: "#fff",
              color: PALETTE.ink,
              boxShadow: `3px 3px 0 ${PALETTE.ink}`,
            }}
          />
          {emailStatus.kind === "error" && (
            <p
              role="alert"
              style={{ fontSize: 12, color: PALETTE.accent, fontWeight: 700 }}
            >
              {emailStatus.message}
            </p>
          )}
          <button
            type="submit"
            disabled={emailStatus.kind === "submitting"}
            style={{
              padding: "13px 22px",
              background: PALETTE.ink,
              color: "#fff",
              border: `3px solid ${PALETTE.ink}`,
              borderRadius: 18,
              boxShadow: `4px 4px 0 ${PALETTE.ink}`,
              fontSize: 15,
              fontWeight: 900,
              cursor: emailStatus.kind === "submitting" ? "wait" : "pointer",
              opacity: emailStatus.kind === "submitting" ? 0.7 : 1,
            }}
          >
            {emailStatus.kind === "submitting" ? "送信中..." : "ログインリンクを 送る"}
          </button>
          <p style={{ fontSize: 11, color: PALETTE.inkDim, lineHeight: 1.6 }}>
            メールに 届く リンクを おすと {mode === "login" ? "ログイン" : "とうろく"}できるよ。
            パスワードは いらないよ。
          </p>
        </form>
      )}

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

function GoogleMark() {
  // Multi-color Google "G" mark (Google branding guidelines compliant).
  return (
    <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
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
