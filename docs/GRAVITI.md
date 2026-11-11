# Graviti: tên gọi, cấu trúc, hosting, chi phí

Tài liệu cho chủ dự án. Hướng dẫn bấm từng bước nằm ở [CAU-HINH.md](CAU-HINH.md).

## 1. Tên gọi và địa chỉ

| Phần | Tên | Địa chỉ | Trạng thái |
|---|---|---|---|
| Hệ thống mẹ, trang chính | **Graviti** | `gravitispace.com` | Đã dựng (thư mục `hub/`), 9 ngôn ngữ |
| Tarot, chiêm tinh, tử vi, sau này bát tự, thần số học, Human Design | **Graviti Stars** (tên tiếng Việt: An Sao) | `gravitispace.com/stars/` | Đang chạy, 8 ngôn ngữ |
| Chữa lành / Kết nối, trung gian / Dịch vụ nhanh | Graviti Heal / Connect / Help | `/heal/`, `/connect/`, `/help/` | Chưa làm |
| Chính sách quyền riêng tư | | `/privacy/` | Đã có (Việt + Anh) |
| Trang quản trị | | `/admin/` (khoá bằng Cloudflare Access) | Giai đoạn 1 xong, chỉ Việt + Anh |

**Thương hiệu Graviti, tên miền `gravitispace.com`** (chốt 12/11/2026): tên miền đọc đúng là "Graviti Space", khớp với thương hiệu. "Graviti" là tên tự đặt từ *gravity* (lực hấp dẫn), dễ đăng ký bảo hộ hơn một từ có sẵn. Trước khi in ấn, làm logo, nên tra trùng nhãn hiệu (xem [CAU-HINH.md](CAU-HINH.md) mục 1).

**Tên miền chọn `.com`:** rẻ và ổn định khi gia hạn (khoảng 10–11 USD/năm), người dùng gõ theo thói quen, ít bị bộ lọc thư rác nghi ngờ hơn các đuôi mới. Về Google, `.com` và `.space` được xếp hạng như nhau. Tên miền không được chứa dấu gạch dưới.

## 2. Đường dẫn hay tên miền phụ?

**Graviti dùng đường dẫn cho mọi thứ người dùng thấy.** Bạn nói đúng: Google coi một tên miền là một "web", bài viết ở `/stars/` góp uy tín chung cho cả `gravitispace.com`. Tên miền phụ (`stars.gravitispace.com`) bị Google tính gần như một web riêng, phải gây dựng uy tín lại từ đầu.

| | Đường dẫn `gravitispace.com/stars/` | Tên miền phụ `stars.gravitispace.com` |
|---|---|---|
| SEO | Dồn chung uy tín | Tách riêng |
| Đăng nhập chung | Có sẵn, cùng nguồn | Phải làm thêm |
| Chọn ngôn ngữ, giao diện | Nhớ chung cả hệ | Mỗi nơi một lần |
| Tiền | 0 đ | Cũng 0 đ (một dòng DNS), nhưng tốn công vận hành: mỗi phần một dự án, một bộ cấu hình |
| Cô lập khi có lỗi bảo mật | Kém hơn (cùng nguồn) | Tốt hơn |

**Chỉ dùng tên miền phụ cho thứ máy móc gọi, không cần lên Google**, ví dụ `api.gravitispace.com` (máy chủ AI). Trang quản trị vẫn để ở `/admin/` vì Cloudflare Access khoá được theo đường dẫn.

**Một việc SEO quan trọng cho sau này:** Graviti Stars đang chia trang bằng dấu `#` (`/stars/#/tarot`). Google coi cả ứng dụng là **một trang**. Muốn từng lá bài, từng sao, từng cung có trang riêng trên Google (`/stars/tarot/the-star`), cần chuyển sang đường dẫn thật và tạo sẵn HTML cho từng trang. Đây là đợt việc riêng, nên làm sau khi có tên miền.

## 3. Cấu trúc kho mã và bản dựng

```
web/      Graviti Stars → dist/stars/
hub/      Trang chính, /privacy/, /admin/ → gốc dist/
tools/build.mjs        dựng cả hai; --admin mới chép /admin/ (kèm số liệu admin/stats.json)
hub/_headers           tiêu đề bảo mật cho CẢ web (Cloudflare chỉ đọc _headers ở gốc)
```

