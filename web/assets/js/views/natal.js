// Bản đồ sao (natal chart): biểu mẫu → vòng hoàng đạo → bảng vị trí → luận giải → năng lượng giai đoạn hiện tại
import { $, esc, icon, toast } from '../util.js';
import { link } from '../route.js';
import { t, tr } from '../i18n.js';
import { store } from '../store.js';
import { SIGNS, glyph } from '../data/zodiac.js';
import { natalChart, positions, dayNumber, toSign, findAspects } from '../lib/ephemeris.js';
import { PLANETS, SIGN_STYLE, HOUSES, ELEMENT_OF_SIGN, MODALITY_OF_SIGN, ELEMENT_TEXT, MODALITY_TEXT, TRANSIT, PLANET_SHORT, ASPECT_TEXT } from '../data/astro-texts.js';
import * as C from '../content.js';
import { backLink, gentleNote } from '../ui.js';
import { birthFormHtml, bindBirthForm, readBirthForm } from './birth.js';

const signName = (i) => C.sign(SIGNS[i]).name;
const fmtDeg = (deg) => `${Math.floor(deg)}°${String(Math.floor((deg % 1) * 60)).padStart(2, '0')}′`;
const planetName = (id) => tr(PLANETS[id].name);

/** Vòng hoàng đạo SVG: cung Mọc nằm bên trái (hoặc 0° Bạch Dương nếu không rõ giờ). */
function wheel(chart) {
  const base = chart.angles ? chart.angles.asc : chart.firstSign * 30;
  const R = 150;
  const pt = (lon, r) => {
    const a = ((180 + (lon - base)) * Math.PI) / 180; // ngược chiều kim đồng hồ, cung Mọc ở 9 giờ
    return [R + r * Math.cos(a), R - r * Math.sin(a)];
  };
  let svg = `<circle cx="${R}" cy="${R}" r="146" class="w-outer"/><circle cx="${R}" cy="${R}" r="116" class="w-inner"/><circle cx="${R}" cy="${R}" r="60" class="w-core"/>`;
  for (let i = 0; i < 12; i++) {
    const [x1, y1] = pt(i * 30, 116);
    const [x2, y2] = pt(i * 30, 146);
    const [gx, gy] = pt(i * 30 + 15, 131);
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="w-tick"/>`;
    svg += `<text x="${gx}" y="${gy}" class="w-sign el-${ELEMENT_OF_SIGN[i]}" text-anchor="middle" dominant-baseline="central">${glyph(SIGNS[i])}</text>`;
  }
  if (chart.angles) {
    const [ax, ay] = pt(chart.angles.asc, 116);
    const [bx, by] = pt(chart.angles.asc + 180, 116);
    const [mx, my] = pt(chart.angles.mc, 116);
    const [nx, ny] = pt(chart.angles.mc + 180, 116);
    svg += `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" class="w-axis"/><line x1="${mx}" y1="${my}" x2="${nx}" y2="${ny}" class="w-axis w-axis-mc"/>`;
    svg += `<text x="${pt(chart.angles.asc, 70)[0]}" y="${pt(chart.angles.asc, 70)[1]}" class="w-label" text-anchor="middle" dominant-baseline="central">AC</text>`;
    svg += `<text x="${pt(chart.angles.mc, 70)[0]}" y="${pt(chart.angles.mc, 70)[1]}" class="w-label" text-anchor="middle" dominant-baseline="central">MC</text>`;
  }
  // Đường góc chiếu nối các thiên thể (trong vòng lõi)
  for (const a of chart.aspects || []) {
    if (a.aspect === 'conjunction') continue;
    const la = chart.bodies.find((b) => b.id === a.a).lon;
    const lb = chart.bodies.find((b) => b.id === a.b).lon;
    const [x1, y1] = pt(la, 60);
    const [x2, y2] = pt(lb, 60);
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="w-asp asp-${a.aspect}"/>`;
  }
  // Rải các hành tinh gần nhau ra các tầng bán kính khác nhau để khỏi chồng chữ
  const sorted = [...chart.bodies].sort((a, b) => a.lon - b.lon);
  let lastLon = -99;
  let tier = 0;
  for (const b of sorted) {
    tier = b.lon - lastLon < 9 ? (tier + 1) % 3 : 0;
    lastLon = b.lon;
    const r = 96 - tier * 15;
    const [x, y] = pt(b.lon, r);
    const [dx, dy] = pt(b.lon, 116);
    const [ex, ey] = pt(b.lon, 110);
    svg += `<line x1="${dx}" y1="${dy}" x2="${ex}" y2="${ey}" class="w-tick"/>`;
    svg += `<text x="${x}" y="${y}" class="w-planet" text-anchor="middle" dominant-baseline="central">${PLANETS[b.id].glyph}︎</text>`;
  }
  return `<svg class="natal-wheel" viewBox="0 0 300 300" role="img" aria-label="${esc(t('natal.wheelAria'))}">${svg}</svg>`;
}

function bigThree(chart) {
  const sun = chart.bodies.find((b) => b.id === 'sun');
  const moon = chart.bodies.find((b) => b.id === 'moon');
  const card = (eyebrow, signIdx, desc, extra = '') => `<a class="result-card" href="${link(`chiem-tinh/${SIGNS[signIdx].id}`)}">
    <span class="sign-glyph">${glyph(SIGNS[signIdx])}</span>
    <div><p class="eyebrow">${eyebrow}</p><h3>${esc(signName(signIdx))}</h3><p>${desc}${extra}</p></div>${icon('arrow')}</a>`;
  return `<div class="profile-grid">
    ${card(t('natal.sun'), sun.sign, t('natal.sunDesc'))}
    ${card(t('natal.moon'), moon.sign, t('natal.moonDesc'), chart.moonUncertain ? `<br /><em>${t('natal.moonUncertain')}</em>` : '')}
    ${chart.ascSign ? card(t('natal.asc'), chart.ascSign.sign, t('natal.ascDesc')) : `<div class="result-card is-muted"><span class="sign-glyph">?</span><div><p class="eyebrow">${t('natal.asc')}</p><h3>${t('natal.needTime')}</h3><p>${t('natal.needTimeDesc')}</p></div></div>`}
  </div>`;
}

function table(chart) {
  return `<div class="table-wrap"><table class="table table-compact">
    <thead><tr><th>${t('natal.thBody')}</th><th>${t('natal.thSign')}</th><th>${t('natal.thDeg')}</th><th>${t('natal.thHouse')}</th></tr></thead>
    <tbody>${chart.bodies
      .map((b) => `<tr><td><span class="glyph">${PLANETS[b.id].glyph}︎</span> ${esc(planetName(b.id))}${b.retro ? ' <abbr title="' + esc(t('natal.retro')) + '">R</abbr>' : ''}</td>
        <td>${glyph(SIGNS[b.sign])} ${esc(signName(b.sign))}</td><td>${fmtDeg(b.deg)}</td><td>${b.house}</td></tr>`)
      .join('')}
      ${chart.ascSign ? `<tr><td>AC · ${t('natal.asc')}</td><td>${glyph(SIGNS[chart.ascSign.sign])} ${esc(signName(chart.ascSign.sign))}</td><td>${fmtDeg(chart.ascSign.deg)}</td><td>1</td></tr>
      <tr><td>MC · ${t('natal.mc')}</td><td>${glyph(SIGNS[chart.mcSign.sign])} ${esc(signName(chart.mcSign.sign))}</td><td>${fmtDeg(chart.mcSign.deg)}</td><td>–</td></tr>` : ''}
    </tbody></table></div>
    <p class="muted small">${chart.houseBase === 'asc' ? t('natal.housesAsc') : t('natal.housesSun')}</p>`;
}

function readings(chart) {
  return chart.bodies
    .map((b) => `<div class="star-read">
      <h4><span class="glyph">${PLANETS[b.id].glyph}︎</span> ${t('natal.inSign', { p: esc(planetName(b.id)), s: esc(signName(b.sign)), h: b.house })}</h4>
      <p>${t('natal.readLine', { part: esc(tr(PLANETS[b.id].part)), style: esc(tr(SIGN_STYLE[b.sign])), area: esc(tr(HOUSES[b.house - 1])) })}</p>
      ${b.retro ? `<p class="muted small">${t('natal.retroText')}</p>` : ''}
    </div>`)
    .join('');
}

function aspectsBlock(chart) {
  if (!chart.aspects.length) return `<p class="muted">${t('natal.noAspects')}</p>`;
  return chart.aspects
    .map((a) => {
      const A = ASPECT_TEXT[a.aspect];
      return `<div class="star-read">
      <h4><span class="glyph">${PLANETS[a.a].glyph}︎</span> ${esc(planetName(a.a))} <span class="asp-glyph asp-${a.aspect}" title="${esc(tr(A.name))}">${A.glyph}︎</span> <span class="glyph">${PLANETS[a.b].glyph}︎</span> ${esc(planetName(a.b))}
        <span class="tag">${esc(tr(A.name))} · ${t('natal.orb', { d: a.orb.toFixed(1) })}</span></h4>
      <p>${t('natal.aspectLine', { a: esc(tr(PLANET_SHORT[a.a])), verb: esc(tr(A.verb)), b: esc(tr(PLANET_SHORT[a.b])) })}</p>
      <p class="muted">${esc(tr(A.note))}</p>
    </div>`;
    })
    .join('');
}

function balance(chart) {
  // Đếm Mặt Trời → Sao Thổ (cá nhân + xã hội) và cung Mọc; Mặt Trời, Mặt Trăng, cung Mọc tính 2 điểm
  const weight = { sun: 2, moon: 2, mercury: 1, venus: 1, mars: 1, jupiter: 1, saturn: 1 };
  const el = { fire: 0, earth: 0, air: 0, water: 0 };
  const mo = { cardinal: 0, fixed: 0, mutable: 0 };
  for (const b of chart.bodies) {
    if (!weight[b.id]) continue;
    el[ELEMENT_OF_SIGN[b.sign]] += weight[b.id];
    mo[MODALITY_OF_SIGN[b.sign]] += weight[b.id];
  }
  if (chart.ascSign) {
    el[ELEMENT_OF_SIGN[chart.ascSign.sign]] += 2;
    mo[MODALITY_OF_SIGN[chart.ascSign.sign]] += 2;
  }
  const total = Object.values(el).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(el).sort((a, b) => b[1] - a[1]);
  const [strong] = sorted[0];
  const [weak, weakVal] = sorted[sorted.length - 1];
  const topMo = Object.entries(mo).sort((a, b) => b[1] - a[1])[0][0];
  return `<div class="balance">${Object.entries(el)
    .map(([k, v]) => `<div class="bar-row"><span>${esc(tr(ELEMENT_TEXT[k].name))}</span><span class="bar"><span style="width:${Math.round((v / total) * 100)}%;background:${ELEMENT_TEXT[k].color}"></span></span><span class="muted small">${Math.round((v / total) * 100)}%</span></div>`)
    .join('')}</div>
    <p>${esc(tr(ELEMENT_TEXT[strong].strong))}</p>
    ${weakVal <= total * 0.12 ? `<p>${esc(tr(ELEMENT_TEXT[weak].weak))}</p>` : ''}
    <p>${t('natal.modality', { m: esc(tr(MODALITY_TEXT[topMo].name)), d: esc(tr(MODALITY_TEXT[topMo].text)) })}</p>`;
}

function transits(chart, profile) {
  const now = new Date();
  const d = dayNumber(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate(), now.getUTCHours());
  const pos = positions(d);
  const line = (id) => {
    const s = toSign(pos[id]).sign;
    const h = ((s - chart.firstSign + 12) % 12) + 1;
    return `<li><strong>${esc(planetName(id))} · ${esc(signName(s))}</strong><p>${esc(tr(TRANSIT[id])).replace('{h}', h).replace('{area}', esc(tr(HOUSES[h - 1])))}</p></li>`;
  };
  // Sao Thổ trở về (khoảng 29 và 58 tuổi): Sao Thổ hiện tại cùng cung với Sao Thổ lúc sinh
  const natalSaturn = chart.bodies.find((b) => b.id === 'saturn').sign;
  const age = now.getFullYear() - profile.year;
  const saturnReturn = toSign(pos.saturn).sign === natalSaturn && age > 20;
  return `<section class="section" id="lo-trinh">
    <h2 class="section-title">${t('natal.roadmap')}</h2>
    <p class="muted">${t('natal.roadmapLead')}</p>
    <ul class="timeline plain">${line('jupiter')}${line('saturn')}</ul>
    ${saturnReturn ? `<div class="heal-note"><p class="eyebrow">${t('natal.saturnReturn')}</p><p>${t('natal.saturnReturnText')}</p></div>` : ''}
    ${gentleNote()}
  </section>`;
}

function renderResult(view, profile) {
  const chart = natalChart({ ...profile, lat: profile.lat ?? NaN, lon: profile.lon ?? NaN, hour: profile.timeKnown ? profile.hour : 12, minute: profile.timeKnown ? profile.minute : 0 });
  // Không rõ giờ sinh: Mặt Trăng có thể lệch tới ±6–7° nên bỏ các góc chiếu của Mặt Trăng
  chart.aspects = findAspects(profile.timeKnown ? chart.bodies : chart.bodies.filter((b) => b.id !== 'moon'));
  const notes = [];
  if (!profile.timeKnown) notes.push(t('natal.noteNoTime'));
  else if (profile.lat == null) notes.push(t('natal.noteNoPlace'));
  $('#natal-result', view).innerHTML = `
    <div class="row"><button class="btn btn-ghost" type="button" data-edit>${icon('user')} ${t('laso.edit')}</button></div>
    ${notes.map((n) => `<p class="note-inline">${n}</p>`).join('')}
    <div class="natal-top">${wheel(chart)}<div>${bigThree(chart)}</div></div>
    <section class="section"><h2 class="section-title">${t('natal.positions')}</h2>${table(chart)}</section>
    <section class="section"><h2 class="section-title">${t('natal.reading')}</h2><div class="reading-card">${readings(chart)}</div></section>
    <section class="section"><h2 class="section-title">${t('natal.aspects')}</h2><p class="muted">${t('natal.aspectsLead')}</p><div class="reading-card">${aspectsBlock(chart)}</div></section>
    <section class="section"><h2 class="section-title">${t('natal.balance')}</h2><div class="reading-card">${balance(chart)}</div></section>
    ${transits(chart, profile)}
    <details class="method"><summary>${t('laso.methodTitle')}</summary><p>${t('natal.method')}</p></details>`;
  $('[data-edit]', view).onclick = () => {
    $('#natal-form-wrap', view).hidden = false;
    $('#natal-form-wrap', view).scrollIntoView({ behavior: 'smooth' });
  };
}

export function renderNatal(view) {
  const p = store.getProfile();
  view.innerHTML = `<div class="page">
    ${backLink(link('chiem-tinh'), t('nav.astro'))}
    <header class="page-head">
      <p class="eyebrow">${t('natal.eyebrow')}</p>
      <h1>${t('natal.title')}</h1>
      <p class="lead">${t('natal.lead')}</p>
    </header>
    <div id="natal-form-wrap" ${p ? 'hidden' : ''}>${birthFormHtml(p, { submitLabel: t('natal.submit') })}</div>
    <div id="natal-result"></div>
  </div>`;
  const form = $('[data-birth-form]', view);
  bindBirthForm(form);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const r = readBirthForm(form);
    $('[data-error]', form).textContent = r.error || '';
    if (r.error) return;
    store.setProfile({ ...p, ...r.profile });
    $('#natal-form-wrap', view).hidden = true;
    renderResult(view, store.getProfile());
    toast(t('birth.saved'));
  });
  if (p) renderResult(view, p);
}
