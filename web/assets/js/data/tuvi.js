// Tử vi phương Đông — phần nền tảng: Can Chi, con giáp, mệnh nạp âm, ngũ hành.
// (Lá số Tử Vi Đẩu Số đầy đủ cần lịch âm chi tiết — để dành cho phiên bản sau.)

export const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];

export const CHI = [
  {
    id: 'ty-chuot', name: 'Tý', animal: 'Chuột', hanh: 'Thủy',
    traits: 'nhanh nhạy, khéo xoay xở, tiết kiệm, tinh ý',
    shadow: 'hay lo xa, đôi khi tính toán quá kỹ',
    heal: 'Người tuổi Tý luôn nghĩ trước mười bước. Hôm nay chỉ cần nghĩ một bước thôi: bước tiếp theo, nhẹ nhàng.',
  },
  {
    id: 'suu-trau', name: 'Sửu', animal: 'Trâu', hanh: 'Thổ',
    traits: 'chăm chỉ, nhẫn nại, đáng tin, kiên định',
    shadow: 'ôm việc một mình, ít khi kêu mệt',
    heal: 'Trâu cũng cần được tháo ách. Bạn được phép mệt, và được phép nói ra là mình mệt.',
  },
  {
    id: 'dan-ho', name: 'Dần', animal: 'Hổ', hanh: 'Mộc',
    traits: 'dũng cảm, mạnh mẽ, có chính kiến, bảo vệ người yếu',
    shadow: 'nóng nảy, khó chịu khi bị kiểm soát',
    heal: 'Hổ mạnh nhất không phải lúc gầm, mà lúc biết nằm nghỉ dưỡng sức. Hãy để mình được yên một lúc.',
  },
  {
    id: 'mao-meo', name: 'Mão', animal: 'Mèo', hanh: 'Mộc',
    traits: 'tinh tế, nhẹ nhàng, khéo léo, yêu sự yên bình',
    shadow: 'ngại va chạm, dễ tổn thương',
    heal: 'Mèo biết tìm chỗ nắng ấm để nằm. Bạn cũng vậy: hãy tìm cho mình một góc an toàn hôm nay.',
  },
  {
    id: 'thin-rong', name: 'Thìn', animal: 'Rồng', hanh: 'Thổ',
    traits: 'tự tin, giàu năng lượng, có hoài bão lớn',
    shadow: 'đặt kỳ vọng quá cao vào mình',
    heal: 'Rồng không cần bay mọi ngày. Có những ngày chỉ cần cuộn mình dưới mây và thở.',
  },
  {
    id: 'ty-ran', name: 'Tỵ', animal: 'Rắn', hanh: 'Hỏa',
    traits: 'sâu sắc, khôn ngoan, trực giác tốt, kín đáo',
    shadow: 'giữ kín cảm xúc, khó tin người',
    heal: 'Rắn lột xác để lớn lên. Lớp da cũ nào bạn sẵn sàng để lại phía sau?',
  },
  {
    id: 'ngo-ngua', name: 'Ngọ', animal: 'Ngựa', hanh: 'Hỏa',
    traits: 'phóng khoáng, nhiệt tình, yêu tự do, năng động',
    shadow: 'thiếu kiên nhẫn, dễ chán',
    heal: 'Ngựa chạy giỏi nhất khi đã được uống nước, nghỉ chân. Đừng quên dừng lại ở trạm.',
  },
  {
    id: 'mui-de', name: 'Mùi', animal: 'Dê', hanh: 'Thổ',
    traits: 'hiền hậu, nghệ sĩ, giàu lòng trắc ẩn',
    shadow: 'dễ lo âu, phụ thuộc vào sự công nhận',
    heal: 'Sự dịu dàng của bạn là món quà, không phải điểm yếu. Hãy dành một phần dịu dàng đó cho chính mình.',
  },
  {
    id: 'than-khi', name: 'Thân', animal: 'Khỉ', hanh: 'Kim',
    traits: 'thông minh, hài hước, sáng tạo, linh hoạt',
    shadow: 'hay giấu buồn sau tiếng cười',
    heal: 'Không phải lúc nào bạn cũng phải là người làm mọi người cười. Bạn được phép buồn trước mặt ai đó.',
  },
  {
    id: 'dau-ga', name: 'Dậu', animal: 'Gà', hanh: 'Kim',
    traits: 'chăm chỉ, thẳng thắn, chỉn chu, đúng giờ',
    shadow: 'cầu toàn, nói thẳng dễ làm mình và người khác đau',
    heal: 'Gà gáy đúng giờ mỗi sáng. Nhưng hôm nay, bạn được phép ngủ thêm một chút.',
  },
  {
    id: 'tuat-cho', name: 'Tuất', animal: 'Chó', hanh: 'Thổ',
    traits: 'trung thành, chính trực, tận tâm, bảo vệ người thân',
    shadow: 'lo lắng cho người khác đến quên mình',
    heal: 'Bạn luôn canh giữ cho người khác. Hôm nay để người khác canh giữ cho bạn một lần nhé.',
  },
  {
    id: 'hoi-lon', name: 'Hợi', animal: 'Lợn', hanh: 'Thủy',
    traits: 'hiền lành, rộng lượng, chân thành, biết hưởng thụ',
    shadow: 'cả tin, ngại từ chối',
    heal: 'Lòng tốt của bạn cần có hàng rào. Từ chối một lời nhờ vả không làm bạn kém tử tế đi.',
  },
];

