// Lá số Tử Vi Đẩu Số: biểu mẫu → lá số 12 cung → luận giải → lộ trình đại hạn
import { $, $$, esc, icon, toast } from '../util.js';
import { t, tr, getLang } from '../i18n.js';
import { store } from '../store.js';
import { CAN, CHI_NAMES } from '../lib/lunar.js';
import { buildChart, mainStarsOf, GRID, PALACES, TRANG_SINH, RING_GOOD, overlays } from '../lib/tuvi-chart.js';
import { STARS, PALACE_INFO, DAI_HAN_THEME, CUC_NAMES, RELATION_TEXT, RELATION_LABEL, THUAN_LY_TEXT } from '../data/tuvi-stars.js';
import { yearInfo } from '../data/tuvi.js';
import { SCHOOLS, DEFAULT_SCHOOL, GRADES, GRADE_TEXT, gradeBand, brightness } from '../data/tuvi-brightness.js';
import * as C from '../content.js';
import { backLink, gentleNote } from '../ui.js';
import { birthFormHtml, bindBirthForm, readBirthForm } from './birth.js';

const NEED = { needTime: true, needGender: true };
const starName = (id) => tr(STARS[id]?.name);
const shortName = (id) => tr(STARS[id]?.name).split(' (')[0];
const hoaTag = (s) => (s.hoa ? `<sup class="hoa hoa-${s.hoa}">${esc(tr(STARS[s.hoa].short))}</sup>` : '');
const palaceName = (id) => tr(PALACE_INFO[id].name);
// Trường phái độ sáng đang chọn (lưu theo người dùng, mặc định Thái Thứ Lang)
const school = () => (SCHOOLS[store.getPref('tuviSchool')] ? store.getPref('tuviSchool') : DEFAULT_SCHOOL);
/** Ký hiệu độ sáng (M, V, Đ…) cạnh tên sao; trống nếu trường phái không ghi */
const bTag = (id, chi) => {
  const g = brightness(school(), id, chi);
  // tiếng Trung hiển thị chữ Hán gốc (廟 旺 得 利 平 陷); ngôn ngữ khác giữ ký hiệu chữ cái như sách Việt
  return g ? `<span class="bright b-${gradeBand(g)}" title="${esc(tr(GRADES[g]))}">${esc(getLang() === 'zh' ? tr(GRADES[g]) : g)}</span>` : '';
};

// ---------- Tùy chọn hiển thị (lưu theo người dùng) ----------
const THIS_YEAR = new Date().getFullYear();
const LUU_OPTS = ['luuTuHoa', 'luuTuDuc', 'luuDaiVan', 'luuKhac', 'luuTuanTriet'];
const OPT_KEYS = ['tuongTinh', ...LUU_OPTS, 'locKy'];
function readOpts() {
  const o = store.getPref('tuviOpts') || {};
  const y = Math.trunc(Number(o.year));
  return { hanNam: o.hanNam !== false, year: y >= 1900 && y <= 2100 ? y : THIS_YEAR, ...Object.fromEntries(OPT_KEYS.map((k) => [k, o[k] === true])) };
}
let OPTS = readOpts();
let OV = { stars: Array.from({ length: 12 }, () => []), dv: null, luuTuan: [], luuTriet: [], locKy: null };
// Tiền tố sao lưu / đại vận (tiếng Trung dùng chữ Hán)
const luuP = () => (getLang() === 'zh' ? '流' : 'L.');
const dvP = () => (getLang() === 'zh' ? '大限' : 'ĐV.');
// Màu theo ngũ hành
const HANH_CLASS = { 'Kim': 'h-kim', 'Mộc': 'h-moc', 'Thủy': 'h-thuy', 'Hỏa': 'h-hoa', 'Thổ': 'h-tho' };
const hc = (id) => HANH_CLASS[STARS[id]?.hanh] || '';
const pName = (chi, chart) => (chi == null ? '–' : esc(palaceName(chart.palaces[chi].palace)));

