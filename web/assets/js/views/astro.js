// Chiêm tinh: tra cung theo ngày sinh, 12 cung, trang chi tiết, lối vào Bản đồ sao
import { $, esc, icon } from '../util.js';
import { link } from '../route.js';
import { t } from '../i18n.js';
import { store } from '../store.js';
import { ELEMENTS, SIGNS, dateRange, signById, signFromDate } from '../data/zodiac.js';
import * as C from '../content.js';
import { backLink, postCard, signBadge } from '../ui.js';

export const ELEMENT_COLOR = { 'Lửa': '#c7604a', 'Đất': '#9a8150', 'Khí': '#6b93a8', 'Nước': '#4f6fb0' };

const signTile = (s) => `<a class="sign-tile" href="${link(`chiem-tinh/${s.id}`)}" style="--c:${ELEMENT_COLOR[s.element]}">
  ${signBadge(s)}<span class="sign-name">${esc(C.sign(s).name)}</span><span class="muted small">${dateRange(s)}</span>
</a>`;

export function renderAstro(view) {
  view.innerHTML = `<div class="page">
    <header class="page-head">
      <p class="eyebrow">${t('nav.astro')}</p>
      <h1>${t('astro.title')}</h1>
      <p class="lead">${t('astro.lead')}</p>
    </header>

    <a class="feature-card" href="${link(`chiem-tinh/ban-do-sao`)}">
      <span class="sign-glyph">${icon('star')}</span>
      <div><p class="eyebrow">${t('astro.natalEyebrow')}</p><h2>${t('natal.title')}</h2><p>${t('astro.natalDesc')}</p></div>${icon('arrow')}
    </a>

    <form class="lookup" data-sign-form>
      <label class="field"><span>${t('astro.day')}</span><input type="number" name="d" min="1" max="31" required inputmode="numeric" placeholder="15" /></label>
      <label class="field"><span>${t('astro.month')}</span><input type="number" name="m" min="1" max="12" required inputmode="numeric" placeholder="8" /></label>
      <button class="btn" type="submit">${icon('search')} ${t('astro.find')}</button>
    </form>
    <div id="sign-result" aria-live="polite"></div>

    <section class="section">
      <h2 class="section-title">${t('astro.twelve')}</h2>
      <div class="sign-grid">${SIGNS.map(signTile).join('')}</div>
    </section>

    <section class="section">
      <h2 class="section-title">${t('astro.elements')}</h2>
      <div class="element-grid">${Object.entries(ELEMENTS)
        .map(([el, d]) => `<div class="element" style="--c:${ELEMENT_COLOR[el]}"><strong>${esc(C.element(el))}</strong><span>${esc(C.elementDesc(el, d))}</span>
          <span class="muted small">${SIGNS.filter((s) => s.element === el).map((s) => esc(C.sign(s).name)).join(', ')}</span></div>`)
        .join('')}</div>
    </section>
  </div>`;

  $('[data-sign-form]', view).addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const m = Number(f.get('m'));
    const d = Number(f.get('d'));
    const valid = m >= 1 && m <= 12 && d >= 1 && new Date(2000, m - 1, d).getDate() === d;
    const s = valid && signFromDate(m, d);
    $('#sign-result', view).innerHTML = s
      ? `<a class="result-card" href="${link(`chiem-tinh/${s.id}`)}" style="--c:${ELEMENT_COLOR[s.element]}">${signBadge(s)}
          <div><p class="eyebrow">${t('astro.yourSun')}</p><h3>${esc(C.sign(s).name)}</h3><p>${esc(C.sign(s).keywords)}</p></div>${icon('arrow')}</a>`
      : `<p class="muted">${t('form.invalidDate')}</p>`;
  });
}

export function renderSign(view, id) {
  const raw = signById[id];
  if (!raw) return false;
  const s = C.sign(raw);
  const i = SIGNS.indexOf(raw);
  const prev = SIGNS[(i + 11) % 12];
  const next = SIGNS[(i + 1) % 12];
  const siblings = SIGNS.filter((x) => x.element === raw.element && x !== raw);
  const related = store.allPosts().filter((p) => p.refs?.includes(id));

  view.innerHTML = `<div class="page">
    ${backLink(link('chiem-tinh'), t('nav.astro'))}
    <div class="detail">
      <div class="detail-visual"><div class="sign-hero" style="--c:${ELEMENT_COLOR[raw.element]}">${signBadge(raw)}</div></div>
      <div class="detail-body">
        <p class="eyebrow">${dateRange(raw)} · ${esc(raw.en)}</p>
        <h1>${esc(s.name)}</h1>
        <p class="kw">${esc(s.keywords)}</p>
        <dl class="kv">
          <div><dt>${t('astro.element')}</dt><dd>${esc(s.element)}</dd></div>
          <div><dt>${t('astro.modality')}</dt><dd>${esc(s.modality)}</dd></div>
          <div><dt>${t('astro.ruler')}</dt><dd>${esc(s.ruler)}</dd></div>
        </dl>
        <h2 class="h-sm">${t('astro.light')}</h2><p>${esc(s.light)}</p>
        <h2 class="h-sm">${t('astro.shadow')}</h2><p>${esc(s.shadow)}</p>
        <div class="heal-note"><p class="eyebrow">${t('common.healing')}</p><p>${esc(s.heal)}</p></div>
        <p class="muted small">${t('astro.sameElement', { el: esc(s.element) })} ${siblings.map((x) => `<a href="${link(`chiem-tinh/${x.id}`)}">${esc(C.sign(x).name)}</a>`).join(', ')}</p>
        <div class="row"><a class="btn" href="${link(`gieo?chu-de=chiem-tinh&ref=${raw.id}`)}">${icon('plus')} ${t('astro.writeAbout', { name: esc(s.name) })}</a></div>
      </div>
    </div>
    <nav class="pager" aria-label="${esc(t('common.pager'))}">
      <a href="${link(`chiem-tinh/${prev.id}`)}">${icon('back')} ${esc(C.sign(prev).name)}</a>
      <a href="${link(`chiem-tinh/${next.id}`)}">${esc(C.sign(next).name)} ${icon('arrow')}</a>
    </nav>
    <section class="section">
      <h2 class="section-title">${t('astro.shares', { name: esc(s.name) })}</h2>
      ${related.length ? `<div class="post-grid">${related.map(postCard).join('')}</div>` : `<p class="muted">${t('common.beFirst')}</p>`}
    </section>
  </div>`;
  return true;
}
