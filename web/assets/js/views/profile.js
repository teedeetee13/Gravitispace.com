// Bản mệnh: nhập ngày sinh một lần, xem cả cung hoàng đạo lẫn tuổi âm lịch
import { $, esc, icon, todayKey } from '../util.js';
import { store } from '../store.js';
import { signFromDate } from '../data/zodiac.js';
import { yearInfo } from '../data/tuvi.js';
import { cardById } from '../data/tarot.js';
import { signBadge, tarotFace } from '../ui.js';
import { yearCard } from './tuvi.js';

function result(p) {
  const s = signFromDate(p.month, p.day);
  const lunarYear = p.beforeTet ? p.year - 1 : p.year;
  const info = yearInfo(lunarYear);
  const draw = store.getDraw(todayKey());
  const card = draw && cardById[draw.cardId];
  return `<div class="profile-grid">
    <a class="result-card" href="#/chiem-tinh/${s.id}">${signBadge(s)}
      <div><p class="eyebrow">Cung hoàng đạo</p><h3>${esc(s.name)}</h3><p>${esc(s.keywords)}</p></div>${icon('arrow')}</a>
    <a class="result-card" href="#/tu-vi/${info.chi.id}"><span class="sign-glyph">${esc(info.chi.name)}</span>
      <div><p class="eyebrow">Tuổi âm lịch</p><h3>${esc(info.canChi)}</h3><p>Mệnh ${esc(info.napAm)}</p></div>${icon('arrow')}</a>
    <a class="result-card" href="#/tarot">${card ? `<span class="mini-card">${tarotFace(card, { size: 'xs', reversed: draw.reversed })}</span>` : `<span class="sign-glyph">${icon('card')}</span>`}
      <div><p class="eyebrow">Lá bài hôm nay</p><h3>${card ? esc(card.name) : 'Chưa rút'}</h3><p>${card ? esc(card.q) : 'Chạm để rút lá bài của ngày hôm nay'}</p></div>${icon('arrow')}</a>
  </div>
  <section class="section">
    <h2 class="section-title">Chi tiết tuổi ${esc(info.chi.name)}</h2>
    ${yearCard(info)}
  </section>
  <div class="note-box">Sắp có: cung Mặt Trăng, cung Mọc (cần giờ và nơi sinh) và lá số Tử Vi Đẩu Số đầy đủ.</div>`;
}

export function renderProfile(view) {
  const p = store.getProfile();
  view.innerHTML = `<div class="page">
    <header class="page-head">
      <p class="eyebrow">Bản mệnh của tôi</p>
      <h1>Nhập ngày sinh một lần, xem cả Đông lẫn Tây.</h1>
      <p class="lead">Ngày sinh chỉ được lưu trên máy của bạn, không gửi đi đâu cả.</p>
    </header>
    <form class="lookup" data-profile-form>
      <label class="field"><span>Ngày</span><input type="number" name="d" min="1" max="31" required inputmode="numeric" value="${p?.day ?? ''}" /></label>
      <label class="field"><span>Tháng</span><input type="number" name="m" min="1" max="12" required inputmode="numeric" value="${p?.month ?? ''}" /></label>
      <label class="field"><span>Năm (dương lịch)</span><input type="number" name="y" min="1900" max="2100" required inputmode="numeric" value="${p?.year ?? ''}" /></label>
      <label class="check"><input type="checkbox" name="tet" ${p?.beforeTet ? 'checked' : ''} /> Tôi sinh trước Tết Nguyên Đán năm đó</label>
      <button class="btn" type="submit">${icon('star')} Xem bản mệnh</button>
    </form>
    <div id="profile-result" aria-live="polite">${p ? result(p) : ''}</div>
  </div>`;

  const form = $('[data-profile-form]', view);
  const tet = form.elements.tet;
  const syncTet = () => {
    const m = Number(form.elements.m.value);
    tet.closest('.check').hidden = m > 2;
    if (m > 2) tet.checked = false;
  };
  form.elements.m.addEventListener('input', syncTet);
  syncTet();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const prof = { day: Number(f.get('d')), month: Number(f.get('m')), year: Number(f.get('y')), beforeTet: !!f.get('tet') };
    const valid = new Date(prof.year, prof.month - 1, prof.day).getDate() === prof.day;
    if (!valid) {
      $('#profile-result', view).innerHTML = `<p class="muted">Ngày sinh chưa hợp lệ, bạn kiểm tra lại nhé.</p>`;
      return;
    }
    store.setProfile(prof);
    $('#profile-result', view).innerHTML = result(prof);
  });
}
