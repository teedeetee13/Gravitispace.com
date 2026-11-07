// Ảnh bìa cho từng bài viết — vẽ bằng SVG ngay trên trình duyệt, không cần tải ảnh, không thư viện.
// Mỗi bài một bìa riêng nhưng luôn ổn định (cùng một bài → cùng một bìa ở mọi lần mở, mọi máy):
//   hạt giống = mã bài viết → bộ sinh số ngẫu nhiên mulberry32 → chọn bảng màu, bố cục, hoạ tiết.
// Hoạ tiết bám đúng nội dung bài:
//   - Tarot: tranh gốc Rider–Waite–Smith 1909 của lá bài được nhắc tới (phạm vi công cộng), đặt nghiêng trong khung vàng;
//            không nhắc lá nào → biểu tượng bộ bài (Gậy, Cốc, Kiếm, Tiền) hoặc ẩn Ẩn chính.
//   - Chiêm tinh: chòm sao thật (giản lược) + ký hiệu của cung được nhắc tới, quỹ đạo hành tinh.
//   - Tử vi: chữ Hán của Địa Chi (子 丑 寅 卯…) trong ấn triện, vòng Bát Quái, mây lành (tường vân).
// Lớp chung: dải màu chuyển, tia sáng, mây, sao lấp lánh — vị trí và mật độ đổi theo hạt giống.
import { esc } from './util.js';
import { cardById } from './data/tarot.js';
import { signById } from './data/zodiac.js';
import { chiById } from './data/tuvi.js';

/* ---------- Bộ sinh số ngẫu nhiên có hạt giống ---------- */
function hash(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}
function rng(seed) {
  let a = seed;
  const next = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  next.range = (lo, hi) => lo + next() * (hi - lo);
  next.int = (lo, hi) => Math.floor(next.range(lo, hi + 1));
  next.pick = (arr) => arr[Math.floor(next() * arr.length)];
  return next;
}
const f = (n) => Math.round(n * 10) / 10;

/* ---------- Bảng màu theo chủ đề: [đậm, giữa, sáng, màu hoạ tiết, màu mây] ---------- */
const PALETTES = {
  tarot: [
    ['#2b1840', '#6b3a8c', '#e2a6d8', '#f6d48b', '#f3dcf0'], // tím đêm, vàng
    ['#8a1e5a', '#d93f7c', '#ffb6d1', '#5c0a33', '#ffe3ee'], // hồng mẫu đơn
    ['#141a3d', '#33407a', '#9aa6e0', '#e8c46a', '#dfe4ff'], // chàm ánh vàng
    ['#3d0f1f', '#8c2340', '#f08a8a', '#ffd9a8', '#ffe6e0'], // rượu vang
    ['#1f2a2a', '#3f6b63', '#bfe3c9', '#f3d58c', '#ecfbf0'], // lục bảo
  ],
  'chiem-tinh': [
    ['#0b1530', '#1f3b73', '#6fa3e0', '#f2e2a8', '#d6e6ff'], // nửa đêm
    ['#062a33', '#136a77', '#7fd1c7', '#fff1c9', '#dcf7f2'], // hoàng hôn ngọc
    ['#1d1442', '#5a3f9e', '#f2a7a0', '#ffe7b0', '#fde3f0'], // bình minh tím
    ['#24508f', '#4f8fd8', '#cfe6ff', '#0f2d58', '#f1f8ff'], // trời xanh
    ['#2a1033', '#7a2e6e', '#ffb38a', '#fff0c2', '#ffe4d6'], // hoàng hôn cam
  ],
  'tu-vi': [
    ['#7a1410', '#c8361e', '#f5a25a', '#ffe3a1', '#ffe9d2'], // son đỏ
    ['#2a0d08', '#6e1d12', '#c9852c', '#f4cf7a', '#f6dfc0'], // sơn mài vàng son
    ['#0d3328', '#1f6b55', '#9bd3b2', '#f6e7b5', '#e3f6ea'], // ngọc bích
    ['#8a4b12', '#d48a2a', '#ffd88a', '#5a1f0a', '#fff1d6'], // hoàng thổ
    ['#a3175b', '#e8478c', '#ffc2dc', '#6a0b37', '#ffe6f1'], // hồng đào
  ],
};

