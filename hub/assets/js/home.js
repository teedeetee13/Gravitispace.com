// Trang chính Graviti (9 ngôn ngữ): vẽ dịch vụ, phân môn, nguyên tắc, lộ trình từ data.js + gói ngôn ngữ.
import { t, td, esc, icon, applyStrings, setupTheme, loadLang, saveLang, pickLang, lang } from './common.js';
import { SERVICES, STAR_MODULES, PRINCIPLES, ROADMAP, SITE } from './data.js';
import { LANGS } from './i18n/langs.js';

const $ = (s) => document.querySelector(s);

// Tài khoản dùng chung: Graviti Stars lưu phiên và dữ liệu trên máy với tiền tố 'ansao:' (giữ nguyên từ tên cũ).
// Trang chính chỉ ĐỌC để hiện tóm tắt, không gọi máy chủ, không sửa gì. Cấu trúc khớp web/assets/js/store.js + auth.js.
const PREFIX = 'ansao:';
function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null');
  } catch {
    return null;
  }
}
function readMe() {
  const session = readJson(PREFIX + 'session');
  if (!session?.user?.id) return null;
  return { email: String(session.user.email || ''), state: readJson(`${PREFIX}v2:u:${session.user.id}`) || {} };
}
const todayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function renderMe() {
  const me = readMe();
  const btn = $('[data-acct]');
  const label = $('[data-acct-label]');
  $('#me').hidden = !me;
  if (!me) {
    btn.setAttribute('href', 'stars/#/tai-khoan');
    btn.removeAttribute('aria-label');
    label.textContent = t('nav.signIn');
    return;
  }
  // Đã đăng nhập: nút trên cùng dẫn về "Không gian của bạn", hiện phần trước @ của email
  btn.setAttribute('href', '#me');
  btn.setAttribute('aria-label', `${t('me.title')}: ${me.email}`);
  label.textContent = me.email.split('@')[0];
  $('[data-me-hello]').textContent = t('me.hello', { email: me.email });

  const s = me.state;
  const p = s.profile;
  const saved = Array.isArray(s.saved) ? s.saved.length : 0;
  const drawn = !!s.draws?.[todayKey()];
  let born = '';
  if (p?.year && p?.month && p?.day) {
    try {
      born = new Intl.DateTimeFormat(LANGS.find((l) => l.code === lang).html, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(p.year, p.month - 1, p.day));
    } catch {
      born = `${p.day}/${p.month}/${p.year}`;
    }
  }
  const tiles = [
    { href: 'stars/#/tarot', ic: 'card', title: t('me.today'), body: t(drawn ? 'me.todayYes' : 'me.todayNo'), on: drawn },
    { href: 'stars/#/ban-menh', ic: 'star', title: t('me.profile'), body: born ? t('me.profileYes', { date: born }) : t('me.profileNo'), on: !!born },
    { href: 'stars/#/tu', ic: 'bookmark', title: t('me.shelf'), body: t('me.shelfN', { n: saved }), on: saved > 0 },
    { href: 'stars/#/tai-khoan', ic: 'sync', title: t('me.account'), body: t(s.dirty ? 'me.pending' : 'me.synced'), on: !s.dirty },
  ];
  $('#me-tiles').innerHTML = tiles
    .map(
      (x) =>
        `<a class="me-tile${x.on ? ' is-on' : ''}" href="${x.href}"><span class="svc-icon">${icon(x.ic)}</span><span class="me-text"><strong>${esc(x.title)}</strong><span>${esc(x.body)}</span></span>${icon('arrow', 'ic ic-s me-go')}</a>`
    )
    .join('');
}

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
  renderMe();
}

// Đăng nhập / đăng xuất ở tab khác (Graviti Stars) → cập nhật ngay; quay lại trang bằng nút Back cũng vẽ lại
window.addEventListener('storage', (e) => {
  if (!e.key || e.key.startsWith(PREFIX)) renderMe();
});
window.addEventListener('pageshow', (e) => e.persisted && renderMe());

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
