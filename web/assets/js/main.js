// Điểm khởi động: khởi tạo ngôn ngữ + kho dữ liệu, điều hướng theo đường dẫn thật /stars/… (tải lười từng trang),
// xử lý các nút dùng chung, bắt lỗi toàn cục, đăng ký service worker để chạy offline.
import { $, $$, esc, toast, todayKey } from './util.js';
import { ROOT, link, navigate, postLink, currentRoute, fromLegacyHash } from './route.js';
import { t, getLang, setLang, LANGS } from './i18n.js';
import { langMeta } from './i18n/langs.js';
import { store } from './store.js';
import { auth } from './auth.js';
import { cardById } from './data/tarot.js';
import * as C from './content.js';
import { emptyState } from './ui.js';
import { redirectMessageKey } from './login.js';
import { showLogin } from './signin.js';
import { cloudEnabled } from './config.js';

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
  [/^\/bai\/([\w-]+)$/, () => import('./views/post.js'), 'renderPost', (id) => postTitle(id)],
  // Bài người dùng gửi: /bai/?id=<mã> (mã ngẫu nhiên nên không dựng sẵn trang riêng được)
  [/^\/bai$/, () => import('./views/post.js'), 'renderPost', (id) => postTitle(id), (params) => params.get('id')],
  [/^\/ve$/, () => import('./views/about.js'), 'renderAbout', 'nav.about'],
  [/^\/tai-khoan$/, () => import('./views/account.js'), 'renderAccount', 'nav.account'],
];

function postTitle(id) {
  const p = id && store.getPost(id);
  return p ? C.post(p).title || t('post.title') : '';
}

let navToken = 0;

async function render() {
  const token = ++navToken;
  const { path, params, anchor } = currentRoute();
  const view = $('#view');
  view.setAttribute('aria-busy', 'true');

  const root = document.createElement('div');
  root.className = 'view-root';

  let title = '';
  let ok = false;
  try {
    for (const [re, load, fnName, tt, paramOf] of ROUTES) {
      const m = path.match(re);
      if (!m) continue;
      const arg = m[1] ?? paramOf?.(params);
      if (paramOf && !arg) continue;
      const mod = await load();
      if (token !== navToken) return; // người dùng đã chuyển trang khác trong lúc tải
      document.body.classList.remove('is-feed');
      view.replaceChildren(root);
      const res = arg ? mod[fnName](root, arg, params) : mod[fnName](root, params);
      ok = res !== false;
      title = typeof tt === 'function' ? tt(arg) : t(tt);
      break;
    }
  } catch (err) {
    console.error(err);
    if (token !== navToken) return;
    document.body.classList.remove('is-feed');
    view.replaceChildren(root);
    root.innerHTML = `<div class="page narrow">${emptyState(t('error.title'), t('error.body'), `<a class="btn" href="${link(``)}">${t('error.home')}</a>`)}</div>`;
    ok = true;
    title = t('error.title');
  }
  if (!ok) {
    document.body.classList.remove('is-feed');
    view.replaceChildren(root);
    root.innerHTML = `<div class="page narrow">${emptyState(t('notFound.title'), t('notFound.body'), `<a class="btn" href="${link(``)}">${t('notFound.home')}</a>`)}</div>`;
    title = t('notFound.short');
  }
  document.title = title ? `${title} · Graviti Stars` : 'Graviti Stars';
  view.removeAttribute('aria-busy');

  // Đánh dấu mục điều hướng đang mở
  const section = '/' + (path.split('/')[1] || '');
  $$('[data-nav]').forEach((a) => {
    const on = a.dataset.nav === section;
    a.classList.toggle('on', on);
    on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
  });

  if (anchor && !anchor.startsWith('/')) document.getElementById(anchor)?.scrollIntoView();
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
  // Link cố định trong khung trang: đổi sang địa chỉ đầy đủ (đúng ở mọi độ sâu, vd. /stars/tarot/major-17/)
  $$('a[data-link]').forEach((el) => el.setAttribute('href', link(el.dataset.link)));
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
      localStorage.setItem('ansao:theme', root.dataset.theme);
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
    const url = location.origin + postLink(id);
    const text = post.title || post.body.slice(0, 80);
    try {
      if (navigator.share) await navigator.share({ title: 'Graviti Stars', text, url });
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

// Chuyển trang không tải lại: bấm link nội bộ → đổi địa chỉ (history API) → vẽ trang mới. Nút Back/Forward cũng vậy.
window.addEventListener('popstate', render);
window.addEventListener('ansao:navigate', render);
document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest('a[href]');
  if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || !url.pathname.startsWith(ROOT)) return; // trang chính, /privacy/, web ngoài: mở bình thường
  if (/\.[a-z0-9]+$/i.test(url.pathname)) return; // tệp (ảnh, json…)
  // Nút Tài khoản: chưa đăng nhập → hộp đăng nhập hiện ngay trên trang đang xem, không chuyển trang
  if (url.pathname === link('tai-khoan') && !auth.user() && cloudEnabled()) {
    e.preventDefault();
    return showLogin(new URLSearchParams(url.search).get('che-do') === 'dang-ky' ? 'signup' : 'signin');
  }
  if (url.pathname === location.pathname && url.search === location.search && url.hash) return; // neo trong cùng trang
  e.preventDefault();
  if (url.href !== location.href) history.pushState(null, '', url.pathname + url.search + url.hash);
  render();
});
window.addEventListener('ansao:draw', renderTodayWidget);

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
window.addEventListener('ansao:auth', () => {
  renderAccountBadge();
  renderTodayWidget();
  if (currentRoute().path === '/tai-khoan' && location.search) navigate('tai-khoan', { replace: true });
  else render();
});
// Có mạng trở lại → đồng bộ những gì đã sửa lúc offline
window.addEventListener('online', () => {
  if (auth.user()) store.syncNow().catch(() => {});
  store.refreshCommunity().catch(() => {});
});
window.addEventListener('offline', () => auth.user() && store.syncNow().catch(() => {}));

