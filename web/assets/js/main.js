// Điểm khởi động: điều hướng theo #đường-dẫn, xử lý các nút dùng chung
import { $, $$, esc, toast, todayKey } from './util.js';
import { store } from './store.js';
import { cardById } from './data/tarot.js';
import { renderFeed } from './views/feed.js';
import { renderSearch } from './views/search.js';
import { renderTarot, renderTarotCard } from './views/tarot.js';
import { renderAstro, renderSign } from './views/astro.js';
import { renderTuvi, renderChi } from './views/tuvi.js';
import { renderProfile } from './views/profile.js';
import { renderCompose } from './views/compose.js';
import { renderShelf } from './views/shelf.js';
import { renderPost } from './views/post.js';
import { renderAbout } from './views/about.js';
import { emptyState } from './ui.js';

const ROUTES = [
  [/^\/$/, renderFeed, 'Lướt duyên'],
  [/^\/tim$/, renderSearch, 'Tìm kiếm'],
  [/^\/tarot$/, renderTarot, 'Tarot'],
  [/^\/tarot\/([\w-]+)$/, renderTarotCard, (id) => cardById[id]?.name],
  [/^\/chiem-tinh$/, renderAstro, 'Chiêm tinh'],
  [/^\/chiem-tinh\/([\w-]+)$/, renderSign, 'Chiêm tinh'],
  [/^\/tu-vi$/, renderTuvi, 'Tử vi'],
  [/^\/tu-vi\/([\w-]+)$/, renderChi, 'Tử vi'],
  [/^\/ban-menh$/, renderProfile, 'Bản mệnh của tôi'],
  [/^\/gieo$/, renderCompose, 'Gieo duyên'],
  [/^\/tu$/, renderShelf, 'Tủ của tôi'],
  [/^\/bai\/([\w-]+)$/, renderPost, (id) => store.getPost(id)?.title || 'Bài viết'],
  [/^\/ve$/, renderAbout, 'Về Hữu Duyên'],
];

function parseHash() {
  // Dạng: #/duong-dan?tham=so#neo
  const raw = location.hash.slice(1) || '/';
  const [beforeAnchor, anchor] = raw.split('#');
  const [path, query] = beforeAnchor.split('?');
  return { path: path || '/', params: new URLSearchParams(query || ''), anchor };
}

function render() {
  const { path, params, anchor } = parseHash();
  const view = $('#view');
  document.body.classList.remove('is-feed');

  // Mỗi lần chuyển trang tạo một khung mới, để trình xử lý sự kiện của trang cũ bị bỏ theo
  const root = document.createElement('div');
  root.className = 'view-root';
  view.replaceChildren(root);

  let title = '';
  let ok = false;
  for (const [re, fn, t] of ROUTES) {
    const m = path.match(re);
    if (!m) continue;
    const res = m[1] ? fn(root, m[1], params) : fn(root, params);
    ok = res !== false;
    title = typeof t === 'function' ? t(m[1]) : t;
    break;
  }
  if (!ok) {
    root.innerHTML = `<div class="page narrow">${emptyState('Lạc đường rồi.', 'Trang này không có ở đây. Nhưng lạc đường đôi khi cũng là duyên.', '<a class="btn" href="#/">Về trang lướt duyên</a>')}</div>`;
    title = 'Không tìm thấy';
  }
  document.title = title ? `${title} · Hữu Duyên` : 'Hữu Duyên';

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
  const card = draw && cardById[draw.cardId];
  el.innerHTML = card
    ? `<span class="eyebrow">Lá bài hôm nay</span><strong>${esc(card.name)}</strong><span class="small">${esc(card.q)}</span>`
    : `<span class="eyebrow">Lá bài hôm nay</span><strong>Chưa rút</strong><span class="small">Chạm để rút một lá cho ngày hôm nay.</span>`;
}

/* ---------- Các nút dùng chung (chạm, cất, gửi, đổi theme) ---------- */
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

  const post = id && store.getPost(id);
  if (!post) return;

  if (action === 'touch') {
    const on = store.toggleTouch(id);
    $$(`[data-action="touch"][data-id="${id}"]`).forEach((b) => {
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
    $$(`[data-action="save"][data-id="${id}"]`).forEach((b) => {
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on);
      b.querySelector('span').textContent = on ? 'Đã cất' : 'Cất';
    });
    toast(on ? 'Đã cất vào tủ' : 'Đã bỏ khỏi tủ');
  }

  if (action === 'share') {
    const url = `${location.origin}${location.pathname}#/bai/${id}`;
    const text = post.title || post.body.slice(0, 80);
    try {
      if (navigator.share) await navigator.share({ title: 'Hữu Duyên', text, url });
      else {
        await navigator.clipboard.writeText(url);
        toast('Đã chép đường dẫn. Gửi duyên cho ai đó nhé.');
      }
    } catch (err) {
      if (err?.name !== 'AbortError') toast('Không chép được, bạn thử lại nhé.');
    }
  }
});

window.addEventListener('hashchange', render);
window.addEventListener('huuduyen:draw', renderTodayWidget);
render();
