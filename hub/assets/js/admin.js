// Trang quản trị Graviti (giai đoạn 1), chỉ quản trị viên. Chỉ tiếng Việt và tiếng Anh.
// Khoá truy cập: Cloudflare Access chặn ở cổng (docs/CAU-HINH.md mục 3); bản đăng GitHub Pages không chứa trang này. Nguồn dữ liệu, tất cả công khai, không cần khoá bí mật:
//  1. admin/stats.json — số liệu nội dung, sinh lúc dựng (tools/build-hub.mjs đọc thẳng mã Graviti Stars).
//  2. <web đang chạy>/build-info.json — web có sống không, bản nào, phản hồi bao lâu.
//  3. GitHub REST API công khai — lần chạy kiểm thử/đăng web, bản phát hành, pull request, nhánh main có bảo vệ không.
//     Không đăng nhập nên giới hạn 60 lượt/giờ/mạng: mỗi lần tải dùng 4 lượt, kết quả giữ 5 phút trong sessionStorage.
// Không lưu, không hỏi token GitHub: một trang web tĩnh không có chỗ giữ bí mật an toàn.
import { t, td, pick, esc, icon, applyStrings, setupTheme, loadLang, saveLang, pickLang, addStrings, lang } from './common.js';
import ADMIN_STRINGS from './admin-strings.js';
import { SITE, LIVE, SERVICES, STAR_MODULES, ROADMAP, CHECKLIST } from './data.js';

const $ = (s) => document.querySelector(s);
const API = `https://api.github.com/repos/${SITE.REPO}`;
const CACHE_MS = 5 * 60 * 1000;
const TODO_KEY = 'graviti:todo';

