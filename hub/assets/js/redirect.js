// Chỉ có trên trang chính. Trước 2.3.0, Graviti Stars nằm ở gốc web với đường dẫn kiểu "#/tarot".
// Link cũ, dấu trang cũ và ứng dụng đã cài lên màn hình chính → chuyển sang stars/ để không ai bị lạc.
(function () {
  if (/^#\//.test(location.hash)) {
    location.replace('stars/' + location.hash);
    return;
  }
  try {
    if (window.matchMedia('(display-mode: standalone)').matches) location.replace('stars/');
  } catch (e) {}
})();
