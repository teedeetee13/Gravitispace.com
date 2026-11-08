// Service worker: cho phép mở lại An Sao Space khi mất mạng.
// Chiến lược "mạng trước, bộ nhớ đệm sau" cho tệp cùng nguồn: luôn lấy bản mới nhất khi có mạng,
// chỉ dùng bản đã lưu khi offline → không bao giờ kẹt ở phiên bản cũ.
const CACHE = 'ansao-v5'; // npm run build tự thay bằng ansao-<phiên bản>-<commit>
const CORE = ['./', './index.html', './assets/css/style.css', './assets/js/main.js', './assets/js/boot.js', './assets/favicon.svg', './manifest.webmanifest'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!sameOrigin && !isFont) return;

  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok || res.type === 'opaque') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error())))
  );
});
