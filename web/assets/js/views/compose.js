// Gieo duyên: viết một bài để người lướt sau có thể gặp
import { $, esc, icon, openModal, toast } from '../util.js';
import { store } from '../store.js';
import { TOPICS, POST_TYPES, CRISIS_PHRASES, topicById, typeById } from '../data/taxonomy.js';
import { DECK } from '../data/tarot.js';
import { SIGNS } from '../data/zodiac.js';
import { CHI } from '../data/tuvi.js';
import { resolveRef } from '../ui.js';
import { hotlineBox } from './about.js';

const MAX_REFS = 3;
const ALL_REFS = [
  ...DECK.map((c) => [`Tarot · ${c.name}`, c.id]),
  ...SIGNS.map((s) => [`Cung · ${s.name}`, s.id]),
  ...CHI.map((c) => [`Tuổi · ${c.name} (${c.animal})`, c.id]),
];
const refByLabel = Object.fromEntries(ALL_REFS);

export function renderCompose(view, params) {
  const topic = topicById[params.get('chu-de')] ? params.get('chu-de') : '';
  const type = typeById[params.get('loai')] ? params.get('loai') : 'chia-se';
  let refs = (params.get('ref') || '').split(',').filter((id) => resolveRef(id)).slice(0, MAX_REFS);

  const radio = (name, list, current) =>
    list.map((o) => `<label class="chip-radio"><input type="radio" name="${name}" value="${o.id}" ${o.id === current ? 'checked' : ''} required /><span>${esc(o.label)}</span></label>`).join('');

  view.innerHTML = `<div class="page narrow">
    <header class="page-head">
      <p class="eyebrow">Gieo duyên</p>
      <h1>Để lại vài dòng cho người lướt sau.</h1>
      <p class="lead">Có thể là một lần trải bài, một điều bạn hiểu ra về cung của mình, hay một lời nhắn cho người lạ. Biết đâu nó đến với ai đó đúng lúc họ cần.</p>
    </header>
    <form class="compose" data-compose novalidate>
      <fieldset><legend>Chủ đề</legend><div class="chips">${radio('topic', TOPICS, topic)}</div></fieldset>
      <fieldset><legend>Kiểu bài</legend><div class="chips">${radio('type', POST_TYPES, type)}</div></fieldset>
      <label class="field"><span>Tiêu đề <em class="muted">(không bắt buộc)</em></span><input name="title" maxlength="120" /></label>
      <label class="field"><span>Nội dung</span>
        <textarea name="body" rows="8" minlength="20" maxlength="2000" required placeholder="Viết như đang nói với một người lạ…"></textarea>
        <span class="counter muted small" data-counter>0 / 2000</span>
      </label>
      <div class="field">
        <span>Gắn với lá bài, cung hoặc tuổi <em class="muted">(tối đa ${MAX_REFS})</em></span>
        <div class="chips" data-refs></div>
        <input list="ref-options" data-ref-input placeholder="Gõ để tìm, ví dụ: Ngôi Sao, Bọ Cạp, Mão…" aria-label="Thêm liên kết" />
        <datalist id="ref-options">${ALL_REFS.map(([label]) => `<option value="${esc(label)}"></option>`).join('')}</datalist>
      </div>
      <label class="field"><span>Bạn muốn ký tên là</span><input name="author" maxlength="40" placeholder="Một người lạ" /></label>
      <p class="muted small">Đừng viết tên thật của bạn hay người khác. Bản thử nghiệm: bài chỉ lưu trên máy này cho tới khi có máy chủ.</p>
      <p class="form-error" data-error role="alert"></p>
      <button class="btn btn-lg" type="submit">${icon('plus')} Gieo duyên</button>
    </form>
  </div>`;

  const form = $('[data-compose]', view);
  const refBox = $('[data-refs]', view);
  const refInput = $('[data-ref-input]', view);
  const err = $('[data-error]', view);

  const drawRefs = () => {
    refBox.innerHTML = refs
      .map((id) => `<button type="button" class="chip on" data-remove-ref="${id}" aria-label="Bỏ ${esc(resolveRef(id).label)}">${esc(resolveRef(id).label)} ${icon('close')}</button>`)
      .join('');
    refInput.hidden = refs.length >= MAX_REFS;
  };
  drawRefs();

  refInput.addEventListener('change', () => {
    const id = refByLabel[refInput.value];
    if (id && !refs.includes(id) && refs.length < MAX_REFS) refs.push(id);
    refInput.value = '';
    drawRefs();
  });
  refBox.addEventListener('click', (e) => {
    const b = e.target.closest('[data-remove-ref]');
    if (b) {
      refs = refs.filter((id) => id !== b.dataset.removeRef);
      drawRefs();
    }
  });
  const bodyEl = form.elements.body;
  bodyEl.addEventListener('input', () => ($('[data-counter]', view).textContent = `${bodyEl.value.length} / 2000`));

  const publish = (data) => {
    const post = {
      id: `me-${Date.now().toString(36)}`,
      ...data,
      refs,
      createdAt: new Date().toISOString(),
      hearts: 0,
    };
    store.addPost(post);
    toast('Đã gieo duyên. Cảm ơn bạn.');
    location.hash = `#/bai/${post.id}`;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const data = {
      topic: f.get('topic'),
      type: f.get('type'),
      title: String(f.get('title') || '').trim(),
      body: String(f.get('body') || '').trim(),
      author: String(f.get('author') || '').trim() || 'Một người lạ',
    };
    if (!data.topic) return (err.textContent = 'Bạn chọn giúp một chủ đề nhé.');
    if (data.body.length < 20) return (err.textContent = 'Viết thêm một chút nữa nhé (ít nhất 20 ký tự).');
    err.textContent = '';

    const text = `${data.title} ${data.body}`.toLowerCase();
    if (CRISIS_PHRASES.some((p) => text.includes(p))) {
      const close = openModal(`<h2>Mình đọc thấy bạn đang rất mệt.</h2>
        <p>Trước khi đăng, mình muốn bạn biết: có người sẵn sàng lắng nghe bạn ngay bây giờ.</p>
        ${hotlineBox('Gọi miễn phí, không cần nói tên:')}
        <div class="row"><button class="btn btn-ghost" type="button" data-go>Mình vẫn muốn đăng bài</button></div>`);
      $('#modal-root [data-go]').addEventListener('click', () => {
        close();
        publish(data);
      });
      return;
    }
    publish(data);
  });
}
