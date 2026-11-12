// Bản mệnh: nhập thông tin sinh một lần → tổng quan Đông + Tây, lá bài hôm nay, lối vào lá số, lộ trình năng lượng
import { $, esc, icon, todayKey, toast } from '../util.js';
import { link } from '../route.js';
import { t, tr } from '../i18n.js';
import { store } from '../store.js';
import { signFromDate, SIGNS, glyph } from '../data/zodiac.js';
import { yearInfo } from '../data/tuvi.js';
import { cardById } from '../data/tarot.js';
import { solarToLunar } from '../lib/lunar.js';
import { natalChart } from '../lib/ephemeris.js';
import { buildChart } from '../lib/tuvi-chart.js';
import { PALACE_INFO, DAI_HAN_THEME } from '../data/tuvi-stars.js';
import * as C from '../content.js';
import { gentleNote, signBadge, tarotFace } from '../ui.js';
import { yearCard } from './tuvi.js';
import { birthFormHtml, bindBirthForm, readBirthForm } from './birth.js';

function result(p) {
  const s = signFromDate(p.month, p.day);
  const lunar = solarToLunar(p.day, p.month, p.year);
  const info = yearInfo(lunar.year);
  const draw = store.getDraw(todayKey());
  const card = draw && cardById[draw.cardId];
  const natal = natalChart({ ...p, lat: p.lat ?? NaN, lon: p.lon ?? NaN, hour: p.timeKnown ? p.hour : 12, minute: p.timeKnown ? p.minute : 0 });
  const moon = natal.bodies.find((b) => b.id === 'moon');
  const tuvi = p.timeKnown && p.gender ? buildChart(p) : null;

  const small = (href, badge, eyebrow, title, desc) =>
    `<a class="result-card" href="${href}">${badge}<div><p class="eyebrow">${eyebrow}</p><h3>${title}</h3><p>${desc}</p></div>${icon('arrow')}</a>`;

  return `<div class="profile-grid">
    ${small(link(`chiem-tinh/${s.id}`), signBadge(s), t('profile.sun'), esc(C.sign(s).name), esc(C.sign(s).keywords))}
    ${small(link(`chiem-tinh/${SIGNS[moon.sign].id}`), `<span class="sign-glyph">${glyph(SIGNS[moon.sign])}</span>`, t('natal.moon'), esc(C.sign(SIGNS[moon.sign]).name), natal.moonUncertain ? t('natal.moonUncertain') : t('natal.moonDesc'))}
    ${natal.ascSign
      ? small(link('chiem-tinh/ban-do-sao'), `<span class="sign-glyph">${glyph(SIGNS[natal.ascSign.sign])}</span>`, t('natal.asc'), esc(C.sign(SIGNS[natal.ascSign.sign]).name), t('natal.ascDesc'))
      : small(link('chiem-tinh/ban-do-sao'), `<span class="sign-glyph">?</span>`, t('natal.asc'), t('natal.needTime'), t('natal.needTimeDesc'))}
    ${small(link(`tu-vi/${info.chi.id}`), `<span class="sign-glyph">${esc(C.ganzhi(info.chi.name))}</span>`, t('profile.lunarAge'), esc(C.ganzhi(info.canChi)), t('profile.lunarDate', { d: lunar.day, m: lunar.month, y: lunar.year, menh: esc(C.napAm(info.napAm, info.meaning).name) }))}
    ${small(link('tarot'), card ? `<span class="mini-card">${tarotFace(card, { size: 'xs', reversed: draw.reversed })}</span>` : `<span class="sign-glyph">${icon('card')}</span>`, t('today.label'), card ? esc(C.card(card).name) : t('today.none'), card ? esc(C.card(card).q) : t('today.cta'))}
    ${small(link('tu-vi/la-so'), `<span class="sign-glyph">${icon('yinyang')}</span>`, t('laso.title'), tuvi ? t('profile.cucMenh', { p: esc(tr(PALACE_INFO.menh.name)), label: esc(C.ganzhi(tuvi.palaces[tuvi.menh].label)) }) : t('profile.lasoNeed'), tuvi ? t('profile.openLaso') : t('profile.lasoNeedDesc'))}
  </div>

  <section class="section">
    <h2 class="section-title">${t('profile.roadmap')}</h2>
    <div class="reading-card">
      ${tuvi && tuvi.current
        ? `<h3>${t('profile.daiHanNow', { a: tuvi.current.daiHan.from, b: tuvi.current.daiHan.to, p: esc(tr(PALACE_INFO[tuvi.current.palace].name)) })}</h3><p>${esc(tr(DAI_HAN_THEME[tuvi.current.palace]))}</p>`
        : `<p class="muted">${t('profile.daiHanNeed')}</p>`}
      <p><a href="${link(`tu-vi/la-so`)}">${t('profile.seeDaiHan')}</a> · <a href="${link(`chiem-tinh/ban-do-sao`)}">${t('profile.seeTransits')}</a></p>
    </div>
    ${gentleNote()}
  </section>

  <section class="section">
    <h2 class="section-title">${t('profile.ageDetail', { name: esc(C.ganzhi(info.chi.name)) })}</h2>
    ${yearCard(info)}
  </section>`;
}

export function renderProfile(view) {
  const p = store.getProfile();
  view.innerHTML = `<div class="page">
    <header class="page-head">
      <p class="eyebrow">${t('nav.profile')}</p>
      <h1>${t('profile.title')}</h1>
      <p class="lead">${t('profile.lead')}</p>
    </header>
    <details class="form-toggle" ${p ? '' : 'open'}>
      <summary>${p ? t('profile.editInfo') : t('profile.enterInfo')}</summary>
      ${birthFormHtml(p, { submitLabel: t('profile.submit') })}
    </details>
    <div id="profile-result" aria-live="polite">${p ? result(p) : ''}</div>
  </div>`;

  const form = $('[data-birth-form]', view);
  bindBirthForm(form);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const r = readBirthForm(form);
    $('[data-error]', form).textContent = r.error || '';
    if (r.error) return;
    store.setProfile(r.profile);
    $('#profile-result', view).innerHTML = result(store.getProfile());
    $('.form-toggle', view).open = false;
    toast(t('birth.saved'));
    $('#profile-result', view).scrollIntoView({ behavior: 'smooth' });
  });
}
