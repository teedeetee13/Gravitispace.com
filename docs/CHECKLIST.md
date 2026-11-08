# An Sao Space — Checklist hoàn thiện để duyệt

> Tài liệu này ghi rõ từng hạng mục đã làm: **làm gì, làm bằng cách nào, công nghệ gì, nằm ở tệp nào, và bạn tự kiểm tra lại ra sao**.
> Ký hiệu: ✅ đã xong và đã kiểm chứng · ⚠️ đã xong nhưng cần bạn quyết định / xác nhận · ⏳ để dành cho giai đoạn web động.

**Nguyên tắc xuyên suốt**

- Không thêm thư viện ngoài nào. Mọi thứ viết bằng HTML, CSS, JavaScript thuần (ES Modules). Kiểm thử dùng `node:test` có sẵn trong Node.js. (Google Fonts là tài nguyên có từ bản trước, xem mục ⚠️ cuối tài liệu.)
- Giọng văn ấm áp, chữa lành, không doạ. Lời luận giải chỉ nói về **khuynh hướng, tâm thế, năng lượng**; không tiên đoán, không bảo người đọc phải làm gì.
- Mọi thay đổi đều được kiểm tra ở khổ điện thoại 390×844 (giả lập thiết bị di động thật qua Chrome DevTools Protocol).

---

## 1. Tính năng chính thống (lập lá số, luận giải, lộ trình)

| # | Hạng mục | Trạng thái | Làm thế nào | Tệp |
|---|---|---|---|---|
| 1.1 | **Đổi lịch dương ↔ âm** | ✅ | Thuật toán thiên văn của **Hồ Ngọc Đức** (dựa trên Jean Meeus, *Astronomical Algorithms*): tính điểm Sóc, kinh độ Mặt Trời, tháng 11 âm chứa Đông chí, tháng nhuận. Dùng **UTC+7 từ 1968, UTC+8 trước đó** đúng như lịch Việt Nam chính thức. | `web/assets/js/lib/lunar.js` |
| 1.2 | **Can Chi năm, tháng, ngày, giờ** | ✅ | Công thức truyền thống (Ngũ hổ độn cho Can tháng, số ngày Julius cho Can Chi ngày). | `lib/lunar.js` → `canChi()`, `hourBranch()` |
| 1.3 | **Lập lá số Tử Vi Đẩu Số** | ✅ | Quy tắc an sao theo **Tử Vi Đẩu Số Tân Biên (Thái Thứ Lang)**: an Mệnh/Thân theo tháng + giờ → Can 12 cung (Ngũ hổ độn) → Cục theo nạp âm cung Mệnh → an Tử Vi theo Cục + ngày → **14 chính tinh**, Lộc Tồn, Kình Dương, Đà La, Văn Xương, Văn Khúc, Tả Phù, Hữu Bật, Thiên Khôi, Thiên Việt, Địa Không, Địa Kiếp, Hỏa Tinh, Linh Tinh, Thiên Mã, **Tứ Hóa** (bản Việt: Nhâm hóa Khoa ở Thiên Phủ), **Tuần, Triệt**, **Đại hạn** (âm dương nam nữ quyết định chiều đi). Hiển thị lưới 4×4 truyền thống, ô giữa là thông tin chung. | `lib/tuvi-chart.js`, `views/laso.js` |
| 1.4 | **Luận giải lá số** | ✅ | Cung Mệnh (chính tinh: bản chất / ánh sáng / bài học / năng lượng); cung vô chính diệu mượn sao cung xung chiếu (đúng sách); Thân cư; quan hệ Cục–Mệnh (sinh, khắc, bình hoà); Tứ Hóa nằm ở cung nào; đọc từng cung trong 12 cung (dạng mở/đóng). Chạm vào ô nào trên lá số thì hiện luận giải ô đó. | `data/tuvi-stars.js`, `views/laso.js` |
| 1.5 | **Lộ trình đại hạn** | ✅ | Dòng thời gian 10 năm/chặng, đánh dấu chặng hiện tại theo tuổi mụ, mỗi chặng có một câu về **năng lượng** của cung đó (không tiên đoán sự kiện). | `views/laso.js` → `roadmap()`, `data/tuvi-stars.js` → `DAI_HAN_THEME` |
| 1.6 | **Bản đồ sao (natal chart)** | ✅ | Vị trí Mặt Trời, Mặt Trăng, 8 hành tinh theo phương pháp **Paul Schlyter** (có số hạng nhiễu loạn Mặt Trăng, Sao Mộc, Sao Thổ, Sao Thiên Vương); **cung Mọc + Thiên Đỉnh** từ giờ sao địa phương; **nghịch hành**; hệ nhà **Whole Sign**. Vòng hoàng đạo vẽ bằng SVG thuần. Không rõ giờ → nhà tính từ cung Mặt Trời và báo nếu hôm đó Mặt Trăng đổi cung. | `lib/ephemeris.js`, `views/natal.js` |
| 1.7 | **Luận giải bản đồ sao** | ✅ | Cách đọc truyền thống: *hành tinh = điều gì*, *cung = theo cách nào*, *nhà = ở lĩnh vực nào*; cân bằng 4 nguyên tố + 3 tính chất (có trọng số cho Mặt Trời, Mặt Trăng, cung Mọc). | `data/astro-texts.js`, `views/natal.js` |
| 1.8 | **Năng lượng giai đoạn hiện tại** | ✅ | Vị trí **hôm nay** của Sao Mộc (mùa mở rộng) và Sao Thổ (mùa vun nền) so với nhà của người dùng; tự nhận biết **Sao Thổ trở về** (~29, ~58 tuổi). | `views/natal.js` → `transits()` |
| 1.9 | **Bản mệnh tổng hợp** | ✅ | Nhập ngày giờ nơi sinh **một lần** → cung Mặt Trời, Mặt Trăng, cung Mọc, tuổi âm lịch **tính chính xác theo lịch âm** (bỏ ô "sinh trước Tết" thủ công của bản cũ), lá bài hôm nay, lối vào lá số, đại hạn hiện tại. | `views/profile.js`, `views/birth.js` |
| 1.10 | **Tarot: Thập tự Celtic 10 lá** | ✅ | Thêm kiểu trải kinh điển trong *The Pictorial Key to the Tarot* (A. E. Waite, 1910); bố cục lá nhỏ cho điện thoại. | `data/tarot.js`, `views/tarot.js` |
| 1.11 | **Múi giờ lịch sử Việt Nam** | ✅ | Theo IANA tz: cả nước UTC+8 năm 1943–1945 (UTC+9 từ 14/3 đến 2/9/1945); miền Nam UTC+8 năm 1947–1955 và 1960 – 12/6/1975; còn lại UTC+7; người dùng sửa được trong "Tuỳ chỉnh nâng cao". 20 nơi sinh có sẵn toạ độ, hoặc nhập toạ độ tuỳ ý. | `data/places.js`, `views/birth.js` |
| 1.12 | **Lời khuyên chỉ ở mức tâm thế** | ✅ | Mọi lời luận giải viết dạng "khuynh hướng / năng lượng / lời mời chiêm nghiệm". Cuối mỗi trang luận giải có ghi chú: *"Đây là tấm gương để soi mình, không phải lời phán định…"*. Có **kiểm thử tự động** quét từ ngữ đe doạ trong dữ liệu. | `ui.js` → `gentleNote()`, `tests/i18n.test.mjs` |
| 1.13 | **Minh bạch phương pháp** | ✅ | Mỗi trang lá số/bản đồ sao có mục "Cách tính và các quy ước"; trang Về có mục "Phương pháp và nguồn dữ liệu". | `views/laso.js`, `views/natal.js`, `views/about.js` |

