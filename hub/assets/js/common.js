// Phần dùng chung của trang chính, trang quản trị, trang quyền riêng tư:
// ngôn ngữ, giao diện sáng/tối, biểu tượng, thoát chuỗi. Không thư viện ngoài.
// Ngôn ngữ và giao diện dùng CHUNG khoá lưu với Graviti Stars (cùng tên miền) → chọn một lần, cả hệ nhớ.
import { LANG_CODES } from './i18n/langs.js';

export const LANG_KEY = 'ansao:lang';
const THEME_KEY = 'ansao:theme';

// import tĩnh từng gói để công cụ dựng thấy đường dẫn; chỉ gói đang chọn được tải
const PACKS = {
  vi: () => import('./i18n/vi.js'), en: () => import('./i18n/en.js'), ko: () => import('./i18n/ko.js'),
  zh: () => import('./i18n/zh.js'), th: () => import('./i18n/th.js'), hi: () => import('./i18n/hi.js'),
  es: () => import('./i18n/es.js'), fr: () => import('./i18n/fr.js'), de: () => import('./i18n/de.js'),
};

function storedLang() {
  try {
    return localStorage.getItem(LANG_KEY);
  } catch {
    return null;
  }
}

/** Ngôn ngữ ban đầu: đã chọn → ngôn ngữ trình duyệt → tiếng Anh (khách quốc tế), tiếng Việt nếu trình duyệt là tiếng Việt. */
export function pickLang(allowed = LANG_CODES) {
  const saved = storedLang();
  if (allowed.includes(saved)) return saved;
  for (const l of globalThis.navigator?.languages || [globalThis.navigator?.language || '']) {
    const base = String(l).toLowerCase().split('-')[0];
    if (allowed.includes(base)) return base;
  }
  return allowed.includes('en') ? 'en' : allowed[0];
}

export let lang = 'vi';
let pack = { strings: {}, data: {} };
let extra = {}; // chuỗi riêng của từng trang (vd. trang quản trị), theo ngôn ngữ

export async function loadLang(code) {
  lang = PACKS[code] ? code : 'en';
  pack = (await PACKS[lang]()).default;
  return pack;
}
export function addStrings(byLang) {
  extra = byLang;
}
export function saveLang(code) {
  try {
    localStorage.setItem(LANG_KEY, code);
  } catch {}
}

/** Chuỗi giao diện, thay {biến}. */
export const t = (key, vars = {}) => String(extra[lang]?.[key] ?? pack.strings[key] ?? extra.en?.[key] ?? key).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
/** Dữ liệu dịch của trang chính: td('services', 'stars').tag */
export const td = (group, id) => pack.data?.[group]?.[id];
/** Chọn bản dịch trong { vi, en } (danh sách việc của quản trị). */
export const pick = (o) => (o && (o[lang] ?? o.en ?? o.vi)) || '';

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** Gắn chữ cho mọi phần tử có data-i18n / data-i18n-aria, đặt <html lang>, tiêu đề, mô tả. */
export function applyStrings(titleKey, descKey, htmlLang = lang) {
  document.documentElement.lang = htmlLang;
  document.querySelectorAll('[data-i18n]').forEach((el) => (el.textContent = t(el.dataset.i18n)));
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
  if (titleKey) document.title = t(titleKey);
  if (descKey) document.querySelector('meta[name="description"]')?.setAttribute('content', t(descKey));
}

export function setupTheme() {
  document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try {
      localStorage.setItem(THEME_KEY, root.dataset.theme);
    } catch {}
  });
}

// Biểu tượng nét mảnh, vẽ tay bằng SVG (không tải phông biểu tượng ngoài)
const PATHS = {
  star: '<path d="M12 3.5l2.4 5.3 5.8.6-4.3 3.9 1.2 5.7L12 16.1 6.9 19l1.2-5.7L3.8 9.4l5.8-.6z"/>',
  leaf: '<path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14"/><path d="M5 19l7-7"/>',
  link: '<circle cx="7" cy="12" r="3.2"/><circle cx="17" cy="12" r="3.2"/><path d="M10.2 12h3.6"/>',
  bolt: '<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>',
  heart: '<path d="M12 19.5s-7-4.4-7-9.6A3.9 3.9 0 0 1 12 7.6a3.9 3.9 0 0 1 7 2.3c0 5.2-7 9.6-7 9.6z"/>',
  lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
  moon: '<path d="M18.5 14.8A7 7 0 0 1 9.2 5.5a7 7 0 1 0 9.3 9.3z"/>',
  users: '<circle cx="9" cy="9" r="3.2"/><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6"/><circle cx="16.5" cy="8" r="2.5"/><path d="M16 13.4c2.3.1 4 1.5 4.5 4.1"/>',
  check: '<path d="M5 12.5l4.2 4.2L19 7"/>',
  x: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  dot: '<circle cx="12" cy="12" r="4"/>',
  clock: '<circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3 2"/>',
  alert: '<path d="M12 4l9 16H3z"/><path d="M12 10v4.5M12 17.2v.3"/>',
  arrow: '<path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5"/>',
  user: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 19.5c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/>',
  card: '<rect x="6.5" y="3.5" width="11" height="17" rx="2"/><path d="M12 8.5l1.2 2.3 2.3 1.2-2.3 1.2L12 15.5l-1.2-2.3L8.5 12l2.3-1.2z"/>',
  bookmark: '<path d="M7 4.5h10v15l-5-3.6-5 3.6z"/>',
  sync: '<path d="M19 8.5A7.5 7.5 0 0 0 5.6 7.4M5 15.5a7.5 7.5 0 0 0 13.4 1.1"/><path d="M19 4v4.5h-4.5M5 20v-4.5h4.5"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5z"/>',
};
export const icon = (name, cls = 'ic') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${PATHS[name] || ''}</svg>`;