| Lệnh | Việc |
|---|---|
| `npm start` | Chạy thử riêng Graviti Stars: http://localhost:5190 |
| `npm run preview` | Dựng bản đầy đủ (có quản trị) và mở http://localhost:5191 |
| `npm test` | 110 kiểm thử |
| `npm run build` | Bản công khai, **không** có `/admin/`. GitHub Pages dùng bản này |
| `npm run build:admin` | Bản có `/admin/`. Chỉ dùng trên Cloudflare **sau khi** bật Access |

**Chuyển nhà từ bản 2.2:** Graviti Stars trước nằm ở gốc web, nay nằm ở `/stars/`.
- Link cũ dạng `…/#/tarot` tự chuyển sang `/stars/#/tarot`. Ứng dụng đã cài lên màn hình chính mở thẳng `/stars/`.
- Dữ liệu trên máy vẫn còn, vì cùng tên miền và khoá lưu `ansao:` giữ nguyên.

**Cố ý KHÔNG đổi tên:**
- Khoá lưu `ansao:`: đổi là người dùng cũ mất dữ liệu.
- Tên kho GitHub đã đổi thành `Gravitispace.com` (12/11/2026). Địa chỉ GitHub Pages theo đó thành `teedeetee13.github.io/Gravitispace.com/`; địa chỉ cũ `…/an-sao-space/` không còn chạy.

## 4. Hosting: GitHub Pages, Netlify hay Cloudflare?

Cloudflare cũng có hosting giống Netlify, tên là **Cloudflare Pages**. Số liệu gói miễn phí (11/2026):

| | GitHub Pages | Netlify Free | **Cloudflare Pages Free** |
|---|---|---|---|
| Lưu lượng | Giới hạn mềm khoảng 100 GB/tháng | Gói "credit" 300 điểm/tháng; hết điểm thì **web tạm dừng** đến tháng sau | **Không giới hạn** |
| Số lần dựng | Không giới hạn rõ | Trừ vào điểm | 500 lần/tháng |
| Tiêu đề bảo mật (`_headers`) | **Không** | Có | Có |
| Chống DDoS | CDN cơ bản, không có tường lửa | Có, mức cơ bản | **Mạng chống DDoS của Cloudflare**, tự bật; có tường lửa (WAF), giới hạn tần suất |
| Khoá trang quản trị | Không | Cần gói trả phí | **Cloudflare Access, miễn phí ≤ 50 người** |
| Chạy mã phía máy chủ (AI, giấu thuật toán) | Không | Netlify Functions, trừ vào điểm | **Workers: 100.000 lượt/ngày miễn phí**, gói 5 USD/tháng khi cần hơn |
| Mua tên miền | Không | Có (giá bán lẻ) | Có, **giá gốc** |

**Kết luận: dùng Cloudflare cho tất cả** (tên miền, DNS, hosting, chống DDoS, khoá quản trị, máy chủ AI). **Không cần Netlify Pro, không cần thuê máy chủ riêng (VPS).**
- VPS chỉ cần khi chạy việc nặng liên tục, như tự chạy mô hình AI hay xử lý video.
- VPS còn bắt bạn tự vá lỗi hệ điều hành, tức là **kém an toàn hơn** với một người làm.

**Có nhất thiết mua tên miền ngay không?**
- Chưa có người dùng thật thì chạy tạm trên địa chỉ miễn phí (`*.pages.dev`, `*.github.io`) vẫn được. Web ở `*.pages.dev` vẫn được Cloudflare chống DDoS.
- **Nên mua trước khi quảng bá**, vì hai lẽ:
  1. Đổi địa chỉ sau này thì mất uy tín Google đã tích được, và dữ liệu trên máy người dùng không tự đi theo.
  2. Tường lửa riêng và giới hạn tần suất tuỳ chỉnh cần tên miền của bạn. (Khoá `/admin/` bằng Access thì làm được ngay trên `*.pages.dev`.)
- 10–11 USD/năm là khoản rẻ nhất trong cả hệ.

## 5. Chi phí theo tính năng

