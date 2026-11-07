// Ý nghĩa sao và cung trong Tử Vi Đẩu Số, viết theo giọng "chiêm nghiệm, chữa lành":
// nói về khuynh hướng năng lượng và tâm thế, không phán định số phận, không bảo người đọc phải làm gì.
// Tính chất gốc của sao theo sách truyền thống (Thái Thứ Lang, Nguyễn Phát Lộc); lời văn do Hữu Duyên biên soạn.
// Mỗi chuỗi có hai bản { vi, en }.

export const STARS = {
  // ---------- 14 chính tinh ----------
  'tu-vi': {
    name: { vi: 'Tử Vi', en: 'Tử Vi (Emperor)' }, hanh: 'Thổ',
    core: { vi: 'Đế tinh: tự trọng, có tầm nhìn, muốn làm chủ cuộc đời mình và che chở người khác.', en: 'The Emperor star: self-respect, vision, a wish to steer one\'s own life and shelter others.' },
    light: { vi: 'Phong thái điềm đạm, đáng tin, biết gánh vác và tổ chức.', en: 'Calm presence, trustworthy, able to carry responsibility and organise.' },
    shadow: { vi: 'Đôi khi tự đặt mình lên cao quá, ngại nhờ vả, khó nghe góp ý.', en: 'Can hold oneself too high, find it hard to ask for help or hear feedback.' },
    energy: { vi: 'Năng lượng của người dẫn dắt hiền hoà: càng biết lắng nghe, sự vững vàng càng toả rộng.', en: 'The energy of a gentle leader: the more you listen, the wider your steadiness reaches.' },
  },
  'thien-co': {
    name: { vi: 'Thiên Cơ', en: 'Thiên Cơ (Strategist)' }, hanh: 'Mộc',
    core: { vi: 'Sao của trí tuệ linh hoạt, mưu lược, thích suy xét và thay đổi.', en: 'The star of nimble intelligence, planning, reflection and change.' },
    light: { vi: 'Nhanh hiểu, khéo tay, giỏi tìm cách, thương người một cách tinh tế.', en: 'Quick to understand, skilful, resourceful, caring in subtle ways.' },
    shadow: { vi: 'Nghĩ nhiều, dễ lo, khó đứng yên một chỗ.', en: 'Overthinking, prone to worry, restless.' },
    energy: { vi: 'Đầu óc bạn là một khu vườn: cần được tưới bằng sự tĩnh lặng chứ không chỉ bằng ý tưởng.', en: 'Your mind is a garden: it needs stillness as much as new ideas.' },
  },
  'thai-duong': {
    name: { vi: 'Thái Dương', en: 'Thái Dương (Sun)' }, hanh: 'Hỏa',
    core: { vi: 'Mặt Trời: rộng lượng, ngay thẳng, thích cho đi và toả sáng vì người khác.', en: 'The Sun: generous, upright, glad to give and to shine for others.' },
    light: { vi: 'Nhiệt tình, công tâm, có tinh thần phục vụ, dễ được tin yêu.', en: 'Warm, fair-minded, service-oriented, easily trusted.' },
    shadow: { vi: 'Cho đi tới cạn, dễ mệt vì gánh việc chung, sĩ diện.', en: 'Gives until empty, tires from carrying others, proud.' },
    energy: { vi: 'Mặt Trời cũng có lúc lặn. Nghỉ ngơi là cách để bạn mọc lại rạng rỡ hơn.', en: 'Even the Sun sets. Rest is how you rise brighter.' },
  },
  'vu-khuc': {
    name: { vi: 'Vũ Khúc', en: 'Vũ Khúc (General of Wealth)' }, hanh: 'Kim',
    core: { vi: 'Tài tinh: quyết đoán, thực tế, bền chí với mục tiêu vật chất và trách nhiệm.', en: 'The wealth star: decisive, practical, persistent with material goals and duties.' },
    light: { vi: 'Làm việc chắc chắn, giữ lời, quản lý tiền bạc và nguồn lực giỏi.', en: 'Reliable, keeps promises, good with money and resources.' },
    shadow: { vi: 'Cứng rắn, ít bộc lộ cảm xúc, dễ cô độc trong sự mạnh mẽ.', en: 'Hard-edged, rarely shows feelings, can feel alone in strength.' },
    energy: { vi: 'Kim loại quý nhất khi được mài giũa bằng sự mềm mại. Cho phép mình được dịu lại.', en: 'Metal shines when polished by softness. Let yourself soften.' },
  },
  'thien-dong': {
    name: { vi: 'Thiên Đồng', en: 'Thiên Đồng (Child of Heaven)' }, hanh: 'Thủy',
    core: { vi: 'Phúc tinh: hiền hoà, hồn nhiên, biết hưởng niềm vui giản dị.', en: 'The blessing star: gentle, childlike, able to enjoy simple joys.' },
    light: { vi: 'Dễ gần, giỏi xoa dịu, mang lại không khí bình an.', en: 'Approachable, soothing, brings a peaceful atmosphere.' },
    shadow: { vi: 'Ngại khó, dễ trôi theo dòng, cần thời gian để trưởng thành.', en: 'Avoids hardship, drifts, matures slowly.' },
    energy: { vi: 'Sự nhẹ nhàng của bạn là một món quà. Những chặng gian nan thường là lúc nó lớn lên thành sức mạnh.', en: 'Your lightness is a gift; hard seasons are where it grows into strength.' },
  },
  'liem-trinh': {
    name: { vi: 'Liêm Trinh', en: 'Liêm Trinh (Integrity)' }, hanh: 'Hỏa',
    core: { vi: 'Sao của nguyên tắc và đam mê: liêm chính, mãnh liệt, có sức hút.', en: 'The star of principle and passion: integrity, intensity, charisma.' },
    light: { vi: 'Ngay thẳng, có kỷ luật, dám đứng về lẽ phải.', en: 'Upright, disciplined, willing to stand for what is right.' },
    shadow: { vi: 'Cảm xúc mạnh dễ thành nóng nảy hoặc tự dằn vặt.', en: 'Strong feelings can turn to temper or self-reproach.' },
    energy: { vi: 'Ngọn lửa của bạn ấm nhất khi có ranh giới rõ ràng: rực cháy mà không thiêu đốt chính mình.', en: 'Your fire is warmest with clear boundaries: burning without burning yourself.' },
  },
  'thien-phu': {
    name: { vi: 'Thiên Phủ', en: 'Thiên Phủ (Treasury)' }, hanh: 'Thổ',
    core: { vi: 'Kho trời: ổn định, bao dung, biết tích luỹ và giữ gìn.', en: 'The heavenly treasury: stable, tolerant, good at gathering and keeping.' },
    light: { vi: 'Chín chắn, rộng rãi, có khả năng chăm lo cho nhiều người.', en: 'Mature, generous, able to care for many.' },
    shadow: { vi: 'Thận trọng quá mức, ngại thay đổi, giữ cảm xúc trong kho.', en: 'Over-cautious, change-averse, keeps feelings locked away.' },
    energy: { vi: 'Kho đầy là để chia sẻ. Hãy để mình cũng được nhận lại từ người khác.', en: 'A full treasury is meant to be shared — let yourself receive too.' },
  },
  'thai-am': {
    name: { vi: 'Thái Âm', en: 'Thái Âm (Moon)' }, hanh: 'Thủy',
    core: { vi: 'Mặt Trăng: dịu dàng, giàu cảm xúc, tinh tế, gắn với mái ấm và sự tích luỹ.', en: 'The Moon: tender, emotional, refined, linked to home and quiet accumulation.' },
    light: { vi: 'Nhạy cảm với cái đẹp, chu đáo, biết vun vén.', en: 'Sensitive to beauty, thoughtful, careful with resources.' },
    shadow: { vi: 'Dễ buồn theo con nước, hay giữ nỗi niềm trong lòng.', en: 'Moods follow the tides; tends to keep sorrows inside.' },
    energy: { vi: 'Trăng có khuyết có tròn. Cảm xúc thay đổi không làm bạn kém vững vàng.', en: 'The Moon waxes and wanes. Changing moods do not make you less whole.' },
  },
  'tham-lang': {
    name: { vi: 'Tham Lang', en: 'Tham Lang (Desire)' }, hanh: 'Thủy',
    core: { vi: 'Sao của khát khao và tài hoa: ham sống, đa năng, giỏi giao tế.', en: 'The star of desire and talent: hungry for life, versatile, sociable.' },
    light: { vi: 'Duyên dáng, học nhanh, có óc nghệ thuật và kinh doanh.', en: 'Charming, quick learner, artistic and enterprising.' },
    shadow: { vi: 'Muốn nhiều thứ cùng lúc, dễ bị cuốn vào thú vui.', en: 'Wants many things at once, easily swept up in pleasures.' },
    energy: { vi: 'Khát khao là la bàn chứ không phải xiềng xích. Điều gì thật sự nuôi dưỡng bạn?', en: 'Desire is a compass, not a chain. What truly nourishes you?' },
  },
  'cu-mon': {
    name: { vi: 'Cự Môn', en: 'Cự Môn (Great Gate)' }, hanh: 'Thủy',
    core: { vi: 'Sao của lời nói và sự thật: sắc sảo, thích tìm hiểu đến tận cùng.', en: 'The star of speech and truth: sharp, eager to get to the bottom of things.' },
    light: { vi: 'Ăn nói có sức thuyết phục, giỏi phân tích, hợp nghề dùng lời.', en: 'Persuasive, analytical, suited to work with words.' },
    shadow: { vi: 'Hay nghi ngờ, lời nói thẳng dễ gây hiểu lầm.', en: 'Suspicious at times; blunt words can be misunderstood.' },
    energy: { vi: 'Lời nói của bạn có sức nặng. Khi nói bằng lòng trắc ẩn, nó trở thành ánh sáng.', en: 'Your words carry weight. Spoken with compassion, they become light.' },
  },
  'thien-tuong': {
    name: { vi: 'Thiên Tướng', en: 'Thiên Tướng (Minister)' }, hanh: 'Thủy',
    core: { vi: 'Ấn tinh: chính trực, trọng nghĩa, thích giúp đỡ và hoà giải.', en: 'The seal star: upright, loyal, keen to help and mediate.' },
    light: { vi: 'Đáng tin, có phong thái, đứng ra bảo vệ lẽ công bằng.', en: 'Trustworthy, dignified, defends fairness.' },
    shadow: { vi: 'Dễ ôm việc của người khác, chịu ảnh hưởng của môi trường.', en: 'Takes on others\' burdens, easily shaped by surroundings.' },
    energy: { vi: 'Bạn giỏi giữ cân bằng cho người khác; hãy giữ một phần cân bằng ấy cho mình.', en: 'You balance things for others; keep some of that balance for yourself.' },
  },
  'thien-luong': {
    name: { vi: 'Thiên Lương', en: 'Thiên Lương (Elder)' }, hanh: 'Mộc',
    core: { vi: 'Ấm tinh: hiền đức, chở che, có tâm của người thầy, người thuốc.', en: 'The shelter star: kind, protective, with the heart of a teacher or healer.' },
    light: { vi: 'Điềm tĩnh, hay giúp người, được quý nhân nâng đỡ.', en: 'Calm, helpful, often supported by benefactors.' },
    shadow: { vi: 'Dễ thành người "cứu" mọi người, đôi khi cô độc vì nhìn quá xa.', en: 'Can become everyone\'s rescuer; sometimes lonely in seeing far ahead.' },
    energy: { vi: 'Cây lớn che bóng cho nhiều người, nhưng rễ của nó cũng cần nước.', en: 'A great tree shades many, but its roots need water too.' },
  },
  'that-sat': {
    name: { vi: 'Thất Sát', en: 'Thất Sát (Seven Killings)' }, hanh: 'Kim',
    core: { vi: 'Tướng tinh: can đảm, độc lập, dám mở đường và vượt khó.', en: 'The general\'s star: brave, independent, a trailblazer through hardship.' },
    light: { vi: 'Quyết liệt, bền bỉ, mạnh mẽ trong những lúc người khác chùn bước.', en: 'Resolute, enduring, strong when others hesitate.' },
    shadow: { vi: 'Nóng vội, cô độc trên con đường riêng, thích tự gánh.', en: 'Impatient, solitary on its own path, carries things alone.' },
    energy: { vi: 'Lòng can đảm lớn nhất đôi khi là để người khác đi cùng mình.', en: 'Sometimes the greatest courage is letting others walk with you.' },
  },
  'pha-quan': {
    name: { vi: 'Phá Quân', en: 'Phá Quân (Vanguard)' }, hanh: 'Thủy',
    core: { vi: 'Sao của đổi mới: phá cũ dựng mới, thích tự do và thử thách.', en: 'The star of renewal: breaking the old to build anew, loving freedom and challenge.' },
    light: { vi: 'Dám nghĩ dám làm, không sợ bắt đầu lại, có sức sáng tạo lớn.', en: 'Bold, unafraid to start over, deeply creative.' },
    shadow: { vi: 'Đời nhiều biến động, khó kiên nhẫn với sự lặp lại.', en: 'A life of upheavals; little patience for routine.' },
    energy: { vi: 'Thay đổi là đất của bạn. Gieo vào đó những hạt giống bạn thật lòng muốn thấy lớn lên.', en: 'Change is your soil. Plant in it the seeds you truly want to grow.' },
  },

  // ---------- Phụ tinh ----------
  'van-xuong': { name: { vi: 'Văn Xương', en: 'Văn Xương (Literary Star)' }, kind: 'good', note: { vi: 'Học hành, chữ nghĩa, sự tinh tế.', en: 'Learning, writing, refinement.' } },
  'van-khuc': { name: { vi: 'Văn Khúc', en: 'Văn Khúc (Arts Star)' }, kind: 'good', note: { vi: 'Năng khiếu nghệ thuật, ăn nói, âm nhạc.', en: 'Artistic gifts, eloquence, music.' } },
  'ta-phu': { name: { vi: 'Tả Phù', en: 'Tả Phù (Left Helper)' }, kind: 'good', note: { vi: 'Sự trợ giúp, người đồng hành.', en: 'Support, companions.' } },
  'huu-bat': { name: { vi: 'Hữu Bật', en: 'Hữu Bật (Right Helper)' }, kind: 'good', note: { vi: 'Sự hỗ trợ, tình thân giúp đỡ.', en: 'Help, kindred support.' } },
  'thien-khoi': { name: { vi: 'Thiên Khôi', en: 'Thiên Khôi (Noble Helper)' }, kind: 'good', note: { vi: 'Quý nhân, người nâng đỡ công khai.', en: 'Benefactors, open support.' } },
  'thien-viet': { name: { vi: 'Thiên Việt', en: 'Thiên Việt (Hidden Helper)' }, kind: 'good', note: { vi: 'Quý nhân thầm lặng, cơ hội bất ngờ.', en: 'Quiet benefactors, unexpected chances.' } },
  'loc-ton': { name: { vi: 'Lộc Tồn', en: 'Lộc Tồn (Prosperity)' }, kind: 'good', note: { vi: 'Sự tích luỹ, phúc lộc bền bỉ.', en: 'Steady accumulation, lasting blessings.' } },
  'thien-ma': { name: { vi: 'Thiên Mã', en: 'Thiên Mã (Heavenly Horse)' }, kind: 'good', note: { vi: 'Di chuyển, thay đổi, năng động.', en: 'Movement, change, dynamism.' } },
  'kinh-duong': { name: { vi: 'Kình Dương', en: 'Kình Dương (Ram)' }, kind: 'hard', note: { vi: 'Sức mạnh sắc bén: dễ va chạm, cũng là ý chí vượt khó.', en: 'Sharp force: friction, and also will to overcome.' } },
  'da-la': { name: { vi: 'Đà La', en: 'Đà La (Spinning Top)' }, kind: 'hard', note: { vi: 'Sự chậm trễ, vướng víu — bài học về kiên nhẫn.', en: 'Delays and tangles — lessons in patience.' } },
  'dia-khong': { name: { vi: 'Địa Không', en: 'Địa Không (Void)' }, kind: 'hard', note: { vi: 'Khoảng trống: điều mất đi mở chỗ cho tư duy khác thường.', en: 'Emptiness: loss that makes room for unusual thinking.' } },
  'dia-kiep': { name: { vi: 'Địa Kiếp', en: 'Địa Kiếp (Robbery)' }, kind: 'hard', note: { vi: 'Biến động bất ngờ — nhắc mình đừng bám chặt vào vật ngoài thân.', en: 'Sudden shifts — a reminder not to cling to possessions.' } },
  'hoa-tinh': { name: { vi: 'Hỏa Tinh', en: 'Hỏa Tinh (Fire Star)' }, kind: 'hard', note: { vi: 'Năng lượng bộc phát, nóng vội; cũng là sự nhiệt thành.', en: 'Bursts of energy, haste; also fervour.' } },
  'linh-tinh': { name: { vi: 'Linh Tinh', en: 'Linh Tinh (Bell Star)' }, kind: 'hard', note: { vi: 'Lo âu âm ỉ; cũng là sự nhạy bén.', en: 'Smouldering worry; also keen perception.' } },

  // ---------- Tứ Hóa ----------
  'hoa-loc': { name: { vi: 'Hóa Lộc', en: 'Hóa Lộc (Abundance)' }, short: { vi: 'Lộc', en: 'Lộc' }, note: { vi: 'Nguồn chảy dồi dào, cơ hội và duyên lành.', en: 'Abundant flow, opportunity, good connections.' } },
  'hoa-quyen': { name: { vi: 'Hóa Quyền', en: 'Hóa Quyền (Authority)' }, short: { vi: 'Quyền', en: 'Quyền' }, note: { vi: 'Sức ảnh hưởng, khả năng làm chủ.', en: 'Influence, ability to take charge.' } },
  'hoa-khoa': { name: { vi: 'Hóa Khoa', en: 'Hóa Khoa (Recognition)' }, short: { vi: 'Khoa', en: 'Khoa' }, note: { vi: 'Danh tiếng, học vấn, sự hoá giải.', en: 'Reputation, learning, gentle resolution.' } },
  'hoa-ky': { name: { vi: 'Hóa Kỵ', en: 'Hóa Kỵ (Attachment)' }, short: { vi: 'Kỵ', en: 'Kỵ' }, note: { vi: 'Nơi mình hay bận lòng nhất — cũng là nơi mình học được nhiều nhất.', en: 'Where you tend to worry most — and where you learn the most.' } },
};

