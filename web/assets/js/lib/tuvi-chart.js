// Lập lá số Tử Vi Đẩu Số theo quy tắc an sao truyền thống (Bắc phái, theo
// "Tử Vi Đẩu Số Tân Biên" — Vân Đằng Thái Thứ Lang). Module thuần, không đụng DOM.
//
// Quy ước chỉ số cung theo địa chi: Tý = 0, Sửu = 1, Dần = 2 … Hợi = 11.
// Các quy ước có nhiều trường phái (đều được ghi rõ trong tài liệu KIEN_TRUC.md):
//  - Sinh sau 23h: tính sang ngày hôm sau (ngày đổi từ đầu giờ Tý).
//  - Tháng nhuận: an sao như tháng chính (không chia đôi tháng).
//  - Tuổi tính theo tuổi mụ (năm xem − năm sinh âm lịch + 1).

import { CAN, CHI_NAMES, canChi, hourBranch, jdToDate, jdFromDate, solarToLunar } from './lunar.js';

const mod = (n, m) => ((n % m) + m) % m;

export const PALACES = ['menh', 'huynh-de', 'phu-the', 'tu-tuc', 'tai-bach', 'tat-ach', 'thien-di', 'no-boc', 'quan-loc', 'dien-trach', 'phuc-duc', 'phu-mau'];

export const MAIN_STARS = [
  'tu-vi', 'thien-co', 'thai-duong', 'vu-khuc', 'thien-dong', 'liem-trinh',
  'thien-phu', 'thai-am', 'tham-lang', 'cu-mon', 'thien-tuong', 'thien-luong', 'that-sat', 'pha-quan',
];

// 30 nạp âm của vòng Lục Thập Hoa Giáp (bắt đầu Giáp Tý); chữ cuối là hành.
const NAP_AM_HANH = ['Kim', 'Hỏa', 'Mộc', 'Thổ', 'Kim', 'Hỏa', 'Thủy', 'Thổ', 'Kim', 'Mộc', 'Thủy', 'Thổ', 'Hỏa', 'Mộc', 'Thủy', 'Kim', 'Hỏa', 'Mộc', 'Thổ', 'Kim', 'Hỏa', 'Thủy', 'Thổ', 'Kim', 'Mộc', 'Thủy', 'Thổ', 'Hỏa', 'Mộc', 'Thủy'];

/** Chỉ số trong vòng 60 Hoa Giáp từ Can + Chi. */
export const sexagenary = (can, chi) => mod(6 * can - 5 * chi, 60);
export const napAmHanh = (can, chi) => NAP_AM_HANH[Math.floor(sexagenary(can, chi) / 2)];

const CUC = { 'Thủy': 2, 'Mộc': 3, 'Kim': 4, 'Thổ': 5, 'Hỏa': 6 };

// Tứ Hóa theo Can năm sinh: [Lộc, Quyền, Khoa, Kỵ] (bản Việt Nam: Nhâm hóa Khoa ở Thiên Phủ)
const TU_HOA = [
  ['liem-trinh', 'pha-quan', 'vu-khuc', 'thai-duong'], // Giáp
  ['thien-co', 'thien-luong', 'tu-vi', 'thai-am'], // Ất
  ['thien-dong', 'thien-co', 'van-xuong', 'liem-trinh'], // Bính
  ['thai-am', 'thien-dong', 'thien-co', 'cu-mon'], // Đinh
  ['tham-lang', 'thai-am', 'huu-bat', 'thien-co'], // Mậu
  ['vu-khuc', 'tham-lang', 'thien-luong', 'van-khuc'], // Kỷ
  ['thai-duong', 'vu-khuc', 'thai-am', 'thien-dong'], // Canh
  ['cu-mon', 'thai-duong', 'van-khuc', 'van-xuong'], // Tân
  ['thien-luong', 'tu-vi', 'thien-phu', 'vu-khuc'], // Nhâm
  ['pha-quan', 'cu-mon', 'thai-am', 'tham-lang'], // Quý
];
export const HOA = ['hoa-loc', 'hoa-quyen', 'hoa-khoa', 'hoa-ky'];

