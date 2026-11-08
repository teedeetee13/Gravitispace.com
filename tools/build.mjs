// Đóng gói bản phát hành: web/ → dist/ (không thư viện ngoài, chỉ Node.js ≥ 20).
//   npm run build
// Việc làm:
//  1. Chép web/ sang dist/ (bỏ tệp ẩn, tệp nháp _dev*).
//  2. Đóng dấu phiên bản: APP_VERSION trong config.js lấy từ package.json; tên bộ nhớ đệm của service worker
//     gắn phiên bản + mã commit → mỗi lần phát hành, người dùng chắc chắn nhận bản mới, không kẹt bản cũ.
//  3. Kiểm tra mọi import / đường dẫn tài nguyên trong mã đều trỏ tới tệp có thật (chống "trắng trang" sau khi đăng).
//  4. Ghi build-info.json (phiên bản, commit, thời điểm) và SHA256SUMS.txt (dấu vân tay từng tệp để đối chiếu khi bàn giao).
//  5. Báo dung lượng từng nhóm tệp; vượt ngân sách hiệu năng thì dừng với mã lỗi.
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, statSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'web');
const OUT = join(ROOT, 'dist');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const sha = (process.env.GITHUB_SHA || safe(() => execSync('git rev-parse HEAD', { cwd: ROOT }).toString().trim()) || 'local').slice(0, 7);
const builtAt = new Date().toISOString();

function safe(fn) {
  try {
    return fn();
  } catch {
    return '';
  }
}
const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
const posix = (p) => p.split(sep).join('/');

// 1. Chép
rmSync(OUT, { recursive: true, force: true });
const files = walk(SRC).filter((f) => !relative(SRC, f).split(sep).some((part) => part.startsWith('.') || part.startsWith('_dev')));
for (const f of files) {
  const to = join(OUT, relative(SRC, f));
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(f, to);
}

// 2. Đóng dấu phiên bản
const cfgPath = join(OUT, 'assets', 'js', 'config.js');
writeFileSync(cfgPath, readFileSync(cfgPath, 'utf8').replace(/APP_VERSION: '[^']*'/, `APP_VERSION: '${pkg.version}'`));
const swPath = join(OUT, 'sw.js');
const sw = readFileSync(swPath, 'utf8');
if (!/const CACHE = '[^']+';/.test(sw)) throw new Error('sw.js: không tìm thấy hằng CACHE');
writeFileSync(swPath, sw.replace(/const CACHE = '[^']+';/, `const CACHE = 'ansao-${pkg.version}-${sha}';`));

// 3. Kiểm tra đường dẫn
const problems = [];
for (const f of walk(OUT).filter((x) => x.endsWith('.js'))) {
  const src = readFileSync(f, 'utf8');
  for (const m of src.matchAll(/(?:import\s[^'"]*?from\s*|import\(\s*)['"](\.{1,2}\/[^'"]+)['"]/g)) {
    if (!existsSync(join(dirname(f), m[1]))) problems.push(`${posix(relative(OUT, f))} → ${m[1]}`);
  }
}
const html = readFileSync(join(OUT, 'index.html'), 'utf8');
for (const m of html.matchAll(/(?:src|href)="((?!https?:|#|data:)[^"]+)"/g)) if (!existsSync(join(OUT, m[1]))) problems.push(`index.html → ${m[1]}`);
for (const id of readdirSync(join(OUT, 'assets', 'tarot')).length ? [] : ['tarot']) problems.push(`thiếu ảnh ${id}`);
if (problems.length) {
  console.error('Đường dẫn hỏng:\n  ' + problems.join('\n  '));
  process.exit(1);
}

// 4. Thông tin bản dựng + dấu vân tay
writeFileSync(join(OUT, 'build-info.json'), JSON.stringify({ name: pkg.name, version: pkg.version, commit: sha, builtAt }, null, 2) + '\n');
const all = walk(OUT).sort();
const sums = all.map((f) => `${createHash('sha256').update(readFileSync(f)).digest('hex')}  ${posix(relative(OUT, f))}`);
writeFileSync(join(OUT, 'SHA256SUMS.txt'), sums.join('\n') + '\n');

// 5. Ngân sách dung lượng (chưa nén). Trang đầu = khung + mã lõi; gói ngôn ngữ chỉ tải khi chọn.
const size = (filter) => all.filter(filter).reduce((n, f) => n + statSync(f).size, 0);
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
const groups = {
  'Khung + CSS': size((f) => /index\.html$|\.css$/.test(f)),
  'Mã JS (trừ gói ngôn ngữ)': size((f) => f.endsWith('.js') && !f.includes(`${sep}i18n${sep}`)),
  'Gói ngôn ngữ (tải lười)': size((f) => f.includes(`${sep}i18n${sep}`)),
  'Ảnh lá bài Tarot (tải lười)': size((f) => f.includes(`${sep}tarot${sep}`)),
  'Tổng': size(() => true),
};
const BUDGET = { 'Khung + CSS': 140 * 1024, 'Mã JS (trừ gói ngôn ngữ)': 520 * 1024 };
console.log(`An Sao Space ${pkg.version} (${sha}) → dist/  ${all.length} tệp`);
let over = false;
for (const [k, v] of Object.entries(groups)) {
  const b = BUDGET[k];
  const flag = b && v > b ? `  ⚠ vượt ngân sách ${kb(b)}` : '';
  if (flag) over = true;
  console.log(`  ${k.padEnd(28)} ${kb(v).padStart(8)}${flag}`);
}
if (over) process.exit(1);
