# Nhật ký thay đổi — Hữu Duyên

## v2.2 · 06/11/2026

| Việc | Làm thế nào | Nguồn / tệp |
|---|---|---|
| **Độ sáng sao Tử Vi theo trường phái** | Ô chọn trường phái ngay trên lá số, lưu theo người dùng (đồng bộ tài khoản). Ký hiệu M/V/Đ/B/H cạnh tên sao, phần luận giải có lời giải thích nhẹ nhàng cho từng mức. | `data/tuvi-brightness.js` |
| · Thái Thứ Lang (**mặc định**) | Chép đúng 14 chính tinh × 12 cung từ bản in *Tử Vi Đẩu Số Tân Biên*, Sài Gòn 1956 (mục 3.1–3.14), đã đếm đủ 12 cung mỗi sao; phụ tinh chỉ ghi những cung sách nêu. | [bản quét PDF](https://tuvithuchanh.com/wp-content/uploads/2022/11/Tu-vi-dau-so.pdf) |
| · Tử Vi Đẩu Số Toàn Thư | Thiên Mệnh cung, thang 7 mức; dùng đúng giá trị của sách ở 14 ô các bản hiện đại chép khác; 3 ô sách không ghi để trống. | [ziweihome.com](https://ziweihome.com/zh-hans/xingyao/miaowang) |
| **Góc chiếu (aspects)** | 5 góc Ptolemy, biên độ 8/8/7/7/5° (+2° với Mặt Trời, Mặt Trăng), bỏ cặp hành tinh ngoài. Luận theo lối "hành tinh + góc chiếu + hành tinh" (như Astrolog), **lời văn Hữu Duyên tự viết**. Vẽ đường góc chiếu trong vòng hoàng đạo (xanh: hài hoà, đỏ: thử thách). Không rõ giờ sinh thì bỏ góc chiếu của Mặt Trăng. | `lib/ephemeris.js` → `findAspects`, `data/astro-texts.js`, `views/natal.js` |
| **Hình 78 lá Tarot** | Tranh gốc Rider–Waite–Smith in năm 1909 (Pamela Colman Smith), **Public domain** (đã kiểm từng tệp qua API Wikimedia Commons). Thu về 300px, tổng 3,9 MB, tải lười; ảnh lỗi thì hiện hình vẽ SVG cũ. | `web/assets/tarot/`, `CREDITS.md` |
| Kiểm thử | 56/56 đạt (thêm: bảng độ sáng đủ ô và khớp nguyên văn, góc chiếu, đủ 78 ảnh JPEG < 120 KB có ghi nguồn). Chụp kiểm tra khổ 390px: Tarot, bản đồ sao, góc chiếu, lá số. | `tests/brightness-aspects.test.mjs` |

## v2.1 · 06/11/2026

### 1. Tài khoản + cơ sở dữ liệu (Supabase)

| Việc | Kết quả |
|---|---|
| Chọn nền tảng | **Supabase** (PostgreSQL + Auth). Lý do: dữ liệu quan hệ hợp với cộng đồng bài viết + kiểm duyệt; bảo mật bằng RLS ngay trong cơ sở dữ liệu; mã nguồn mở, tự cài máy chủ riêng được, không bị khoá vào một nhà cung cấp; gọi được bằng REST thuần nên **không cần cài SDK** (Firebase cũng gọi REST được nhưng Firestore REST rườm rà, SDK nặng). |
| Đăng ký / đăng nhập / quên mật khẩu / đặt mật khẩu mới / đăng xuất / xoá tài khoản | Trang mới `#/tai-khoan`. Gọi Supabase Auth qua `fetch` (`cloud.js`). |
| Mở lại khi mất mạng **nhờ phiên tài khoản** | Phiên (access + refresh token) lưu trên máy (`auth.js`). Mất mạng → mở web vẫn đang đăng nhập, thấy dữ liệu của tài khoản (bản đồng bộ gần nhất), sửa được; có mạng lại → tự làm mới token và đồng bộ. |
| Đồng bộ nhiều thiết bị | Bảng `user_state`. Chỉ máy sửa → đẩy lên; chỉ máy chủ đổi → kéo về; cả hai cùng sửa → gộp không mất dữ liệu (`mergeStates`). |
| Khách đăng nhập lần đầu | Dữ liệu đang có trên máy được chuyển vào tài khoản, không mất gì. |
| Đăng xuất | Xoá bản sao dữ liệu tài khoản khỏi máy (riêng tư trên máy dùng chung). |
| Bài viết cộng đồng | Bảng `posts`: gửi ở trạng thái *chờ duyệt*, quản trị viên đổi sang *approved* thì mọi người mới thấy. |
| Bảo mật | RLS: mỗi người chỉ đọc/sửa dữ liệu của mình; chỉ gửi được bài *pending*; không ai tự duyệt bài. CSP chỉ cho kết nối tới `*.supabase.co`. |
| Tệp | `web/assets/js/{config,cloud,auth,store}.js`, `views/account.js`, `supabase/schema.sql`, hướng dẫn `docs/SUPABASE.md` |
| **Việc bạn cần làm** | Tạo dự án Supabase, chạy `schema.sql`, dán 2 khoá vào `config.js` (≈10 phút, xem `docs/SUPABASE.md`). Chưa dán khoá thì web vẫn chạy đủ ở chế độ khách. |

### 2. Lá số Tử Vi: bổ sung sao và các mục còn thiếu

| Nhóm | Đã thêm |
|---|---|
| Theo năm | Long Trì, Phượng Các, Giải Thần, Thiên Khốc, Thiên Hư, Hồng Loan, Thiên Hỷ, Thiên Đức, Nguyệt Đức, Cô Thần, Quả Tú, Đào Hoa, Hoa Cái, Kiếp Sát, Phá Toái, Lưu Hà |
| Theo tháng / ngày / giờ | Thiên Hình, Thiên Riêu, Thiên Y · Tam Thai, Bát Tọa, Ân Quang, Thiên Quý · Thai Phụ, Phong Cáo |
| Cố định / theo cung | Thiên La, Địa Võng, Thiên Thương, Thiên Sứ, Thiên Tài, Thiên Thọ |
| Ba vòng sao | Tràng Sinh (12), Bác Sĩ (12), Thái Tuế (12) |
| Thông tin lá số | **Sinh khắc Mệnh – Cục** ghi ngay ô giữa + giải thích cách xét; Mệnh chủ, Thân chủ; âm dương thuận/nghịch lý; **tiểu hạn** năm nay; **lưu Thái Tuế** năm nay |
| Chưa làm (ghi rõ trên trang) | Độ sáng sao (miếu/vượng/đắc/hãm) — các sách chép bảng này không thống nhất, cần bạn chọn sách chuẩn |

### 3. Kiểm thử

| Bộ | Số ca | Nội dung mới |
|---|---|---|
| `tests/tuvi.test.mjs` | 16 | vị trí sao năm/ngày, 3 vòng sao, Mệnh chủ, Thân chủ, thuận lý, tiểu hạn, lưu Thái Tuế |
| `tests/cloud.test.mjs` | 10 | đăng ký, offline, 2 máy, gộp xung đột, gửi bài chờ duyệt, làm mới token, RLS, đăng xuất, lỗi |
| Tổng `npm test` | **49/49 đạt** | Supabase giả lập trong bộ nhớ: `tests/fake-supabase.mjs` |

**Thử thật trên trình duyệt (khổ 390×844):**

1. Khách nhập bản mệnh → đăng ký: mật khẩu ngắn bị nhắc nhẹ, đăng ký xong dữ liệu khách lên tài khoản.
2. Tắt mạng → tải lại trang → vẫn đăng nhập, vẫn thấy bản mệnh, rút lá bài được, trạng thái "Đang offline".
3. Bật mạng → lá bài rút lúc offline đã lên máy chủ, trạng thái "Đã đồng bộ".
4. Lá số mới không tràn ngang trên điện thoại; khổ máy tính hiện đủ phụ tinh.
