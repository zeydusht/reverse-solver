/* Reverse Solver — offline destegi
   Network-first: internet varsa her zaman en yeni surumu alir, boylece
   GitHub'a yeni bir surum yuklendiginde testciler eskisinde kalmaz.
   Internet yoksa onbellekten acar. */

const CACHE = 'reverse-solver-v1';
const FILES = ['./', './index.html', './config.js',
               './icon-180.png', './icon-192.png', './icon-512.png',
               './icon-maskable.png', './manifest.json'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES).catch(() => {})));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks =>
    Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;  // let Supabase through
  e.respondWith(
    fetch(e.request)
      .then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return r;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
