// Trang Tài khoản chung của cả hệ Graviti (/tai-khoan/, 9 ngôn ngữ). Một tài khoản dùng cho mọi dịch vụ.
//  - Khách: nút Đăng nhập / Tạo tài khoản; mở thẳng trang này thì hộp đăng nhập nổi tự hiện.
//  - Đã đăng nhập: trạng thái đồng bộ, Đồng bộ ngay, Đổi mật khẩu, Đăng xuất, Xoá tài khoản.
// Mã tài khoản, đồng bộ, hộp đăng nhập dùng chung với Graviti Stars (dist/stars/, cùng địa chỉ web nên cùng phiên, cùng dữ liệu).
import { t, esc, icon, applyStrings, setupTheme, loadLang, saveLang, pickLang, lang } from './common.js';
import { LANGS } from './i18n/langs.js';
import { auth } from '../../stars/assets/js/auth.js';
import { store } from '../../stars/assets/js/store.js';
import { cloudEnabled } from '../../stars/assets/js/config.js';
import { openLogin, flash, errorKey, redirectMessageKey } from '../../stars/assets/js/login.js';

const $ = (s) => document.querySelector(s);
const main = $('#main');
let offSync = null;

function login(mode) {
  openLogin({
    t,
    mode,
    toast: flash,
    privacyUrl: '../privacy/',
    manageUrl: './',
    // Đăng xuất: gửi nốt thay đổi chưa đồng bộ rồi mới xoá bản sao dữ liệu của tài khoản khỏi máy này
    signOut: () => store.signOut(),
    async onDone(what) {
      // Vừa đăng nhập: gộp dữ liệu khách trên máy vào tài khoản (không mất gì), rồi đồng bộ
      if (what === 'signin') await store.afterSignIn();
      render();
    },
  });
}

function syncLine(s) {
  let at = '';
  if (s.at) {
    try {
      at = new Intl.DateTimeFormat(LANGS.find((l) => l.code === lang).html, { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'numeric' }).format(new Date(s.at));
    } catch {}
  }
  return `<span class="acct-dot is-${esc(s.status)}" aria-hidden="true"></span><span>${esc(t(`account.sync.${s.status}`, { at }))}</span>`;
}

const guestView = () => `
  <section class="acct-card">
    <div class="acct-actions">
      <button class="btn btn-primary" type="button" data-login="signin">${icon('user')}<span>${esc(t('account.signIn'))}</span></button>
      <button class="btn btn-ghost" type="button" data-login="signup">${esc(t('account.signUp'))}</button>
    </div>
  </section>
  <section class="acct-card">
    <h2>${esc(t('account.whyTitle'))}</h2>
    <ul class="acct-why"><li>${esc(t('account.why1'))}</li><li>${esc(t('account.why2'))}</li><li>${esc(t('account.why3'))}</li></ul>
  </section>`;

const userView = (user) => `
  <section class="acct-card">
    <p class="kicker">${esc(t('account.signedInAs'))}</p>
    <h2 class="acct-email">${esc(user.email || '')}</h2>
    <p class="acct-sync" data-sync-line aria-live="polite">${syncLine(store.syncState())}</p>
    <div class="acct-actions">
      <button class="btn btn-primary" type="button" data-sync>${icon('sync')}<span>${esc(t('account.syncNow'))}</span></button>
      <button class="btn btn-ghost" type="button" data-login="newpass">${esc(t('account.newPasswordTitle'))}</button>
      <button class="btn btn-ghost" type="button" data-signout>${esc(t('account.signOut'))}</button>
    </div>
    <p class="muted acct-small">${esc(t('account.offlineNote'))}</p>
  </section>
  <section class="acct-card">
    <h2>${esc(t('acct.services'))}</h2>
    <div class="acct-svcs">
      <a class="me-tile is-on" href="../stars/"><span class="svc-icon">${icon('star')}</span><span class="me-text"><strong>Graviti Stars</strong><span>${esc(t('acct.starsBody'))}</span></span>${icon('arrow', 'ic ic-s me-go')}</a>
    </div>
  </section>
  <details class="acct-card acct-danger">
    <summary>${esc(t('account.dangerTitle'))}</summary>
    <p>${esc(t('account.deleteBody'))}</p>
    <button class="btn btn-danger" type="button" data-delete>${esc(t('account.delete'))}</button>
  </details>`;

function render() {
  const meta = LANGS.find((l) => l.code === lang);
  applyStrings('acct.docTitle', null, meta.html);
  $('[data-lang-select]').value = lang;
  $('[data-year]').textContent = new Date().getFullYear();
  offSync?.();
  offSync = null;
  const enabled = cloudEnabled();
  const user = enabled ? auth.user() : null;
  main.innerHTML = `<header class="acct-head">
      <p class="kicker">${esc(t('me.account'))}</p>
      <h1>${esc(t(user ? 'account.titleIn' : 'account.title'))}</h1>
      <p class="section-lead">${esc(t('account.lead'))}</p>
    </header>
    ${!enabled ? `<p class="acct-card">${esc(t('account.notConfigured'))}</p>` : user ? userView(user) : guestView()}`;
  if (user) offSync = store.onSync((s) => {
    const el = $('[data-sync-line]');
    if (el) el.innerHTML = syncLine(s);
  });
}

/** Chạy một việc từ nút bấm: khoá nút trong lúc chờ (chống bấm hai lần), lỗi → lời nhắn thân thiện. */
async function busy(btn, work) {
  btn.disabled = true;
  try {
    await work();
  } catch (ex) {
    flash(t(errorKey(ex)));
  } finally {
    btn.disabled = false;
  }
}

main.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  if (btn.dataset.login) return login(btn.dataset.login);
  if (btn.hasAttribute('data-sync'))
    return busy(btn, async () => {
      await store.syncNow();
      flash(t('account.synced'));
    });
  if (btn.hasAttribute('data-signout'))
    return busy(btn, async () => {
      await store.signOut();
      render();
      flash(t('account.signedOut'));
    });
  if (btn.hasAttribute('data-delete')) {
    if (!confirm(t('account.deleteConfirm'))) return;
    return busy(btn, async () => {
      await store.deleteAccount();
      render();
      flash(t('account.deleted'));
    });
  }
});

// Đăng nhập / đăng xuất ở tab khác → tải lại để dữ liệu trên trang khớp tài khoản đang dùng
window.addEventListener('storage', (e) => e.key === 'ansao:session' && location.reload());

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
// Đọc dữ liệu trên máy + đồng bộ (chờ tối đa 3 giây). Đã đăng nhập ở nơi khác mà máy này chưa có dữ liệu của tài khoản,
// hoặc vừa quay về từ Google / email → gộp dữ liệu khách trên máy vào tài khoản.
await store.init().catch(() => {});
if (auth.user() && ((back && back !== 'error' && back !== 'oauth-error') || store.pendingMerge)) await store.afterSignIn();
render();
if (redirectMessageKey(back)) flash(t(redirectMessageKey(back)));

const params = new URLSearchParams(location.search);
if (back === 'recovery') login('newpass');
else if (cloudEnabled() && !auth.user()) login(params.get('che-do') === 'dang-ky' ? 'signup' : params.get('che-do') === 'quen-mat-khau' ? 'forgot' : 'signin');
// ?che-do=… chỉ dùng một lần để chọn ô trong hộp → bỏ khỏi địa chỉ
if (params.has('che-do')) {
  params.delete('che-do');
  history.replaceState(null, '', location.pathname + (params.size ? '?' + params : '') + location.hash);
}