// ---------- Phụ tinh bổ sung + ba vòng sao (Tràng Sinh, Bác Sĩ, Thái Tuế) ----------
const s = (vi, en, nvi, nen) => ({ name: { vi, en }, note: { vi: nvi, en: nen } });
Object.assign(STARS, {
  'long-tri': s('Long Trì', 'Long Trì (Dragon Pool)', 'Tài hoa, sự thanh nhã.', 'Talent and grace.'),
  'phuong-cac': s('Phượng Các', 'Phượng Các (Phoenix Pavilion)', 'Vẻ đẹp, danh tiếng nhẹ nhàng.', 'Beauty and gentle renown.'),
  'giai-than': s('Giải Thần', 'Giải Thần (Releasing Spirit)', 'Sự hoá giải, gỡ rối.', 'Easing and untangling.'),
  'thien-khoc': s('Thiên Khốc', 'Thiên Khốc (Weeping Star)', 'Cảm xúc sâu; nỗi buồn được nói ra cũng là chữa lành.', 'Deep feeling; sorrow spoken is sorrow healing.'),
  'thien-hu': s('Thiên Hư', 'Thiên Hư (Emptiness Star)', 'Cảm giác trống trải — lời nhắc tìm điều thật sự nuôi dưỡng mình.', 'A sense of emptiness — a nudge to seek what truly nourishes.'),
  'hong-loan': s('Hồng Loan', 'Hồng Loan (Red Phoenix)', 'Duyên tình, sự dịu dàng.', 'Romance and tenderness.'),
  'thien-hy': s('Thiên Hỷ', 'Thiên Hỷ (Joy Star)', 'Niềm vui, tin vui.', 'Joy and happy news.'),
  'thien-duc': s('Thiên Đức', 'Thiên Đức (Heavenly Virtue)', 'Phúc đức, lòng tốt được đáp lại.', 'Virtue; kindness returned.'),
  'nguyet-duc': s('Nguyệt Đức', 'Nguyệt Đức (Lunar Virtue)', 'Sự hiền hậu, che chở.', 'Gentleness and protection.'),
  'co-than': s('Cô Thần', 'Cô Thần (Solitary Star)', 'Thích khoảng riêng; học cách ở một mình mà không cô đơn.', 'Loves solitude; learning to be alone without loneliness.'),
  'qua-tu': s('Quả Tú', 'Quả Tú (Lone Star)', 'Sự độc lập trong tình cảm.', 'Independence in relationships.'),
  'dao-hoa': s('Đào Hoa', 'Đào Hoa (Peach Blossom)', 'Sức hút, duyên dáng.', 'Charm and attraction.'),
  'hoa-cai': s('Hoa Cái', 'Hoa Cái (Canopy Star)', 'Óc nghệ thuật, đời sống tâm linh.', 'Artistry and spiritual life.'),
  'kiep-sat': s('Kiếp Sát', 'Kiếp Sát (Sudden Star)', 'Biến chuyển nhanh — nhắc sống chậm và cẩn trọng.', 'Swift change — a reminder to slow down.'),
  'pha-toai': s('Phá Toái', 'Phá Toái (Breaking Star)', 'Thay đổi nhỏ lẻ, dọn chỗ cho cái mới.', 'Small shake-ups that clear space.'),
  'luu-ha': s('Lưu Hà', 'Lưu Hà (Flowing River)', 'Dòng chảy cảm xúc; giữ mình bình tĩnh khi đi xa.', 'Emotional currents; stay calm when travelling.'),
  'thien-hinh': s('Thiên Hình', 'Thiên Hình (Discipline Star)', 'Kỷ luật, nguyên tắc, sự rõ ràng.', 'Discipline, principle, clarity.'),
  'thien-rieu': s('Thiên Riêu', 'Thiên Riêu (Desire Star)', 'Cảm xúc lãng mạn, nhạy cảm.', 'Romantic sensitivity.'),
  'thien-y': s('Thiên Y', 'Thiên Y (Healer Star)', 'Khả năng chăm sóc, chữa lành.', 'Care and healing ability.'),
  'tam-thai': s('Tam Thai', 'Tam Thai (Three Terraces)', 'Sự thăng tiến từng bậc.', 'Rising step by step.'),
  'bat-toa': s('Bát Tọa', 'Bát Tọa (Eight Seats)', 'Vị thế vững vàng.', 'A steady standing.'),
  'an-quang': s('Ân Quang', 'Ân Quang (Grace Light)', 'Ơn nghĩa, được giúp đỡ.', 'Gratitude and receiving help.'),
  'thien-quy': s('Thiên Quý', 'Thiên Quý (Noble Grace)', 'Quý nhân, phẩm cách.', 'Benefactors and dignity.'),
  'thai-phu': s('Thai Phụ', 'Thai Phụ (Assistant)', 'Được nâng đỡ trong học hành, công việc.', 'Support in study and work.'),
  'phong-cao': s('Phong Cáo', 'Phong Cáo (Commendation)', 'Sự ghi nhận, khen thưởng.', 'Recognition and praise.'),
  'thien-la': s('Thiên La', 'Thiên La (Heaven\'s Net)', 'Cảm giác bị ràng buộc — học sự kiên nhẫn.', 'Feeling bound — learning patience.'),
  'dia-vong': s('Địa Võng', 'Địa Võng (Earth\'s Net)', 'Vướng víu tạm thời — bình tĩnh gỡ từng nút.', 'Temporary tangles — untie them calmly.'),
  'thien-thuong': s('Thiên Thương', 'Thiên Thương (Injury Star)', 'Nhắc chăm lo sức khoẻ, đi chậm mà chắc.', 'A reminder to care for health.'),
  'thien-su': s('Thiên Sứ', 'Thiên Sứ (Messenger Star)', 'Nhắc lắng nghe tín hiệu của cơ thể.', 'A reminder to listen to the body.'),
  'thien-tai': s('Thiên Tài', 'Thiên Tài (Talent Star)', 'Tài năng bẩm sinh.', 'Innate talent.'),
  'thien-tho': s('Thiên Thọ', 'Thiên Thọ (Longevity Star)', 'Sức bền, sự trường cửu.', 'Endurance and longevity.'),
  // Vòng Tràng Sinh — 12 giai đoạn của năng lượng
  'trang-sinh': s('Tràng Sinh', 'Tràng Sinh (Birth)', 'Năng lượng mới nảy sinh.', 'Energy being born.'),
  'moc-duc': s('Mộc Dục', 'Mộc Dục (Bathing)', 'Tuổi non trẻ, thích khám phá.', 'Youthful, exploring.'),
  'quan-doi': s('Quan Đới', 'Quan Đới (Capping)', 'Bắt đầu trưởng thành.', 'Coming of age.'),
  'lam-quan': s('Lâm Quan', 'Lâm Quan (Officeholding)', 'Sức lực dồi dào.', 'Full strength.'),
  'de-vuong': s('Đế Vượng', 'Đế Vượng (Prime)', 'Năng lượng ở đỉnh cao.', 'Energy at its peak.'),
  'suy': s('Suy', 'Suy (Waning)', 'Năng lượng lắng xuống, cần giữ gìn.', 'Energy settling; conserve it.'),
  'benh': s('Bệnh', 'Bệnh (Weakening)', 'Lời nhắc nghỉ ngơi.', 'A call to rest.'),
  'tu': s('Tử', 'Tử (Stillness)', 'Tĩnh lặng, khép một chu kỳ.', 'Stillness; a cycle closes.'),
  'mo': s('Mộ', 'Mộ (Storehouse)', 'Tích chứa, cất giữ.', 'Storing and keeping.'),
  'tuyet': s('Tuyệt', 'Tuyệt (Severance)', 'Khoảng lặng trước khởi đầu mới.', 'The pause before a new start.'),
  'thai': s('Thai', 'Thai (Conception)', 'Hạt mầm đang hình thành.', 'A seed forming.'),
  'duong': s('Dưỡng', 'Dưỡng (Nurturing)', 'Được nuôi dưỡng, chuẩn bị.', 'Being nurtured, preparing.'),
  // Vòng Bác Sĩ (khởi từ Lộc Tồn)
  'bac-si': s('Bác Sĩ', 'Bác Sĩ (Scholar)', 'Hiểu biết, thông tuệ.', 'Knowledge and wisdom.'),
  'luc-si': s('Lực Sĩ', 'Lực Sĩ (Strongman)', 'Sức mạnh, nghị lực.', 'Strength and willpower.'),
  'thanh-long': s('Thanh Long', 'Thanh Long (Azure Dragon)', 'Niềm vui, điều tốt lành.', 'Joy and good fortune.'),
  'tieu-hao': s('Tiểu Hao', 'Tiểu Hao (Small Spending)', 'Chi tiêu nhỏ — nhắc vun vén.', 'Small outflows — a nudge to budget.'),
  'tuong-quan': s('Tướng Quân', 'Tướng Quân (General)', 'Can đảm, quyết đoán.', 'Courage and decisiveness.'),
  'tau-thu': s('Tấu Thư', 'Tấu Thư (Memorial)', 'Văn chương, lời nói khéo.', 'Writing and eloquence.'),
  'phi-liem': s('Phi Liêm', 'Phi Liêm (Swift Wind)', 'Sự nhanh nhạy.', 'Swiftness.'),
  'hy-than': s('Hỷ Thần', 'Hỷ Thần (Joy Spirit)', 'Niềm vui, chuyện mừng.', 'Celebration.'),
  'benh-phu': s('Bệnh Phù', 'Bệnh Phù (Ailment Star)', 'Nhắc chăm sóc sức khoẻ.', 'A reminder to look after health.'),
  'dai-hao': s('Đại Hao', 'Đại Hao (Great Spending)', 'Dòng tiêu lớn — nhắc chi tiêu có ý thức.', 'Large outflows — spend mindfully.'),
  'phuc-binh': s('Phục Binh', 'Phục Binh (Hidden Soldier)', 'Nhắc cẩn trọng, nhìn kỹ trước khi tin.', 'Look carefully before trusting.'),
  'quan-phu': s('Quan Phủ', 'Quan Phủ (Official)', 'Giấy tờ, thủ tục — làm chậm mà chắc.', 'Paperwork — slow and sure.'),
  // Vòng Thái Tuế (khởi từ Chi năm sinh)
  'thai-tue': s('Thái Tuế', 'Thái Tuế (Year Lord)', 'Lời nói có trọng lượng, chính kiến.', 'Weighty words, firm views.'),
  'thieu-duong': s('Thiếu Dương', 'Thiếu Dương (Lesser Yang)', 'Sự sáng suốt, vui tươi.', 'Clarity and cheer.'),
  'tang-mon': s('Tang Môn', 'Tang Môn (Mourning Gate)', 'Nỗi buồn cần được lắng nghe.', 'Sadness that needs to be heard.'),
  'thieu-am': s('Thiếu Âm', 'Thiếu Âm (Lesser Yin)', 'Sự dịu dàng, kín đáo.', 'Gentleness and discretion.'),
  'quan-phu-tt': s('Quan Phù', 'Quan Phù (Litigation Star)', 'Nhắc sống ngay thẳng, rõ ràng giấy tờ.', 'Stay upright; keep things clear.'),
  'tu-phu': s('Tử Phù', 'Tử Phù (Sorrow Star)', 'Những ưu tư thầm lặng.', 'Quiet worries.'),
  'tue-pha': s('Tuế Phá', 'Tuế Phá (Year Breaker)', 'Tinh thần phá cách, muốn thay đổi.', 'A rebellious urge to change.'),
  'long-duc': s('Long Đức', 'Long Đức (Dragon Virtue)', 'Phúc lành, sự che chở.', 'Blessing and protection.'),
  'bach-ho': s('Bạch Hổ', 'Bạch Hổ (White Tiger)', 'Mạnh mẽ, quyết liệt — nhớ mềm mỏng.', 'Fierce strength — remember gentleness.'),
  'phuc-duc-tt': s('Phúc Đức', 'Phúc Đức (Blessing Star)', 'Phúc phần, lòng tốt.', 'Blessings and kindness.'),
  'dieu-khach': s('Điếu Khách', 'Điếu Khách (Mourning Guest)', 'Hay lo xa — tập sống với hiện tại.', 'Worrying ahead — practise presence.'),
  'truc-phu': s('Trực Phù', 'Trực Phù (Upright Star)', 'Sự ngay thẳng, trực tính.', 'Straightforwardness.'),
});

