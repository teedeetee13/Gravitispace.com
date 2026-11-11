// Trang chính Graviti (9 ngôn ngữ): vẽ dịch vụ, phân môn, nguyên tắc, lộ trình từ data.js + gói ngôn ngữ.
import { t, td, esc, icon, applyStrings, setupTheme, loadLang, saveLang, pickLang, lang } from './common.js';
import { SERVICES, STAR_MODULES, PRINCIPLES, ROADMAP, SITE } from './data.js';
import { LANGS } from './i18n/langs.js';

const $ = (s) => document.querySelector(s);

function pill(status) {
  return `<span class="pill pill-${status}">${icon(status === 'live' ? 'dot' : 'clock', 'ic ic-s')}${esc(t('status.' + status))}</span>`;
}

function render() {
  const meta = LANGS.find((l) => l.code === lang);
  applyStrings('home.title', 'home.desc', meta.html);
  $('[data-lang-select]').value = lang;

  $('#services-list').innerHTML = SERVICES.map((s) => {
    const live = s.status === 'live' && s.href;
    const tag = live ? 'a' : 'article';
    const text = td('services', s.id);
    return `<${tag} class="svc svc-${s.id}${live ? ' is-live' : ''}"${live ? ` href="${esc(s.href)}"` : ''}>
      <div class="svc-top"><span class="svc-icon">${icon(s.icon)}</span>${pill(s.status)}</div>
      <h3>${esc(s.name)}</h3>
      <p class="svc-tag">${esc(text.tag)}</p>
      <p class="svc-desc">${esc(text.desc)}</p>
      <p class="svc-addr">${esc(SITE.DOMAIN)}/<span>${esc(s.path)}</span></p>
      ${live ? `<span class="svc-go">${esc(t('home.open'))} ${icon('arrow', 'ic ic-s')}</span>` : `<span class="svc-soon">${esc(t('home.soon'))}</span>`}
    </${tag}>`;
  }).join('');

  $('#modules-list').innerHTML = STAR_MODULES.map(
    (m) => `<li class="chip chip-${m.status}">${icon(m.status === 'live' ? 'check' : 'clock', 'ic ic-s')}${esc(td('modules', m.id))}</li>`
  ).join('');

  $('#principles-list').innerHTML = PRINCIPLES.map((id) => {
    const p = td('principles', id);
    return `<li class="principle"><span class="svc-icon">${icon(id)}</span><div><h3>${esc(p.title)}</h3><p>${esc(p.body)}</p></div></li>`;
  }).join('');

  $('#roadmap-list').innerHTML = ROADMAP.map(
    (r) => `<li class="road road-${r.status}"><span class="road-mark" aria-hidden="true"></span><span class="road-title">${esc(td('roadmap', r.id))}</span><span class="road-status">${esc(t('road.' + r.status))}</span></li>`
  ).join('');

  $('[data-year]').textContent = new Date().getFullYear();
}

const select = $('[data-lang-select]');
select.innerHTML = LANGS.map((l) => `<option value="${l.code}" lang="${l.html}">${esc(l.native)}</option>`).join('');
select.addEventListener('change', async () => {
  saveLang(select.value);
  await loadLang(select.value);
  render();
});
setupTheme();
await loadLang(pickLang());
render();
