const CACHE_NAME = 'bambu-dash-v453';
const PRECACHE = [
  '/',
  '/css/main.css',
  '/css/components.css',
  '/css/responsive.css',
  '/js/theme.js',
  '/js/i18n.js',
  '/js/state.js',
  '/js/app.js',
  '/js/interactions.js',
  '/js/components/queue-panel.js',
  '/js/components/queue-wrapper.js',
  '/js/components/scheduler-panel.js',
  '/js/components/filament-ring.js',
  '/js/components/countdown-timer.js',
  '/js/components/active-filament.js',
  '/js/components/ams-panel.js',
  '/assets/favicon.svg'
];

// Offline fallback page
const OFFLINE_HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>3DPrintForge — Offline</title>
<style>
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0a0e27;color:#c8d6e5;font-family:system-ui,sans-serif}
  .offline{text-align:center;padding:2rem}
  .offline h1{font-size:1.5rem;color:#00d4ff;margin-bottom:1rem}
  .offline p{opacity:0.7;margin-bottom:1.5rem}
  .offline button{background:#00d4ff;color:#0a0e27;border:none;padding:0.6rem 1.5rem;border-radius:6px;cursor:pointer;font-weight:600}
</style></head><body>
<div class="offline">
  <h1>3DPrintForge</h1>
  <p>You are currently offline. Some features may be unavailable.</p>
  <button onclick="location.reload()">Retry</button>
</div>
</body></html>`;

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    // Drop every old cache (a stale SW may have cached /v2 before we started
    // bypassing it) and take control of open tabs.
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
    // Force-reload any tab this SW just took over, so users stuck on a stale
    // bundle see the fresh app immediately after a single reload instead of
    // needing a second one. Runs only when the SW version actually changes.
    const clients = await self.clients.matchAll({ type: 'window' });
    for (const client of clients) {
      try { if ('navigate' in client) await client.navigate(client.url); } catch { /* ignore */ }
    }
  })());
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Skip non-GET, API, WebSocket, docs, lang, and the /v2 app (always fresh).
  // /v2 is a self-contained Vite build with content-hashed assets — letting the
  // SW cache it is what left users staring at a stale dashboard, so bypass it.
  if (e.request.method !== 'GET' || url.pathname.startsWith('/api/') || url.pathname.startsWith('/docs/') || url.pathname.startsWith('/lang/') || url.pathname.startsWith('/v2') || url.protocol === 'ws:' || url.protocol === 'wss:') {
    return;
  }

  // Network-first for EVERYTHING — always serve fresh content
  // Falls back to cache only when offline
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok) {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
      }
      return res;
    }).catch(() => {
      return caches.match(e.request).then(cached => {
        if (cached) return cached;
        // HTML fallback for offline
        if (e.request.headers.get('accept')?.includes('text/html')) {
          return new Response(OFFLINE_HTML, { headers: { 'Content-Type': 'text/html' } });
        }
        return new Response('', { status: 503 });
      });
    })
  );
});

// ── Push Notifications ──
self.addEventListener('push', (e) => {
  const data = e.data?.json?.() || { title: '3DPrintForge', body: 'Notification' };
  e.waitUntil(self.registration.showNotification(data.title || '3DPrintForge', {
    body: data.body || '',
    icon: '/assets/icon-192.png',
    badge: '/assets/favicon.svg',
    tag: data.tag || 'default',
    data: { url: data.url || '/' },
    actions: data.actions || [],
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = e.notification.data?.url || '/';
  e.waitUntil(clients.matchAll({ type: 'window' }).then(list => {
    for (const c of list) { if (c.url.includes(url) && 'focus' in c) return c.focus(); }
    return clients.openWindow(url);
  }));
});