function cell(p, chart) {
  const main = p.stars.filter((s) => s.kind === 'main');
  // Bố cục phổ biến: chính tinh trên cùng; phụ tinh tốt cột trái, phụ tinh xấu cột phải, xếp từ trên xuống
  const side = (s) => s.side || (s.kind === 'ring' ? (RING_GOOD.has(s.id) ? 'good' : 'hard') : s.kind);
  const others = [...p.stars.filter((s) => s.kind !== 'main' && !TRANG_SINH.includes(s.id)), ...OV.stars[p.chi]];
  const starLabel = (s) => (s.luu ? `${luuP()}${esc(shortName(s.id))}` : `${esc(shortName(s.id))}${bTag(s.id, p.chi)}${hoaTag(s)}`);
  const col = (k) => others.filter((s) => side(s) === k).map((s) => `<span class="${hc(s.id)}${s.luu ? ' is-luu' : ''}">${starLabel(s)}</span>`).join('');
  const lk = OV.locKy?.[p.chi];
  const extra = [
    OV.dv ? `<span class="p-dv">${dvP()}${esc(palaceName(OV.dv[p.chi]))}</span>` : '',
    lk ? `<span class="p-lk"><span class="h-moc">${esc(tr(STARS['hoa-loc'].short))}→${pName(lk.loc, chart)}</span><span class="h-thuy">${esc(tr(STARS['hoa-ky'].short))}→${pName(lk.ky, chart)}</span></span>` : '',
  ].join('');
  const ts = p.stars.find((s) => TRANG_SINH.includes(s.id));
  const flags = [
    p.isThan ? `<span class="flag">${t('laso.than')}</span>` : '',
    p.tuan ? `<span class="flag">${t('laso.tuan')}</span>` : '',
    p.triet ? `<span class="flag">${t('laso.triet')}</span>` : '',
    OPTS.hanNam && p.isTieuHan ? `<span class="flag flag-th" title="${esc(t('laso.tieuHan'))}">${t('laso.tieuHanShort')}</span>` : '',
    OPTS.hanNam && p.isLuuThaiTue ? `<span class="flag flag-tt" title="${esc(t('laso.luuThaiTue'))}">${t('laso.luuThaiTueShort')}</span>` : '',
    OV.luuTuan.includes(p.chi) ? `<span class="flag flag-luu">${luuP()}${t('laso.tuan')}</span>` : '',
    OV.luuTriet.includes(p.chi) ? `<span class="flag flag-luu">${luuP()}${t('laso.triet')}</span>` : '',
  ].join('');
  const label = `${palaceName(p.palace)} · ${C.ganzhi(p.label)}. ${main.map((s) => shortName(s.id)).join(', ') || t('laso.noMain')}`;
  return `<button type="button" class="palace ${p.palace === 'menh' ? 'is-menh' : ''} ${p.isCurrent ? 'is-current' : ''}" data-palace="${p.chi}" aria-label="${esc(label)}">
    <span class="p-head"><span class="p-name">${esc(palaceName(p.palace))}</span><span class="p-chi">${esc(C.ganzhi(CHI_NAMES[p.chi]))}</span></span>
    <span class="p-main">${main.map((s) => `<span class="${hc(s.id)}">${esc(shortName(s.id))}${bTag(s.id, p.chi)}${hoaTag(s)}</span>`).join('') || `<span class="muted">${t('laso.noMainShort')}</span>`}</span>
    <span class="p-minor"><span class="p-col">${col('good')}</span><span class="p-col">${col('hard')}</span></span>
    ${extra ? `<span class="p-extra">${extra}</span>` : ''}
    <span class="p-foot"><span>${p.daiHan.from}</span>${flags}${ts ? `<span class="p-ts">${esc(shortName(ts.id))}</span>` : ''}</span>
  </button>`;
}

