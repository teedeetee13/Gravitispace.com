// Điểm khởi động: khởi tạo ngôn ngữ + kho dữ liệu, điều hướng theo #đường-dẫn (tải lười từng trang),
// xử lý các nút dùng chung, bắt lỗi toàn cục, đăng ký service worker để chạy offline.
import { $, $$, esc, toast, todayKey } from './util.js';
import { t, getLang, setLang, LANGS } from './i18n.js';
import { langMeta } from './i18n/langs.js';
import { store } from './store.js';
import { auth } from './auth.js';
import { cardById } from './data/tarot.js';
import * as C from './content.js';
import { emptyState } from './ui.js';

// [mẫu đường dẫn, tải module, tên hàm vẽ, tiêu đề]
// Đường dẫn cụ thể (la-so, ban-do-sao) đặt trước đường dẫn có tham số.
const ROUTES = [
  [/^\/$/, () => import('./views/feed.js'), 'renderFeed', 'nav.feed'],
  [/^\/tim$/, () => import('./views/search.js'), 'renderSearch', 'nav.search'],
  [/^\/tarot$/, () => import('./views/tarot.js'), 'renderTarot', 'nav.tarot'],
  [/^\/tarot\/([\w-]+)$/, () => import('./views/tarot.js'), 'renderTarotCard', (id) => (cardById[id] ? C.card(cardById[id]).name : '')],
  [/^\/chiem-tinh$/, () => import('./views/astro.js'), 'renderAstro', 'nav.astro'],
  [/^\/chiem-tinh\/ban-do-sao$/, () => import('./views/natal.js'), 'renderNatal', 'natal.title'],
  [/^\/chiem-tinh\/([\w-]+)$/, () => import('./views/astro.js'), 'renderSign', 'nav.astro'],
  [/^\/tu-vi$/, () => import('./views/tuvi.js'), 'renderTuvi', 'nav.tuvi'],
  [/^\/tu-vi\/la-so$/, () => import('./views/laso.js'), 'renderLaso', 'laso.title'],
  [/^\/tu-vi\/([\w-]+)$/, () => import('./views/tuvi.js'), 'renderChi', 'nav.tuvi'],
  [/^\/ban-menh$/, () => import('./views/profile.js'), 'renderProfile', 'nav.profile'],
  [/^\/gieo$/, () => import('./views/compose.js'), 'renderCompose', 'nav.compose'],
  [/^\/tu$/, () => import('./views/shelf.js'), 'renderShelf', 'nav.shelf'],
  [/^\/bai\/([\w-]+)$/, () => import('./views/post.js'), 'renderPost', (id) => (store.getPost(id) ? C.post(store.getPost(id)).title || t('post.title') : '')],
  [/^\/ve$/, () => import('./views/about.js'), 'renderAbout', 'nav.about'],
  [/^\/tai-khoan$/, () => import('./views/account.js'), 'renderAccount', 'nav.account'],
];

function parseHash() {
  // Dạng: #/duong-dan?tham=so#neo
  const raw = location.hash.slice(1) || '/';
  const [beforeAnchor, anchor] = raw.split('#');
  const [path, query] = beforeAnchor.split('?');
  return { path: path || '/', params: new URLSearchParams(query || ''), anchor };
}

let navToken = 0;

