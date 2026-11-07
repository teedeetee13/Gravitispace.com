// Supabase giả lập trong bộ nhớ: mô phỏng các endpoint Auth (/auth/v1) và PostgREST (/rest/v1) mà web dùng,
// kèm quy tắc RLS chính (chỉ đọc/ghi dữ liệu của chính mình, bài mới phải ở trạng thái pending).
// Dùng cho kiểm thử tự động (tests/cloud.test.mjs) và kiểm thử giao diện trên trình duyệt.
import { randomUUID } from 'node:crypto';

export function createFakeSupabase({ confirmEmail = false, tokenTtl = 3600 } = {}) {
  const db = { users: new Map(), tokens: new Map(), refresh: new Map(), userState: new Map(), posts: [] };
  const log = [];

  const json = (status, body) => ({ status, body });
  const userOf = (headers) => {
    const tok = (headers.authorization || headers.Authorization || '').replace('Bearer ', '');
    const t = db.tokens.get(tok);
    return t && t.exp > Date.now() / 1000 ? db.users.get(t.email) : null;
  };
  const issue = (u) => {
    const access = 'at_' + randomUUID();
    const refresh = 'rt_' + randomUUID();
    const exp = Math.floor(Date.now() / 1000) + tokenTtl;
    db.tokens.set(access, { email: u.email, exp });
    db.refresh.set(refresh, u.email);
    return { access_token: access, refresh_token: refresh, expires_in: tokenTtl, expires_at: exp, token_type: 'bearer', user: { id: u.id, email: u.email } };
  };

  function handle(method, path, query, headers, body) {
    log.push(`${method} ${path}${query ? '?' + query : ''}`);
    const q = new URLSearchParams(query);
    if (!headers.apikey) return json(401, { message: 'No API key found in request' });

    if (path === '/auth/v1/signup' && method === 'POST') {
      if (db.users.has(body.email)) return json(422, { code: 422, error_code: 'user_already_exists', msg: 'User already registered' });
      if (String(body.password).length < 6) return json(422, { error_code: 'weak_password', msg: 'weak' });
      const u = { id: randomUUID(), email: body.email, password: body.password, confirmed: !confirmEmail };
      db.users.set(body.email, u);
      return confirmEmail ? json(200, { id: u.id, email: u.email, confirmation_sent_at: new Date().toISOString() }) : json(200, issue(u));
    }
    if (path === '/auth/v1/token' && method === 'POST') {
      if (q.get('grant_type') === 'password') {
        const u = db.users.get(body.email);
        if (!u || u.password !== body.password) return json(400, { error_code: 'invalid_credentials', msg: 'Invalid login credentials' });
        if (!u.confirmed) return json(400, { error_code: 'email_not_confirmed', msg: 'Email not confirmed' });
        return json(200, issue(u));
      }
      if (q.get('grant_type') === 'refresh_token') {
        const email = db.refresh.get(body.refresh_token);
        if (!email) return json(400, { error_code: 'refresh_token_not_found', msg: 'Invalid Refresh Token' });
        db.refresh.delete(body.refresh_token);
        return json(200, issue(db.users.get(email)));
      }
    }
    if (path === '/auth/v1/logout' && method === 'POST') return json(204, null);
    if (path === '/auth/v1/recover' && method === 'POST') return json(200, {});
    if (path === '/auth/v1/user') {
      const u = userOf(headers);
      if (!u) return json(401, { error_code: 'bad_jwt', msg: 'invalid JWT' });
      if (method === 'PUT') u.password = body.password;
      return json(200, { id: u.id, email: u.email });
    }
    if (path === '/rest/v1/rpc/delete_my_account' && method === 'POST') {
      const u = userOf(headers);
      if (!u) return json(401, { message: 'not authenticated' });
      db.users.delete(u.email);
      db.userState.delete(u.id);
      db.posts = db.posts.filter((p) => p.user_id !== u.id);
      return json(204, null);
    }
    if (path === '/rest/v1/user_state') {
      const u = userOf(headers);
      if (method === 'GET') {
        const id = (q.get('user_id') || '').replace('eq.', '');
        const row = u && u.id === id ? db.userState.get(id) : null; // RLS: chỉ thấy dòng của mình
        return json(200, row ? [row] : []);
      }
      if (method === 'POST') {
        if (!u || body.user_id !== u.id) return json(403, { code: '42501', message: 'new row violates row-level security policy' });
        db.userState.set(u.id, { user_id: u.id, data: body.data, updated_at: body.updated_at });
        return json(201, null);
      }
    }
    if (path === '/rest/v1/posts') {
      const u = userOf(headers);
      if (method === 'GET') return json(200, db.posts.filter((p) => p.status === 'approved' || (u && p.user_id === u.id)));
      if (method === 'POST') {
        if (!u || body.user_id !== u.id) return json(403, { code: '42501', message: 'new row violates row-level security policy' });
        db.posts.push({ ...body, status: 'pending', hearts: 0, created_at: new Date().toISOString() });
        return json(201, null);
      }
    }
    return json(404, { message: 'not found' });
  }

  /** Thay thế fetch toàn cục. */
  const fetch = async (url, opts = {}) => {
    const u = new URL(url);
    const r = handle(opts.method || 'GET', u.pathname, u.search.slice(1), opts.headers || {}, opts.body ? JSON.parse(opts.body) : undefined);
    return { ok: r.status < 400, status: r.status, text: async () => (r.body === null ? '' : JSON.stringify(r.body)) };
  };

  return { db, log, handle, fetch, confirm: (email) => (db.users.get(email).confirmed = true), approveAll: () => db.posts.forEach((p) => (p.status = 'approved')) };
}