**Quy ước có nhiều trường phái (đã chọn và ghi rõ trên trang):** sinh sau 23 giờ tính sang ngày hôm sau; tháng nhuận an như tháng chính; tuổi tính theo tuổi mụ. **v2.1 đã thêm:** ~40 phụ tinh, ba vòng Tràng Sinh / Bác Sĩ / Thái Tuế, sinh khắc Mệnh–Cục, Mệnh chủ, Thân chủ, thuận/nghịch lý, tiểu hạn, lưu Thái Tuế (chi tiết ở mục 11). **Chưa làm:** độ sáng sao (miếu/vượng/đắc/hãm).

> **Tài khoản và cơ sở dữ liệu (v2.1):** xem mục 11 bên dưới và hướng dẫn bật ở [SO-TAY.md](SO-TAY.md) mục 4, cách C.

**Cách tự kiểm tra:** vào *Bản mệnh* → nhập ngày giờ sinh của bạn → đối chiếu lá số với một phần mềm/thầy quen thuộc (ô Mệnh, Thân, Cục, vị trí 14 chính tinh, Tứ Hóa). Ví dụ đã đối chiếu trong kiểm thử: nam, 15/8/1995 9h → âm lịch 20/7 Ất Hợi, giờ Tỵ, Mệnh tại Mão (Thiên Tướng), Thân tại Sửu, Thổ ngũ cục, Tử Vi–Thất Sát tại Tỵ.

---

## 2. Song ngữ Việt / Anh

| # | Hạng mục | Trạng thái | Làm thế nào | Tệp |
|---|---|---|---|---|
| 2.1 | Nút đổi ngôn ngữ | ✅ | Nút **EN/VI** trên thanh trên (điện thoại) và **"Tiếng Việt · EN"** ở thanh bên (máy tính). Đổi xong vẽ lại trang hiện tại, không tải lại trang; nhớ lựa chọn trong `localStorage`; cập nhật `<html lang>` để trình đọc màn hình phát âm đúng. | `index.html`, `main.js` → `translateShell()` |
| 2.2 | Từ điển giao diện | ✅ | 367 khoá dạng `trang.muc` trong `i18n/vi.js` và `i18n/en.js`, hàm `t('khoa', {bien})`. | `i18n.js`, `i18n/vi.js`, `i18n/en.js` |
| 2.3 | Dịch nội dung dữ liệu | ✅ | 78 lá bài, 4 bộ, 12 cung, 12 con giáp (Mão = **Cat**, giữ nét Việt), 30 nạp âm, 5 hành, 24 bài mẫu, 5 kiểu trải bài, đường dây nóng. Tách thành gói `en-content.js` **chỉ tải khi bật tiếng Anh** (51 KB). Lớp `content.js` trả dữ liệu đã bản địa hoá cho giao diện. | `i18n/en-content.js`, `content.js` |
| 2.4 | Nội dung mới song ngữ ngay từ đầu | ✅ | Sao Tử Vi, cung, đại hạn, hành tinh, nhà… viết dạng `{ vi, en }`, chọn bằng `tr()`. | `data/tuvi-stars.js`, `data/astro-texts.js` |
| 2.5 | Tìm kiếm theo ngôn ngữ | ✅ | Tìm trên cả tên Việt lẫn tên Anh; gợi ý tìm kiếm đổi theo ngôn ngữ; từ khoá khủng hoảng có cả tiếng Anh. | `views/search.js`, `data/taxonomy.js` |
| 2.6 | Không sót bản dịch | ✅ | Kiểm thử tự động: hai từ điển cùng bộ khoá, cùng biến `{x}`; mọi khoá dùng trong mã đều tồn tại; mọi lá bài/cung/con giáp/bài mẫu đều có bản Anh. | `tests/i18n.test.mjs` |

**Cách tự kiểm tra:** bấm **EN** ở góc trên → mọi trang, kể cả lá số và bản đồ sao, chuyển sang tiếng Anh; bấm **VI** để quay lại.

---

## 3. Thuộc tính chất lượng kiến trúc

