// Cấu hình chung.
export const CONFIG = {
  APP_VERSION: '2.3.0',
  STORAGE_PREFIX: 'ansao:', // giữ nguyên dù đã đổi tên: đổi là người dùng cũ mất dữ liệu
  // Chính sách quyền riêng tư (trang chính Graviti). Đổi nội dung chính sách → tăng phiên bản ở cả hai nơi.
  PRIVACY_URL: '../privacy/',
  CONSENT_VERSION: '1.0',
  DEFAULT_LANG: 'vi',
  // Danh mục ngôn ngữ: xem i18n/langs.js

  // Tài khoản + cơ sở dữ liệu: Supabase (Postgres + Auth). Điền 2 giá trị lấy ở
  // Supabase Dashboard → Project Settings → API. Khoá "anon" là khoá CÔNG KHAI theo thiết kế của Supabase:
  // dữ liệu được bảo vệ bằng Row Level Security trong supabase/schema.sql, không phải bằng việc giấu khoá.
  // Để trống → web chạy chế độ khách (chỉ lưu trên máy), mục Tài khoản báo "chưa cấu hình".
  SUPABASE_URL: '',
  SUPABASE_ANON_KEY: '',
};

export const cloudEnabled = () => !!(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY);
