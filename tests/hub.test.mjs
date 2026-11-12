// Kiểm thử trang chính Graviti, trang quyền riêng tư và trang quản trị (thư mục hub/), cùng bản dựng chung.
//  1. Trang chính đủ 9 ngôn ngữ (cùng bộ khoá, cùng biến, viết đúng chữ của ngôn ngữ đó); trang quản trị đủ Việt/Anh.
//  2. Dữ liệu dịch vụ, phân môn, lộ trình, việc cần làm: mã không trùng, trạng thái hợp lệ, đủ bản dịch.
//  3. Bảo mật: CSP từng trang, không mã nội tuyến, không script ngoài; quản trị không lập chỉ mục, không giữ token;
//     _headers ở gốc khớp CSP của Graviti Stars; bản công khai KHÔNG chứa trang quản trị.
//  4. Luật Bảo vệ dữ liệu cá nhân: có trang chính sách, phiên bản khớp với ô đồng ý khi đăng ký.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync, rmSync, mkdtempSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

globalThis.localStorage ??= { getItem: () => null, setItem() {}, removeItem() {} };

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const HUB = join(ROOT, 'hub');
const DATA = await import('../hub/assets/js/data.js');
const { LANGS } = await import('../hub/assets/js/i18n/langs.js');
const ADMIN = (await import('../hub/assets/js/admin-strings.js')).default;
const { collectStats, buildHub } = await import('../tools/build-hub.mjs');
const { CONFIG } = await import('../web/assets/js/config.js');

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const read = (rel) => readFileSync(join(HUB, rel), 'utf8');
const vars = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');
const packs = Object.fromEntries(await Promise.all(LANGS.map(async (l) => [l.code, (await import(`../hub/assets/js/i18n/${l.code}.js`)).default])));
const SCRIPT = { ko: /[가-힣]/, zh: /[一-鿿]/, th: /[฀-๿]/, hi: /[ऀ-ॿ]/ };
const flat = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? flat(v, p + k + '.') : [[p + k, v]]));

test('Trang chính: 9 ngôn ngữ, cùng bộ khoá với tiếng Việt, cùng biến, không rỗng, đúng chữ viết', () => {
  assert.deepEqual(LANGS.map((l) => l.code).sort(), ['de', 'en', 'es', 'fr', 'hi', 'ko', 'th', 'vi', 'zh']);
  const base = flat(packs.vi);
  for (const l of LANGS) {
    const cur = Object.fromEntries(flat(packs[l.code]));
    assert.deepEqual(Object.keys(cur).sort(), base.map(([k]) => k).sort(), `lệch khoá: ${l.code}`);
    for (const [k, v] of base) {
      assert.ok(String(cur[k]).trim(), `rỗng: ${l.code} ${k}`);
      assert.equal(vars(cur[k]), vars(v), `lệch biến: ${l.code} ${k}`);
    }
    if (SCRIPT[l.code]) assert.match(cur['strings.home.h1'], SCRIPT[l.code], `chưa viết bằng chữ của ${l.code}`);
    if (!['vi', 'en'].includes(l.code)) assert.notEqual(cur['strings.home.lead'], packs.en.strings['home.lead'], `chưa dịch: ${l.code}`);
  }
});

test('Dữ liệu trang chính có bản dịch cho mọi mã dịch vụ, phân môn, nguyên tắc, mốc lộ trình', () => {
  for (const l of LANGS) {
    const d = packs[l.code].data;
    for (const s of DATA.SERVICES) assert.ok(d.services[s.id]?.tag && d.services[s.id]?.desc, `${l.code} services.${s.id}`);
    for (const m of DATA.STAR_MODULES) assert.ok(d.modules[m.id], `${l.code} modules.${m.id}`);
    for (const p of DATA.PRINCIPLES) assert.ok(d.principles[p]?.title && d.principles[p]?.body, `${l.code} principles.${p}`);
    for (const r of DATA.ROADMAP) assert.ok(d.roadmap[r.id], `${l.code} roadmap.${r.id}`);
  }
});

