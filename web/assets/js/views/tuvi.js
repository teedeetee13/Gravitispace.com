// Tử vi: tra Can Chi + mệnh theo năm sinh âm lịch, 12 con giáp, ngũ hành, lối vào Lá số Tử Vi
import { $, esc, icon } from '../util.js';
import { t } from '../i18n.js';
import { store } from '../store.js';
import { CHI, HANH, chiById, yearInfo } from '../data/tuvi.js';
import * as C from '../content.js';
import { backLink, postCard } from '../ui.js';

const chiTile = (c) => `<a class="chi-tile" href="#/tu-vi/${c.id}" style="--c:${HANH[c.hanh].color}">
  <span class="chi-name">${esc(C.ganzhi(c.name))}</span><span>${esc(C.chi(c).animal)}</span><span class="muted small">${t('tuvi.hanhOf', { h: esc(C.hanhName(c.hanh)) })}</span>
</a>`;

export function yearCard(info) {
  const h = C.hanh(info.hanh, HANH[info.hanh]);
  const na = C.napAm(info.napAm, info.meaning);
  const chi = C.chi(info.chi);
  const hn = (x) => esc(C.hanhName(x));
  return `<div class="year-card" style="--c:${HANH[info.hanh].color}">
    <div class="year-head">
      <div><p class="eyebrow">${t('tuvi.lunarYear', { y: info.year })}</p><h3>${esc(C.ganzhi(info.canChi))}</h3><p>${t('tuvi.ageOf', { name: esc(C.ganzhi(chi.name)), animal: esc(chi.animal) })}</p></div>
      <div class="hanh-badge">${esc(h.name)}</div>
    </div>
    <dl class="kv">
      <div><dt>${t('tuvi.napAm')}</dt><dd><strong>${esc(na.name)}</strong> · ${esc(na.meaning)}</dd></div>
      <div><dt>${t('tuvi.hanhNature', { h: esc(h.name) })}</dt><dd>${esc(h.trait)}</dd></div>
      <div><dt>${t('tuvi.colors')}</dt><dd>${t('tuvi.colorsText', { tone: esc(h.tone), support: hn(HANH[info.hanh].support), h: esc(h.name) })}</dd></div>
      <div><dt>${t('tuvi.cycle')}</dt><dd>${t('tuvi.cycleText', { s: hn(HANH[info.hanh].support), h: esc(h.name), sinh: hn(HANH[info.hanh].sinh), khac: hn(HANH[info.hanh].khac) })}</dd></div>
      <div><dt>${t('tuvi.tamHop')}</dt><dd>${info.hop.map((c) => `<a href="#/tu-vi/${c.id}">${esc(C.ganzhi(c.name))}</a>`).join(', ')}</dd></div>
      <div><dt>${t('tuvi.tuXung')}</dt><dd>${info.xung.map((c) => `<a href="#/tu-vi/${c.id}">${esc(C.ganzhi(c.name))}</a>`).join(', ')}</dd></div>
    </dl>
    <div class="heal-note"><p class="eyebrow">${t('tuvi.healFor', { name: esc(C.ganzhi(chi.name)) })}</p><p>${esc(chi.heal)}</p></div>
  </div>`;
}

export function renderTuvi(view) {
  view.innerHTML = `<div class="page">
    <header class="page-head">
      <p class="eyebrow">${t('tuvi.eyebrow')}</p>
      <h1>${t('tuvi.title')}</h1>
      <p class="lead">${t('tuvi.lead')}</p>
    </header>

    <a class="feature-card" href="#/tu-vi/la-so">
      <span class="sign-glyph">${icon('yinyang')}</span>
      <div><p class="eyebrow">${t('tuvi.lasoEyebrow')}</p><h2>${t('laso.title')}</h2><p>${t('tuvi.lasoDesc')}</p></div>${icon('arrow')}
    </a>

    <form class="lookup" data-year-form>
      <label class="field"><span>${t('tuvi.yearInput')}</span><input type="number" name="y" min="1900" max="2100" required inputmode="numeric" placeholder="1998" /></label>
      <button class="btn" type="submit">${icon('search')} ${t('tuvi.lookup')}</button>
      <p class="muted small field-hint">${t('tuvi.tetHint')}</p>
    </form>
    <div id="year-result" aria-live="polite"></div>

    <section class="section">
      <h2 class="section-title">${t('tuvi.twelve')}</h2>
      <div class="chi-grid">${CHI.map(chiTile).join('')}</div>
    </section>

    <section class="section">
      <h2 class="section-title">${t('tuvi.wuxing')}</h2>
      <div class="cycle">${['Kim', 'Thủy', 'Mộc', 'Hỏa', 'Thổ']
        .map((k) => { const h = C.hanh(k, HANH[k]); return `<div class="cycle-item" style="--c:${HANH[k].color}"><strong>${esc(h.name)}</strong><span class="small">${esc(h.trait)}</span></div>`; })
        .join(`<span class="cycle-arrow" aria-label="${esc(t('tuvi.generates'))}">${icon('arrow')}</span>`)}</div>
      <p class="muted small">${t('tuvi.wuxingText')}</p>
    </section>
  </div>`;

  $('[data-year-form]', view).addEventListener('submit', (e) => {
    e.preventDefault();
    const y = Number(new FormData(e.target).get('y'));
    $('#year-result', view).innerHTML = y >= 1900 && y <= 2100 ? yearCard(yearInfo(y)) : `<p class="muted">${t('tuvi.badYear')}</p>`;
  });
}

