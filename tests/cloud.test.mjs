// Kiểm thử tài khoản + đồng bộ + offline với Supabase giả lập (tests/fake-supabase.mjs).
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createFakeSupabase } from './fake-supabase.mjs';

// Mỗi "thiết bị" là một localStorage riêng; có thể chuyển qua lại để mô phỏng 2 máy
const devices = { A: new Map(), B: new Map() };
let current = devices.A;
globalThis.localStorage = {
  getItem: (k) => (current.has(k) ? current.get(k) : null),
  setItem: (k, v) => current.set(k, String(v)),
  removeItem: (k) => current.delete(k),
};
let online = true;
Object.defineProperty(globalThis, 'navigator', { configurable: true, get: () => ({ onLine: online }) });

const fake = createFakeSupabase();
globalThis.fetch = fake.fetch;

const { CONFIG } = await import('../web/assets/js/config.js');
CONFIG.SUPABASE_URL = 'https://fake.supabase.co';
CONFIG.SUPABASE_ANON_KEY = 'anon-key';
const { store, mergeStates } = await import('../web/assets/js/store.js');
const { auth } = await import('../web/assets/js/auth.js');
const { errorText } = await import('../web/assets/js/views/account.js').catch(() => ({}));

const CONSENT = { version: CONFIG.CONSENT_VERSION };
const PROFILE = { day: 15, month: 8, year: 1995, timeKnown: true, hour: 9, minute: 30, gender: 'nu', placeId: 'ha-noi', lat: 21, lon: 105.8, tz: 7 };
const flush = () => new Promise((r) => setTimeout(r, 1700)); // chờ hẹn giờ đồng bộ (1,5 giây)

beforeEach(() => {
  online = true;
});

test('Khách dùng offline, rồi đăng ký: dữ liệu trên máy được chuyển vào tài khoản', async () => {
  current = devices.A;
  await store.init();
  store.setProfile(PROFILE);
  store.toggleSave('hd-001');
  assert.equal(auth.user(), null);

  assert.equal(await auth.signUp('lan@example.com', 'matkhau123', CONSENT), 'signed-in');
  await store.afterSignIn();
  const row = fake.db.userState.get(auth.user().id);
  assert.ok(row, 'đã có dòng user_state trên máy chủ');
  assert.equal(row.data.profile.year, 1995);
  assert.deepEqual(row.data.saved, ['hd-001']);
  assert.equal(store.syncState().status, 'synced');
  assert.equal(current.has('ansao:v2'), false, 'vùng dữ liệu khách đã được dọn');
});

test('Mất mạng: vẫn đăng nhập, vẫn đọc/ghi được; có mạng lại thì tự đẩy lên', async () => {
  current = devices.A;
  online = false;
  await store.init(); // mô phỏng mở lại web khi offline
  assert.equal(auth.user()?.email, 'lan@example.com', 'phiên được giữ trên máy');
  assert.equal(store.getProfile().year, 1995, 'dữ liệu tài khoản đọc được khi offline');
  store.setDraw('2026-11-06', { cardId: 'major-17', reversed: false, note: 'viết lúc offline' });
  await flush();
  assert.equal(store.syncState().status, 'offline');
  assert.equal(fake.db.userState.get(auth.user().id).data.draws['2026-11-06'], undefined, 'chưa lên máy chủ khi offline');

  online = true;
  await store.syncNow();
  assert.equal(fake.db.userState.get(auth.user().id).data.draws['2026-11-06'].note, 'viết lúc offline');
});

test('Máy thứ hai đăng nhập cùng tài khoản thì thấy đủ dữ liệu', async () => {
  current = devices.B;
  await store.init();
  assert.equal(store.getProfile(), null);
  await auth.signIn('lan@example.com', 'matkhau123');
  await store.afterSignIn();
  assert.equal(store.getProfile().year, 1995);
  assert.equal(store.getDraw('2026-11-06').note, 'viết lúc offline');
  assert.ok(store.isSaved('hd-001'));
});

test('Hai máy cùng sửa khi offline → gộp, không mất dữ liệu bên nào', async () => {
  current = devices.B;
  online = false;
  store.toggleSave('hd-005');
  await flush();
  current = devices.A;
  await store.init();
  store.toggleSave('hd-010');
  await flush();
  online = true;
  await store.syncNow(); // A đẩy lên trước
  current = devices.B;
  await store.init(); // B có thay đổi chưa đẩy + máy chủ đã đổi → gộp
  await store.syncNow();
  const saved = fake.db.userState.get(auth.user().id).data.saved;
  for (const id of ['hd-001', 'hd-005', 'hd-010']) assert.ok(saved.includes(id), id);
});

