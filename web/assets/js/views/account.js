// Tài khoản: đăng nhập, đăng ký, quên mật khẩu, đặt mật khẩu mới, trạng thái đồng bộ, đăng xuất, xoá tài khoản
import { $, esc, icon, toast } from '../util.js';
import { t, fmtDate } from '../i18n.js';
import { auth } from '../auth.js';
import { store } from '../store.js';
import { cloudEnabled } from '../config.js';

const MIN_PASSWORD = 8;

/** Lỗi từ Supabase → lời nhắn thân thiện */
export function errorText(e) {
  const map = {
    invalid_credentials: 'account.err.credentials',
    invalid_grant: 'account.err.credentials',
    email_not_confirmed: 'account.err.notConfirmed',
    user_already_exists: 'account.err.exists',
    email_exists: 'account.err.exists',
    weak_password: 'account.err.weak',
    over_email_send_rate_limit: 'account.err.rate',
    over_request_rate_limit: 'account.err.rate',
    offline: 'account.err.offline',
    network: 'account.err.offline',
    timeout: 'account.err.offline',
    not_configured: 'account.notConfigured',
  };
  return t(map[e?.code] || 'account.err.generic');
}

const field = (name, type, label, extra = '') =>
  `<label class="field"><span>${label}</span><input name="${name}" type="${type}" required ${extra} /></label>`;

function guestView(mode) {
  const tabs = ['dang-nhap', 'dang-ky'].map((m) => `<a href="#/tai-khoan?che-do=${m}" class="${m === mode ? 'on' : ''}" ${m === mode ? 'aria-current="page"' : ''}>${t(`account.tab.${m}`)}</a>`).join('');
  const forms = {
    'dang-nhap': `<form class="birth-form" data-auth="signin" novalidate>
        ${field('email', 'email', t('account.email'), 'autocomplete="email" inputmode="email"')}
        ${field('password', 'password', t('account.password'), 'autocomplete="current-password"')}
        <p class="form-error" data-error role="alert"></p>
        <button class="btn btn-lg" type="submit">${icon('user')} ${t('account.signIn')}</button>
        <a href="#/tai-khoan?che-do=quen-mat-khau" class="small">${t('account.forgot')}</a>
      </form>`,
    'dang-ky': `<form class="birth-form" data-auth="signup" novalidate>
        ${field('email', 'email', t('account.email'), 'autocomplete="email" inputmode="email"')}
        ${field('password', 'password', t('account.passwordNew', { n: MIN_PASSWORD }), `autocomplete="new-password" minlength="${MIN_PASSWORD}"`)}
        ${field('password2', 'password', t('account.passwordAgain'), 'autocomplete="new-password"')}
        <p class="form-error" data-error role="alert"></p>
        <button class="btn btn-lg" type="submit">${icon('plus')} ${t('account.signUp')}</button>
        <p class="muted small">${t('account.signUpNote')}</p>
      </form>`,
    'quen-mat-khau': `<form class="birth-form" data-auth="recover" novalidate>
        <p>${t('account.recoverIntro')}</p>
        ${field('email', 'email', t('account.email'), 'autocomplete="email" inputmode="email"')}
        <p class="form-error" data-error role="alert"></p>
        <button class="btn btn-lg" type="submit">${t('account.recoverSend')}</button>
        <a href="#/tai-khoan" class="small">${t('account.backToSignIn')}</a>
      </form>`,
  };
  return `${mode !== 'quen-mat-khau' ? `<nav class="tabs" aria-label="${esc(t('nav.account'))}">${tabs}</nav>` : ''}${forms[mode]}
    <div class="reading-card"><h3>${t('account.whyTitle')}</h3><ul class="minor-list"><li>${t('account.why1')}</li><li>${t('account.why2')}</li><li>${t('account.why3')}</li></ul></div>`;
}

function syncLine(s) {
  const at = s.at ? fmtDate(new Date(s.at), { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'numeric' }) : '';
  return `<span class="sync-dot sync-${s.status}" aria-hidden="true"></span>${t(`account.sync.${s.status}`, { at })}`;
}

