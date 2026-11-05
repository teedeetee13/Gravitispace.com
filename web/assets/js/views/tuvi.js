// Tử vi: tra Can Chi + mệnh theo năm sinh âm lịch, 12 con giáp, ngũ hành
import { $, esc, icon } from '../util.js';
import { store } from '../store.js';
import { CHI, HANH, chiById, yearInfo } from '../data/tuvi.js';
import { backLink, postCard } from '../ui.js';

const chiTile = (c) => `<a class="chi-tile" href="#/tu-vi/${c.id}" style="--c:${HANH[c.hanh].color}">
  <span class="chi-name">${esc(c.name)}</span><span>${esc(c.animal)}</span><span class="muted small">Hành ${esc(c.hanh)}</span>
</a>`;

export function yearCard(info) {
  const h = HANH[info.hanh];
  return `<div class="year-card" style="--c:${h.color}">
    <div class="year-head">
      <div><p class="eyebrow">Năm ${info.year} âm lịch</p><h3>${esc(info.canChi)}</h3><p>Tuổi ${esc(info.chi.name)} · con ${esc(info.chi.animal)}</p></div>
      <div class="hanh-badge">${esc(info.hanh)}</div>
    </div>
    <dl class="kv">
      <div><dt>Mệnh nạp âm</dt><dd><strong>${esc(info.napAm)}</strong> · ${esc(info.meaning)}</dd></div>
      <div><dt>Tính chất hành ${esc(info.hanh)}</dt><dd>${esc(h.trait)}</dd></div>
      <div><dt>Màu hợp</dt><dd>${esc(h.tone)}, và màu của hành ${esc(h.support)} (hành sinh ra ${esc(info.hanh)})</dd></div>
      <div><dt>Ngũ hành</dt><dd>${esc(h.support)} sinh ${esc(info.hanh)} · ${esc(info.hanh)} sinh ${esc(h.sinh)} · ${esc(info.hanh)} khắc ${esc(h.khac)}</dd></div>
      <div><dt>Tam hợp</dt><dd>${info.hop.map((c) => `<a href="#/tu-vi/${c.id}">${esc(c.name)}</a>`).join(', ')}</dd></div>
      <div><dt>Tứ hành xung</dt><dd>${info.xung.map((c) => `<a href="#/tu-vi/${c.id}">${esc(c.name)}</a>`).join(', ')}</dd></div>
    </dl>
    <div class="heal-note"><p class="eyebrow">Lời chữa lành cho tuổi ${esc(info.chi.name)}</p><p>${esc(info.chi.heal)}</p></div>
  </div>`;
}

export function renderTuvi(view) {
  view.innerHTML = `<div class="page">
    <header class="page-head">
      <p class="eyebrow">Tử vi phương Đông</p>
      <h1>Can Chi, con giáp và mệnh của bạn.</h1>
      <p class="lead">Người xưa dùng hình ảnh thiên nhiên để nói về tính cách: vàng trong cát, lửa ngọn đèn, nước khe lớn. Hãy đọc như đọc một bài thơ.</p>
    </header>

    <form class="lookup" data-year-form>
      <label class="field"><span>Năm sinh âm lịch</span><input type="number" name="y" min="1900" max="2100" required inputmode="numeric" placeholder="1998" /></label>
      <button class="btn" type="submit">${icon('search')} Xem tuổi và mệnh</button>
      <p class="muted small field-hint">Nếu bạn sinh vào tháng 1 hoặc đầu tháng 2 dương lịch, trước Tết Nguyên Đán, hãy nhập năm trước đó.</p>
    </form>
    <div id="year-result" aria-live="polite"></div>

    <section class="section">
      <h2 class="section-title">12 con giáp</h2>
      <div class="chi-grid">${CHI.map(chiTile).join('')}</div>
    </section>

    <section class="section">
      <h2 class="section-title">Ngũ hành tương sinh</h2>
      <div class="cycle">${['Kim', 'Thủy', 'Mộc', 'Hỏa', 'Thổ']
        .map((k) => `<div class="cycle-item" style="--c:${HANH[k].color}"><strong>${k}</strong><span class="small">${esc(HANH[k].trait)}</span></div>`)
        .join(`<span class="cycle-arrow" aria-label="sinh">${icon('arrow')}</span>`)}</div>
      <p class="muted small">Kim sinh Thủy, Thủy sinh Mộc, Mộc sinh Hỏa, Hỏa sinh Thổ, Thổ sinh Kim. Tương khắc: Kim khắc Mộc, Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim.</p>
    </section>

    <div class="note-box">Lá số Tử Vi Đẩu Số đầy đủ (theo giờ, ngày, tháng, năm sinh) sẽ có trong phiên bản sau.</div>
  </div>`;

  $('[data-year-form]', view).addEventListener('submit', (e) => {
    e.preventDefault();
    const y = Number(new FormData(e.target).get('y'));
    $('#year-result', view).innerHTML = y >= 1900 && y <= 2100 ? yearCard(yearInfo(y)) : `<p class="muted">Năm sinh chưa hợp lệ.</p>`;
  });
}

