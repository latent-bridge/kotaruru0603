"use client";

import { useEffect, useRef } from "react";
import { PALETTE, FONTS } from "@/lib/mochi";

export type ConfirmRequest = {
  title: React.ReactNode;
  // Multi-line strings render with line breaks preserved (whiteSpace:
  // pre-line). ReactNode also accepted so callers can mix <Icon /> into
  // the body without falling back to raw unicode glyphs.
  message: React.ReactNode;
  confirmLabel: string;
  // Pass `null` to hide the cancel button entirely (info-only modal).
  // `undefined` falls back to the default "やめる".
  cancelLabel?: string | null;
  // Destructive actions (delete, unlink) get accent (pink) confirm button to
  // signal that the operation can't be casually undone.
  destructive?: boolean;
  busy?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

export function ConfirmModal({ request }: { request: ConfirmRequest | null }) {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!request) return;
    confirmBtnRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !request?.busy) request?.onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [request]);

  if (!request) return null;

  const confirmBg = request.destructive ? PALETTE.accent : PALETTE.cream;
  const confirmFg = request.destructive ? "#fff" : PALETTE.ink;

  return (
    <div
      role="dialog"
      aria-modal
      aria-labelledby="confirm-modal-title"
      onClick={(e) => {
        // Click on backdrop (not the inner card) cancels.
        if (e.target === e.currentTarget && !request.busy) request.onCancel();
      }}
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
          id="confirm-modal-title"
          style={{
            fontFamily: FONTS.body,
            fontSize: 20,
            fontWeight: 900,
            color: PALETTE.ink,
            margin: "0 0 12px",
            lineHeight: 1.3,
          }}
        >
          <span
            style={{
              background: `linear-gradient(180deg, transparent 60%, ${PALETTE.cream}cc 60%)`,
            }}
          >
            {request.title}
          </span>
        </h2>
        <p
          style={{
            fontSize: 13,
            color: PALETTE.inkDim,
            margin: "0 0 20px",
            lineHeight: 1.7,
            whiteSpace: "pre-line",
          }}
        >
          {request.message}
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          {request.cancelLabel !== null && (
            <button
              type="button"
              onClick={request.onCancel}
              disabled={!!request.busy}
              style={{
                flex: 1,
                padding: "11px 14px",
                borderRadius: 999,
                border: `2px solid ${PALETTE.ink}`,
                background: "#fff",
                color: PALETTE.ink,
                fontSize: 13,
                fontWeight: 900,
                fontFamily: FONTS.body,
                cursor: request.busy ? "not-allowed" : "pointer",
                opacity: request.busy ? 0.5 : 1,
              }}
            >
              {request.cancelLabel ?? "やめる"}
            </button>
          )}
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={() => {
              void request.onConfirm();
            }}
            disabled={!!request.busy}
            style={{
              flex: 1,
              padding: "11px 14px",
              borderRadius: 999,
              border: `2px solid ${request.destructive ? PALETTE.accent : PALETTE.ink}`,
              background: confirmBg,
              color: confirmFg,
              fontSize: 13,
              fontWeight: 900,
              fontFamily: FONTS.body,
              cursor: request.busy ? "wait" : "pointer",
              opacity: request.busy ? 0.7 : 1,
            }}
          >
            {request.busy ? "..." : request.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
