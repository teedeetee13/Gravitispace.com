// Kiểm thử bảo mật tĩnh — chạy trong CI trước mỗi lần đăng web. Không cần mạng, không thư viện.
//  - Chính sách bảo mật nội dung (CSP) đủ chặt, không có mã nội tuyến trong trang chính.
//  - Không có eval / new Function / document.write; mọi liên kết mở tab mới đều có rel="noopener".
//  - Không lộ khoá bí mật (service_role của Supabase, khoá riêng tư, token GitHub…).
//  - Lược đồ CSDL: mọi bảng bật Row Level Security, ngôn ngữ bài viết khớp danh mục.
//  - Tệp tiêu đề bảo mật (_headers) cho máy chủ hỗ trợ (Netlify / Cloudflare Pages).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LANGS } from '../web/assets/js/i18n/langs.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WEB = join(ROOT, 'web');
const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    if (['node_modules', '.git', 'dist', '.claude'].includes(f)) return [];
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
const textFiles = (dir) => walk(dir).filter((f) => /\.(js|mjs|html|css|json|webmanifest|md|sql|yml|yaml|txt)$/.test(f));

test('CSP: chỉ chạy script cùng nguồn, cấm object, giới hạn base-uri và form-action', () => {
  const html = readFileSync(join(WEB, 'index.html'), 'utf8');
  const csp = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1];
  assert.ok(csp, 'thiếu CSP');
  const dir = Object.fromEntries(csp.split(';').map((d) => d.trim().split(/\s+/)).map(([k, ...v]) => [k, v]));
  assert.deepEqual(dir['script-src'], ["'self'"], 'script-src chỉ được là self');
  assert.deepEqual(dir['object-src'], ["'none'"]);
  assert.deepEqual(dir['base-uri'], ["'self'"]);
  assert.deepEqual(dir['form-action'], ["'self'"]);
  assert.ok(!csp.includes('unsafe-eval'), 'không được unsafe-eval');
  assert.ok(!/script-src[^;]*\*/.test(csp), 'script-src không được có *');
});

test('Trang chính không có <script> nội tuyến và không có thuộc tính onXxx=', () => {
  const html = readFileSync(join(WEB, 'index.html'), 'utf8');
  const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>/g)];
  assert.equal(inline.length, 0, 'có script nội tuyến');
  assert.ok(!/\son[a-z]+\s*=/i.test(html), 'có trình xử lý sự kiện nội tuyến');
});

test('Mã nguồn không dùng eval, new Function, document.write, setTimeout chuỗi', () => {
  for (const f of walk(join(WEB, 'assets', 'js')).filter((x) => x.endsWith('.js'))) {
    const src = readFileSync(f, 'utf8');
    assert.ok(!/\beval\s*\(|new Function\s*\(|document\.write\s*\(|setTimeout\s*\(\s*['"`]/.test(src), relative(ROOT, f));
  }
});

test('Liên kết mở tab mới luôn có rel="noopener noreferrer"', () => {
  for (const f of [join(WEB, 'index.html'), ...walk(join(WEB, 'assets', 'js')).filter((x) => x.endsWith('.js'))]) {
    const src = readFileSync(f, 'utf8');
    for (const m of src.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) assert.match(m[0], /rel="noopener noreferrer"/, `${relative(ROOT, f)}: ${m[0]}`);
  }
});

test('Không lộ khoá bí mật trong kho mã', () => {
  const patterns = [
    [/service_role/i, (f) => !/\.(md|sql)$/.test(f) && !f.endsWith('security.test.mjs') && !f.endsWith('config.js')],
    [/-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/, () => true],
    [/\bgh[pousr]_[A-Za-z0-9]{36,}\b/, () => true],
    [/\bsk_(live|test)_[A-Za-z0-9]{16,}/, () => true],
    [/\bAKIA[0-9A-Z]{16}\b/, () => true],
  ];
  for (const f of textFiles(ROOT)) {
    const src = readFileSync(f, 'utf8');
    for (const [re, applies] of patterns) if (applies(f)) assert.ok(!re.test(src), `${relative(ROOT, f)} khớp ${re}`);
  }
  // Khoá Supabase trong config.js (nếu điền) phải là khoá anon, không phải service_role
  const cfg = readFileSync(join(WEB, 'assets', 'js', 'config.js'), 'utf8');
  const key = cfg.match(/SUPABASE_ANON_KEY:\s*'([^']*)'/)?.[1] || '';
  if (key.split('.').length === 3) {
    const payload = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString('utf8'));
    assert.notEqual(payload.role, 'service_role', 'TUYỆT ĐỐI không dán khoá service_role vào web');
  }
  if (key.startsWith('sb_secret_')) assert.fail('TUYỆT ĐỐI không dán khoá bí mật (sb_secret_) vào web');
});

test('CSDL: mọi bảng bật Row Level Security; ngôn ngữ bài viết khớp danh mục', () => {
  const sql = readFileSync(join(ROOT, 'supabase', 'schema.sql'), 'utf8');
  const tables = [...sql.matchAll(/create table if not exists (public\.\w+)/g)].map((m) => m[1]);
  assert.ok(tables.length >= 2);
  for (const t of tables) assert.ok(sql.includes(`alter table ${t} enable row level security`), `${t} chưa bật RLS`);
  const langs = sql.match(/posts_lang_check check \(lang in \(([^)]+)\)\)/)?.[1].match(/'(\w+)'/g).map((s) => s.slice(1, -1));
  assert.deepEqual(langs?.sort(), LANGS.map((l) => l.code).sort());
  // hàm security definer phải cố định search_path để tránh chiếm quyền qua schema giả
  for (const m of sql.matchAll(/security definer([\s\S]*?)as \$\$/g)) assert.match(m[1], /set search_path = ''/);
});

test('Tệp _headers khai báo đủ tiêu đề bảo mật cho máy chủ hỗ trợ', () => {
  const p = join(WEB, '_headers');
  assert.ok(existsSync(p));
  const h = readFileSync(p, 'utf8');
  for (const need of ['Strict-Transport-Security', 'X-Content-Type-Options: nosniff', 'Referrer-Policy', 'Permissions-Policy', "frame-ancestors 'none'", 'X-Frame-Options: DENY'])
    assert.ok(h.includes(need), need);
});