const LOC_TON = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0]; // theo Can năm
const KHOI_VIET = [[1, 7], [0, 8], [11, 9], [11, 9], [1, 7], [0, 8], [6, 2], [6, 2], [3, 5], [3, 5]];
const TRIET = [[8, 9], [6, 7], [4, 5], [2, 3], [0, 1]]; // Giáp/Kỷ, Ất/Canh, Bính/Tân, Đinh/Nhâm, Mậu/Quý

/** Nhóm tam hợp của Chi năm: 0 = Thân Tý Thìn, 1 = Dần Ngọ Tuất, 2 = Tỵ Dậu Sửu, 3 = Hợi Mão Mùi */
const tamHopGroup = (chi) => [0, 2, 1, 3, 0, 2, 1, 3, 0, 2, 1, 3][chi];
const THIEN_MA = [2, 8, 11, 5]; // theo nhóm tam hợp
const HOA_LINH_START = [[2, 10], [1, 3], [3, 10], [9, 10]]; // [Hỏa, Linh] khởi cung theo nhóm

// Bảng an các sao phụ (chỉ số theo nhóm tam hợp g: 0 Thân Tý Thìn, 1 Dần Ngọ Tuất, 2 Tỵ Dậu Sửu, 3 Hợi Mão Mùi)
const CO_QUA = [[5, 1], [8, 4], [11, 7], [2, 10]]; // [Cô Thần, Quả Tú] cho Dần Mão Thìn / Tỵ Ngọ Mùi / Thân Dậu Tuất / Hợi Tý Sửu
const DAO_HOA = [9, 3, 6, 0];
const HOA_CAI = [4, 10, 1, 7];
const KIEP_SAT = [5, 11, 2, 8];
const PHA_TOAI = [5, 1, 9]; // Chi năm % 3: Tý Ngọ Mão Dậu → Tỵ; Thìn Tuất Sửu Mùi → Sửu; Dần Thân Tỵ Hợi → Dậu
const LUU_HA = [9, 10, 7, 8, 5, 6, 4, 3, 11, 2]; // theo Can năm
const TRANG_SINH_START = { 'Thủy': 8, 'Thổ': 8, 'Mộc': 11, 'Kim': 5, 'Hỏa': 2 };
export const TRANG_SINH = ['trang-sinh', 'moc-duc', 'quan-doi', 'lam-quan', 'de-vuong', 'suy', 'benh', 'tu', 'mo', 'tuyet', 'thai', 'duong'];
export const BAC_SI = ['bac-si', 'luc-si', 'thanh-long', 'tieu-hao', 'tuong-quan', 'tau-thu', 'phi-liem', 'hy-than', 'benh-phu', 'dai-hao', 'phuc-binh', 'quan-phu'];
export const THAI_TUE = ['thai-tue', 'thieu-duong', 'tang-mon', 'thieu-am', 'quan-phu-tt', 'tu-phu', 'tue-pha', 'long-duc', 'bach-ho', 'phuc-duc-tt', 'dieu-khach', 'truc-phu'];
// Mệnh chủ theo Chi cung Mệnh; Thân chủ theo Chi năm sinh
const MENH_CHU = ['tham-lang', 'cu-mon', 'loc-ton', 'van-khuc', 'liem-trinh', 'vu-khuc', 'pha-quan', 'vu-khuc', 'liem-trinh', 'van-khuc', 'loc-ton', 'cu-mon'];
const THAN_CHU = ['hoa-tinh', 'thien-tuong', 'thien-luong', 'thien-dong', 'van-xuong', 'thien-co', 'hoa-tinh', 'thien-tuong', 'thien-luong', 'thien-dong', 'van-xuong', 'thien-co'];
const TIEU_HAN_START = [10, 4, 7, 1]; // theo nhóm tam hợp g: Thân Tý Thìn → Tuất, Dần Ngọ Tuất → Thìn, Tỵ Dậu Sửu → Mùi, Hợi Mão Mùi → Sửu