export function renderChi(view, id) {
  const c = chiById[id];
  if (!c) return false;
  const now = new Date().getFullYear();
  // Các năm gần đây ứng với con giáp này
  let first = now - 84;
  while (yearInfo(first).chiIndex !== c.index) first++;
  const years = [];
  for (let y = first; y <= now + 12; y += 12) years.push(yearInfo(y));
  const related = store.allPosts().filter((p) => p.refs?.includes(id));
  const prev = CHI[(c.index + 11) % 12];
  const next = CHI[(c.index + 1) % 12];

  view.innerHTML = `<div class="page">
    ${backLink('#/tu-vi', 'Tử vi')}
    <div class="detail">
      <div class="detail-visual"><div class="chi-hero" style="--c:${HANH[c.hanh].color}"><span>${esc(c.name)}</span><small>${esc(c.animal)}</small></div></div>
      <div class="detail-body">
        <p class="eyebrow">Địa chi thứ ${c.index + 1} · hành ${esc(c.hanh)}</p>
        <h1>Tuổi ${esc(c.name)}</h1>
        <p class="kw">${esc(c.traits)}</p>
        <h2 class="h-sm">Điều cần để ý</h2><p>${esc(c.shadow)}</p>
        <div class="heal-note"><p class="eyebrow">Lời chữa lành</p><p>${esc(c.heal)}</p></div>
        <div class="row"><a class="btn" href="#/gieo?chu-de=tu-vi&ref=${c.id}">${icon('plus')} Viết về tuổi ${esc(c.name)}</a></div>
      </div>
    </div>

    <section class="section">
      <h2 class="section-title">Các năm tuổi ${esc(c.name)}</h2>
      <div class="table-wrap"><table class="table">
        <thead><tr><th>Năm</th><th>Can Chi</th><th>Mệnh nạp âm</th><th>Hành</th></tr></thead>
        <tbody>${years
          .map((y) => `<tr${y.year === now ? ' class="is-now"' : ''}><td>${y.year}</td><td>${esc(y.canChi)}</td><td>${esc(y.napAm)} <span class="muted">· ${esc(y.meaning)}</span></td><td>${esc(y.hanh)}</td></tr>`)
          .join('')}</tbody>
      </table></div>
    </section>

    <nav class="pager">
      <a href="#/tu-vi/${prev.id}">${icon('back')} Tuổi ${esc(prev.name)}</a>
      <a href="#/tu-vi/${next.id}">Tuổi ${esc(next.name)} ${icon('arrow')}</a>
    </nav>

    <section class="section">
      <h2 class="section-title">Bài viết liên quan</h2>
      ${related.length ? `<div class="post-grid">${related.map(postCard).join('')}</div>` : `<p class="muted">Chưa có bài viết nào về tuổi ${esc(c.name)}.</p>`}
    </section>
  </div>`;
  return true;
}
