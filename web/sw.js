// Service worker: cho phép mở lại Graviti Stars khi mất mạng.
// Chiến lược "mạng trước, bộ nhớ đệm sau" cho tệp cùng nguồn: luôn lấy bản mới nhất khi có mạng,
// chỉ dùng bản đã lưu khi offline → không bao giờ kẹt ở phiên bản cũ.
const CACHE = 'ansao-v6'; // npm run build tự thay bằng ansao-<phiên bản>-<commit>
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
    // "no-cache": luôn hỏi lại máy chủ (rẻ, chỉ nhận 304 nếu tệp không đổi) → không bao giờ trộn tệp cũ với tệp mới
    fetch(sameOrigin ? new Request(req, { cache: 'no-cache' }) : req)
      .then((res) => {
        if (res.ok || res.type === 'opaque') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || (req.mode === 'navigate' ? offlinePage(url) : Response.error())))
  );
});

// Mất mạng, mở một trang chưa từng xem (vd. /stars/tarot/major-5/): lấy index.html đã lưu,
// sửa đường dẫn tương đối theo độ sâu của trang. Giống rewriteForDepth trong tools/routes.mjs.
function rewriteForDepth(html, depth) {
  if (!depth) return html;
  const up = '../'.repeat(depth);
  return html.replace(/\b(src|href)="(?![a-z][a-z0-9+.-]*:|\/|#)([^"]*)"/gi, (_, attr, v) => `${attr}="${up}${v === './' ? '' : v}"`);
}
async function offlinePage(url) {
  const res = await caches.match('./index.html');
  if (!res) return Response.error();
  const scope = new URL('./', self.location).pathname;
  const rest = url.pathname.startsWith(scope) ? url.pathname.slice(scope.length) : '';
  const depth = (rest.match(/\//g) || []).length;
  return new Response(rewriteForDepth(await res.text(), depth), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
