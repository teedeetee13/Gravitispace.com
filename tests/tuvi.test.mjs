// Kiểm thử an sao Tử Vi: đối chiếu với các bảng quy tắc trong sách truyền thống.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildChart, napAmHanh, MAIN_STARS, TRANG_SINH } from '../web/assets/js/lib/tuvi-chart.js';
import { STARS, PALACE_INFO, DAI_HAN_THEME } from '../web/assets/js/data/tuvi-stars.js';

const find = (chart, id) => chart.palaces.find((p) => p.stars.some((s) => s.id === id)).chi;

// Lá số mẫu: nam, 15/8/1995, 9 giờ sáng → âm lịch 20/7 Ất Hợi, giờ Tỵ
const sample = buildChart({ day: 15, month: 8, year: 1995, hour: 9, gender: 'nam', viewYear: 2026 });

test('Âm lịch và Can Chi năm', () => {
  assert.deepEqual([sample.lunar.day, sample.lunar.month, sample.lunar.year], [20, 7, 1995]);
  assert.equal(sample.canChi.year.text, 'Ất Hợi');
});

test('An Mệnh, Thân: từ Dần đếm thuận tháng, nghịch/thuận giờ', () => {
  assert.equal(sample.menh, 3); // Mão
  assert.equal(sample.than, 1); // Sửu
});

test('Cục theo nạp âm cung Mệnh (Kỷ Mão = Thành Đầu Thổ → Thổ ngũ cục)', () => {
  assert.equal(sample.palaces[3].label, 'Kỷ Mão');
  assert.equal(sample.cuc, 5);
});

test('Bảng an Tử Vi theo Cục và ngày (các mốc trong sách)', () => {
  // [cục, ngày, cung Tử Vi]
  const table = [[2, 1, 1], [2, 2, 2], [2, 3, 2], [3, 1, 4], [3, 2, 1], [4, 1, 11], [5, 1, 6], [6, 1, 9], [5, 20, 5]];
  for (const [cuc, day, expected] of table) {
    const q = Math.ceil(day / cuc);
    const r = q * cuc - day;
    const pos = (((2 + q - 1 + (r % 2 === 0 ? r : -r)) % 12) + 12) % 12;
    assert.equal(pos, expected, `cục ${cuc}, ngày ${day}`);
  }
  assert.equal(find(sample, 'tu-vi'), 5); // Tỵ
});

test('Đủ 14 chính tinh, Tử Vi và Thiên Phủ đối xứng qua trục Dần–Thân', () => {
  for (const id of MAIN_STARS) assert.ok(sample.palaces.some((p) => p.stars.some((s) => s.id === id)), id);
  assert.equal((find(sample, 'tu-vi') + find(sample, 'thien-phu')) % 12, 4);
  assert.equal(find(sample, 'that-sat'), find(sample, 'tu-vi')); // Tử Vi ở Tỵ đồng cung Thất Sát
});

test('Lộc Tồn, Kình Dương, Đà La theo Can năm (Ất → Lộc Tồn ở Mão)', () => {
  assert.equal(find(sample, 'loc-ton'), 3);
  assert.equal(find(sample, 'kinh-duong'), 4);
  assert.equal(find(sample, 'da-la'), 2);
});

test('Tứ Hóa năm Ất: Cơ Lộc, Lương Quyền, Tử Vi Khoa, Nguyệt Kỵ', () => {
  const hoa = Object.fromEntries(sample.palaces.flatMap((p) => p.stars.filter((s) => s.hoa).map((s) => [s.hoa, s.id])));
  assert.deepEqual(hoa, { 'hoa-loc': 'thien-co', 'hoa-quyen': 'thien-luong', 'hoa-khoa': 'tu-vi', 'hoa-ky': 'thai-am' });
});

test('Đại hạn: Âm nam đi nghịch, khởi từ số Cục', () => {
  assert.equal(sample.forward, false);
  assert.deepEqual(sample.palaces[3].daiHan, { from: 5, to: 14 });
  assert.deepEqual(sample.palaces[2].daiHan, { from: 15, to: 24 });
  assert.equal(sample.age, 32);
  assert.equal(sample.current.chi, 1); // 25–34 tuổi ở cung Sửu
});

test('Sao theo năm (Ất Hợi): Long Trì Mão, Phượng Các Hợi, Khốc Mùi, Hư Tỵ, Hồng Loan Thìn, Hỷ Tuất, Cô Dần, Quả Tuất, Đào Hoa Tý', () => {
  const expect = { 'long-tri': 3, 'phuong-cac': 11, 'thien-khoc': 7, 'thien-hu': 5, 'hong-loan': 4, 'thien-hy': 10, 'co-than': 2, 'qua-tu': 10, 'dao-hoa': 0 };
  for (const [id, chi] of Object.entries(expect)) assert.equal(find(sample, id), chi, id);
});

test('Sao theo ngày: Tam Thai từ Tả Phù đếm thuận, Bát Tọa từ Hữu Bật đếm nghịch (ngày 20)', () => {
  assert.equal(find(sample, 'tam-thai'), 5);
  assert.equal(find(sample, 'bat-toa'), 9);
});

test('Ba vòng sao: Tràng Sinh (Thổ cục khởi Thân, âm nam đi nghịch), Bác Sĩ theo Lộc Tồn, Thái Tuế theo Chi năm', () => {
  assert.equal(find(sample, 'trang-sinh'), 8);
  assert.equal(find(sample, 'moc-duc'), 7);
  assert.equal(find(sample, 'bac-si'), 3);
  assert.equal(find(sample, 'luc-si'), 2);
  assert.equal(find(sample, 'thai-tue'), 11);
  assert.equal(find(sample, 'thieu-duong'), 0);
  // mỗi vòng phủ đủ 12 cung
  for (const p of sample.palaces) assert.equal(p.stars.filter((s) => s.kind === 'ring').length, 3);
});

