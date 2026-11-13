// Cấu hình chung.
export const CONFIG = {
  APP_VERSION: '2.3.0',
  STORAGE_PREFIX: 'ansao:', // giữ nguyên dù đã đổi tên: đổi là người dùng cũ mất dữ liệu
  // Chính sách quyền riêng tư (trang chính Graviti). Đổi nội dung chính sách → tăng phiên bản ở cả hai nơi.
  PRIVACY_URL: '../privacy/',
  // Trang Tài khoản chung của cả hệ Graviti (gốc web, không nằm trong Graviti Stars)
  ACCOUNT_URL: '../tai-khoan/',
  CONSENT_VERSION: '1.0',
  DEFAULT_LANG: 'vi',
  // Danh mục ngôn ngữ: xem i18n/langs.js

  // Tài khoản + cơ sở dữ liệu: Supabase (Postgres + Auth). Điền 2 giá trị lấy ở
  // Supabase Dashboard → Project Settings → API. Khoá "anon" là khoá CÔNG KHAI theo thiết kế của Supabase:
  // dữ liệu được bảo vệ bằng Row Level Security trong supabase/schema.sql, không phải bằng việc giấu khoá.
  // Để trống → web chạy chế độ khách (chỉ lưu trên máy), mục Tài khoản báo "chưa cấu hình".
  SUPABASE_URL: 'https://xxbqxgobcgritxxqlmyc.supabase.co',
  // Khoá publishable (sb_publishable_…, thay cho khoá anon kiểu cũ): công khai, an toàn nhờ RLS.
  // KHÔNG BAO GIỜ dán khoá sb_secret_… hay service_role vào đây.
  SUPABASE_ANON_KEY: 'sb_publishable_rxE3rchZX-Q209JQMhJOgA_6m_gu2cA',
  // Đăng nhập bằng tài khoản ngoài (OAuth, luồng PKCE). Phải bật nhà cung cấp tương ứng trong
  // Supabase → Authentication → Sign In / Providers, xem docs/CAU-HINH.md mục 4b. Để [] là ẩn nút.
  OAUTH_PROVIDERS: ['google'],
};

export const cloudEnabled = () => !!(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY);
