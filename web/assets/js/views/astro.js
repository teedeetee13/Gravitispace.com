// Chiêm tinh: tra cung theo ngày sinh, 12 cung, trang chi tiết
import { $, esc, icon } from '../util.js';
import { store } from '../store.js';
import { ELEMENTS, SIGNS, dateRange, signById, signFromDate } from '../data/zodiac.js';
import { backLink, postCard, signBadge } from '../ui.js';

const ELEMENT_COLOR = { 'Lửa': '#c7604a', 'Đất': '#9a8150', 'Khí': '#6b93a8', 'Nước': '#4f6fb0' };

const signTile = (s) => `<a class="sign-tile" href="#/chiem-tinh/${s.id}" style="--c:${ELEMENT_COLOR[s.element]}">
  ${signBadge(s)}<span class="sign-name">${esc(s.name)}</span><span class="muted small">${dateRange(s)}</span>
</a>`;

export function renderAstro(view) {
  view.innerHTML = `<div class="page">
    <header class="page-head">
      <p class="eyebrow">Chiêm tinh</p>
      <h1>Bầu trời lúc bạn chào đời.</h1>
      <p class="lead">Mỗi cung là một bộ tính cách với ánh sáng và bóng tối riêng. Đọc để hiểu mình hơn, không phải để đóng khung mình.</p>
    </header>

    <form class="lookup" data-sign-form>
      <label class="field"><span>Ngày sinh</span><input type="number" name="d" min="1" max="31" required inputmode="numeric" placeholder="15" /></label>
      <label class="field"><span>Tháng sinh</span><input type="number" name="m" min="1" max="12" required inputmode="numeric" placeholder="8" /></label>
      <button class="btn" type="submit">${icon('search')} Tìm cung của tôi</button>
    </form>
    <div id="sign-result" aria-live="polite"></div>

    <section class="section">
      <h2 class="section-title">12 cung hoàng đạo</h2>
      <div class="sign-grid">${SIGNS.map(signTile).join('')}</div>
    </section>

    <section class="section">
      <h2 class="section-title">Bốn nguyên tố</h2>
      <div class="element-grid">${Object.entries(ELEMENTS)
        .map(([el, d]) => `<div class="element" style="--c:${ELEMENT_COLOR[el]}"><strong>${el}</strong><span>${esc(d)}</span>
          <span class="muted small">${SIGNS.filter((s) => s.element === el).map((s) => s.name).join(', ')}</span></div>`)
        .join('')}</div>
    </section>
  </div>`;

  $('[data-sign-form]', view).addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const s = signFromDate(Number(f.get('m')), Number(f.get('d')));
    $('#sign-result', view).innerHTML = s
      ? `<a class="result-card" href="#/chiem-tinh/${s.id}" style="--c:${ELEMENT_COLOR[s.element]}">${signBadge(s)}
          <div><p class="eyebrow">Cung Mặt Trời của bạn</p><h3>${esc(s.name)}</h3><p>${esc(s.keywords)}</p></div>${icon('arrow')}</a>`
      : `<p class="muted">Ngày tháng chưa hợp lệ, bạn kiểm tra lại nhé.</p>`;
  });
}

export function renderSign(view, id) {
  const s = signById[id];
  if (!s) return false;
  const i = SIGNS.indexOf(s);
  const prev = SIGNS[(i + 11) % 12];
  const next = SIGNS[(i + 1) % 12];
  const siblings = SIGNS.filter((x) => x.element === s.element && x !== s);
  const related = store.allPosts().filter((p) => p.refs?.includes(id));

  view.innerHTML = `<div class="page">
    ${backLink('#/chiem-tinh', 'Chiêm tinh')}
    <div class="detail">
      <div class="detail-visual"><div class="sign-hero" style="--c:${ELEMENT_COLOR[s.element]}">${signBadge(s)}</div></div>
      <div class="detail-body">
        <p class="eyebrow">${dateRange(s)} · ${esc(s.en)}</p>
        <h1>${esc(s.name)}</h1>
        <p class="kw">${esc(s.keywords)}</p>
        <dl class="kv">
          <div><dt>Nguyên tố</dt><dd>${esc(s.element)}</dd></div>
          <div><dt>Tính chất</dt><dd>${esc(s.modality)}</dd></div>
          <div><dt>Hành tinh chủ quản</dt><dd>${esc(s.ruler)}</dd></div>
        </dl>
        <h2 class="h-sm">Ánh sáng</h2><p>${esc(s.light)}</p>
        <h2 class="h-sm">Bóng tối, cũng là bài học</h2><p>${esc(s.shadow)}</p>
        <div class="heal-note"><p class="eyebrow">Lời chữa lành</p><p>${esc(s.heal)}</p></div>
        <p class="muted small">Cùng nguyên tố ${esc(s.element)}: ${siblings.map((x) => `<a href="#/chiem-tinh/${x.id}">${esc(x.name)}</a>`).join(', ')}</p>
        <div class="row"><a class="btn" href="#/gieo?chu-de=chiem-tinh&ref=${s.id}">${icon('plus')} Viết về ${esc(s.name)}</a></div>
      </div>
    </div>
    <nav class="pager">
      <a href="#/chiem-tinh/${prev.id}">${icon('back')} ${esc(prev.name)}</a>
      <a href="#/chiem-tinh/${next.id}">${esc(next.name)} ${icon('arrow')}</a>
    </nav>
    <section class="section">
      <h2 class="section-title">Người ${esc(s.name)} chia sẻ</h2>
      ${related.length ? `<div class="post-grid">${related.map(postCard).join('')}</div>` : `<p class="muted">Chưa có bài viết nào. Hãy là người đầu tiên.</p>`}
    </section>
  </div>`;
  return true;
}