test('Mọi khoá chuỗi dùng trong HTML và JS của hub đều tồn tại', () => {
  const known = new Set([...Object.keys(packs.vi.strings), ...Object.keys(ADMIN.vi)]);
  for (const f of walk(HUB).filter((x) => /\.(html|js)$/.test(x))) {
    const src = readFileSync(f, 'utf8');
    const used = [
      ...[...src.matchAll(/data-i18n(?:-aria)?="([^"]+)"/g)].map((m) => m[1]),
      ...[...src.matchAll(/\bt\(\s*'([\w.]+)'\s*[,)]/g)].map((m) => m[1]),
      ...[...src.matchAll(/applyStrings\('([\w.]+)'(?:,\s*'([\w.]+)')?/g)].flatMap((m) => [m[1], m[2]]).filter(Boolean),
    ];
    for (const k of used) assert.ok(known.has(k), `thiếu khoá ${k} (${f.slice(HUB.length + 1)})`);
  }
  for (const s of ['live', 'next', 'idea']) assert.ok(packs.vi.strings['status.' + s]);
  for (const s of ['done', 'now', 'next', 'wait', 'later']) assert.ok(packs.vi.strings['road.' + s]);
});

test('Trang quản trị chỉ tiếng Việt và tiếng Anh, hai bản đủ khoá và cùng biến', () => {
  assert.deepEqual(Object.keys(ADMIN).sort(), ['en', 'vi']);
  assert.deepEqual(Object.keys(ADMIN.en).sort(), Object.keys(ADMIN.vi).sort());
  for (const [k, v] of Object.entries(ADMIN.vi)) assert.equal(vars(ADMIN.en[k]), vars(v), k);
  assert.match(read('assets/js/admin.js'), /pickLang\(\['vi', 'en'\]\)/);
});

test('Dữ liệu hub: mã không trùng, trạng thái hợp lệ, việc cần làm đủ Việt/Anh', () => {
  const uniq = (arr, where) => assert.equal(new Set(arr).size, arr.length, `trùng mã: ${where}`);
  uniq(DATA.SERVICES.map((s) => s.id), 'SERVICES');
  uniq(DATA.SERVICES.map((s) => s.path), 'SERVICES.path');
  for (const s of DATA.SERVICES) {
    assert.ok(['live', 'next', 'idea'].includes(s.status), s.id);
    assert.match(s.path, /^[a-z]+$/, 'đường dẫn chỉ chữ thường: ' + s.path);
    if (s.status === 'live') assert.equal(s.href, s.path + '/', 'dịch vụ đang mở trỏ tới đường dẫn của nó: ' + s.id);
  }
  for (const m of DATA.STAR_MODULES) assert.ok(['live', 'next', 'idea'].includes(m.status));
  uniq(DATA.ROADMAP.map((r) => r.id), 'ROADMAP');
  for (const r of DATA.ROADMAP) assert.ok(['done', 'now', 'next', 'wait', 'later'].includes(r.status), r.id);
  uniq(DATA.CHECKLIST.map((c) => c.id), 'CHECKLIST');
  for (const c of DATA.CHECKLIST) {
    for (const o of [c.title, c.how].filter(Boolean)) assert.ok(o.vi?.trim() && o.en?.trim(), c.id);
    if (c.auto) assert.ok(['ci', 'liveLatest', 'protected', 'deps', 'cloud'].includes(c.auto), 'kiểu tự kiểm tra lạ: ' + c.auto);
  }
  assert.match(DATA.SITE.DOMAIN, /\.com$/);
});

test('Bảo mật trang: CSP, không mã nội tuyến, không script ngoài, chống nhúng khung', () => {
  for (const f of walk(HUB).filter((x) => x.endsWith('.html'))) {
    const html = readFileSync(f, 'utf8');
    const name = f.slice(HUB.length + 1);
    if (name === '404.html') continue; // trang báo lạc đường: chỉ một đoạn chuyển hướng
    assert.match(html, /http-equiv="Content-Security-Policy"/, name);
    assert.match(html, /script-src 'self';/, name);
    assert.match(html, /object-src 'none'/, name);
    assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)[^>]*>/, 'mã nội tuyến: ' + name);
    assert.doesNotMatch(html, /<script[^>]+src="https?:/, 'script ngoài: ' + name);
    assert.match(html, /assets\/js\/boot\.js/, 'thiếu boot.js chống nhúng khung: ' + name);
  }
  assert.match(read('index.html'), /connect-src 'self';/, 'trang chính không gọi máy chủ ngoài');
});

