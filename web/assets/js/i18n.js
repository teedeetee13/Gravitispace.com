// Đa ngôn ngữ. Tiếng Việt là bản gốc, tải sẵn; mọi ngôn ngữ khác tải lười khi người dùng chọn.
//  - Chuỗi giao diện: từ điển i18n/<ma>.js (khoá dạng "trang.muc") → t().
//  - Nội dung dữ liệu cũ (lá bài, cung, con giáp, bài mẫu…): i18n/<ma>-content.js → cx().
//  - Lời luận giải viết song ngữ ngay trong dữ liệu dạng { vi, en } → tr(). Với ngôn ngữ thứ ba trở đi,
//    bản dịch nằm trong i18n/<ma>-text.js, tra theo câu tiếng Anh gốc (bộ nhớ dịch), để tệp dữ liệu
//    không phình to với người chỉ đọc tiếng Việt.
// Danh mục ngôn ngữ: i18n/langs.js. Kiểm thử bắt buộc mọi ngôn ngữ đủ 100% chuỗi.
import { CONFIG } from './config.js';
import { LANG_CODES, langMeta } from './i18n/langs.js';
import VI from './i18n/vi.js';

const KEY = CONFIG.STORAGE_PREFIX + 'lang';
let lang = CONFIG.DEFAULT_LANG;
let dict = VI;
let content = null;
let text = null;

export const getLang = () => lang;
export { LANGS } from './i18n/langs.js';

/** Đoán ngôn ngữ: đã chọn trước đó → ngôn ngữ trình duyệt (nếu có hỗ trợ) → tiếng Việt. */
function savedLang() {
  try {
    const v = localStorage.getItem(KEY);
    if (LANG_CODES.includes(v)) return v;
  } catch {}
  for (const l of navigator.languages || [navigator.language || '']) {
    const base = String(l).toLowerCase().split('-')[0];
    if (LANG_CODES.includes(base)) return base;
  }
  return CONFIG.DEFAULT_LANG;
}

// Mỗi ngôn ngữ một bộ import tĩnh để trình duyệt (và công cụ kiểm tra) thấy rõ đường dẫn.
const PACKS = {
  en: () => Promise.all([import('./i18n/en.js'), import('./i18n/en-content.js')]),
  es: () => Promise.all([import('./i18n/es.js'), import('./i18n/es-content.js'), import('./i18n/es-text.js')]),
  fr: () => Promise.all([import('./i18n/fr.js'), import('./i18n/fr-content.js'), import('./i18n/fr-text.js')]),
  de: () => Promise.all([import('./i18n/de.js'), import('./i18n/de-content.js'), import('./i18n/de-text.js')]),
  zh: () => Promise.all([import('./i18n/zh.js'), import('./i18n/zh-content.js'), import('./i18n/zh-text.js')]),
  hi: () => Promise.all([import('./i18n/hi.js'), import('./i18n/hi-content.js'), import('./i18n/hi-text.js')]),
  th: () => Promise.all([import('./i18n/th.js'), import('./i18n/th-content.js'), import('./i18n/th-text.js')]),
};

/** Đổi ngôn ngữ; tải gói nếu cần. Lỗi mạng khi tải gói → giữ nguyên ngôn ngữ cũ và báo lỗi cho nơi gọi. */
export async function setLang(next = savedLang()) {
  if (!LANG_CODES.includes(next)) next = CONFIG.DEFAULT_LANG;
  if (next === 'vi') {
    dict = VI;
    content = null;
    text = null;
  } else {
    const [ui, data, tm] = await PACKS[next]();
    dict = ui.default;
    content = data.default;
    text = tm?.default ?? null;
  }
  lang = next;
  document.documentElement.lang = langMeta(next).html;
  try {
    localStorage.setItem(KEY, next);
  } catch {}
}

/** Lấy chuỗi giao diện theo khoá; {ten} trong chuỗi được thay bằng vars.ten */
export function t(key, vars) {
  let s = dict[key] ?? VI[key] ?? key;
  if (vars) for (const k in vars) s = s.split(`{${k}}`).join(vars[k]);
  return s;
}

/** Chọn bản ngôn ngữ của nội dung song ngữ { vi, en }; ngôn ngữ khác tra bộ nhớ dịch theo câu tiếng Anh. */
export const tr = (o) => {
  if (o == null) return '';
  if (typeof o === 'string') return o;
  if (o[lang] != null) return o[lang];
  if (text && o.en != null && text[o.en] != null) return text[o.en];
  return lang === 'vi' ? o.vi ?? '' : o.en ?? o.vi ?? '';
};

/** Bản dịch của một trường dữ liệu cũ (kind: card | sign | chi | post …); không có thì giữ tiếng Việt. */
export const cx = (kind, id, field, fallback) => (lang === 'vi' ? fallback : content?.[kind]?.[id]?.[field] ?? fallback);

/** Định dạng ngày theo ngôn ngữ đang chọn */
export const fmtDate = (date, opts = { day: 'numeric', month: 'numeric', year: 'numeric' }) =>
  new Intl.DateTimeFormat(langMeta(lang).locale, opts).format(date);
