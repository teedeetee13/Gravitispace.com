// Tài khoản: trạng thái đồng bộ, đổi mật khẩu, đăng xuất, xoá tài khoản.
// Đăng nhập / đăng ký / quên mật khẩu nằm trong hộp nổi dùng chung (login.js), mở ngay trên trang đang xem;
// trang này chỉ là chỗ quản lý khi đã đăng nhập. Khách mở thẳng địa chỉ này thì hộp đăng nhập tự hiện.
import { $, esc, icon, toast } from '../util.js';
import { navigate } from '../route.js';
import { t, fmtDate } from '../i18n.js';
import { auth } from '../auth.js';
import { store } from '../store.js';
import { cloudEnabled } from '../config.js';
import { errorKey } from '../login.js';
import { showLogin, markSignedOut, takeSignedOut } from '../signin.js';

/** Lỗi từ Supabase → lời nhắn thân thiện */
export const errorText = (e) => t(errorKey(e));

function guestView() {
  return `<div class="reading-card">
      <div class="row">
        <button class="btn btn-lg" type="button" data-login="signin">${icon('user')} ${t('account.signIn')}</button>
        <button class="btn btn-lg btn-ghost" type="button" data-login="signup">${icon('plus')} ${t('account.signUp')}</button>
      </div>
    </div>
    <div class="reading-card"><h3>${t('account.whyTitle')}</h3><ul class="minor-list"><li>${t('account.why1')}</li><li>${t('account.why2')}</li><li>${t('account.why3')}</li></ul></div>`;
}

function syncLine(s) {
  const at = s.at ? fmtDate(new Date(s.at), { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'numeric' }) : '';
  return `<span class="sync-dot sync-${s.status}" aria-hidden="true"></span>${t(`account.sync.${s.status}`, { at })}`;
}

function userView(user) {
  return `<div class="reading-card">
      <p class="eyebrow">${t('account.signedInAs')}</p>
      <h3>${esc(user.email || '')}</h3>
      <p class="sync-line" data-sync-line aria-live="polite">${syncLine(store.syncState())}</p>
      <div class="row">
        <button class="btn" type="button" data-sync>${icon('waves')} ${t('account.syncNow')}</button>
        <button class="btn btn-ghost" type="button" data-login="newpass">${t('account.newPasswordTitle')}</button>
        <button class="btn btn-ghost" type="button" data-signout>${t('account.signOut')}</button>
      </div>
      <p class="muted small">${t('account.offlineNote')}</p>
    </div>
    <details class="method">
      <summary>${t('account.dangerTitle')}</summary>
      <p>${t('account.deleteBody')}</p>
      <button class="btn btn-ghost btn-danger" type="button" data-delete>${icon('close')} ${t('account.delete')}</button>
    </details>`;
}

export function renderAccount(view, params) {
  const enabled = cloudEnabled();
  const user = auth.user();
  view.innerHTML = `<div class="page narrow">
    <header class="page-head">
      <p class="eyebrow">${t('nav.account')}</p>
      <h1>${user ? t('account.titleIn') : t('account.title')}</h1>
      <p class="lead">${t('account.lead')}</p>
    </header>
    ${!enabled ? `<div class="note-box">${t('account.notConfigured')}</div>` : user ? userView(user) : guestView()}
  </div>`;
  if (!enabled) return;
  // Link cũ ?che-do=dang-ky / quen-mat-khau và khách mở thẳng trang này → hiện hộp đăng nhập luôn
  if (!user && !takeSignedOut()) showLogin({ 'dang-ky': 'signup', 'quen-mat-khau': 'forgot' }[params.get('che-do')] || 'signin');

  const off = store.onSync((s) => {
    const el = $('[data-sync-line]', view);
    if (!el || !document.body.contains(el)) return off();
    el.innerHTML = syncLine(s);
  });

  view.addEventListener('click', async (e) => {
    const open = e.target.closest('[data-login]');
    if (open) return showLogin(open.dataset.login);
    if (e.target.closest('[data-sync]')) {
      try {
        await store.syncNow();
        toast(t('account.synced'));
      } catch (ex) {
        toast(errorText(ex));
      }
    }
    if (e.target.closest('[data-signout]')) {
      await store.signOut();
      markSignedOut();
      toast(t('account.signedOut'));
      window.dispatchEvent(new Event('ansao:auth'));
    }
    if (e.target.closest('[data-delete]')) {
      if (!confirm(t('account.deleteConfirm'))) return;
      try {
        await store.deleteAccount();
        toast(t('account.deleted'));
        window.dispatchEvent(new Event('ansao:auth'));
        navigate('/');
      } catch (ex) {
        toast(errorText(ex));
      }
    }
  });
}
