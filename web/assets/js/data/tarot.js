// Bộ Tarot 78 lá theo hướng "huyền học tỉnh táo":
// mỗi lá là một tấm gương để tự soi, không phải lời phán về tương lai.

const MAJOR = [
  ['Chàng Khờ', 'The Fool', 'khởi đầu, tự do, tin vào hành trình', 'liều lĩnh, sợ bắt đầu', 'Có một bước đi bạn đang chần chừ chỉ vì sợ trông ngốc nghếch.', 'Nếu không ai nhìn, bạn sẽ thử điều gì đầu tiên?'],
  ['Nhà Ảo Thuật', 'The Magician', 'năng lực, chủ động, biến ý tưởng thành thật', 'phân tán, nghi ngờ khả năng', 'Bạn có sẵn trong tay nhiều thứ hơn bạn nghĩ.', 'Kể ra ba thứ bạn đang có nhưng chưa dùng tới?'],
  ['Nữ Tư Tế', 'The High Priestess', 'trực giác, tĩnh lặng, điều ẩn giấu', 'phớt lờ tiếng nói bên trong', 'Câu trả lời đôi khi đã nằm sẵn trong im lặng.', 'Nếu tắt hết tiếng ồn, bạn nghe thấy mình muốn gì?'],
  ['Hoàng Hậu', 'The Empress', 'nuôi dưỡng, dồi dào, sáng tạo', 'cho đi quá nhiều, quên chăm mình', 'Bạn chăm người khác rất giỏi. Còn bản thân thì sao?', 'Hôm nay bạn có thể nuôi dưỡng mình bằng một việc nhỏ nào?'],
  ['Hoàng Đế', 'The Emperor', 'cấu trúc, ranh giới, vững vàng', 'cứng nhắc, kiểm soát quá mức', 'Sự vững vàng đến từ những ranh giới rõ ràng.', 'Điều gì bạn cần nói "không" để giữ gìn mình?'],
  ['Giáo Hoàng', 'The Hierophant', 'truyền thống, người dẫn đường, niềm tin', 'phá lệ, đi con đường riêng', 'Có những bài học của người đi trước đáng được lắng nghe.', 'Lời khuyên nào bạn từng nhận mà giờ mới thật sự hiểu?'],
  ['Tình Nhân', 'The Lovers', 'lựa chọn từ trái tim, kết nối, giá trị', 'mất cân bằng, lựa chọn vì sợ', 'Mỗi lựa chọn là một lần nói thật với chính mình.', 'Bạn đang chọn vì yêu, hay vì sợ?'],
  ['Cỗ Xe', 'The Chariot', 'ý chí, quyết tâm, tiến lên', 'mất phương hướng, kéo nhiều phía', 'Bạn đang bị kéo về nhiều hướng cùng lúc.', 'Nếu chỉ giữ một hướng đi trong tháng này, đó là gì?'],
  ['Sức Mạnh', 'Strength', 'dịu dàng, can đảm, kiên nhẫn', 'tự chê trách, mất tự tin', 'Sức mạnh thật sự là dịu dàng với điều khó khăn.', 'Phần nào trong bạn đang cần được vỗ về thay vì trách móc?'],
  ['Ẩn Sĩ', 'The Hermit', 'tĩnh tâm, tự soi, ở một mình', 'cô lập, trốn tránh', 'Ở một mình không phải cô đơn, mà là để tìm lại mình.', 'Lần cuối bạn ở một mình mà thấy dễ chịu là khi nào?'],
  ['Bánh Xe Số Phận', 'Wheel of Fortune', 'chu kỳ, thay đổi, thời điểm', 'kháng cự thay đổi', 'Mọi thứ đều xoay vòng, cả điều tệ lẫn điều tốt.', 'Điều gì từng tưởng như mãi mãi nhưng rồi đã qua?'],
  ['Công Lý', 'Justice', 'công bằng, sự thật, trách nhiệm', 'khắt khe với bản thân', 'Bạn có đang khắt khe với mình hơn với người khác?', 'Nếu bạn thân gặp chuyện như bạn, bạn sẽ nói gì với họ?'],
  ['Người Treo Ngược', 'The Hanged Man', 'tạm dừng, buông bỏ, góc nhìn mới', 'trì hoãn, mắc kẹt', 'Dừng lại không có nghĩa là thua.', 'Nếu nhìn chuyện này từ phía ngược lại, bạn thấy gì?'],
  ['Chuyển Hoá', 'Death', 'kết thúc để bắt đầu, thay da đổi thịt', 'bám víu cái cũ', 'Có điều gì đó đang cần được khép lại. Đây không phải điềm xấu, mà là một cánh cửa.', 'Bạn sẵn sàng để điều gì ra đi?'],
  ['Tiết Độ', 'Temperance', 'cân bằng, hài hoà, vừa đủ', 'thái quá, mất cân bằng', 'Không quá nhiều, không quá ít.', 'Bạn đang dư điều gì và thiếu điều gì?'],
  ['Ác Quỷ', 'The Devil', 'ràng buộc, thói quen, cám dỗ', 'thoát ra, nhận diện xiềng xích', 'Có những sợi xích chính ta tự đeo vào.', 'Thói quen nào đang lấy đi năng lượng của bạn?'],
  ['Toà Tháp', 'The Tower', 'đổ vỡ đột ngột, thức tỉnh', 'sợ đổ vỡ, né tránh sự thật', 'Có những thứ sụp xuống để mở ra một khoảng trời.', 'Từ một lần đổ vỡ trước đây, bạn đã học được gì?'],
  ['Ngôi Sao', 'The Star', 'hy vọng, chữa lành, bình yên', 'mất niềm tin, mệt mỏi', 'Sau cơn bão luôn có một vì sao.', 'Điều nhỏ nào hôm nay khiến bạn thấy còn hy vọng?'],
  ['Mặt Trăng', 'The Moon', 'mơ hồ, trực giác, nỗi sợ ẩn', 'sáng tỏ dần, vượt qua ảo giác', 'Không phải mọi bóng tối đều là thật.', 'Nỗi lo nào của bạn là sự thật, nỗi lo nào chỉ là tưởng tượng?'],
  ['Mặt Trời', 'The Sun', 'niềm vui, sáng tỏ, sức sống', 'niềm vui bị che khuất tạm thời', 'Bạn được phép vui mà không cần lý do.', 'Điều gì khiến đứa trẻ trong bạn mỉm cười?'],
  ['Phán Xét', 'Judgement', 'thức tỉnh, tiếng gọi, tha thứ', 'tự phán xét, nghi ngờ', 'Có một tiếng gọi bạn đã nghe từ lâu.', 'Bạn đang trì hoãn việc trở thành ai?'],
  ['Thế Giới', 'The World', 'trọn vẹn, hoàn thành, hội nhập', 'chưa khép lại, thiếu một mảnh', 'Bạn đã đi một chặng đường dài.', 'Hãy kể ra một điều bạn đã làm được mà ít ai biết.'],
];

