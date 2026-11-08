// Vị trí Mặt Trời, Mặt Trăng, các hành tinh và cung Mọc (hoàng đạo nhiệt đới, xuân phân của ngày).
// Thuật toán: Paul Schlyter, "How to compute planetary positions" (https://stjarnhimlen.se/comp/ppcomp.html),
// gồm các số hạng nhiễu loạn chính của Mặt Trăng, Sao Mộc, Sao Thổ, Sao Thiên Vương.
// Độ chính xác: Mặt Trời/Mặt Trăng/hành tinh trong ~1–2 phút cung tới vài phần mười độ (1900–2100),
// đủ cho việc xác định cung và độ trong cung. Module thuần, không đụng DOM.

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;
const rev = (x) => x - Math.floor(x / 360) * 360;
const sind = (x) => Math.sin(x * RAD);
const cosd = (x) => Math.cos(x * RAD);
const atan2d = (y, x) => Math.atan2(y, x) * DEG;

/** Số ngày tính từ 2000-01-00 0h UT (gốc thời gian của Schlyter). */
export function dayNumber(year, month, day, utHours) {
  const INT = Math.trunc;
  return 367 * year - INT((7 * (year + INT((month + 9) / 12))) / 4) + INT((275 * month) / 9) + day - 730530 + utHours / 24;
}

const obliquity = (d) => 23.4393 - 3.563e-7 * d;

/** Giải phương trình Kepler, trả về [x, y] trong mặt phẳng quỹ đạo. */
function orbitXY(M, e, a) {
  let E = M + e * DEG * sind(M) * (1 + e * cosd(M));
  for (let i = 0; i < 20; i++) {
    const dE = (E - e * DEG * sind(E) - M) / (1 - e * cosd(E));
    E -= dE;
    if (Math.abs(dE) < 1e-6) break;
  }
  return [a * (cosd(E) - e), a * Math.sqrt(1 - e * e) * sind(E)];
}

/** Toạ độ hoàng đạo (x, y, z) từ yếu tố quỹ đạo. */
function eclipticXYZ({ N, i, w, a, e, M }) {
  const [xv, yv] = orbitXY(M, e, a);
  const v = atan2d(yv, xv);
  const r = Math.hypot(xv, yv);
  return [
    r * (cosd(N) * cosd(v + w) - sind(N) * sind(v + w) * cosd(i)),
    r * (sind(N) * cosd(v + w) + cosd(N) * sind(v + w) * cosd(i)),
    r * sind(v + w) * sind(i),
  ];
}

const ELEMENTS = {
  mercury: (d) => ({ N: 48.3313 + 3.24587e-5 * d, i: 7.0047 + 5.0e-8 * d, w: 29.1241 + 1.01444e-5 * d, a: 0.387098, e: 0.205635 + 5.59e-10 * d, M: 168.6562 + 4.0923344368 * d }),
  venus: (d) => ({ N: 76.6799 + 2.4659e-5 * d, i: 3.3946 + 2.75e-8 * d, w: 54.891 + 1.38374e-5 * d, a: 0.72333, e: 0.006773 - 1.302e-9 * d, M: 48.0052 + 1.6021302244 * d }),
  mars: (d) => ({ N: 49.5574 + 2.11081e-5 * d, i: 1.8497 - 1.78e-8 * d, w: 286.5016 + 2.92961e-5 * d, a: 1.523688, e: 0.093405 + 2.516e-9 * d, M: 18.6021 + 0.5240207766 * d }),
  jupiter: (d) => ({ N: 100.4542 + 2.76854e-5 * d, i: 1.303 - 1.557e-7 * d, w: 273.8777 + 1.64505e-5 * d, a: 5.20256, e: 0.048498 + 4.469e-9 * d, M: 19.895 + 0.0830853001 * d }),
  saturn: (d) => ({ N: 113.6634 + 2.3898e-5 * d, i: 2.4886 - 1.081e-7 * d, w: 339.3939 + 2.97661e-5 * d, a: 9.55475, e: 0.055546 - 9.499e-9 * d, M: 316.967 + 0.0334442282 * d }),
  uranus: (d) => ({ N: 74.0005 + 1.3978e-5 * d, i: 0.7733 + 1.9e-8 * d, w: 96.6612 + 3.0565e-5 * d, a: 19.18171 - 1.55e-8 * d, e: 0.047318 + 7.45e-9 * d, M: 142.5905 + 0.011725806 * d }),
  neptune: (d) => ({ N: 131.7806 + 3.0173e-5 * d, i: 1.77 - 2.55e-7 * d, w: 272.8461 - 6.027e-6 * d, a: 30.05826 + 3.313e-8 * d, e: 0.008606 + 2.15e-9 * d, M: 260.2471 + 0.005995147 * d }),
};

function sun(d) {
  const w = 282.9404 + 4.70935e-5 * d;
  const e = 0.016709 - 1.151e-9 * d;
  const M = rev(356.047 + 0.9856002585 * d);
  const [xv, yv] = orbitXY(M, e, 1);
  const lon = rev(atan2d(yv, xv) + w);
  const r = Math.hypot(xv, yv);
  return { lon, r, M, L: rev(M + w), x: r * cosd(lon), y: r * sind(lon) };
}