// Kế hoạch phát triển trang quản trị theo giai đoạn. status: done | wait | later
const PLAN = [
  {
    status: 'done',
    title: { vi: 'Giai đoạn 1 · Nền tảng (xong ở 2.3.0)', en: 'Phase 1 · Foundation (done in 2.3.0)' },
    items: {
      vi: ['Tổng quan: web sống không, bản đang chạy, thời gian phản hồi', 'Phát hành: các lần kiểm thử/đăng web, bản phát hành, pull request', 'Nội dung: bài mẫu theo chủ đề, lá bài, ngôn ngữ, độ phủ bản dịch, dung lượng', 'Lộ trình và việc cần làm, có mục tự kiểm tra'],
      en: ['Overview: is the site up, live version, response time', 'Releases: test/deploy runs, releases, pull requests', 'Content: seed posts by topic, cards, languages, translation coverage, size', 'Roadmap and to-do list with automatic checks'],
    },
    need: { vi: 'Nguồn: GitHub API công khai, build-info.json, stats.json.', en: 'Sources: public GitHub API, build-info.json, stats.json.' },
  },
  {
    status: 'wait',
    title: { vi: 'Giai đoạn 2 · Lưu lượng và độ ổn định', en: 'Phase 2 · Traffic and uptime' },
    items: {
      vi: ['Lượt xem, quốc gia, thiết bị theo ngày (không cookie, không theo dõi cá nhân)', 'Theo dõi web sống 5 phút/lần, báo khi sập', 'Tự kiểm tra tiêu đề bảo mật (CSP, HSTS, chống nhúng khung)', 'Nhắc hạn gia hạn tên miền'],
      en: ['Daily views, countries, devices (cookie-free, no personal tracking)', 'Uptime check every 5 minutes, alert on downtime', 'Automatic security header check (CSP, HSTS, framing)', 'Domain renewal reminder'],
    },
    need: { vi: 'Cần: tên miền gravitispace.com + Cloudflare (Web Analytics, Worker đọc số liệu bằng khoá giữ phía máy chủ).', en: 'Needs: gravitispace.com + Cloudflare (Web Analytics, a Worker reading stats with a server-side key).' },
  },
  {
    status: 'wait',
    title: { vi: 'Giai đoạn 3 · Người dùng và kiểm duyệt', en: 'Phase 3 · Users and moderation' },
    items: {
      vi: ['Thêm lớp đăng nhập quản trị bằng Supabase (vai trò admin, RLS) phía sau Cloudflare Access', 'Số người đăng ký, hoạt động 7/30 ngày (đếm gộp, không xem nội dung riêng)', 'Hàng chờ duyệt bài: duyệt, ẩn, ghi lý do', 'Báo cáo vi phạm và bài có từ ngữ khủng hoảng được ưu tiên'],
      en: ['Add a Supabase admin login (admin role, RLS) behind Cloudflare Access', 'Sign-ups, 7/30-day active users (aggregates only, no private content)', 'Review queue: approve, hide, note a reason', 'Reports and crisis-language posts go first'],
    },
    need: { vi: 'Cần: bật Supabase, thêm vai trò quản trị trong schema.sql, CAPTCHA.', en: 'Needs: Supabase on, an admin role in schema.sql, CAPTCHA.' },
  },
  {
    status: 'later',
    title: { vi: 'Giai đoạn 4 · Sức khoẻ cộng đồng và nhiệm vụ', en: 'Phase 4 · Community health and quests' },
    items: {
      vi: ['Thời gian duyệt bài trung bình, tỉ lệ bài mới được nhìn thấy', 'Độ đa dạng chủ đề trên bảng tin (chống bão hoà)', 'Tỉ lệ hoàn thành từng nhiệm vụ, điểm người dùng bỏ dở', 'Phát hiện bài trùng lặp'],
      en: ['Average review time, share of new posts that get seen', 'Topic diversity in the feed (anti-saturation)', 'Completion rate per quest and drop-off points', 'Duplicate post detection'],
    },
    need: { vi: 'Cần: duyệt lộ trình cộng đồng, nhiệm vụ, bảng tin 3 + 1.', en: 'Needs: approval of the community, quests and 3 + 1 feed roadmap.' },
  },
  {
    status: 'later',
    title: { vi: 'Giai đoạn 5 · Vận hành dịch vụ', en: 'Phase 5 · Service operations' },
    items: {
      vi: ['Đơn đặt, doanh thu, hoàn tiền (Connect, Help)', 'Đối tác: hồ sơ, xác minh, đánh giá', 'Thời gian phản hồi khách hàng'],
      en: ['Bookings, revenue, refunds (Connect, Help)', 'Partners: profiles, verification, reviews', 'Customer response times'],
    },
    need: { vi: 'Cần: Graviti Connect hoặc Help ra mắt.', en: 'Needs: Graviti Connect or Help launched.' },
  },
];

// ---------- Lấy dữ liệu ----------
async function getJSON(url, { cache = true } = {}) {
  const key = 'graviti:gh:' + url;
  if (cache) {
    try {
      const hit = JSON.parse(sessionStorage.getItem(key) || 'null');
      if (hit && Date.now() - hit.at < CACHE_MS) return hit.data;
    } catch {}
  }
  const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store', referrerPolicy: 'no-referrer' });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const data = await res.json();
  try { sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data })); } catch {}
  return data;
}

async function checkLive(base) {
  const start = performance.now();
  try {
    const res = await fetch(base + 'build-info.json', { cache: 'no-store', referrerPolicy: 'no-referrer' });
    const ms = Math.round(performance.now() - start);
    if (!res.ok) return { ok: false, ms };
    return { ok: true, ms, info: await res.json() };
  } catch {
    return { ok: false, ms: null };
  }
}

const settle = async (p) => { try { return await p; } catch { return null; } };

let state = { stats: null, live: null, runs: null, releases: null, prs: null, branch: null, at: null, ghFailed: false };