test('Mệnh chủ, Thân chủ, âm dương thuận lý, tiểu hạn, lưu Thái Tuế', () => {
  assert.equal(sample.menhChu, 'van-khuc'); // Mệnh tại Mão
  assert.equal(sample.thanChu, 'thien-co'); // năm Hợi
  assert.equal(sample.thuanLy, true); // năm Ất (âm), Mệnh tại Mão (âm)
  assert.equal(sample.tieuHan, 8); // Hợi Mão Mùi khởi Sửu, nam thuận, 32 tuổi → Thân
  assert.equal(sample.luuThaiTue, 6); // năm 2026 Bính Ngọ
  assert.equal(sample.relation, 'menh-sinh-cuc'); // Mệnh Hỏa (Sơn Đầu Hỏa) sinh Cục Thổ
});

test('Nạp âm: Giáp Tý = Kim, Bính Dần = Hỏa, Nhâm Tuất = Thủy', () => {
  assert.equal(napAmHanh(0, 0), 'Kim');
  assert.equal(napAmHanh(2, 2), 'Hỏa');
  assert.equal(napAmHanh(8, 10), 'Thủy');
});

test('Sinh sau 23 giờ tính sang ngày hôm sau', () => {
  const late = buildChart({ day: 9, month: 2, year: 2024, hour: 23, gender: 'nu' });
  assert.deepEqual([late.lunar.day, late.lunar.month, late.lunar.year], [1, 1, 2024]);
  assert.equal(late.hourChi, 0);
});

test('Mọi sao và cung đều có lời luận giải song ngữ', () => {
  for (const s of buildChart({ day: 1, month: 1, year: 1990, hour: 12, gender: 'nam' }).palaces.flatMap((p) => p.stars)) {
    assert.ok(STARS[s.id]?.name?.vi && STARS[s.id]?.name?.en, s.id);
  }
  for (const id of Object.keys(PALACE_INFO)) assert.ok(DAI_HAN_THEME[id]?.vi && DAI_HAN_THEME[id]?.en, id);
});

test('Chạy ổn định cho mọi ngày trong 100 năm (không lỗi, 12 cung, 14 chính tinh)', () => {
  for (let y = 1930; y <= 2030; y += 3) {
    for (let m = 1; m <= 12; m += 2) {
      const c = buildChart({ day: 1 + ((y + m) % 28), month: m, year: y, hour: (y * m) % 24, gender: y % 2 ? 'nam' : 'nu' });
      assert.equal(c.palaces.length, 12);
      assert.equal(c.palaces.flatMap((p) => p.stars).filter((s) => s.kind === 'main').length, 14);
    }
  }
});

// Đối chiếu trọn một lá số với tuvi.vn (nam, 13/12/2004 18:10 → 2/11 Giáp Thân, giờ Dậu): mọi sao (trừ vòng Tràng Sinh) phải trùng cung
test('Đối chiếu đủ sao với lá số tham khảo (tuvi.vn, nam 13/12/2004 18:10)', () => {
  const c = buildChart({ day: 13, month: 12, year: 2004, hour: 18, minute: 10, gender: 'nam', viewYear: 2026 });
  const expected = {
    5: 'thien-co dia-giai thien-tru van-tinh thien-duc phuc-duc-tt thien-tho kiep-sat tieu-hao',
    6: 'tu-vi thien-giai dieu-khach tuong-quan',
    7: 'thien-viet thien-quan duong-phu hong-loan tau-thu thien-hinh qua-tu truc-phu dau-quan',
    8: 'pha-quan dia-kiep thai-tue phi-liem thien-thuong',
    9: 'thien-phuc dao-hoa thieu-duong hy-than luu-ha pha-toai thien-khong',
    10: 'liem-trinh thien-phu quoc-an thien-khoc tang-mon benh-phu dia-vong thien-su',
    11: 'thai-am phong-cao thien-y thieu-am bat-toa thien-tai hoa-tinh thien-rieu co-than dai-hao',
    0: 'tham-lang huu-bat long-tri quan-phu-tt phuc-binh',
    1: 'thien-dong cu-mon van-xuong van-khuc thien-khoi thien-hy nguyet-duc an-quang thien-quy linh-tinh da-la tu-phu quan-phu',
    2: 'vu-khuc thien-tuong ta-phu loc-ton thien-ma giai-than phuong-cac bac-si dia-khong thien-hu tue-pha',
    3: 'thai-duong thien-luong thai-phu long-duc luc-si tam-thai kinh-duong',
    4: 'that-sat hoa-cai thanh-long bach-ho thien-la',
  };
  for (const [chi, ids] of Object.entries(expected)) {
    const got = c.palaces[chi].stars.filter((s) => !TRANG_SINH.includes(s.id)).map((s) => s.id).sort();
    assert.deepEqual(got, ids.split(' ').sort(), `cung ${chi}`);
  }
  assert.deepEqual([c.menh, c.than, c.cuc, c.laiNhan], [3, 9, 6, 10]); // Mệnh Mão, Thân Dậu, Hỏa lục cục, Lai nhân Tuất
  assert.equal(c.menhChuNam, 'liem-trinh');
  assert.deepEqual(c.palaces.filter((p) => p.tuan).map((p) => p.chi), [6, 7]);
  assert.deepEqual(c.palaces.filter((p) => p.triet).map((p) => p.chi), [8, 9]);
});