function center(chart) {
  const i = chart.input;
  const l = chart.lunar;
  const cc = chart.canChi;
  const hourText = `${C.ganzhi(CHI_NAMES[chart.hourChi])}`;
  const yi = yearInfo(l.year);
  return `<div class="laso-center">
    <p class="eyebrow">${t('laso.title')}</p>
    <dl>
      <div><dt>${t('laso.solar')}</dt><dd>${i.day}/${i.month}/${i.year} · ${String(i.hour).padStart(2, '0')}:${String(i.minute || 0).padStart(2, '0')}</dd></div>
      <div><dt>${t('laso.lunar')}</dt><dd>${l.day}/${l.month}${l.leap ? ` (${t('birth.leap').trim()})` : ''} · ${t('laso.hour')} ${esc(hourText)}</dd></div>
      <div><dt>${t('laso.canChi')}</dt><dd>${esc(C.ganzhi(cc.year.text))} · ${esc(C.ganzhi(cc.month.text))} · ${esc(C.ganzhi(cc.day.text))}</dd></div>
      <div><dt>${t('laso.yinyang')}</dt><dd>${t(`laso.${chart.yinYang}`)} ${t(i.gender === 'nam' ? 'birth.male' : 'birth.female').toLowerCase()}</dd></div>
      <div><dt>${t('laso.menh')}</dt><dd>${esc(C.napAm(yi.napAm, yi.meaning).name)}</dd></div>
      <div><dt>${t('laso.cuc')}</dt><dd>${esc(tr(CUC_NAMES[chart.cuc]))}</dd></div>
      <div><dt>${t('laso.sinhKhac')}</dt><dd>${esc(tr(RELATION_LABEL[chart.relation]))}</dd></div>
      <div><dt>${t('laso.menhChu')} · ${t('laso.thanChu')}</dt><dd>${esc(shortName(chart.menhChu))} · ${esc(shortName(chart.thanChu))}</dd></div>
      <div><dt>${t('laso.yinyangOrder')}</dt><dd>${chart.thuanLy ? t('laso.thuanLy') : t('laso.nghichLy')}</dd></div>
      <div><dt>${t('laso.laiNhan')}</dt><dd>${esc(palaceName(chart.palaces[chart.laiNhan].palace))}</dd></div>
    </dl>
  </div>`;
}

function chartGrid(chart) {
  let html = '';
  GRID.forEach((row, r) =>
    row.forEach((chi, c) => {
      if (chi !== null) html += cell(chart.palaces[chi], chart);
      else if (r === 1 && c === 1) html += center(chart);
    })
  );
  const legend = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'].map((h) => `<span class="${HANH_CLASS[h]}"><i aria-hidden="true">■</i> ${esc(C.hanhName(h))}</span>`).join('');
  return `<div class="laso-grid">${html}</div>
  <p class="hanh-legend small"><span class="muted">${t('laso.hanhLegend')}:</span>${legend}</p>`;
}

/** Ô tùy chọn: vòng Tướng tinh, hạn năm, các lớp sao lưu, Lộc Kỵ nhập */
function optionsPanel() {
  const o = OPTS;
  const cb = (k) => `<label class="opt"><input type="checkbox" data-opt="${k}" ${o[k] ? 'checked' : ''} ${LUU_OPTS.includes(k) && !o.hanNam ? 'disabled' : ''} /> ${t(`laso.opt.${k}`)}</label>`;
  return `<fieldset class="laso-opts">
    <legend>${t('laso.opts')}</legend>
    <div class="opt-grid">
      ${cb('tuongTinh')}
      <label class="opt opt-year"><input type="checkbox" data-opt="hanNam" ${o.hanNam ? 'checked' : ''} /> ${t('laso.opt.hanNam')}
        <input type="number" inputmode="numeric" min="1900" max="2100" step="1" value="${o.year}" data-opt-year ${o.hanNam ? '' : 'disabled'} aria-label="${esc(t('laso.opt.hanNam'))}" /></label>
      ${cb('luuTuHoa')}${cb('luuTuDuc')}${cb('luuDaiVan')}${cb('luuKhac')}${cb('locKy')}${cb('luuTuanTriet')}
    </div>
    <p class="muted small">${t('laso.optsNote')}</p>
  </fieldset>`;
}

function starBlock(id, chart) {
  const s = STARS[id];
  const chi = chart.palaces.find((p) => p.stars.some((x) => x.id === id))?.chi;
  const g = chi != null ? brightness(school(), id, chi) : null;
  return `<div class="star-read">
    <h4>${esc(starName(id))} <span class="tag">${esc(C.hanhName(s.hanh))}</span>${g ? ` <span class="tag b-${gradeBand(g)}">${esc(tr(GRADES[g]))}</span>` : ''}</h4>
    <p>${esc(tr(s.core))}</p>
    <p><strong>${t('laso.light')}</strong> ${esc(tr(s.light))}</p>
    <p><strong>${t('laso.shadow')}</strong> ${esc(tr(s.shadow))}</p>
    ${g ? `<p class="muted small">${esc(tr(GRADE_TEXT[gradeBand(g)]))} <em>(${esc(tr(SCHOOLS[school()].name))})</em></p>` : ''}
    <p class="energy">${esc(tr(s.energy))}</p>
  </div>`;
}

