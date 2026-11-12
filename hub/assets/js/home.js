// Trang chính Graviti (9 ngôn ngữ): vẽ dịch vụ, phân môn, nguyên tắc, lộ trình từ data.js + gói ngôn ngữ.
import { t, td, esc, icon, applyStrings, setupTheme, loadLang, saveLang, pickLang, lang } from './common.js';
import { SERVICES, STAR_MODULES, PRINCIPLES, ROADMAP, SITE } from './data.js';
import { LANGS } from './i18n/langs.js';
// Đăng nhập dùng chung cả hệ: mã nằm trong Graviti Stars (dist/stars/), trang chính gọi sang (cùng địa chỉ web nên cùng phiên)
import { auth } from '../../stars/assets/js/auth.js';
import { openLogin, flash, redirectMessageKey } from '../../stars/assets/js/login.js';

const $ = (s) => document.querySelector(s);

// Tài khoản dùng chung: Graviti Stars lưu phiên và dữ liệu trên máy với tiền tố 'ansao:' (giữ nguyên từ tên cũ).
// "Không gian của bạn" chỉ ĐỌC dữ liệu trên máy để hiện tóm tắt. Cấu trúc khớp web/assets/js/store.js + auth.js.
// Đăng nhập / đăng xuất qua hộp nổi dùng chung (login.js): ở nguyên trang chính, không chuyển sang Graviti Stars.
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
  return { id: session.user.id, email: String(session.user.email || ''), state: readJson(`${PREFIX}v2:u:${session.user.id}`) || {} };
}
const todayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function renderMe() {
  const me = readMe();
  const btn = $('[data-acct]');
  const label = $('[data-acct-label]');
  $('#me').hidden = !me;
  if (!me) {
    btn.removeAttribute('aria-label');
    label.textContent = t('nav.signIn');
    return;
  }
  // Đã đăng nhập: nút trên cùng hiện phần trước @ của email, bấm vào mở hộp tài khoản (quản lý, đăng xuất)
  btn.setAttribute('aria-label', `${t('account.signedInAs')}: ${me.email}`);
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
    { href: 'stars/tarot/', ic: 'card', title: t('me.today'), body: t(drawn ? 'me.todayYes' : 'me.todayNo'), on: drawn },
    { href: 'stars/ban-menh/', ic: 'star', title: t('me.profile'), body: born ? t('me.profileYes', { date: born }) : t('me.profileNo'), on: !!born },
    { href: 'stars/tu/', ic: 'bookmark', title: t('me.shelf'), body: t('me.shelfN', { n: saved }), on: saved > 0 },
    { href: 'stars/tai-khoan/', ic: 'sync', title: t('me.account'), body: t(s.dirty ? 'me.pending' : 'me.synced'), on: !s.dirty },
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

/** Đăng xuất ở trang chính: xoá phiên; xoá luôn bản sao dữ liệu của tài khoản trên máy nếu đã đồng bộ hết
 *  (còn thay đổi chưa đồng bộ thì giữ lại, lần sau đăng nhập trên máy này Graviti Stars sẽ gửi nốt). */
async function signOut() {
  const me = readMe();
  await auth.signOut();
  try {
    if (me && !me.state.dirty) localStorage.removeItem(`${PREFIX}v2:u:${me.id}`);
  } catch {}
}

function login(mode) {
  openLogin({
    t,
    mode,
    toast: flash,
    privacyUrl: 'privacy/',
    manageUrl: 'stars/tai-khoan/',
    signOut,
    onDone: () => renderMe(),
  });
}

$('[data-acct]').addEventListener('click', (e) => {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return; // mở tab mới: vẫn tới trang Tài khoản
  e.preventDefault();
  login(readMe() ? 'me' : 'signin');
});

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
auth.load();
// Quay về từ Google / link trong email: đổi mã thành phiên trước khi vẽ (lỗi mạng → bỏ qua, trang vẫn hiện)
const back = await auth.consumeRedirect().catch(() => null);
await loadLang(pickLang());
render();
if (redirectMessageKey(back)) flash(t(redirectMessageKey(back)));
if (back === 'recovery') login('newpass');