const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];

export const SUITS = [
  { id: 'gay', name: 'Gậy', en: 'Wands', element: 'Lửa', domain: 'đam mê, hành động và cảm hứng' },
  { id: 'coc', name: 'Cốc', en: 'Cups', element: 'Nước', domain: 'cảm xúc, tình cảm và các mối quan hệ' },
  { id: 'kiem', name: 'Kiếm', en: 'Swords', element: 'Khí', domain: 'suy nghĩ, lời nói và sự thật' },
  { id: 'tien', name: 'Tiền', en: 'Pentacles', element: 'Đất', domain: 'công việc, tiền bạc và cơ thể' },
];

const RANKS = [
  ['Át', 'Ace', 'hạt giống', 'Hạt giống nào về {d} đang chờ bạn gieo?'],
  ['Hai', 'Two', 'lựa chọn và cân bằng', 'Bạn đang cân nhắc giữa hai điều gì về {d}?'],
  ['Ba', 'Three', 'phát triển', 'Điều gì về {d} đang lớn dần lên trong bạn?'],
  ['Bốn', 'Four', 'ổn định', 'Bạn cần giữ vững điều gì về {d}, và cần nới lỏng điều gì?'],
  ['Năm', 'Five', 'thử thách', 'Thử thách nào về {d} đang dạy bạn một bài học?'],
  ['Sáu', 'Six', 'hồi phục và hài hoà', 'Điều gì về {d} đang dần lành lại?'],
  ['Bảy', 'Seven', 'nhìn lại và đánh giá', 'Nếu nhìn lại chặng vừa qua về {d}, bạn tự hào điều gì?'],
  ['Tám', 'Eight', 'chuyển động', 'Bạn đang tiến về đâu trong chuyện {d}?'],
  ['Chín', 'Nine', 'gần chạm đích', 'Bạn còn cần thêm gì để đi nốt chặng cuối về {d}?'],
  ['Mười', 'Ten', 'hoàn tất một chu kỳ', 'Chu kỳ nào về {d} đang khép lại?'],
  ['Tiểu Đồng', 'Page', 'người học trò', 'Bạn muốn học thêm điều gì về {d}?'],
  ['Hiệp Sĩ', 'Knight', 'người hành động', 'Bạn sẵn sàng hành động thế nào cho {d}?'],
  ['Hoàng Hậu', 'Queen', 'người nuôi dưỡng', 'Bạn có thể nuôi dưỡng {d} của mình ra sao?'],
  ['Vua', 'King', 'người làm chủ', 'Làm chủ {d} với bạn trông như thế nào?'],
];

