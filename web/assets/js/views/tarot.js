// Tarot: lá bài hôm nay, trải bài, thư viện 78 lá, trang chi tiết từng lá
import { $, $$, esc, icon, norm, shuffle, todayKey, toast } from '../util.js';
import { store } from '../store.js';
import { DECK, SUITS, SPREADS, cardById, suitById } from '../data/tarot.js';
import { backLink, postCard, tarotBack, tarotFace } from '../ui.js';

const REVERSED_CHANCE = 1 / 3;

function reading(card, reversed, position) {
  return `<div class="reading">
    ${position ? `<p class="eyebrow">${esc(position)}</p>` : ''}
    <h3><a href="#/tarot/${card.id}">${esc(card.name)}</a>${reversed ? ' <span class="tag">Ngược</span>' : ''}</h3>
    <p class="kw">${esc(reversed ? card.rev : card.up)}</p>
    <p>${esc(card.msg)}</p>
    <p class="question">${esc(card.q)}</p>
  </div>`;
}

/* ---------- Lá bài hôm nay ---------- */
function dailyBlock() {
  const key = todayKey();
  const draw = store.getDraw(key);
  if (!draw) {
    return `<div class="daily">
      <button class="flip-slot" type="button" data-daily-draw aria-label="Chạm để rút lá bài hôm nay">${tarotBack('lg')}</button>
      <div class="daily-text">
        <p class="eyebrow">Lá bài hôm nay</p>
        <h2>Hít một hơi thật sâu, nghĩ về ngày hôm nay, rồi chạm vào lá bài.</h2>
        <p class="muted">Mỗi ngày chỉ rút một lá. Lá bài không đoán tương lai, nó chỉ đặt cho bạn một câu hỏi đẹp.</p>
      </div>
    </div>`;
  }
  const card = cardById[draw.cardId];
  return `<div class="daily">
    <div class="flip-slot is-flipped">${tarotFace(card, { reversed: draw.reversed, size: 'lg' })}</div>
    <div class="daily-text">
      ${reading(card, draw.reversed, 'Lá bài hôm nay')}
      <label class="field">
        <span>Bạn nghĩ gì khi đọc câu hỏi trên?</span>
        <textarea rows="3" data-daily-note placeholder="Viết cho riêng bạn, chỉ lưu trên máy này…">${esc(draw.note || '')}</textarea>
      </label>
      <p class="muted small">Ghi chú được lưu trong "Tủ của tôi" → Nhật ký lá bài.</p>
    </div>
  </div>`;
}

/* ---------- Trải bài ---------- */
function spreadBlock(spreadId) {
  const spread = SPREADS.find((s) => s.id === spreadId) || SPREADS[1];
  const opts = SPREADS.map(
    (s) => `<button type="button" class="chip ${s.id === spread.id ? 'on' : ''}" data-spread="${s.id}" aria-pressed="${s.id === spread.id}">${esc(s.name)}</button>`
  ).join('');
  return `<div class="chips">${opts}</div>
    <p class="muted">Nghĩ về câu hỏi của bạn, rồi bấm xào bài. Lật từng lá theo thứ tự.</p>
    <button type="button" class="btn" data-shuffle="${spread.id}">${icon('shuffle')} Xào bài và trải ${spread.positions.length} lá</button>
    <div class="spread" id="spread-area"></div>`;
}

function dealSpread(spread, area) {
  const cards = shuffle(DECK).slice(0, spread.positions.length).map((c) => ({ card: c, reversed: Math.random() < REVERSED_CHANCE }));
  area.innerHTML = `<div class="spread-row">${cards
    .map(
      (_, i) => `<div class="spread-pos">
        <p class="eyebrow">${esc(spread.positions[i])}</p>
        <button type="button" class="flip-slot" data-flip="${i}" aria-label="Lật lá ${i + 1}">${tarotBack()}</button>
      </div>`
    )
    .join('')}</div><div class="spread-readings"></div>`;
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
    btn.outerHTML = `<div class="flip-slot is-flipped">${tarotFace(card, { reversed })}</div>`;
    readings.insertAdjacentHTML('beforeend', reading(card, reversed, spread.positions[i]));
    if (shown.size === cards.length)
      readings.insertAdjacentHTML(
        'beforeend',
        `<div class="note-box">Đọc chậm cả ${cards.length} lá. Câu hỏi nào khiến bạn khựng lại lâu nhất? Đó thường là điều bạn đã biết từ trước.
        <a class="btn btn-ghost" href="#/gieo?chu-de=tarot&loai=trai-bai&ref=${cards.map((c) => c.card.id).join(',')}">${icon('plus')} Chia sẻ trải bài này</a></div>`
      );
  };
  area.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ---------- Thư viện ---------- */
function libraryGrid(filter, q) {
  const nq = norm(q);
  const list = DECK.filter((c) => {
    if (filter === 'major' && c.arcana !== 'major') return false;
    if (filter && filter !== 'major' && c.suit !== filter) return false;
    return !nq || norm(`${c.name} ${c.en} ${c.up} ${c.rev}`).includes(nq);
  });
  if (!list.length) return `<p class="muted">Không có lá nào khớp với "${esc(q)}".</p>`;
  return list.map((c) => `<a class="lib-item" href="#/tarot/${c.id}">${tarotFace(c, { size: 'sm' })}<span>${esc(c.name)}</span></a>`).join('');
}

