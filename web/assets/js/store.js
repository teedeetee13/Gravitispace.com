// Kho dữ liệu (Repository). Giao diện chỉ gọi các hàm của `store`, không đụng trực tiếp localStorage hay API.
//
// Mô hình "local-first":
//  - Mọi đọc/ghi diễn ra tức thì trên bộ nhớ và được lưu xuống máy (chạy được cả khi mất mạng).
//  - Khách (chưa đăng nhập): dữ liệu chỉ ở máy này.
//  - Đã đăng nhập: dữ liệu gắn với tài khoản, đồng bộ lên Supabase (bảng user_state) sau mỗi thay đổi,
//    khi mở web và khi có mạng trở lại. Mỗi tài khoản có vùng lưu riêng trên máy.
//  - Bài viết gieo khi đã đăng nhập được gửi lên bảng posts ở trạng thái "chờ duyệt".
import { CONFIG, cloudEnabled } from './config.js';
import { SEED_POSTS } from './data/posts.js';
import { auth } from './auth.js';
import { cloud } from './cloud.js';

const P = CONFIG.STORAGE_PREFIX;
const GUEST_KEY = P + 'v2';
const LEGACY_KEY = P + 'v1';
const REMOTE_POSTS_KEY = P + 'remote-posts';
const SCHEMA = 2;
const PUSH_DELAY = 1500;

const defaults = () => ({
  schema: SCHEMA,
  myPosts: [], // bài người dùng tự gieo { …, status: 'local' | 'pending' | 'approved' }
  saved: [], // id bài đã cất vào tủ
  touched: [], // id bài đã "chạm"
  draws: {}, // { 'YYYY-MM-DD': { cardId, reversed, note } }
  profile: null, // xem normalizeProfile()
  prefs: {}, // tuỳ chọn cá nhân, ví dụ { tuviSchool: 'thai-thu-lang' }
  updatedAt: null, // lần sửa gần nhất (ISO)
  dirty: false, // có thay đổi chưa gửi lên tài khoản
  lastSyncedAt: null, // thời điểm bản trên máy chủ khớp với bản trên máy
});

/** Hồ sơ ngày sinh. Giờ/nơi sinh có thể bỏ trống. */
export function normalizeProfile(p) {
  if (!p || !p.day || !p.month || !p.year) return null;
  const num = (v) => (v !== null && v !== undefined && v !== '' && Number.isFinite(Number(v)) ? Number(v) : null);
  return {
    day: Number(p.day),
    month: Number(p.month),
    year: Number(p.year),
    timeKnown: !!p.timeKnown,
    hour: p.timeKnown ? Number(p.hour) : null,
    minute: p.timeKnown ? Number(p.minute || 0) : null,
    gender: p.gender === 'nam' || p.gender === 'nu' ? p.gender : null,
    placeId: p.placeId || null,
    lat: num(p.lat),
    lon: num(p.lon),
    tz: num(p.tz) ?? 7,
  };
}

/** Chuyển dữ liệu từ phiên bản cũ (v1) sang v2. */
export function migrate(old) {
  const s = { ...defaults(), ...old, schema: SCHEMA };
  s.profile = normalizeProfile(old?.profile);
  return s;
}

const union = (a = [], b = []) => [...new Set([...a, ...b])];

/**
 * Gộp hai bản dữ liệu khi cả máy và tài khoản cùng có thay đổi (hoặc khi khách đăng nhập lần đầu).
 * Danh sách được hợp lại (không mất gì), nhật ký và hồ sơ ưu tiên bản mới hơn.
 */