/** Ô chọn trường phái độ sáng */
function schoolPicker() {
  const cur = school();
  return `<div class="school-pick">
    <label class="field"><span>${t('laso.school')}</span>
      <select data-school>${Object.entries(SCHOOLS).map(([id, sc]) => `<option value="${id}" ${id === cur ? 'selected' : ''}>${esc(tr(sc.name))}${id === DEFAULT_SCHOOL ? ` · ${t('laso.schoolDefault')}` : ''}</option>`).join('')}</select>
    </label>
    <p class="muted small">${esc(tr(SCHOOLS[cur].note))} <a href="${SCHOOLS[cur].source}" target="_blank" rel="noopener noreferrer">${t('laso.schoolSource')}</a></p>
  </div>`;
}

function palaceDetail(chart, chi) {
  const p = chart.palaces[chi];
  const info = PALACE_INFO[p.palace];
  const { stars, borrowed } = mainStarsOf(chart, chi);
  const minor = [...p.stars.filter((s) => s.kind === 'good' || s.kind === 'hard'), ...OV.stars[chi].filter((s) => !s.luu).map((s) => ({ ...s, kind: s.side }))];
  const rings = p.stars.filter((s) => s.kind === 'ring');
  const hoas = p.stars.filter((s) => s.hoa);
  const luu = OV.stars[chi].filter((s) => s.luu);
  const lk = OV.locKy?.[chi];
  return `<div class="palace-detail">
    <p class="eyebrow">${esc(C.ganzhi(p.label))} · ${t('laso.daiHanAge', { a: p.daiHan.from, b: p.daiHan.to })}</p>
    <h3>${t('laso.palace')} ${esc(palaceName(p.palace))}${p.isThan ? ` <span class="tag">${t('laso.thanCu')}</span>` : ''}</h3>
    <p class="muted">${t('laso.speaksOf', { d: esc(tr(info.domain)) })}</p>
    ${borrowed ? `<p class="note-inline">${t('laso.borrowed')}</p>` : ''}
    ${stars.length ? stars.map((s) => starBlock(s.id, chart)).join('') : `<p>${t('laso.noMainAtAll')}</p>`}
    ${minor.length ? `<h4 class="h-sm">${t('laso.minorStars')}</h4><ul class="minor-list">${minor.map((s) => `<li class="${s.kind}"><strong>${esc(starName(s.id))}</strong>: ${esc(tr(STARS[s.id].note))}</li>`).join('')}</ul>` : ''}
    ${hoas.length ? `<h4 class="h-sm">${t('laso.tuHoa')}</h4><ul class="minor-list">${hoas.map((s) => `<li><strong>${esc(tr(STARS[s.hoa].name))}</strong> (${esc(shortName(s.id))}): ${esc(tr(STARS[s.hoa].note))}</li>`).join('')}</ul>` : ''}
    ${rings.length ? `<h4 class="h-sm">${t('laso.rings')}</h4><ul class="minor-list">${rings.map((s) => `<li><strong>${esc(starName(s.id))}</strong>: ${esc(tr(STARS[s.id].note))}</li>`).join('')}</ul>` : ''}
    ${luu.length ? `<p class="small"><strong>${t('laso.luuList', { y: OPTS.year })}:</strong> ${luu.map((s) => `<span class="${hc(s.id)}">${luuP()}${esc(shortName(s.id))}</span>`).join(', ')}</p>` : ''}
    ${lk ? `<p class="small">${t('laso.locKyText', { can: esc(C.ganzhi(CAN[lk.can])), loc: pName(lk.loc, chart), ky: pName(lk.ky, chart) })}</p>` : ''}
    ${OPTS.hanNam && p.isTieuHan ? `<p class="note-inline">${t('laso.tieuHanText', { y: OPTS.year })}</p>` : ''}
    ${p.tuan || p.triet ? `<p class="muted small">${t('laso.tuanTriet')}</p>` : ''}
  </div>`;
}

