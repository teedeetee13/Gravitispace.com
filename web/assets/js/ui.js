// Các mảnh giao diện dùng chung
import { esc, icon, timeAgo } from './util.js';
import { ROOT, link, postLink } from './route.js';
import { t } from './i18n.js';
import { store } from './store.js';
import { topicById, typeById } from './data/taxonomy.js';
import { cardById } from './data/tarot.js';
import { signById, glyph } from './data/zodiac.js';
import { chiById } from './data/tuvi.js';
import * as C from './content.js';
import { cover } from './cover.js';

/** Đổi một mã tham chiếu thành { label, href, kind } */
export function resolveRef(id) {
  if (cardById[id]) return { kind: t('ref.tarot'), label: C.card(cardById[id]).name, href: link(`tarot/${id}`) };
  if (signById[id]) return { kind: t('ref.sign'), label: C.sign(signById[id]).name, href: link(`chiem-tinh/${id}`) };
  if (chiById[id]) return { kind: t('ref.chi'), label: `${C.ganzhi(chiById[id].name)} (${C.chi(chiById[id]).animal})`, href: link(`tu-vi/${id}`) };
  return null;
}

export const topicChip = (topicId) => {
  const tp = topicById[topicId];
  return tp ? `<a class="chip chip-topic" style="--c:${tp.color}" href="${link(`tim?chu-de=${tp.id}`)}">${esc(C.topicLabel(tp))}</a>` : '';
};

export const refChips = (refs = []) =>
  refs
    .map(resolveRef)
    .filter(Boolean)
    .map((r) => `<a class="chip chip-ref" href="${r.href}"><span>${esc(r.kind)}</span>${esc(r.label)}</a>`)
    .join('');

export function postActions(p, { open = true } = {}) {
  const touched = store.isTouched(p.id);
  const saved = store.isSaved(p.id);
  return `<div class="actions">
    <button type="button" class="act ${touched ? 'on' : ''}" data-action="touch" data-id="${esc(p.id)}" aria-pressed="${touched}" aria-label="${esc(t('post.touch'))}">
      ${icon('heart')}<span class="act-count">${store.hearts(p)}</span></button>
    <button type="button" class="act ${saved ? 'on' : ''}" data-action="save" data-id="${esc(p.id)}" aria-pressed="${saved}" aria-label="${esc(t('post.saveAria'))}">
      ${icon('bookmark')}<span>${saved ? t('post.saved') : t('post.save')}</span></button>
    <button type="button" class="act" data-action="share" data-id="${esc(p.id)}" aria-label="${esc(t('post.shareAria'))}">
      ${icon('share')}<span>${t('post.share')}</span></button>
    ${open ? `<a class="act act-open" href="${postLink(p.id)}">${t('post.readFull')} ${icon('arrow')}</a>` : ''}
  </div>`;
}

export function postMeta(p) {
  const type = typeById[p.type] ? C.typeLabel(typeById[p.type]) : '';
  return `<div class="meta">${topicChip(p.topic)}<span>${esc(type)}</span><span aria-hidden="true">·</span><time datetime="${esc(p.createdAt)}">${timeAgo(p.createdAt)}</time></div>`;
}

/** Bìa ngang của một bài: dòng nhỏ = kiểu bài, dòng lớn = lá bài / cung / con giáp được nhắc tới (hoặc chủ đề) */
export function postCover(p) {
  const ref = (p.refs || []).map(resolveRef).find(Boolean);
  const type = typeById[p.type] ? C.typeLabel(typeById[p.type]) : '';
  const topic = topicById[p.topic] ? C.topicLabel(topicById[p.topic]) : '';
  return cover(p, 'wide', { eyebrow: ref ? `${topic} · ${type}` : type, title: ref ? ref.label : topic });
}