export function mergeStates(a, b) {
  const [newer, older] = (a.updatedAt || '') >= (b.updatedAt || '') ? [a, b] : [b, a];
  const posts = new Map();
  for (const p of [...(older.myPosts || []), ...(newer.myPosts || [])]) {
    const prev = posts.get(p.id);
    posts.set(p.id, prev && prev.status !== 'local' && p.status === 'local' ? prev : p);
  }
  return {
    ...defaults(),
    myPosts: [...posts.values()].sort((x, y) => (x.createdAt < y.createdAt ? 1 : -1)),
    saved: union(newer.saved, older.saved),
    touched: union(newer.touched, older.touched),
    draws: { ...(older.draws || {}), ...(newer.draws || {}) },
    profile: normalizeProfile(newer.profile) || normalizeProfile(older.profile),
    prefs: { ...(older.prefs || {}), ...(newer.prefs || {}) },
    updatedAt: newer.updatedAt || older.updatedAt || null,
  };
}

const keyFor = (user) => (user ? `${P}v2:u:${user.id}` : GUEST_KEY);

function readLocal(key) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return { ...defaults(), ...JSON.parse(raw) };
    if (key === GUEST_KEY) {
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        const s = migrate(JSON.parse(legacy));
        localStorage.setItem(GUEST_KEY, JSON.stringify(s));
        return s;
      }
    }
  } catch {}
  return defaults();
}

let state = defaults();
let remotePosts = [];
let pushTimer = null;
let sync = { status: 'local', at: null }; // local | syncing | synced | offline | error
const syncListeners = new Set();

const setSync = (status) => {
  sync = { status, at: status === 'synced' ? new Date().toISOString() : sync.at };
  syncListeners.forEach((fn) => fn(sync));
};
const writeLocal = () => {
  try {
    localStorage.setItem(keyFor(auth.user()), JSON.stringify(state));
  } catch {}
};
/** Ghi lại sau mỗi thay đổi: lưu xuống máy, đánh dấu cần đồng bộ, hẹn gửi lên tài khoản. */
const persist = () => {
  state.updatedAt = new Date().toISOString();
  state.dirty = true;
  writeLocal();
  if (auth.user() && cloudEnabled()) {
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => store.syncNow().catch(() => {}), PUSH_DELAY);
  }
};

const toggleIn = (list, id) => {
  const i = list.indexOf(id);
  if (i >= 0) list.splice(i, 1);
  else list.unshift(id);
  persist();
  return i < 0;
};

const isOnline = () => typeof navigator === 'undefined' || navigator.onLine !== false;

/** Đọc bản sao (không kèm cờ nội bộ) để lưu lên máy chủ. */
const payload = () => ({ schema: SCHEMA, myPosts: state.myPosts, saved: state.saved, touched: state.touched, draws: state.draws, profile: state.profile, prefs: state.prefs || {} });

