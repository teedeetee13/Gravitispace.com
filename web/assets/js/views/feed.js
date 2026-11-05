// Lướt duyên — bảng tin cuộn từng trang, thứ tự ngẫu nhiên ("hữu duyên")
import { esc, icon, paragraphs, shuffle, todayKey } from '../util.js';
import { store } from '../store.js';
import { TOPICS, topicById } from '../data/taxonomy.js';
import { cardById } from '../data/tarot.js';
import { postActions, postMeta, refChips } from '../ui.js';

const MAX_ROUNDS = 6;

function slide(p) {
  return `<article class="slide" style="--c:${topicById[p.topic]?.color}" data-id="${p.id}">
    <div class="slide-inner">
      ${postMeta(p)}
      ${p.title ? `<h2 class="slide-title">${esc(p.title)}</h2>` : ''}
      <div class="slide-body prose">${paragraphs(p.body)}</div>
      ${p.refs?.length ? `<div class="chips">${refChips(p.refs)}</div>` : ''}
      <p class="author">— ${esc(p.author)}</p>
      ${postActions(p)}
    </div>
  </article>`;
}

function introSlide(topic) {
  const draw = store.getDraw(todayKey());
  const card = draw && cardById[draw.cardId];
  const d = new Date();
  const today = card
    ? `<a class="intro-today" href="#/tarot">Lá bài hôm nay của bạn: <strong>${esc(card.name)}</strong>${draw.reversed ? ' (ngược)' : ''} ${icon('arrow')}</a>`
    : `<a class="btn btn-ghost" href="#/tarot">${icon('card')} Rút lá bài hôm nay</a>`;
  return `<article class="slide slide-intro">
    <div class="slide-inner center">
      <p class="eyebrow">Ngày ${d.getDate()} tháng ${d.getMonth() + 1}${topic ? ` · ${esc(topicById[topic].label)}` : ''}</p>
      <h1 class="display">Bài viết nào đến với bạn, là duyên.</h1>
      <p class="lead">Lướt xuống thật chậm. Mỗi trang là vài dòng ai đó để lại về Tarot, chiêm tinh, tử vi, và về những ngày khó khăn họ đã đi qua.</p>
      ${today}
      <span class="scroll-hint" aria-hidden="true">${icon('down')} Lướt xuống</span>
    </div>
  </article>`;
}

const endSlide = () => `<article class="slide slide-intro">
  <div class="slide-inner center">
    <p class="eyebrow">Hết một vòng duyên</p>
    <h2 class="display">Bạn đã gặp hết những dòng chữ đang có ở đây.</h2>
    <p class="lead">Có điều gì bạn muốn để lại cho người lướt sau không?</p>
    <a class="btn" href="#/gieo">${icon('plus')} Gieo một bài</a>
    <span class="scroll-hint" aria-hidden="true">${icon('down')} Hoặc lướt tiếp một vòng mới</span>
  </div>
</article>`;

export function renderFeed(view, params) {
  document.body.classList.add('is-feed');
  const topic = topicById[params.get('chu-de')] ? params.get('chu-de') : '';
  const pool = store.allPosts().filter((p) => !topic || p.topic === topic);

  const tabs = [{ id: '', label: 'Tất cả' }, ...TOPICS]
    .map((t) => `<a class="ftab ${t.id === topic ? 'on' : ''}" href="#/${t.id ? `?chu-de=${t.id}` : ''}" ${t.id === topic ? 'aria-current="page"' : ''}>${esc(t.label)}</a>`)
    .join('');

  view.innerHTML = `<div class="feed-wrap">
    <nav class="feed-tabs" aria-label="Lọc theo chủ đề">${tabs}</nav>
    <section class="feed" tabindex="0" aria-label="Lướt duyên">${introSlide(topic)}</section>
  </div>`;

  const feed = view.querySelector('.feed');
  let round = 0;
  let lastId = null;

  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        appendRound();
      }
    },
    { root: feed, rootMargin: '0px 0px 200% 0px' }
  );

  function appendRound() {
    if (round >= MAX_ROUNDS || !pool.length) return;
    let deck = shuffle(pool);
    if (deck.length > 1 && deck[0].id === lastId) deck.push(deck.shift()); // tránh lặp ngay bài vừa đọc
    lastId = deck[deck.length - 1].id;
    feed.insertAdjacentHTML('beforeend', deck.map(slide).join('') + endSlide());
    round++;
    io.observe(feed.lastElementChild);
  }

  appendRound();
  feed.focus({ preventScroll: true });
}