export function renderTarot(view) {
  const filters = [{ id: '', label: 'Tất cả 78 lá' }, { id: 'major', label: 'Ẩn chính' }, ...SUITS.map((s) => ({ id: s.id, label: `${s.name} · ${s.element}` }))];
  view.innerHTML = `<div class="page">
    <header class="page-head">
      <p class="eyebrow">Tarot tỉnh táo</p>
      <h1>Lá bài là tấm gương, không phải lời phán.</h1>
      <p class="lead">Rút một lá mỗi ngày, trải bài khi bạn phân vân, hoặc tra nghĩa bất kỳ lá nào trong bộ 78 lá.</p>
    </header>

    <section class="section" id="daily-section">${dailyBlock()}</section>

    <section class="section">
      <h2 class="section-title">Trải bài</h2>
      <div id="spread-block">${spreadBlock('ba-la')}</div>
    </section>

    <section class="section">
      <h2 class="section-title">Thư viện 78 lá</h2>
      <div class="lib-tools">
        <label class="search-input">${icon('search')}<input type="search" placeholder="Tìm lá bài, ví dụ: hy vọng, Cups, Kiếm…" data-lib-q aria-label="Tìm lá bài" /></label>
        <div class="chips">${filters.map((f) => `<button type="button" class="chip ${f.id === '' ? 'on' : ''}" data-lib-filter="${f.id}">${esc(f.label)}</button>`).join('')}</div>
      </div>
      <div class="lib-grid" id="lib-grid">${libraryGrid('', '')}</div>
    </section>
  </div>`;

  let libFilter = '';
  const grid = $('#lib-grid', view);
  const qInput = $('[data-lib-q]', view);
  const refreshLib = () => (grid.innerHTML = libraryGrid(libFilter, qInput.value));
  qInput.addEventListener('input', refreshLib);

  view.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('[data-daily-draw]')) {
      const card = DECK[Math.floor(Math.random() * DECK.length)];
      store.setDraw(todayKey(), { cardId: card.id, reversed: Math.random() < REVERSED_CHANCE });
      window.dispatchEvent(new Event('huuduyen:draw')); // cập nhật ô "Lá bài hôm nay" ở thanh bên
      const sec = $('#daily-section', view);
      sec.innerHTML = dailyBlock();
      $('.flip-slot', sec).classList.add('just-flipped');
      bindNote();
      return;
    }
    const sp = t.closest('[data-spread]');
    if (sp) {
      $('#spread-block', view).innerHTML = spreadBlock(sp.dataset.spread);
      return;
    }
    const sh = t.closest('[data-shuffle]');
    if (sh) {
      dealSpread(SPREADS.find((s) => s.id === sh.dataset.shuffle), $('#spread-area', view));
      return;
    }
    const lf = t.closest('[data-lib-filter]');
    if (lf) {
      libFilter = lf.dataset.libFilter;
      $$('[data-lib-filter]', view).forEach((b) => b.classList.toggle('on', b === lf));
      refreshLib();
    }
  });

  function bindNote() {
    const ta = $('[data-daily-note]', view);
    if (!ta) return;
    let t;
    ta.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        store.setDraw(todayKey(), { note: ta.value });
        toast('Đã lưu ghi chú');
      }, 700);
    });
  }
  bindNote();
}

export function renderTarotCard(view, id) {
  const card = cardById[id];
  if (!card) return false;
  const i = DECK.indexOf(card);
  const prev = DECK[(i - 1 + DECK.length) % DECK.length];
  const next = DECK[(i + 1) % DECK.length];
  const related = store.allPosts().filter((p) => p.refs?.includes(id));
  const group = card.arcana === 'major' ? 'Ẩn chính (Major Arcana)' : `Bộ ${suitById[card.suit].name} (${suitById[card.suit].en}) · Nguyên tố ${suitById[card.suit].element}`;

  view.innerHTML = `<div class="page">
    ${backLink('#/tarot', 'Tarot')}
    <div class="detail">
      <div class="detail-visual">${tarotFace(card, { size: 'lg' })}</div>
      <div class="detail-body">
        <p class="eyebrow">${esc(group)}</p>
        <h1>${esc(card.name)}</h1>
        <p class="muted">${esc(card.en)}</p>
        <dl class="kv">
          <div><dt>Chiều xuôi</dt><dd>${esc(card.up)}</dd></div>
          <div><dt>Chiều ngược</dt><dd>${esc(card.rev)}</dd></div>
        </dl>
        <p class="prose-lg">${esc(card.msg)}</p>
        <p class="question">${esc(card.q)}</p>
        <div class="row">
          <a class="btn" href="#/gieo?chu-de=tarot&ref=${card.id}">${icon('plus')} Viết về lá này</a>
        </div>
      </div>
    </div>
    <nav class="pager">
      <a href="#/tarot/${prev.id}">${icon('back')} ${esc(prev.name)}</a>
      <a href="#/tarot/${next.id}">${esc(next.name)} ${icon('arrow')}</a>
    </nav>
    <section class="section">
      <h2 class="section-title">Bài viết có nhắc đến lá này</h2>
      ${related.length ? `<div class="post-grid">${related.map(postCard).join('')}</div>` : `<p class="muted">Chưa có ai viết về lá này. Bạn có muốn là người đầu tiên?</p>`}
    </section>
  </div>`;
  return true;
}