function moon(d, s) {
  const el = { N: 125.1228 - 0.0529538083 * d, i: 5.1454, w: 318.0634 + 0.1643573223 * d, a: 60.2666, e: 0.0549, M: rev(115.3654 + 13.0649929509 * d) };
  const [x, y] = eclipticXYZ(el);
  let lon = atan2d(y, x);
  const Lm = rev(el.N + el.w + el.M);
  const D = Lm - s.L;
  const F = Lm - el.N;
  const Ms = s.M;
  const Mm = el.M;
  lon +=
    -1.274 * sind(Mm - 2 * D) + 0.658 * sind(2 * D) - 0.186 * sind(Ms) - 0.059 * sind(2 * Mm - 2 * D) - 0.057 * sind(Mm - 2 * D + Ms) +
    0.053 * sind(Mm + 2 * D) + 0.046 * sind(2 * D - Ms) + 0.041 * sind(Mm - Ms) - 0.035 * sind(D) - 0.031 * sind(Mm + Ms) -
    0.015 * sind(2 * F - 2 * D) + 0.011 * sind(Mm - 4 * D);
  return rev(lon);
}

function planetHelio(name, d) {
  const el = ELEMENTS[name](d);
  el.M = rev(el.M);
  let [x, y, z] = eclipticXYZ(el);
  const Mj = rev(19.895 + 0.0830853001 * d);
  const Ms = rev(316.967 + 0.0334442282 * d);
  const Mu = rev(142.5905 + 0.011725806 * d);
  let dLon = 0;
  if (name === 'jupiter')
    dLon = -0.332 * sind(2 * Mj - 5 * Ms - 67.6) - 0.056 * sind(2 * Mj - 2 * Ms + 21) + 0.042 * sind(3 * Mj - 5 * Ms + 21) - 0.036 * sind(Mj - 2 * Ms) +
      0.022 * cosd(Mj - Ms) + 0.023 * sind(2 * Mj - 3 * Ms + 52) - 0.016 * sind(Mj - 5 * Ms - 69);
  if (name === 'saturn')
    dLon = 0.812 * sind(2 * Mj - 5 * Ms - 67.6) - 0.229 * cosd(2 * Mj - 4 * Ms - 2) + 0.119 * sind(Mj - 2 * Ms - 3) + 0.046 * sind(2 * Mj - 6 * Ms - 69) +
      0.014 * sind(Mj - 3 * Ms + 32);
  if (name === 'uranus') dLon = 0.04 * sind(Ms - 2 * Mu + 6) + 0.035 * sind(Ms - 3 * Mu + 33) - 0.015 * sind(Mj - Mu + 20);
  if (dLon) {
    const lon = atan2d(y, x) + dLon;
    const r = Math.hypot(x, y);
    [x, y] = [r * cosd(lon), r * sind(lon)];
  }
  return [x, y, z];
}

/** Sao Diêm Vương theo chuỗi gần đúng của Schlyter (hợp lệ khoảng 1885–2099). */
function plutoHelio(d) {
  const S = 50.03 + 0.033459652 * d;
  const P = 238.95 + 0.003968789 * d;
  const lon =
    238.9508 + 0.00400703 * d - 19.799 * sind(P) + 19.848 * cosd(P) + 0.897 * sind(2 * P) - 4.956 * cosd(2 * P) + 0.61 * sind(3 * P) +
    1.211 * cosd(3 * P) - 0.341 * sind(4 * P) - 0.19 * cosd(4 * P) + 0.128 * sind(5 * P) - 0.034 * cosd(5 * P) - 0.038 * sind(6 * P) +
    0.031 * cosd(6 * P) + 0.02 * sind(S - P) - 0.01 * cosd(S - P);
  const lat = -3.9082 - 5.453 * sind(P) - 14.975 * cosd(P) + 3.527 * sind(2 * P) + 1.673 * cosd(2 * P) - 1.051 * sind(3 * P) + 0.328 * cosd(3 * P) +
    0.179 * sind(4 * P) - 0.292 * cosd(4 * P) + 0.019 * sind(5 * P) + 0.1 * cosd(5 * P) - 0.031 * sind(6 * P) - 0.026 * cosd(6 * P) + 0.011 * cosd(S - P);
  const r = 40.72 + 6.68 * sind(P) + 6.9 * cosd(P) - 1.18 * sind(2 * P) - 0.03 * cosd(2 * P) + 0.15 * sind(3 * P) - 0.14 * cosd(3 * P);
  // Chuỗi trên cho toạ độ theo xuân phân J2000; cộng thêm tuế sai để về xuân phân của ngày
  const lonDate = lon + 3.82394e-5 * d;
  return [r * cosd(lat) * cosd(lonDate), r * cosd(lat) * sind(lonDate), r * sind(lat)];
}

export const BODIES = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