async function render() {
  const token = ++navToken;
  const { path, params, anchor } = parseHash();
  const view = $('#view');
  view.setAttribute('aria-busy', 'true');

  const root = document.createElement('div');
  root.className = 'view-root';

  let title = '';
  let ok = false;
  try {
    for (const [re, load, fnName, tt] of ROUTES) {
      const m = path.match(re);
      if (!m) continue;
      const mod = await load();
      if (token !== navToken) return; // người dùng đã chuyển trang khác trong lúc tải
      document.body.classList.remove('is-feed');
      view.replaceChildren(root);
      const res = m[1] ? mod[fnName](root, m[1], params) : mod[fnName](root, params);
      ok = res !== false;
      title = typeof tt === 'function' ? tt(m[1]) : t(tt);
      break;
    }
  } catch (err) {
    console.error(err);
    if (token !== navToken) return;
    document.body.classList.remove('is-feed');
    view.replaceChildren(root);
    root.innerHTML = `<div class="page narrow">${emptyState(t('error.title'), t('error.body'), `<a class="btn" href="#/">${t('error.home')}</a>`)}</div>`;
    ok = true;
    title = t('error.title');
  }
  if (!ok) {
    document.body.classList.remove('is-feed');
    view.replaceChildren(root);
    root.innerHTML = `<div class="page narrow">${emptyState(t('notFound.title'), t('notFound.body'), `<a class="btn" href="#/">${t('notFound.home')}</a>`)}</div>`;
    title = t('notFound.short');
  }
  document.title = title ? `${title} · Hữu Duyên` : 'Hữu Duyên';
  view.removeAttribute('aria-busy');

  // Đánh dấu mục điều hướng đang mở
  const section = '/' + (path.split('/')[1] || '');
  $$('[data-nav]').forEach((a) => {
    const on = a.dataset.nav === section;
    a.classList.toggle('on', on);
    on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
  });

  if (anchor) document.getElementById(anchor)?.scrollIntoView();
  else window.scrollTo(0, 0);
  if (!document.body.classList.contains('is-feed')) view.focus({ preventScroll: true });
  renderTodayWidget();
}

function renderTodayWidget() {
  const el = $('#today-widget');
  const draw = store.getDraw(todayKey());
  const card = draw && cardById[draw.cardId] && C.card(cardById[draw.cardId]);
  el.innerHTML = card
    ? `<span class="eyebrow">${t('today.label')}</span><strong>${esc(card.name)}</strong><span class="small">${esc(card.q)}</span>`
    : `<span class="eyebrow">${t('today.label')}</span><strong>${t('today.none')}</strong><span class="small">${t('today.cta')}</span>`;
}

/** Dịch phần khung tĩnh trong index.html (thuộc tính data-i18n, data-i18n-aria). */
function translateShell() {
  $$('[data-i18n]').forEach((el) => (el.textContent = t(el.dataset.i18n)));
  $$('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
  const cur = langMeta(getLang());
  $$('[data-lang-select]').forEach((sel) => {
    if (!sel.options.length)
      sel.innerHTML = LANGS.map((l) => `<option value="${l.code}" lang="${l.html}">${esc(l.native)}</option>`).join('');
    sel.value = cur.code;
  });
  $$('[data-lang-label]').forEach((el) => (el.textContent = cur.short));
  $$('[data-lang-native]').forEach((el) => (el.textContent = cur.native));
  const og = document.querySelector('meta[property="og:locale"]');
  if (og) og.content = cur.og;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = t('meta.description');
  renderAccountBadge();
}

/* ---------- Chọn ngôn ngữ (ô chọn gốc của hệ điều hành: dễ dùng trên điện thoại, đọc được bằng trình đọc màn hình) ---------- */
document.addEventListener('change', async (e) => {
  const sel = e.target.closest('[data-lang-select]');
  if (!sel || sel.value === getLang()) return;
  try {
    await setLang(sel.value);
  } catch {
    sel.value = getLang();
    toast(t('error.toast'));
    return;
  }
  translateShell();
  await render();
  toast(t('lang.changed'));
});

/* ---------- Các nút dùng chung (chạm, cất, gửi, đổi theme, đổi ngôn ngữ) ---------- */
document.addEventListener('click', async (e) => {
  if (e.target.closest('[data-skip]')) {
    e.preventDefault();
    $('#view').focus();
    return;
  }
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const { action, id } = btn.dataset;

  if (action === 'theme') {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try {
      localStorage.setItem('huuduyen:theme', root.dataset.theme);
    } catch {}
    return;
  }

  const raw = id && store.getPost(id);
  if (!raw) return;
  const post = C.post(raw);

  if (action === 'touch') {
    const on = store.toggleTouch(id);
    $$(`[data-action="touch"][data-id="${CSS.escape(id)}"]`).forEach((b) => {
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on);
      b.querySelector('.act-count').textContent = store.hearts(post);
      if (on) {
        b.classList.remove('pop');
        void b.offsetWidth;
        b.classList.add('pop');
      }
    });
  }

  if (action === 'save') {
    const on = store.toggleSave(id);
    $$(`[data-action="save"][data-id="${CSS.escape(id)}"]`).forEach((b) => {
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on);
      b.querySelector('span').textContent = on ? t('post.saved') : t('post.save');
    });
    toast(on ? t('post.savedToast') : t('post.unsavedToast'));
  }

  if (action === 'share') {
    const url = `${location.origin}${location.pathname}#/bai/${id}`;
    const text = post.title || post.body.slice(0, 80);
    try {
      if (navigator.share) await navigator.share({ title: 'Hữu Duyên', text, url });
      else {
        await navigator.clipboard.writeText(url);
        toast(t('post.copied'));
      }
    } catch (err) {
      if (err?.name !== 'AbortError') toast(t('post.copyFail'));
    }
  }
});

