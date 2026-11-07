// Kiểm thử gợi ý múi giờ lịch sử tại Việt Nam.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { suggestTimeZone, PLACES } from '../web/assets/js/data/places.js';

test('Miền Nam dùng UTC+8 từ 1/1/1960 đến 12/6/1975', () => {
  assert.equal(suggestTimeZone(10.8, 1970, 5, 1), 8);
  assert.equal(suggestTimeZone(10.8, 1959, 12, 31), 7);
  assert.equal(suggestTimeZone(10.8, 1975, 6, 13), 7);
});

test('Các giai đoạn khác theo IANA tz: 1943–1945 và miền Nam 1947–1955', () => {
  assert.equal(suggestTimeZone(21.0, 1944, 6, 1), 8);
  assert.equal(suggestTimeZone(21.0, 1945, 5, 1), 9);
  assert.equal(suggestTimeZone(10.8, 1950, 1, 1), 8);
  assert.equal(suggestTimeZone(10.8, 1957, 1, 1), 7);
});

test('Miền Bắc và giai đoạn khác dùng UTC+7', () => {
  assert.equal(suggestTimeZone(21.0, 1970, 5, 1), 7);
  assert.equal(suggestTimeZone(10.8, 1995, 8, 15), 7);
});

test('Toạ độ các nơi sinh nằm trong lãnh thổ Việt Nam', () => {
  for (const p of PLACES) {
    assert.ok(p.lat > 8 && p.lat < 23.5 && p.lon > 102 && p.lon < 110, p.name);
  }
});

test('Ngoài Việt Nam: ước lượng giờ chuẩn theo kinh độ (người dùng quốc tế)', () => {
  assert.equal(suggestTimeZone(28.61, 1990, 6, 1, 77.21), 5); // New Delhi ≈ 5,1 → 5 (thực tế IST +5,5; người dùng tự chỉnh)
  assert.equal(suggestTimeZone(48.86, 1990, 6, 1, 2.35), 0); // Paris giờ chuẩn ước lượng 0 (thực tế CET +1, mùa hè +2)
  assert.equal(suggestTimeZone(25.03, 1990, 6, 1, 121.56), 8); // Đài Bắc +8
  assert.equal(suggestTimeZone(-34.6, 1990, 6, 1, -58.38), -4); // Buenos Aires ≈ −3,9 → −4 (thực tế −3)
  assert.equal(suggestTimeZone(21.03, 1990, 6, 1, 105.85), 7); // Hà Nội vẫn theo lịch sử Việt Nam
});
