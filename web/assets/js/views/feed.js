// Lướt duyên — bảng tin cuộn từng trang, thứ tự ngẫu nhiên ("gặp là duyên")
import { esc, icon, paragraphs, shuffle, todayKey } from '../util.js';
import { t } from '../i18n.js';
import { store } from '../store.js';
import { TOPICS, topicById } from '../data/taxonomy.js';
import { cardById } from '../data/tarot.js';
import * as C from '../content.js';
import { postActions, postMeta, refChips } from '../ui.js';
import { cover } from '../cover.js';

const MAX_ROUNDS = 6;

function slide(raw) {
  const p = C.post(raw);
  return `<article class="slide has-art" style="--c:${topicById[p.topic]?.color}" data-id="${esc(p.id)}">
    <div class="slide-art">${cover(p, 'tall')}</div>
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
  const card = draw && cardById[draw.cardId] && C.card(cardById[draw.cardId]);
  const d = new Date();
  const today = card
    ? `<a class="intro-today" href="#/tarot">${t('feed.todayCard')} <strong>${esc(card.name)}</strong>${draw.reversed ? ` (${t('tarot.reversedShort')})` : ''} ${icon('arrow')}</a>`
    : `<a class="btn btn-ghost" href="#/tarot">${icon('card')} ${t('feed.drawToday')}</a>`;
  return `<article class="slide slide-intro">
    <div class="slide-inner center">
      <p class="eyebrow">${t('feed.date', { d: d.getDate(), m: d.getMonth() + 1 })}${topic ? ` · ${esc(C.topicLabel(topicById[topic]))}` : ''}</p>
      <h1 class="display">${t('feed.headline')}</h1>
      <p class="lead">${t('feed.lead')}</p>
      ${today}
      <span class="scroll-hint" aria-hidden="true">${icon('down')} ${t('feed.scroll')}</span>
    </div>
  </article>`;
}

const endSlide = () => `<article class="slide slide-intro">
  <div class="slide-inner center">
    <p class="eyebrow">${t('feed.endEyebrow')}</p>
    <h2 class="display">${t('feed.endTitle')}</h2>
    <p class="lead">${t('feed.endLead')}</p>
    <a class="btn" href="#/gieo">${icon('plus')} ${t('feed.seed')}</a>
    <span class="scroll-hint" aria-hidden="true">${icon('down')} ${t('feed.again')}</span>
  </div>
</article>`;

export function renderFeed(view, params) {
  document.body.classList.add('is-feed');
  const topic = topicById[params.get('chu-de')] ? params.get('chu-de') : '';
  const pool = store.allPosts().filter((p) => !topic || p.topic === topic);

  const tabs = [{ id: '', label: t('common.all') }, ...TOPICS.map((tp) => ({ ...tp, label: C.topicLabel(tp) }))]
    .map((tp) => `<a class="ftab ${tp.id === topic ? 'on' : ''}" href="#/${tp.id ? `?chu-de=${tp.id}` : ''}" ${tp.id === topic ? 'aria-current="page"' : ''}>${esc(tp.label)}</a>`)
    .join('');

  view.innerHTML = `<div class="feed-wrap">
    <nav class="feed-tabs" aria-label="${esc(t('feed.filter'))}">${tabs}</nav>
    <section class="feed" tabindex="0" aria-label="${esc(t('nav.feed'))}">${introSlide(topic)}</section>
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
    const deck = shuffle(pool);
    if (deck.length > 1 && deck[0].id === lastId) deck.push(deck.shift()); // tránh lặp ngay bài vừa đọc
    lastId = deck[deck.length - 1].id;
    feed.insertAdjacentHTML('beforeend', deck.map(slide).join('') + endSlide());
    round++;
    io.observe(feed.lastElementChild);
  }

  appendRound();
  feed.focus({ preventScroll: true });
}