function userView(user, recovery) {
  return `<div class="reading-card">
      <p class="eyebrow">${t('account.signedInAs')}</p>
      <h3>${esc(user.email || '')}</h3>
      <p class="sync-line" data-sync-line aria-live="polite">${syncLine(store.syncState())}</p>
      <div class="row">
        <button class="btn" type="button" data-sync>${icon('waves')} ${t('account.syncNow')}</button>
        <button class="btn btn-ghost" type="button" data-signout>${t('account.signOut')}</button>
      </div>
      <p class="muted small">${t('account.offlineNote')}</p>
    </div>
    <form class="birth-form" data-auth="password" novalidate ${recovery ? '' : 'hidden'}>
      <h3>${t('account.newPasswordTitle')}</h3>
      ${field('password', 'password', t('account.passwordNew', { n: MIN_PASSWORD }), `autocomplete="new-password" minlength="${MIN_PASSWORD}"`)}
      <p class="form-error" data-error role="alert"></p>
      <button class="btn" type="submit">${t('account.savePassword')}</button>
    </form>
    <details class="method">
      <summary>${t('account.dangerTitle')}</summary>
      <p>${t('account.deleteBody')}</p>
      <button class="btn btn-ghost btn-danger" type="button" data-delete>${icon('close')} ${t('account.delete')}</button>
    </details>`;
}

export function renderAccount(view, params) {
  const enabled = cloudEnabled();
  const user = auth.user();
  const mode = ['dang-nhap', 'dang-ky', 'quen-mat-khau'].includes(params.get('che-do')) ? params.get('che-do') : 'dang-nhap';
  view.innerHTML = `<div class="page narrow">
    <header class="page-head">
      <p class="eyebrow">${t('nav.account')}</p>
      <h1>${user ? t('account.titleIn') : t('account.title')}</h1>
      <p class="lead">${t('account.lead')}</p>
    </header>
    ${!enabled ? `<div class="note-box">${t('account.notConfigured')}</div>` : user ? userView(user, params.get('dat-lai') === '1') : guestView(mode)}
  </div>`;
  if (!enabled) return;

  const off = store.onSync((s) => {
    const el = $('[data-sync-line]', view);
    if (!el || !document.body.contains(el)) return off();
    el.innerHTML = syncLine(s);
  });

  view.addEventListener('submit', async (e) => {
    const form = e.target.closest('[data-auth]');
    if (!form) return;
    e.preventDefault();
    const err = $('[data-error]', form);
    const btn = form.querySelector('[type=submit]');
    const f = new FormData(form);
    const email = String(f.get('email') || '').trim();
    const password = String(f.get('password') || '');
    err.textContent = '';
    if (form.elements.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return (err.textContent = t('account.err.email'));
    if (['signup', 'password'].includes(form.dataset.auth) && password.length < MIN_PASSWORD) return (err.textContent = t('account.err.short', { n: MIN_PASSWORD }));
    if (form.dataset.auth === 'signup' && password !== f.get('password2')) return (err.textContent = t('account.err.mismatch'));
    btn.disabled = true;
    try {
      if (form.dataset.auth === 'signin') {
        await auth.signIn(email, password);
        await store.afterSignIn();
        toast(t('account.welcome'));
        location.hash = '#/tai-khoan';
        window.dispatchEvent(new Event('ansao:auth'));
      } else if (form.dataset.auth === 'signup') {
        const r = await auth.signUp(email, password);
        if (r === 'signed-in') {
          await store.afterSignIn();
          toast(t('account.welcome'));
          location.hash = '#/tai-khoan';
          window.dispatchEvent(new Event('ansao:auth'));
        } else form.outerHTML = `<div class="note-box">${t('account.checkEmail', { email: esc(email) })}</div>`;
      } else if (form.dataset.auth === 'recover') {
        await auth.recover(email);
        form.outerHTML = `<div class="note-box">${t('account.recoverSent', { email: esc(email) })}</div>`;
      } else if (form.dataset.auth === 'password') {
        await auth.updatePassword(password);
        form.hidden = true;
        toast(t('account.passwordSaved'));
      }
    } catch (ex) {
      err.textContent = errorText(ex);
    } finally {
      if (document.body.contains(btn)) btn.disabled = false;
    }
  });

  view.addEventListener('click', async (e) => {
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
      toast(t('account.signedOut'));
      window.dispatchEvent(new Event('ansao:auth'));
      location.hash = '#/tai-khoan';
    }
    if (e.target.closest('[data-delete]')) {
      if (!confirm(t('account.deleteConfirm'))) return;
      try {
        await auth.deleteAccount();
        await store.signOut();
        toast(t('account.deleted'));
        window.dispatchEvent(new Event('ansao:auth'));
        location.hash = '#/';
      } catch (ex) {
        toast(errorText(ex));
      }
    }
  });
}