test('Gieo bài khi đăng nhập → gửi lên ở trạng thái chờ duyệt; duyệt xong thì mọi người thấy', async () => {
  current = devices.A;
  await store.init();
  const p = store.addPost({ id: crypto.randomUUID(), topic: 'tarot', type: 'chia-se', title: 'Thử', body: 'Một bài viết thử nghiệm đủ dài.', author: 'Lan', refs: [], createdAt: new Date().toISOString(), hearts: 0 });
  await flush();
  assert.equal(fake.db.posts.length, 1);
  assert.equal(fake.db.posts[0].status, 'pending');
  assert.equal(store.postStatus(p.id), 'pending');
  fake.approveAll();
  await store.refreshCommunity();
  assert.ok(store.allPosts().some((x) => x.id === p.id));
});

test('Token hết hạn thì tự làm mới', async () => {
  current = devices.A;
  await store.init();
  const s = JSON.parse(current.get('ansao:session'));
  s.expiresAt = Math.floor(Date.now() / 1000) - 10;
  current.set('ansao:session', JSON.stringify(s));
  auth.load();
  const tok = await auth.token();
  assert.notEqual(tok, s.accessToken);
  assert.ok(fake.log.some((l) => l.includes('grant_type=refresh_token')));
});

test('RLS: người khác không đọc được dữ liệu của mình', async () => {
  const other = await fake.fetch('https://fake.supabase.co/auth/v1/signup', { method: 'POST', headers: { apikey: 'x' }, body: JSON.stringify({ email: 'khac@example.com', password: 'abcdefgh' }) });
  const tok = JSON.parse(await other.text()).access_token;
  const lan = [...fake.db.users.values()].find((u) => u.email === 'lan@example.com');
  const res = await fake.fetch(`https://fake.supabase.co/rest/v1/user_state?user_id=eq.${lan.id}`, { headers: { apikey: 'x', Authorization: `Bearer ${tok}` } });
  assert.deepEqual(JSON.parse(await res.text()), []);
});

test('Đăng xuất: xoá bản sao dữ liệu tài khoản khỏi máy, quay về chế độ khách', async () => {
  current = devices.A;
  await store.init();
  const id = auth.user().id;
  await store.signOut();
  assert.equal(auth.user(), null);
  assert.equal(current.has(`ansao:v2:u:${id}`), false);
  assert.equal(store.getProfile(), null);
});

test('Sai mật khẩu và email đã tồn tại báo lỗi thân thiện', async () => {
  await assert.rejects(auth.signIn('lan@example.com', 'sai'), (e) => e.code === 'invalid_credentials');
  await assert.rejects(auth.signUp('lan@example.com', 'matkhau123', CONSENT), (e) => e.code === 'user_already_exists');
  if (errorText) assert.ok(errorText({ code: 'invalid_credentials' }).length > 5);
});

const tokenOf = async (email, password) =>
  JSON.parse(await (await fake.fetch('https://fake.supabase.co/auth/v1/token?grant_type=password', { method: 'POST', headers: { apikey: 'x' }, body: JSON.stringify({ email, password }) })).text()).access_token;
const openLink = async (hash) => {
  globalThis.location = { hash, pathname: '/' };
  globalThis.history = { replaceState() {} };
  try {
    return await auth.consumeRedirect();
  } finally {
    delete globalThis.location;
    delete globalThis.history;
  }
};

test('Link chứa token mà trình duyệt này không yêu cầu thì bị từ chối, dữ liệu khách không bị gửi đi', async () => {
  current = new Map();
  await store.init();
  store.setProfile(PROFILE);
  const token = await tokenOf('lan@example.com', 'matkhau123');
  assert.equal(await openLink(`#access_token=${token}&refresh_token=x&type=signup`), 'error');
  assert.equal(auth.user(), null, 'không bị đăng nhập vào tài khoản lạ');
  assert.equal(store.getProfile().year, 1995, 'dữ liệu khách vẫn ở nguyên trên máy');
});

test('Link đặt lại mật khẩu do chính trình duyệt này yêu cầu thì dùng được đúng một lần', async () => {
  current = new Map();
  await store.init();
  await auth.recover('lan@example.com');
  const token = await tokenOf('lan@example.com', 'matkhau123');
  assert.equal(await openLink(`#access_token=${token}&refresh_token=x&type=recovery`), 'recovery');
  assert.equal(auth.user()?.email, 'lan@example.com');
  await auth.signOut();
  assert.equal(await openLink(`#access_token=${token}&refresh_token=x&type=recovery`), 'error', 'không dùng lại được');
});

test('Xoá tài khoản: xoá trên máy chủ và xoá cả bản sao trên máy này', async () => {
  current = new Map();
  await store.init();
  await auth.signUp('xoa@example.com', 'matkhau123', CONSENT);
  await store.afterSignIn();
  store.setProfile(PROFILE);
  const id = auth.user().id;
  assert.equal(current.has(`ansao:v2:u:${id}`), true);
  await store.deleteAccount();
  assert.equal(auth.user(), null);
  assert.equal(fake.db.users.has('xoa@example.com'), false);
  assert.equal(current.has(`ansao:v2:u:${id}`), false, 'không còn ngày giờ sinh trên máy');
  assert.equal(store.getProfile(), null);
});

