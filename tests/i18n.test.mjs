// Kiểm thử đa ngôn ngữ. Nguyên tắc: một ngôn ngữ chỉ được có mặt trên web khi đã dịch ĐỦ 100%.
//  1. Mọi từ điển giao diện có cùng bộ khoá với tiếng Việt, cùng biến {x}.
//  2. Mọi khoá t("...") dùng trong mã đều tồn tại.
//  3. Mọi lá bài / cung / con giáp / nạp âm / bài mẫu / kiểu trải bài / đường dây hỗ trợ đều có bản dịch.
//  4. Mọi câu luận giải song ngữ { vi, en } trong dữ liệu đều có bản dịch ở ngôn ngữ thứ ba trở đi.
//  5. Chống "dịch giả": chuỗi dài không được trùng nguyên văn tiếng Anh; ngôn ngữ chữ Hán/Devanagari/Thái
//     phải thực sự viết bằng chữ của nó.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import VI from '../web/assets/js/i18n/vi.js';
import EN from '../web/assets/js/i18n/en.js';
import { LANGS } from '../web/assets/js/i18n/langs.js';
import { DECK, SUITS, SPREADS } from '../web/assets/js/data/tarot.js';
import { SIGNS } from '../web/assets/js/data/zodiac.js';
import { CHI, NAP_AM, HANH } from '../web/assets/js/data/tuvi.js';
import { SEED_POSTS } from '../web/assets/js/data/posts.js';
import { TOPICS, POST_TYPES, HOTLINES } from '../web/assets/js/data/taxonomy.js';
import { bilingualStrings } from '../tools/i18n-strings.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'web');
const load = async (f) => (await import(`../web/assets/js/i18n/${f}`)).default;
const vars = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');
const FOREIGN = LANGS.map((l) => l.code).filter((c) => c !== 'vi');
const THIRD = FOREIGN.filter((c) => c !== 'en');

// Chữ viết bắt buộc của từng ngôn ngữ
const SCRIPT = { zh: /[一-鿿]/, hi: /[ऀ-ॿ]/, th: /[฀-๿]/ };
// Những chuỗi được phép giống tiếng Anh (tên riêng, thuật ngữ quốc tế)
const SAME_OK = /^(Tarot|An Sao Space.*|Email|OK|Supabase.*|Find A Helpline|Thái Thứ Lang .*)$/;

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

test('Danh mục ngôn ngữ: mã không trùng, có đủ tệp', () => {
  const codes = LANGS.map((l) => l.code);
  assert.equal(new Set(codes).size, codes.length);
  const files = readdirSync(join(root, 'assets', 'js', 'i18n'));
  for (const c of FOREIGN) {
    assert.ok(files.includes(`${c}.js`), `${c}.js`);
    assert.ok(files.includes(`${c}-content.js`), `${c}-content.js`);
    if (c !== 'en') assert.ok(files.includes(`${c}-text.js`), `${c}-text.js`);
  }
  const i18n = readFileSync(join(root, 'assets', 'js', 'i18n.js'), 'utf8');
  for (const c of FOREIGN) assert.match(i18n, new RegExp(`\\b${c}: \\(\\) =>`), `i18n.js chưa nạp gói ${c}`);
  const boot = readFileSync(join(root, 'assets', 'js', 'boot.js'), 'utf8');
  for (const c of codes) assert.match(boot, new RegExp(`\\b${c}: '`), `boot.js thiếu ${c}`);
});

for (const code of FOREIGN) {
  test(`[${code}] Từ điển giao diện đủ khoá, đúng biến`, async () => {
    const D = await load(`${code}.js`);
    assert.deepEqual(Object.keys(VI).filter((k) => !(k in D)), [], `thiếu trong ${code}.js`);
    assert.deepEqual(Object.keys(D).filter((k) => !(k in VI)), [], `thừa trong ${code}.js`);
    for (const k of Object.keys(VI)) {
      assert.equal(typeof D[k], 'string', k);
      assert.ok(D[k].trim(), `${code}:${k} rỗng`);
      assert.equal(vars(D[k]), vars(VI[k]), `${code}:${k} sai biến`);
      // giữ nguyên số thẻ HTML (<strong>…) để không vỡ bố cục
      assert.equal((D[k].match(/<\/?\w+/g) || []).length, (VI[k].match(/<\/?\w+/g) || []).length, `${code}:${k} sai thẻ HTML`);
    }
  });

  test(`[${code}] Nội dung dữ liệu dịch đủ`, async () => {
    const X = await load(`${code}-content.js`);
    const need = (o, fields, label) => fields.forEach((f) => assert.ok(o && String(o[f] ?? '').trim(), `${code}: ${label}.${f}`));
    for (const c of DECK) need(X.card[c.id], ['name', 'up', 'rev', 'msg', 'q'], c.id);
    for (const s of SUITS) need(X.suit[s.id], ['name', 'element', 'domain'], s.id);
    for (const s of SIGNS) need(X.sign[s.id], code === 'en' ? ['keywords', 'light', 'shadow', 'heal', 'element', 'modality', 'ruler'] : ['name', 'keywords', 'light', 'shadow', 'heal', 'element', 'modality', 'ruler'], s.id);
    for (const c of CHI) need(X.chi[c.id], ['animal', 'traits', 'shadow', 'heal'], c.id);
    for (const [name] of NAP_AM) need(X.napAm[name], ['meaning'], name);
    for (const h of Object.keys(HANH)) need(X.hanh[h], ['name', 'tone', 'trait'], h);
    for (const el of ['Lửa', 'Đất', 'Khí', 'Nước']) need(X.element[el], ['name', 'desc'], el);
    for (const p of SEED_POSTS) need(X.post[p.id], ['body', 'author'], p.id);
    for (const p of SEED_POSTS) assert.equal(!!X.post[p.id].title, !!p.title, `${code}: ${p.id}.title`);
    for (const tp of TOPICS) need(X.topic[tp.id], ['label'], tp.id);
    for (const tp of POST_TYPES) need(X.type[tp.id], ['label'], tp.id);
    for (const s of SPREADS) {
      need(X.spread[s.id], ['name'], s.id);
      assert.equal(X.spread[s.id].positions.length, s.positions.length, `${code}: ${s.id}.positions`);
    }
    for (const h of HOTLINES) need(X.hotline[h.number], ['name', 'note'], h.number);
  });

  if (SCRIPT[code])
    test(`[${code}] Viết bằng đúng chữ của ngôn ngữ`, async () => {
      const D = await load(`${code}.js`);
      const latinOnly = Object.entries(D).filter(([, v]) => v.replace(/<[^>]+>|\{\w+\}/g, '').length > 12 && !SCRIPT[code].test(v));
      // Cho phép vài chuỗi là tên riêng (Tử Vi Đẩu Số, Rider–Waite–Smith…), không quá 3%
      assert.ok(latinOnly.length <= Object.keys(D).length * 0.03, `${code}: ${latinOnly.length} chuỗi chưa dịch: ${latinOnly.slice(0, 5).map(([k]) => k).join(', ')}`);
    });
}

