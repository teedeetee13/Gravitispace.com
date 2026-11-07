# Nhật ký phiên bản

Theo [Semantic Versioning](https://semver.org/lang/vi/). Phát hành bằng thẻ `vX.Y.Z` (xem docs/BAN-GIAO.md mục 3).

## 2.2.0 — 07/11/2026

### Thêm
- **6 ngôn ngữ mới**, dịch đủ 100%: Tây Ban Nha (Tây Ban Nha, Argentina, Chile, Mỹ Latinh), Pháp, Đức, Trung phồn thể (Đài Loan, Hồng Kông), Hindi (Ấn Độ), Thái. Ô chọn ngôn ngữ thay cho nút VI/EN; tự nhận ngôn ngữ trình duyệt ở lần đầu.
- Tiếng Trung hiển thị Can Chi, tên sao, cung, độ sáng bằng **chữ Hán gốc** (紫微, 命宮, 廟/陷, 甲子…).
- **Ảnh bìa cho từng bài viết** (`cover.js`): SVG vẽ theo hạt giống, mỗi bài một bìa, hoạ tiết theo nội dung (tranh lá bài Rider–Waite–Smith, chòm sao thật, ấn triện chữ Hán Địa Chi, Bát Quái, mây lành). Có trên thẻ bài, trang bài và nền bảng tin.
- Đường dây hỗ trợ quốc tế (Find A Helpline) + số tại chỗ cho từng nước; nhận diện cụm từ khủng hoảng ở 8 ngôn ngữ.
- Gợi ý múi giờ theo kinh độ cho người sinh ngoài Việt Nam.
- CI/CD: kiểm thử Node 20 + 22, đóng gói `dist/`, phát hành theo thẻ kèm zip + SHA-256, CodeQL, Dependabot.
- `npm run build`, `npm run package`, `npm run verify`, `npm run i18n:missing`.
- `SECURITY.md`, `docs/BAN-GIAO.md`, `web/_headers`, kiểm thử bảo mật tĩnh (`tests/security.test.mjs`).

### Sửa
- CSDL chỉ nhận bài tiếng Việt/Anh → nhận đủ 8 ngôn ngữ (`posts_lang_check`). **Cần chạy lại `supabase/schema.sql`.**
- Câu luận giải bản đồ sao tiếng Anh bị lặp "Your your …".
- Chống nhúng trang vào khung web lạ (clickjacking) trên GitHub Pages.

## 2.1.0 — 06/11/2026
- Tài khoản Supabase, đồng bộ nhiều máy, offline; ~40 phụ tinh, 3 vòng sao, độ sáng sao theo 2 trường phái.

## 2.0.0 — 06/11/2026
- Lá số Tử Vi Đẩu Số, bản đồ sao, bản mệnh tổng hợp, song ngữ Việt/Anh, PWA.
