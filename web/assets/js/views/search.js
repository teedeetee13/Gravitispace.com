// Tìm kiếm hợp nhất: bài viết, lá bài, cung hoàng đạo, con giáp — một ô tìm cho tất cả (theo ngôn ngữ đang chọn)
import { $, $$, debounce, esc, icon, norm } from '../util.js';
import { link } from '../route.js';
import { t } from '../i18n.js';
import { store } from '../store.js';
import { TOPICS, topicById, CRISIS_PHRASES } from '../data/taxonomy.js';
import { DECK } from '../data/tarot.js';
import { SIGNS, dateRange } from '../data/zodiac.js';
import { CHI } from '../data/tuvi.js';
import * as C from '../content.js';
import { postCard, signBadge, tarotFace } from '../ui.js';
import { hotlineBox } from './about.js';


function results(q, topic) {
  const words = norm(q.trim()).split(/\s+/).filter(Boolean);
  const hit = (text) => words.every((w) => norm(text).includes(w));

  const posts = store
    .allPosts()
    .map((p) => [p, C.post(p)])
    .filter(([, p]) => (!topic || p.topic === topic) && (!words.length || hit(`${p.title} ${p.body} ${p.author}`)))
    .map(([raw]) => raw);
  if (!words.length) return { posts, cards: [], signs: [], chis: [] };

  const want = (tp) => !topic || topic === tp;
  return {
    posts,
    cards: want('tarot') ? DECK.filter((raw) => { const c = C.card(raw); return hit(`${c.name} ${raw.name} ${raw.en} ${c.up} ${c.rev}`); }) : [],
    signs: want('chiem-tinh') ? SIGNS.filter((raw) => { const s = C.sign(raw); return hit(`${raw.name} ${raw.en} ${s.keywords} ${s.element} ${s.ruler}`); }) : [],
    chis: want('tu-vi') ? CHI.filter((raw) => { const c = C.chi(raw); return hit(`${t('ref.chi')} ${raw.name} ${raw.animal} ${c.animal} ${c.traits} ${raw.hanh}`); }) : [],
  };
}

function renderResults(q, topic) {
  const r = results(q, topic);
  const total = r.posts.length + r.cards.length + r.signs.length + r.chis.length;
  const crisis = CRISIS_PHRASES.some((p) => q.toLowerCase().includes(p));
  const parts = [];
  if (crisis) parts.push(hotlineBox(t('search.crisis')));
  if (q.trim()) parts.push(`<p class="muted">${t('search.count', { n: total, q: esc(q) })}</p>`);

  if (r.cards.length)
    parts.push(`<h2 class="section-title">${t('search.cards')}</h2><div class="lib-grid">${r.cards
      .slice(0, 12)
      .map((c) => `<a class="lib-item" href="${link(`tarot/${c.id}`)}">${tarotFace(c, { size: 'sm' })}<span>${esc(C.card(c).name)}</span></a>`)
      .join('')}</div>`);
  if (r.signs.length)
    parts.push(`<h2 class="section-title">${t('search.signs')}</h2><div class="sign-grid">${r.signs
      .map((s) => `<a class="sign-tile" href="${link(`chiem-tinh/${s.id}`)}">${signBadge(s)}<span class="sign-name">${esc(C.sign(s).name)}</span><span class="muted small">${dateRange(s)}</span></a>`)
      .join('')}</div>`);
  if (r.chis.length)
    parts.push(`<h2 class="section-title">${t('search.chis')}</h2><div class="chi-grid">${r.chis
      .map((c) => `<a class="chi-tile" href="${link(`tu-vi/${c.id}`)}"><span class="chi-name">${esc(C.ganzhi(c.name))}</span><span>${esc(C.chi(c).animal)}</span></a>`)
      .join('')}</div>`);

  parts.push(`<h2 class="section-title">${q.trim() ? t('search.posts') : t('search.latest')}</h2>`);
  parts.push(
    r.posts.length
      ? `<div class="post-grid">${r.posts
          .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
          .map(postCard)
          .join('')}</div>`
      : `<p class="muted">${t('search.noPosts')} <a href="${link(`gieo`)}">${t('search.writeFirst')}</a></p>`
  );
  return parts.join('');
}

export function renderSearch(view, params) {
  let q = params.get('q') || '';
  let topic = topicById[params.get('chu-de')] ? params.get('chu-de') : '';
  view.innerHTML = `<div class="page">
    <header class="page-head">
      <p class="eyebrow">${t('nav.search')}</p>
      <h1>${t('search.title')}</h1>
    </header>
    <form class="search-bar" role="search" data-search-form>
      <label class="search-input lg">${icon('search')}<input type="search" name="q" value="${esc(q)}" placeholder="${esc(t('search.placeholder'))}" aria-label="${esc(t('search.keyword'))}" autocomplete="off" /></label>
    </form>
    <div class="chips" data-topics>
      ${[{ id: '', label: t('common.all') }, ...TOPICS.map((tp) => ({ ...tp, label: C.topicLabel(tp) }))].map((tp) => `<button type="button" class="chip ${tp.id === topic ? 'on' : ''}" data-topic="${tp.id}" aria-pressed="${tp.id === topic}">${esc(tp.label)}</button>`).join('')}
    </div>
    <div class="chips suggest"><span class="muted small">${t('search.suggest')}</span>${t('search.suggestList').split('|').map((s) => `<button type="button" class="chip chip-ghost" data-suggest="${esc(s)}">${esc(s)}</button>`).join('')}</div>
    <div id="search-results" aria-live="polite">${renderResults(q, topic)}</div>
  </div>`;

  const input = $('input[name=q]', view);
  const out = $('#search-results', view);
  const update = () => {
    q = input.value;
    out.innerHTML = renderResults(q, topic);
    const sp = new URLSearchParams();
    if (q) sp.set('q', q);
    if (topic) sp.set('chu-de', topic);
    history.replaceState(null, '', link(`tim${sp.toString() ? `?${sp}` : ''}`));
  };
  input.addEventListener('input', debounce(update));
  $('[data-search-form]', view).addEventListener('submit', (e) => {
    e.preventDefault();
    update();
  });
  view.addEventListener('click', (e) => {
    const tb = e.target.closest('[data-topic]');
    if (tb) {
      topic = tb.dataset.topic;
      $$('[data-topic]', view).forEach((b) => {
        b.classList.toggle('on', b === tb);
        b.setAttribute('aria-pressed', b === tb);
      });
      update();
    }
    const s = e.target.closest('[data-suggest]');
    if (s) {
      input.value = s.dataset.suggest;
      update();
    }
  });
  if (!q && matchMedia('(min-width: 960px)').matches) input.focus();
}
