// Nội dung luận giải bản đồ sao (chiêm tinh phương Tây, hoàng đạo nhiệt đới).
// Cách đọc truyền thống: hành tinh = "điều gì" (một phần của bạn), cung = "theo cách nào", nhà = "ở lĩnh vực nào".
// Lời văn chiêm nghiệm, không tiên đoán, không bảo người đọc phải làm gì. Mỗi chuỗi có { vi, en }.

export const PLANETS = {
  sun: { name: { vi: 'Mặt Trời', en: 'Sun' }, glyph: '☉', part: { vi: 'bản ngã cốt lõi, sức sống và điều làm bạn toả sáng', en: 'your core self, vitality and what makes you shine' } },
  moon: { name: { vi: 'Mặt Trăng', en: 'Moon' }, glyph: '☽', part: { vi: 'thế giới cảm xúc, nhu cầu được an toàn và được yêu thương', en: 'your emotional world, need for safety and care' } },
  mercury: { name: { vi: 'Sao Thuỷ', en: 'Mercury' }, glyph: '☿', part: { vi: 'cách bạn suy nghĩ, học hỏi và trò chuyện', en: 'how you think, learn and communicate' } },
  venus: { name: { vi: 'Sao Kim', en: 'Venus' }, glyph: '♀', part: { vi: 'cách bạn yêu, cảm nhận cái đẹp và giá trị', en: 'how you love, and what you find beautiful and valuable' } },
  mars: { name: { vi: 'Sao Hoả', en: 'Mars' }, glyph: '♂', part: { vi: 'ý chí, sự can đảm và cách bạn hành động', en: 'your drive, courage and how you act' } },
  jupiter: { name: { vi: 'Sao Mộc', en: 'Jupiter' }, glyph: '♃', part: { vi: 'niềm tin, sự rộng mở và nơi bạn dễ lớn lên', en: 'faith, openness and where you grow easily' } },
  saturn: { name: { vi: 'Sao Thổ', en: 'Saturn' }, glyph: '♄', part: { vi: 'kỷ luật, trách nhiệm và bài học cần thời gian', en: 'discipline, responsibility and lessons that take time' } },
  uranus: { name: { vi: 'Sao Thiên Vương', en: 'Uranus' }, glyph: '♅', part: { vi: 'khát khao tự do và đổi mới (mang tính thế hệ)', en: 'the urge for freedom and change (generational)' } },
  neptune: { name: { vi: 'Sao Hải Vương', en: 'Neptune' }, glyph: '♆', part: { vi: 'giấc mơ, trực giác và lòng trắc ẩn (mang tính thế hệ)', en: 'dreams, intuition and compassion (generational)' } },
  pluto: { name: { vi: 'Sao Diêm Vương', en: 'Pluto' }, glyph: '♇', part: { vi: 'sự chuyển hoá sâu sắc (mang tính thế hệ)', en: 'deep transformation (generational)' } },
};

// Cách mỗi cung "tô màu" cho một hành tinh — thứ tự từ Bạch Dương (0) tới Song Ngư (11)
export const SIGN_STYLE = [
  { vi: 'thẳng thắn, nhiệt huyết, thích đi trước', en: 'direct, fiery, eager to go first' },
  { vi: 'chậm rãi, bền bỉ, gắn với những điều chạm được', en: 'slow, steady, grounded in the tangible' },
  { vi: 'tò mò, linh hoạt, qua chữ nghĩa và trò chuyện', en: 'curious, flexible, through words and conversation' },
  { vi: 'dịu dàng, chở che, qua cảm giác thuộc về', en: 'tender, protective, through belonging' },
  { vi: 'rạng rỡ, hào phóng, muốn được thể hiện', en: 'radiant, generous, wanting to express' },
  { vi: 'tỉ mỉ, chu đáo, qua việc giúp ích', en: 'careful, attentive, through being useful' },
  { vi: 'hài hoà, tinh tế, qua các mối quan hệ', en: 'harmonious, graceful, through relationships' },
  { vi: 'sâu sắc, mãnh liệt, cần sự tin cậy trọn vẹn', en: 'deep, intense, needing complete trust' },
  { vi: 'phóng khoáng, lạc quan, qua khám phá và ý nghĩa', en: 'free, hopeful, through exploration and meaning' },
  { vi: 'kiên định, có trách nhiệm, xây dựng lâu dài', en: 'steady, responsible, building for the long term' },
  { vi: 'độc lập, khác biệt, nghĩ cho cộng đồng', en: 'independent, original, community-minded' },
  { vi: 'mơ mộng, thấu cảm, hoà vào điều lớn hơn mình', en: 'dreamy, empathic, merging with something larger' },
];

