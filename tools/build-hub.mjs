// Phần trang chính của bản dựng: hub/ → gốc dist/ (gọi từ tools/build.mjs, sau khi Graviti Stars đã vào dist/stars/).
// Việc làm:
//  1. Chép hub/ vào gốc dist/. Thư mục admin/ CHỈ được chép khi dựng với --admin: bản công khai (GitHub Pages)
//     không có trang quản trị; bản Cloudflare có, và Cloudflare Access chặn người lạ ngay ở cổng.
//  2. Khi có admin: sinh admin/stats.json từ mã Graviti Stars (web/) — số bài mẫu, lá bài, ngôn ngữ, độ phủ bản dịch,
//     dung lượng tải đầu, Supabase đã bật chưa. Số liệu chỉ nằm sau cổng quản trị.
//  3. Kiểm tra mọi import / src / href nội bộ của các tệp vừa chép trỏ tới tệp có thật.
//  4. Ghi build-info.json ở gốc.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'hub');
const WEB = join(ROOT, 'web');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const safe = (fn) => { try { return fn(); } catch { return ''; } };
const sha = (process.env.GITHUB_SHA || safe(() => execSync('git rev-parse HEAD', { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()) || 'local').slice(0, 7);
const walk = (dir) => readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const posix = (p) => p.split(sep).join('/');
const load = async (rel) => import(pathToFileURL(join(WEB, rel)).href);

/** Số liệu nội dung của Graviti Stars, tính từ chính mã nguồn. Xuất riêng để kiểm thử dùng lại. */
export async function collectStats() {
  const [{ SEED_POSTS }, { TOPICS }, { DECK, SPREADS }, { SIGNS }, { STARS }, { LANGS }, { CONFIG }, enContent] = await Promise.all([
    load('assets/js/data/posts.js'), load('assets/js/data/taxonomy.js'), load('assets/js/data/tarot.js'), load('assets/js/data/zodiac.js'),
    load('assets/js/data/tuvi-stars.js'), load('assets/js/i18n/langs.js'), load('assets/js/config.js'), load('assets/js/i18n/en-content.js'),
  ]);
  const vi = (await load('assets/js/i18n/vi.js')).default;
  const viKeys = Object.keys(vi);
  const langs = [];
  for (const l of LANGS) {
    const dict = l.code === 'vi' ? vi : (await load(`assets/js/i18n/${l.code}.js`)).default;
    const have = viKeys.filter((k) => typeof dict[k] === 'string' && dict[k].trim()).length;
    langs.push({ code: l.code, native: l.native, coverage: Math.floor((have / viKeys.length) * 1000) / 10 });
  }
  const files = walk(WEB);
  const firstLoad = files.filter((f) => /index\.html$|\.css$/.test(f) || (f.endsWith('.js') && !f.includes(`${sep}i18n${sep}`))).reduce((n, f) => n + statSync(f).size, 0);
  return {
    version: pkg.version,
    commit: sha,
    builtAt: new Date().toISOString(),
    cloud: !!(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY),
    posts: {
      total: SEED_POSTS.length,
      byTopic: TOPICS.map((tp) => ({ id: tp.id, label: { vi: tp.label, en: enContent.default.topic?.[tp.id]?.label || tp.label }, count: SEED_POSTS.filter((p) => p.topic === tp.id).length })),
    },
    cards: DECK.length,
    spreads: SPREADS.length,
    signs: SIGNS.length,
    tuviStars: Object.keys(STARS).length,
    langs,
    firstLoadKB: Math.round(firstLoad / 1024),
  };
}

export async function buildHub(out, { admin = false } = {}) {
  // 1. Chép
  const copied = [];
  for (const f of walk(SRC)) {
    const parts = relative(SRC, f).split(sep);
    if (parts.some((p) => p.startsWith('.'))) continue;
    if (parts[0] === 'admin' && !admin) continue;
    const to = join(out, relative(SRC, f));
    mkdirSync(dirname(to), { recursive: true });
    copyFileSync(f, to);
    copied.push(to);
  }

  // 2. Số liệu (chỉ khi có trang quản trị)
  if (admin) {
    const stats = await collectStats();
    writeFileSync(join(out, 'admin', 'stats.json'), JSON.stringify(stats, null, 2) + '\n');
  }

  // 3. Kiểm tra đường dẫn
  const problems = [];
  for (const f of copied) {
    if (f.endsWith('.js')) {
      const src = readFileSync(f, 'utf8');
      for (const m of src.matchAll(/(?:import\s[^'"]*?from\s*|import\(\s*)['"](\.{1,2}\/[^'"]+)['"]/g)) if (!existsSync(join(dirname(f), m[1]))) problems.push(`${posix(relative(out, f))} → ${m[1]}`);
    }
    if (f.endsWith('.html')) {
      const src = readFileSync(f, 'utf8');
      for (const m of src.matchAll(/(?:src|href)="((?!https?:|#|data:|\/|mailto:)[^"]+)"/g)) {
        if (!existsSync(join(dirname(f), m[1].split(/[?#]/)[0]))) problems.push(`${posix(relative(out, f))} → ${m[1]}`);
      }
    }
  }
  if (problems.length) {
    throw new Error('Đường dẫn hỏng (trang chính):\n  ' + problems.join('\n  '));
  }

  // 4. Thông tin bản dựng
  writeFileSync(join(out, 'build-info.json'), JSON.stringify({ name: 'graviti', version: pkg.version, commit: sha, builtAt: new Date().toISOString(), admin }, null, 2) + '\n');
  const kb = (copied.reduce((n, f) => n + statSync(f).size, 0) / 1024).toFixed(0);
  console.log(`Trang chính Graviti → dist/  ${copied.length} tệp, ${kb} KB · trang quản trị: ${admin ? 'CÓ (cần Cloudflare Access chặn /admin/)' : 'không có (bản công khai)'}`);
}
