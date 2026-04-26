const CHAT_API_BASE =
  process.env.NEXT_PUBLIC_CHAT_API_BASE ?? "https://chat.latent-bridge.com";

export type StampStatus = {
  total_stamps: number;
  card_size: number;
  today_claimed: boolean;
  today_in_jst: string;
};

export type StampClaimResult = {
  granted: boolean;
  total_stamps: number;
  card_size: number;
  completed_card: boolean;
};

export async function fetchStampStatus(): Promise<StampStatus | null> {
  try {
    const res = await fetch(`${CHAT_API_BASE}/stamp/me`, {
      credentials: "include",
    });
    if (res.status !== 200) return null;
    return (await res.json()) as StampStatus;
  } catch {
    return null;
  }
}

export async function claimStamp(): Promise<StampClaimResult | null> {
  try {
    const res = await fetch(`${CHAT_API_BASE}/stamp/claim`, {
      method: "POST",
      credentials: "include",
    });
    if (res.status !== 200) return null;
    return (await res.json()) as StampClaimResult;
  } catch {
    return null;
  }
}

// Card-local position of the stamp that was just granted. For total_stamps=8
// and card_size=7, the just-stamped slot is position 0 of card 1. The slots
// 0..(slotIndex-1) on the same card were already filled before this claim.
export function deriveCardLayout(totalStamps: number, cardSize: number) {
  const safeTotal = Math.max(0, totalStamps);
  if (safeTotal === 0) {
    return { cardIndex: 0, slotIndex: 0, alreadyFilled: 0 };
  }
  const cardIndex = Math.floor((safeTotal - 1) / cardSize);
  const slotIndex = (safeTotal - 1) % cardSize;
  return { cardIndex, slotIndex, alreadyFilled: slotIndex };
}