test('mergeStates hợp danh sách và ưu tiên hồ sơ mới hơn', () => {
  const a = { saved: ['x'], touched: [], myPosts: [], draws: { d1: { cardId: 'a' } }, profile: { day: 1, month: 1, year: 2000 }, updatedAt: '2026-01-01' };
  const b = { saved: ['y'], touched: ['t'], myPosts: [], draws: { d2: { cardId: 'b' } }, profile: { day: 2, month: 2, year: 2002 }, updatedAt: '2026-02-01' };
  const m = mergeStates(a, b);
  assert.deepEqual(m.saved.sort(), ['x', 'y']);
  assert.deepEqual(Object.keys(m.draws).sort(), ['d1', 'd2']);
  assert.equal(m.profile.year, 2002);
});

test('Luật BVDLCN: chưa đồng ý chính sách thì không gửi gì lên máy chủ; đồng ý thì lưu lại phiên bản và thời điểm', async () => {
  current = devices.A;
  const before = fake.db.users.size;
  await assert.rejects(auth.signUp('chua@example.com', 'matkhau123'), (e) => e.code === 'consent_required');
  await assert.rejects(auth.signUp('chua@example.com', 'matkhau123', {}), (e) => e.code === 'consent_required');
  assert.equal(fake.db.users.size, before, 'không tạo tài khoản khi chưa đồng ý');
  await auth.signUp('dongy@example.com', 'matkhau123', CONSENT);
  const u = fake.db.users.get('dongy@example.com');
  assert.equal(u.meta.consent_version, CONFIG.CONSENT_VERSION);
  assert.ok(!Number.isNaN(Date.parse(u.meta.consent_at)));
  await auth.signOut?.();
});

test('Đăng nhập Google (PKCE): đổi mã thành phiên, ghi dấu đồng ý; link giả mạo hay mã bị lộ đều không vào được', async () => {
  current = devices.B;
  await auth.signOut();
  const page = { origin: 'https://graviti.test', pathname: '/stars/tarot/', search: '', hash: '', opened: null };
  globalThis.location = { ...page, assign: (u) => (globalThis.location.opened = u) };
  Object.assign(globalThis.location, page);
  globalThis.history = { replaceState: (_s, _t, url) => Object.assign(globalThis.location, { search: '', hash: '', pathname: url }) };

  // Chưa tích đồng ý thì không rời trang
  await assert.rejects(auth.startOAuth('google'), (e) => e.code === 'consent_required');
  assert.equal(location.opened, null);

  await auth.startOAuth('google', CONSENT);
  const url = new URL(location.opened);
  assert.equal(url.origin + url.pathname, 'https://fake.supabase.co/auth/v1/authorize');
  assert.equal(url.searchParams.get('provider'), 'google');
  assert.equal(url.searchParams.get('redirect_to'), 'https://graviti.test/stars/tarot/', 'quay về đúng trang đang xem');
  assert.equal(url.searchParams.get('code_challenge_method'), 's256');
  const raw = current.get('ansao:oauth');
  assert.ok(raw && !location.opened.includes(JSON.parse(raw).verifier), 'verifier chỉ nằm trên máy, không gửi đi');

  // Mã thật quay về, cùng trình duyệt → đăng nhập được, tài khoản mới có dấu đồng ý
  location.search = '?code=' + fake.oauthCode('google@example.com', url.searchParams.get('code_challenge'));
  assert.equal(await auth.consumeRedirect(), 'oauth');
  assert.equal(auth.user()?.email, 'google@example.com');
  assert.equal(location.search, '', 'mã đã được xoá khỏi thanh địa chỉ');
  assert.equal(location.pathname, '/stars/tarot/', 'ở nguyên trang đang xem, không bị đẩy sang trang Tài khoản');
  assert.equal(fake.db.users.get('google@example.com').meta.consent_version, CONFIG.CONSENT_VERSION);
  assert.equal(current.has('ansao:oauth'), false, 'verifier dùng một lần');
  await auth.signOut();

  // Kẻ xấu gửi link chứa mã tài khoản của họ: trình duyệt nạn nhân không có verifier → không đăng nhập
  location.search = '?code=' + fake.oauthCode('ke-xau@example.com', 'challenge-cua-ke-xau');
  assert.equal(await auth.consumeRedirect(), 'oauth-error');
  assert.equal(auth.user(), null);

  // Có verifier nhưng mã không khớp challenge (mã của người khác) → máy chủ từ chối
  await auth.startOAuth('google', CONSENT);
  location.search = '?code=' + fake.oauthCode('ke-xau@example.com', 'challenge-khac');
  assert.equal(await auth.consumeRedirect(), 'oauth-error');
  assert.equal(auth.user(), null);

  // Người dùng bấm Huỷ ở Google
  await auth.startOAuth('google', CONSENT);
  location.search = '?error=access_denied&error_description=cancelled';
  assert.equal(await auth.consumeRedirect(), 'oauth-error');
  assert.equal(auth.user(), null);
  delete globalThis.location;
  delete globalThis.history;
});
