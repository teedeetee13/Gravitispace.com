// Độ sáng (đắc tính) của sao theo cung, chia theo trường phái. Thứ tự cột: Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi.
// null = sách không ghi. Chỉ ghi đúng những gì nguồn ghi, không tự suy ra.
//
// 1) Thái Thứ Lang (mặc định — phổ biến nhất ở Việt Nam):
//    Vân Đằng Thái Thứ Lang, "Tử Vi Đẩu Số Tân Biên", Sài Gòn 1956, Phần "Đặc tính các sao" mục 3.1–3.21.
//    Bản quét: https://tuvithuchanh.com/wp-content/uploads/2022/11/Tu-vi-dau-so.pdf
//    Đối chiếu thêm: Thất Sát trích tại https://sonchu.vn/2022/08/15/chuong-21-thuyet-mieu-ham-cua-cac-tinh-dieu/
// 2) Toàn Thư: "Tử Vi Đẩu Số Toàn Thư" (紫微斗数全书), thiên Mệnh cung (命宫), theo bảng và phần ghi chú
//    "chỗ khác với Toàn Thư" của https://ziweihome.com/zh-hans/xingyao/miaowang (dùng giá trị của Toàn Thư).

export const GRADES = {
  M: { vi: 'Miếu', en: 'Exalted (Miếu)', level: 5 },
  V: { vi: 'Vượng', en: 'Strong (Vượng)', level: 4 },
  'Đ': { vi: 'Đắc địa', en: 'Favourable (Đắc)', level: 3 },
  L: { vi: 'Lợi', en: 'Beneficial (Lợi)', level: 3 },
  B: { vi: 'Bình hòa', en: 'Neutral (Bình)', level: 2 },
  'BĐ': { vi: 'Bất đắc địa', en: 'Unfavourable (Bất đắc)', level: 1 },
  H: { vi: 'Hãm', en: 'Weak (Hãm)', level: 0 },
};

// Lời giải thích nhẹ nhàng cho từng mức (không doạ)
export const GRADE_TEXT = {
  high: { vi: 'Sao ở vị trí sáng: phẩm chất của sao biểu hiện rõ nét và thuận lợi.', en: 'A bright placement: the star\'s qualities show clearly and easily.' },
  mid: { vi: 'Sao ở vị trí khá: phẩm chất biểu hiện ổn, càng có sao tốt hỗ trợ càng đẹp.', en: 'A fair placement: qualities show well, and supportive stars help further.' },
  low: { vi: 'Sao ở vị trí trung tính: năng lượng cần thêm thời gian và sự hỗ trợ để toả sáng.', en: 'A neutral placement: the energy needs time and support to shine.' },
  dim: { vi: 'Sao ở vị trí khó (hãm): phẩm chất của sao biểu hiện vất vả hơn, giống ánh sáng qua màn sương. Đây là nơi bạn học được nhiều nhất, và sự kiên nhẫn sẽ làm nó sáng dần.', en: 'A challenging placement: the star\'s gifts come through with more effort, like light through mist. This is where you learn the most, and patience lets it brighten.' },
};
export const gradeBand = (g) => {
  const lv = GRADES[g]?.level;
  return lv >= 4 ? 'high' : lv === 3 ? 'mid' : lv >= 1 ? 'low' : 'dim';
};

const row = (s) => s.split(' ').map((x) => (x === '?' ? null : x));

