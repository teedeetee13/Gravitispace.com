// Danh mục ngôn ngữ của Hữu Duyên. Thêm một ngôn ngữ = thêm một dòng ở đây + 3 tệp trong i18n/
// (<ma>.js: giao diện, <ma>-content.js: lá bài/cung/con giáp/bài mẫu, <ma>-text.js: lời luận giải).
// Kiểm thử tests/i18n.test.mjs bắt buộc mỗi ngôn ngữ phải đủ 100% — thiếu một chuỗi là CI báo đỏ, không đăng web.
//  - html: mã BCP 47 cho <html lang> (trình đọc màn hình, phông chữ, ngắt dòng đúng chữ viết)
//  - locale: định dạng ngày tháng (Intl)
//  - og: og:locale cho chia sẻ mạng xã hội
//  - native: tên ngôn ngữ viết bằng chính ngôn ngữ đó (người dùng luôn nhận ra tiếng của mình)
export const LANGS = [
  { code: 'vi', html: 'vi', locale: 'vi-VN', og: 'vi_VN', native: 'Tiếng Việt', short: 'VI' },
  { code: 'en', html: 'en', locale: 'en-GB', og: 'en_GB', native: 'English', short: 'EN' },
  { code: 'es', html: 'es', locale: 'es-419', og: 'es_LA', native: 'Español', short: 'ES' },
  { code: 'fr', html: 'fr', locale: 'fr-FR', og: 'fr_FR', native: 'Français', short: 'FR' },
  { code: 'de', html: 'de', locale: 'de-DE', og: 'de_DE', native: 'Deutsch', short: 'DE' },
  { code: 'zh', html: 'zh-Hant', locale: 'zh-Hant-TW', og: 'zh_TW', native: '繁體中文', short: '中' },
  { code: 'hi', html: 'hi', locale: 'hi-IN', og: 'hi_IN', native: 'हिन्दी', short: 'हि' },
  { code: 'th', html: 'th', locale: 'th-TH-u-ca-gregory', og: 'th_TH', native: 'ไทย', short: 'TH' },
];

export const LANG_CODES = LANGS.map((l) => l.code);
export const langMeta = (code) => LANGS.find((l) => l.code === code) || LANGS[0];