// Nhãn ngắn ghi trên lá số cho quan hệ sinh khắc Mệnh – Cục
export const RELATION_LABEL = {
  'hoa': { vi: 'Mệnh Cục bình hoà', en: 'Life and Bureau in harmony' },
  'cuc-sinh-menh': { vi: 'Cục sinh Mệnh', en: 'Bureau nourishes Life' },
  'menh-sinh-cuc': { vi: 'Mệnh sinh Cục', en: 'Life nourishes Bureau' },
  'cuc-khac-menh': { vi: 'Cục khắc Mệnh', en: 'Bureau challenges Life' },
  'menh-khac-cuc': { vi: 'Mệnh khắc Cục', en: 'Life shapes Bureau' },
};

export const THUAN_LY_TEXT = {
  true: { vi: 'Âm dương thuận lý: âm dương của năm sinh hoà với cung Mệnh, năng lượng bên trong và cách bạn bước ra đời dễ đồng điệu.', en: 'Yin-yang in accord: the year\'s polarity matches the Self palace, so inner energy and outer path flow together easily.' },
  false: { vi: 'Âm dương nghịch lý: âm dương của năm sinh khác cung Mệnh. Bạn thường phải tự tìm cách riêng, và chính hành trình ấy làm bạn sâu sắc.', en: 'Yin-yang in contrast: the year\'s polarity differs from the Self palace. You often find your own way, and that journey gives you depth.' },
};