export function renderChi(view, id) {
  const raw = chiById[id];
  if (!raw) return false;
  const c = C.chi(raw);
  const now = new Date().getFullYear();
  let first = now - 84;
  while (yearInfo(first).chiIndex !== raw.index) first++;
  const years = [];
  for (let y = first; y <= now + 12; y += 12) years.push(yearInfo(y));
  const related = store.allPosts().filter((p) => p.refs?.includes(id));
  const prev = CHI[(raw.index + 11) % 12];
  const next = CHI[(raw.index + 1) % 12];

  view.innerHTML = `<div class="page">
    ${backLink('#/tu-vi', t('nav.tuvi'))}
    <div class="detail">
      <div class="detail-visual"><div class="chi-hero" style="--c:${HANH[raw.hanh].color}"><span>${esc(raw.name)}</span><small>${esc(c.animal)}</small></div></div>
      <div class="detail-body">
        <p class="eyebrow">${t('tuvi.branchN', { n: raw.index + 1, h: esc(C.hanhName(raw.hanh)) })}</p>
        <h1>${t('tuvi.ageTitle', { name: esc(raw.name) })}</h1>
        <p class="kw">${esc(c.traits)}</p>
        <h2 class="h-sm">${t('tuvi.notice')}</h2><p>${esc(c.shadow)}</p>
        <div class="heal-note"><p class="eyebrow">${t('common.healing')}</p><p>${esc(c.heal)}</p></div>
        <div class="row"><a class="btn" href="#/gieo?chu-de=tu-vi&ref=${raw.id}">${icon('plus')} ${t('tuvi.writeAbout', { name: esc(raw.name) })}</a></div>
      </div>
    </div>

    <section class="section">
      <h2 class="section-title">${t('tuvi.yearsOf', { name: esc(raw.name) })}</h2>
      <div class="table-wrap"><table class="table">
        <thead><tr><th>${t('tuvi.thYear')}</th><th>${t('tuvi.thCanChi')}</th><th>${t('tuvi.napAm')}</th><th>${t('tuvi.thHanh')}</th></tr></thead>
        <tbody>${years
          .map((y) => { const na = C.napAm(y.napAm, y.meaning); return `<tr${y.year === now ? ' class="is-now"' : ''}><td>${y.year}</td><td>${esc(C.ganzhi(y.canChi))}</td><td>${esc(na.name)} <span class="muted">· ${esc(na.meaning)}</span></td><td>${esc(C.hanhName(y.hanh))}</td></tr>`; })
          .join('')}</tbody>
      </table></div>
    </section>

    <nav class="pager" aria-label="${esc(t('common.pager'))}">
      <a href="#/tu-vi/${prev.id}">${icon('back')} ${t('tuvi.ageTitle', { name: esc(prev.name) })}</a>
      <a href="#/tu-vi/${next.id}">${t('tuvi.ageTitle', { name: esc(next.name) })} ${icon('arrow')}</a>
    </nav>

    <section class="section">
      <h2 class="section-title">${t('common.relatedPosts')}</h2>
      ${related.length ? `<div class="post-grid">${related.map(postCard).join('')}</div>` : `<p class="muted">${t('common.beFirst')}</p>`}
    </section>
  </div>`;
  return true;
}
