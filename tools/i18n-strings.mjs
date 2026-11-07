// Công cụ cho người dịch: liệt kê mọi câu luận giải song ngữ { vi, en } trong web/assets/js/data/.
// Ngôn ngữ thứ ba trở đi dịch theo câu tiếng Anh (khoá) — xem web/assets/js/i18n.js → tr().
//   node tools/i18n-strings.mjs            → in danh sách câu (JSON) để gửi người dịch
//   node tools/i18n-strings.mjs fr         → chỉ in các câu tệp fr-text.js còn thiếu
import { pathToFileURL, fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const DATA = join(dirname(fileURLToPath(import.meta.url)), '..', 'web', 'assets', 'js', 'data');
const FILES = ['tuvi-stars.js', 'astro-texts.js', 'tuvi-brightness.js'];

export async function bilingualStrings() {
  const out = new Set();
  const walk = (o) => {
    if (!o || typeof o !== 'object') return;
    if (typeof o.vi === 'string' && typeof o.en === 'string') return void out.add(o.en);
    Object.values(o).forEach(walk);
  };
  for (const f of FILES) walk(await import(pathToFileURL(join(DATA, f)).href));
  return [...out];
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const all = await bilingualStrings();
  const lang = process.argv[2];
  let list = all;
  if (lang) {
    const T = (await import(pathToFileURL(join(DATA, '..', 'i18n', `${lang}-text.js`)).href).catch(() => ({ default: {} }))).default;
    list = all.filter((s) => !T[s]);
  }
  console.log(JSON.stringify(list, null, 1));
  console.error(`${list.length} câu`);
}
