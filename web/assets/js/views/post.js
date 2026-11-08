// Trang một bài viết (có đường dẫn riêng để chia sẻ)
import { esc, paragraphs } from '../util.js';
import { t } from '../i18n.js';
import { store } from '../store.js';
import { topicById } from '../data/taxonomy.js';
import * as C from '../content.js';
import { backLink, postActions, postCard, postCover, postMeta, refChips } from '../ui.js';

export function renderPost(view, id) {
  const raw = store.getPost(id);
  if (!raw) return false;
  const p = C.post(raw);
  const all = store.allPosts().filter((x) => x.id !== p.id);
  const score = (x) => (x.refs || []).filter((r) => p.refs?.includes(r)).length * 3 + (x.topic === p.topic ? 1 : 0);
  const related = all.map((x) => [x, score(x)]).filter(([, s]) => s > 0).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([x]) => x);

  view.innerHTML = `<div class="page narrow">
    ${backLink('#/', t('nav.feed'))}
    <article class="post-full" style="--c:${topicById[p.topic]?.color}">
      <div class="post-cover">${postCover(p)}</div>
      ${postMeta(p)}
      ${p.title ? `<h1>${esc(p.title)}</h1>` : ''}
      <div class="prose prose-lg">${paragraphs(p.body)}</div>
      ${p.refs?.length ? `<div class="chips">${refChips(p.refs)}</div>` : ''}
      <p class="author">— ${esc(p.author)}${store.isMine(p.id) ? ` <span class="tag">${t('post.mine')}</span> <span class="tag">${t(`post.status.${store.postStatus(p.id) || 'local'}`)}</span>` : ''}</p>
      ${postActions(p, { open: false })}
    </article>
    ${related.length ? `<section class="section"><h2 class="section-title">${t('post.related')}</h2><div class="post-grid">${related.map(postCard).join('')}</div></section>` : ''}
  </div>`;
  return true;
}
