import { t, fmtDate } from './i18n.js';

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
/** Chống chèn mã (XSS): luôn dùng hàm này cho mọi nội dung đưa vào HTML. */
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

/** Bỏ dấu tiếng Việt để tìm kiếm "tarot" khớp "Tarốt", "tu vi" khớp "Tử vi". */
export const norm = (s) =>
  String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();

export const paragraphs = (text) =>
  esc(text).split(/\n+/).filter(Boolean).map((p) => `<p>${p}</p>`).join('');

export function shuffle(arr, rand = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Số ngẫu nhiên có hạt giống. */
export function seeded(seedStr) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return t('time.now');
  if (diff < 3600) return t('time.min', { n: Math.floor(diff / 60) });
  if (diff < 86400) return t('time.hour', { n: Math.floor(diff / 3600) });
  if (diff < 86400 * 30) return t('time.day', { n: Math.floor(diff / 86400) });
  return fmtDate(new Date(iso));
}

export const icon = (name, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-${name}"/></svg>`;

let toastTimer;
export function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

export function debounce(fn, ms = 180) {
  let tm;
  return (...args) => {
    clearTimeout(tm);
    tm = setTimeout(() => fn(...args), ms);
  };
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])';

/** Mở hộp thoại (giữ tiêu điểm bên trong, Esc để đóng); trả về hàm đóng. */
export function openModal(html, { onClose, label } = {}) {
  const root = $('#modal-root');
  const last = document.activeElement;
  root.innerHTML = `<div class="modal-backdrop" data-close><div class="modal" role="dialog" aria-modal="true" aria-label="${esc(label || '')}">
    <button class="icon-btn modal-x" type="button" data-close aria-label="${esc(t('common.close'))}">${icon('close')}</button>${html}</div></div>`;
  const modal = root.querySelector('.modal');
  const close = () => {
    root.innerHTML = '';
    document.removeEventListener('keydown', onKey);
    last?.focus?.();
    onClose?.();
  };
  const onKey = (e) => {
    if (e.key === 'Escape') return close();
    if (e.key !== 'Tab') return;
    const items = $$(FOCUSABLE, modal);
    if (!items.length) return;
    const first = items[0];
    const lastItem = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      lastItem.focus();
    } else if (!e.shiftKey && document.activeElement === lastItem) {
      e.preventDefault();
      first.focus();
    }
  };
  document.addEventListener('keydown', onKey);
  root.querySelector('.modal-backdrop').addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-close') || e.target.closest('.modal-x')) close();
  });
  (modal.querySelector('.modal button:not(.modal-x), .modal a') || modal.querySelector('.modal-x')).focus();
  return close;
}