function interpretation(chart) {
  const menh = chart.palaces[chart.menh];
  const than = chart.palaces[chart.than];
  const { stars, borrowed } = mainStarsOf(chart, chart.menh);
  const hoaList = chart.palaces.flatMap((p) => p.stars.filter((s) => s.hoa).map((s) => ({ ...s, palace: p.palace })));
  hoaList.sort((a, b) => ['hoa-loc', 'hoa-quyen', 'hoa-khoa', 'hoa-ky'].indexOf(a.hoa) - ['hoa-loc', 'hoa-quyen', 'hoa-khoa', 'hoa-ky'].indexOf(b.hoa));

  return `<section class="section" id="luan-giai">
    <h2 class="section-title">${t('laso.reading')}</h2>
    <div class="reading-card">
      <h3>${t('laso.menhTitle', { label: esc(C.ganzhi(menh.label)) })}</h3>
      ${borrowed ? `<p class="note-inline">${t('laso.borrowed')}</p>` : ''}
      ${stars.map((s) => starBlock(s.id, chart)).join('')}
    </div>
    <div class="reading-card">
      <h3>${t('laso.thanTitle', { p: esc(palaceName(than.palace)) })}</h3>
      <p>${t('laso.thanText', { d: esc(tr(PALACE_INFO[than.palace].domain)) })}</p>
    </div>
    <div class="reading-card">
      <h3>${esc(tr(RELATION_LABEL[chart.relation]))}: ${t('laso.cucTitle', { cuc: esc(tr(CUC_NAMES[chart.cuc])), menh: esc(C.hanhName(chart.menhHanh)) })}</h3>
      <p>${esc(tr(RELATION_TEXT[chart.relation]))}</p>
      <p class="muted small">${t('laso.sinhKhacHow', { cuc: esc(C.hanhName(chart.cucHanh)), menh: esc(C.hanhName(chart.menhHanh)) })}</p>
    </div>
    <div class="reading-card">
      <h3>${chart.thuanLy ? t('laso.thuanLy') : t('laso.nghichLy')}</h3>
      <p>${esc(tr(THUAN_LY_TEXT[chart.thuanLy]))}</p>
      <p class="muted small">${t('laso.chuText', { mc: esc(starName(chart.menhChu)), tc: esc(starName(chart.thanChu)) })}${chart.menhChuCung !== chart.menhChu ? ` ${t('laso.chuAlt', { s: esc(starName(chart.menhChuCung)) })}` : ''}</p>
    </div>
    <div class="reading-card">
      <h3>${t('laso.tuHoaTitle', { can: esc(C.ganzhi(CAN[chart.canChi.year.can])) })}</h3>
      <ul class="minor-list">${hoaList.map((s) => `<li><strong>${esc(tr(STARS[s.hoa].name))}</strong> · ${esc(starName(s.id))} · ${t('laso.atPalace', { p: esc(palaceName(s.palace)) })}<br /><span class="muted">${esc(tr(STARS[s.hoa].note))}</span></li>`).join('')}</ul>
    </div>

    <h3 class="h-sm">${t('laso.allPalaces')}</h3>
    <div class="accordion">${PALACES.map((pid) => {
      const p = chart.palaces.find((x) => x.palace === pid);
      return `<details><summary>${esc(palaceName(pid))} <span class="muted small">· ${esc(C.ganzhi(p.label))}</span></summary>${palaceDetail(chart, p.chi)}</details>`;
    }).join('')}</div>
  </section>`;
}

function roadmap(chart) {
  const order = Array.from({ length: 12 }, (_, i) => chart.palaces.find((p) => p.daiHan.from === chart.cuc + i * 10));
  return `<section class="section" id="lo-trinh">
    <h2 class="section-title">${t('laso.roadmap')}</h2>
    <p class="muted">${t('laso.roadmapLead', { age: chart.age })}</p>
    <ol class="timeline">${order
      .filter((p) => p.daiHan.from <= 95)
      .map((p) => `<li class="${p.isCurrent ? 'is-current' : ''} ${p.daiHan.to < chart.age ? 'is-past' : ''}">
        <span class="tl-age">${p.daiHan.from}–${p.daiHan.to}</span>
        <div><strong>${esc(palaceName(p.palace))}</strong>${p.isCurrent ? ` <span class="tag tag-now">${t('laso.now')}</span>` : ''}
        <p>${esc(tr(DAI_HAN_THEME[p.palace]))}</p></div></li>`)
      .join('')}</ol>
    ${gentleNote()}
  </section>`;
}

