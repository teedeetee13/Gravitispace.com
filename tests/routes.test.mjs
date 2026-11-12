// Đường dẫn thật (không dấu #): tạo link, đổi link cũ, dựng sẵn trang, trang 404, service worker khi mất mạng.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { appRoutes, rewriteForDepth } from '../tools/routes.mjs';
import { ROOT, link, postLink, fromLegacyHash } from '../web/assets/js/route.js';

const DIR = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(DIR, p), 'utf8').replace(/\r\n/g, '\n'); // Windows (autocrlf)

test('link(): địa chỉ đầy đủ, có "/" cuối, giữ ?tham-số và #neo', () => {
  assert.ok(ROOT.endsWith('/web/'), 'ROOT là thư mục gốc ứng dụng');
  assert.equal(link(''), ROOT);
  assert.equal(link('/'), ROOT);
  assert.equal(link('tarot'), ROOT + 'tarot/');
  assert.equal(link('/tarot/major-17'), ROOT + 'tarot/major-17/');
  assert.equal(link('tai-khoan?che-do=dang-ky'), ROOT + 'tai-khoan/?che-do=dang-ky');
  assert.equal(link('ve#ho-tro'), ROOT + 've/#ho-tro');
  assert.equal(link('?chu-de=tarot'), ROOT + '?chu-de=tarot');
  assert.equal(postLink('hd-001'), ROOT + 'bai/hd-001/');
  assert.equal(postLink('0f3c2a9e-1111-4222-8333-444455556666'), ROOT + 'bai/?id=0f3c2a9e-1111-4222-8333-444455556666');
});

test('Link cũ có dấu # vẫn mở đúng trang mới', () => {
  assert.equal(fromLegacyHash('#/tarot/major-17'), ROOT + 'tarot/major-17/');
  assert.equal(fromLegacyHash('#/tai-khoan?che-do=dang-ky'), ROOT + 'tai-khoan/?che-do=dang-ky');
  assert.equal(fromLegacyHash('#/bai/hd-003'), ROOT + 'bai/hd-003/');
  assert.equal(fromLegacyHash('#/'), ROOT);
  assert.equal(fromLegacyHash('#access_token=abc'), null, 'không đụng vào link xác nhận email');
  assert.equal(fromLegacyHash(''), null);
});

test('Dựng sẵn: đủ trang, không trùng, mọi đường dẫn tương đối được sửa theo độ sâu', async () => {
  const routes = await appRoutes(join(DIR, 'web'));
  assert.equal(new Set(routes).size, routes.length, 'không trùng');
  assert.equal(routes.filter((r) => r.startsWith('tarot/')).length, 78);
  assert.equal(routes.filter((r) => /^chiem-tinh\/(?!ban-do-sao)/.test(r)).length, 12);
  assert.equal(routes.filter((r) => /^tu-vi\/(?!la-so)/.test(r)).length, 12);
  for (const r of routes) assert.match(r, /^[a-z0-9-]+(\/[a-z0-9-]+)?$/, r);

  const html = '<link href="assets/css/style.css"><a href="./" data-link=""><a href="tarot/"><use href="#i-star"/><a href="../privacy/"><img src="data:x"><a href="https://x.dev/">';
  assert.equal(
    rewriteForDepth(html, 2),
    '<link href="../../assets/css/style.css"><a href="../../" data-link=""><a href="../../tarot/"><use href="#i-star"/><a href="../../../privacy/"><img src="data:x"><a href="https://x.dev/">'
  );
  assert.equal(rewriteForDepth(html, 0), html);
});

test('Service worker dùng đúng hàm sửa đường dẫn như lúc đóng gói (trang chưa xem vẫn mở được khi mất mạng)', () => {
  const fn = (src) => src.match(/function rewriteForDepth[\s\S]*?\n}/)[0].replace(/^export /, '');
  assert.equal(fn(read('web/sw.js')), fn(read('tools/routes.mjs')));
});

test('Trang 404: mã nội tuyến được CSP của /stars/* cho phép bằng đúng mã băm', () => {
  const script = read('web/404.html').match(/<script>([\s\S]*?)<\/script>/)[1];
  const hash = `'sha256-${createHash('sha256').update(script).digest('base64')}'`;
  for (const f of ['hub/_headers', 'web/_headers']) assert.ok(read(f).includes(hash), `${f} thiếu ${hash}`);
});

test('Không còn link dạng #/ trong mã giao diện', () => {
  const files = ['web/index.html', 'web/assets/js/main.js', 'web/assets/js/ui.js', 'web/assets/js/auth.js', 'hub/index.html', 'hub/assets/js/home.js'];
  for (const f of files) assert.doesNotMatch(read(f), /href="#\/|['"`]#\/[a-z]/, f);
});