export const HOUSES = [
  { vi: 'bản thân, cơ thể, cách bạn xuất hiện', en: 'self, body, how you appear' },
  { vi: 'tiền bạc, giá trị, cảm giác đủ đầy', en: 'money, values, a sense of enough' },
  { vi: 'giao tiếp, học tập, anh chị em, hàng xóm', en: 'communication, learning, siblings, neighbours' },
  { vi: 'nhà, gia đình, gốc rễ', en: 'home, family, roots' },
  { vi: 'sáng tạo, niềm vui, tình yêu, con trẻ', en: 'creativity, joy, romance, children' },
  { vi: 'công việc hằng ngày, sức khoẻ, thói quen', en: 'daily work, health, routines' },
  { vi: 'quan hệ đôi lứa, đối tác', en: 'partnerships, one-to-one bonds' },
  { vi: 'gắn kết sâu, chia sẻ, chuyển hoá', en: 'intimacy, shared resources, transformation' },
  { vi: 'học vấn cao, đi xa, niềm tin, triết lý', en: 'higher learning, travel, beliefs' },
  { vi: 'sự nghiệp, vai trò xã hội, định hướng', en: 'career, public role, direction' },
  { vi: 'bạn bè, cộng đồng, ước mơ', en: 'friends, community, hopes' },
  { vi: 'thế giới nội tâm, nghỉ ngơi, buông bỏ', en: 'inner world, rest, letting go' },
];

export const ELEMENT_OF_SIGN = ['fire', 'earth', 'air', 'water', 'fire', 'earth', 'air', 'water', 'fire', 'earth', 'air', 'water'];
export const MODALITY_OF_SIGN = ['cardinal', 'fixed', 'mutable', 'cardinal', 'fixed', 'mutable', 'cardinal', 'fixed', 'mutable', 'cardinal', 'fixed', 'mutable'];

export const ELEMENT_TEXT = {
  fire: { name: { vi: 'Lửa', en: 'Fire' }, color: '#c7604a', strong: { vi: 'Bạn mang nhiều lửa: nhiệt huyết, dám làm. Năng lượng này cần những khoảng nghỉ để không cạn.', en: 'Plenty of fire: zest and daring. It needs pauses so it does not burn out.' }, weak: { vi: 'Lửa ít: động lực có thể đến chậm. Niềm vui nhỏ mỗi ngày là cách nhóm lửa dịu dàng.', en: 'Little fire: motivation may come slowly. Small daily joys gently kindle it.' } },
  earth: { name: { vi: 'Đất', en: 'Earth' }, color: '#9a8150', strong: { vi: 'Bạn mang nhiều đất: thực tế, bền bỉ. Đôi khi cho phép mình mơ một chút cũng tốt.', en: 'Plenty of earth: practical and steady. Allowing a little dreaming helps.' }, weak: { vi: 'Đất ít: dễ bay bổng. Những nếp sinh hoạt đều đặn giúp bạn có chỗ neo.', en: 'Little earth: easily airborne. Gentle routines give you an anchor.' } },
  air: { name: { vi: 'Khí', en: 'Air' }, color: '#6b93a8', strong: { vi: 'Bạn mang nhiều khí: đầu óc nhanh, thích kết nối. Nhớ quay về cơ thể khi suy nghĩ quá ồn.', en: 'Plenty of air: quick mind, loves connection. Return to the body when thoughts get loud.' }, weak: { vi: 'Khí ít: cảm nhận nhiều hơn nói ra. Viết hoặc trò chuyện giúp mọi thứ rõ hơn.', en: 'Little air: you feel more than you say. Writing or talking brings clarity.' } },
  water: { name: { vi: 'Nước', en: 'Water' }, color: '#4f6fb0', strong: { vi: 'Bạn mang nhiều nước: thấu cảm, giàu trực giác. Ranh giới giúp bạn không ôm cảm xúc của người khác.', en: 'Plenty of water: empathic, intuitive. Boundaries keep others\' feelings from flooding you.' }, weak: { vi: 'Nước ít: bạn có thể lý trí với cảm xúc. Cho phép mình cảm mà không cần giải thích.', en: 'Little water: you may reason about feelings. Let yourself feel without explaining.' } },
};

export const MODALITY_TEXT = {
  cardinal: { name: { vi: 'Tiên phong', en: 'Cardinal' }, text: { vi: 'khởi xướng, bắt đầu', en: 'initiating, beginning' } },
  fixed: { name: { vi: 'Kiên định', en: 'Fixed' }, text: { vi: 'duy trì, bền bỉ', en: 'sustaining, persevering' } },
  mutable: { name: { vi: 'Linh hoạt', en: 'Mutable' }, text: { vi: 'thích nghi, chuyển đổi', en: 'adapting, transitioning' } },
};

