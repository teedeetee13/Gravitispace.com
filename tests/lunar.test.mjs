// Kiểm thử lịch âm: đối chiếu với các mốc Tết và tháng nhuận đã công bố.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { solarToLunar, lunarToSolar, leapMonthOf, canChi, hourBranch } from '../web/assets/js/lib/lunar.js';

// Năm 1985 Việt Nam ăn Tết 21/1, sớm hơn Trung Quốc (20/2) một tháng do lịch Việt tính theo UTC+7.
const TET = [
  [1985, [21, 1]], [1990, [27, 1]], [1995, [31, 1]], [2000, [5, 2]], [2010, [14, 2]],
  [2020, [25, 1]], [2023, [22, 1]], [2024, [10, 2]], [2025, [29, 1]], [2026, [17, 2]],
];

test('Mùng 1 Tết đúng ngày dương lịch', () => {
  for (const [y, [d, m]] of TET) {
    const l = solarToLunar(d, m, y);
    assert.deepEqual([l.day, l.month, l.year, l.leap], [1, 1, y, false], `Tết ${y}`);
  }
});

test('Tết 1985: lịch Việt (UTC+7) khác lịch Trung Quốc (UTC+8)', () => {
  assert.equal(solarToLunar(20, 2, 1985, 8).month, 1);
  assert.equal(solarToLunar(20, 2, 1985).month, 2);
});

test('Ngày trước Tết vẫn thuộc năm âm lịch cũ', () => {
  const l = solarToLunar(9, 2, 2024);
  assert.equal(l.year, 2023);
  assert.equal(l.month, 12);
});

test('Tháng nhuận các năm gần đây', () => {
  assert.equal(leapMonthOf(2020), 4);
  assert.equal(leapMonthOf(2023), 2);
  assert.equal(leapMonthOf(2025), 6);
  assert.equal(leapMonthOf(2024), 0);
});

test('Đổi qua lại dương ↔ âm khớp nhau', () => {
  for (let y = 1950; y <= 2050; y += 7) {
    for (const [d, m] of [[3, 3], [15, 7], [28, 11]]) {
      const l = solarToLunar(d, m, y);
      assert.deepEqual(lunarToSolar(l.day, l.month, l.year, l.leap), [d, m, y]);
    }
  }
});

test('Can Chi năm, tháng, ngày', () => {
  const cc = canChi(solarToLunar(10, 2, 2024));
  assert.equal(cc.year.text, 'Giáp Thìn');
  assert.equal(cc.month.text, 'Bính Dần');
  assert.equal(cc.day.text, 'Giáp Thìn');
  assert.equal(canChi(solarToLunar(1, 1, 2000)).day.text, 'Mậu Ngọ');
});

test('Giờ địa chi', () => {
  assert.equal(hourBranch(23), 0); // Tý
  assert.equal(hourBranch(0), 0);
  assert.equal(hourBranch(1), 1); // Sửu
  assert.equal(hourBranch(11), 6); // Ngọ
  assert.equal(hourBranch(22), 11); // Hợi
});