/* ---------- Ảnh lá bài lỗi (mất mạng, chưa lưu đệm) → hiện hình vẽ SVG thay thế ---------- */
document.addEventListener(
  'error',
  (e) => {
    const img = e.target;
    if (img instanceof HTMLImageElement && img.hasAttribute('data-fallback')) img.closest('.tcard')?.classList.remove('has-img');
  },
  true
);

/* ---------- Bắt lỗi toàn cục: báo nhẹ nhàng thay vì để trang trắng ---------- */
window.addEventListener('error', (e) => {
  console.error(e.error || e.message);
  toast(t('error.toast'));
});
window.addEventListener('unhandledrejection', (e) => {
  console.error(e.reason);
  toast(t('error.toast'));
});

window.addEventListener('hashchange', render);
window.addEventListener('huuduyen:draw', renderTodayWidget);

/** Chấm trạng thái tài khoản trên nút Tài khoản (xanh: đã đồng bộ, vàng: đang chờ/offline). */
function renderAccountBadge() {
  const user = auth.user();
  const s = store.syncState().status;
  $$('[data-account-badge]').forEach((el) => {
    el.className = `account-badge ${user ? `is-${s}` : ''}`;
    el.hidden = !user;
  });
  $$('[data-account-label]').forEach((el) => (el.textContent = user ? user.email : t('nav.account')));
}

// Đăng nhập / đăng xuất: vẽ lại trang hiện tại theo dữ liệu của tài khoản mới
window.addEventListener('huuduyen:auth', () => {
  renderAccountBadge();
  renderTodayWidget();
  if (location.hash.startsWith('#/tai-khoan') && location.hash !== '#/tai-khoan') location.hash = '#/tai-khoan';
  else render();
});
// Có mạng trở lại → đồng bộ những gì đã sửa lúc offline
window.addEventListener('online', () => {
  if (auth.user()) store.syncNow().catch(() => {});
  store.refreshCommunity().catch(() => {});
});
window.addEventListener('offline', () => auth.user() && store.syncNow().catch(() => {}));

async function boot() {
  const redirectType = await auth.consumeRedirect().catch(() => null);
  await Promise.all([setLang().catch(() => setLang('vi')), store.init()]); // gói ngôn ngữ lỗi mạng → về tiếng Việt
  if (redirectType && redirectType !== 'error') await store.afterSignIn();
  if (redirectType === 'recovery') history.replaceState(null, '', `${location.pathname}#/tai-khoan?dat-lai=1`);
  store.onSync(renderAccountBadge);
  translateShell();
  renderAccountBadge();
  await render();
  if (redirectType === 'error') toast(t('account.linkExpired'));
  else if (redirectType && redirectType !== 'recovery') toast(t('account.welcome'));
  // Service worker: cho phép mở lại trang khi mất mạng (chỉ chạy qua https hoặc localhost)
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}
boot();