// [xuôi, ngược] cho từng lá phụ, theo thứ tự Át → Vua
const MINOR_KEYS = {
  gay: [
    ['cảm hứng, khởi đầu mới, tiềm năng', 'trì hoãn, thiếu động lực'],
    ['lên kế hoạch, tầm nhìn, quyết định', 'sợ thay đổi, do dự'],
    ['mở rộng, nhìn xa, chờ thành quả', 'chậm trễ, trở ngại'],
    ['ăn mừng, mái nhà, hoà hợp', 'bất ổn, giai đoạn chuyển tiếp'],
    ['cạnh tranh, va chạm nhỏ', 'né tránh mâu thuẫn, căng thẳng nội tâm'],
    ['chiến thắng, được ghi nhận', 'tự nghi ngờ, khát khao được công nhận'],
    ['giữ vững lập trường, bảo vệ điều mình tin', 'kiệt sức, muốn bỏ cuộc'],
    ['tốc độ, tin tức, mọi thứ chuyển động', 'chậm lại, vội vàng sai chỗ'],
    ['kiên cường, cố thêm lần cuối', 'mệt mỏi, phòng thủ quá mức'],
    ['gánh nặng, ôm quá nhiều trách nhiệm', 'buông bớt, biết nhờ giúp đỡ'],
    ['tò mò, khám phá, ý tưởng mới', 'thiếu định hướng, cả thèm chóng chán'],
    ['nhiệt huyết, phiêu lưu, dám làm', 'bốc đồng, nóng vội'],
    ['tự tin, ấm áp, quyết đoán', 'thiếu tự tin, so sánh bản thân'],
    ['lãnh đạo, tầm nhìn, truyền cảm hứng', 'độc đoán, kỳ vọng quá cao'],
  ],
  coc: [
    ['tình cảm mới, cảm xúc dạt dào', 'kìm nén cảm xúc'],
    ['kết nối, đồng điệu, hợp tác', 'mất cân bằng trong quan hệ'],
    ['tình bạn, ăn mừng, cộng đồng', 'xa cách bạn bè, vui quá đà'],
    ['thờ ơ, chiêm nghiệm, chán chường', 'nhận ra cơ hội mới'],
    ['mất mát, nuối tiếc', 'chấp nhận, bước tiếp'],
    ['hoài niệm, tuổi thơ, sự ngây thơ', 'mắc kẹt trong quá khứ'],
    ['nhiều lựa chọn, mộng tưởng', 'nhìn rõ, dám chọn'],
    ['rời đi để tìm ý nghĩa sâu hơn', 'sợ rời bỏ, lưỡng lự'],
    ['mãn nguyện, điều ước thành sự thật', 'hài lòng hời hợt'],
    ['hạnh phúc gia đình, viên mãn', 'rạn nứt, kỳ vọng lệch nhau'],
    ['nhạy cảm, sáng tạo, tin nhắn tình cảm', 'non nớt cảm xúc'],
    ['lãng mạn, theo đuổi lý tưởng', 'ảo tưởng, thất thường'],
    ['thấu cảm, trực giác, lắng nghe', 'quên mình vì người khác'],
    ['cân bằng cảm xúc, bao dung', 'kìm nén, khó mở lòng'],
  ],
  kiem: [
    ['sáng suốt, sự thật, đột phá', 'rối trí, hiểu lầm'],
    ['bế tắc, khó lựa chọn', 'quá tải thông tin'],
    ['đau lòng, tổn thương', 'hồi phục, tha thứ'],
    ['nghỉ ngơi, hồi sức', 'kiệt sức, cần dừng lại ngay'],
    ['xung đột, thắng thua', 'hoà giải, buông bỏ cái tôi'],
    ['chuyển tiếp, rời xa sóng gió', 'còn vướng bận'],
    ['chiến lược, giữ bí mật', 'thú nhận, nghe lương tâm'],
    ['tự giới hạn, cảm giác mắc kẹt', 'giải thoát, nhìn ra lối ra'],
    ['lo âu, mất ngủ, suy nghĩ quá nhiều', 'vượt qua nỗi sợ'],
    ['chạm đáy, kết thúc đau đớn', 'hồi sinh, chỉ còn đi lên'],
    ['tò mò, quan sát, ham học', 'nói trước nghĩ sau'],
    ['quyết liệt, nhanh nhạy', 'hấp tấp, nói lời làm tổn thương'],
    ['rõ ràng, độc lập, thẳng thắn', 'lạnh lùng, khép mình'],
    ['lý trí, công bằng, minh bạch', 'áp đặt, cứng nhắc'],
  ],
  tien: [
    ['cơ hội mới, khởi đầu vững', 'lỡ cơ hội, chuẩn bị chưa kỹ'],
    ['xoay xở, cân bằng nhiều việc', 'quá tải, rối ren'],
    ['hợp tác, tay nghề, làm việc nhóm', 'thiếu phối hợp'],
    ['giữ gìn, an toàn, tiết kiệm', 'bám víu, sợ mất'],
    ['khó khăn, thiếu thốn, bị bỏ rơi', 'hồi phục, tìm được trợ giúp'],
    ['cho và nhận, hào phóng', 'lệ thuộc, cho đi không cân xứng'],
    ['kiên nhẫn, chờ mùa gặt', 'nôn nóng, nghi ngờ công sức'],
    ['rèn luyện, chăm chỉ, tỉ mỉ', 'cầu toàn, nhàm chán'],
    ['tự chủ, sung túc, tự thưởng', 'phụ thuộc, làm quá sức'],
    ['gia đình, di sản, bền vững', 'bất ổn tài chính'],
    ['học hỏi, mục tiêu mới', 'thiếu tập trung'],
    ['đều đặn, đáng tin, bền bỉ', 'trì trệ, rập khuôn'],
    ['chăm lo, thực tế, ấm cúng', 'lo toan quá mức'],
    ['thịnh vượng, vững vàng, chu đáo', 'chạy theo vật chất'],
  ],
};