/**
 * Lập lá số.
 * @param {object} input { day, month, year (dương lịch), hour, minute, gender: 'nam'|'nu', viewYear? }
 */
export function buildChart({ day, month, year, hour, minute = 0, gender, viewYear = new Date().getFullYear() }) {
  // Sau 23h đã sang giờ Tý của ngày hôm sau
  let [d, m, y] = [day, month, year];
  if (hour >= 23) [d, m, y] = jdToDate(jdFromDate(day, month, year) + 1);
  const lunar = solarToLunar(d, m, y);
  const cc = canChi(lunar);
  const yCan = cc.year.can;
  const yChi = cc.year.chi;
  const h = hourBranch(hour);
  const lm = lunar.month; // tháng nhuận tính như tháng chính

  const yang = yCan % 2 === 0; // Giáp, Bính, Mậu, Canh, Nhâm là Dương
  const male = gender === 'nam';
  const forward = yang === male; // Dương nam, Âm nữ đi thuận; Âm nam, Dương nữ đi nghịch

  // 1. Cung Mệnh, cung Thân
  const menh = mod(2 + (lm - 1) - h, 12);
  const than = mod(2 + (lm - 1) + h, 12);

  // 2. Can của 12 cung (Ngũ hổ độn: Can cung Dần theo Can năm)
  const canDan = mod((yCan % 5) * 2 + 2, 10);
  const palaceCan = (chi) => mod(canDan + mod(chi - 2, 12), 10);

  // 3. Cục theo nạp âm của Can Chi cung Mệnh
  const cucHanh = napAmHanh(palaceCan(menh), menh);
  const cuc = CUC[cucHanh];

  // 4. Vị trí sao Tử Vi theo Cục và ngày sinh âm lịch
  const q = Math.ceil(lunar.day / cuc);
  const r = q * cuc - lunar.day;
  const tuVi = mod(2 + q - 1 + (r % 2 === 0 ? r : -r), 12);
  const thienPhu = mod(4 - tuVi, 12);

  const stars = Array.from({ length: 12 }, () => []);
  const put = (id, pos, kind) => stars[mod(pos, 12)].push({ id, kind });

  // 5. 14 chính tinh
  put('tu-vi', tuVi, 'main');
  put('thien-co', tuVi - 1, 'main');
  put('thai-duong', tuVi - 3, 'main');
  put('vu-khuc', tuVi - 4, 'main');
  put('thien-dong', tuVi - 5, 'main');
  put('liem-trinh', tuVi - 8, 'main');
  put('thien-phu', thienPhu, 'main');
  put('thai-am', thienPhu + 1, 'main');
  put('tham-lang', thienPhu + 2, 'main');
  put('cu-mon', thienPhu + 3, 'main');
  put('thien-tuong', thienPhu + 4, 'main');
  put('thien-luong', thienPhu + 5, 'main');
  put('that-sat', thienPhu + 6, 'main');
  put('pha-quan', thienPhu + 10, 'main');

  // 6. Phụ tinh: lục cát, lục sát, Lộc Tồn, Thiên Mã
  put('van-xuong', 10 - h, 'good');
  put('van-khuc', 4 + h, 'good');
  put('ta-phu', 4 + (lm - 1), 'good');
  put('huu-bat', 10 - (lm - 1), 'good');
  put('thien-khoi', KHOI_VIET[yCan][0], 'good');
  put('thien-viet', KHOI_VIET[yCan][1], 'good');
  const locTon = LOC_TON[yCan];
  put('loc-ton', locTon, 'good');
  put('kinh-duong', locTon + 1, 'hard');
  put('da-la', locTon - 1, 'hard');
  put('dia-khong', 11 - h, 'hard');
  put('dia-kiep', 11 + h, 'hard');
  const g = tamHopGroup(yChi);
  const [hoaStart, linhStart] = HOA_LINH_START[g];
  put('hoa-tinh', forward ? hoaStart + h : hoaStart - h, 'hard');
  put('linh-tinh', forward ? linhStart - h : linhStart + h, 'hard');
  put('thien-ma', THIEN_MA[g], 'good');

  // 6b. Các sao an theo Chi năm
  put('long-tri', 4 + yChi, 'good');
  put('phuong-cac', 10 - yChi, 'good');
  put('giai-than', 10 - yChi, 'good'); // đồng cung Phượng Các
  put('thien-khoc', 6 - yChi, 'hard');
  put('thien-hu', 6 + yChi, 'hard');
  put('hong-loan', 3 - yChi, 'good');
  put('thien-hy', 3 - yChi + 6, 'good');
  put('thien-duc', 9 + yChi, 'good');
  put('nguyet-duc', 5 + yChi, 'good');
  const [coThan, quaTu] = CO_QUA[Math.floor(mod(yChi - 2, 12) / 3)];
  put('co-than', coThan, 'hard');
  put('qua-tu', quaTu, 'hard');
  put('dao-hoa', DAO_HOA[g], 'good');
  put('hoa-cai', HOA_CAI[g], 'good');
  put('kiep-sat', KIEP_SAT[g], 'hard');
  put('pha-toai', PHA_TOAI[yChi % 3], 'hard');
  // Các sao an theo Can năm
  put('luu-ha', LUU_HA[yCan], 'hard');
  // Các sao an theo tháng
  put('thien-hinh', 9 + (lm - 1), 'hard');
  put('thien-rieu', 1 + (lm - 1), 'hard');
  put('thien-y', 1 + (lm - 1), 'good'); // đồng cung Thiên Riêu
  // Các sao an theo ngày (dựa vào Tả Phù, Hữu Bật, Văn Xương, Văn Khúc)
  const d1 = lunar.day - 1;
  put('tam-thai', 4 + (lm - 1) + d1, 'good');
  put('bat-toa', 10 - (lm - 1) - d1, 'good');
  put('an-quang', 10 - h + d1 - 1, 'good');
  put('thien-quy', 4 + h - d1 + 1, 'good');
  // Các sao an theo giờ
  put('thai-phu', 6 + h, 'good');
  put('phong-cao', 2 + h, 'good');
  // Các sao cố định hoặc theo cung
  put('thien-la', 4, 'hard');
  put('dia-vong', 10, 'hard');
  put('thien-thuong', menh - 7, 'hard'); // tại cung Nô Bộc
  put('thien-su', menh - 5, 'hard'); // tại cung Tật Ách
  put('thien-tai', menh + yChi, 'good');
  put('thien-tho', than + yChi, 'good');

  // 6c. Ba vòng sao: Tràng Sinh (theo Cục), Lộc Tồn – Bác Sĩ, Thái Tuế (theo Chi năm)
  const tsStart = TRANG_SINH_START[cucHanh];
  TRANG_SINH.forEach((id, i) => put(id, forward ? tsStart + i : tsStart - i, 'ring'));
  BAC_SI.forEach((id, i) => put(id, forward ? locTon + i : locTon - i, 'ring'));
  THAI_TUE.forEach((id, i) => put(id, yChi + i, 'ring'));

  // 7. Tứ Hóa gắn lên sao tương ứng
  const hoaOf = {};
  TU_HOA[yCan].forEach((starId, i) => (hoaOf[starId] = HOA[i]));
  stars.forEach((list) => list.forEach((s) => hoaOf[s.id] && (s.hoa = hoaOf[s.id])));

  // 8. Tuần, Triệt
  const triet = TRIET[yCan % 5];
  const tuanStart = mod(yChi - yCan + 10, 12);
  const tuan = [tuanStart, mod(tuanStart + 1, 12)];

  // 9. Đại hạn: khởi từ cung Mệnh, số tuổi bắt đầu = số Cục, mỗi cung 10 năm
  const daiHan = Array(12);
  for (let i = 0; i < 12; i++) {
    const pos = mod(menh + (forward ? i : -i), 12);
    daiHan[pos] = { from: cuc + i * 10, to: cuc + i * 10 + 9 };
  }

  const age = viewYear - lunar.year + 1;
  // Tiểu hạn: khởi theo nhóm tam hợp Chi năm, nam đi thuận, nữ đi nghịch, mỗi năm một cung
  const tieuHan = mod(TIEU_HAN_START[g] + (male ? age - 1 : -(age - 1)), 12);
  // Lưu Thái Tuế: cung mang Chi của năm đang xem
  const luuThaiTue = mod(viewYear - 4, 12);
  const palaces = Array.from({ length: 12 }, (_, chi) => {
    const pIdx = mod(menh - chi, 12);
    return {
      chi,
      can: palaceCan(chi),
      label: `${CAN[palaceCan(chi)]} ${CHI_NAMES[chi]}`,
      palace: PALACES[pIdx],
      isThan: chi === than,
      stars: stars[chi],
      daiHan: daiHan[chi],
      isCurrent: age >= daiHan[chi].from && age <= daiHan[chi].to,
      tuan: tuan.includes(chi),
      triet: triet.includes(chi),
      isTieuHan: chi === tieuHan,
      isLuuThaiTue: chi === luuThaiTue,
    };
  });

  const yearHanh = napAmHanh(yCan, yChi);
  // Âm dương thuận lý: âm dương của năm sinh trùng âm dương của Chi cung Mệnh (Chi chẵn là Dương)
  const thuanLy = yang === (menh % 2 === 0);
  return {
    menhChu: MENH_CHU[menh],
    thanChu: THAN_CHU[yChi],
    thuanLy,
    tieuHan,
    luuThaiTue,
    input: { day, month, year, hour, minute, gender },
    lunar,
    canChi: cc,
    hourChi: h,
    yinYang: yang ? 'duong' : 'am',
    forward,
    menh,
    than,
    cuc,
    cucHanh,
    menhHanh: yearHanh,
    relation: hanhRelation(cucHanh, yearHanh),
    palaces,
    age,
    current: palaces.find((p) => p.isCurrent) || null,
  };
}