export const PALACE_INFO = {
  'menh': { name: { vi: 'Mệnh', en: 'Self' }, domain: { vi: 'bản chất, tính cách, cách bạn bước vào đời', en: 'core nature, temperament, how you meet life' } },
  'huynh-de': { name: { vi: 'Huynh Đệ', en: 'Siblings' }, domain: { vi: 'anh chị em, bạn đồng hành thân thiết', en: 'siblings and close companions' } },
  'phu-the': { name: { vi: 'Phu Thê', en: 'Partnership' }, domain: { vi: 'tình yêu, hôn nhân, người bạn đời', en: 'love, marriage, life partner' } },
  'tu-tuc': { name: { vi: 'Tử Tức', en: 'Children' }, domain: { vi: 'con cái, sự sáng tạo, những gì bạn nuôi lớn', en: 'children, creativity, what you nurture' } },
  'tai-bach': { name: { vi: 'Tài Bạch', en: 'Wealth' }, domain: { vi: 'tiền bạc, cách bạn kiếm và giữ nguồn lực', en: 'money, how you earn and keep resources' } },
  'tat-ach': { name: { vi: 'Tật Ách', en: 'Health' }, domain: { vi: 'sức khoẻ, cơ thể, cách bạn đối diện khó khăn', en: 'health, the body, how you face hardship' } },
  'thien-di': { name: { vi: 'Thiên Di', en: 'Travel' }, domain: { vi: 'ra ngoài, đi xa, hình ảnh của bạn trong mắt xã hội', en: 'going out, travel, how the world sees you' } },
  'no-boc': { name: { vi: 'Nô Bộc', en: 'Friends' }, domain: { vi: 'bạn bè, đồng nghiệp, cộng đồng', en: 'friends, colleagues, community' } },
  'quan-loc': { name: { vi: 'Quan Lộc', en: 'Career' }, domain: { vi: 'sự nghiệp, công việc, con đường đóng góp', en: 'career, work, how you contribute' } },
  'dien-trach': { name: { vi: 'Điền Trạch', en: 'Home' }, domain: { vi: 'nhà cửa, nơi chốn, cảm giác an cư', en: 'home, place, sense of belonging' } },
  'phuc-duc': { name: { vi: 'Phúc Đức', en: 'Spirit' }, domain: { vi: 'phúc phần, đời sống tinh thần, nguồn bình an bên trong', en: 'blessings, inner life, sources of peace' } },
  'phu-mau': { name: { vi: 'Phụ Mẫu', en: 'Parents' }, domain: { vi: 'cha mẹ, người dạy dỗ, gốc rễ', en: 'parents, mentors, roots' } },
};

