// Dugga Dekha Service Worker
const CACHE_NAME = 'dugga-dekha-v2';

const STATIC_PRECACHE = [
  '/offline',
  '/manifest.json',
  '/app-icon.png',
  '/logo-dd.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-512x512-maskable.png',
  '/icons/apple-touch-icon.png',
  '/favicon.ico',
];

// Install: Cache essential shell & offline fallback
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_PRECACHE))
      .then(() => self.skipWaiting())
      .catch((err) => {
        console.warn('[Dugga Dekha SW] Pre-cache failed:', err);
      })
  );
});

// Activate: Clean up old caches & take control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch: Strategy depending on request type
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // 1. MAP TILES & EXTERNAL MAP APIS: NETWORK ONLY (NO CACHING)
  // Per requirement 10 & 11: Do NOT cache or bulk-download OpenStreetMap tiles
  if (
    url.hostname.includes('tile.openstreetmap.org') ||
    url.hostname.includes('openstreetmap') ||
    url.hostname.includes('unpkg.com')
  ) {
    event.respondWith(fetch(request));
    return;
  }

  // 2. NAVIGATION REQUESTS (HTML Pages)
  // Try network first; fallback to cached /offline page if network fails
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const fallback = await cache.match('/offline');
        if (fallback) return fallback;
        return new Response(
          '<!DOCTYPE html><html><head><title>Offline</title></head><body><h1>Offline</h1></body></html>',
          { status: 503, headers: { 'Content-Type': 'text/html' } }
        );
      })
    );
    return;
  }

  // 3. STATIC NEXT.JS ASSETS & IMAGES (_next/static, public images/icons)
  // Stale-while-revalidate or Network-first
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname === '/logo-dd.png'
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 4. ALL OTHER REQUESTS: Network-first
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