export const store = {
  /** Khởi tạo: đọc phiên + dữ liệu trên máy (chạy offline), rồi đồng bộ nếu có mạng. */
  async init() {
    auth.load();
    // Đã đăng nhập (vd. ở trang chính Graviti) nhưng máy này chưa có bản sao dữ liệu của tài khoản → main.js gọi afterSignIn()
    store.pendingMerge = false;
    try {
      store.pendingMerge = !!auth.user() && localStorage.getItem(keyFor(auth.user())) === null;
    } catch {}
    state = readLocal(keyFor(auth.user()));
    try {
      remotePosts = JSON.parse(localStorage.getItem(REMOTE_POSTS_KEY) || '[]');
    } catch {
      remotePosts = [];
    }
    setSync(auth.user() ? (isOnline() ? 'syncing' : 'offline') : 'local');
    if (cloudEnabled() && isOnline()) {
      // Không chặn quá 3 giây lúc mở web; phần còn lại chạy nền
      const work = Promise.allSettled([auth.user() ? store.syncNow() : null, store.refreshCommunity()]);
      await Promise.race([work, new Promise((r) => setTimeout(r, 3000))]);
    }
  },

  // ---------- Bài viết ----------
  allPosts: () => {
    const mine = new Set(state.myPosts.map((p) => p.id));
    return [...state.myPosts, ...remotePosts.filter((p) => !mine.has(p.id)), ...SEED_POSTS];
  },
  getPost: (id) => state.myPosts.find((p) => p.id === id) || remotePosts.find((p) => p.id === id) || SEED_POSTS.find((p) => p.id === id),
  myPosts: () => state.myPosts,
  /** Thêm bài; đã đăng nhập thì gửi lên chờ duyệt (lỗi mạng → giữ "local", lần đồng bộ sau gửi lại). */
  addPost(post) {
    const user = auth.user();
    const p = { ...post, status: 'local', ...(user ? { userId: user.id } : {}) };
    state.myPosts.unshift(p);
    persist();
    if (user && cloudEnabled()) store.uploadPending().catch(() => {});
    return p;
  },
  isMine: (id) => state.myPosts.some((p) => p.id === id),
  postStatus: (id) => state.myPosts.find((p) => p.id === id)?.status || null,

  isSaved: (id) => state.saved.includes(id),
  toggleSave: (id) => toggleIn(state.saved, id),
  savedPosts: () => state.saved.map((id) => store.getPost(id)).filter(Boolean),

  isTouched: (id) => state.touched.includes(id),
  toggleTouch: (id) => toggleIn(state.touched, id),
  hearts: (p) => (p.hearts || 0) + (state.touched.includes(p.id) ? 1 : 0),

  getDraw: (key) => state.draws[key],
  setDraw(key, draw) {
    state.draws[key] = { ...state.draws[key], ...draw };
    persist();
  },
  allDraws: () => Object.entries(state.draws).sort((a, b) => (a[0] < b[0] ? 1 : -1)),

  getProfile: () => state.profile,
  setProfile(p) {
    state.profile = normalizeProfile(p);
    persist();
  },

  getPref: (key) => state.prefs?.[key],
  setPref(key, value) {
    state.prefs = { ...(state.prefs || {}), [key]: value };
    persist();
  },

  // ---------- Đồng bộ tài khoản ----------
  syncState: () => sync,
  onSync(fn) {
    syncListeners.add(fn);
    return () => syncListeners.delete(fn);
  },

  /**
   * Đồng bộ với tài khoản:
   *  - Máy chưa sửa gì → lấy bản trên tài khoản.
   *  - Chỉ máy sửa → gửi bản trên máy lên.
   *  - Cả hai cùng sửa (ví dụ dùng 2 máy khi offline) → gộp (mergeStates) rồi gửi lên.
   */
  async syncNow() {
    const user = auth.user();
    if (!user || !cloudEnabled()) return setSync('local');
    if (!isOnline()) return setSync('offline');
    setSync('syncing');
    try {
      const token = await auth.token();
      const remote = await cloud.loadState(token, user.id);
      const remoteChanged = remote && (!state.lastSyncedAt || remote.updated_at > state.lastSyncedAt);
      if (remote && remoteChanged && !state.dirty) {
        state = { ...defaults(), ...remote.data, profile: normalizeProfile(remote.data?.profile), updatedAt: remote.updated_at };
      } else if (remote && remoteChanged && state.dirty) {
        state = mergeStates(state, { ...remote.data, updatedAt: remote.updated_at });
        state.updatedAt = new Date().toISOString();
        state.dirty = true;
      }
      if (state.dirty || !remote) {
        const at = state.updatedAt || new Date().toISOString();
        await cloud.saveState(token, user.id, payload(), at);
        state.updatedAt = at;
      }
      state.dirty = false;
      state.lastSyncedAt = state.updatedAt;
      writeLocal();
      await store.uploadPending();
      setSync('synced');
    } catch (e) {
      setSync(e?.code === 'offline' || e?.code === 'network' || e?.code === 'timeout' ? 'offline' : 'error');
      throw e;
    }
  },

  /** Gửi các bài "local" của tài khoản lên bảng posts (trạng thái chờ duyệt). */
  async uploadPending() {
    const user = auth.user();
    if (!user || !cloudEnabled()) return;
    const pending = state.myPosts.filter((p) => p.status === 'local');
    if (!pending.length) return;
    const token = await auth.token();
    for (const p of pending) {
      await cloud.insertPost(token, { ...p, userId: user.id, lang: p.lang || 'vi' });
      p.status = 'pending';
    }
    persist();
  },

  /** Tải các bài cộng đồng đã duyệt (lưu đệm trên máy để xem offline). */
  async refreshCommunity() {
    if (!cloudEnabled() || !isOnline()) return;
    const rows = await cloud.listApprovedPosts();
    remotePosts = (rows || []).map((r) => ({ id: r.id, topic: r.topic, type: r.type, title: r.title, body: r.body, author: r.author, refs: r.refs || [], hearts: r.hearts || 0, createdAt: r.created_at }));
    try {
      localStorage.setItem(REMOTE_POSTS_KEY, JSON.stringify(remotePosts));
    } catch {}
  },

  /** Sau khi đăng nhập: dữ liệu khách trên máy này được gộp vào tài khoản (không mất gì), rồi đồng bộ. */
  async afterSignIn() {
    const guest = readLocal(GUEST_KEY);
    const mine = readLocal(keyFor(auth.user()));
    const hasGuestData = guest.myPosts.length || guest.saved.length || guest.touched.length || Object.keys(guest.draws).length || guest.profile;
    state = hasGuestData ? { ...mergeStates(mine, guest), dirty: true, lastSyncedAt: mine.lastSyncedAt } : mine;
    state.myPosts.forEach((p) => p.status === 'local' && (p.userId = auth.user().id));
    writeLocal();
    try {
      localStorage.removeItem(GUEST_KEY);
      localStorage.removeItem(LEGACY_KEY);
    } catch {}
    await store.syncNow().catch(() => {});
  },

  /** Đăng xuất: xoá bản sao dữ liệu của tài khoản khỏi máy này (riêng tư trên máy dùng chung). */
  async signOut() {
    const user = auth.user();
    if (user && state.dirty) await store.syncNow().catch(() => {});
    await auth.signOut();
    try {
      if (user) localStorage.removeItem(keyFor(user));
    } catch {}
    state = readLocal(GUEST_KEY);
    setSync('local');
  },

  /** Xoá tài khoản trên máy chủ, rồi xoá luôn bản sao của tài khoản đó trên máy này. */
  async deleteAccount() {
    const user = auth.user();
    clearTimeout(pushTimer);
    await auth.deleteAccount();
    try {
      if (user) localStorage.removeItem(keyFor(user));
    } catch {}
    state = readLocal(GUEST_KEY);
    setSync('local');
  },

  // ---------- Quyền sở hữu dữ liệu ----------
  /** Tải dữ liệu của tôi về máy (mang sang máy khác, lưu trữ riêng). */
  exportData: () => JSON.stringify({ app: 'graviti-stars', exportedAt: new Date().toISOString(), data: payload() }, null, 2),
  /** Nạp lại dữ liệu đã xuất. Trả về true nếu hợp lệ. */
  importData(json) {
    const parsed = JSON.parse(json);
    if (!['graviti-stars', 'an-sao-space', 'huu-duyen'].includes(parsed?.app) || typeof parsed.data !== 'object' || !parsed.data) return false;
    const d = parsed.data;
    if (!Array.isArray(d.myPosts) || !Array.isArray(d.saved) || !Array.isArray(d.touched) || typeof d.draws !== 'object') return false;
    const keep = { lastSyncedAt: state.lastSyncedAt };
    state = d.schema === SCHEMA ? { ...defaults(), ...d, profile: normalizeProfile(d.profile), ...keep } : { ...migrate(d), ...keep };
    persist();
    return true;
  },
  /** Xoá toàn bộ dữ liệu cá nhân trên máy này (và trên tài khoản nếu đang đăng nhập). */
  clearAll() {
    const keep = { lastSyncedAt: state.lastSyncedAt };
    state = { ...defaults(), ...keep };
    try {
      localStorage.removeItem(GUEST_KEY);
      localStorage.removeItem(LEGACY_KEY);
    } catch {}
    if (auth.user()) persist();
  },
};
