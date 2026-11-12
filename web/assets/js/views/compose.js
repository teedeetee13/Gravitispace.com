// Gieo duyên: viết một bài để người lướt sau có thể gặp
import { $, esc, icon, openModal, toast } from '../util.js';
import { navigate, postLink } from '../route.js';
import { t, getLang } from '../i18n.js';
import { store } from '../store.js';
import { auth } from '../auth.js';
import { TOPICS, POST_TYPES, CRISIS_PHRASES, topicById, typeById } from '../data/taxonomy.js';
import { DECK } from '../data/tarot.js';
import { SIGNS } from '../data/zodiac.js';
import { CHI } from '../data/tuvi.js';
import * as C from '../content.js';
import { resolveRef } from '../ui.js';
import { hotlineBox } from './about.js';

const MAX_REFS = 3;
const MAX_BODY = 2000;
const MIN_BODY = 20;

const allRefs = () => [
  ...DECK.map((c) => [`${t('ref.tarot')} · ${C.card(c).name}`, c.id]),
  ...SIGNS.map((s) => [`${t('ref.sign')} · ${C.sign(s).name}`, s.id]),
  ...CHI.map((c) => [`${t('ref.chi')} · ${C.ganzhi(c.name)} (${C.chi(c).animal})`, c.id]),
];

export function renderCompose(view, params) {
  const topic = topicById[params.get('chu-de')] ? params.get('chu-de') : '';
  const type = typeById[params.get('loai')] ? params.get('loai') : 'chia-se';
  let refs = (params.get('ref') || '').split(',').filter((id) => resolveRef(id)).slice(0, MAX_REFS);
  const ALL_REFS = allRefs();
  const refByLabel = Object.fromEntries(ALL_REFS);

  const radio = (name, list, current, label) =>
    list.map((o) => `<label class="chip-radio"><input type="radio" name="${name}" value="${o.id}" ${o.id === current ? 'checked' : ''} required /><span>${esc(label(o))}</span></label>`).join('');

  view.innerHTML = `<div class="page narrow">
    <header class="page-head">
      <p class="eyebrow">${t('nav.compose')}</p>
      <h1>${t('compose.title')}</h1>
      <p class="lead">${t('compose.lead')}</p>
    </header>
    <form class="compose" data-compose novalidate>
      <fieldset><legend>${t('compose.topic')}</legend><div class="chips">${radio('topic', TOPICS, topic, C.topicLabel)}</div></fieldset>
      <fieldset><legend>${t('compose.type')}</legend><div class="chips">${radio('type', POST_TYPES, type, C.typeLabel)}</div></fieldset>
      <label class="field"><span>${t('compose.titleField')} <em class="muted">${t('form.optional')}</em></span><input name="title" maxlength="120" /></label>
      <label class="field"><span>${t('compose.body')}</span>
        <textarea name="body" rows="8" minlength="${MIN_BODY}" maxlength="${MAX_BODY}" required placeholder="${esc(t('compose.bodyPlaceholder'))}"></textarea>
        <span class="counter muted small" data-counter>0 / ${MAX_BODY}</span>
      </label>
      <div class="field">
        <span>${t('compose.refs', { n: MAX_REFS })}</span>
        <div class="chips" data-refs></div>
        <input list="ref-options" data-ref-input placeholder="${esc(t('compose.refPlaceholder'))}" aria-label="${esc(t('compose.refAria'))}" />
        <datalist id="ref-options">${ALL_REFS.map(([label]) => `<option value="${esc(label)}"></option>`).join('')}</datalist>
      </div>
      <label class="field"><span>${t('compose.author')}</span><input name="author" maxlength="40" placeholder="${esc(t('compose.stranger'))}" /></label>
      <p class="muted small">${t('compose.privacy')} ${auth.user() ? t('compose.cloudNote') : t('compose.guestNote')}</p>
      <p class="form-error" data-error role="alert"></p>
      <button class="btn btn-lg" type="submit">${icon('plus')} ${t('nav.compose')}</button>
    </form>
  </div>`;

  const form = $('[data-compose]', view);
  const refBox = $('[data-refs]', view);
  const refInput = $('[data-ref-input]', view);
  const err = $('[data-error]', view);

  const drawRefs = () => {
    refBox.innerHTML = refs
      .map((id) => `<button type="button" class="chip on" data-remove-ref="${id}" aria-label="${esc(t('compose.removeRef', { name: resolveRef(id).label }))}">${esc(resolveRef(id).label)} ${icon('close')}</button>`)
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
  bodyEl.addEventListener('input', () => ($('[data-counter]', view).textContent = `${bodyEl.value.length} / ${MAX_BODY}`));

  const publish = (data) => {
    const post = { id: crypto.randomUUID(), ...data, refs, lang: getLang(), createdAt: new Date().toISOString(), hearts: 0 };
    store.addPost(post);
    toast(auth.user() ? t('compose.doneCloud') : t('compose.done'));
    navigate(postLink(post.id));
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const data = {
      topic: f.get('topic'),
      type: f.get('type'),
      title: String(f.get('title') || '').trim().slice(0, 120),
      body: String(f.get('body') || '').trim().slice(0, MAX_BODY),
      author: String(f.get('author') || '').trim().slice(0, 40) || t('compose.stranger'),
    };
    if (!topicById[data.topic]) return (err.textContent = t('compose.errTopic'));
    if (!typeById[data.type]) data.type = 'chia-se';
    if (data.body.length < MIN_BODY) return (err.textContent = t('compose.errBody', { n: MIN_BODY }));
    err.textContent = '';

    const text = `${data.title} ${data.body}`.toLowerCase();
    if (CRISIS_PHRASES.some((p) => text.includes(p))) {
      const close = openModal(`<h2>${t('compose.crisisTitle')}</h2>
        <p>${t('compose.crisisBody')}</p>
        ${hotlineBox(t('compose.crisisCall'))}
        <div class="row"><button class="btn btn-ghost" type="button" data-go>${t('compose.crisisPost')}</button></div>`, { label: t('compose.crisisTitle') });
      $('#modal-root [data-go]').addEventListener('click', () => {
        close();
        publish(data);
      });
      return;
    }
    publish(data);
  });
}
