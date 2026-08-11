/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

/**
 * Service worker for bryzek.com, added so the trip app opens with no signal —
 * Varenna and Praiano both have patchy service, and the Athens–Paros ferry has
 * none at all.
 *
 * It is deliberately narrow. A service worker is the one thing that can wedge a
 * site for a returning visitor, so this one only ever serves from cache what is
 * safe to serve from cache:
 *
 *   - content-hashed build assets, which can never go stale by construction
 *   - static files (fonts, icons)
 *   - the trip app's own prerendered shells
 *
 * Every other request — including HTML for the rest of the site — goes to the
 * network untouched. A blog post is never served from a stale cache.
 */

const sw = self as unknown as ServiceWorkerGlobalScope;

const CACHE = `bryzek-${version}`;
const PRECACHE = [...build, ...files];

const TRIP_PREFIX = '/trips/';

sw.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      // Take over immediately rather than waiting for every tab to close;
      // otherwise the first visit that installs the worker gets no benefit from
      // it, which for a trip app means the flight you installed it for.
      .then(() => sw.skipWaiting())
  );
});

sw.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => sw.clients.claim())
  );
});

sw.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== sw.location.origin) return;

  // The API is never cached: a stale itinerary that looks live is worse than a
  // visible failure, and the client keeps its own copy in localStorage anyway.
  if (url.pathname.includes('/api/')) return;

  const isPrecached = PRECACHE.includes(url.pathname);
  const isTripShell = url.pathname.startsWith(TRIP_PREFIX);

  if (!isPrecached && !isTripShell) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);

      // Hashed assets are immutable — cache wins, no revalidation needed.
      if (isPrecached) {
        const hit = await cache.match(url.pathname);
        if (hit) return hit;
      }

      try {
        const response = await fetch(request);
        // Opaque and error responses are not worth keeping; caching a 404 shell
        // would persist the failure past the outage that caused it.
        if (response.ok && response.status === 200) {
          cache.put(request, response.clone());
        }
        return response;
      } catch {
        const hit = await cache.match(request);
        if (hit) return hit;
        throw new Error('Offline and not cached');
      }
    })()
  );
});