function renderResult(view, profile) {
  OPTS = readOpts();
  const chart = buildChart({ ...profile, gender: profile.gender, viewYear: OPTS.hanNam ? OPTS.year : THIS_YEAR });
  OV = overlays(chart, { ...OPTS, year: OPTS.hanNam ? OPTS.year : null });
  const out = $('#laso-result', view);
  out.innerHTML = `
    <div class="row laso-actions">
      <a class="btn btn-ghost" href="#luan-giai">${t('laso.toReading')}</a>
      <a class="btn btn-ghost" href="#lo-trinh">${t('laso.toRoadmap')}</a>
      <button class="btn btn-ghost" type="button" data-edit>${icon('user')} ${t('laso.edit')}</button>
    </div>
    ${schoolPicker()}
    ${optionsPanel()}
    <p class="muted small">${t('laso.tapHint')}</p>
    ${chartGrid(chart)}
    <div id="palace-panel" class="palace-panel" aria-live="polite">${palaceDetail(chart, chart.menh)}</div>
    ${interpretation(chart)}
    ${roadmap(chart)}
    <details class="method"><summary>${t('laso.methodTitle')}</summary><p>${t('laso.method')}</p></details>`;
  out.onchange = (e) => {
    if (e.target.matches('[data-opt], [data-opt-year]')) {
      const o = readOpts();
      if (e.target.dataset.opt) o[e.target.dataset.opt] = e.target.checked;
      else {
        const y = Math.trunc(Number(e.target.value));
        if (!(y >= 1900 && y <= 2100)) return;
        o.year = y;
      }
      store.setPref('tuviOpts', o);
    } else if (e.target.matches('[data-school]')) store.setPref('tuviSchool', e.target.value);
    else return;
    const y = window.scrollY;
    renderResult(view, profile);
    window.scrollTo(0, y);
  };
  out.onclick = (e) => {
    const b = e.target.closest('[data-palace]');
    if (b) {
      $$('.palace.is-selected', out).forEach((x) => x.classList.remove('is-selected'));
      b.classList.add('is-selected');
      $('#palace-panel', out).innerHTML = palaceDetail(chart, Number(b.dataset.palace));
      $('#palace-panel', out).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    if (e.target.closest('[data-edit]')) {
      $('#laso-form-wrap', view).hidden = false;
      $('#laso-form-wrap', view).scrollIntoView({ behavior: 'smooth' });
    }
    const a = e.target.closest('a[href^="#luan-giai"], a[href^="#lo-trinh"]');
    if (a) {
      e.preventDefault();
      document.getElementById(a.getAttribute('href').slice(1))?.scrollIntoView({ behavior: 'smooth' });
    }
  };
}

export function renderLaso(view) {
  const p = store.getProfile();
  const ready = p && p.timeKnown && p.gender;
  view.innerHTML = `<div class="page">
    ${backLink('#/tu-vi', t('nav.tuvi'))}
    <header class="page-head">
      <p class="eyebrow">${t('laso.eyebrow')}</p>
      <h1>${t('laso.title')}</h1>
      <p class="lead">${t('laso.lead')}</p>
    </header>
    <div id="laso-form-wrap" ${ready ? 'hidden' : ''}>${birthFormHtml(p, { ...NEED, submitLabel: t('laso.submit') })}</div>
    <div id="laso-result"></div>
  </div>`;
  const form = $('[data-birth-form]', view);
  bindBirthForm(form);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const r = readBirthForm(form, NEED);
    $('[data-error]', form).textContent = r.error || '';
    if (r.error) return;
    store.setProfile({ ...p, ...r.profile });
    $('#laso-form-wrap', view).hidden = true;
    renderResult(view, store.getProfile());
    toast(t('birth.saved'));
    $('#laso-result', view).scrollIntoView({ behavior: 'smooth' });
  });
  if (ready) renderResult(view, p);
}
