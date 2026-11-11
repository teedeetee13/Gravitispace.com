// Về Graviti Stars + phương pháp & nguồn dữ liệu + hộp đường dây hỗ trợ dùng chung
import { esc, icon } from '../util.js';
import { t } from '../i18n.js';
import { HOTLINES } from '../data/taxonomy.js';
import * as C from '../content.js';

export const hotlineBox = (intro) => `<div class="hotline" id="ho-tro">
  <p class="hotline-title">${icon('phone')} ${t('about.needHelp')}</p>
  <p>${esc(intro)}</p>
  <ul>${HOTLINES.map(C.hotline).map((h) => (h.url
    ? `<li><a href="${esc(h.url)}" target="_blank" rel="noopener noreferrer"><strong>${esc(h.name)}</strong></a> <span class="muted small">(${esc(h.note)})</span></li>`
    : `<li><a href="tel:${h.number.replace(/\s/g, '')}"><strong>${esc(h.number)}</strong></a> · ${esc(h.name)} <span class="muted small">(${esc(h.note)})</span></li>`)).join('')}</ul>
</div>`;

export function renderAbout(view) {
  view.innerHTML = `<div class="page narrow">
    <header class="page-head">
      <p class="eyebrow">${t('nav.about')}</p>
      <h1>${t('about.title')}</h1>
      <p class="lead">${t('about.lead')}</p>
    </header>

    <section class="section prose">
      <h2 class="section-title">${t('about.soberTitle')}</h2>
      <p>${t('about.sober1')}</p>
      <p>${t('about.sober2')}</p>

      <h2 class="section-title">${t('about.threeTitle')}</h2>
      <ol class="principles">
        <li>${t('about.p1')}</li>
        <li>${t('about.p2')}</li>
        <li>${t('about.p3')}</li>
      </ol>

      <h2 class="section-title" id="phuong-phap">${t('about.methodTitle')}</h2>
      <ul class="sources">
        <li>${t('about.src.lunar')}</li>
        <li>${t('about.src.tuvi')}</li>
        <li>${t('about.src.astro')}</li>
        <li>${t('about.src.tarot')}</li>
      </ul>
      <p>${t('about.methodNote')}</p>

      <h2 class="section-title">${t('about.privacyTitle')}</h2>
      <p>${t('about.privacy')}</p>

      <h2 class="section-title">${t('about.expertTitle')}</h2>
      <p>${t('about.expert')}</p>
    </section>

    ${hotlineBox(t('about.hotlineIntro'))}

    <p class="muted small">${t('about.beta')}</p>
  </div>`;
}