function buildDeck() {
  const deck = MAJOR.map(([name, en, up, rev, msg, q], i) => ({
    id: `major-${String(i).padStart(2, '0')}`,
    arcana: 'major',
    number: i,
    numeral: ROMAN[i],
    name,
    en,
    up,
    rev,
    msg,
    q,
  }));
  for (const suit of SUITS) {
    RANKS.forEach(([rankName, rankEn, stage, qTpl], r) => {
      const [up, rev] = MINOR_KEYS[suit.id][r];
      deck.push({
        id: `${suit.id}-${String(r + 1).padStart(2, '0')}`,
        arcana: 'minor',
        suit: suit.id,
        number: r + 1,
        numeral: r < 10 ? String(r + 1) : rankName,
        name: `${rankName} ${suit.name}`,
        en: `${rankEn} of ${suit.en}`,
        up,
        rev,
        msg: `Lá bài nói về ${suit.domain}, ở chặng "${stage}". Nguyên tố ${suit.element}.`,
        q: qTpl.replace('{d}', suit.domain.split(',')[0]),
      });
    });
  }
  return deck;
}

export const DECK = buildDeck();
export const cardById = Object.fromEntries(DECK.map((c) => [c.id, c]));
export const suitById = Object.fromEntries(SUITS.map((s) => [s.id, s]));

// Các kiểu trải bài
export const SPREADS = [
  { id: 'mot-la', name: 'Một lá cho hôm nay', positions: ['Thông điệp cho bạn'] },
  { id: 'ba-la', name: 'Quá khứ · Hiện tại · Tương lai', positions: ['Điều đã qua', 'Điều đang là', 'Điều có thể tới'] },
  { id: 'chua-lanh', name: 'Trải bài chữa lành', positions: ['Điều đang làm bạn đau', 'Điều bạn cần buông', 'Điều nuôi dưỡng bạn'] },
  { id: 'lua-chon', name: 'Hai ngả đường', positions: ['Nếu chọn A', 'Nếu chọn B', 'Điều trái tim bạn biết'] },
];
