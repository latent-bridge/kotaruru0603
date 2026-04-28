// Service worker: handles Web Push for live-start notifications.
// Fetch is pass-through (no offline caching yet — that's β scope).

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', () => {
  // Pass-through; defining the listener (even no-op) is required for
  // Chrome's installability heuristic.
});

// Live-start push payload format (chat-api -> here):
//   { title, body, icon, badge, url }
self.addEventListener('push', (event) => {
  if (!event.data) return;
  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: 'お知らせ', body: event.data.text() };
  }
  const title = data.title || 'お知らせ';
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || '',
      icon: data.icon || '/icons/usa-192.png',
      badge: data.badge || '/icons/usa-192.png',
      data: { url: data.url || '/' },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';
  event.waitUntil(
    (async () => {
      const all = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });
      // Focus an existing tab if it's already on the target page.
      for (const client of all) {
        const url = new URL(client.url);
        if (url.pathname === targetUrl || url.pathname === targetUrl + '/') {
          return client.focus();
        }
      }
      // Otherwise open a new window/tab at the target.
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })(),
  );
});
