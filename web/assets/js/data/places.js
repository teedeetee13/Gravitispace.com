// Nơi sinh thường gặp (vĩ độ, kinh độ) để tính cung Mọc. Có thể nhập toạ độ tuỳ ý cho nơi khác.
export const PLACES = [
  { id: 'ha-noi', name: 'Hà Nội', lat: 21.0285, lon: 105.8542 },
  { id: 'tp-hcm', name: 'TP. Hồ Chí Minh', lat: 10.8231, lon: 106.6297 },
  { id: 'hai-phong', name: 'Hải Phòng', lat: 20.8449, lon: 106.6881 },
  { id: 'da-nang', name: 'Đà Nẵng', lat: 16.0544, lon: 108.2022 },
  { id: 'can-tho', name: 'Cần Thơ', lat: 10.0452, lon: 105.7469 },
  { id: 'hue', name: 'Huế', lat: 16.4637, lon: 107.5909 },
  { id: 'nha-trang', name: 'Nha Trang', lat: 12.2388, lon: 109.1967 },
  { id: 'da-lat', name: 'Đà Lạt', lat: 11.9404, lon: 108.4583 },
  { id: 'vinh', name: 'Vinh', lat: 18.6796, lon: 105.6813 },
  { id: 'thanh-hoa', name: 'Thanh Hoá', lat: 19.8067, lon: 105.7852 },
  { id: 'nam-dinh', name: 'Nam Định', lat: 20.4388, lon: 106.1621 },
  { id: 'thai-nguyen', name: 'Thái Nguyên', lat: 21.5942, lon: 105.8482 },
  { id: 'ha-long', name: 'Hạ Long', lat: 20.9599, lon: 107.0425 },
  { id: 'quy-nhon', name: 'Quy Nhơn', lat: 13.782, lon: 109.2196 },
  { id: 'buon-ma-thuot', name: 'Buôn Ma Thuột', lat: 12.6667, lon: 108.05 },
  { id: 'vung-tau', name: 'Vũng Tàu', lat: 10.346, lon: 107.0843 },
  { id: 'bien-hoa', name: 'Biên Hoà', lat: 10.9574, lon: 106.8427 },
  { id: 'long-xuyen', name: 'Long Xuyên', lat: 10.3864, lon: 105.4352 },
  { id: 'ca-mau', name: 'Cà Mau', lat: 9.1769, lon: 105.15 },
  { id: 'lao-cai', name: 'Lào Cai', lat: 22.4856, lon: 103.9707 },
];

export const placeById = Object.fromEntries(PLACES.map((p) => [p.id, p]));

/**
 * Múi giờ đồng hồ tại Việt Nam lúc sinh (giờ lệch UTC), theo cơ sở dữ liệu múi giờ IANA (tệp "asia", vùng
 * Asia/Ho_Chi_Minh, dẫn sách "Lịch Việt Nam thế kỷ XX–XXI" của Trần Tiến Bình):
 * https://github.com/eggert/tz/blob/main/asia
 *  - Cả Đông Dương: UTC+8 từ 31/12/1942 23h, UTC+9 từ 14/3/1945 23h, về UTC+7 từ 2/9/1945.
 *  - Miền Nam: UTC+8 từ 1/4/1947, UTC+7 từ 1/7/1955, UTC+8 từ 31/12/1959 23h, UTC+7 từ 13/6/1975.
 * Miền Bắc giai đoạn 1947–1954 chưa có nguồn rõ ràng nên để UTC+7. Ranh giới tính theo ngày (bỏ qua giờ chuyển).
 * Người dùng luôn có thể tự sửa nếu biết chính xác hơn.
 */
export function suggestTimeZone(lat, year, month, day, lon) {
  // Ngoài lãnh thổ Việt Nam (người dùng quốc tế nhập toạ độ): ước lượng giờ chuẩn theo kinh độ (15° = 1 giờ,
  // làm tròn nửa giờ). Không tính giờ mùa hè (DST) — lời nhắc trong biểu mẫu đề nghị người dùng tự cộng nếu có.
  if (Number.isFinite(lon) && !(lat > 8 && lat < 23.6 && lon > 102 && lon < 110)) {
    return Math.max(-12, Math.min(14, Math.round(lon / 7.5) / 2));
  }
  const n = year * 10000 + month * 100 + day;
  if (n >= 19430101 && n < 19450315) return 8;
  if (n >= 19450315 && n < 19450902) return 9;
  const south = lat < 17;
  if (south && n >= 19470401 && n < 19550701) return 8;
  if (south && n >= 19600101 && n < 19750613) return 8;
  return 7;
}
