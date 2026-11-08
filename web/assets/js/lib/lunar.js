// Đổi lịch dương ↔ âm lịch Việt Nam.
// Thuật toán thiên văn của Hồ Ngọc Đức (dựa trên Jean Meeus, "Astronomical Algorithms", 1998):
//   https://web.archive.org/web/2023/https://www.informatik.uni-leipzig.de/~duc/amlich/calrules.html
//   (trang gốc trên máy chủ Đại học Leipzig hiện trả 404; dùng bản lưu trữ)
// Lịch Việt Nam tính theo kinh tuyến 105° Đông (UTC+7). Miền Bắc chuyển từ UTC+8 sang UTC+7 ngày 8/8/1967,
// nên từ năm âm lịch 1968 lịch Việt có thể lệch lịch Trung Quốc (vd. Tết Mậu Thân 1968, Ất Sửu 1985):
//   https://nhandan.vn/chung-quanh-thong-tin-ve-ngay-am-lich-khac-nhau-tren-mot-so-loai-lich-post489744.html
// Lưu ý: lịch miền Nam 1968–1975 vẫn tính theo UTC+8; ở đây theo lịch chính thức hiện hành (UTC+7 từ 1968).
// Module thuần (không đụng tới DOM) để chạy được cả trong trình duyệt lẫn Node (kiểm thử).

const PI = Math.PI;
const INT = Math.floor;

/** Số ngày Julius của một ngày dương lịch (lịch Gregory sau 15/10/1582). */
export function jdFromDate(dd, mm, yy) {
  const a = INT((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
  if (jd < 2299161) jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
  return jd;
}

/** Ngược lại: số ngày Julius → [ngày, tháng, năm] dương lịch. */
export function jdToDate(jd) {
  let a, b, c;
  if (jd > 2299160) {
    a = jd + 32044;
    b = INT((4 * a + 3) / 146097);
    c = a - INT((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  const d = INT((4 * c + 3) / 1461);
  const e = c - INT((1461 * d) / 4);
  const m = INT((5 * e + 2) / 153);
  const day = e - INT((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * INT(m / 10);
  const year = b * 100 + d - 4800 + INT(m / 10);
  return [day, month, year];
}

/** Thời điểm (ngày Julius, giờ UT) của lần sóc thứ k tính từ 1/1/1900. */
function newMoon(k) {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 = C1 + 0.001 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  const deltat = T < -11 ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3 : -0.000278 + 0.000265 * T + 0.000262 * T2;
  return Jd1 + C1 - deltat;
}

/** Kinh độ Mặt Trời (radian) tại thời điểm jdn (ngày Julius, UT). */
function sunLongitude(jdn) {
  const T = (jdn - 2451545.0) / 36525;
  const T2 = T * T;
  const dr = PI / 180;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);
  let L = (L0 + DL) * dr;
  L -= PI * 2 * INT(L / (PI * 2));
  return L;
}

const getNewMoonDay = (k, tz) => INT(newMoon(k) + 0.5 + tz / 24);
const getSunLongitude = (dayNumber, tz) => INT((sunLongitude(dayNumber - 0.5 - tz / 24) / PI) * 6);

/** Ngày bắt đầu tháng 11 âm lịch (tháng chứa Đông chí) của năm yy. */
function getLunarMonth11(yy, tz) {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = INT(off / 29.530588853);
  let nm = getNewMoonDay(k, tz);
  if (getSunLongitude(nm, tz) >= 9) nm = getNewMoonDay(k - 1, tz);
  return nm;
}

/** Vị trí tháng nhuận (tính từ sau tháng 11 âm lịch). */
function getLeapMonthOffset(a11, tz) {
  const k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, tz), tz);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, tz), tz);
  } while (arc !== last && i < 14);
  return i - 1;
}

/** Múi giờ dùng để tính lịch âm Việt Nam cho một năm dương lịch. */
export const lunarTimeZone = (yy) => (yy < 1968 ? 8 : 7);

/**
 * Dương lịch → âm lịch.
 * @returns {{day:number, month:number, year:number, leap:boolean, jd:number}}
 */
export function solarToLunar(dd, mm, yy, tz = lunarTimeZone(yy)) {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = INT((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, tz);
  if (monthStart > dayNumber) monthStart = getNewMoonDay(k, tz);
  let a11 = getLunarMonth11(yy, tz);
  let b11 = a11;
  let lunarYear;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, tz);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, tz);
  }
  const lunarDay = dayNumber - monthStart + 1;
  const diff = INT((monthStart - a11) / 29);
  let leap = false;
  let lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, tz);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) leap = true;
    }
  }
  if (lunarMonth > 12) lunarMonth -= 12;
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
  return { day: lunarDay, month: lunarMonth, year: lunarYear, leap, jd: dayNumber };
}

/** Âm lịch → dương lịch. Trả về null nếu tháng nhuận không tồn tại trong năm đó. */
export function lunarToSolar(lunarDay, lunarMonth, lunarYear, leap = false, tz = lunarTimeZone(lunarYear)) {
  let a11, b11;
  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1, tz);
    b11 = getLunarMonth11(lunarYear, tz);
  } else {
    a11 = getLunarMonth11(lunarYear, tz);
    b11 = getLunarMonth11(lunarYear + 1, tz);
  }
  const k = INT(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  let off = lunarMonth - 11;
  if (off < 0) off += 12;
  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, tz);
    let leapMonth = leapOff - 2;
    if (leapMonth < 0) leapMonth += 12;
    if (leap && lunarMonth !== leapMonth) return null;
    if (leap || off >= leapOff) off += 1;
  } else if (leap) return null;
  const monthStart = getNewMoonDay(k + off, tz);
  return jdToDate(monthStart + lunarDay - 1);
}

/** Tháng nhuận của một năm âm lịch (0 nếu không có). */
export function leapMonthOf(lunarYear, tz = lunarTimeZone(lunarYear)) {
  const a11 = getLunarMonth11(lunarYear - 1, tz);
  const b11 = getLunarMonth11(lunarYear, tz);
  if (b11 - a11 <= 365) return 0;
  let m = getLeapMonthOffset(a11, tz) - 2;
  if (m <= 0) m += 12;
  return m;
}

export const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
export const CHI_NAMES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

const mod = (n, m) => ((n % m) + m) % m;

/** Can Chi của năm, tháng, ngày (âm lịch) — theo cách tính truyền thống. */
export function canChi(lunar) {
  const yCan = mod(lunar.year + 6, 10);
  const yChi = mod(lunar.year + 8, 12);
  // Can tháng Giêng theo Can năm (Ngũ hổ độn); Chi tháng Giêng là Dần
  const mCan = mod(lunar.year * 12 + lunar.month + 3, 10);
  const mChi = mod(lunar.month + 1, 12);
  const dCan = mod(lunar.jd + 9, 10);
  const dChi = mod(lunar.jd + 1, 12);
  return {
    year: { can: yCan, chi: yChi, text: `${CAN[yCan]} ${CHI_NAMES[yChi]}` },
    month: { can: mCan, chi: mChi, text: `${CAN[mCan]} ${CHI_NAMES[mChi]}` },
    day: { can: dCan, chi: dChi, text: `${CAN[dCan]} ${CHI_NAMES[dChi]}` },
  };
}

/** Giờ đồng hồ (0–23) → chỉ số giờ địa chi (Tý = 0 … Hợi = 11). */
export const hourBranch = (hour) => mod(INT((hour + 1) / 2), 12);