async function load(force = false) {
  $('[data-updated]').textContent = t('dash.loading');
  const opt = { cache: !force };
  const [stats, live, runs, releases, prs, branch] = await Promise.all([
    settle(fetch('stats.json', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null))),
    checkLive(LIVE.stars).then((r) => (r.ok || !LIVE.starsLegacy ? r : checkLive(LIVE.starsLegacy))),
    settle(getJSON(`${API}/actions/runs?per_page=12`, opt)),
    settle(getJSON(`${API}/releases?per_page=5`, opt)),
    settle(getJSON(`${API}/pulls?state=open&per_page=30`, opt)),
    settle(getJSON(`${API}/branches/main`, opt)),
  ]);
  state = { stats, live, runs: runs?.workflow_runs ?? null, releases, prs, branch, at: new Date(), ghFailed: !runs && !releases && !prs && !branch };
  render();
}

// ---------- Tính trạng thái ----------
function derive() {
  const { runs, releases, prs, branch, live, stats } = state;
  const deployRuns = (runs || []).filter((r) => r.path?.endsWith('deploy.yml') && r.head_branch === 'main' && r.event !== 'pull_request');
  const lastDeploy = deployRuns[0] || null;
  const ci = !lastDeploy ? 'unknown' : lastDeploy.status !== 'completed' ? 'running' : lastDeploy.conclusion === 'success' ? 'ok' : 'fail';
  const latest = releases?.[0] || null;
  const latestVer = latest?.tag_name?.replace(/^v/, '') || null;
  const liveVer = live?.info?.version || null;
  const bots = (prs || []).filter((p) => p.user?.login?.startsWith('dependabot')).length;
  return {
    lastDeploy, ci, latest, latestVer, liveVer,
    liveLatest: latestVer && liveVer ? latestVer === liveVer : null,
    protected: branch ? !!branch.protected : null,
    bots,
    auto: {
      ci: ci === 'ok' ? true : ci === 'fail' ? false : null,
      liveLatest: latestVer && liveVer ? latestVer === liveVer : null,
      protected: branch ? !!branch.protected : null,
      deps: prs ? bots === 0 : null,
      cloud: stats ? !!stats.cloud : null,
    },
  };
}

function readTodo() {
  try { return JSON.parse(localStorage.getItem(TODO_KEY) || '{}') || {}; } catch { return {}; }
}
function writeTodo(v) {
  try { localStorage.setItem(TODO_KEY, JSON.stringify(v)); } catch {}
}
const todoDone = (item, d, manual) => (item.auto ? d.auto[item.auto] === true : !!manual[item.id]);

// ---------- Định dạng ----------
const rtf = () => new Intl.RelativeTimeFormat(lang === 'vi' ? 'vi-VN' : 'en-GB', { numeric: 'auto' });
function ago(iso) {
  if (!iso) return '—';
  const s = (new Date(iso).getTime() - Date.now()) / 1000;
  const a = Math.abs(s);
  const [unit, size] = a < 60 ? ['second', 1] : a < 3600 ? ['minute', 60] : a < 86400 ? ['hour', 3600] : a < 2592000 ? ['day', 86400] : a < 31536000 ? ['month', 2592000] : ['year', 31536000];
  return rtf().format(Math.round(s / size), unit);
}
const dateFmt = (iso) => new Date(iso).toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' });
const pill = (kind, text, ic) => `<span class="pill pill-${kind}">${icon(ic || (kind === 'good' ? 'check' : kind === 'bad' ? 'x' : kind === 'warn' ? 'alert' : 'clock'), 'ic ic-s')}${esc(text)}</span>`;
const tile = (label, value, extra = '') => `<div class="tile"><div class="tile-label">${esc(label)}</div><div class="tile-value">${value}</div>${extra}</div>`;
const skeleton = '<span class="skeleton">00000</span>';

