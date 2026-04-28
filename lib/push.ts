// Web Push subscription helpers for the "しらせて" button.
// Pure browser-side; chat-api endpoints are at ${CHAT_API_BASE}/push/*.

const CHAT_API_BASE =
  process.env.NEXT_PUBLIC_CHAT_API_BASE ?? "https://chat.latent-bridge.com";

export type PushSupport = {
  // Browser exposes Push API + Service Worker — necessary but not sufficient.
  apiAvailable: boolean;
  // Currently running as an installed PWA. iOS only delivers push to standalone
  // installs; on iOS Safari (non-standalone) Push API is exposed but subscribe
  // fails or is silently dropped.
  isStandalone: boolean;
  isIOS: boolean;
  // Composite: can we actually attempt subscribe right now?
  canSubscribe: boolean;
};

export function detectPushSupport(): PushSupport {
  if (typeof window === "undefined") {
    return {
      apiAvailable: false,
      isStandalone: false,
      isIOS: false,
      canSubscribe: false,
    };
  }
  const apiAvailable =
    "serviceWorker" in navigator && "PushManager" in window;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    // Older iOS uses the non-standard navigator.standalone property.
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  // iOS without standalone can't actually receive pushes — surface that as
  // "can't subscribe" so the UI shows the install hint instead of failing.
  const canSubscribe = apiAvailable && (!isIOS || isStandalone);
  return { apiAvailable, isStandalone, isIOS, canSubscribe };
}

// VAPID keys are returned as URL-safe base64 by chat-api; PushManager needs a
// Uint8Array. Pads the input back up to a multiple of 4 and decodes.
function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const normalized = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(normalized);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

async function fetchVapidPublicKey(): Promise<string> {
  const res = await fetch(`${CHAT_API_BASE}/push/vapid-public-key`);
  if (!res.ok) throw new Error(`vapid_key_fetch_${res.status}`);
  const data = (await res.json()) as { key?: string };
  if (!data.key) throw new Error("vapid_key_empty");
  return data.key;
}

async function getRegistration(): Promise<ServiceWorkerRegistration> {
  const reg = await navigator.serviceWorker.ready;
  if (!reg) throw new Error("sw_not_ready");
  return reg;
}

export async function getCurrentSubscription(): Promise<PushSubscription | null> {
  if (typeof window === "undefined") return null;
  const support = detectPushSupport();
  if (!support.apiAvailable) return null;
  try {
    const reg = await getRegistration();
    return await reg.pushManager.getSubscription();
  } catch {
    return null;
  }
}

// Returns "granted" | "denied" | "default" | "unsupported".
export function getPermissionState(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
}

export type SubscribeResult =
  | { ok: true; subscription: PushSubscription }
  | { ok: false; reason: "unsupported" | "needs_install" | "denied" | "error"; message?: string };

export async function subscribe(siteId: string): Promise<SubscribeResult> {
  const support = detectPushSupport();
  if (!support.apiAvailable) return { ok: false, reason: "unsupported" };
  if (support.isIOS && !support.isStandalone) {
    return { ok: false, reason: "needs_install" };
  }

  // Permission may already be granted (re-subscribe flow) or default (first
  // time). requestPermission is a no-op when already granted/denied.
  const permission = await Notification.requestPermission();
  if (permission === "denied") {
    return { ok: false, reason: "denied" };
  }
  if (permission !== "granted") {
    return { ok: false, reason: "denied" };
  }

  try {
    const vapid = await fetchVapidPublicKey();
    const reg = await getRegistration();
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      // The TS DOM lib types narrow this to Uint8Array<ArrayBuffer>; our
      // helper returns Uint8Array<ArrayBufferLike> which is structurally
      // identical for the runtime call, so widen via BufferSource.
      applicationServerKey: urlBase64ToUint8Array(vapid) as BufferSource,
    });
    const res = await fetch(`${CHAT_API_BASE}/push/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        subscription: subscription.toJSON(),
        site_id: siteId,
      }),
    });
    if (!res.ok) {
      // Roll back the browser-side subscription so we don't end up with a
      // subscription the server doesn't know about.
      await subscription.unsubscribe().catch(() => {});
      return { ok: false, reason: "error", message: `server_${res.status}` };
    }
    return { ok: true, subscription };
  } catch (err) {
    return {
      ok: false,
      reason: "error",
      message: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function unsubscribe(): Promise<boolean> {
  const sub = await getCurrentSubscription();
  if (!sub) return true;
  // Tell server first so we don't get out-of-sync if browser unsubscribe
  // fails mid-way.
  await fetch(`${CHAT_API_BASE}/push/unsubscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ endpoint: sub.endpoint }),
  }).catch(() => {});
  try {
    await sub.unsubscribe();
    return true;
  } catch {
    return false;
  }
}