// Năng lượng của một đại hạn (10 năm) khi nó đi qua từng cung — chỉ là khuynh hướng để chiêm nghiệm
export const DAI_HAN_THEME = {
  'menh': { vi: 'Mười năm quay về với chính mình: định hình bản sắc, hiểu mình muốn sống thế nào.', en: 'A decade of returning to yourself: shaping identity and how you want to live.' },
  'huynh-de': { vi: 'Mười năm của những người đồng hành: tình thân, sự sẻ chia và học cách cùng nhau.', en: 'A decade of companions: kinship, sharing, learning to walk together.' },
  'phu-the': { vi: 'Mười năm năng lượng hướng về các mối gắn bó: học yêu thương mà vẫn là chính mình.', en: 'A decade drawn to bonds: learning to love while staying yourself.' },
  'tu-tuc': { vi: 'Mười năm của sự nuôi dưỡng và sáng tạo: điều bạn chăm chút sẽ lớn dần lên.', en: 'A decade of nurturing and creating: what you tend will grow.' },
  'tai-bach': { vi: 'Mười năm tập trung vào nguồn lực: học cách tạo ra, giữ gìn và dùng sự đủ đầy.', en: 'A decade focused on resources: creating, keeping and using enough.' },
  'tat-ach': { vi: 'Mười năm lắng nghe cơ thể: sức khoẻ và sự nghỉ ngơi là nền móng cho mọi thứ.', en: 'A decade of listening to the body: health and rest underpin everything.' },
  'thien-di': { vi: 'Mười năm mở rộng ra thế giới: gặp gỡ, đi xa, nhìn mình qua những vùng đất mới.', en: 'A decade opening to the world: meeting, travelling, seeing yourself anew.' },
  'no-boc': { vi: 'Mười năm của cộng đồng: những mối quan hệ rộng mở dạy bạn về sự tin cậy.', en: 'A decade of community: wider circles that teach trust.' },
  'quan-loc': { vi: 'Mười năm năng lượng dồn về sự nghiệp: tìm ra cách đóng góp phù hợp với mình.', en: 'A decade of career energy: finding a way to contribute that fits you.' },
  'dien-trach': { vi: 'Mười năm vun đắp nơi chốn: xây một mái nhà, cả bên ngoài lẫn bên trong.', en: 'A decade of building a place: a home outside and within.' },
  'phuc-duc': { vi: 'Mười năm hướng nội: đời sống tinh thần, sự bình an và những giá trị sâu xa.', en: 'A decade turning inward: spiritual life, peace, deeper values.' },
  'phu-mau': { vi: 'Mười năm nhìn về gốc rễ: gia đình, người thầy, những gì bạn được trao lại.', en: 'A decade looking to roots: family, mentors, what was handed to you.' },
};