// ---------- Vẽ ----------
function renderTiles(d) {
  const { live, stats, prs, ghFailed } = state;
  const manual = readTodo();
  const doneCount = CHECKLIST.filter((i) => todoDone(i, d, manual)).length;
  const gh = (v) => (ghFailed ? '—' : v);
  const tiles = [
    tile(t('dash.health'), live ? esc(live.ok ? t('dash.healthOk') : t('dash.healthDown')) : skeleton,
      live ? `${pill(live.ok ? 'good' : 'bad', live.ok ? 'OK' : 'DOWN')}<p class="tile-sub">${live.ms != null ? esc(t('dash.latency', { ms: live.ms })) : ''}${live.info ? ' · ' + esc(t('dash.liveVersion')) + ' ' + esc(live.info.version) : ''}</p>` : ''),
    tile(t('dash.latest'), gh(d.latest ? esc(d.latest.tag_name) : '—'),
      d.liveLatest == null ? '' : `${pill(d.liveLatest ? 'good' : 'warn', t(d.liveLatest ? 'dash.match' : 'dash.mismatch'))}<p class="tile-sub">${esc(ago(d.latest.published_at))}</p>`),
    tile(t('dash.ci'), gh(esc({ ok: t('dash.ciOk'), fail: t('dash.ciFail'), running: t('dash.ciRun'), unknown: '—' }[d.ci])),
      d.lastDeploy ? `${pill(d.ci === 'ok' ? 'good' : d.ci === 'fail' ? 'bad' : 'muted', d.lastDeploy.head_sha.slice(0, 7))}<p class="tile-sub">${esc(ago(d.lastDeploy.created_at))}</p>` : ''),
    tile(t('dash.prs'), gh(prs ? String(prs.length) : '—'), prs ? `<p class="tile-sub">${esc(t('dash.prsBots', { n: d.bots }))}</p>` : ''),
    tile(t('dash.branch'), gh(d.protected == null ? '—' : esc(t(d.protected ? 'dash.protected' : 'dash.unprotected'))),
      d.protected == null ? '' : pill(d.protected ? 'good' : 'warn', d.protected ? 'main' : 'main')),
    tile(t('dash.todoProgress'), esc(t('dash.todoDone', { d: doneCount, n: CHECKLIST.length })),
      `<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="${CHECKLIST.length}" aria-valuenow="${doneCount}"><span style="width:${Math.round((doneCount / CHECKLIST.length) * 100)}%"></span></div>`),
  ];
  if (stats) {
    tiles.push(tile(t('dash.content.posts'), String(stats.posts.total), `<p class="tile-sub">${esc(t('dash.content.cards'))}: ${stats.cards} · ${esc(t('dash.content.langs'))}: ${stats.langs.length}</p>`));
    tiles.push(tile(t('dash.content.cloud'), esc(t(stats.cloud ? 'dash.content.cloudOn' : 'dash.content.cloudOff')), pill(stats.cloud ? 'good' : 'muted', 'Supabase')));
  }
  $('#tiles').innerHTML = tiles.join('');
}

function renderRelease(d) {
  const { runs, releases, prs } = state;
  $('#runs').innerHTML = !runs
    ? `<p class="muted">—</p>`
    : `<table><thead><tr><th>${esc(t('dash.col.workflow'))}</th><th>${esc(t('dash.col.result'))}</th><th>${esc(t('dash.col.commit'))}</th><th>${esc(t('dash.col.when'))}</th></tr></thead><tbody>${runs
        .slice(0, 8)
        .map((r) => {
          const kind = r.status !== 'completed' ? 'muted' : r.conclusion === 'success' ? 'good' : r.conclusion === 'skipped' || r.conclusion === 'cancelled' ? 'muted' : 'bad';
          const label = r.status !== 'completed' ? t('dash.ciRun') : r.conclusion === 'success' ? t('dash.ciOk') : r.conclusion === 'failure' ? t('dash.ciFail') : r.conclusion;
          return `<tr><td><a href="${esc(r.html_url)}" target="_blank" rel="noopener noreferrer">${esc(r.name)}</a><div class="tile-sub">${esc(r.head_branch)} · ${esc(r.event)}</div></td><td>${pill(kind, label)}</td><td class="mono">${esc(r.head_sha.slice(0, 7))}</td><td>${esc(ago(r.created_at))}</td></tr>`;
        })
        .join('')}</tbody></table>`;
  $('#releases').innerHTML = !releases
    ? '<li class="muted">—</li>'
    : releases.length
      ? releases.map((r) => `<li><a class="grow" href="${esc(r.html_url)}" target="_blank" rel="noopener noreferrer">${esc(r.name || r.tag_name)}</a><span class="muted">${esc(dateFmt(r.published_at))}</span></li>`).join('')
      : `<li class="muted">${esc(t('dash.none'))}</li>`;
  $('#prs').innerHTML = !prs
    ? '<li class="muted">—</li>'
    : prs.length
      ? prs.map((p) => `<li><a class="grow" href="${esc(p.html_url)}" target="_blank" rel="noopener noreferrer">#${p.number} ${esc(p.title)}</a><span class="muted">${esc(ago(p.created_at))}</span></li>`).join('')
      : `<li class="muted">${esc(t('dash.none'))}</li>`;
}

