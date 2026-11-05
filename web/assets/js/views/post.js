// Trang một bài viết (có đường dẫn riêng để chia sẻ)
import { esc, paragraphs } from '../util.js';
import { store } from '../store.js';
import { topicById } from '../data/taxonomy.js';
import { backLink, postActions, postCard, postMeta, refChips } from '../ui.js';

export function renderPost(view, id) {
  const p = store.getPost(id);
  if (!p) return false;
  const all = store.allPosts().filter((x) => x.id !== p.id);
  const score = (x) => (x.refs || []).filter((r) => p.refs?.includes(r)).length * 3 + (x.topic === p.topic ? 1 : 0);
  const related = all.map((x) => [x, score(x)]).filter(([, s]) => s > 0).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([x]) => x);

  view.innerHTML = `<div class="page narrow">
    ${backLink('#/', 'Lướt duyên')}
    <article class="post-full" style="--c:${topicById[p.topic]?.color}">
      ${postMeta(p)}
      ${p.title ? `<h1>${esc(p.title)}</h1>` : ''}
      <div class="prose prose-lg">${paragraphs(p.body)}</div>
      ${p.refs?.length ? `<div class="chips">${refChips(p.refs)}</div>` : ''}
      <p class="author">— ${esc(p.author)}${store.isMine(p.id) ? ' <span class="tag">Bài của bạn</span>' : ''}</p>
      ${postActions(p, { open: false })}
    </article>
    ${related.length ? `<section class="section"><h2 class="section-title">Có thể cũng là duyên</h2><div class="post-grid">${related.map(postCard).join('')}</div></section>` : ''}
  </div>`;
  return true;
}