/** Thẻ bài viết rút gọn — dùng trong danh sách */
export function postCard(raw) {
  const p = C.post(raw);
  const excerpt = p.body.length > 220 ? p.body.slice(0, 220).trimEnd() + '…' : p.body;
  return `<article class="post-card has-cover" style="--c:${topicById[p.topic]?.color || 'var(--accent)'}">
    <a class="post-card-cover" href="${postLink(p.id)}" tabindex="-1" aria-hidden="true">${postCover(p)}</a>
    ${postMeta(p)}
    <a class="post-card-link" href="${postLink(p.id)}">
      ${p.title ? `<h3>${esc(p.title)}</h3>` : ''}
      <p class="excerpt">${esc(excerpt).replace(/\n+/g, ' ')}</p>
    </a>
    <div class="post-card-foot">
      <span class="author">${esc(p.author)}</span>
      <span class="mini-hearts">${icon('heart')} ${store.hearts(p)}</span>
    </div>
  </article>`;
}

const SUIT_ART = {
  gay: '<path d="M50 14v72M50 30l-11-9M50 46l11-9M50 62l-11-9"/>',
  coc: '<path d="M31 26h38c0 20-8 31-19 31S31 46 31 26zM50 57v16M37 78h26"/>',
  kiem: '<path d="M50 12l-4 8v46h8V20zM37 66h26M50 66v14M45 82h10"/>',
  tien: '<circle cx="50" cy="50" r="27"/><path d="M50 28 62.9 67.8 29.1 43.2h41.8L37.1 67.8z"/>',
};
const MAJOR_ART =
  '<circle cx="50" cy="50" r="17"/><circle cx="50" cy="50" r="29" stroke-dasharray="2 5"/><path d="M50 9v12M50 79v12M9 50h12M79 50h12M21 21l8 8M71 71l8 8M79 21l-8 8M29 71l-8 8"/>';

/**
 * Mặt trước lá bài Tarot: tranh gốc Rider–Waite–Smith 1909 (Pamela Colman Smith, phạm vi công cộng,
 * nguồn Wikimedia Commons — xem assets/tarot/CREDITS.md). Ảnh tải lười; nếu lỗi thì hiện hình vẽ SVG thay thế.
 */
export function tarotFace(raw, { reversed = false, size = '' } = {}) {
  const card = C.card(raw);
  const art = card.arcana === 'major' ? MAJOR_ART : SUIT_ART[card.suit];
  const suitName = card.arcana === 'major' ? t('tarot.major') : C.suitName(card.suit);
  const img = `<img class="tcard-img" src="${ROOT}assets/tarot/${esc(card.id)}.jpg" alt="${esc(card.name)}${reversed ? ` (${esc(t('tarot.reversedShort'))})` : ''}" loading="lazy" decoding="async" width="300" height="520" data-fallback />`;
  return `<div class="tcard has-img ${card.arcana === 'major' ? 'is-major' : `suit-${card.suit}`} ${reversed ? 'is-rev' : ''} ${size}">
    <div class="tcard-face">${img}
      <span class="tcard-num">${esc(card.numeral)}</span>
      <svg class="tcard-art" viewBox="0 0 100 100" aria-hidden="true">${art}</svg>
      <span class="tcard-name">${esc(card.name)}</span>
      <span class="tcard-suit">${esc(suitName)}</span>
    </div>
  </div>`;
}

export const tarotBack = (extra = '') =>
  `<div class="tcard is-back ${extra}"><div class="tcard-face"><svg class="tcard-art" viewBox="0 0 100 100" aria-hidden="true">${MAJOR_ART}</svg></div></div>`;

export const signBadge = (s) => `<span class="sign-glyph" aria-hidden="true">${glyph(s)}</span>`;

export const emptyState = (title, body, cta = '') =>
  `<div class="empty"><p class="empty-title">${title}</p><p>${body}</p>${cta}</div>`;

export const backLink = (href, label) => `<a class="back" href="${href}">${icon('back')}${esc(label)}</a>`;

/** Ghi chú nhẹ nhàng ở cuối các trang luận giải */
export const gentleNote = () => `<p class="gentle-note">${icon('info')}<span>${t('common.gentleNote')}</span></p>`;
