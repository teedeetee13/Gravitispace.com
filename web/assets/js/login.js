// Hộp đăng nhập dùng chung cho cả hệ Graviti (trang chính và Graviti Stars), giống các web lớn:
// bấm "Đăng nhập" ở đâu thì hộp hiện ngay trên trang đó, xong thì đóng lại và ở nguyên trang đang xem.
// Đăng nhập Google và link trong email cũng quay về đúng trang lúc bấm (auth.js dùng địa chỉ trang hiện tại).
//
// Mã này nằm trong Graviti Stars (web/) nhưng trang chính dùng chung qua đường dẫn stars/assets/js/login.js.
// Không phụ thuộc bộ ngôn ngữ của trang nào: trang gọi truyền vào hàm t() của mình, các khoá đều là "account.*"
// (Graviti Stars: web/assets/js/i18n/*.js; trang chính: hub/assets/js/i18n/*.js — kiểm thử bắt đủ khoá ở cả hai).
// Giao diện: assets/css/login.css (chỉ dùng biến màu chung của hai trang).
import { auth } from './auth.js';
import { CONFIG, cloudEnabled } from './config.js';

const MIN_PASSWORD = 8;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Mọi khoá chữ hộp đăng nhập dùng (kiểm thử đối chiếu với bộ ngôn ngữ của trang chính và Graviti Stars). */
export const LOGIN_KEYS = [
  'account.tab.dang-nhap', 'account.tab.dang-ky', 'account.dialogLead', 'account.close', 'account.google', 'account.or',
  'account.googleConsent', 'account.privacyLink', 'account.email', 'account.password', 'account.passwordNew', 'account.passwordAgain',
  'account.signIn', 'account.signUp', 'account.signUpNote', 'account.consent', 'account.forgot', 'account.recoverIntro',
  'account.recoverSend', 'account.recoverSent', 'account.backToSignIn', 'account.checkEmail', 'account.noAccount', 'account.haveAccount',
  'account.newPasswordTitle', 'account.savePassword', 'account.passwordSaved', 'account.signedInAs', 'account.manage', 'account.signOut',
  'account.signedOut', 'account.welcome', 'account.oauthFailed', 'account.linkExpired', 'account.notConfigured',
  'account.err.email', 'account.err.short', 'account.err.mismatch', 'account.err.consent', 'account.err.consentGoogle',
  'account.err.credentials', 'account.err.notConfirmed', 'account.err.exists', 'account.err.weak', 'account.err.rate',
  'account.err.offline', 'account.err.generic',
];

/** Lỗi từ Supabase → khoá lời nhắn thân thiện */
export function errorKey(e) {
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
  return map[e?.code] || 'account.err.generic';
}

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Chữ "G" nhiều màu theo hướng dẫn thương hiệu của Google cho nút đăng nhập
const GOOGLE_G = `<svg class="gl-g" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.7 1.2 9.2 3.6l6.9-6.9C35.9 2.4 30.4 0 24 0 14.6 0 6.6 5.4 2.7 13.3l8 6.2C12.6 13.6 17.8 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.5 5.8c4.4-4 6.8-10 6.8-17.2z"/><path fill="#FBBC05" d="M10.7 28.5c-.5-1.4-.8-2.9-.8-4.5s.3-3.1.8-4.5l-8-6.2C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l8-6.2z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.2 0-11.4-4.1-13.3-9.7l-8 6.2C6.6 42.6 14.6 48 24 48z"/></svg>`;
const CLOSE = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg>';

