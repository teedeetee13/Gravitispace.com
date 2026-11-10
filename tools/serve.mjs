// Máy chủ chạy thử trên máy: npm start → http://localhost:5190
// Chỉ dùng Node có sẵn (không thư viện). Khác "python -m http.server" ở hai điểm:
//   1. Gửi "Cache-Control: no-store" → trình duyệt luôn lấy tệp mới nhất, không trộn tệp JS cũ với tệp mới.
//   2. Chỉ phục vụ thư mục web/, chặn mọi đường dẫn thoát ra ngoài (../), chỉ lắng nghe trên máy này (127.0.0.1).
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, normalize, extname, resolve, sep, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'web');
const PORT = Number(process.env.PORT) || 5190;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8', '.md': 'text/plain; charset=utf-8', '.woff2': 'font/woff2',
};

const server = createServer(async (req, res) => {
  const send = (code, body, type = 'text/plain; charset=utf-8') => {
    res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(body);
  };
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(405, 'Method Not Allowed');
  let path;
  try {
    path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    return send(400, 'Bad Request');
  }
  let file = normalize(join(ROOT, path));
  if (file !== ROOT && !file.startsWith(ROOT + sep)) return send(403, 'Forbidden');
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    const body = await readFile(file);
    send(200, req.method === 'HEAD' ? '' : body, TYPES[extname(file).toLowerCase()] || 'application/octet-stream');
  } catch {
    try {
      send(404, await readFile(join(ROOT, '404.html')), TYPES['.html']);
    } catch {
      send(404, 'Not Found');
    }
  }
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') console.error(`Cổng ${PORT} đang có chương trình khác dùng. Thử: PORT=5191 npm start`);
  else console.error(e.message);
  process.exit(1);
});
server.listen(PORT, '127.0.0.1', () => console.log(`An Sao Space chạy thử tại http://localhost:${PORT}  (Ctrl+C để dừng)`));
