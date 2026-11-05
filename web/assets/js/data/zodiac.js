// 12 cung hoàng đạo (chiêm tinh phương Tây, theo cung Mặt Trời).
// from/to: [tháng, ngày]. Ngày chuyển cung có thể lệch ±1 ngày tuỳ năm.
export const SIGNS = [
  {
    id: 'bach-duong', name: 'Bạch Dương', en: 'Aries', glyph: '♈', from: [3, 21], to: [4, 19],
    element: 'Lửa', modality: 'Tiên phong', ruler: 'Sao Hoả',
    keywords: 'can đảm, thẳng thắn, nhiệt huyết',
    light: 'Dám bắt đầu khi người khác còn đang suy nghĩ. Năng lượng của bạn kéo cả nhóm đi lên.',
    shadow: 'Nóng vội, dễ bùng lên rồi nguội nhanh, khó chờ đợi.',
    heal: 'Khi tổn thương, Bạch Dương thường lao vào việc để quên. Hãy cho phép mình dừng lại. Đứng yên không có nghĩa là thua.',
  },
  {
    id: 'kim-nguu', name: 'Kim Ngưu', en: 'Taurus', glyph: '♉', from: [4, 20], to: [5, 20],
    element: 'Đất', modality: 'Kiên định', ruler: 'Sao Kim',
    keywords: 'bền bỉ, đáng tin, yêu cái đẹp',
    light: 'Bạn là chỗ dựa vững chãi. Bạn biết tận hưởng những điều giản dị: bữa ăn ngon, chăn ấm, âm nhạc.',
    shadow: 'Cố chấp, ngại thay đổi, bám víu vào sự an toàn.',
    heal: 'Kim Ngưu chữa lành qua cơ thể: ăn chậm, ngủ đủ, chạm vào thiên nhiên. Thay đổi đến từ từ cũng được, miễn là nó đến.',
  },
  {
    id: 'song-tu', name: 'Song Tử', en: 'Gemini', glyph: '♊', from: [5, 21], to: [6, 20],
    element: 'Khí', modality: 'Linh hoạt', ruler: 'Sao Thuỷ',
    keywords: 'tò mò, linh hoạt, giỏi giao tiếp',
    light: 'Đầu óc nhanh nhạy, chuyện gì cũng muốn biết, nói chuyện với ai cũng hợp.',
    shadow: 'Phân tán, cả thèm chóng chán, nghĩ nhiều hơn cảm.',
    heal: 'Song Tử cần viết ra. Khi đầu óc ồn ào quá, hãy đổ hết lên giấy. Bạn không cần trả lời mọi câu hỏi ngay hôm nay.',
  },
  {
    id: 'cu-giai', name: 'Cự Giải', en: 'Cancer', glyph: '♋', from: [6, 21], to: [7, 22],
    element: 'Nước', modality: 'Tiên phong', ruler: 'Mặt Trăng',
    keywords: 'chở che, giàu cảm xúc, gắn bó',
    light: 'Bạn là "nhà" của nhiều người. Trực giác tốt, nhớ lâu, thương sâu.',
    shadow: 'Nhạy cảm, dễ thu mình vào vỏ, ôm quá khứ.',
    heal: 'Cự Giải hay chăm người khác trước. Hôm nay hãy là "nhà" cho chính mình: nấu một món, gọi một cuộc điện thoại về nhà.',
  },
  {
    id: 'su-tu', name: 'Sư Tử', en: 'Leo', glyph: '♌', from: [7, 23], to: [8, 22],
    element: 'Lửa', modality: 'Kiên định', ruler: 'Mặt Trời',
    keywords: 'rạng rỡ, hào phóng, sáng tạo',
    light: 'Bạn toả sáng tự nhiên. Trái tim rộng, trung thành, khiến người khác thấy mình được nhìn thấy.',
    shadow: 'Cần được công nhận, tự ái, ngại để lộ sự yếu đuối.',
    heal: 'Giá trị của Sư Tử không nằm ở tràng pháo tay. Bạn vẫn quý giá ngay cả trong những ngày chẳng ai nhìn thấy.',
  },
  {
    id: 'xu-nu', name: 'Xử Nữ', en: 'Virgo', glyph: '♍', from: [8, 23], to: [9, 22],
    element: 'Đất', modality: 'Linh hoạt', ruler: 'Sao Thuỷ',
    keywords: 'tỉ mỉ, chu đáo, thích giúp đỡ',
    light: 'Bạn nhìn ra chi tiết người khác bỏ sót, và lặng lẽ làm mọi thứ tốt hơn.',
    shadow: 'Cầu toàn, tự phê bình, lo lắng vì những điều nhỏ.',
    heal: 'Xử Nữ ơi, "đủ tốt" cũng là tốt. Hãy viết ra ba điều bạn đã làm được hôm nay trước khi nghĩ tới điều chưa làm.',
  },
  {
    id: 'thien-binh', name: 'Thiên Bình', en: 'Libra', glyph: '♎', from: [9, 23], to: [10, 22],
    element: 'Khí', modality: 'Tiên phong', ruler: 'Sao Kim',
    keywords: 'hài hoà, tinh tế, công bằng',
    light: 'Bạn có khiếu thẩm mỹ, biết lắng nghe hai phía và kết nối mọi người.',
    shadow: 'Do dự, chiều lòng người khác, sợ xung đột.',
    heal: 'Thiên Bình cũng cần đặt mình lên bàn cân. Nói "không" một lần không làm thế giới mất cân bằng.',
  },
  {
    id: 'bo-cap', name: 'Bọ Cạp', en: 'Scorpio', glyph: '♏', from: [10, 23], to: [11, 21],
    element: 'Nước', modality: 'Kiên định', ruler: 'Sao Diêm Vương · Sao Hoả',
    keywords: 'sâu sắc, mãnh liệt, trung thành',
    light: 'Bạn nhìn thấu bề mặt. Khi đã tin, bạn tin trọn vẹn và đi đến cùng.',
    shadow: 'Đa nghi, giữ kín, khó buông bỏ vết thương cũ.',
    heal: 'Bọ Cạp mạnh nhất khi dám mềm lòng. Tha thứ không phải để quên, mà để bạn không phải mang nó theo nữa.',
  },
  {
    id: 'nhan-ma', name: 'Nhân Mã', en: 'Sagittarius', glyph: '♐', from: [11, 22], to: [12, 21],
    element: 'Lửa', modality: 'Linh hoạt', ruler: 'Sao Mộc',
    keywords: 'tự do, lạc quan, ham khám phá',
    light: 'Bạn mang lại tiếng cười và góc nhìn rộng. Thích học, thích đi, thích những câu hỏi lớn.',
    shadow: 'Ngại ràng buộc, nói thẳng quá mức, khó theo đến cùng.',
    heal: 'Không phải nỗi buồn nào cũng chạy trốn được bằng một chuyến đi. Đôi khi hành trình xa nhất là ngồi yên với chính mình.',
  },
  {
    id: 'ma-ket', name: 'Ma Kết', en: 'Capricorn', glyph: '♑', from: [12, 22], to: [1, 19],
    element: 'Đất', modality: 'Tiên phong', ruler: 'Sao Thổ',
    keywords: 'kỷ luật, trách nhiệm, kiên trì',
    light: 'Bạn leo núi từng bước một và hiếm khi bỏ cuộc. Người khác tin tưởng giao việc khó cho bạn.',
    shadow: 'Khắt khe, làm việc quá sức, coi nghỉ ngơi là lười.',
    heal: 'Ma Kết à, nghỉ ngơi cũng là một phần của leo núi. Bạn không cần phải kiếm được quyền được nghỉ.',
  },
  {
    id: 'bao-binh', name: 'Bảo Bình', en: 'Aquarius', glyph: '♒', from: [1, 20], to: [2, 18],
    element: 'Khí', modality: 'Kiên định', ruler: 'Sao Thiên Vương · Sao Thổ',
    keywords: 'độc lập, khác biệt, nhân văn',
    light: 'Bạn nghĩ trước thời đại, quan tâm đến cộng đồng và không ngại khác người.',
    shadow: 'Xa cách cảm xúc, bướng bỉnh, khó để người khác lại gần.',
    heal: 'Bảo Bình thương cả thế giới nhưng hay quên thương mình. Cho phép một người lại gần thêm một chút nhé.',
  },
  {
    id: 'song-ngu', name: 'Song Ngư', en: 'Pisces', glyph: '♓', from: [2, 19], to: [3, 20],
    element: 'Nước', modality: 'Linh hoạt', ruler: 'Sao Hải Vương · Sao Mộc',
    keywords: 'mơ mộng, thấu cảm, giàu tưởng tượng',
    light: 'Bạn cảm được nỗi đau của người khác và biến cảm xúc thành nghệ thuật.',
    shadow: 'Dễ trốn vào mộng tưởng, thiếu ranh giới, ôm nỗi buồn của người khác.',
    heal: 'Song Ngư cần ranh giới như cá cần nước sạch. Không phải nỗi buồn nào bạn cảm thấy cũng là của bạn.',
  },
];

export const signById = Object.fromEntries(SIGNS.map((s) => [s.id, s]));

export const ELEMENTS = {
  'Lửa': 'Hành động, đam mê, nhiệt huyết',
  'Đất': 'Thực tế, bền bỉ, vững vàng',
  'Khí': 'Tư duy, giao tiếp, kết nối',
  'Nước': 'Cảm xúc, trực giác, thấu cảm',
};

/** Tìm cung Mặt Trời theo ngày/tháng dương lịch. */
export function signFromDate(month, day) {
  const md = month * 100 + day;
  for (const s of SIGNS) {
    const a = s.from[0] * 100 + s.from[1];
    const b = s.to[0] * 100 + s.to[1];
    if (a <= b ? md >= a && md <= b : md >= a || md <= b) return s;
  }
  return null;
}

/** Hiển thị ký hiệu cung dưới dạng chữ (không biến thành emoji). */
export const glyph = (s) => s.glyph + '︎';

export const dateRange = (s) => `${s.from[1]}/${s.from[0]} – ${s.to[1]}/${s.to[0]}`;