| Thuộc tính | Trạng thái | Đã làm gì, bằng cách nào |
|---|---|---|
| **Khả năng mở rộng sang web động (Scalability / Modifiability)** | ✅ | (1) `config.js` gom cấu hình (`DATA_SOURCE: 'local'`, `API_BASE`). (2) `store.js` là **Repository** duy nhất — giao diện không bao giờ đụng `localStorage`; có `async init()` để sau này tải từ API (mô hình *local-first*). (3) Lõi tính toán (`lib/`) là **module thuần**, không đụng DOM → mang nguyên lên máy chủ Node/Edge function được. (4) Nội dung tách khỏi giao diện (`data/`, `i18n/`). Lộ trình chuyển đổi ở mục 5. |
| **Hiệu năng (Performance)** | ✅ | **Tải lười theo trang** bằng `import()` động: trang đầu chỉ tải ~150 KB chưa nén (~40 KB gzip trên GitHub Pages); lá số tải thêm 57 KB khi mở; gói tiếng Anh 51 KB chỉ tải khi bật. `modulepreload` cho `main.js`. Không có framework, không có bước build. |
| **Sẵn sàng / chạy offline (Availability)** | ✅ | **Service worker** "mạng trước, bộ nhớ đệm sau": luôn lấy bản mới khi có mạng, khi mất mạng vẫn mở lại được các trang đã xem; không bao giờ kẹt bản cũ. **Web App Manifest** để "Thêm vào màn hình chính". `404.html` đưa đường dẫn lạ về trang chính (đúng cả với trang dự án `*.github.io/ten-repo/`). | 
| **Bảo mật (Security)** | ✅ | **Content-Security-Policy**: chỉ chạy script cùng nguồn, cấm `object`, giới hạn `base-uri`/`form-action`; đã tách đoạn script nội tuyến ra `boot.js` để CSP không cần `'unsafe-inline'` cho script. Mọi nội dung đưa vào HTML đều qua `esc()` (chống XSS). Nhập tệp dữ liệu có kiểm tra định dạng + giới hạn 2 MB. `Referrer-Policy`. ⚠️ `style-src` vẫn cho `'unsafe-inline'` vì giao diện dùng biến màu `style="--c:…"` (rủi ro thấp). |
| **Riêng tư & quyền sở hữu dữ liệu (Privacy)** | ✅ | Ngày giờ sinh chỉ lưu trên máy. Mục mới **Tủ của tôi → Dữ liệu của tôi**: **tải dữ liệu về** (JSON), **nạp lại** sang máy khác, **xoá toàn bộ** (có hỏi lại). |
| **Tính đúng & kiểm thử được (Correctness / Testability)** | ✅ | **34 kiểm thử tự động** (`npm test`, dùng `node:test` sẵn có): lịch âm (10 mốc Tết, gồm ca đặc biệt **Tết 1985 Việt Nam 21/1 khác Trung Quốc 20/2**, tháng nhuận, đổi qua lại 1950–2050), an sao Tử Vi (bảng an Tử Vi, Tứ Hóa, Lộc Tồn, đại hạn, 23h sang ngày mới, chạy ổn định 100 năm), thiên văn (sai số < 0,5° so với giá trị chuẩn J2000; xuân phân 2024), kho dữ liệu (di chuyển v1→v2, xuất/nhập), song ngữ, múi giờ lịch sử. |
| **Tích hợp liên tục (CI/CD)** | ✅ | GitHub Actions: **chạy kiểm thử trước**, chỉ khi đạt mới đăng GitHub Pages; pull request chỉ chạy kiểm thử. | 
| **Bảo trì (Maintainability)** | ✅ | Cấu trúc tầng rõ ràng: `lib/` (tính toán) → `data/` (nội dung) → `content.js`/`i18n.js` (bản địa hoá) → `views/` (mỗi trang một tệp) → `main.js` (định tuyến). Chú thích tiếng Việt ở đầu mỗi tệp. Biểu mẫu thông tin sinh dùng chung cho 3 trang (`views/birth.js`). |
| **Tương thích dữ liệu cũ (Backward compatibility)** | ✅ | Người dùng bản cũ không mất gì: `store.js` tự **di chuyển dữ liệu `huuduyen:v1` → `v2`** lần đầu mở. |
| **Chịu lỗi (Fault tolerance)** | ✅ | Bắt lỗi toàn cục (`error`, `unhandledrejection`) → thông báo nhẹ nhàng thay vì trắng trang; lỗi khi tải trang → trang "Có chút trục trặc nhỏ…"; chống "đua" khi người dùng bấm chuyển trang liên tục (`navToken`). |
| **Khả năng tiếp cận (Accessibility)** | ✅ | `lang` đúng theo ngôn ngữ; liên kết "Bỏ qua tới nội dung"; hộp thoại **giữ tiêu điểm bên trong** (focus trap) + Esc để đóng; nút lọc có `aria-pressed`; mỗi ô lá số là `<button>` có `aria-label` đọc đủ tên cung + sao; vùng kết quả `aria-live`; vòng hoàng đạo có `role="img"` + nhãn; tôn trọng `prefers-reduced-motion`; vùng chạm ≥ 44px. |
| **Thân thiện điện thoại (Responsive)** | ✅ | Lá số 4×4 tự thu gọn dưới 520px (ẩn phụ tinh trong ô, xem trong bảng chi tiết khi chạm); bảng vị trí sao tự xuống dòng; thanh mục cuộn ngang tự đưa mục đang mở vào tầm nhìn. |
| **SEO & chia sẻ** | ✅ | Open Graph + ảnh xem trước **PNG 1200×630** (`assets/og-image.png`), `og:locale` vi/en, `robots.txt`, mô tả trang đổi theo ngôn ngữ. |
| **Khả năng di động (Portability)** | ✅ | Web tĩnh thuần, chạy trên bất kỳ máy chủ tĩnh nào (GitHub Pages, Netlify, Vercel, Cloudflare Pages) không cần build. |

---

## 4. Kiểm tra trên khổ điện thoại