// ---------- Góc chiếu (aspects) ----------
// Cách luận theo lối "delineation" kinh điển (như phần mềm Astrolog của Walter Pullen dùng):
// [phần A của bạn] + [tính chất góc chiếu] + [phần B của bạn]. Lời văn do Graviti Stars tự viết.
export const PLANET_SHORT = {
  sun: { vi: 'bản ngã', en: 'core self' },
  moon: { vi: 'cảm xúc', en: 'feelings' },
  mercury: { vi: 'suy nghĩ và lời nói', en: 'thinking and words' },
  venus: { vi: 'cách yêu và cảm nhận cái đẹp', en: 'way of loving and sense of beauty' },
  mars: { vi: 'ý chí hành động', en: 'drive to act' },
  jupiter: { vi: 'niềm tin và sự rộng mở', en: 'faith and openness' },
  saturn: { vi: 'kỷ luật và trách nhiệm', en: 'discipline and responsibility' },
  uranus: { vi: 'khát khao tự do, đổi mới', en: 'longing for freedom and change' },
  neptune: { vi: 'trực giác và giấc mơ', en: 'intuition and dreams' },
  pluto: { vi: 'sức mạnh chuyển hoá', en: 'power to transform' },
};

export const ASPECT_TEXT = {
  conjunction: {
    name: { vi: 'Trùng tụ', en: 'Conjunction' }, glyph: '☌', angle: 0,
    verb: { vi: 'hoà làm một với', en: 'blends with' },
    note: { vi: 'Hai năng lượng đi liền nhau, khó tách rời; khi hài hoà chúng khuếch đại nhau.', en: 'Two energies move as one; in harmony they amplify each other.' },
  },
  opposition: {
    name: { vi: 'Đối đỉnh', en: 'Opposition' }, glyph: '☍', angle: 180,
    verb: { vi: 'đối diện và tìm thế cân bằng với', en: 'faces and seeks balance with' },
    note: { vi: 'Như hai đầu cán cân: bạn học cách để cả hai cùng có chỗ, thường qua các mối quan hệ.', en: 'Like two ends of a scale: you learn to give both room, often through relationships.' },
  },
  trine: {
    name: { vi: 'Tam hợp', en: 'Trine' }, glyph: '△', angle: 120,
    verb: { vi: 'chảy tự nhiên và nâng đỡ', en: 'flows easily with' },
    note: { vi: 'Một món quà bẩm sinh, đến dễ dàng; càng ý thức về nó, bạn càng dùng nó đẹp hơn.', en: 'A natural gift that comes easily; the more aware you are of it, the better you use it.' },
  },
  square: {
    name: { vi: 'Vuông góc', en: 'Square' }, glyph: '□', angle: 90,
    verb: { vi: 'tạo lực kéo trưởng thành với', en: 'creates growing tension with' },
    note: { vi: 'Một chút cọ xát bên trong, cũng chính là động lực khiến bạn lớn lên và hành động.', en: 'Some inner friction — which is also the push that helps you grow and act.' },
  },
  sextile: {
    name: { vi: 'Lục hợp', en: 'Sextile' }, glyph: '⚹', angle: 60,
    verb: { vi: 'mở ra cơ hội hợp tác với', en: 'opens chances to work with' },
    note: { vi: 'Cánh cửa hé mở: chỉ cần bạn bước một bước nhỏ là hai phần này cùng làm việc ăn ý.', en: 'A door ajar: one small step and these two parts work together well.' },
  },
};

// Sao Mộc (≈1 năm/cung) và Sao Thổ (≈2,5 năm/cung) đi qua các nhà: năng lượng giai đoạn hiện tại
export const TRANSIT = {
  jupiter: {
    vi: 'Sao Mộc đang đi qua nhà {h} ({area}) của bạn: một mùa mở rộng. Năng lượng rộng lượng và cơ hội học hỏi dễ đến ở lĩnh vực này.',
    en: 'Jupiter is moving through your house {h} ({area}): a season of expansion. Generosity and chances to learn flow easily here.',
  },
  saturn: {
    vi: 'Sao Thổ đang đi qua nhà {h} ({area}) của bạn: một mùa vun nền. Mọi thứ ở đây có thể chậm hơn, nhưng những gì bạn kiên nhẫn xây sẽ bền.',
    en: 'Saturn is moving through your house {h} ({area}): a season of laying foundations. Things may move slower here, but what you build patiently lasts.',
  },
};
