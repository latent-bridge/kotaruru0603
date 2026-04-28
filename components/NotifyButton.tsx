"use client";

import { useEffect, useState } from "react";
import { MochiButton } from "@/components/mochi-ui";
import { ConfirmModal, type ConfirmRequest } from "@/components/ConfirmModal";
import {
  detectPushSupport,
  getCurrentSubscription,
  getPermissionState,
  subscribe,
  unsubscribe,
} from "@/lib/push";

const SITE_ID = "kotaruru0603";

type State =
  | { kind: "loading" }
  | { kind: "unsupported" }
  | { kind: "needs_install" }
  | { kind: "denied" }
  | { kind: "off" }
  | { kind: "on" }
  | { kind: "busy" };

export function NotifyButton({
  size = "sm",
  // Variant used for the OFF / loading / denied / needs_install / busy states
  // (i.e. anything except actively subscribed). ON state always uses "cream"
  // so the subscribed indicator is visually distinct from the call-to-action.
  defaultVariant = "outline",
}: {
  size?: "sm" | "md";
  defaultVariant?: "filled" | "outline" | "cream";
}) {
  const [state, setState] = useState<State>({ kind: "loading" });
  const [confirmReq, setConfirmReq] = useState<ConfirmRequest | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const support = detectPushSupport();
      if (!support.apiAvailable) {
        if (!cancelled) setState({ kind: "unsupported" });
        return;
      }
      if (support.isIOS && !support.isStandalone) {
        // Show the button so the user can discover the install hint via tap;
        // we don't pre-emptively gate it as "needs_install" because we want
        // to teach via the modal rather than a silent disabled button.
        if (!cancelled) setState({ kind: "off" });
        return;
      }
      const perm = getPermissionState();
      if (perm === "denied") {
        if (!cancelled) setState({ kind: "denied" });
        return;
      }
      const sub = await getCurrentSubscription();
      if (!cancelled) setState({ kind: sub ? "on" : "off" });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function close() {
    setConfirmReq(null);
  }

  async function doSubscribe() {
    setConfirmReq((p) => (p ? { ...p, busy: true } : p));
    setState({ kind: "busy" });
    const result = await subscribe(SITE_ID);
    close();
    if (result.ok) {
      setState({ kind: "on" });
    } else if (result.reason === "needs_install") {
      setState({ kind: "needs_install" });
      showNeedsInstall();
    } else if (result.reason === "denied") {
      setState({ kind: "denied" });
      showDenied();
    } else if (result.reason === "unsupported") {
      setState({ kind: "unsupported" });
    } else {
      setState({ kind: "off" });
      setConfirmReq({
        title: "うまく いかなかった",
        message:
          "通知の とうろくに しっぱいしたよ。\n少し じかんを おいて もう一度 ためしてみてね。",
        confirmLabel: "わかった",
        cancelLabel: null,
        onConfirm: close,
        onCancel: close,
      });
    }
  }

  async function doUnsubscribe() {
    setConfirmReq((p) => (p ? { ...p, busy: true } : p));
    setState({ kind: "busy" });
    await unsubscribe();
    close();
    setState({ kind: "off" });
  }

  function showNeedsInstall() {
    setConfirmReq({
      title: "ホーム画面に ついかしてね",
      message:
        "iPhone の Safari で、共有ボタン → 「ホーム画面に追加」 で アプリにすると、しらせを うけとれるよ ♡",
      confirmLabel: "わかった",
      cancelLabel: null,
      onConfirm: close,
      onCancel: close,
    });
  }

  function showDenied() {
    setConfirmReq({
      title: "通知が ブロックされてるよ",
      message:
        "お使いのブラウザで 通知が きょひされているよ。\nブラウザの 設定から 通知を きょかしてから もう一度 おしてね。",
      confirmLabel: "わかった",
      cancelLabel: null,
      onConfirm: close,
      onCancel: close,
    });
  }

  function handleClick() {
    if (state.kind === "loading" || state.kind === "busy") return;

    if (state.kind === "unsupported") {
      setConfirmReq({
        title: "つかえないみたい",
        message:
          "このブラウザは 通知に たいおうしていないよ。\n別のブラウザから ためしてね。",
        confirmLabel: "わかった",
        cancelLabel: null,
        onConfirm: close,
        onCancel: close,
      });
      return;
    }

    if (state.kind === "needs_install") {
      showNeedsInstall();
      return;
    }

    if (state.kind === "denied") {
      showDenied();
      return;
    }

    if (state.kind === "on") {
      setConfirmReq({
        title: "しらせを やめる？",
        message: "配信が はじまっても 通知が とどかなくなるよ。",
        confirmLabel: "やめる",
        destructive: true,
        onConfirm: doUnsubscribe,
        onCancel: close,
      });
      return;
    }

    // off → ask permission via explainer modal. iOS pre-flight: if the
    // detection said standalone, we skip the modal and prompt directly via
    // doSubscribe; otherwise the explainer doubles as the install hint.
    const support = detectPushSupport();
    if (support.isIOS && !support.isStandalone) {
      showNeedsInstall();
      return;
    }
    setConfirmReq({
      title: "配信が はじまったら しらせるね ♡",
      message:
        "つぎに ブラウザが 通知を ゆるすか きいてくるから、「許可」を おしてね。",
      confirmLabel: "つづける",
      onConfirm: doSubscribe,
      onCancel: close,
    });
  }

  // Render
  if (state.kind === "unsupported") return null; // hide; nothing meaningful to offer

  const label = (() => {
    switch (state.kind) {
      case "loading":
        return "...";
      case "busy":
        return "...";
      case "on":
        return "しらせる ♡";
      case "denied":
      case "needs_install":
      case "off":
      default:
        return "しらせて ♡";
    }
  })();

  const variant: "filled" | "outline" | "cream" =
    state.kind === "on" ? "cream" : defaultVariant;

  return (
    <>
      <MochiButton
        size={size}
        variant={variant}
        onClick={handleClick}
        disabled={state.kind === "loading" || state.kind === "busy"}
        ariaLabel={state.kind === "on" ? "通知を解除" : "配信開始時に通知"}
      >
        {label}
      </MochiButton>
      <ConfirmModal request={confirmReq} />
    </>
  );
}
