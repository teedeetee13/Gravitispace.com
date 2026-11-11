// Ba chủ đề chính của Graviti Stars
export const TOPICS = [
  { id: 'tarot', label: 'Tarot', color: '#9d6fb0' },
  { id: 'chiem-tinh', label: 'Chiêm tinh', color: '#4f7fb0' },
  { id: 'tu-vi', label: 'Tử vi', color: '#c0794a' },
];

// Kiểu bài viết người dùng có thể gieo
export const POST_TYPES = [
  { id: 'trai-bai', label: 'Trải bài' },
  { id: 'giai-nghia', label: 'Giải nghĩa' },
  { id: 'chia-se', label: 'Chia sẻ' },
  { id: 'hoi-dap', label: 'Hỏi đáp' },
  { id: 'loi-nhan', label: 'Lời nhắn' },
];

export const topicById = Object.fromEntries(TOPICS.map((t) => [t.id, t]));
export const typeById = Object.fromEntries(POST_TYPES.map((t) => [t.id, t]));

// Từ khoá gợi ý người viết/đọc có thể đang gặp nguy hiểm → hiện thông tin hỗ trợ trước.
export const CRISIS_PHRASES = [
  'tự tử', 'tự sát', 'muốn chết', 'không muốn sống', 'không thiết sống',
  'kết thúc tất cả', 'chấm dứt cuộc đời', 'kết liễu', 'biến mất khỏi thế giới',
  // Tiếng Anh (khi người dùng viết/tìm bằng tiếng Anh)
  'suicide', 'kill myself', 'want to die', 'end my life', 'no reason to live',
  // Tây Ban Nha, Pháp, Đức, Trung (phồn thể + giản thể), Hindi, Thái — người dùng có thể viết/tìm bằng tiếng mẹ đẻ
  'suicidio', 'suicidarme', 'quiero morir', 'matarme', 'no quiero vivir', 'quitarme la vida',
  'suicide', 'me suicider', 'envie de mourir', 'veux mourir', 'en finir avec la vie',
  'selbstmord', 'suizid', 'umbringen', 'sterben will', 'nicht mehr leben',
  '自殺', '自杀', '想死', '不想活', '輕生', '轻生', '結束生命', '结束生命',
  'आत्महत्या', 'मरना चाहता', 'मरना चाहती', 'जीना नहीं चाहता', 'जीना नहीं चाहती',
  'ฆ่าตัวตาย', 'อยากตาย', 'ไม่อยากมีชีวิต',
];

// Đường dây hỗ trợ — HÃY KIỂM TRA LẠI số điện thoại trước khi ra mắt chính thức.
export const HOTLINES = [
  { name: 'Cấp cứu y tế', number: '115', note: 'Khi có nguy hiểm tính mạng ngay lập tức' },
  { name: 'Đường dây nóng Ngày Mai', number: '096 306 1414', note: 'Hỗ trợ tâm lý cho người đang khủng hoảng' },
  { name: 'Tổng đài quốc gia bảo vệ trẻ em', number: '111', note: 'Dành cho người dưới 18 tuổi' },
  // Danh bạ đường dây hỗ trợ miễn phí, cập nhật theo từng quốc gia (do tổ chức phi lợi nhuận ThroughLine duy trì)
  { name: 'Find A Helpline', number: 'findahelpline', url: 'https://findahelpline.com/', note: 'Đường dây hỗ trợ miễn phí tại hơn 130 quốc gia' },
];
