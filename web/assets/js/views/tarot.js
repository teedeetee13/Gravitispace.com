// Tarot: lá bài hôm nay, trải bài (gồm Thập tự Celtic 10 lá), thư viện 78 lá, trang chi tiết từng lá
import { $, $$, esc, icon, norm, shuffle, todayKey, toast } from '../util.js';
import { link } from '../route.js';
import { t } from '../i18n.js';
import { store } from '../store.js';
import { DECK, SUITS, SPREADS, cardById, suitById } from '../data/tarot.js';
import * as C from '../content.js';
import { backLink, gentleNote, postCard, tarotBack, tarotFace } from '../ui.js';

const REVERSED_CHANCE = 1 / 3;

function reading(raw, reversed, position) {
  const card = C.card(raw);
  return `<div class="reading">
    ${position ? `<p class="eyebrow">${esc(position)}</p>` : ''}
    <h3><a href="${link(`tarot/${card.id}`)}">${esc(card.name)}</a>${reversed ? ` <span class="tag">${t('tarot.reversed')}</span>` : ''}</h3>
    <p class="kw">${esc(reversed ? card.rev : card.up)}</p>
    <p>${esc(card.msg)}</p>
    <p class="question">${esc(card.q)}</p>
  </div>`;
}

/* ---------- Lá bài hôm nay ---------- */
function dailyBlock() {
  const draw = store.getDraw(todayKey());
  if (!draw) {
    return `<div class="daily">
      <button class="flip-slot" type="button" data-daily-draw aria-label="${esc(t('tarot.drawAria'))}">${tarotBack('lg')}</button>
      <div class="daily-text">
        <p class="eyebrow">${t('today.label')}</p>
        <h2>${t('tarot.dailyPrompt')}</h2>
        <p class="muted">${t('tarot.dailyNote')}</p>
      </div>
    </div>`;
  }
  const card = cardById[draw.cardId];
  return `<div class="daily">
    <div class="flip-slot is-flipped">${tarotFace(card, { reversed: draw.reversed, size: 'lg' })}</div>
    <div class="daily-text">
      ${reading(card, draw.reversed, t('today.label'))}
      <label class="field">
        <span>${t('tarot.noteLabel')}</span>
        <textarea rows="3" data-daily-note placeholder="${esc(t('tarot.notePlaceholder'))}">${esc(draw.note || '')}</textarea>
      </label>
      <p class="muted small">${t('tarot.noteHint')}</p>
    </div>
  </div>`;
}

/* ---------- Trải bài ---------- */
function spreadBlock(spreadId) {
  const spread = C.spread(SPREADS.find((s) => s.id === spreadId) || SPREADS[1]);
  const opts = SPREADS.map(C.spread).map(
    (s) => `<button type="button" class="chip ${s.id === spread.id ? 'on' : ''}" data-spread="${s.id}" aria-pressed="${s.id === spread.id}">${esc(s.name)}</button>`
  ).join('');
  return `<div class="chips">${opts}</div>
    <p class="muted">${t('tarot.spreadHint')}</p>
    <button type="button" class="btn" data-shuffle="${spread.id}">${icon('shuffle')} ${t('tarot.shuffle', { n: spread.positions.length })}</button>
    <div class="spread" id="spread-area"></div>`;
}