export const SCHOOLS = {
  'thai-thu-lang': {
    name: { vi: 'Thái Thứ Lang (Tử Vi Đẩu Số Tân Biên, 1956)', en: 'Thái Thứ Lang (Tử Vi Đẩu Số Tân Biên, 1956)' },
    note: {
      vi: 'Trường phái phổ biến nhất ở Việt Nam. Thang 5 mức: Miếu, Vượng, Đắc, Bình hòa, Hãm.',
      en: 'The most widely used school in Vietnam. Five grades: Miếu, Vượng, Đắc, Bình hòa, Hãm.',
    },
    source: 'https://tuvithuchanh.com/wp-content/uploads/2022/11/Tu-vi-dau-so.pdf',
    table: {
      //                   Tý Sửu Dần Mão Thìn Tỵ Ngọ Mùi Thân Dậu Tuất Hợi
      'tu-vi': row('B Đ M B V M M Đ M B V B'),
      'liem-trinh': row('V Đ V H M H V Đ V H M H'),
      'thien-dong': row('V H M Đ H Đ H H M H H Đ'),
      'vu-khuc': row('V M V Đ M H V M V Đ M H'),
      'thai-duong': row('H Đ V V V M M Đ H H H H'),
      'thien-co': row('Đ Đ H M M V Đ Đ V M M H'),
      'thien-phu': row('M B M B V Đ M Đ M B V Đ'),
      'thai-am': row('V Đ H H H H H Đ V M M M'),
      'tham-lang': row('H M Đ H V H H M Đ H V H'),
      'cu-mon': row('V H V M H H V H Đ M H Đ'),
      'thien-tuong': row('V Đ M H V Đ V Đ M H V Đ'),
      'thien-luong': row('V Đ V V M H M Đ V H M H'),
      'that-sat': row('M Đ M H H V M Đ M H H V'),
      'pha-quan': row('M V H H Đ H M V H H Đ H'),
      // Phụ tinh: sách ghi "đắc địa" ở các cung sau; Kình, Đà, Không, Kiếp ghi rõ còn lại là hãm.
      'kinh-duong': row('H Đ H H Đ H H Đ H H Đ H'),
      'da-la': row('H Đ H H Đ H H Đ H H Đ H'),
      'dia-khong': row('H H Đ H H Đ H H Đ H H Đ'),
      'dia-kiep': row('H H Đ H H Đ H H Đ H H Đ'),
      'hoa-tinh': row('? ? Đ Đ Đ Đ Đ ? ? ? ? ?'),
      'linh-tinh': row('? ? Đ Đ Đ Đ Đ ? ? ? ? ?'),
      'van-xuong': row('? Đ ? ? Đ Đ ? Đ ? ? Đ Đ'),
      'van-khuc': row('? Đ ? ? Đ Đ ? Đ ? ? Đ Đ'),
      'thien-ma': row('? ? Đ ? ? Đ ? ? ? ? ? ?'),
      'thien-hinh': row('? ? Đ Đ ? ? ? ? Đ Đ ? ?'),
      'thien-khoc': row('Đ Đ ? Đ ? ? Đ Đ ? Đ ? ?'),
      'thien-hu': row('Đ Đ ? Đ ? ? Đ Đ ? Đ ? ?'),
    },
  },
  'toan-thu': {
    name: { vi: 'Tử Vi Đẩu Số Toàn Thư (thiên Mệnh cung)', en: 'Tử Vi Đẩu Số Toàn Thư (Life-palace chapter)' },
    note: {
      vi: 'Sách gốc Trung Hoa. Thang 7 mức: Miếu, Vượng, Đắc địa, Lợi, Bình, Bất đắc địa, Hãm. Ba ô sách không ghi: Tử Vi tại Tý, Thiên Lương tại Tỵ và Hợi.',
      en: 'The classical Chinese text. Seven grades: Miếu, Vượng, Đắc, Lợi, Bình, Bất đắc, Hãm. Three cells are not stated in the book: Tử Vi in Tý, Thiên Lương in Tỵ and Hợi.',
    },
    source: 'https://ziweihome.com/zh-hans/xingyao/miaowang',
    table: {
      'tu-vi': row('? M V V Đ V M M V V Đ V'),
      'thien-co': row('M H Đ V L B M H Đ V L B'),
      'thai-duong': row('H H V M V V V Đ Đ B H H'),
      'vu-khuc': row('V M Đ L M B V M Đ L M B'),
      'thien-dong': row('V BĐ L B B M H BĐ V B B M'),
      'liem-trinh': row('B L B B L H B L M B L H'),
      'thien-phu': row('V M M M M Đ V M Đ V M Đ'),
      'thai-am': row('M M M H H H H L L M M M'),
      'tham-lang': row('V M B L M H V M B L M H'),
      'cu-mon': row('V BĐ M M B V V BĐ M M B V'),
      'thien-tuong': row('M M M H Đ Đ M Đ M H Đ Đ'),
      'thien-luong': row('M M M M M ? M M H Đ M ?'),
      'that-sat': row('V M M V M B V M M V M B'),
      'pha-quan': row('M V Đ H V B M V Đ H V B'),
    },
  },
};

export const DEFAULT_SCHOOL = 'thai-thu-lang';

/** Độ sáng của một sao tại cung (chi) theo trường phái; null nếu nguồn không ghi. */
export const brightness = (school, starId, chi) => SCHOOLS[school]?.table[starId]?.[chi] ?? null;