/* ---------- Chòm sao giản lược (toạ độ 0–100) — thứ tự Bạch Dương → Song Ngư ---------- */
const CONSTELLATIONS = {
  'bach-duong': [[[10, 60], [48, 38], [70, 40], [92, 58]], [[0, 1], [1, 2], [2, 3]]],
  'kim-nguu': [[[5, 10], [35, 42], [45, 52], [55, 48], [62, 38], [95, 8], [50, 64], [28, 72]], [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [2, 6], [1, 7]]],
  'song-tu': [[[20, 8], [42, 6], [22, 40], [44, 38], [25, 70], [47, 72], [14, 94], [52, 96]], [[0, 2], [2, 4], [4, 6], [1, 3], [3, 5], [5, 7], [2, 3]]],
  'cu-giai': [[[50, 45], [50, 12], [20, 88], [82, 82], [50, 62]], [[1, 0], [0, 4], [4, 2], [4, 3]]],
  'su-tu': [[[78, 8], [68, 20], [72, 34], [82, 44], [62, 54], [30, 50], [8, 70], [36, 76]], [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 4]]],
  'xu-nu': [[[8, 20], [28, 30], [45, 40], [62, 34], [82, 18], [50, 60], [40, 86], [76, 70], [92, 92]], [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [5, 6], [5, 7], [7, 8]]],
  'thien-binh': [[[50, 10], [20, 40], [80, 40], [24, 80], [86, 76]], [[0, 1], [0, 2], [1, 2], [1, 3], [2, 4]]],
  'bo-cap': [[[92, 8], [84, 24], [94, 38], [70, 40], [55, 50], [45, 66], [45, 82], [56, 94], [72, 92], [78, 80]], [[0, 1], [1, 3], [2, 1], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9]]],
  'nhan-ma': [[[18, 52], [34, 34], [56, 34], [56, 62], [34, 64], [72, 22], [80, 48], [92, 64]], [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [1, 4], [2, 5], [2, 6], [3, 6], [6, 7]]],
  'ma-ket': [[[8, 18], [24, 30], [40, 62], [60, 78], [80, 66], [96, 40], [70, 40]], [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1]]],
  'bao-binh': [[[82, 8], [66, 24], [50, 18], [40, 40], [24, 44], [34, 66], [18, 82], [46, 86], [62, 70]], [[0, 1], [1, 2], [2, 3], [3, 4], [3, 5], [5, 6], [5, 7], [7, 8]]],
  'song-ngu': [[[8, 14], [20, 6], [27, 20], [15, 26], [26, 40], [40, 60], [55, 84], [70, 70], [85, 60], [96, 66], [90, 78], [79, 72]], [[0, 1], [1, 2], [2, 3], [3, 0], [2, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 8]]],
};
const PLANET_GLYPHS = ['☉', '☽', '☿', '♀', '♂', '♃', '♄'];

// Chữ Hán của 12 Địa Chi theo thứ tự trong data/tuvi.js; chữ dự phòng khi bài không nhắc con giáp nào
const BRANCH_HAN = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const FALLBACK_HAN = ['緣', '福', '命', '安', '和', '心'];
// Bát quái: 1 = hào liền, 0 = hào đứt (từ dưới lên)
const TRIGRAMS = [[1, 1, 1], [0, 1, 1], [1, 0, 1], [0, 0, 1], [1, 1, 0], [0, 1, 0], [1, 0, 0], [0, 0, 0]];

const SUIT_ART = {
  gay: '<path d="M50 10v80M50 28l-12-10M50 46l12-10M50 64l-12-10"/>',
  coc: '<path d="M28 24h44c0 22-9 34-22 34S28 46 28 24zM50 58v18M36 82h28"/>',
  kiem: '<path d="M50 8l-5 9v50h10V17zM35 67h30M50 67v16M44 86h12"/>',
  tien: '<circle cx="50" cy="50" r="30"/><path d="M50 25 64.7 70.2 26.2 42.3h47.6L35.3 70.2z"/>',
  major: '<circle cx="50" cy="50" r="17"/><circle cx="50" cy="50" r="29" stroke-dasharray="2 5"/><path d="M50 6v13M50 81v13M6 50h13M81 50h13M19 19l9 9M72 72l9 9M81 19l-9 9M28 72l-9 9"/>',
};