for (const code of THIRD) {
  test(`[${code}] Lời luận giải trong dữ liệu dịch đủ (bộ nhớ dịch)`, async () => {
    const T = await load(`${code}-text.js`);
    const all = await bilingualStrings();
    const missing = all.filter((en) => !String(T[en] ?? '').trim());
    assert.deepEqual(missing.slice(0, 10), [], `${code}-text.js thiếu ${missing.length} câu`);
    for (const en of all) assert.equal(vars(T[en]), vars(en), `${code}: sai biến trong "${en}"`);
  });

  test(`[${code}] Không chép nguyên văn tiếng Anh`, async () => {
    const D = await load(`${code}.js`);
    const copied = Object.keys(EN).filter((k) => EN[k].replace(/\{\w+\}/g, '').length > 24 && D[k] === EN[k] && !SAME_OK.test(EN[k]));
    assert.deepEqual(copied, [], `${code}: chuỗi còn y nguyên tiếng Anh`);
    const T = await load(`${code}-text.js`);
    const same = Object.entries(T).filter(([en, x]) => en.length > 24 && x === en && !SAME_OK.test(en));
    assert.deepEqual(same.map(([en]) => en).slice(0, 5), [], `${code}-text.js còn câu y nguyên tiếng Anh`);
  });
}

test('Mọi khoá t("...") dùng trong mã và index.html đều có trong từ điển', () => {
  const files = walk(join(root, 'assets', 'js')).filter((f) => f.endsWith('.js'));
  const used = new Set();
  for (const f of files) for (const m of readFileSync(f, 'utf8').matchAll(/\bt\('([\w.-]+)'/g)) used.add(m[1]);
  for (const m of readFileSync(join(root, 'index.html'), 'utf8').matchAll(/data-i18n(?:-aria)?="([\w.-]+)"/g)) used.add(m[1]);
  // khoá dùng trong bảng định tuyến
  for (const m of readFileSync(join(root, 'assets', 'js', 'main.js'), 'utf8').matchAll(/'((?:nav|laso|natal)\.[\w]+)'\]/g)) used.add(m[1]);
  const missing = [...used].filter((k) => !(k in VI));
  assert.deepEqual(missing, []);
});

test('Giọng văn: không dùng từ ngữ đe doạ trong nội dung luận giải', () => {
  const scary = /(đại hạn xấu|tai hoạ|tai họa|chết chóc|xui xẻo|vận hạn nặng|phá sản|ly hôn chắc chắn|doom|disaster|cursed)/i;
  for (const f of ['tuvi-stars.js', 'astro-texts.js', 'zodiac.js', 'tarot.js', 'tuvi.js']) {
    const txt = readFileSync(join(root, 'assets', 'js', 'data', f), 'utf8');
    assert.ok(!scary.test(txt), f);
  }
});

test('Giọng văn ở mọi ngôn ngữ: không doạ, không phán số mệnh', () => {
  const scary = {
    es: /(maldici[oó]n|desgracia|cat[aá]strofe|mala suerte segura|condenad)/i,
    fr: /(maudit|malédiction|catastrophe|malheur assuré|condamn[ée])/i,
    de: /(verflucht|\bfluch\b|katastrophe|unheil|verdammt)/i, // "Flucht" (Flucht in Träume) là từ khác, không bắt nhầm
    zh: /(凶死|大凶|災禍|灾祸|厄運纏身|必離婚|破產)/,
    hi: /(श्राप|अभिशाप|विनाश|सर्वनाश|दुर्भाग्य निश्चित)/,
    th: /(คำสาป|หายนะ|ซวยแน่|ดวงตก.*แน่นอน)/,
  };
  for (const code of THIRD) {
    if (!scary[code]) continue;
    for (const f of [`${code}-content.js`, `${code}-text.js`]) {
      const txt = readFileSync(join(root, 'assets', 'js', 'i18n', f), 'utf8');
      assert.ok(!scary[code].test(txt), `${f}: ${txt.match(scary[code])?.[0]}`);
    }
  }
});
