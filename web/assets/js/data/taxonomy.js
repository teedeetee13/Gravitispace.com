// Ba chủ đề chính của Hữu Duyên
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
];

// Đường dây hỗ trợ — HÃY KIỂM TRA LẠI số điện thoại trước khi ra mắt chính thức.
export const HOTLINES = [
  { name: 'Cấp cứu y tế', number: '115', note: 'Khi có nguy hiểm tính mạng ngay lập tức' },
  { name: 'Đường dây nóng Ngày Mai', number: '096 306 1414', note: 'Hỗ trợ tâm lý cho người đang khủng hoảng' },
  { name: 'Tổng đài quốc gia bảo vệ trẻ em', number: '111', note: 'Dành cho người dưới 18 tuổi' },
];