function dealSpread(spread, area) {
  const cards = shuffle(DECK).slice(0, spread.positions.length).map((c) => ({ card: c, reversed: Math.random() < REVERSED_CHANCE }));
  area.innerHTML = `<div class="spread-row ${cards.length > 5 ? 'is-large' : ''}">${cards
    .map(
      (_, i) => `<div class="spread-pos">
        <p class="eyebrow">${i + 1}. ${esc(spread.positions[i])}</p>
        <button type="button" class="flip-slot" data-flip="${i}" aria-label="${esc(t('tarot.flipAria', { n: i + 1 }))}">${tarotBack(cards.length > 5 ? 'sm' : '')}</button>
      </div>`
    )
    .join('')}</div><div class="spread-readings" aria-live="polite"></div>`;
  const readings = $('.spread-readings', area);
  const shown = new Set();
  // onclick (không phải addEventListener) để mỗi lần xào bài thay hẳn trình xử lý cũ
  area.onclick = (e) => {
    const btn = e.target.closest('[data-flip]');
    if (!btn) return;
    const i = Number(btn.dataset.flip);
    if (shown.has(i)) return;
    shown.add(i);
    const { card, reversed } = cards[i];
    btn.outerHTML = `<div class="flip-slot is-flipped just-flipped">${tarotFace(card, { reversed, size: cards.length > 5 ? 'sm' : '' })}</div>`;
    readings.insertAdjacentHTML('beforeend', reading(card, reversed, `${i + 1}. ${spread.positions[i]}`));
    if (shown.size === cards.length)
      readings.insertAdjacentHTML(
        'beforeend',
        `<div class="note-box">${t('tarot.spreadDone', { n: cards.length })}
        <a class="btn btn-ghost" href="${link(`gieo?chu-de=tarot&loai=trai-bai&ref=${cards.slice(0, 3).map((c) => c.card.id).join(',')}`)}">${icon('plus')} ${t('tarot.shareSpread')}</a></div>${gentleNote()}`
      );
  };
  area.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ---------- Thư viện ---------- */
function libraryGrid(filter, q) {
  const nq = norm(q);
  const list = DECK.filter((raw) => {
    if (filter === 'major' && raw.arcana !== 'major') return false;
    if (filter && filter !== 'major' && raw.suit !== filter) return false;
    const c = C.card(raw);
    return !nq || norm(`${c.name} ${raw.name} ${raw.en} ${c.up} ${c.rev}`).includes(nq);
  });
  if (!list.length) return `<p class="muted">${t('tarot.libEmpty', { q: esc(q) })}</p>`;
  return list.map((c) => `<a class="lib-item" href="${link(`tarot/${c.id}`)}">${tarotFace(c, { size: 'sm' })}<span>${esc(C.card(c).name)}</span></a>`).join('');
}

export function renderTarot(view) {
  const filters = [
    { id: '', label: t('tarot.all78') },
    { id: 'major', label: t('tarot.major') },
    ...SUITS.map(C.suit).map((s) => ({ id: s.id, label: `${s.name} · ${s.element}` })),
  ];
  view.innerHTML = `<div class="page">
    <header class="page-head">
      <p class="eyebrow">${t('tarot.eyebrow')}</p>
      <h1>${t('tarot.title')}</h1>
      <p class="lead">${t('tarot.lead')}</p>
    </header>

    <section class="section" id="daily-section">${dailyBlock()}</section>

    <section class="section">
      <h2 class="section-title">${t('tarot.spreads')}</h2>
      <div id="spread-block">${spreadBlock('ba-la')}</div>
    </section>

    <section class="section">
      <h2 class="section-title">${t('tarot.library')}</h2>
      <div class="lib-tools">
        <label class="search-input">${icon('search')}<input type="search" placeholder="${esc(t('tarot.libPlaceholder'))}" data-lib-q aria-label="${esc(t('tarot.libAria'))}" /></label>
        <div class="chips">${filters.map((f) => `<button type="button" class="chip ${f.id === '' ? 'on' : ''}" data-lib-filter="${f.id}" aria-pressed="${f.id === ''}">${esc(f.label)}</button>`).join('')}</div>
      </div>
      <div class="lib-grid" id="lib-grid">${libraryGrid('', '')}</div>
    </section>
    <p class="muted small">${t('tarot.source')}</p>
  </div>`;

  let libFilter = '';
  const grid = $('#lib-grid', view);
  const qInput = $('[data-lib-q]', view);
  const refreshLib = () => (grid.innerHTML = libraryGrid(libFilter, qInput.value));
  qInput.addEventListener('input', refreshLib);

  view.addEventListener('click', (e) => {
    const tg = e.target;
    if (tg.closest('[data-daily-draw]')) {
      const card = DECK[Math.floor(Math.random() * DECK.length)];
      store.setDraw(todayKey(), { cardId: card.id, reversed: Math.random() < REVERSED_CHANCE });
      window.dispatchEvent(new Event('ansao:draw')); // cập nhật ô "Lá bài hôm nay" ở thanh bên
      const sec = $('#daily-section', view);
      sec.innerHTML = dailyBlock();
      $('.flip-slot', sec).classList.add('just-flipped');
      bindNote();
      return;
    }
    const sp = tg.closest('[data-spread]');
    if (sp) {
      $('#spread-block', view).innerHTML = spreadBlock(sp.dataset.spread);
      return;
    }
    const sh = tg.closest('[data-shuffle]');
    if (sh) {
      dealSpread(C.spread(SPREADS.find((s) => s.id === sh.dataset.shuffle)), $('#spread-area', view));
      return;
    }
    const lf = tg.closest('[data-lib-filter]');
    if (lf) {
      libFilter = lf.dataset.libFilter;
      $$('[data-lib-filter]', view).forEach((b) => {
        b.classList.toggle('on', b === lf);
        b.setAttribute('aria-pressed', b === lf);
      });
      refreshLib();
    }
  });

  function bindNote() {
    const ta = $('[data-daily-note]', view);
    if (!ta) return;
    let tm;
    ta.addEventListener('input', () => {
      clearTimeout(tm);
      tm = setTimeout(() => {
        store.setDraw(todayKey(), { note: ta.value });
        toast(t('tarot.noteSaved'));
      }, 700);
    });
  }
  bindNote();
}

export function renderTarotCard(view, id) {
  const raw = cardById[id];
  if (!raw) return false;
  const card = C.card(raw);
  const i = DECK.indexOf(raw);
  const prev = DECK[(i - 1 + DECK.length) % DECK.length];
  const next = DECK[(i + 1) % DECK.length];
  const related = store.allPosts().filter((p) => p.refs?.includes(id));
  const s = raw.suit && C.suit(suitById[raw.suit]);
  const group = raw.arcana === 'major' ? t('tarot.majorFull') : t('tarot.suitGroup', { name: s.name, en: suitById[raw.suit].en, el: s.element });

  view.innerHTML = `<div class="page">
    ${backLink(link('tarot'), 'Tarot')}
    <div class="detail">
      <div class="detail-visual">${tarotFace(raw, { size: 'lg' })}</div>
      <div class="detail-body">
        <p class="eyebrow">${esc(group)}</p>
        <h1>${esc(card.name)}</h1>
        <p class="muted">${esc(raw.en)}</p>
        <dl class="kv">
          <div><dt>${t('tarot.upright')}</dt><dd>${esc(card.up)}</dd></div>
          <div><dt>${t('tarot.reversedFull')}</dt><dd>${esc(card.rev)}</dd></div>
        </dl>
        <p class="prose-lg">${esc(card.msg)}</p>
        <p class="question">${esc(card.q)}</p>
        <div class="row">
          <a class="btn" href="${link(`gieo?chu-de=tarot&ref=${card.id}`)}">${icon('plus')} ${t('tarot.writeAbout')}</a>
        </div>
      </div>
    </div>
    <nav class="pager" aria-label="${esc(t('common.pager'))}">
      <a href="${link(`tarot/${prev.id}`)}">${icon('back')} ${esc(C.card(prev).name)}</a>
      <a href="${link(`tarot/${next.id}`)}">${esc(C.card(next).name)} ${icon('arrow')}</a>
    </nav>
    <section class="section">
      <h2 class="section-title">${t('tarot.related')}</h2>
      ${related.length ? `<div class="post-grid">${related.map(postCard).join('')}</div>` : `<p class="muted">${t('tarot.noRelated')}</p>`}
    </section>
  </div>`;
  return true;
}
