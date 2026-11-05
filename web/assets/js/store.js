// Lưu trữ cục bộ (localStorage). Khi có máy chủ, chỉ cần thay phần này
// bằng các lời gọi API — giao diện phía trên không phải sửa.
import { SEED_POSTS } from './data/posts.js';

const KEY = 'huuduyen:v1';

const defaults = () => ({
  myPosts: [], // bài người dùng tự gieo
  saved: [], // id bài đã cất vào tủ
  touched: [], // id bài đã "chạm"
  draws: {}, // { 'YYYY-MM-DD': { cardId, reversed, note } }
  profile: null, // { day, month, year, beforeTet }
});

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...defaults(), ...JSON.parse(raw) };
  } catch {}
  return defaults();
}

const state = load();
const persist = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
};

const toggleIn = (list, id) => {
  const i = list.indexOf(id);
  if (i >= 0) list.splice(i, 1);
  else list.unshift(id);
  persist();
  return i < 0;
};

export const store = {
  allPosts: () => [...state.myPosts, ...SEED_POSTS],
  getPost: (id) => state.myPosts.find((p) => p.id === id) || SEED_POSTS.find((p) => p.id === id),
  myPosts: () => state.myPosts,
  addPost(post) {
    state.myPosts.unshift(post);
    persist();
  },
  isMine: (id) => state.myPosts.some((p) => p.id === id),

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
    state.profile = p;
    persist();
  },
};
