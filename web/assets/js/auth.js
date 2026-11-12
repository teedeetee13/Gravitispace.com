// Phiên đăng nhập. Phiên (access token + refresh token) được giữ trên máy nên khi mất mạng,
// mở lại web vẫn đang đăng nhập và thấy dữ liệu của tài khoản (bản đã đồng bộ gần nhất);
// có mạng lại thì làm mới token và đồng bộ.
import { CONFIG, cloudEnabled } from './config.js';
import { cloud, CloudError } from './cloud.js';

const KEY = CONFIG.STORAGE_PREFIX + 'session';
const EMAIL_FLOW_KEY = CONFIG.STORAGE_PREFIX + 'email-flow';
const EMAIL_FLOW_TTL = 24 * 3600;
const OAUTH_KEY = CONFIG.STORAGE_PREFIX + 'oauth';
const OAUTH_TTL = 15 * 60;
const listeners = new Set();
let session = null;

const now = () => Math.floor(Date.now() / 1000);

// Chống giả liên kết đăng nhập: chỉ nhận token trên URL nếu chính trình duyệt này vừa yêu cầu email xác nhận / đặt lại mật khẩu.
// Không có bước này, kẻ xấu gửi một link chứa token tài khoản của họ là nạn nhân bị đăng nhập vào đó, và ngày giờ sinh sẽ bị đồng bộ sang.
function markEmailFlow() {
  try {
    localStorage.setItem(EMAIL_FLOW_KEY, String(now()));
  } catch {}
}
function takeEmailFlow() {
  try {
    const at = Number(localStorage.getItem(EMAIL_FLOW_KEY));
    localStorage.removeItem(EMAIL_FLOW_KEY);
    return at > 0 && now() - at < EMAIL_FLOW_TTL;
  } catch {
    return false;
  }
}

// PKCE: chuỗi bí mật ngẫu nhiên (verifier) giữ trên máy; chỉ gửi bản băm (challenge) đi.
// Mã ?code=… quay về chỉ đổi được ra phiên khi có đúng verifier, nên link giả mạo hay mã bị lộ đều vô dụng.
const b64url = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
function takeOAuth() {
  try {
    const p = JSON.parse(localStorage.getItem(OAUTH_KEY) || 'null');
    localStorage.removeItem(OAUTH_KEY);
    return p && p.verifier && now() - p.at < OAUTH_TTL ? p : null;
  } catch {
    return null;
  }
}

function save(s) {
  session = s;
  try {
    if (s) localStorage.setItem(KEY, JSON.stringify(s));
    else localStorage.removeItem(KEY);
  } catch {}
  listeners.forEach((fn) => fn(session));
}

/** Chuẩn hoá phản hồi token của Supabase thành phiên gọn. */
export function toSession(r) {
  if (!r?.access_token) return null;
  return {
    accessToken: r.access_token,
    refreshToken: r.refresh_token,
    expiresAt: r.expires_at || now() + (r.expires_in || 3600),
    user: { id: r.user?.id, email: r.user?.email },
  };
}

