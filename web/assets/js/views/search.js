// Tìm kiếm hợp nhất: bài viết, lá bài, cung hoàng đạo, con giáp — một ô tìm cho tất cả
import { $, $$, debounce, esc, icon, norm } from '../util.js';
import { store } from '../store.js';
import { TOPICS, topicById, CRISIS_PHRASES } from '../data/taxonomy.js';
import { DECK } from '../data/tarot.js';
import { SIGNS, dateRange } from '../data/zodiac.js';
import { CHI } from '../data/tuvi.js';
import { postCard, signBadge, tarotFace } from '../ui.js';
import { hotlineBox } from './about.js';

const SUGGEST = ['Ngôi Sao', 'chữa lành', 'Bọ Cạp', 'nạp âm', 'năm tuổi', 'cô đơn', 'Ba Kiếm', 'Ma Kết', 'tuổi Mão'];

function results(q, topic) {
  const nq = norm(q.trim());
  const words = nq.split(/\s+/).filter(Boolean);
  const hit = (text) => words.every((w) => norm(text).includes(w));

  const posts = store.allPosts().filter((p) => (!topic || p.topic === topic) && (!words.length || hit(`${p.title} ${p.body} ${p.author}`)));
  if (!words.length) return { posts, cards: [], signs: [], chis: [] };

  const want = (t) => !topic || topic === t;
  return {
    posts,
    cards: want('tarot') ? DECK.filter((c) => hit(`${c.name} ${c.en} ${c.up} ${c.rev}`)) : [],
    signs: want('chiem-tinh') ? SIGNS.filter((s) => hit(`${s.name} ${s.en} ${s.keywords} ${s.element} ${s.ruler}`)) : [],
    chis: want('tu-vi') ? CHI.filter((c) => hit(`tuổi ${c.name} ${c.animal} ${c.traits} ${c.hanh}`)) : [],
  };
}

function renderResults(q, topic) {
  const r = results(q, topic);
  const total = r.posts.length + r.cards.length + r.signs.length + r.chis.length;
  const crisis = CRISIS_PHRASES.some((p) => q.toLowerCase().includes(p));
  const parts = [];
  if (crisis) parts.push(hotlineBox('Nếu bạn đang nghĩ đến việc làm hại bản thân, xin hãy gọi ngay cho một trong các số dưới đây. Bạn không phải một mình đi qua chuyện này.'));
  if (q.trim()) parts.push(`<p class="muted">${total} kết quả cho "${esc(q)}"</p>`);

  if (r.cards.length)
    parts.push(`<h2 class="section-title">Lá bài Tarot</h2><div class="lib-grid">${r.cards
      .slice(0, 12)
      .map((c) => `<a class="lib-item" href="#/tarot/${c.id}">${tarotFace(c, { size: 'sm' })}<span>${esc(c.name)}</span></a>`)
      .join('')}</div>`);
  if (r.signs.length)
    parts.push(`<h2 class="section-title">Cung hoàng đạo</h2><div class="sign-grid">${r.signs
      .map((s) => `<a class="sign-tile" href="#/chiem-tinh/${s.id}">${signBadge(s)}<span class="sign-name">${esc(s.name)}</span><span class="muted small">${dateRange(s)}</span></a>`)
      .join('')}</div>`);
  if (r.chis.length)
    parts.push(`<h2 class="section-title">Con giáp</h2><div class="chi-grid">${r.chis
      .map((c) => `<a class="chi-tile" href="#/tu-vi/${c.id}"><span class="chi-name">${esc(c.name)}</span><span>${esc(c.animal)}</span></a>`)
      .join('')}</div>`);

  parts.push(`<h2 class="section-title">${q.trim() ? 'Bài viết' : 'Bài viết mới nhất'}</h2>`);
  parts.push(
    r.posts.length
      ? `<div class="post-grid">${r.posts
          .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
          .map(postCard)
          .join('')}</div>`
      : `<p class="muted">Chưa có bài viết nào khớp. <a href="#/gieo">Bạn viết bài đầu tiên nhé?</a></p>`
  );
  return parts.join('');
}

export function renderSearch(view, params) {
  let q = params.get('q') || '';
  let topic = topicById[params.get('chu-de')] ? params.get('chu-de') : '';
  view.innerHTML = `<div class="page">
    <header class="page-head">
      <p class="eyebrow">Tìm kiếm</p>
      <h1>Bạn đang tìm điều gì?</h1>
    </header>
    <form class="search-bar" role="search" data-search-form>
      <label class="search-input lg">${icon('search')}<input type="search" name="q" value="${esc(q)}" placeholder="Tên lá bài, cung, con giáp, hay một cảm xúc…" aria-label="Từ khoá" autocomplete="off" /></label>
    </form>
    <div class="chips" data-topics>
      ${[{ id: '', label: 'Tất cả' }, ...TOPICS].map((t) => `<button type="button" class="chip ${t.id === topic ? 'on' : ''}" data-topic="${t.id}">${esc(t.label)}</button>`).join('')}
    </div>
    <div class="chips suggest"><span class="muted small">Gợi ý:</span>${SUGGEST.map((s) => `<button type="button" class="chip chip-ghost" data-suggest="${esc(s)}">${esc(s)}</button>`).join('')}</div>
    <div id="search-results">${renderResults(q, topic)}</div>
  </div>`;

  const input = $('input[name=q]', view);
  const out = $('#search-results', view);
  const update = () => {
    q = input.value;
    out.innerHTML = renderResults(q, topic);
    const sp = new URLSearchParams();
    if (q) sp.set('q', q);
    if (topic) sp.set('chu-de', topic);
    history.replaceState(null, '', `#/tim${sp.toString() ? `?${sp}` : ''}`);
  };
  input.addEventListener('input', debounce(update));
  $('[data-search-form]', view).addEventListener('submit', (e) => {
    e.preventDefault();
    update();
  });
  view.addEventListener('click', (e) => {
    const t = e.target.closest('[data-topic]');
    if (t) {
      topic = t.dataset.topic;
      $$('[data-topic]', view).forEach((b) => b.classList.toggle('on', b === t));
      update();
    }
    const s = e.target.closest('[data-suggest]');
    if (s) {
      input.value = s.dataset.suggest;
      update();
    }
  });
  if (!q) input.focus();
}