function renderContent() {
  const s = state.stats;
  if (!s) {
    $('#content-body').innerHTML = `<p class="alert">${icon('alert')}<span>${esc(t('dash.content.missing'))}</span></p>`;
    return;
  }
  const max = Math.max(1, ...s.posts.byTopic.map((x) => x.count));
  const bars = s.posts.byTopic
    .map((x) => `<div class="hbar"><span>${esc(pick(x.label))}</span><div class="hbar-track" title="${esc(pick(x.label))}: ${x.count}"><div class="hbar-fill" style="width:${(x.count / max) * 100}%"></div></div><span class="hbar-val">${x.count}</span></div>`)
    .join('');
  const langs = s.langs
    .map((l) => `<li><span class="grow">${esc(l.native)} <span class="muted mono">${esc(l.code)}</span></span>${pill(l.coverage >= 100 ? 'good' : 'warn', l.coverage + '%')}</li>`)
    .join('');
  $('#content-body').innerHTML = `
    <div class="tiles">
      ${tile(t('dash.content.cards'), String(s.cards))}
      ${tile(t('dash.content.spreads'), String(s.spreads))}
      ${tile(t('dash.content.signs'), String(s.signs))}
      ${tile(t('dash.content.stars'), String(s.tuviStars))}
      ${tile(t('dash.content.size'), `${s.firstLoadKB} KB`)}
    </div>
    <div class="grid-2">
      <div class="panel"><h3>${esc(t('dash.content.byTopic'))}</h3><div class="hbars">${bars}</div></div>
      <div class="panel"><h3>${esc(t('dash.content.i18n'))}</h3><ul class="list">${langs}</ul></div>
    </div>
    <p class="tile-sub">${esc(t('dash.content.build', { v: s.version, c: s.commit, t: dateFmt(s.builtAt) }))}</p>`;
}

const STATUS_PILL = { live: 'good', next: 'warn', idea: 'muted' };
function renderRoadmap() {
  $('#svc-status').innerHTML = SERVICES.map((s) => `<li><span class="grow">${esc(s.name)} <span class="muted mono">${esc(SITE.DOMAIN)}/${esc(s.path)}</span></span>${pill(STATUS_PILL[s.status], t('status.' + s.status), s.status === 'live' ? 'check' : 'clock')}</li>`).join('');
  $('#mod-status').innerHTML = STAR_MODULES.map((m) => `<li><span class="grow">${esc(td('modules', m.id))}</span>${pill(STATUS_PILL[m.status], t('status.' + m.status), m.status === 'live' ? 'check' : 'clock')}</li>`).join('');
  $('#roadmap-list').innerHTML = ROADMAP.map(
    (r) => `<li class="road road-${r.status}"><span class="road-mark" aria-hidden="true"></span><span class="road-title">${esc(td('roadmap', r.id))}</span><span class="road-status">${esc(t('road.' + r.status))}</span></li>`
  ).join('');
}

