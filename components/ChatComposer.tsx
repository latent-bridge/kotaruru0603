// contenteditable-based composer for FanChat. The editor is a div, not a
// textarea — so when the picker inserts an emoji we can render the actual
// SVG inline (LINE-style). Markers (`emoji:NAME`) are kept in the DOM as
// data-attributes on contentEditable=false spans, and serialized back to
// plain text on send. See chat-inline-emoji.md.

"use client";

import { useEffect, useRef, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { Icon } from "@/components/Icon";
import { ChatEmojiPicker } from "@/components/ChatEmojiPicker";
import { PALETTE, FONTS } from "@/lib/mochi";

const MESSAGE_MAX_LEN = 500;
const API_BASE =
  process.env.NEXT_PUBLIC_CHAT_API_BASE ?? "https://chat.latent-bridge.com";

type User = {
  tag: string;
  id: string;
  display_name: string;
  avatar_url: string | null;
  has_discord: boolean;
};

// ──────────────────────────────────────────────────────────────────────
// DOM ↔ text serialization
// ──────────────────────────────────────────────────────────────────────

function serializeEditor(root: HTMLElement): string {
  let result = "";
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      result += node.textContent ?? "";
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    const marker = el.dataset.marker;
    if (marker) {
      result += marker + " ";
      return;
    }
    if (el.tagName === "BR") {
      result += "\n";
      return;
    }
    const isBlock = el.tagName === "DIV" || el.tagName === "P";
    if (isBlock && result && !result.endsWith("\n")) result += "\n";
    for (const c of Array.from(el.childNodes)) walk(c);
  };
  for (const c of Array.from(root.childNodes)) walk(c);
  return result;
}

function buildEmojiNode(name: string): { node: HTMLElement; root: Root } {
  const span = document.createElement("span");
  span.dataset.marker = `emoji:${name}`;
  span.contentEditable = "false";
  span.style.display = "inline-flex";
  span.style.verticalAlign = "middle";
  span.style.lineHeight = "0";
  span.style.userSelect = "none";
  span.style.margin = "0 1px";
  const root = createRoot(span);
  root.render(<Icon name={name} size={18} />);
  return { node: span, root };
}

function insertAtCaret(editor: HTMLElement, node: HTMLElement) {
  editor.focus();
  const sel = window.getSelection();
  if (!sel) return;
  if (sel.rangeCount === 0 || !editor.contains(sel.anchorNode)) {
    const r = document.createRange();
    r.selectNodeContents(editor);
    r.collapse(false);
    sel.removeAllRanges();
    sel.addRange(r);
  }
  const range = sel.getRangeAt(0);
  range.deleteContents();
  range.insertNode(node);
  // Trailing space gives the caret a normal text-node landing zone after
  // the atomic emoji span, so subsequent typing isn't fused with it.
  const space = document.createTextNode(" ");
  node.parentNode?.insertBefore(space, node.nextSibling);
  const after = document.createRange();
  after.setStartAfter(space);
  after.collapse(true);
  sel.removeAllRanges();
  sel.addRange(after);
}

// ──────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────

