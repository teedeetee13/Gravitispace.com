// Gọi Supabase qua REST bằng fetch (không dùng SDK): Auth (GoTrue) tại /auth/v1, dữ liệu (PostgREST) tại /rest/v1.
// Mọi lỗi được chuẩn hoá thành CloudError với `code` để giao diện hiện lời nhắn thân thiện.
import { CONFIG } from './config.js';

export class CloudError extends Error {
  constructor(code, message, status) {
    super(message || code);
    this.code = code;
    this.status = status;
  }
}

const TIMEOUT_MS = 12000;

async function request(path, { method = 'GET', body, token, headers = {}, query = '' } = {}) {
  if (!CONFIG.SUPABASE_URL) throw new CloudError('not_configured');
  if (typeof navigator !== 'undefined' && navigator.onLine === false) throw new CloudError('offline');
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  let res;
  try {
    res = await fetch(`${CONFIG.SUPABASE_URL}${path}${query}`, {
      method,
      signal: ctrl.signal,
      headers: {
        apikey: CONFIG.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token || CONFIG.SUPABASE_ANON_KEY}`,
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    throw new CloudError(e?.name === 'AbortError' ? 'timeout' : 'network');
  } finally {
    clearTimeout(timer);
  }
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {}
  if (!res.ok) {
    const code = data?.error_code || data?.code || data?.error || `http_${res.status}`;
    throw new CloudError(String(code), data?.msg || data?.error_description || data?.message, res.status);
  }
  return data;
}

const redirect = () => (typeof location !== 'undefined' ? `?redirect_to=${encodeURIComponent(location.origin + location.pathname)}` : '');

export const cloud = {
  // ---------- Tài khoản ----------
  /** Đăng ký. Nếu dự án bật xác nhận email, kết quả không có access_token (chờ người dùng bấm link). */
  // data → user_metadata: ghi lại phiên bản chính sách người dùng đã đồng ý (Luật BVDLCN: phải chứng minh được sự đồng ý)
  signUp: (email, password, data = {}) => request('/auth/v1/signup', { method: 'POST', body: { email, password, data }, query: redirect() }),
  signIn: (email, password) => request('/auth/v1/token', { method: 'POST', body: { email, password }, query: '?grant_type=password' }),
  refresh: (refreshToken) => request('/auth/v1/token', { method: 'POST', body: { refresh_token: refreshToken }, query: '?grant_type=refresh_token' }),
  signOut: (token) => request('/auth/v1/logout', { method: 'POST', token }),
  recover: (email) => request('/auth/v1/recover', { method: 'POST', body: { email }, query: redirect() }),
  getUser: (token) => request('/auth/v1/user', { token }),
  updatePassword: (token, password) => request('/auth/v1/user', { method: 'PUT', token, body: { password } }),
  deleteAccount: (token) => request('/rest/v1/rpc/delete_my_account', { method: 'POST', token, body: {} }),

  // ---------- Dữ liệu cá nhân (1 dòng JSON cho mỗi người dùng) ----------
  async loadState(token, userId) {
    const rows = await request('/rest/v1/user_state', { token, query: `?user_id=eq.${encodeURIComponent(userId)}&select=data,updated_at` });
    return rows?.[0] || null;
  },
  saveState: (token, userId, data, updatedAt) =>
    request('/rest/v1/user_state', {
      method: 'POST',
      token,
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: { user_id: userId, data, updated_at: updatedAt },
    }),

  // ---------- Bài viết cộng đồng (kiểm duyệt trước khi hiện) ----------
  listApprovedPosts: (limit = 200) =>
    request('/rest/v1/posts', { query: `?status=eq.approved&select=id,topic,type,title,body,author,refs,hearts,created_at&order=created_at.desc&limit=${limit}` }),
  insertPost: (token, post) =>
    request('/rest/v1/posts', {
      method: 'POST',
      token,
      headers: { Prefer: 'return=minimal' },
      body: { id: post.id, user_id: post.userId, topic: post.topic, type: post.type, title: post.title, body: post.body, author: post.author, refs: post.refs, lang: post.lang },
    }),
};