/** Thông báo nhỏ ở cuối màn hình (dùng khi trang gọi không truyền hàm toast của riêng nó). */
export function flash(msg) {
  let el = document.querySelector('.gl-toast');
  if (!el) {
    el = Object.assign(document.createElement('div'), { className: 'gl-toast', role: 'status' });
    el.setAttribute('aria-live', 'polite');
    document.body.append(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(flash.timer);
  flash.timer = setTimeout(() => el.classList.remove('show'), 2800);
}

let dlg = null;

/**
 * Mở hộp đăng nhập.
 * @param {object} o
 * @param {(key: string, vars?: object) => string} o.t   hàm dịch của trang gọi
 * @param {'signin'|'signup'|'forgot'|'newpass'|'me'} [o.mode]
 * @param {string} o.privacyUrl   đường dẫn trang chính sách (tương đối với trang gọi)
 * @param {string} [o.manageUrl]  trang quản lý tài khoản (chế độ 'me')
 * @param {(what: 'signin'|'signout') => any} [o.onDone]  sau khi đăng nhập / đăng xuất (đồng bộ dữ liệu, vẽ lại trang…)
 * @param {() => Promise<any>} [o.signOut]  cách đăng xuất của trang gọi (Graviti Stars đồng bộ trước khi xoá bản sao)
 * @param {(msg: string) => void} [o.toast]
 */
export function openLogin(o) {
  const { t } = o;
  const toast = o.toast || flash;
  let mode = o.mode || 'signin';
  if (!dlg) {
    dlg = document.createElement('dialog');
    dlg.className = 'gl-dialog';
    dlg.addEventListener('close', () => dlg.remove());
  }
  document.body.append(dlg);
  const privacy = `<a href="${esc(o.privacyUrl)}" target="_blank" rel="noopener noreferrer">${esc(t('account.privacyLink'))}</a>`;
  const field = (name, type, label, extra = '') =>
    `<label class="gl-field"><span>${esc(label)}</span><input name="${name}" type="${type}" required ${extra} /></label>`;
  const emailField = () => field('email', 'email', t('account.email'), 'autocomplete="email" inputmode="email"');
  const swap = (to, label) => `<button class="gl-link" type="button" data-mode="${to}">${esc(label)}</button>`;

  function google() {
    if (!CONFIG.OAUTH_PROVIDERS?.includes('google')) return '';
    return `<div class="gl-oauth">
        <label class="gl-consent"><input type="checkbox" data-oauth-consent /><span>${t('account.googleConsent', { link: privacy })}</span></label>
        <p class="gl-error" data-oauth-error role="alert"></p>
        <button class="gl-btn gl-google" type="button" data-oauth="google">${GOOGLE_G}<span>${esc(t('account.google'))}</span></button>
      </div>
      <p class="gl-or"><span>${esc(t('account.or'))}</span></p>`;
  }

  function body() {
    const user = auth.user();
    if (!cloudEnabled()) return { title: t('account.tab.dang-nhap'), html: `<p class="gl-note">${esc(t('account.notConfigured'))}</p>` };
    if (mode === 'me' && user) {
      return {
        title: t('account.signedInAs'),
        html: `<p class="gl-who">${esc(user.email || '')}</p>
          <div class="gl-stack">
            ${o.manageUrl ? `<a class="gl-btn" href="${esc(o.manageUrl)}">${esc(t('account.manage'))}</a>` : ''}
            <button class="gl-btn gl-ghost" type="button" data-signout>${esc(t('account.signOut'))}</button>
          </div>`,
      };
    }
    if (mode === 'newpass') {
      return {
        title: t('account.newPasswordTitle'),
        html: `<form class="gl-form" data-auth="password" novalidate>
            ${field('password', 'password', t('account.passwordNew', { n: MIN_PASSWORD }), `autocomplete="new-password" minlength="${MIN_PASSWORD}"`)}
            <p class="gl-error" data-error role="alert"></p>
            <button class="gl-btn gl-primary" type="submit">${esc(t('account.savePassword'))}</button>
          </form>`,
      };
    }
    if (mode === 'forgot') {
      return {
        title: t('account.forgot'),
        html: `<form class="gl-form" data-auth="recover" novalidate>
            <p class="gl-muted">${esc(t('account.recoverIntro'))}</p>
            ${emailField()}
            <p class="gl-error" data-error role="alert"></p>
            <button class="gl-btn gl-primary" type="submit">${esc(t('account.recoverSend'))}</button>
          </form>
          <p class="gl-foot">${swap('signin', t('account.backToSignIn'))}</p>`,
      };
    }
    if (mode === 'signup') {
      return {
        title: t('account.tab.dang-ky'),
        html: `${google()}<form class="gl-form" data-auth="signup" novalidate>
            ${emailField()}
            ${field('password', 'password', t('account.passwordNew', { n: MIN_PASSWORD }), `autocomplete="new-password" minlength="${MIN_PASSWORD}"`)}
            ${field('password2', 'password', t('account.passwordAgain'), 'autocomplete="new-password"')}
            <label class="gl-consent"><input type="checkbox" name="consent" value="1" /><span>${t('account.consent', { link: privacy })}</span></label>
            <p class="gl-error" data-error role="alert"></p>
            <button class="gl-btn gl-primary" type="submit">${esc(t('account.signUp'))}</button>
            <p class="gl-muted gl-small">${esc(t('account.signUpNote'))}</p>
          </form>
          <p class="gl-foot">${esc(t('account.haveAccount'))} ${swap('signin', t('account.signIn'))}</p>`,
      };
    }
    mode = 'signin';
    return {
      title: t('account.tab.dang-nhap'),
      html: `${google()}<form class="gl-form" data-auth="signin" novalidate>
          ${emailField()}
          ${field('password', 'password', t('account.password'), 'autocomplete="current-password"')}
          <p class="gl-error" data-error role="alert"></p>
          <button class="gl-btn gl-primary" type="submit">${esc(t('account.signIn'))}</button>
          ${swap('forgot', t('account.forgot'))}
        </form>
        <p class="gl-foot">${esc(t('account.noAccount'))} ${swap('signup', t('account.signUp'))}</p>`,
    };
  }

  function draw() {
    const b = body();
    dlg.setAttribute('aria-labelledby', 'gl-title');
    dlg.innerHTML = `<div class="gl-card">
        <div class="gl-head">
          <h2 id="gl-title" tabindex="-1">${esc(b.title)}</h2>
          <button class="gl-x" type="button" data-close aria-label="${esc(t('account.close'))}">${CLOSE}</button>
        </div>
        ${['signin', 'signup'].includes(mode) ? `<p class="gl-muted gl-lead">${esc(t('account.dialogLead'))}</p>` : ''}
        <div class="gl-body">${b.html}</div>
      </div>`;
  }
  // Đặt tiêu điểm vào tiêu đề hộp: trình đọc màn hình đọc ngay tên hộp, điện thoại không bật bàn phím đột ngột
  const focusTitle = () => dlg.querySelector('#gl-title')?.focus();

  async function done(what, msg) {
    dlg.close();
    try {
      await o.onDone?.(what);
    } catch {}
    if (msg) toast(msg);
  }

  dlg.onclick = async (e) => {
    if (e.target === dlg || e.target.closest('[data-close]')) return dlg.close(); // bấm vùng mờ ngoài hộp cũng đóng
    const sw = e.target.closest('[data-mode]');
    if (sw) {
      mode = sw.dataset.mode;
      draw();
      return focusTitle();
    }
    const oauthBtn = e.target.closest('[data-oauth]');
    if (oauthBtn) {
      const err = dlg.querySelector('[data-oauth-error]');
      if (!dlg.querySelector('[data-oauth-consent]')?.checked) return (err.textContent = t('account.err.consentGoogle'));
      err.textContent = '';
      oauthBtn.disabled = true;
      try {
        await auth.startOAuth(oauthBtn.dataset.oauth, { version: CONFIG.CONSENT_VERSION }); // rời trang, quay về đúng trang này
      } catch (ex) {
        err.textContent = t(errorKey(ex));
        oauthBtn.disabled = false;
      }
      return;
    }
    if (e.target.closest('[data-signout]')) {
      await (o.signOut ? o.signOut() : auth.signOut());
      return done('signout', t('account.signedOut'));
    }
  };

  dlg.onsubmit = async (e) => {
    const form = e.target.closest('[data-auth]');
    if (!form) return;
    e.preventDefault();
    const err = form.querySelector('[data-error]');
    const btn = form.querySelector('[type=submit]');
    const f = new FormData(form);
    const email = String(f.get('email') || '').trim();
    const password = String(f.get('password') || '');
    const kind = form.dataset.auth;
    err.textContent = '';
    if (form.elements.email && !EMAIL_RE.test(email)) return (err.textContent = t('account.err.email'));
    if (['signup', 'password'].includes(kind) && password.length < MIN_PASSWORD) return (err.textContent = t('account.err.short', { n: MIN_PASSWORD }));
    if (kind === 'signup' && password !== f.get('password2')) return (err.textContent = t('account.err.mismatch'));
    if (kind === 'signup' && !f.get('consent')) return (err.textContent = t('account.err.consent'));
    btn.disabled = true;
    try {
      if (kind === 'signin') {
        await auth.signIn(email, password);
        return await done('signin', t('account.welcome'));
      }
      if (kind === 'signup') {
        const r = await auth.signUp(email, password, { version: CONFIG.CONSENT_VERSION });
        if (r === 'signed-in') return await done('signin', t('account.welcome'));
        form.outerHTML = `<p class="gl-note">${t('account.checkEmail', { email: esc(email) })}</p>`;
      } else if (kind === 'recover') {
        await auth.recover(email);
        form.outerHTML = `<p class="gl-note">${t('account.recoverSent', { email: esc(email) })}</p>`;
      } else if (kind === 'password') {
        await auth.updatePassword(password);
        return await done('password', t('account.passwordSaved'));
      }
    } catch (ex) {
      err.textContent = t(errorKey(ex));
    } finally {
      if (document.body.contains(btn)) btn.disabled = false;
    }
  };

  draw();
  if (!dlg.open) dlg.showModal();
  focusTitle();
  return dlg;
}

/** Thông báo sau khi quay về từ Google / link trong email (auth.consumeRedirect()). Trả về khoá chữ hoặc ''. */
export function redirectMessageKey(type) {
  if (type === 'error') return 'account.linkExpired';
  if (type === 'oauth-error') return 'account.oauthFailed';
  if (type && type !== 'recovery') return 'account.welcome';
  return '';
}
