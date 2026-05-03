// Minimale service worker zodat Land van Leren installeerbaar is als PWA
// en blijft werken zonder verbinding (na de eerste keer laden).
// Strategie: network-first voor alles, cache-fallback bij offline.
// /api/* wordt nooit gecached (vragen moeten vers zijn).

const CACHE = "lvl-static-v1";
const PRECACHE = ["/", "/index.html", "/icon.svg", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(req, clone)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req).then((c) => c || caches.match("/index.html")))
  );
});