/* ---------- Các lớp hoạ tiết ---------- */
const sparkle = (x, y, r, color, op) =>
  `<path d="M${f(x)} ${f(y - r)}Q${f(x + r * 0.18)} ${f(y - r * 0.18)} ${f(x + r)} ${f(y)}Q${f(x + r * 0.18)} ${f(y + r * 0.18)} ${f(x)} ${f(y + r)}Q${f(x - r * 0.18)} ${f(y + r * 0.18)} ${f(x - r)} ${f(y)}Q${f(x - r * 0.18)} ${f(y - r * 0.18)} ${f(x)} ${f(y - r)}z" fill="${color}" opacity="${op}"/>`;

function rays(cx, cy, n, len, color, rand) {
  let out = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rand.range(-0.04, 0.04);
    out += `<path d="M${f(cx)} ${f(cy)}L${f(cx + Math.cos(a) * len)} ${f(cy + Math.sin(a) * len)}"/>`;
  }
  return `<g stroke="${color}" stroke-width="1.2" opacity=".16">${out}</g>`;
}

/** Mây lành (tường vân): các cụm tròn chồng nhau, mỗi cụm có một nét xoắn */
function clouds(x, y, scale, fill, line, rand, flip = false) {
  const puffs = [[0, 0, 34], [40, -14, 30], [76, 6, 36], [26, 26, 30], [-34, 22, 26], [64, 40, 28], [110, 30, 26]];
  let body = '';
  let curls = '';
  for (const [dx, dy, r0] of puffs) {
    const r = r0 * rand.range(0.85, 1.12);
    body += `<circle cx="${f(dx)}" cy="${f(dy)}" r="${f(r)}"/>`;
    const rr = r * 0.55;
    curls += `<path d="M${f(dx - rr)} ${f(dy + rr * 0.2)}a${f(rr)} ${f(rr)} 0 1 1 ${f(rr * 1.1)} ${f(rr * 0.75)}a${f(rr * 0.5)} ${f(rr * 0.5)} 0 1 0 ${f(-rr * 0.2)} ${f(-rr * 0.7)}"/>`;
  }
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${flip ? -scale : scale} ${scale})">
    <g fill="${fill}" opacity=".92">${body}</g>
    <g fill="none" stroke="${line}" stroke-width="${f(2.2 / scale)}" stroke-linecap="round" opacity=".55">${curls}</g></g>`;
}

function constellation(id, x, y, size, color, rand) {
  const def = CONSTELLATIONS[id] || CONSTELLATIONS[rand.pick(Object.keys(CONSTELLATIONS))];
  const [pts, lines] = def;
  const P = pts.map(([px, py]) => [x + (px / 100) * size, y + (py / 100) * size]);
  const l = lines.map(([a, b]) => `<path d="M${f(P[a][0])} ${f(P[a][1])}L${f(P[b][0])} ${f(P[b][1])}"/>`).join('');
  const s = P.map(([px, py], i) => {
    const r = i % 3 === 0 ? 3.4 : 2.4;
    return `<circle cx="${f(px)}" cy="${f(py)}" r="${f(r * 2.8)}" fill="${color}" opacity=".18"/><circle cx="${f(px)}" cy="${f(py)}" r="${r}" fill="${color}"/>`;
  }).join('');
  return `<g stroke="${color}" stroke-width="1.3" stroke-opacity=".75">${l}</g>${s}`;
}

function orbits(cx, cy, r, color, rand) {
  let out = '';
  const n = rand.int(2, 3);
  for (let i = 0; i < n; i++) {
    const rx = r * (1 + i * 0.32);
    const ry = rx * rand.range(0.28, 0.42);
    const rot = rand.range(-25, 25);
    const a = rand.range(0, Math.PI * 2);
    out += `<g transform="rotate(${f(rot)} ${f(cx)} ${f(cy)})"><ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="none" stroke="${color}" stroke-width="1" opacity=".35"/>
      <circle cx="${f(cx + Math.cos(a) * rx)}" cy="${f(cy + Math.sin(a) * ry)}" r="${f(rand.range(3, 6))}" fill="${color}" opacity=".85"/></g>`;
  }
  return out;
}

function baguaRing(cx, cy, r, color) {
  let out = `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 1.22)}" fill="none" stroke="${color}" stroke-width="1" opacity=".35"/>
    <circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 0.72)}" fill="none" stroke="${color}" stroke-width="1" opacity=".35" stroke-dasharray="2 4"/>`;
  TRIGRAMS.forEach((lines, i) => {
    const deg = i * 45;
    const w = r * 0.32;
    let g = '';
    lines.forEach((solid, j) => {
      const yy = -r - j * 7;
      g += solid
        ? `<path d="M${f(-w / 2)} ${f(yy)}h${f(w)}"/>`
        : `<path d="M${f(-w / 2)} ${f(yy)}h${f(w * 0.4)}M${f(w * 0.1)} ${f(yy)}h${f(w * 0.4)}"/>`;
    });
    out += `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${deg})">${g}</g>`;
  });
  return `<g stroke="${color}" stroke-width="3" stroke-linecap="round" opacity=".55">${out}</g>`;
}