| Tính năng | Cần máy chủ? | Tiền |
|---|---|---|
| Lưu lá số người thân trên máy | Không | 0 đ |
| Đồng bộ lá số nhiều máy | Supabase | 0 đ đến khi lớn (gói Free 500 MB); Pro 25 USD/tháng |
| Chống DDoS, khoá quản trị | Cloudflare | 0 đ |
| Email xác nhận | Resend | 0 đ đến 3.000 thư/tháng |
| AI luận giải | Cloudflare Worker + Claude API | Theo lượt, **có trần** |
| Giấu lớp luận giải cao cấp | Cloudflare Worker | 0 đ đến 100.000 lượt/ngày |

### AI luận giải: làm được dưới 1 triệu đồng/tháng

Giả định mỗi lần luận giải chuyên sâu: khoảng 1.000 token đầu vào riêng + 3.000 token hướng dẫn dùng chung (được lưu đệm, rẻ hơn khoảng 10 lần) + 2.500 token đầu ra. Tỷ giá tạm tính 26.000 đ/USD; giá Claude API 11/2026.

| Mô hình | Giá (USD / 1 triệu token, vào / ra) | Mỗi lần | 1 triệu đồng (≈ 38 USD) được |
|---|---|---|---|
| Claude Haiku 5.5 | 0,10 / 0,50 | khoảng 40 đ | khoảng 23.000 lần |
| Claude Sonnet 5.5 | 2 / 10 | khoảng 700 đ | khoảng 1.400 lần |
| Claude Opus 5.5 | 4 / 20 | khoảng 1.400 đ | khoảng 700 lần |

**Đề xuất:**
- Giữ tính năng, đặt **trần 38 USD/tháng** trong Claude Console để không bao giờ vượt 1 triệu đồng.
- Thử chất lượng Sonnet 5.5 và Haiku 5.5 trên 20 lá số thật rồi mới chọn.
- Mỗi tài khoản 1 lần miễn phí/tháng. Mỗi lá số luận giải xong thì **lưu lại**, mở lại không tốn thêm.
- Với vài nghìn người dùng đầu (mỗi người 1 lần/tháng), Sonnet 5.5 ở mức khoảng 1.400 lần là vừa sát trần, còn Haiku 5.5 dư rất nhiều.

### Tệp `web/assets/js/data/tuvi-stars.js`

**Giữ công khai.** Đây là lớp nội dung **miễn phí**:
- Nó là thứ giúp Google tìm thấy Graviti.
- Tính chất gốc của sao là tri thức chung từ sách truyền thống, giấu cũng không giữ được.

Đã thêm dòng bản quyền đầu tệp. Lời văn tự viết được Luật Sở hữu trí tuệ bảo hộ.

**Tài sản thật nằm ở lớp sau, sẽ đặt phía máy chủ (Cloudflare Worker), không bao giờ gửi xuống trình duyệt:**
- Luận giải kết hợp nhiều sao.
- Cách chấm điểm riêng.
- Phần hướng dẫn gửi cho AI.
- Kho bài chuyên sâu.

Mã đã gửi xuống trình duyệt thì ai cũng đọc được. Làm rối mã chỉ làm chậm người chép, không chặn được.

## 6. Trang quản trị: kế hoạch

| Giai đoạn | Nội dung | Cần trước |
|---|---|---|
| 1 ✅ | Web có sống không, bản phát hành, kiểm thử, pull request, bảo vệ nhánh, nội dung, độ phủ bản dịch, lộ trình, 14 việc cần làm (5 việc tự kiểm tra) | — |
| 2 | Lưu lượng truy cập (không cookie), theo dõi web sống, tự kiểm tra tiêu đề bảo mật, nhắc gia hạn tên miền | Tên miền + Cloudflare |
| 3 | Đăng nhập quản trị Supabase (vai trò admin) phía sau Cloudflare Access; số đăng ký, người hoạt động (chỉ đếm gộp); hàng chờ duyệt bài; báo cáo vi phạm | Supabase |
| 4 | Sức khoẻ cộng đồng: thời gian duyệt, độ đa dạng chủ đề, nhiệm vụ | Duyệt lộ trình cộng đồng |
| 5 | Đơn đặt, doanh thu, đối tác | Connect / Help ra mắt |
| AI | Chi tiêu AI theo ngày so với trần | Tính năng AI |