// 30 cặp nạp âm theo vòng Lục Thập Hoa Giáp, bắt đầu từ Giáp Tý
export const NAP_AM = [
  ['Hải Trung Kim', 'Vàng trong biển'], ['Lư Trung Hỏa', 'Lửa trong lò'], ['Đại Lâm Mộc', 'Gỗ rừng già'],
  ['Lộ Bàng Thổ', 'Đất ven đường'], ['Kiếm Phong Kim', 'Vàng mũi kiếm'], ['Sơn Đầu Hỏa', 'Lửa trên núi'],
  ['Giản Hạ Thủy', 'Nước dưới khe'], ['Thành Đầu Thổ', 'Đất trên thành'], ['Bạch Lạp Kim', 'Vàng chân đèn'],
  ['Dương Liễu Mộc', 'Gỗ cây dương liễu'], ['Tuyền Trung Thủy', 'Nước trong suối'], ['Ốc Thượng Thổ', 'Đất trên mái nhà'],
  ['Tích Lịch Hỏa', 'Lửa sấm sét'], ['Tùng Bách Mộc', 'Gỗ tùng bách'], ['Trường Lưu Thủy', 'Nước chảy dài'],
  ['Sa Trung Kim', 'Vàng trong cát'], ['Sơn Hạ Hỏa', 'Lửa dưới núi'], ['Bình Địa Mộc', 'Gỗ đồng bằng'],
  ['Bích Thượng Thổ', 'Đất trên vách'], ['Kim Bạch Kim', 'Vàng pha bạc'], ['Phú Đăng Hỏa', 'Lửa ngọn đèn'],
  ['Thiên Hà Thủy', 'Nước trên trời'], ['Đại Trạch Thổ', 'Đất đầm lớn'], ['Thoa Xuyến Kim', 'Vàng trang sức'],
  ['Tang Đố Mộc', 'Gỗ cây dâu'], ['Đại Khê Thủy', 'Nước khe lớn'], ['Sa Trung Thổ', 'Đất pha cát'],
  ['Thiên Thượng Hỏa', 'Lửa trên trời'], ['Thạch Lựu Mộc', 'Gỗ cây thạch lựu'], ['Đại Hải Thủy', 'Nước biển lớn'],
];

export const HANH = {
  'Kim': { color: '#a7a9ac', tone: 'Trắng, xám, ánh bạc', support: 'Thổ', sinh: 'Thủy', khac: 'Mộc', trait: 'Quyết đoán, nguyên tắc, rõ ràng' },
  'Mộc': { color: '#5f9a6a', tone: 'Xanh lá', support: 'Thủy', sinh: 'Hỏa', khac: 'Thổ', trait: 'Sinh sôi, nhân hậu, phát triển' },
  'Thủy': { color: '#4f7fa8', tone: 'Đen, xanh dương', support: 'Kim', sinh: 'Mộc', khac: 'Hỏa', trait: 'Linh hoạt, sâu sắc, khôn khéo' },
  'Hỏa': { color: '#c7604a', tone: 'Đỏ, hồng, tím', support: 'Mộc', sinh: 'Thổ', khac: 'Kim', trait: 'Nhiệt huyết, sáng tạo, toả sáng' },
  'Thổ': { color: '#b8924f', tone: 'Vàng, nâu đất', support: 'Hỏa', sinh: 'Kim', khac: 'Thủy', trait: 'Vững chãi, bao dung, đáng tin' },
};

// Tam hợp và tứ hành xung (theo chỉ số địa chi)
export const TAM_HOP = [[8, 0, 4], [2, 6, 10], [5, 9, 1], [11, 3, 7]];
export const TU_XUNG = [[0, 6, 3, 9], [2, 8, 5, 11], [4, 10, 1, 7]];

export const chiById = Object.fromEntries(CHI.map((c, i) => [c.id, { ...c, index: i }]));

const mod = (n, m) => ((n % m) + m) % m;

/** Tính Can Chi + mệnh nạp âm cho một năm âm lịch. */
export function yearInfo(lunarYear) {
  const can = CAN[mod(lunarYear - 4, 10)];
  const chiIndex = mod(lunarYear - 4, 12);
  const chi = CHI[chiIndex];
  const [napAm, meaning] = NAP_AM[Math.floor(mod(lunarYear - 4, 60) / 2)];
  const hanh = napAm.split(' ').pop();
  const hop = TAM_HOP.find((g) => g.includes(chiIndex)).filter((i) => i !== chiIndex).map((i) => CHI[i]);
  const xung = TU_XUNG.find((g) => g.includes(chiIndex)).filter((i) => i !== chiIndex).map((i) => CHI[i]);
  return { year: lunarYear, can, chi, chiIndex, canChi: `${can} ${chi.name}`, napAm, meaning, hanh, hop, xung };
}