| Kiểm tra | Kết quả |
|---|---|
| Cách làm | Edge headless + **Chrome DevTools Protocol** giả lập thiết bị di động thật (390×844, `mobile: true`, cảm ứng). *Lưu ý:* cách chụp `--window-size=390` thông thường bị Edge ép tối thiểu 492px nên không phản ánh đúng điện thoại — đã phát hiện và chuyển sang giả lập thiết bị. Script kiểm tra nằm ngoài dự án (không thêm vào mã nguồn). |
| Không tràn ngang | ✅ Mọi trang đã đo đều `scrollWidth = clientWidth = 390`: Lướt, Tìm, Tarot (cả khi trải 10 lá), trang lá bài, Chiêm tinh, Bản đồ sao, Tử vi, Lá số (có và chưa có thông tin sinh), Bản mệnh, Gieo, Tủ (2 mục), Bài viết, Về — ở cả tiếng Việt lẫn tiếng Anh. |
| Không lỗi JavaScript | ✅ Không có lỗi từ ứng dụng trong mọi lần chạy. |
| Tương tác thật | ✅ Bấm EN ↔ VI; điền biểu mẫu từ trống (xem trước âm lịch, báo thiếu giờ, gợi ý múi giờ, 23:30 → giờ Tý hôm sau); chạm ô lá số; trải Celtic Cross và lật bài; đường dẫn sai → trang 404. |
| Chế độ tối, khổ máy tính 1280px | ✅ Đã chụp kiểm tra. |
| Lỗi phát hiện và đã sửa trong lúc kiểm tra | Ký hiệu cung trên vòng hoàng đạo bị viền đen (kế thừa nét của bộ icon) → sửa CSS; bảng vị trí sao tràn cột → bảng gọn trên điện thoại; tab "Dữ liệu của tôi" bị khuất → tự cuộn tới; nhãn "AC" đè ký hiệu hành tinh → dời vào trong; nhãn vị trí trải bài 10 lá lệch hàng → căn đáy. |

---

## 5. Lộ trình lên web động (⏳ chưa làm, đã chuẩn bị chỗ)

1. Chọn máy chủ (gợi ý: Supabase hoặc Cloudflare D1 + Workers — **sẽ hỏi bạn trước khi thêm**).
2. Viết bộ chuyển `remote` trong `store.js` (`init()` tải dữ liệu, các hàm ghi gọi API) → giao diện giữ nguyên.
3. Bài viết công khai cần **kiểm duyệt** trước khi hiện; tài khoản tuỳ chọn.
4. Lõi `lib/` có thể chạy phía máy chủ để tạo ảnh lá số chia sẻ.
5. Chuyển định tuyến `#/` sang đường dẫn thật (History API) khi có máy chủ hỗ trợ — để từng trang được tìm thấy trên Google.

---

## 6. ⚠️ Cần bạn quyết định / xác nhận

1. **Google Fonts** (Be Vietnam Pro, Lora) là tài nguyên bên ngoài có từ bản trước. Mình **chưa đổi** vì quy tắc "không thêm thư viện ngoài nếu chưa hỏi". Nếu muốn riêng tư hơn và chạy offline trọn vẹn, có thể tự lưu phông chữ trong dự án — bạn đồng ý không?
2. **Số đường dây nóng** trong `web/assets/js/data/taxonomy.js` (115, Ngày Mai 096 306 1414, 111) — xin bạn xác nhận lại trước khi ra mắt chính thức.
3. **Nội dung luận giải** (sao Tử Vi, hành tinh, đại hạn) do mình biên soạn theo tính chất gốc trong sách, viết lại giọng chữa lành. Bạn nên đọc lại một lượt xem giọng văn đã đúng ý chưa.
4. **Chưa commit / push**: mọi thay đổi đang nằm trong thư mục làm việc để bạn duyệt. Khi bạn đồng ý, mình sẽ tạo nhánh và commit.

---

## 7. Nguồn tài liệu (đường dẫn đã mở thử ngày 06/11/2026)

