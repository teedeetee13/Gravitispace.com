// Cấu hình chung.
export const CONFIG = {
  APP_VERSION: '2.2.1',
  STORAGE_PREFIX: 'ansao:',
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
