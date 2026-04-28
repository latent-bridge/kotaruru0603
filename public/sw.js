// Minimum service worker for PWA installability (α scope).
// No caching yet — every request goes to the network. Defining a fetch
// listener (even pass-through) is required for Chrome to consider the
// site installable. Offline support will land in a later iteration.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', () => {
  // Pass-through; do not call event.respondWith().
});
