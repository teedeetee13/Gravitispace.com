// Kiểm thử bảng độ sáng sao Tử Vi (theo trường phái) và góc chiếu chiêm tinh.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SCHOOLS, GRADES, brightness, DEFAULT_SCHOOL } from '../web/assets/js/data/tuvi-brightness.js';
import { MAIN_STARS } from '../web/assets/js/lib/tuvi-chart.js';
import { findAspects, positions, dayNumber, BODIES } from '../web/assets/js/lib/ephemeris.js';
import { DECK } from '../web/assets/js/data/tarot.js';
import { existsSync, statSync, readFileSync } from 'node:fs';

test('Tarot: đủ 78 ảnh, mỗi ảnh là JPEG nhỏ hơn 120 KB và có dòng ghi nguồn', () => {
  const credits = readFileSync(new URL('../web/assets/tarot/CREDITS.md', import.meta.url), 'utf8');
  for (const c of DECK) {
    const f = new URL(`../web/assets/tarot/${c.id}.jpg`, import.meta.url);
    assert.ok(existsSync(f), c.id);
    assert.ok(statSync(f).size < 120 * 1024, `${c.id} quá nặng`);
    assert.deepEqual([...readFileSync(f).subarray(0, 2)], [0xff, 0xd8], `${c.id} không phải JPEG`);
    assert.ok(credits.includes(`${c.id}.jpg`), `${c.id} thiếu ghi nguồn`);
  }
});

test('Mỗi trường phái có đủ 14 chính tinh × 12 cung, chỉ dùng ký hiệu hợp lệ', () => {
  for (const [id, sc] of Object.entries(SCHOOLS)) {
    for (const star of MAIN_STARS) {
      const r = sc.table[star];
      assert.equal(r?.length, 12, `${id} ${star}`);
      for (const g of r) assert.ok(g === null || GRADES[g], `${id} ${star} ${g}`);
    }
  }
});

test('Thái Thứ Lang: 14 chính tinh đều có giá trị ở cả 12 cung (sách ghi đủ)', () => {
  for (const star of MAIN_STARS) assert.ok(SCHOOLS['thai-thu-lang'].table[star].every(Boolean), star);
  assert.equal(DEFAULT_SCHOOL, 'thai-thu-lang');
});

test('Thái Thứ Lang khớp nguyên văn sách (một số ô đối chiếu)', () => {
  const s = 'thai-thu-lang';
  // Thất Sát: Miếu Dần Thân Tý Ngọ; Vượng Tỵ Hợi; Đắc Sửu Mùi; Hãm Mão Dậu Thìn Tuất
  assert.deepEqual([0, 2, 6, 8].map((c) => brightness(s, 'that-sat', c)), ['M', 'M', 'M', 'M']);
  assert.deepEqual([5, 11].map((c) => brightness(s, 'that-sat', c)), ['V', 'V']);
  assert.deepEqual([3, 4, 9, 10].map((c) => brightness(s, 'that-sat', c)), ['H', 'H', 'H', 'H']);
  // Tử Vi không có Hãm, Bình hòa tại Tý Mão Dậu Hợi
  assert.ok(!SCHOOLS[s].table['tu-vi'].includes('H'));
  assert.deepEqual([0, 3, 9, 11].map((c) => brightness(s, 'tu-vi', c)), ['B', 'B', 'B', 'B']);
  // Thái Dương Miếu Tỵ Ngọ, Hãm Thân Dậu Tuất Hợi Tý
  assert.deepEqual([5, 6].map((c) => brightness(s, 'thai-duong', c)), ['M', 'M']);
  assert.deepEqual([8, 9, 10, 11, 0].map((c) => brightness(s, 'thai-duong', c)), ['H', 'H', 'H', 'H', 'H']);
  // Tham Lang (điểm khác Toàn Thư): Hãm tại Tý Ngọ
  assert.equal(brightness(s, 'tham-lang', 0), 'H');
});

test('Toàn Thư: dùng giá trị gốc của sách ở các ô khác biệt; ô sách không ghi để trống', () => {
  const s = 'toan-thu';
  assert.equal(brightness(s, 'thai-am', 2), 'M'); // Thái Âm tại Dần: Toàn Thư ghi Miếu
  assert.equal(brightness(s, 'cu-mon', 4), 'B'); // Cự Môn tại Thìn: Bình
  assert.equal(brightness(s, 'tu-vi', 0), null); // Tử Vi tại Tý: sách không ghi
  assert.equal(brightness(s, 'thien-luong', 5), null);
  assert.equal(brightness(s, 'tham-lang', 0), 'V');
});

test('Góc chiếu: phát hiện đúng loại góc và biên độ', () => {
  const bodies = [
    { id: 'sun', lon: 10 }, { id: 'moon', lon: 190.5 }, // đối đỉnh lệch 0,5°
    { id: 'venus', lon: 130 }, // tam hợp với Mặt Trời (lệch 0°)
    { id: 'mars', lon: 103 }, // vuông góc Mặt Trời lệch 3°
    { id: 'uranus', lon: 300 }, { id: 'neptune', lon: 300 }, // cặp hành tinh ngoài: bỏ qua
  ];
  const asp = findAspects(bodies);
  const find = (a, b) => asp.find((x) => (x.a === a && x.b === b) || (x.a === b && x.b === a));
  assert.equal(find('sun', 'moon').aspect, 'opposition');
  assert.equal(find('sun', 'venus').aspect, 'trine');
  assert.equal(find('sun', 'mars').aspect, 'square');
  assert.equal(find('uranus', 'neptune'), undefined);
  assert.ok(asp[0].orb <= asp[asp.length - 1].orb, 'xếp theo độ chặt');
});

test('Góc chiếu thật ngày 1/1/2000: mọi góc trong biên độ; Sao Mộc – Sao Thổ (cách 15°) không thành góc chiếu', () => {
  const p = positions(dayNumber(2000, 1, 1, 12));
  const asp = findAspects(BODIES.map((id) => ({ id, lon: p[id] })));
  for (const a of asp) assert.ok(a.orb <= 10, `${a.a}-${a.b}`);
  // Sao Mộc 25° và Sao Thổ 40° cách 15° → không thành góc chiếu chính
  assert.ok(!asp.some((a) => [a.a, a.b].sort().join() === 'jupiter,saturn'));
});