const SINH = { 'Kim': 'Thủy', 'Thủy': 'Mộc', 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim' };
const KHAC = { 'Kim': 'Mộc', 'Mộc': 'Thổ', 'Thổ': 'Thủy', 'Thủy': 'Hỏa', 'Hỏa': 'Kim' };

/** Quan hệ giữa hành của Cục và hành bản Mệnh. */
export function hanhRelation(cuc, menh) {
  if (cuc === menh) return 'hoa'; // bình hòa
  if (SINH[cuc] === menh) return 'cuc-sinh-menh';
  if (SINH[menh] === cuc) return 'menh-sinh-cuc';
  if (KHAC[cuc] === menh) return 'cuc-khac-menh';
  return 'menh-khac-cuc';
}

/** Các chính tinh của một cung; nếu trống (vô chính diệu) thì mượn cung xung chiếu. */
export function mainStarsOf(chart, chi) {
  const own = chart.palaces[chi].stars.filter((s) => s.kind === 'main');
  if (own.length) return { stars: own, borrowed: false };
  return { stars: chart.palaces[mod(chi + 6, 12)].stars.filter((s) => s.kind === 'main'), borrowed: true };
}

/** Thứ tự ô trong lưới 4×4 truyền thống: hàng trên Tỵ Ngọ Mùi Thân, hàng dưới Dần Sửu Tý Hợi. */
export const GRID = [
  [5, 6, 7, 8],
  [4, null, null, 9],
  [3, null, null, 10],
  [2, 1, 0, 11],
];