function seal(cx, cy, size, han, fg, deep) {
  const s = size;
  const big = han.length > 1 ? s * 0.42 : s * 0.62;
  return `<g transform="translate(${f(cx)} ${f(cy)})">
    <rect x="${f(-s / 2)}" y="${f(-s / 2)}" width="${f(s)}" height="${f(s)}" rx="${f(s * 0.12)}" fill="${fg}" opacity=".95"/>
    <rect x="${f(-s / 2 + 6)}" y="${f(-s / 2 + 6)}" width="${f(s - 12)}" height="${f(s - 12)}" rx="${f(s * 0.08)}" fill="none" stroke="${deep}" stroke-width="2"/>
    <text x="0" y="${f(big * 0.36)}" text-anchor="middle" font-size="${f(big)}" fill="${deep}" font-family="'Noto Serif TC','Songti TC','PMingLiU','SimSun','Noto Serif CJK TC',serif" font-weight="700"${han.length > 1 ? ` letter-spacing="2"` : ''}>${han}</text></g>`;
}

/* ---------- Ghép bìa ---------- */
let uid = 0;

/**
 * Vẽ bìa cho một bài viết.
 * @param {object} p bài viết (đã bản địa hoá hay chưa đều được — chỉ dùng id, topic, refs)
 * @param {'wide'|'tall'} shape wide: thẻ trong danh sách (16:9) · tall: nền dọc của bảng tin
 * @param {{eyebrow?: string, title?: string}} label chữ in trên bìa (chỉ dùng cho wide)
 */
