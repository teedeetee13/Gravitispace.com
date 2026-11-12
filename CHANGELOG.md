# Nhật ký phiên bản

Theo [Semantic Versioning](https://semver.org/lang/vi/). Phát hành bằng thẻ `vX.Y.Z` (xem docs/SO-TAY.md mục 5).

## Chưa phát hành

### Thêm
- **Đăng nhập bằng Google** ở Graviti Stars (luồng PKCE, không thêm thư viện). Phải tích ô đồng ý chính sách trước khi bấm; phiên bản chính sách được ghi vào tài khoản. Link giả mạo hay mã bị lộ không đăng nhập được. Cần bật Google trong Supabase (docs/CAU-HINH.md mục 4b).
- **Không gian của bạn** trên trang chính Graviti: khi đã đăng nhập, đầu trang hiện lá bài hôm nay, bản mệnh, tủ đã cất, trạng thái đồng bộ. Một tài khoản dùng chung cho mọi dịch vụ. Nút *Đăng nhập* trên thanh trên cùng (9 ngôn ngữ).
- Chính sách quyền riêng tư: thêm dòng dữ liệu khi đăng nhập bằng Google.

## 2.3.0 — 12/11/2026

### Đổi tên và cấu trúc
- **An Sao Space → Graviti Stars** (tên tiếng Việt vẫn là An Sao), thuộc hệ **Graviti** (`gravitispace.com`). Trang *Về* ở 8 ngôn ngữ kể ý nghĩa tên. Ảnh chia sẻ vẽ lại.
- **Một web, chia theo đường dẫn** (tốt cho SEO): trang chính ở `/`, Graviti Stars ở `/stars/`, chính sách ở `/privacy/`, quản trị ở `/admin/`. Link cũ dạng `#/tarot` và ứng dụng đã cài tự chuyển sang `/stars/`. Dữ liệu trên máy giữ nguyên (khoá `ansao:` không đổi).
- Kho GitHub đổi tên thành `Gravitispace.com`. Web tạm chạy ở `teedeetee13.github.io/Gravitispace.com/`, cùng nguồn với địa chỉ cũ nên dữ liệu trên máy vẫn còn.
- Tệp xuất mang `"app": "graviti-stars"`; tệp xuất cũ `an-sao-space` vẫn nạp được.

### Thêm
- **Trang chính Graviti, 9 ngôn ngữ** (có tiếng Hàn): 4 dịch vụ, các phân môn của Stars, lý do đặt tên, nguyên tắc, lộ trình. Chọn ngôn ngữ và giao diện một lần, cả hệ nhớ.
- **Trang quản trị** (`/admin/`, chỉ Việt/Anh): web có sống không, bản phát hành, kiểm thử, pull request, bảo vệ nhánh, nội dung, độ phủ bản dịch, lộ trình, 14 việc cần làm (5 tự kiểm tra), kế hoạch 5 giai đoạn. **Bản công khai không chứa trang này**. Chỉ `npm run build:admin` mới có, và chỉ dùng sau khi Cloudflare Access chặn `/admin/*`.
- **Luật Bảo vệ dữ liệu cá nhân (91/2025/QH15):** trang Chính sách quyền riêng tư (Việt + Anh); **ô đồng ý bắt buộc, không đánh sẵn** khi đăng ký; chưa đồng ý thì không gửi gì lên máy chủ; lưu phiên bản và thời điểm đồng ý vào tài khoản.
- `hub/_headers`: tiêu đề bảo mật cho cả web, CSP riêng từng nhóm trang.
- `docs/CAU-HINH.md` (cấu hình từng bước), `docs/GRAVITI.md` (đường dẫn hay tên miền phụ, so sánh hosting, chi phí AI).

### Sửa
- Graviti Stars: trình duyệt ở ngôn ngữ chưa hỗ trợ (vd. tiếng Hàn) giờ hiện tiếng Anh thay vì tiếng Việt, và không ghi đè ngôn ngữ người dùng đã chọn ở trang chính.
- Thêm dòng bản quyền vào `tuvi-stars.js`.
- 110 kiểm thử (thêm 12).

## 2.2.1 — 10/11/2026

Bản phát hành chính thức đầu tiên, sau đợt rà soát bảo mật. Các lỗi dưới đây nằm ở phần tài khoản, chỉ có tác dụng khi bật Supabase. **Ai đã bật Supabase cần chạy lại `supabase/schema.sql`.**

### Bảo mật
- Chống giả liên kết đăng nhập: chỉ nhận token trên URL nếu chính trình duyệt đó vừa yêu cầu email xác nhận hoặc đặt lại mật khẩu. Trước đây, một link chứa token của kẻ xấu có thể đưa ngày giờ sinh của nạn nhân sang tài khoản kẻ đó.
- Xoá tài khoản giờ xoá luôn bản sao dữ liệu trên máy. Trước đây bản sao vẫn còn lại.
- CSDL: người đọc không còn lấy được `user_id` của bài viết, nên không ghép được các bài của cùng một bút danh.
- CSDL: mỗi người tối đa 10 bài mỗi giờ và 20 bài đang chờ duyệt; thời điểm đăng do máy chủ đặt.

### Thêm
- `npm start` dùng máy chủ Node không lưu đệm; chạy trên máy thì tự gỡ service worker cũ.

## 2.2.0 — 07/11/2026

### Thêm
- **Đổi tên thành An Sao Space** ("an" là bình an; "an sao" 安星 là bước xếp sao trong Tử Vi). Biểu tượng mới. Cổng chạy thử chuyển sang 5190. Tài liệu gộp vào `docs/SO-TAY.md`.
- **6 ngôn ngữ mới**, dịch đủ 100%: Tây Ban Nha (Tây Ban Nha, Argentina, Chile, Mỹ Latinh), Pháp, Đức, Trung phồn thể (Đài Loan, Hồng Kông), Hindi (Ấn Độ), Thái. Ô chọn ngôn ngữ thay cho nút VI/EN; tự nhận ngôn ngữ trình duyệt ở lần đầu.
- Tiếng Trung hiển thị Can Chi, tên sao, cung, độ sáng bằng **chữ Hán gốc** (紫微, 命宮, 廟/陷, 甲子…).
- **Ảnh bìa cho từng bài viết** (`cover.js`): SVG vẽ theo hạt giống, mỗi bài một bìa, hoạ tiết theo nội dung (tranh lá bài Rider–Waite–Smith, chòm sao thật, ấn triện chữ Hán Địa Chi, Bát Quái, mây lành). Có trên thẻ bài, trang bài và nền bảng tin.
- Đường dây hỗ trợ quốc tế (Find A Helpline) + số tại chỗ cho từng nước; nhận diện cụm từ khủng hoảng ở 8 ngôn ngữ.
- Gợi ý múi giờ theo kinh độ cho người sinh ngoài Việt Nam.
- CI/CD: kiểm thử Node 20 + 22, đóng gói `dist/`, phát hành theo thẻ kèm zip + SHA-256, CodeQL, Dependabot.
- `npm run build`, `npm run package`, `npm run verify`, `npm run i18n:missing`.
- `SECURITY.md`, sổ tay `docs/SO-TAY.md`, `web/_headers`, kiểm thử bảo mật tĩnh (`tests/security.test.mjs`).

- **Lá số Tử Vi:** ô cung theo bố cục phổ biến (chính tinh trên cùng; phụ tinh tốt bên trái, xấu bên phải); hiện đủ vòng Bác Sĩ, Thái Tuế ngay trong ô; thêm 10 sao (Thiên Quan, Thiên Phúc, Thiên Trù, Văn Tinh, Quốc Ấn, Đường Phù, Thiên Giải, Địa Giải, Thiên Không, Đẩu Quân) và Lai nhân cung; đối chiếu khớp toàn bộ với tuvi.vn.

- **Lá số Tử Vi, tùy chọn chuyên sâu:** an vòng Tướng tinh, hạn năm (chọn năm), Lưu Tứ Hóa, Lưu Tứ Đức, Lưu đại vận, sao lưu niên, Lộc Kỵ nhập, Lưu Tuần Triệt. Màu sao theo ngũ hành. Mệnh chủ an theo Chi năm sinh.

### Sửa
- CI: kiểm thử trên Node 22 và 24 (Node 20 hết hạn hỗ trợ, làm hỏng bước kiểm thử).
- CSDL chỉ nhận bài tiếng Việt/Anh → nhận đủ 8 ngôn ngữ (`posts_lang_check`). **Cần chạy lại `supabase/schema.sql`.**
- Câu luận giải bản đồ sao tiếng Anh bị lặp "Your your …".
- Chống nhúng trang vào khung web lạ (clickjacking) trên GitHub Pages.

## 2.1.0 — 06/11/2026
- Tài khoản Supabase, đồng bộ nhiều máy, offline; ~40 phụ tinh, 3 vòng sao, độ sáng sao theo 2 trường phái.

## 2.0.0 — 06/11/2026
- Lá số Tử Vi Đẩu Số, bản đồ sao, bản mệnh tổng hợp, song ngữ Việt/Anh, PWA.
