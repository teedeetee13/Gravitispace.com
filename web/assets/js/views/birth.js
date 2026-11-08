// Biểu mẫu thông tin sinh dùng chung cho Bản mệnh, Lá số Tử Vi và Bản đồ sao.
// Dữ liệu chỉ lưu trên máy người dùng (store.setProfile).
import { $, esc, icon } from '../util.js';
import { t } from '../i18n.js';
import { PLACES, placeById, suggestTimeZone } from '../data/places.js';
import { solarToLunar } from '../lib/lunar.js';

const pad = (n) => String(n).padStart(2, '0');

export function birthFormHtml(p, { submitLabel, needTime = false, needGender = false, needPlace = false } = {}) {
  const date = p ? `${p.year}-${pad(p.month)}-${pad(p.day)}` : '';
  const time = p?.timeKnown ? `${pad(p.hour)}:${pad(p.minute || 0)}` : '';
  const placeId = p?.placeId || (p?.lat != null ? 'khac' : '');
  return `<form class="birth-form" data-birth-form novalidate>
    <div class="birth-grid">
      <label class="field"><span>${t('birth.date')}</span>
        <input type="date" name="date" required value="${date}" min="1900-01-01" max="2100-12-31" /></label>
      <label class="field"><span>${t('birth.time')}${needTime ? '' : ` <em class="muted">${t('form.optional')}</em>`}</span>
        <input type="time" name="time" value="${time}" ${p && !p.timeKnown ? 'disabled' : ''} /></label>
    </div>
    <label class="check"><input type="checkbox" name="noTime" ${p && !p.timeKnown ? 'checked' : ''} /> ${t('birth.noTime')}</label>
    <fieldset class="birth-gender"><legend>${t('birth.gender')}${needGender ? '' : ` <em class="muted">${t('form.optional')}</em>`}</legend>
      <div class="chips">
        <label class="chip-radio"><input type="radio" name="gender" value="nam" ${p?.gender === 'nam' ? 'checked' : ''} /><span>${t('birth.male')}</span></label>
        <label class="chip-radio"><input type="radio" name="gender" value="nu" ${p?.gender === 'nu' ? 'checked' : ''} /><span>${t('birth.female')}</span></label>
      </div>
      <p class="muted small">${t('birth.genderWhy')}</p>
    </fieldset>
    <label class="field"><span>${t('birth.place')}${needPlace ? '' : ` <em class="muted">${t('form.optional')}</em>`}</span>
      <select name="place">
        <option value="">${t('birth.placeNone')}</option>
        ${PLACES.map((pl) => `<option value="${pl.id}" ${placeId === pl.id ? 'selected' : ''}>${esc(pl.name)}</option>`).join('')}
        <option value="khac" ${placeId === 'khac' ? 'selected' : ''}>${t('birth.placeOther')}</option>
      </select></label>
    <div class="birth-grid" data-coords ${placeId === 'khac' ? '' : 'hidden'}>
      <label class="field"><span>${t('birth.lat')}</span><input type="number" step="0.0001" min="-90" max="90" name="lat" value="${p?.lat ?? ''}" inputmode="decimal" /></label>
      <label class="field"><span>${t('birth.lon')}</span><input type="number" step="0.0001" min="-180" max="180" name="lon" value="${p?.lon ?? ''}" inputmode="decimal" /></label>
    </div>
    <details class="advanced">
      <summary>${t('birth.advanced')}</summary>
      <label class="field"><span>${t('birth.tz')}</span><input type="number" step="0.5" min="-12" max="14" name="tz" value="${p?.tz ?? 7}" inputmode="decimal" /></label>
      <p class="muted small">${t('birth.tzHint')}</p>
    </details>
    <p class="lunar-preview muted small" data-lunar-preview aria-live="polite"></p>
    <p class="form-error" data-error role="alert"></p>
    <button class="btn btn-lg" type="submit">${icon('star')} ${submitLabel || t('birth.submit')}</button>
    <p class="muted small">${icon('info')} ${t('birth.privacy')}</p>
  </form>`;
}

/** Đọc + kiểm tra biểu mẫu. Trả về { profile } hoặc { error }. */
export function readBirthForm(form, { needTime = false, needGender = false } = {}) {
  const f = new FormData(form);
  const date = String(f.get('date') || '');
  const m = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return { error: t('birth.errDate') };
  const [year, month, day] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (year < 1900 || year > 2100 || new Date(year, month - 1, day).getDate() !== day) return { error: t('birth.errDate') };
  const noTime = !!f.get('noTime');
  const time = String(f.get('time') || '');
  const tm = time.match(/^(\d{2}):(\d{2})/);
  if (!noTime && !tm && needTime) return { error: t('birth.errTime') };
  const timeKnown = !noTime && !!tm;
  if (needTime && !timeKnown) return { error: t('birth.errTime') };
  const gender = f.get('gender') || null;
  if (needGender && !gender) return { error: t('birth.errGender') };

  const placeId = String(f.get('place') || '');
  let lat = null;
  let lon = null;
  if (placeById[placeId]) ({ lat, lon } = placeById[placeId]);
  if (placeId === 'khac') {
    lat = Number(f.get('lat'));
    lon = Number(f.get('lon'));
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180 || f.get('lat') === '' || f.get('lon') === '')
      return { error: t('birth.errCoords') };
  }
  const tz = Number(f.get('tz'));
  return {
    profile: {
      day, month, year, timeKnown,
      hour: timeKnown ? Number(tm[1]) : null,
      minute: timeKnown ? Number(tm[2]) : null,
      gender,
      placeId: placeById[placeId] ? placeId : null,
      lat, lon,
      tz: Number.isFinite(tz) ? tz : 7,
    },
  };
}

/** Gắn hành vi: ẩn/hiện toạ độ, tắt ô giờ khi không rõ giờ, gợi ý múi giờ, xem trước ngày âm. */
export function bindBirthForm(form) {
  const coords = $('[data-coords]', form);
  const timeInput = form.elements.time;
  const preview = $('[data-lunar-preview]', form);
  const sync = () => {
    coords.hidden = form.elements.place.value !== 'khac';
    timeInput.disabled = form.elements.noTime.checked;
    const m = String(form.elements.date.value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return (preview.textContent = '');
    const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
    if (y < 1900 || y > 2100) return (preview.textContent = '');
    const l = solarToLunar(d, mo, y);
    preview.textContent = t('birth.lunarPreview', { d: l.day, m: l.month, leap: l.leap ? t('birth.leap') : '', y: l.year });
    const pl = placeById[form.elements.place.value];
    const lat = pl ? pl.lat : Number(form.elements.lat.value);
    const lon = pl ? pl.lon : form.elements.lon.value === '' ? NaN : Number(form.elements.lon.value); // ô trống → không đoán theo kinh độ
    if (Number.isFinite(lat) && !form.dataset.tzTouched) form.elements.tz.value = suggestTimeZone(lat, y, mo, d, lon);
  };
  form.elements.tz.addEventListener('input', () => (form.dataset.tzTouched = '1'));
  form.addEventListener('input', sync);
  form.addEventListener('change', sync);
  sync();
}