export function cover(p, shape = 'wide', label = {}) {
  const rand = rng(hash(`${p.id}|${p.topic}`));
  const topic = PALETTES[p.topic] ? p.topic : 'tarot';
  const [c0, c1, c2, fg, soft] = rand.pick(PALETTES[topic]);
  const W = shape === 'tall' ? 360 : 480;
  const H = shape === 'tall' ? 640 : 270;
  const id = `cv${++uid}`;

  const refs = p.refs || [];
  const cardRef = refs.find((r) => cardById[r]);
  const signRef = refs.find((r) => signById[r]);
  const chiRef = refs.find((r) => chiById[r]);

  // Điểm nhấn của hoạ tiết: bên phải (bìa ngang, chừa chỗ cho chữ) hoặc phần trên (bìa dọc)
  const mirror = shape === 'wide' && !label.title && rand() < 0.35;
  // (bìa dọc có tranh lá bài: căn giữa cố định để khung tranh luôn nằm đúng giữa vòng hào quang)
  const mx = shape === 'tall' ? (cardRef ? W / 2 : W * rand.range(0.42, 0.58)) : mirror ? W * 0.3 : W * rand.range(0.68, 0.76);
  const my = shape === 'tall' ? (cardRef ? H * 0.25 : H * rand.range(0.2, 0.28)) : H * rand.range(0.42, 0.52);
  const unit = shape === 'tall' ? 150 : 120;

  const angle = rand.int(0, 3) * 45 + rand.int(-12, 12);
  let art = '';

  // Lớp 1: nền chuyển màu + quầng sáng quanh hoạ tiết
  art += `<defs>
    <linearGradient id="${id}g" gradientTransform="rotate(${angle} .5 .5)"><stop offset="0" stop-color="${c0}"/><stop offset=".55" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
    <radialGradient id="${id}r"><stop offset="0" stop-color="${soft}" stop-opacity=".55"/><stop offset="1" stop-color="${soft}" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#${id}g)"/>
  <circle cx="${f(mx)}" cy="${f(my)}" r="${f(unit * 1.5)}" fill="url(#${id}r)"/>`;

  // Lớp 2: tia sáng
  if (rand() < 0.8) art += rays(mx, my, rand.int(18, 34), Math.max(W, H), soft, rand);

  // Lớp 3: sao lấp lánh
  const stars = rand.int(7, 16);
  for (let i = 0; i < stars; i++) art += sparkle(rand.range(0, W), rand.range(0, H * 0.75), rand.range(2, 7), soft, f(rand.range(0.35, 0.9)));

  // Lớp 4: hoạ tiết theo chủ đề
  if (topic === 'chiem-tinh') {
    if (rand() < 0.7) art += orbits(mx, my, unit * 0.75, soft, rand);
    const size = unit * 1.25;
    art += constellation(signRef, mx - size / 2, my - size / 2, size, fg, rand);
    const glyph = signRef ? signById[signRef].glyph : rand.pick(PLANET_GLYPHS);
    const gx = shape === 'tall' ? mx + size * 0.5 : mirror ? mx + size * 0.62 : mx - size * 0.78;
    art += `<text x="${f(gx)}" y="${f(shape === 'tall' ? my - size * 0.42 : my + size * 0.5)}" text-anchor="middle" font-size="${f(unit * 0.5)}" fill="${fg}" opacity=".9" font-family="'Segoe UI Symbol','Noto Sans Symbols','DejaVu Sans',serif">${glyph}&#xFE0E;</text>`;
  } else if (topic === 'tu-vi') {
    if (rand() < 0.75) art += baguaRing(mx, my, unit * 0.62, fg);
    const han = chiRef ? BRANCH_HAN[chiById[chiRef].index] : rand.pick(FALLBACK_HAN);
    art += seal(mx, my, unit * 0.62, han, fg, c0);
  } else if (!cardRef) {
    const key = rand.pick(Object.keys(SUIT_ART));
    const s = unit * 1.15;
    art += `<g transform="translate(${f(mx - s / 2)} ${f(my - s / 2)}) scale(${f(s / 100)})" fill="none" stroke="${fg}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" opacity=".92">${SUIT_ART[key]}</g>`;
    // trăng lưỡi liềm
    art += `<path d="M${f(mx + s * 0.55)} ${f(my - s * 0.72)}a${f(s * 0.16)} ${f(s * 0.16)} 0 1 0 ${f(s * 0.2)} ${f(s * 0.28)}a${f(s * 0.12)} ${f(s * 0.12)} 0 1 1 ${f(-s * 0.2)} ${f(-s * 0.28)}z" fill="${fg}" opacity=".85"/>`;
  } else {
    // có tranh lá bài: vòng hào quang phía sau khung tranh (tranh là thẻ <img> tải lười, xếp chồng bằng CSS)
    art += `<circle cx="${f(mx)}" cy="${f(my)}" r="${f(unit * 0.9)}" fill="none" stroke="${fg}" stroke-width="1.2" opacity=".5" stroke-dasharray="3 6"/>
      <circle cx="${f(mx)}" cy="${f(my)}" r="${f(unit * 1.1)}" fill="none" stroke="${fg}" stroke-width="1" opacity=".3"/>`;
  }

  // Lớp 5: mây lành ở một góc dưới (hướng ngẫu nhiên), thêm một cụm nhỏ phía trên với bìa dọc
  const right = mirror ? rand() < 0.3 : rand() < 0.75;
  const cs = shape === 'tall' ? rand.range(1.1, 1.4) : rand.range(0.75, 1);
  art += clouds(right ? W - 60 * cs : 60 * cs, H - 18 * cs, cs, soft, c1, rand, !right);
  if (shape === 'wide' && rand() < 0.3) art += clouds(right ? 30 : W - 30, H * rand.range(0.05, 0.14), cs * 0.45, soft, c1, rand, right);

  const img = cardRef
    ? `<img class="cover-card${rand() < 0.5 ? ' tilt-l' : ''}" src="assets/tarot/${esc(cardRef)}.jpg" alt="" loading="lazy" decoding="async" width="300" height="520" style="--x:${f((mx / W) * 100)}%;--y:${f((my / H) * 100)}%" />`
    : '';
  const text =
    shape === 'wide' && (label.title || label.eyebrow)
      ? `<div class="cover-text${mirror ? ' right' : ''}" aria-hidden="true">${label.eyebrow ? `<span class="cover-eyebrow">${esc(label.eyebrow)}</span>` : ''}${label.title ? `<span class="cover-title">${esc(label.title)}</span>` : ''}</div>`
      : '';

  return `<div class="cover cover-${shape}" style="--cv-ink:${fg};--cv-deep:${c0}">
    <svg class="cover-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">${art}</svg>${img}${text}</div>`;
}
