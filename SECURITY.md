# Chính sách bảo mật — Hữu Duyên

## Báo lỗ hổng

Nếu bạn phát hiện lỗ hổng bảo mật, **xin đừng mở issue công khai**. Hãy báo riêng qua
GitHub → tab **Security** → **Report a vulnerability** (Private vulnerability reporting) của kho mã này.
Mô tả: lỗi gì, cách tái hiện, ảnh hưởng. Chúng tôi phản hồi trong vòng 7 ngày và ghi công người báo nếu bạn muốn.

## Phạm vi

| Thành phần | Trong phạm vi |
|---|---|
| Mã web (`web/`), cấu hình CI/CD (`.github/`), lược đồ CSDL (`supabase/schema.sql`) | Có |
| Hạ tầng của GitHub Pages, Supabase, Google Fonts | Không (báo cho nhà cung cấp tương ứng) |

## Các lớp bảo vệ đang có

| Lớp | Cách làm | Kiểm chứng tự động |
|---|---|---|
| Chống chèn mã (XSS) | Mọi nội dung đưa vào HTML đều qua `esc()`; CSP `script-src 'self'`, không mã nội tuyến, không `eval` | `tests/security.test.mjs` + CodeQL |
| Chống nhúng khung (clickjacking) | `frame-ancestors 'none'` + `X-Frame-Options: DENY` (tệp `web/_headers`); trên GitHub Pages: `boot.js` tự thoát khỏi khung lạ | `tests/security.test.mjs` |
| Tiêu đề HTTP | HSTS, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP trong `web/_headers` (Netlify / Cloudflare Pages) | `tests/security.test.mjs` |
| Dữ liệu người dùng | Supabase Row Level Security: mỗi người chỉ đọc/sửa dòng của mình; bài cộng đồng chỉ hiện khi đã duyệt; không có quyền UPDATE trạng thái từ phía người dùng | `tests/cloud.test.mjs`, `tests/security.test.mjs` |
| Ràng buộc dữ liệu | Giới hạn độ dài bài, số tham chiếu, ngôn ngữ hợp lệ, `refs` chỉ gồm chữ thường/số/gạch ngang, `user_state` ≤ 1 MB | `supabase/schema.sql` |
| Bí mật | Không có bí mật trong mã. Khoá `anon` của Supabase là khoá công khai theo thiết kế; khoá `service_role` **không bao giờ** được đưa vào web — CI sẽ chặn nếu lỡ dán | `tests/security.test.mjs` |
| Chuỗi cung ứng | Web không có thư viện npm. CI chỉ dùng action chính chủ GitHub (`actions/*`, `github/codeql-action`), quyền tối thiểu (`contents: read`), Dependabot tự đề xuất cập nhật action | `.github/dependabot.yml` |
| Quét mã | CodeQL (bộ truy vấn `security-extended`) mỗi lần đẩy mã và hằng tuần | `.github/workflows/codeql.yml` |
| Toàn vẹn bản giao | Mỗi bản phát hành có `SHA256SUMS.txt` (từng tệp) và mã SHA-256 của tệp zip | `tools/build.mjs`, `tools/package.mjs` |
| Người dùng gặp khủng hoảng | Nhận diện cụm từ nguy hiểm ở 8 ngôn ngữ → hiện đường dây hỗ trợ trước khi đăng/tìm | `web/assets/js/data/taxonomy.js` |

## Việc định kỳ cho người vận hành

- Mỗi quý: đổi mật khẩu CSDL Supabase, rà danh sách người có quyền vào Dashboard và kho GitHub (bật 2FA cho tất cả).
- Khi Dependabot mở pull request: đọc ghi chú phát hành rồi gộp.
- Khi CodeQL báo cảnh báo: xử lý trong tab Security → Code scanning.
- Kiểm tra lại số đường dây nóng mỗi năm (`taxonomy.js`, các tệp `i18n/*-content.js`).
