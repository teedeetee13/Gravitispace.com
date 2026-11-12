// Đường dẫn của Graviti Stars: địa chỉ thật, không dấu # (vd. gravitispace.com/stars/tarot/major-17/).
// Không phụ thuộc gì khác để auth.js, cloud.js và kiểm thử Node cũng dùng được.
//
// ROOT là thư mục gốc của ứng dụng, suy từ vị trí tệp này (assets/js/route.js), nên chạy đúng ở mọi nơi:
//   gravitispace.com/stars/ · *.workers.dev/stars/ · teedeetee13.github.io/Gravitispace.com/stars/ · localhost:5190/
// Mỗi trang có một tệp index.html dựng sẵn (tools/build.mjs) nên mở thẳng link hay tải lại trang đều chạy, không cần máy chủ.

export const ROOT = new URL('../../', import.meta.url).pathname;

/**
 * Đường dẫn trong ứng dụng → địa chỉ đầy đủ. link('tarot/major-17') → '/stars/tarot/major-17/'.
 * Thêm "/" cuối để khớp thư mục dựng sẵn, tránh máy chủ phải chuyển hướng thêm một lần.
 */
export function link(p = '') {
  const s = String(p).replace(/^\/+/, '');
  const i = s.search(/[?#]/);
  const path = i < 0 ? s : s.slice(0, i);
  const tail = i < 0 ? '' : s.slice(i);
  return ROOT + (path && !path.endsWith('/') ? path + '/' : path) + tail;
}

/** Bài viết: bài có sẵn có trang riêng; bài người dùng gửi (mã ngẫu nhiên) dùng ?id= để không cần dựng trước. */
export const postLink = (id) => (/^[a-z]{2}-\d+$/.test(id) ? link(`bai/${id}`) : link(`bai?id=${encodeURIComponent(id)}`));

/** Đọc trang hiện tại: { path: '/tarot/major-17', params, anchor }. */
export function currentRoute() {
  let rest = location.pathname.startsWith(ROOT) ? location.pathname.slice(ROOT.length) : '';
  rest = rest.replace(/index\.html$/, '').replace(/\/+$/, '');
  try {
    rest = decodeURIComponent(rest);
  } catch {}
  return { path: '/' + rest, params: new URLSearchParams(location.search), anchor: decodeURIComponent(location.hash.slice(1)) };
}

/** Chuyển trang không tải lại. main.js nghe sự kiện 'ansao:navigate' để vẽ trang mới. */
export function navigate(p, { replace = false } = {}) {
  history[replace ? 'replaceState' : 'pushState'](null, '', String(p).startsWith(ROOT) ? p : link(p));
  window.dispatchEvent(new Event('ansao:navigate'));
}

/**
 * Link kiểu cũ (trước khi bỏ dấu #): …/stars/#/tarot → …/stars/tarot/. Trả về đường dẫn mới hoặc null.
 * Bài viết cũ #/bai/<mã> → dạng mới của postLink.
 */
export function fromLegacyHash(hash) {
  if (!hash.startsWith('#/')) return null;
  const s = hash.slice(2);
  const post = s.match(/^bai\/([\w-]+)(.*)$/);
  return post ? postLink(post[1]) : link(s);
}
