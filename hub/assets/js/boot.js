// Chạy trước khi vẽ trang (không phải module): chống nhúng khung lạ, đặt giao diện sáng/tối và ngôn ngữ sớm để không nháy.
// Dùng chung khoá lưu với Graviti Stars (ansao:*) vì cùng một tên miền.
(function () {
  if (window.top !== window.self) {
    try {
      window.top.location = window.self.location;
    } catch (e) {
      document.documentElement.style.display = 'none';
    }
  }
  try {
    var theme = localStorage.getItem('ansao:theme');
    if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
    var html = { vi: 'vi', en: 'en', ko: 'ko', zh: 'zh-Hant', th: 'th', hi: 'hi', es: 'es', fr: 'fr', de: 'de' };
    var lang = localStorage.getItem('ansao:lang');
    // Trang chỉ có bản Việt/Anh cố định (chính sách quyền riêng tư) giữ nguyên lang của nó
    if (html[lang] && !document.documentElement.hasAttribute('data-fixed-lang')) document.documentElement.lang = html[lang];
  } catch (e) {}
})();
