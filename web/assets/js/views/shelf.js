// Tủ của tôi: bài đã cất, bài đã gieo, nhật ký lá bài
import { esc, icon } from '../util.js';
import { store } from '../store.js';
import { cardById } from '../data/tarot.js';
import { emptyState, postCard, tarotFace } from '../ui.js';

const TABS = [
  { id: 'da-cat', label: 'Đã cất' },
  { id: 'da-gieo', label: 'Bài tôi gieo' },
  { id: 'nhat-ky', label: 'Nhật ký lá bài' },
];

function tabContent(tab) {
  if (tab === 'da-gieo') {
    const list = store.myPosts();
    return list.length
      ? `<div class="post-grid">${list.map(postCard).join('')}</div>`
      : emptyState('Bạn chưa gieo bài nào.', 'Một dòng chữ của bạn có thể đến với ai đó đúng lúc họ cần.', `<a class="btn" href="#/gieo">${icon('plus')} Gieo bài đầu tiên</a>`);
  }
  if (tab === 'nhat-ky') {
    const list = store.allDraws();
    return list.length
      ? `<ul class="journal">${list
          .map(([date, d]) => {
            const c = cardById[d.cardId];
            if (!c) return '';
            const [y, m, day] = date.split('-');
            return `<li><a href="#/tarot/${c.id}" class="journal-card">${tarotFace(c, { size: 'xs', reversed: d.reversed })}</a>
              <div><p class="eyebrow">${Number(day)}/${Number(m)}/${y}</p><h3>${esc(c.name)}${d.reversed ? ' <span class="tag">Ngược</span>' : ''}</h3>
              <p class="muted">${esc(c.q)}</p>${d.note ? `<blockquote>${esc(d.note)}</blockquote>` : ''}</div></li>`;
          })
          .join('')}</ul>`
      : emptyState('Nhật ký còn trống.', 'Mỗi ngày rút một lá, ghi một dòng, rồi nhìn lại sau một tháng.', `<a class="btn" href="#/tarot">${icon('card')} Rút lá bài hôm nay</a>`);
  }
  const list = store.savedPosts();
  return list.length
    ? `<div class="post-grid">${list.map(postCard).join('')}</div>`
    : emptyState('Tủ còn trống.', 'Khi lướt gặp bài nào chạm đến bạn, bấm "Cất" để giữ lại đây.', `<a class="btn" href="#/">${icon('waves')} Đi lướt duyên</a>`);
}

export function renderShelf(view, params) {
  const tab = TABS.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'da-cat';
  view.innerHTML = `<div class="page">
    <header class="page-head">
      <p class="eyebrow">Tủ của tôi</p>
      <h1>Những gì bạn muốn giữ lại.</h1>
    </header>
    <nav class="tabs" aria-label="Mục trong tủ">${TABS.map((t) => `<a href="#/tu?tab=${t.id}" class="${t.id === tab ? 'on' : ''}" ${t.id === tab ? 'aria-current="page"' : ''}>${t.label}</a>`).join('')}</nav>
    ${tabContent(tab)}
  </div>`;
}