export function ChatComposer({
  siteId,
  user,
}: {
  siteId: string;
  user: User;
}) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rootsRef = useRef<Set<Root>>(new Set());

  // Unmount any leftover icon roots on composer unmount.
  useEffect(() => {
    const roots = rootsRef.current;
    return () => {
      roots.forEach((r) => {
        try {
          r.unmount();
        } catch {
          // already unmounted
        }
      });
      roots.clear();
    };
  }, []);

  const trimmed = text.trim();
  const over = text.length > MESSAGE_MAX_LEN;
  const canSend = !sending && !!trimmed && !over;

  function syncFromDom() {
    if (!editorRef.current) return;
    setText(serializeEditor(editorRef.current));
  }

  function handleInput() {
    syncFromDom();
  }

  function handlePaste(e: React.ClipboardEvent<HTMLDivElement>) {
    e.preventDefault();
    const t = e.clipboardData.getData("text/plain");
    // execCommand is deprecated but still the simplest cross-browser way
    // to insert plain text at the caret inside a contenteditable.
    document.execCommand("insertText", false, t);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      send();
    }
  }

  function insertEmoji(name: string) {
    if (!editorRef.current) return;
    const { node, root } = buildEmojiNode(name);
    rootsRef.current.add(root);
    insertAtCaret(editorRef.current, node);
    syncFromDom();
  }

  // Stamps are atomic — they don't go through the editor. Picker tap
  // posts directly with body `stamp:NAME`. The current draft text in
  // the editor is preserved (user can still type + send normally).
  async function sendStamp(name: string) {
    if (sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/chat/${siteId}/send`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `stamp:${name}` }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        setError(translateError(payload.error, res.status));
      }
    } catch {
      setError("つうしんに しっぱいしたみたい。もういちど おねがい");
    } finally {
      setSending(false);
    }
  }

  function clearEditor() {
    if (editorRef.current) editorRef.current.innerHTML = "";
    rootsRef.current.forEach((r) => {
      try {
        r.unmount();
      } catch {
        // already gone
      }
    });
    rootsRef.current.clear();
    setText("");
  }

  async function send() {
    if (!canSend) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/chat/${siteId}/send`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      if (res.ok) {
        clearEditor();
        editorRef.current?.focus();
      } else {
        const payload = await res.json().catch(() => ({}));
        setError(translateError(payload.error, res.status));
      }
    } catch {
      setError("つうしんに しっぱいしたみたい。もういちど おねがい");
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      style={{
        borderTop: `2px solid ${PALETTE.inkSoft}`,
        padding: "10px 14px",
        background: PALETTE.paper,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
        <div
          style={{
            position: "relative",
            flex: 1,
            minWidth: 0,
          }}
        >
          {text === "" && (
            <span
              style={{
                position: "absolute",
                top: 8,
                left: 10,
                fontSize: 13,
                fontFamily: FONTS.body,
                color: PALETTE.inkDim,
                pointerEvents: "none",
              }}
            >
              {user.display_name} として はつげん…
            </span>
          )}
          <div
            ref={editorRef}
            contentEditable={!sending}
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            role="textbox"
            aria-multiline="true"
            aria-label="メッセージ入力"
            style={{
              minHeight: 44,
              padding: "8px 10px",
              border: `2px solid ${PALETTE.ink}`,
              borderRadius: 12,
              background: "#fff",
              fontSize: 13,
              lineHeight: 1.5,
              fontFamily: FONTS.body,
              color: PALETTE.ink,
              outline: "none",
              boxSizing: "border-box",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              cursor: "text",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            alignItems: "flex-end",
            flexShrink: 0,
          }}
        >
          <ChatEmojiPicker onPickEmoji={insertEmoji} onPickStamp={sendStamp} />
          <button
            onClick={send}
            disabled={!canSend}
            style={{
              padding: "8px 14px",
              border: `2px solid ${PALETTE.ink}`,
              borderRadius: 12,
              background: canSend ? PALETTE.accent : PALETTE.inkSoft,
              color: canSend ? "#fff" : PALETTE.inkDim,
              fontSize: 12,
              fontWeight: 900,
              cursor: canSend ? "pointer" : "not-allowed",
            }}
          >
            {sending ? "…" : "おくる"}
          </button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 10,
          fontFamily: FONTS.mono,
          color: over ? PALETTE.accent : PALETTE.inkDim,
        }}
      >
        <span>{error ?? "⌘/Ctrl + Enter でそうしん"}</span>
        <span>
          {text.length}/{MESSAGE_MAX_LEN}
        </span>
      </div>
    </div>
  );
}

function translateError(code: string | undefined, status: number): string {
  switch (code) {
    case "empty_message":
      return "なにか かいてね";
    case "message_too_long":
      return `${MESSAGE_MAX_LEN}もじ までにしてね`;
    case "profile_incomplete":
      return "プロフィールじょうほう が たりません";
    case "rate_limited":
      return "ちょっと はやすぎるみたい。少し おちついてね";
    case "webhook_not_configured":
      return "いま そうしんを せってい中…もう少し待ってね";
    case "webhook_post_failed":
    case "webhook_post_error":
      return "Discord に とどかなかったみたい";
    case "not_authenticated":
      return "ログインの じかんが きれたみたい。もういちど ログインしてね";
    default:
      return `そうしん しっぱい (${status})`;
  }
}
