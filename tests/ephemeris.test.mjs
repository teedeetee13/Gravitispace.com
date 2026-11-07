// Kiểm thử vị trí thiên thể: so với giá trị chuẩn tại J2000.0 (1/1/2000 12:00 UT) theo niên lịch thiên văn.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { positions, dayNumber, natalChart, toSign } from '../web/assets/js/lib/ephemeris.js';

const near = (a, b, tol, msg) => {
  let d = Math.abs(a - b) % 360;
  if (d > 180) d = 360 - d;
  assert.ok(d <= tol, `${msg}: ${a.toFixed(2)} vs ${b} (lệch ${d.toFixed(2)}°)`);
};

test('Vị trí tại J2000.0 trong sai số 0,5°', () => {
  const p = positions(dayNumber(2000, 1, 1, 12));
  const ref = { sun: 280.37, moon: 223.32, mercury: 271.89, venus: 241.57, mars: 327.96, jupiter: 25.25, saturn: 40.4, uranus: 314.81, neptune: 303.19, pluto: 251.45 };
  for (const k in ref) near(p[k], ref[k], 0.5, k);
});

test('Xuân phân 2024 (20/3 03:06 UT): Mặt Trời ở 0° Bạch Dương', () => {
  near(positions(dayNumber(2024, 3, 20, 3.1)).sun, 0, 0.05, 'sun');
});

test('Cung Mọc: London, giờ sao 0h → khoảng 26° Cự Giải', () => {
  // Chọn thời điểm có giờ sao Greenwich ≈ 0h: 21/9/2023 lúc ~0h UT
  const c = natalChart({ year: 2023, month: 9, day: 21, hour: 0, minute: 0, tz: 0, lat: 51.5, lon: 0 });
  const asc = toSign(c.angles.asc);
  assert.equal(asc.sign, 3, 'Cự Giải');
});

test('Không rõ giờ: không tính cung Mọc, nhà tính từ cung Mặt Trời', () => {
  const c = natalChart({ year: 1995, month: 8, day: 15, timeKnown: false, lat: NaN, lon: NaN });
  assert.equal(c.angles, null);
  assert.equal(c.houseBase, 'sun');
  assert.equal(c.bodies.find((b) => b.id === 'sun').house, 1);
  assert.equal(c.bodies.find((b) => b.id === 'sun').sign, 4); // Sư Tử
});
