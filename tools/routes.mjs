// Danh sách trang của Graviti Stars để dựng sẵn (mỗi trang một tệp index.html), dùng chung cho
// tools/build.mjs (đóng gói) và tools/serve.mjs (chạy thử trên máy).
//
// Vì sao dựng sẵn: web là tệp tĩnh. Mở thẳng gravitispace.com/stars/tarot/major-17/ thì máy chủ phải có
// tệp stars/tarot/major-17/index.html. Có tệp thật → không cần máy chủ chạy mã, chạy được cả trên GitHub Pages,
// và Google đọc được từng lá bài, từng cung như một trang riêng.
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

/** Đường dẫn của mọi trang (không có trang chủ ''): trang cố định + 78 lá bài + 12 cung + 12 con giáp + bài có sẵn. */
export async function appRoutes(webDir) {
  const data = (f) => import(pathToFileURL(join(webDir, 'assets', 'js', 'data', f)).href);
  const [{ DECK }, { SIGNS }, { CHI }, { SEED_POSTS }] = await Promise.all([data('tarot.js'), data('zodiac.js'), data('tuvi.js'), data('posts.js')]);
  return [
    'tim', 'tarot', 'chiem-tinh', 'chiem-tinh/ban-do-sao', 'tu-vi', 'tu-vi/la-so', 'ban-menh', 'gieo', 'tu', 'bai', 've', 'tai-khoan',
    ...DECK.map((c) => `tarot/${c.id}`),
    ...SIGNS.map((s) => `chiem-tinh/${s.id}`),
    ...CHI.map((c) => `tu-vi/${c.id}`),
    ...SEED_POSTS.map((p) => `bai/${p.id}`),
  ];
}

/**
 * Trang nằm sâu `depth` thư mục so với gốc ứng dụng → thêm "../" vào mọi đường dẫn tương đối (CSS, JS, ảnh, link).
 * Không đụng tới: địa chỉ đầy đủ (https:), đường dẫn gốc (/), neo (#i-star của biểu tượng SVG), data:.
 * Phải giống hàm cùng tên trong web/sw.js (bản dùng khi mất mạng). tests/routes.test.mjs kiểm tra.
 */
export function rewriteForDepth(html, depth) {
  if (!depth) return html;
  const up = '../'.repeat(depth);
  return html.replace(/\b(src|href)="(?![a-z][a-z0-9+.-]*:|\/|#)([^"]*)"/gi, (_, attr, v) => `${attr}="${up}${v === './' ? '' : v}"`);
}
