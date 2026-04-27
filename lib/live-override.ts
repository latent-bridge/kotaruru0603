"use client";

// Runtime override for the build-time live state. The static site is rebuilt
// only every few minutes; this hook lets ruru's [配信開始] click flip the page
// to LIVE NOW immediately by subscribing to chat-api's SSE event channel.
//
// On connect chat-api replays the current live state, so the override settles
// within a fraction of a second of mount.

import { useEffect, useState } from "react";
import type { Memory } from "./archive";

const API_BASE =
  process.env.NEXT_PUBLIC_CHAT_API_BASE ?? "https://chat.latent-bridge.com";
const SITE_ID = "kotaruru0603";

export type LiveOverride =
  | { status: "loading" }
  | { status: "off" }
  | { status: "on"; videoId: string };

export function useLiveOverride(): LiveOverride {
  const [state, setState] = useState<LiveOverride>({ status: "loading" });

  useEffect(() => {
    let es: EventSource | null = null;
    try {
      es = new EventSource(`${API_BASE}/public/events/${SITE_ID}`);
    } catch {
      setState({ status: "off" });
      return;
    }
    es.addEventListener("live_on", (ev) => {
      try {
        const { video_id } = JSON.parse((ev as MessageEvent).data) as {
          video_id?: string;
        };
        if (video_id) setState({ status: "on", videoId: video_id });
      } catch { /* malformed */ }
    });
    es.addEventListener("live_off", () => {
      setState({ status: "off" });
    });
    // SSE is best-effort. On error we fall back to "off" so the page renders
    // its build-time state (still correct ~99% of the time) rather than
    // hanging on "loading".
    es.onerror = () => {
      setState((s) => (s.status === "loading" ? { status: "off" } : s));
    };
    return () => es?.close();
  }, []);

  return state;
}

// Memory placeholder used when admin flips on live before the next archive
// fetch has discovered the new broadcast. Just enough fields to render the
// LiveView without crashes; richer metadata appears after the next rebuild.
export function syntheticLiveMemory(videoId: string): Memory {
  const now = new Date().toISOString();
  return {
    videoId,
    title: "ライブ配信中",
    description: "",
    publishedAt: now,
    date: now.slice(0, 10).replace(/-/g, "."),
    duration: "",
    durationSeconds: 0,
    views: "—",
    viewCount: 0,
    likeCount: null,
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
    thumbnailUrlHigh: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
    youtubeEmbedUrl: `https://www.youtube.com/embed/${videoId}`,
    wasLive: false,
    chatReplayContinuation: null,
    kind: "stream",
    category: null,
    game: null,
    collabWith: [],
    episode: null,
    tags: [],
    pinned: false,
    tone: "coral",
  };
}