/** Link kiểu cũ và link từ trang 404 → đổi về địa chỉ mới trước khi vẽ (không tải lại trang). */
function normalizeUrl() {
  // Chốt địa chỉ tệp trong <head> (manifest, biểu tượng) theo địa chỉ lúc tải trang, trước khi đổi địa chỉ:
  // trình duyệt có thể tải các tệp này muộn, khi đó đường dẫn tương đối sẽ bị tính theo địa chỉ mới.
  document.querySelectorAll('head link[href]').forEach((el) => el.setAttribute('href', el.href));
  const legacy = fromLegacyHash(location.hash);
  if (legacy) return history.replaceState(null, '', legacy);
  // 404.html chuyển đường dẫn lạ về /stars/?p=<đường-dẫn>: thử mở nó như một trang trong ứng dụng
  const p = location.pathname === ROOT ? new URLSearchParams(location.search).get('p') : null;
  if (p) history.replaceState(null, '', link(p.replace(/^\/+/, '')));
}

async function boot() {
  normalizeUrl();
  const redirectType = await auth.consumeRedirect().catch(() => null);
  await Promise.all([setLang().catch(() => setLang('vi')), store.init()]); // gói ngôn ngữ lỗi mạng → về tiếng Việt
  const failed = redirectType === 'error' || redirectType === 'oauth-error';
  // Vừa quay về từ Google / email, hoặc đã đăng nhập ở trang chính Graviti mà máy này chưa có dữ liệu của tài khoản:
  // gộp dữ liệu khách trên máy vào tài khoản (không mất gì)
  if ((redirectType && !failed) || store.pendingMerge) await store.afterSignIn();
  store.onSync(renderAccountBadge);
  translateShell();
  renderAccountBadge();
  await render();
  const msg = redirectMessageKey(redirectType);
  if (msg) toast(t(msg));
  if (redirectType === 'recovery') showLogin('newpass'); // link đặt lại mật khẩu: hộp đặt mật khẩu mới, ở nguyên trang
  // Service worker: cho phép mở lại trang khi mất mạng (chỉ bản đăng thật qua https).
  // Khi chạy thử trên máy thì gỡ service worker cũ + xoá bộ nhớ đệm của nó, để luôn thấy code mới nhất
  // và không "đè" lên các web khác từng chạy ở cùng địa chỉ localhost.
  const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    if (isLocal) {
      navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister())).catch(() => {});
      if ('caches' in window) caches.keys().then((ks) => ks.forEach((k) => caches.delete(k))).catch(() => {});
    } else navigator.serviceWorker.register(ROOT + 'sw.js', { scope: ROOT }).catch(() => {});
  }
}
boot();