test('Quản trị: không lập chỉ mục, chỉ gọi GitHub API, không giữ token; _headers chặn đúng nhóm trang', () => {
  const html = read('admin/index.html');
  assert.match(html, /name="robots" content="noindex, nofollow"/);
  const connect = html.match(/connect-src ([^;]+);/)[1].split(/\s+/);
  assert.ok(connect.includes('https://api.github.com'));
  assert.ok(connect.every((c) => c === "'self'" || c.startsWith('https://')), 'chỉ https');
  assert.doesNotMatch(read('assets/js/admin.js'), /Authorization|token\s*[:=]/i);
  assert.match(read('robots.txt'), /Disallow: \/admin\//);
  const headers = read('_headers').replace(/\r\n/g, '\n'); // Windows (autocrlf) đổi xuống dòng thành CRLF
  assert.match(headers, /\/admin\/\*[\s\S]*X-Robots-Tag: noindex/);
  // CSP không được đặt ở /* (sẽ cộng dồn và chặn Graviti Stars); CSP của /stars/* phải đúng bằng web/_headers
  const block = (path) => headers.split(/\n(?=\/)/).find((b) => b.startsWith(path + '\n')) || '';
  assert.doesNotMatch(block('/*'), /Content-Security-Policy/);
  const appCsp = readFileSync(join(ROOT, 'web', '_headers'), 'utf8').match(/Content-Security-Policy: (.+)/)[1].trim();
  assert.equal(block('/stars/*').match(/Content-Security-Policy: (.+)/)[1].trim(), appCsp);
});

test('Bản dựng công khai không có trang quản trị; bản --admin có, kèm số liệu', async () => {
  const pub = mkdtempSync(join(tmpdir(), 'graviti-pub-'));
  const adm = mkdtempSync(join(tmpdir(), 'graviti-adm-'));
  for (const d of [pub, adm]) mkdirSync(join(d, 'stars', 'tai-khoan'), { recursive: true }); // tools/build.mjs dựng Graviti Stars (cả trang dựng sẵn) vào đây trước
  const log = console.log;
  console.log = () => {};
  try {
    await buildHub(pub, { admin: false });
    await buildHub(adm, { admin: true });
  } finally {
    console.log = log;
  }
  assert.ok(existsSync(join(pub, 'index.html')) && existsSync(join(pub, 'privacy', 'index.html')));
  assert.ok(!existsSync(join(pub, 'admin')), 'bản công khai không được chứa /admin/');
  assert.ok(existsSync(join(adm, 'admin', 'index.html')) && existsSync(join(adm, 'admin', 'stats.json')));
  rmSync(pub, { recursive: true, force: true });
  rmSync(adm, { recursive: true, force: true });
});

test('Luật BVDLCN: có chính sách quyền riêng tư, phiên bản khớp ô đồng ý, đủ các mục bắt buộc', () => {
  const html = read('privacy/index.html');
  assert.equal(html.match(/data-policy-version>([^<]+)</)[1], CONFIG.CONSENT_VERSION);
  assert.equal(CONFIG.PRIVACY_URL, '../privacy/', 'Graviti Stars ở /stars/ → chính sách ở /privacy/');
  for (const must of ['91/2025/QH15', 'privacy@', 'Singapore', '72 giờ', 'Xoá tài khoản', 'Tải dữ liệu về', 'dưới 16 tuổi', 'không bán']) assert.ok(html.includes(must), 'thiếu: ' + must);
  assert.match(read('index.html'), /href="privacy\/"/, 'trang chính phải dẫn tới chính sách');
});

test('Số liệu nội dung khớp mã Graviti Stars', async () => {
  const s = await collectStats();
  assert.equal(s.cards, 78);
  assert.equal(s.signs, 12);
  assert.ok(s.posts.total > 0);
  assert.equal(s.posts.byTopic.reduce((n, x) => n + x.count, 0), s.posts.total);
  for (const l of s.langs) assert.equal(l.coverage, 100, 'ngôn ngữ chưa dịch đủ: ' + l.code);
  assert.equal(typeof s.cloud, 'boolean');
});