export const CUC_NAMES = {
  2: { vi: 'Thủy nhị cục', en: 'Water — 2' },
  3: { vi: 'Mộc tam cục', en: 'Wood — 3' },
  4: { vi: 'Kim tứ cục', en: 'Metal — 4' },
  5: { vi: 'Thổ ngũ cục', en: 'Earth — 5' },
  6: { vi: 'Hỏa lục cục', en: 'Fire — 6' },
};

export const RELATION_TEXT = {
  'hoa': { vi: 'Cục và Mệnh cùng hành (bình hoà): bên trong và hoàn cảnh nói cùng một ngôn ngữ, bạn dễ là chính mình.', en: 'Cục and Mệnh share an element: inner nature and circumstances speak the same language.' },
  'cuc-sinh-menh': { vi: 'Cục sinh Mệnh: hoàn cảnh có xu hướng nâng đỡ bạn. Hãy đón nhận sự nâng đỡ ấy một cách biết ơn.', en: 'Cục nourishes Mệnh: circumstances tend to support you. Receive that support with gratitude.' },
  'menh-sinh-cuc': { vi: 'Mệnh sinh Cục: bạn hay là người cho đi, vun đắp cho môi trường quanh mình. Nhớ dành phần cho bản thân.', en: 'Mệnh nourishes Cục: you tend to give to your surroundings. Remember to keep some for yourself.' },
  'cuc-khac-menh': { vi: 'Cục khắc Mệnh: hoàn cảnh hay đặt ra thử thách, và chính chúng rèn bạn bản lĩnh. Không cần gồng mình một mình.', en: 'Cục challenges Mệnh: circumstances test you and build resilience. You need not brace alone.' },
  'menh-khac-cuc': { vi: 'Mệnh khắc Cục: bạn có xu hướng tự mở đường, uốn hoàn cảnh theo ý chí. Sức mạnh này đẹp nhất khi đi cùng sự mềm mỏng.', en: 'Mệnh shapes Cục: you tend to carve your own path. That strength is loveliest with gentleness.' },
};
