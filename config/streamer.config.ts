export const streamerConfig = {
  name: "ruru",
  handle: "KOTARURU0603",
  bio: "FPSやってる。たまにチル。よろしく。",
  brandColor: "#a3ffd6",

  platforms: {
    youtube: {
      // ruru の YouTube チャンネル (@ruru-s2w)
      channelId: "UCeBVt3YhxXAPqLM7fQT6qRw",
      // 配信中の動画ID。Phase 1.5 のスクリプトで上書き想定。
      // 現状はデモとして Lofi Girl の常時ライブを利用。
      liveVideoId: "jfKfPfyJRdk",
    },
  },

  donate: {
    enabled: false,
    presetAmounts: [500, 1000, 3000, 5000],
  },
};

export type StreamerConfig = typeof streamerConfig;