| Nội dung | Nguồn | Tình trạng |
|---|---|---|
| Thuật toán lịch âm | Hồ Ngọc Đức, *Cách tính âm lịch Việt Nam*: [bản lưu trữ tiếng Việt](https://web.archive.org/web/2023/https://www.informatik.uni-leipzig.de/~duc/amlich/calrules.html) · [bản tiếng Anh](https://web.archive.org/web/2023/https://www.informatik.uni-leipzig.de/~duc/amlich/calrules_en.html) | Trang gốc ở Đại học Leipzig hiện trả 404; bản lưu trữ đọc được, có xác nhận kinh tuyến 105° Đông và trường hợp năm 1985 |
| Lịch Việt khác lịch Trung Quốc (1968, 1969, 1985) | [Báo Nhân Dân](https://nhandan.vn/chung-quanh-thong-tin-ve-ngay-am-lich-khac-nhau-tren-mot-so-loai-lich-post489744.html) | Đọc được (qua kết quả tìm kiếm) |
| Lịch sử múi giờ Việt Nam | [IANA tz, tệp `asia`, vùng Asia/Ho_Chi_Minh](https://github.com/eggert/tz/blob/main/asia), trích sách *Lịch Việt Nam thế kỷ XX–XXI* (Trần Tiến Bình, 2005) | Đã đọc nguyên văn; đã sửa `places.js` cho khớp |
| Vị trí hành tinh | [Paul Schlyter, *How to compute planetary positions*](https://stjarnhimlen.se/comp/ppcomp.html) | Đọc được; hệ số trong mã khớp nguyên văn |
| Tarot và trải bài Celtic Cross | [A. E. Waite, *The Pictorial Key to the Tarot* (Wikisource)](https://en.wikisource.org/wiki/The_Pictorial_Key_to_the_Tarot), mục §7 "An Ancient Celtic Method of Divination" | Đọc được |
| Quy tắc an sao Tử Vi | Sách *Tử Vi Đẩu Số Tân Biên*, Vân Đằng Thái Thứ Lang (in giấy, không có bản chính thức trên mạng) | ⚠️ Chưa có đường dẫn trực tuyến để bạn đối chiếu |
| Lời luận giải (sao, cung, hành tinh, đại hạn) | An Sao Space tự biên soạn từ tính chất gốc của từng sao/hành tinh | ⚠️ Không phải trích nguyên văn từ sách |

## 8. Cách chạy và kiểm tra lại

```bash
# Chạy web
python -m http.server 5190 --directory web      # rồi mở http://localhost:5190

# Chạy kiểm thử (cần Node.js ≥ 20, không cần cài gì thêm)
npm test
```

Danh sách tệp mới: `web/assets/js/{config,i18n,content,boot}.js`, `web/assets/js/i18n/*`, `web/assets/js/lib/*`, `web/assets/js/data/{tuvi-stars,astro-texts,places}.js`, `web/assets/js/views/{laso,natal,birth}.js`, `web/sw.js`, `web/manifest.webmanifest`, `web/404.html`, `web/robots.txt`, `web/assets/og-image.png`, `tests/*`, `package.json`, `docs/CHECKLIST.md`.

---

## 9. Bản 2.2 (07/11/2026) — đa ngôn ngữ, ảnh bìa, bảo mật, CI/CD, bàn giao

### 9.1 Vì sao chọn 6 ngôn ngữ này

Tiêu chí: (1) cộng đồng quan tâm huyền học/chiêm tinh/tử vi lớn; (2) ngôn ngữ **có sẵn hệ thuật ngữ chuẩn** cho cả ba bộ môn, để người đọc bản ngữ đánh giá được một cách khách quan, không thấy "dịch ngây ngô".

| Ngôn ngữ | Phục vụ | Thuật ngữ dùng (đúng chuẩn bộ môn ở nước đó) | Điểm dễ bị hiểu sai đã xử lý |
|---|---|---|---|
| **Español** (es-419) | Tây Ban Nha, Argentina, Chile, Mexico… | Arcanos Mayores, Bastos/Copas/Espadas/Pentáculos, Ascendente, Medio Cielo, casas de signos enteros | Giọng "tú" trung tính dùng được ở mọi nước; số đường dây tại chỗ: ES 024, AR 135, CL \*4141, MX 800 911 2000 |
| **Français** | Pháp, Bỉ, Thuỵ Sĩ, Canada | Arcanes majeurs, Bâtons/Coupes/Épées/Deniers, Ascendant, maisons; lá XIII = *L'Arcane sans nom* (tên truyền thống Pháp, vừa đúng vừa không doạ) | Số 3114 (Pháp) |
| **Deutsch** | Đức, Áo, Thuỵ Sĩ | Große Arkana, Stäbe/Kelche/Schwerter/Münzen, Aszendent, Whole-Sign-Häuser, Quadrat/Trigon | Nhắc giờ mùa hè khi nhập múi giờ; TelefonSeelsorge 0800 111 0 111 |
| **繁體中文** | Đài Loan, Hồng Kông (nơi 紫微斗數 phổ biến nhất hiện nay) | Tên sao/cung/tứ hoá bằng **chữ Hán gốc** (紫微, 命宮, 化祿, 廟旺利陷, 旬空 截空); Can Chi hiển thị 甲子… | Ghi rõ đây là **trường phái Việt**: năm 壬 hoá Khoa ở 天府 (Đài–Hồng thường dùng 左輔), 卯 = mèo, lịch âm theo UTC+7 có thể lệch lịch Trung vài năm. Số 1925 (TW), 2389 2222 (HK) |
| **हिन्दी** | Ấn Độ (thị trường chiêm tinh rất lớn) | राशि, लग्न, भाव, चर/स्थिर/द्विस्वभाव, युति/प्रतियुति/त्रिकोण/चतुष्कोण/षडांश, वक्री | **Quan trọng:** người Ấn quen hệ Vedic **निरयण** (sidereal) — trang ghi rõ đây là hệ **सायन** (tropical) nên cung Mặt Trời có thể sớm hơn khoảng một cung, cả hai hệ đều đúng theo nguyên tắc riêng. Tele-MANAS 14416 |
| **ไทย** | Thái Lan | ลัคนา, เรือน, จร/สถิร/อุภัย, กุม/เล็ง/ตรีโกณ/จตุโกณ/โยค, พักร์; con giáp kèm tên năm Thái (ชวด ฉลู ขาล…) | Giống Ấn Độ: ghi rõ **สายนะ** khác **นิรายนะ** của โหราศาสตร์ไทย. Số 1323 |

Đã cân nhắc nhưng **chưa thêm**: Bồ Đào Nha (Brazil), Nhật, Hàn — có tiềm năng tốt; thêm sau theo quy trình ở SO-TAY.md mục 5.

### 9.2 Hạng mục

| # | Hạng mục | Trạng thái | Làm thế nào | Tệp |
|---|---|---|---|---|
| 9.1 | Danh mục ngôn ngữ + ô chọn | ✅ | `<select>` gốc của hệ điều hành phủ trong suốt lên nhãn (điện thoại mở bảng chọn gốc, đọc được bằng trình đọc màn hình); tên ngôn ngữ viết bằng chính ngôn ngữ đó; nhớ lựa chọn; lần đầu tự nhận ngôn ngữ trình duyệt; `<html lang>` đúng mã BCP 47 (`zh-Hant`) để phông chữ và ngắt dòng đúng | `i18n/langs.js`, `index.html`, `main.js`, `boot.js` |
| 9.2 | Tải lười theo ngôn ngữ | ✅ | Mỗi ngôn ngữ 3 tệp chỉ tải khi chọn (~100–200 KB/ngôn ngữ chưa nén); người đọc tiếng Việt không tải thêm byte nào. Lỗi mạng khi tải gói → giữ ngôn ngữ cũ, báo nhẹ | `i18n.js` |
| 9.3 | Bộ nhớ dịch cho lời luận giải | ✅ | 401 câu `{ vi, en }` trong dữ liệu được dịch trong `<mã>-text.js`, tra theo câu tiếng Anh gốc → tệp dữ liệu không phình to. Thiếu câu nào thì về tiếng Anh (không bao giờ hiện tiếng Việt cho người nước ngoài) | `i18n/*-text.js`, `tools/i18n-strings.mjs` |
| 9.4 | Chuẩn chữ viết | ✅ | Phông dự phòng theo hệ chữ (PingFang/Noto TC cho chữ Hán, Nirmala/Noto Devanagari, Leelawadee/Noto Thai); giãn dòng lớn hơn cho Thái, Hindi; bìa không viết HOA với chữ không có hoa/thường | `style.css` |
| 9.5 | Kiểm thử "đủ 100%" | ✅ | Mỗi ngôn ngữ: đủ khoá, đúng biến `{x}`, đúng số thẻ HTML; đủ 78 lá, 12 cung, 12 con giáp, 30 nạp âm, 24 bài mẫu, 5 trải bài, đường dây; đủ 401 câu luận giải; **không chép nguyên văn tiếng Anh**; Trung/Hindi/Thái phải viết bằng đúng chữ của mình; quét từ ngữ đe doạ ở từng ngôn ngữ. Thiếu một chuỗi → CI đỏ, không đăng web | `tests/i18n.test.mjs` |
| 9.6 | Ảnh bìa từng bài | ✅ | SVG vẽ ngay trên trình duyệt, **0 KB ảnh tải thêm** (trừ tranh lá bài đã có, tải lười). Hạt giống = mã bài → bìa ổn định. Bảng màu theo chủ đề (5 bảng × 3 chủ đề), hướng chuyển màu, tia sáng, sao lấp lánh, mây lành, bố cục trái/phải đều đổi theo bài. Hoạ tiết bám nội dung: Tarot → tranh gốc lá bài được nhắc; Chiêm tinh → chòm sao thật + ký hiệu cung + quỹ đạo; Tử vi → ấn triện chữ Hán Địa Chi (子 丑 寅 卯…) + vòng Bát Quái. Thẻ bài có dòng chữ trên bìa (chủ đề · kiểu bài / tên lá bài, cung, con giáp). Bảng tin: điện thoại = bìa dọc làm nền, phủ lớp màu giấy để chữ luôn rõ; máy tính = tranh dọc 9:16 đặt cạnh bài như tạp chí | `cover.js`, `ui.js`, `views/feed.js`, `views/post.js`, `style.css` |
| 9.7 | An toàn tâm lý đa quốc gia | ✅ | Cụm từ khủng hoảng ở 8 ngôn ngữ; thêm Find A Helpline (danh bạ miễn phí >130 nước) + số tại chỗ trong từng bản dịch | `taxonomy.js`, `about.js`, `i18n/*` |
| 9.8 | Người sinh ngoài Việt Nam | ✅ | Gợi ý múi giờ theo kinh độ (làm tròn nửa giờ) khi toạ độ ngoài lãnh thổ Việt Nam; ghi chú giờ mùa hè | `data/places.js`, `views/birth.js`, `tests/places.test.mjs` |
| 9.9 | Bảo mật | ✅ | Xem [SECURITY.md](../SECURITY.md): CSP + `upgrade-insecure-requests`, `_headers` (HSTS, nosniff, frame-ancestors, Permissions-Policy, COOP), chống clickjacking trên GitHub Pages, RLS + ràng buộc `refs`/`lang`, quét khoá bí mật, CodeQL, Dependabot | `SECURITY.md`, `web/_headers`, `boot.js`, `supabase/schema.sql`, `tests/security.test.mjs` |
| 9.10 | CI/CD | ✅ | Test Node 20 + 22 → build `dist/` (đóng dấu phiên bản + commit vào `config.js` và tên cache service worker, kiểm tra import hỏng, ngân sách dung lượng) → đăng Pages. Thẻ `vX.Y.Z` → GitHub Release kèm zip + SHA-256. Chỉ action chính chủ, quyền tối thiểu, `persist-credentials: false` | `.github/workflows/*`, `.github/dependabot.yml`, `tools/build.mjs`, `tools/package.mjs` |
| 9.11 | Bàn giao | ✅ | Hồ sơ bàn giao (kiến trúc, lệnh, CI/CD, cấu hình, tài khoản cần chuyển, vận hành, thêm ngôn ngữ, giới hạn), nhật ký phiên bản | `docs/SO-TAY.md` (trước là `BAN-GIAO.md`), `CHANGELOG.md` |
| 9.12 | Lỗi phát hiện và đã sửa | ✅ | CSDL từ chối bài không phải vi/en; câu tiếng Anh "Your your…"; gợi ý múi giờ luôn là UTC+7 cho mọi toạ độ | — |

### 9.3 Kiểm tra trên điện thoại (390×844) và máy tính (1366×860)

Bảng tin (sáng, tối), Tìm kiếm, Bài viết, Lá số Tử Vi, Bản đồ sao, Về — ở **zh, hi, th, es, de, fr, vi**: không tràn ngang (`scrollWidth = 390`), không lỗi JavaScript của ứng dụng; chữ Hán/Devanagari/Thái hiển thị đúng; lá số tiếng Trung hiện 紫微 七殺 廟 旺 旬空 截空.

### 9.4 ⚠️ Cần bạn quyết định / xác nhận

1. **Duyệt bản ngữ.** Bản dịch dùng đúng thuật ngữ chuẩn và đã qua kiểm thử tự động, nhưng để không ai "có cớ chê", nên nhờ **một người bản ngữ có hiểu bộ môn** đọc một lượt mỗi ngôn ngữ trước khi quảng bá ở nước đó (ưu tiên: zh vì người Đài/Hồng rất rành Tử Vi; hi và th vì khác biệt sidereal). Chỗ cần đọc: `web/assets/js/i18n/<mã>*.js`.
2. **Số đường dây hỗ trợ** các nước (mục 9.1) — xác nhận lại trước khi ra mắt ở nước đó.
3. **Chạy lại `supabase/schema.sql`** nếu CSDL đã được tạo từ bản 2.1 (để nhận bài ở ngôn ngữ mới).
4. **Thiết lập GitHub một lần** (Pages = GitHub Actions, bảo vệ nhánh, bật Secret scanning…) — danh sách ở SO-TAY.md mục 4, cách B.
5. **Chưa commit / push** — như các lần trước, chờ bạn duyệt.

---

## 10. Đổi tên và gộp tài liệu (08/11/2026)

| # | Hạng mục | Trạng thái | Làm thế nào | Tệp |
|---|---|---|---|---|
| 10.1 | Đổi tên **Hữu Duyên → An Sao Space** | ✅ | Thay ở tiêu đề, logo, manifest (tên ngắn trên màn hình chính: "An Sao"), Open Graph, 8 bản dịch. Trang *Về* ở cả 8 ngôn ngữ có thêm câu giải nghĩa tên: "an" là bình an; "an sao" (安星) là bước xếp sao trong Tử Vi. Biểu tượng mới: trăng lưỡi liềm và ngôi sao, thay hai vòng tròn; vẽ lại `favicon.svg` và ảnh chia sẻ `og-image.png` (1200×630) | `index.html`, `manifest.webmanifest`, `i18n/*.js`, `style.css`, `assets/favicon.svg`, `assets/og-image.png` |
| 10.2 | Định danh nội bộ | ✅ | Khoá lưu trữ `huuduyen:` đổi thành `ansao:`, tên bộ nhớ đệm `ansao-…`, tên gói `an-sao-space`. Tệp sao lưu kiểu cũ (`huu-duyen`) vẫn nạp được | `config.js`, `boot.js`, `store.js`, `sw.js`, `tools/*`, `package.json` |
| 10.3 | Cổng chạy thử 5173 → **5190** | ✅ | Tránh trùng với các dự án khác (Vite mặc định dùng 5173) | `package.json`, `.claude/launch.json` |
| 10.4 | Gộp tài liệu | ✅ | Gộp 4 tệp (`BAN-GIAO.md`, `SUPABASE.md`, `NHAT-KY.md`, `web/README.md`) vào một **sổ tay** `docs/SO-TAY.md` gồm 7 mục: tổng quan, tối ưu (có số đo), bảo mật, triển khai (Netlify, GitHub Pages, Supabase, tên miền, chia sẻ), vận hành (lệnh, việc thường gặp, định kỳ, sự cố), bàn giao, giới hạn. `README.md` và `SECURITY.md` rút gọn. Chi tiết của NHAT-KY chuyển xuống mục 11 bên dưới | `docs/SO-TAY.md`, `README.md`, `SECURITY.md` |
| 10.5 | Kiểm tra | ✅ | 92/92 kiểm thử đạt. Chụp khổ 390px (sáng, tối) và 1366px: tên vừa một dòng trên thanh tiêu đề, không tràn ngang | — |

---

## 12. Lá số Tử Vi: bố cục ô cung và đối chiếu kiến thức (08/11/2026)

**Cách kiểm tra:** lập lá số mẫu nam, 13/12/2004, 18:10 (âm lịch 2/11 Giáp Thân, giờ Dậu), rồi đối chiếu **từng sao ở từng cung** với lá số cùng ngày giờ trên tuvi.vn.

| # | Hạng mục | Trạng thái | Làm thế nào | Tệp |
|---|---|---|---|---|
| 12.1 | Bố cục ô cung theo lối phổ biến | ✅ | Chính tinh trên cùng; bên dưới chia 2 cột: **phụ tinh tốt bên trái, phụ tinh xấu bên phải**, mỗi sao một dòng, xếp từ trên xuống. Sao của vòng Bác Sĩ và vòng Thái Tuế (trước đây chỉ hiện khi bấm vào cung) nay hiện thẳng trong ô và được xếp cột theo cách trình bày của tuvi.vn. Riêng vòng Tràng Sinh vẫn ở góc dưới. Ký hiệu độ sáng không làm lệch dòng giữa hai cột. Điện thoại (≤ 520px): ô quá hẹp nên vẫn chỉ hiện chính tinh, bấm vào cung để đọc đủ sao | `views/laso.js` (`cell`), `lib/tuvi-chart.js` (`RING_GOOD`), `style.css` |
| 12.2 | Kiến thức an sao: phần đã có | ✅ Đúng | 14 chính tinh, độ sáng chính tinh, Tứ Hóa, Tuần, Triệt, Cục, Mệnh và Thân, Tràng Sinh, Lộc Tồn, Kình Đà, Xương Khúc, Tả Hữu, Khôi Việt, Không Kiếp, Hỏa Linh, Thiên Mã, các sao theo năm, tháng, ngày, giờ, cùng hai vòng Bác Sĩ và Thái Tuế: **trùng khớp toàn bộ** với tuvi.vn | — |
| 12.3 | Bổ sung 10 sao còn thiếu | ✅ | **Thiên Quan, Thiên Phúc, Thiên Trù, Văn Tinh** (theo Can năm); **Quốc Ấn** (Lộc Tồn + 8), **Đường Phù** (Lộc Tồn − 7); **Thiên Giải** (tháng Giêng khởi ở Thân), **Địa Giải** (tháng Giêng khởi ở Mùi); **Thiên Không** (trước Thái Tuế 1 cung); **Đẩu Quân** (từ Thái Tuế đếm nghịch đến tháng sinh, rồi thuận đến giờ sinh). Có lời luận giải nhẹ nhàng và đủ 8 ngôn ngữ (tiếng Trung: 天官 天福 天廚 文星 國印 唐符 天解 地解 天空 斗君) | `lib/tuvi-chart.js`, `data/tuvi-stars.js`, `i18n/*-text.js` |
| 12.4 | Lai nhân cung | ✅ | Cung có Can trùng Can năm sinh (bỏ qua Tý, Sửu vì trùng Can với Dần, Mão). Hiện ở ô giữa. Lá số mẫu ra **Tật Ách**, khớp tuvi.vn | `lib/tuvi-chart.js`, `views/laso.js` |
| 12.5 | Mệnh chủ có hai cách tính | ✅ Ghi rõ | Web tính Mệnh chủ theo **Chi cung Mệnh** (như sách Trung Hoa). tuvi.vn và một số trang Việt tính theo **Chi năm sinh** (lá số mẫu ra Liêm Trinh, còn web ra Văn Khúc). Phần luận giải nay ghi thêm kết quả theo cách thứ hai khi hai cách cho kết quả khác nhau | `views/laso.js`, `i18n/*.js` (`laso.chuAlt`) |
| 12.6 | Kiểm thử | ✅ | Thêm 1 ca đối chiếu **đủ mọi sao trên 12 cung** của lá số mẫu với tuvi.vn, cùng Mệnh, Thân, Cục, Lai nhân, Tuần, Triệt. Tổng 93/93 đạt | `tests/tuvi.test.mjs` |
| 12.7 | Kiểm tra giao diện | ✅ | Chụp 1290px, 640px (tiếng Việt, tiếng Trung) và 390px: không tràn ngang | — |

**⚠️ Cần bạn biết hoặc xác nhận**

1. **Thiên Trù năm Quý:** sách Trung Hoa ghi Hợi, một số bảng Việt ghi Tuất. Web đang dùng **Hợi**. Lá số mẫu là năm Giáp nên chưa kiểm chứng được ô này.
2. **Mệnh chủ:** muốn mặc định theo Chi năm sinh (giống tuvi.vn) thì báo tôi đổi.
3. **Độ sáng phụ tinh:** tuvi.vn ghi (H) cho Hỏa Tinh, Linh Tinh, Thiên Hình, Thiên Riêu, Thiên Khốc ở một số cung. Web chỉ ghi độ sáng phụ tinh ở những cung mà sách Thái Thứ Lang nêu rõ, nên các sao này để trống.
4. **Chưa làm:** sao lưu niên (L.Thái Tuế, L.Lộc Tồn, L.Hóa Lộc… của năm đang xem), số tháng hạn trong từng cung, "Cân lượng" (cân xương đoán số, vốn không thuộc Tử Vi Đẩu Số).

---

## 11. Phụ lục: chi tiết bản 2.1 và 2.2 (gộp từ NHAT-KY.md cũ)

### v2.2 · 06/11/2026

| Việc | Làm thế nào | Nguồn / tệp |
|---|---|---|
| **Độ sáng sao Tử Vi theo trường phái** | Ô chọn trường phái ngay trên lá số, lưu theo người dùng (đồng bộ tài khoản). Ký hiệu M/V/Đ/B/H cạnh tên sao, phần luận giải có lời giải thích nhẹ nhàng cho từng mức. | `data/tuvi-brightness.js` |
| · Thái Thứ Lang (**mặc định**) | Chép đúng 14 chính tinh × 12 cung từ bản in *Tử Vi Đẩu Số Tân Biên*, Sài Gòn 1956 (mục 3.1–3.14), đã đếm đủ 12 cung mỗi sao; phụ tinh chỉ ghi những cung sách nêu. | [bản quét PDF](https://tuvithuchanh.com/wp-content/uploads/2022/11/Tu-vi-dau-so.pdf) |
| · Tử Vi Đẩu Số Toàn Thư | Thiên Mệnh cung, thang 7 mức; dùng đúng giá trị của sách ở 14 ô các bản hiện đại chép khác; 3 ô sách không ghi để trống. | [ziweihome.com](https://ziweihome.com/zh-hans/xingyao/miaowang) |
| **Góc chiếu (aspects)** | 5 góc Ptolemy, biên độ 8/8/7/7/5° (+2° với Mặt Trời, Mặt Trăng), bỏ cặp hành tinh ngoài. Luận theo lối "hành tinh + góc chiếu + hành tinh" (như Astrolog), **lời văn An Sao Space tự viết**. Vẽ đường góc chiếu trong vòng hoàng đạo (xanh: hài hoà, đỏ: thử thách). Không rõ giờ sinh thì bỏ góc chiếu của Mặt Trăng. | `lib/ephemeris.js` → `findAspects`, `data/astro-texts.js`, `views/natal.js` |
| **Hình 78 lá Tarot** | Tranh gốc Rider–Waite–Smith in năm 1909 (Pamela Colman Smith), **Public domain** (đã kiểm từng tệp qua API Wikimedia Commons). Thu về 300px, tổng 3,9 MB, tải lười; ảnh lỗi thì hiện hình vẽ SVG cũ. | `web/assets/tarot/`, `CREDITS.md` |
| Kiểm thử | 56/56 đạt (thêm: bảng độ sáng đủ ô và khớp nguyên văn, góc chiếu, đủ 78 ảnh JPEG < 120 KB có ghi nguồn). Chụp kiểm tra khổ 390px: Tarot, bản đồ sao, góc chiếu, lá số. | `tests/brightness-aspects.test.mjs` |

### v2.1 · 06/11/2026

#### 1. Tài khoản + cơ sở dữ liệu (Supabase)

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
| Tệp | `web/assets/js/{config,cloud,auth,store}.js`, `views/account.js`, `supabase/schema.sql`, hướng dẫn `docs/SO-TAY.md mục 4, cách C` |
| **Việc bạn cần làm** | Tạo dự án Supabase, chạy `schema.sql`, dán 2 khoá vào `config.js` (≈10 phút, xem `docs/SO-TAY.md mục 4, cách C`). Chưa dán khoá thì web vẫn chạy đủ ở chế độ khách. |

#### 2. Lá số Tử Vi: bổ sung sao và các mục còn thiếu

| Nhóm | Đã thêm |
|---|---|
| Theo năm | Long Trì, Phượng Các, Giải Thần, Thiên Khốc, Thiên Hư, Hồng Loan, Thiên Hỷ, Thiên Đức, Nguyệt Đức, Cô Thần, Quả Tú, Đào Hoa, Hoa Cái, Kiếp Sát, Phá Toái, Lưu Hà |
| Theo tháng / ngày / giờ | Thiên Hình, Thiên Riêu, Thiên Y · Tam Thai, Bát Tọa, Ân Quang, Thiên Quý · Thai Phụ, Phong Cáo |
| Cố định / theo cung | Thiên La, Địa Võng, Thiên Thương, Thiên Sứ, Thiên Tài, Thiên Thọ |
| Ba vòng sao | Tràng Sinh (12), Bác Sĩ (12), Thái Tuế (12) |
| Thông tin lá số | **Sinh khắc Mệnh – Cục** ghi ngay ô giữa + giải thích cách xét; Mệnh chủ, Thân chủ; âm dương thuận/nghịch lý; **tiểu hạn** năm nay; **lưu Thái Tuế** năm nay |
| Chưa làm (ghi rõ trên trang) | Độ sáng sao (miếu/vượng/đắc/hãm) — các sách chép bảng này không thống nhất, cần bạn chọn sách chuẩn |

#### 3. Kiểm thử

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
