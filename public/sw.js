const CACHE_NAME = 'bambu-dash-v1';
const PRECACHE = [
  '/',
  '/css/main.css',
  '/css/components.css',
  '/css/responsive.css',
  '/js/theme.js',
  '/js/i18n.js',
  '/js/state.js',
  '/js/app.js',
  '/assets/favicon.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Skip non-GET, API, and WebSocket requests
  if (e.request.method !== 'GET' || url.pathname.startsWith('/api/') || url.protocol === 'ws:' || url.protocol === 'wss:') {
    return;
  }

  // Network-first for HTML (always fresh), cache-first for assets
  if (e.request.headers.get('accept')?.includes('text/html')) {
    e.respondWith(
      fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return res;
      }).catch(() => caches.match(e.request))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
          }
          return res;
        });
      })
    );
  }
});
