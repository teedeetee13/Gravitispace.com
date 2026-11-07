// Chạy trước khi vẽ trang (không phải module) để tránh nháy màu và nháy ngôn ngữ.
// Tách khỏi index.html để Content-Security-Policy không cần cho phép mã nội tuyến.
(function () {
  // Chống nhúng trang vào khung của web lạ (clickjacking) — GitHub Pages không gửi được tiêu đề frame-ancestors
  if (window.top !== window.self) {
    try {
      window.top.location = window.self.location;
    } catch (e) {
      document.documentElement.style.display = 'none';
    }
  }
  try {
    var theme = localStorage.getItem('huuduyen:theme');
    if (theme) document.documentElement.dataset.theme = theme;
    var html = { vi: 'vi', en: 'en', es: 'es', fr: 'fr', de: 'de', zh: 'zh-Hant', hi: 'hi', th: 'th' };
    var lang = localStorage.getItem('huuduyen:lang');
    if (html[lang]) document.documentElement.lang = html[lang];
  } catch (e) {}
})();