function renderTodo(d) {
  const manual = readTodo();
  $('#todo-list').innerHTML = CHECKLIST.map((item) => {
    const done = todoDone(item, d, manual);
    const autoVal = item.auto ? d.auto[item.auto] : undefined;
    const bad = item.auto && autoVal === false;
    const mark = done ? icon('check', 'ic ic-s') : bad ? icon('x', 'ic ic-s') : '';
    const btn = item.auto
      ? `<button class="todo-check${bad ? ' is-bad' : ''}" type="button" role="checkbox" aria-checked="${done}" disabled aria-label="${esc(pick(item.title))}">${mark}</button>`
      : `<button class="todo-check" type="button" role="checkbox" aria-checked="${done}" data-todo="${esc(item.id)}" aria-label="${esc(pick(item.title))}">${mark}</button>`;
    return `<li class="${done ? 'todo-done' : ''}"><div class="todo-row">${btn}<div class="todo-body"><p class="todo-title">${esc(pick(item.title))}</p><span class="todo-kind">${esc(t(item.auto ? 'dash.todo.auto' : 'dash.todo.manual'))}</span>${
      item.how ? `<details><summary>${esc(t('dash.todo.how'))}</summary><p>${esc(pick(item.how))}</p></details>` : ''
    }</div></div></li>`;
  }).join('');
}

function renderPlan() {
  const kind = { done: 'good', wait: 'warn', later: 'muted' };
  const label = { done: t('road.done'), wait: t('road.wait'), later: t('road.later') };
  $('#plan-list').innerHTML = PLAN.map(
    (p) => `<article class="plan-phase"><header><h3>${esc(pick(p.title))}</h3>${pill(kind[p.status], label[p.status])}</header><ul>${pick(p.items).map((i) => `<li>${esc(i)}</li>`).join('')}</ul><p class="plan-need">${esc(pick(p.need))}</p></article>`
  ).join('');
}

function render() {
  applyStrings('dash.title');
  document.querySelector('[data-lang-toggle]').setAttribute('aria-label', t('lang.switchAria'));
  const d = derive();
  $('[data-alert]').innerHTML = state.at && state.ghFailed ? `<p class="alert">${icon('alert')}<span>${esc(t('dash.offline'))}</span></p>` : '';
  if (state.at) $('[data-updated]').textContent = t('dash.updated', { t: state.at.toLocaleTimeString(lang === 'vi' ? 'vi-VN' : 'en-GB', { hour: '2-digit', minute: '2-digit' }) });
  renderTiles(d);
  renderRelease(d);
  renderContent();
  renderRoadmap();
  renderTodo(d);
  renderPlan();
}

// Đánh dấu việc thủ công
$('#todo-list').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-todo]');
  if (!btn) return;
  const v = readTodo();
  v[btn.dataset.todo] = !v[btn.dataset.todo];
  writeTodo(v);
  render();
});
$('[data-refresh]').addEventListener('click', () => load(true));

// Tô đậm mục đang xem trên thanh điều hướng
const links = [...document.querySelectorAll('.dash-nav a')];
const io = new IntersectionObserver(
  (entries) => {
    for (const en of entries) {
      if (!en.isIntersecting || window.scrollY < 80) continue;
      links.forEach((a) => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + en.target.id)));
      // Trên điện thoại thanh mục cuộn ngang: kéo mục đang xem vào tầm nhìn
      const nav = links[0].parentElement;
      const cur = links.find((a) => a.getAttribute('aria-current') === 'true');
      if (cur && nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: cur.offsetLeft - 16, behavior: 'smooth' });
    }
  },
  { rootMargin: '-30% 0px -60% 0px' }
);
document.querySelectorAll('.dash-sec').forEach((s) => io.observe(s));
links[0].setAttribute('aria-current', 'true');

addStrings(ADMIN_STRINGS);
setupTheme();
document.querySelector('[data-lang-toggle]').addEventListener('click', async () => {
  const next = lang === 'vi' ? 'en' : 'vi';
  saveLang(next);
  await loadLang(next);
  render();
});
await loadLang(pickLang(['vi', 'en']));
render();
load();