export const auth = {
  enabled: cloudEnabled,
  /** Đọc phiên đã lưu (chạy được khi offline). */
  load() {
    try {
      session = JSON.parse(localStorage.getItem(KEY) || 'null');
    } catch {
      session = null;
    }
    return session;
  },
  user: () => session?.user || null,
  onChange(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  /** Token còn hạn để gọi API; tự làm mới nếu sắp hết hạn. Trả null nếu chưa đăng nhập. */
  async token() {
    if (!session) return null;
    if (session.expiresAt - now() > 60) return session.accessToken;
    try {
      const s = toSession(await cloud.refresh(session.refreshToken));
      save({ ...s, user: s.user?.id ? s.user : session.user });
      return session.accessToken;
    } catch (e) {
      // Refresh token bị thu hồi / hết hạn → đăng xuất; lỗi mạng → giữ phiên để dùng offline
      if (e instanceof CloudError && e.status && e.status < 500) save(null);
      throw e;
    }
  },

  async signIn(email, password) {
    save(toSession(await cloud.signIn(email, password)));
    return session;
  },
  /** Trả về 'signed-in' (vào luôn) hoặc 'confirm-email' (cần bấm link trong email). */
  async signUp(email, password, consent) {
    // Không có đồng ý thì không gửi gì lên máy chủ (Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15)
    if (!consent?.version) throw Object.assign(new Error('consent_required'), { code: 'consent_required' });
    const r = await cloud.signUp(email, password, { consent_version: consent.version, consent_at: new Date().toISOString() });
    const s = toSession(r);
    if (s) {
      save(s);
      return 'signed-in';
    }
    markEmailFlow();
    return 'confirm-email';
  },
  /** Đăng nhập / đăng ký bằng tài khoản ngoài (Google). Rời trang, quay lại qua consumeRedirect(). */
  async startOAuth(provider, consent) {
    // Lần đầu bằng Google là tạo tài khoản, nên cũng cần đồng ý chính sách trước (Luật BVDLCN)
    if (!consent?.version) throw Object.assign(new Error('consent_required'), { code: 'consent_required' });
    const verifier = b64url(crypto.getRandomValues(new Uint8Array(32)));
    const challenge = b64url(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)));
    localStorage.setItem(OAUTH_KEY, JSON.stringify({ verifier, consent: consent.version, at: now() }));
    location.assign(cloud.authorizeUrl(provider, location.origin + location.pathname, challenge));
  },
  async recover(email) {
    await cloud.recover(email);
    markEmailFlow();
  },
  async updatePassword(password) {
    await cloud.updatePassword(await auth.token(), password);
  },
  async signOut() {
    const token = session?.accessToken;
    save(null);
    if (token) cloud.signOut(token).catch(() => {});
  },
  async deleteAccount() {
    await cloud.deleteAccount(await auth.token());
    save(null);
  },

  /**
   * Xử lý đường dẫn quay về từ email (xác nhận đăng ký / đặt lại mật khẩu):
   * Supabase gắn #access_token=…&refresh_token=…&type=signup|recovery vào URL.
   * Trả về type nếu có, và dọn URL về #/tai-khoan.
   */
  async consumeRedirect() {
    const oauth = await auth.consumeOAuth();
    if (oauth) return oauth;
    const h = location.hash.slice(1);
    if (!h.includes('access_token=') && !h.includes('error_description=')) return null;
    const p = new URLSearchParams(h);
    history.replaceState(null, '', `${location.pathname}#/tai-khoan`);
    if (p.get('error_description')) return 'error';
    if (!takeEmailFlow()) return 'error';
    const base = { access_token: p.get('access_token'), refresh_token: p.get('refresh_token'), expires_in: Number(p.get('expires_in')) || 3600 };
    let user = {};
    try {
      user = await cloud.getUser(base.access_token);
    } catch {}
    save(toSession({ ...base, user }));
    return p.get('type') || 'signup';
  },

  /** Quay về từ Google: ?code=… (thành công) hoặc ?error=… Trả 'oauth' | 'oauth-error' | null. */
  async consumeOAuth() {
    const q = new URLSearchParams(location.search);
    const code = q.get('code');
    if (!code && !q.get('error')) return null;
    history.replaceState(null, '', `${location.pathname}#/tai-khoan`);
    const pending = takeOAuth();
    if (!code || !pending) return 'oauth-error';
    try {
      const r = await cloud.exchangeCode(code, pending.verifier);
      const s = toSession(r);
      if (!s) return 'oauth-error';
      save(s);
      // Tài khoản mới tạo qua Google chưa có dấu đồng ý: ghi lại phiên bản chính sách người dùng vừa tích
      if (!r.user?.user_metadata?.consent_version) {
        await cloud.updateUserData(s.accessToken, { consent_version: pending.consent, consent_at: new Date().toISOString() }).catch(() => {});
      }
      return 'oauth';
    } catch {
      return 'oauth-error';
    }
  },
};
