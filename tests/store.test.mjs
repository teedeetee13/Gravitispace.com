// Kiểm thử kho dữ liệu: di chuyển dữ liệu v1 → v2, xuất/nhập, xoá.
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// localStorage giả lập cho Node
const mem = new Map();
globalThis.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k),
};

const { store, migrate, normalizeProfile } = await import('../web/assets/js/store.js');

beforeEach(() => mem.clear());

test('Di chuyển dữ liệu v1 (có beforeTet) sang v2', async () => {
  mem.set('ansao:v1', JSON.stringify({ saved: ['hd-001'], touched: [], myPosts: [], draws: {}, profile: { day: 5, month: 2, year: 1990, beforeTet: true } }));
  await store.init();
  assert.equal(store.isSaved('hd-001'), true);
  assert.deepEqual(
    { d: store.getProfile().day, m: store.getProfile().month, y: store.getProfile().year, tk: store.getProfile().timeKnown },
    { d: 5, m: 2, y: 1990, tk: false }
  );
  assert.ok(mem.has('ansao:v2'));
});

test('normalizeProfile loại bỏ dữ liệu sai', () => {
  assert.equal(normalizeProfile(null), null);
  assert.equal(normalizeProfile({ day: 1 }), null);
  const p = normalizeProfile({ day: '3', month: '4', year: '2001', timeKnown: true, hour: '7', minute: '30', gender: 'x', lat: '', lon: null });
  assert.deepEqual([p.hour, p.minute, p.gender, p.lat, p.lon, p.tz], [7, 30, null, null, null, 7]);
});

test('Xuất rồi nhập lại giữ nguyên dữ liệu; tệp lạ bị từ chối', async () => {
  await store.init();
  store.toggleSave('hd-002');
  store.setDraw('2026-11-06', { cardId: 'major-17', reversed: false, note: 'bình yên' });
  const json = store.exportData();
  store.clearAll();
  assert.equal(store.isSaved('hd-002'), false);
  assert.equal(store.importData(json), true);
  assert.equal(store.isSaved('hd-002'), true);
  assert.equal(store.getDraw('2026-11-06').note, 'bình yên');
  assert.equal(store.importData(JSON.stringify({ app: 'khac', data: {} })), false);
  assert.equal(migrate({}).schema, 2);
});

test('Đổi tên Graviti Stars: tệp xuất mang tên mới, tệp xuất từ An Sao Space cũ vẫn nạp được', async () => {
  await store.init();
  store.toggleSave('hd-003');
  const json = store.exportData();
  assert.equal(JSON.parse(json).app, 'graviti-stars');
  const old = JSON.stringify({ ...JSON.parse(json), app: 'an-sao-space' });
  store.clearAll();
  assert.equal(store.importData(old), true);
  assert.equal(store.isSaved('hd-003'), true);
});