/** Kinh độ hoàng đạo (độ, 0 = 0° Bạch Dương) của mọi thiên thể tại thời điểm UT. */
export function positions(d) {
  const s = sun(d);
  const out = { sun: s.lon, moon: moon(d, s) };
  for (const name of ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune']) {
    const [x, y] = planetHelio(name, d);
    out[name] = rev(atan2d(y + s.y, x + s.x));
  }
  const [px, py] = plutoHelio(d);
  out.pluto = rev(atan2d(py + s.y, px + s.x));
  return out;
}

/** Thiên thể có đang nghịch hành không (so vị trí trước/sau nửa ngày). */
export function isRetrograde(body, d) {
  if (body === 'sun' || body === 'moon') return false;
  const a = positions(d - 0.5)[body];
  const b = positions(d + 0.5)[body];
  let diff = b - a;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff < 0;
}

/** Cung Mọc (Ascendant) và Thiên Đỉnh (MC), theo độ hoàng đạo. lat, lon: độ (Đông dương). */
export function angles(d, utHours, lat, lon) {
  const s = sun(d);
  const gmst0 = rev(s.L + 180); // độ
  const ramc = rev(gmst0 + utHours * 15.04107 + lon);
  const eps = obliquity(d);
  const asc = rev(atan2d(-cosd(ramc), sind(eps) * Math.tan(lat * RAD) + cosd(eps) * sind(ramc)) + 180);
  const mc = rev(atan2d(sind(ramc), cosd(ramc) * cosd(eps)));
  return { asc, mc, ramc };
}

// Năm góc chiếu chính (Ptolemy) và biên độ (orb). Mặt Trời, Mặt Trăng được cộng thêm 2° theo thông lệ.
export const ASPECTS = [
  { id: 'conjunction', angle: 0, orb: 8 },
  { id: 'opposition', angle: 180, orb: 8 },
  { id: 'trine', angle: 120, orb: 7 },
  { id: 'square', angle: 90, orb: 7 },
  { id: 'sextile', angle: 60, orb: 5 },
];
const OUTER = new Set(['uranus', 'neptune', 'pluto']);
const LUMINARY = new Set(['sun', 'moon']);

/**
 * Các góc chiếu giữa những thiên thể (bỏ qua cặp hai hành tinh ngoài vì mang tính thế hệ).
 * @param {{id:string, lon:number}[]} bodies
 * @returns {{a:string, b:string, aspect:string, exact:number, orb:number}[]} xếp theo độ chặt
 */
export function findAspects(bodies) {
  const out = [];
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const A = bodies[i];
      const B = bodies[j];
      if (OUTER.has(A.id) && OUTER.has(B.id)) continue;
      let sep = Math.abs(A.lon - B.lon) % 360;
      if (sep > 180) sep = 360 - sep;
      const bonus = LUMINARY.has(A.id) || LUMINARY.has(B.id) ? 2 : 0;
      for (const asp of ASPECTS) {
        const diff = Math.abs(sep - asp.angle);
        if (diff <= asp.orb + bonus) {
          out.push({ a: A.id, b: B.id, aspect: asp.id, exact: sep, orb: diff });
          break;
        }
      }
    }
  }
  return out.sort((x, y) => x.orb - y.orb);
}

/** Kinh độ hoàng đạo → { sign: 0..11, deg: độ trong cung } */
export const toSign = (lon) => ({ sign: Math.floor(rev(lon) / 30), deg: rev(lon) % 30 });

/**
 * Bản đồ sao lúc sinh.
 * @param {object} p { year, month, day, hour, minute, tz (giờ lệch UTC), lat, lon, timeKnown }
 */
export function natalChart({ year, month, day, hour = 12, minute = 0, tz = 7, lat, lon, timeKnown = true }) {
  const ut = hour + minute / 60 - tz;
  const d = dayNumber(year, month, day, ut);
  const pos = positions(d);
  const bodies = BODIES.map((id) => ({ id, lon: pos[id], ...toSign(pos[id]), retro: isRetrograde(id, d) }));
  let ang = null;
  if (timeKnown && Number.isFinite(lat) && Number.isFinite(lon)) {
    // dayNumber đã gồm phần giờ; angles cần d của 0h UT và giờ UT tách riêng
    const d0 = dayNumber(year, month, day, 0);
    ang = angles(d0, ut, lat, lon);
  }
  // Nhà theo hệ "cung trọn" (Whole Sign) tính từ cung Mọc; không rõ giờ thì tính từ cung Mặt Trời
  const firstSign = ang ? toSign(ang.asc).sign : toSign(pos.sun).sign;
  bodies.forEach((b) => (b.house = ((b.sign - firstSign + 12) % 12) + 1));
  // Mặt Trăng đi ~13°/ngày: nếu không rõ giờ, kiểm tra xem trong ngày nó có đổi cung không
  let moonUncertain = false;
  if (!timeKnown) {
    const startOfDay = toSign(positions(dayNumber(year, month, day, -tz)).moon).sign;
    const endOfDay = toSign(positions(dayNumber(year, month, day, 24 - tz)).moon).sign;
    moonUncertain = startOfDay !== endOfDay;
  }
  return { d, bodies, angles: ang, ascSign: ang ? toSign(ang.asc) : null, mcSign: ang ? toSign(ang.mc) : null, houseBase: ang ? 'asc' : 'sun', firstSign, moonUncertain };
}
