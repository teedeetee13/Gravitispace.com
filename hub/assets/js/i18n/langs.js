// Ngôn ngữ của trang chính Graviti: 8 ngôn ngữ của Graviti Stars + tiếng Hàn.
// Trang quản trị (admin/) chỉ có tiếng Việt và tiếng Anh.
// Thêm một ngôn ngữ = thêm một dòng ở đây + tệp i18n/<mã>.js đủ khoá như vi.js (tests/hub.test.mjs kiểm tra).
export const LANGS = [
  { code: 'vi', html: 'vi', native: 'Tiếng Việt' },
  { code: 'en', html: 'en', native: 'English' },
  { code: 'ko', html: 'ko', native: '한국어' },
  { code: 'zh', html: 'zh-Hant', native: '繁體中文' },
  { code: 'th', html: 'th', native: 'ไทย' },
  { code: 'hi', html: 'hi', native: 'हिन्दी' },
  { code: 'es', html: 'es', native: 'Español' },
  { code: 'fr', html: 'fr', native: 'Français' },
  { code: 'de', html: 'de', native: 'Deutsch' },
];
export const LANG_CODES = LANGS.map((l) => l.code);
