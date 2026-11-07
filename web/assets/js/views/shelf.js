// Tủ của tôi: bài đã cất, bài đã gieo, nhật ký lá bài, quản lý dữ liệu cá nhân (xuất / nhập / xoá)
import { $, esc, icon, toast } from '../util.js';
import { t, fmtDate } from '../i18n.js';
import { store } from '../store.js';
import { cardById } from '../data/tarot.js';
import * as C from '../content.js';
import { emptyState, postCard, tarotFace } from '../ui.js';

const TABS = ['da-cat', 'da-gieo', 'nhat-ky', 'du-lieu'];

function tabContent(tab) {
  if (tab === 'da-gieo') {
    const list = store.myPosts();
    return list.length
      ? `<div class="post-grid">${list.map(postCard).join('')}</div>`
      : emptyState(t('shelf.noPosts'), t('shelf.noPostsBody'), `<a class="btn" href="#/gieo">${icon('plus')} ${t('shelf.firstPost')}</a>`);
  }
  if (tab === 'nhat-ky') {
    const list = store.allDraws();
    return list.length
      ? `<ul class="journal">${list
          .map(([date, d]) => {
            const raw = cardById[d.cardId];
            if (!raw) return '';
            const c = C.card(raw);
            const [y, m, day] = date.split('-').map(Number);
            return `<li><a href="#/tarot/${c.id}" class="journal-card" aria-label="${esc(c.name)}">${tarotFace(raw, { size: 'xs', reversed: d.reversed })}</a>
              <div><p class="eyebrow">${fmtDate(new Date(y, m - 1, day))}</p><h3>${esc(c.name)}${d.reversed ? ` <span class="tag">${t('tarot.reversed')}</span>` : ''}</h3>
              <p class="muted">${esc(c.q)}</p>${d.note ? `<blockquote>${esc(d.note)}</blockquote>` : ''}</div></li>`;
          })
          .join('')}</ul>`
      : emptyState(t('shelf.noJournal'), t('shelf.noJournalBody'), `<a class="btn" href="#/tarot">${icon('card')} ${t('feed.drawToday')}</a>`);
  }
  if (tab === 'du-lieu') {
    return `<div class="reading-card">
      <h3>${t('shelf.dataTitle')}</h3>
      <p>${t('shelf.dataBody')}</p>
      <div class="row">
        <button class="btn" type="button" data-export>${icon('down')} ${t('shelf.export')}</button>
        <label class="btn btn-ghost file-btn">${icon('share')} ${t('shelf.import')}<input type="file" accept="application/json,.json" data-import hidden /></label>
      </div>
      <hr />
      <h3>${t('shelf.clearTitle')}</h3>
      <p class="muted">${t('shelf.clearBody')}</p>
      <button class="btn btn-ghost btn-danger" type="button" data-clear>${icon('close')} ${t('shelf.clear')}</button>
    </div>`;
  }
  const list = store.savedPosts();
  return list.length
    ? `<div class="post-grid">${list.map(postCard).join('')}</div>`
    : emptyState(t('shelf.empty'), t('shelf.emptyBody'), `<a class="btn" href="#/">${icon('waves')} ${t('shelf.goFeed')}</a>`);
}

export function renderShelf(view, params) {
  const tab = TABS.includes(params.get('tab')) ? params.get('tab') : 'da-cat';
  view.innerHTML = `<div class="page">
    <header class="page-head">
      <p class="eyebrow">${t('nav.shelf')}</p>
      <h1>${t('shelf.title')}</h1>
    </header>
    <nav class="tabs" aria-label="${esc(t('shelf.tabsAria'))}">${TABS.map((id) => `<a href="#/tu?tab=${id}" class="${id === tab ? 'on' : ''}" ${id === tab ? 'aria-current="page"' : ''}>${t(`shelf.tab.${id}`)}</a>`).join('')}</nav>
    ${tabContent(tab)}
  </div>`;

  // Trên điện thoại thanh mục cuộn ngang: đưa mục đang mở vào tầm nhìn
  const active = $('.tabs .on', view);
  if (active) active.parentElement.scrollLeft = active.offsetLeft - 16;

  if (tab !== 'du-lieu') return;
  $('[data-export]', view).addEventListener('click', () => {
    const blob = new Blob([store.exportData()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `huu-duyen-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast(t('shelf.exported'));
  });
  $('[data-import]', view).addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (file.size > 2_000_000 || !store.importData(await file.text())) throw new Error('invalid');
      toast(t('shelf.imported'));
      window.dispatchEvent(new Event('huuduyen:draw'));
    } catch {
      toast(t('shelf.importFail'));
    }
  });
  $('[data-clear]', view).addEventListener('click', () => {
    if (!confirm(t('shelf.clearConfirm'))) return;
    store.clearAll();
    window.dispatchEvent(new Event('huuduyen:draw'));
    toast(t('shelf.cleared'));
  });
}
