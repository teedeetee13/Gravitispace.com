# Sổ tay An Sao Space v2.2

Đây là tài liệu chính của dự án, gồm: tổng quan, tối ưu, bảo mật, triển khai, vận hành, bàn giao. Đọc mục 1 và 4 là đủ để đưa web lên mạng.

Các tài liệu khác:

| Tệp | Dùng khi |
|---|---|
| [CHECKLIST.md](CHECKLIST.md) | Duyệt từng hạng mục đã làm: làm thế nào, dùng công nghệ gì, nguồn tham khảo |
| [../SECURITY.md](../SECURITY.md) | Báo lỗ hổng bảo mật |
| [../CHANGELOG.md](../CHANGELOG.md) | Xem thay đổi qua từng phiên bản |

---

## 1. Tổng quan

**An Sao Space** là web chữa lành về Tarot, chiêm tinh phương Tây và Tử Vi Đẩu Số. Người dùng lướt bài viết theo kiểu "gặp là duyên", rút bài mỗi ngày, lập lá số Tử Vi và bản đồ sao. Web có 8 ngôn ngữ: Việt, Anh, Tây Ban Nha, Pháp, Đức, Trung phồn thể, Hindi, Thái.

Tên gọi: "an" là bình an, nhẹ lòng. "An sao" cũng là bước xếp sao vào lá số Tử Vi (chữ Hán: 安星).

| | |
|---|---|
| Công nghệ | HTML, CSS, JavaScript thuần (ES Modules). Không framework, không thư viện npm |
| Lưu dữ liệu | Mặc định lưu trên trình duyệt (`localStorage`). Có thể bật thêm tài khoản Supabase (Postgres, Auth, RLS) |
| Máy chủ | Bất kỳ máy chủ web tĩnh nào: Netlify, GitHub Pages, Cloudflare Pages… |
| Kiểm thử | 94 ca bằng `node:test` có sẵn trong Node 22 trở lên |

### Các trang

| Trang | Đường dẫn | Nội dung |
|---|---|---|
| Lướt duyên | `#/` | Bảng tin cuộn từng trang, mỗi bài có ảnh bìa riêng, lọc theo chủ đề |
| Tìm kiếm | `#/tim` | Tìm bài viết, 78 lá bài, 12 cung, 12 con giáp; tìm được khi gõ không dấu |
| Tarot | `#/tarot` | Lá bài hôm nay, 5 kiểu trải bài, thư viện 78 lá Rider–Waite–Smith |
| Chiêm tinh / Bản đồ sao | `#/chiem-tinh`, `…/ban-do-sao` | 12 cung, hành tinh, nhà, góc chiếu, luận giải |
| Tử vi / Lá số | `#/tu-vi`, `…/la-so` | Can Chi, nạp âm; lá số 12 cung, 14 chính tinh, khoảng 40 phụ tinh, Tứ Hóa, Tuần Triệt, độ sáng sao, đại hạn |
| Bản mệnh | `#/ban-menh` | Nhập ngày giờ sinh một lần để xem tổng hợp Đông và Tây |
| Gieo duyên, Tủ, Tài khoản, Về | `#/gieo`, `#/tu`, `#/tai-khoan`, `#/ve` | Viết bài, xem bài đã lưu, xuất/nhập/xoá dữ liệu, đăng nhập, xem phương pháp và đường dây hỗ trợ |

### Kiến trúc

```
web/
├─ index.html, boot.js  CSP, giao diện sáng/tối, ngôn ngữ, chống nhúng khung
├─ main.js              Định tuyến #/…, tải từng trang khi cần (views/*.js)
├─ views/               Giao diện từng trang
├─ content.js, i18n.js  Bản địa hoá; gói ngôn ngữ i18n/<mã>.js, -content.js, -text.js (tải khi chọn)
├─ cover.js             Vẽ ảnh bìa SVG cho từng bài
├─ lib/                 Phần tính toán thuần: lịch âm, an sao Tử Vi, vị trí hành tinh (không đụng DOM, có kiểm thử)
├─ data/                Nội dung gốc và lời luận giải
├─ store.js             Chỗ duy nhất đọc/ghi dữ liệu: localStorage ⇄ cloud.js ⇄ Supabase REST
└─ sw.js                Service worker: lấy từ mạng trước, mất mạng thì mở bản đã lưu
```

---

## 2. Tối ưu

Số đo lấy từ `npm run build` của bản 2.2.0.

| Hạng mục | Cách làm | Kết quả |
|---|---|---|
| Tải lần đầu nhỏ | Khung trang và CSS không qua thư viện. Mã của từng trang chỉ tải khi người dùng mở trang đó | Khung + CSS **57 KB**, toàn bộ JS **294 KB** (chưa nén) |
| Ngôn ngữ | Mỗi ngôn ngữ gồm 3 tệp, chỉ tải khi được chọn | Người đọc tiếng Việt không tải thêm byte nào; mỗi ngôn ngữ khác khoảng 100–200 KB |
| Hình ảnh | Ảnh bìa vẽ bằng SVG ngay trên máy. 78 lá Tarot là ảnh JPEG 300px, chỉ tải khi cuộn tới (`loading="lazy"`) | Ảnh bìa tốn 0 KB; ảnh lá bài tối đa 120 KB mỗi lá |
| Phông chữ | Google Fonts, kết nối sẵn (`preconnect`), dùng `display=swap` | Chữ hiện ngay bằng phông của máy, phông web về sau thì thay vào |
| Dùng lại sau lần đầu | Service worker lưu bản đã tải; tên bộ nhớ đệm đổi theo phiên bản + commit | Mở lại nhanh, mở được khi mất mạng, không bị kẹt bản cũ sau khi cập nhật |
| Chặn phình dung lượng | `tools/build.mjs` đặt giới hạn: khung + CSS ≤ 140 KB, JS ≤ 520 KB | Vượt giới hạn thì CI báo đỏ |
| Điện thoại trước | Giao diện thiết kế cho khổ 390px trước rồi mới mở rộng | Mọi trang đã kiểm tra ở 390px và 1366px, sáng/tối, 8 ngôn ngữ, không tràn ngang |
| Truy cập | Ô chọn gốc của hệ điều hành, nhãn `aria`, `<html lang>` đúng mã từng ngôn ngữ, phông dự phòng cho chữ Hán, Devanagari, Thái | Trình đọc màn hình đọc đúng ngôn ngữ |

---

## 3. Bảo mật

| Lớp | Cách làm | Kiểm chứng tự động |
|---|---|---|
| Chống chèn mã (XSS) | Mọi nội dung đưa vào HTML đều qua `esc()`. CSP `script-src 'self'`: không mã nội tuyến, không `eval` | `tests/security.test.mjs`, CodeQL |
| Chống nhúng khung (clickjacking) | `frame-ancestors 'none'` và `X-Frame-Options: DENY` trong `web/_headers`. Trên GitHub Pages (không hỗ trợ `_headers`), `boot.js` tự thoát khỏi khung lạ | `tests/security.test.mjs` |
| Tiêu đề HTTP | HSTS, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP trong `web/_headers` (Netlify, Cloudflare Pages tự đọc) | `tests/security.test.mjs` |
| Dữ liệu người dùng | Supabase Row Level Security: mỗi người chỉ đọc/sửa dữ liệu của mình. Bài cộng đồng phải được duyệt mới hiện; người dùng không tự duyệt được | `tests/cloud.test.mjs` |
| Ràng buộc dữ liệu | Giới hạn độ dài bài, ngôn ngữ hợp lệ, định dạng `refs`; dữ liệu mỗi người tối đa 1 MB | `supabase/schema.sql` |
| Khoá bí mật | Trong mã không có bí mật nào. Khoá `anon` của Supabase được thiết kế để công khai. Khoá `service_role` không bao giờ được đưa vào web; lỡ dán thì CI chặn | `tests/security.test.mjs` |
| Chuỗi cung ứng | Web không dùng thư viện npm. CI chỉ dùng action chính chủ, cấp quyền tối thiểu, `persist-credentials: false`. Dependabot đề xuất cập nhật | `.github/dependabot.yml` |
| Quét mã | CodeQL (`security-extended`) chạy mỗi lần đẩy mã và hằng tuần | `.github/workflows/codeql.yml` |
| Toàn vẹn bản giao | `SHA256SUMS.txt` cho từng tệp, kèm mã SHA-256 của tệp zip | `tools/build.mjs`, `tools/package.mjs` |
| An toàn tâm lý | Nhận diện cụm từ khủng hoảng ở 8 ngôn ngữ, hiện đường dây hỗ trợ của từng nước | `data/taxonomy.js` |
| Riêng tư | Không quảng cáo, không công cụ theo dõi, không cookie. Dữ liệu ở trên máy người dùng; người dùng tự tải về hoặc xoá được trong mục *Tủ* | — |

---

## 4. Triển khai

### Bước 0. Đóng gói

```bash
npm test          # 94 ca phải đạt
npm run build     # tạo thư mục dist/ để đăng web
```

Không có Supabase thì web vẫn chạy đủ mọi tính năng. Dữ liệu lưu trên máy người xem, và mục *Tài khoản* báo "chưa bật". Ai mở link cũng dùng được ngay, không cần đăng ký.

### Cách A: Netlify (khoảng 5 phút, không cần GitHub)

1. Chạy `npm run build`.
2. Mở **https://app.netlify.com/drop**, kéo thả thư mục `dist/` vào trang.
3. Vào *Site configuration → Change site name*, đặt tên, ví dụ `ansaospace`. Link sẽ là `https://ansaospace.netlify.app`.
4. Mỗi lần sửa code: build lại, rồi kéo thả lại vào *Deploys*.

Netlify tự áp dụng `_headers`, nên đây là cách có đủ lớp bảo mật HTTP nhất.

### Cách B: GitHub Pages (tự đăng mỗi lần đẩy code)

1. Tạo kho trên GitHub và đẩy mã lên nhánh `main`.
2. Vào *Settings → Pages → Source*, chọn **GitHub Actions**.
3. Mỗi lần push lên `main`, GitHub tự làm theo thứ tự: kiểm thử (Node 22 và 24), đóng gói, đăng lên `https://<tài-khoản>.github.io/<tên-kho>/`. Có bước nào lỗi thì dừng lại, web đang chạy giữ nguyên.
4. Nên làm thêm một lần:
   - *Settings → Branches*: bảo vệ `main`, bắt buộc 3 bước kiểm tra `Kiểm thử (Node 22)`, `Kiểm thử (Node 24)`, `Đóng gói` phải đạt.
   - *Settings → Code security*: bật Dependabot alerts, Secret scanning, Private vulnerability reporting.
   - *Settings → Environments → github-pages*: chỉ cho nhánh `main` đăng.

### Cách C: bật tài khoản Supabase (không bắt buộc, khoảng 10 phút)

1. Vào https://supabase.com, tạo **New project** tên `an-sao-space`, chọn vùng **Southeast Asia (Singapore)**, lưu lại mật khẩu CSDL.
2. Mở *SQL Editor*, dán toàn bộ [`supabase/schema.sql`](../supabase/schema.sql) rồi bấm **Run**. Kiểm tra: có 2 bảng `user_state`, `posts`, cả hai hiện nhãn *RLS enabled*. Tệp này chạy lại nhiều lần vẫn an toàn.
3. Vào *Authentication → URL Configuration*:
   - **Site URL** = địa chỉ web thật.
   - **Redirect URLs** = địa chỉ web thật và `http://localhost:5190/`.
4. Vào *Project Settings → API*, chép **Project URL** và khoá **anon public** vào `web/assets/js/config.js` (`SUPABASE_URL`, `SUPABASE_ANON_KEY`). Sau đó build và đăng lại.
5. Gói miễn phí: 500 MB, gửi được vài email mỗi giờ (nhiều người dùng thì gắn SMTP riêng ở *Authentication → SMTP Settings*). Dự án bị tạm dừng sau 1 tuần không ai dùng; bấm *Restore* là chạy lại.

### Tên miền riêng (không bắt buộc)

Mua tên miền, ví dụ `ansao.space` hay `ansaospace.com`. Trỏ tên miền theo hướng dẫn *Domain management* của Netlify, hoặc tệp `CNAME` của GitHub Pages, rồi bật HTTPS. Nhớ sửa luôn *Site URL* bên Supabase nếu đã bật.

### Kiểm tra sau khi đăng

- [ ] Mở link trên điện thoại: bảng tin, rút bài, lập lá số, đổi ngôn ngữ, đổi sáng/tối đều chạy.
- [ ] Tắt mạng, tải lại trang: web vẫn mở được.
- [ ] Chia sẻ link qua Zalo hoặc Messenger: hiện ảnh xem trước và tiêu đề "An Sao Space".
- [ ] Nếu đăng bằng Netlify: kiểm tra tiêu đề bảo mật tại https://securityheaders.com.

### Chia sẻ web

- Gửi **link**, hoặc **mã QR** để quét bằng điện thoại. Trên điện thoại có thể chọn "Thêm vào màn hình chính" để dùng như một app.
- Cần gửi mã nguồn cho người khác: `npm run package` tạo ra `release/an-sao-space-<phiên bản>.zip` và tệp `.sha256`.

---

## 5. Vận hành

### Lệnh

| Việc | Lệnh |
|---|---|
| Chạy thử trên máy | `npm start`, rồi mở http://localhost:5190. Máy chủ nhỏ viết bằng Node (`tools/serve.mjs`), không cần Python: luôn gửi tệp mới nhất (`Cache-Control: no-store`), chỉ phục vụ thư mục `web/`, chỉ nghe trên máy này. Đổi cổng: `PORT=5191 npm start` |
| Kiểm thử | `npm test` |
| Kiểm thử và đóng gói | `npm run verify` |
| Tạo bản bàn giao | `npm run package` |
| Xem câu luận giải chưa dịch | `npm run i18n:missing -- fr` |

### Việc thường gặp

| Việc | Cách làm |
|---|---|
| Duyệt bài cộng đồng | Supabase → *Table Editor → posts* → lọc `status = pending` → đổi thành `approved` hoặc `rejected` |
| Thêm bài mẫu | Viết trong `web/assets/js/data/posts.js`, thêm bản dịch vào **mọi** `i18n/*-content.js` (thiếu thì kiểm thử nhắc) |
| Sửa lời luận giải | Sửa `{ vi, en }` trong `data/*.js`, chạy `npm run i18n:missing -- <mã>` cho từng ngôn ngữ, dịch phần thiếu vào `i18n/<mã>-text.js` |
| Thêm một ngôn ngữ | (1) thêm dòng vào `i18n/langs.js`; (2) tạo 3 tệp `<mã>.js`, `<mã>-content.js`, `<mã>-text.js`, chép cấu trúc từ `fr`; (3) thêm vào `PACKS` trong `i18n.js` và bảng `html` trong `boot.js`; (4) thêm mã vào `posts_lang_check` trong `schema.sql`; (5) `npm test` phải đạt. Nên nhờ người bản ngữ am hiểu bộ môn đọc lại trước khi bật |
| Phát hành phiên bản | Sửa `version` trong `package.json`, ghi `CHANGELOG.md`, chạy `npm run verify`, commit, rồi `git tag vX.Y.Z && git push origin main vX.Y.Z`. GitHub tự tạo Release kèm zip và SHA-256 |
| Sao lưu (nếu có Supabase) | *Database → Backups* tải bản hằng ngày, hoặc chạy `pg_dump` hằng tuần |

### Định kỳ

- **Hằng tuần:** xem tab *Actions* (CI đỏ nghĩa là chưa đăng được) và tab *Security*. Gộp các pull request của Dependabot sau khi đọc ghi chú phát hành.
- **Hằng quý:** đổi mật khẩu CSDL Supabase. Rà danh sách người có quyền vào GitHub và Supabase, tất cả phải bật 2FA.
- **Hằng năm:** xác nhận lại số đường dây hỗ trợ (`data/taxonomy.js` và `i18n/*-content.js`).

### Sự cố thường gặp

| Hiện tượng | Nguyên nhân | Cách xử lý |
|---|---|---|
| Mở `localhost:5190` thấy bản cũ, hoặc vừa sửa code mà không thấy thay đổi | Từ bản này **không còn xảy ra**: khi chạy trên máy, app tự gỡ service worker cũ và xoá bộ nhớ đệm của nó, còn `npm start` không cho trình duyệt lưu tệp. Nếu vẫn thấy bản cũ (thường do máy chủ cũ bằng Python), nhấn Ctrl+Shift+R một lần | — |
| Đăng xong vẫn thấy bản cũ | Trình duyệt còn giữ bản trước | Tải lại một lần. Service worker tự nhận bản mới vì tên bộ nhớ đệm đổi theo commit |
| CI đỏ ở bước *Kiểm thử* | Thiếu bản dịch, sai biến `{x}`, lỡ dán khoá bí mật… | Đọc dòng `not ok` trong nhật ký, sửa rồi đẩy lại |
| Mở trực tiếp `index.html` thì trang trắng | Trình duyệt chặn ES module khi mở từ `file://` | Chạy `npm start` hoặc dùng bất kỳ máy chủ tĩnh nào |
| Không gửi được bài ở ngôn ngữ mới | CSDL được tạo từ bản cũ hơn 2.2 | Chạy lại `supabase/schema.sql` |
| Đăng ký không nhận được email | Gói miễn phí của Supabase giới hạn email | Đợi một lúc, hoặc gắn SMTP riêng |

---

## 6. Bàn giao

| Hạng mục | Việc cần làm |
|---|---|
| Kho GitHub | *Settings → Transfer*, hoặc thêm người nhận làm Admin; bật 2FA |
| Netlify | *Site configuration → Transfer site*, hoặc mời vào team |
| Supabase | *Organization → Members*: mời người nhận làm Owner, rồi rời tổ chức; đổi mật khẩu CSDL |
| Tên miền | Chuyển nhà đăng ký; trỏ lại DNS; bật HTTPS |
| Đối chiếu gói bàn giao | Giải nén zip, chạy `sha256sum -c SHA256SUMS.txt` (Linux/macOS) hoặc `Get-FileHash` (Windows). `build-info.json` ghi phiên bản, commit và thời điểm đóng gói |

---

## 7. Giới hạn đã biết và hướng phát triển

**Giới hạn**

- Đường dẫn dùng `#/` nên công cụ tìm kiếm chỉ thấy trang chủ.
- Múi giờ nơi sinh chỉ tính chính xác cho Việt Nam. Ngoài Việt Nam, múi giờ ước lượng theo kinh độ và không tính giờ mùa hè.
- Lịch âm tính theo UTC+7, nên một số năm có Tết hoặc tháng nhuận khác lịch Trung Quốc. Bản tiếng Trung đã ghi rõ điều này.
- Chiêm tinh dùng hoàng đạo nhiệt đới. Bản Hindi và Thái đã ghi rõ khác biệt với hệ sidereal.
- Bản dịch 6 ngôn ngữ mới do AI biên soạn theo thuật ngữ chuẩn. Kiểm thử chỉ bảo đảm dịch đủ và đúng định dạng, chưa thay được người bản ngữ đọc lại.

**Hướng phát triển**

- Chuyển sang đường dẫn thật (History API) để công cụ tìm kiếm đọc được từng bài.
- Gợi ý bài viết theo cung, tuổi và lá bài hôm nay của người đọc.
- Tử Vi: thêm lá số lưu niên (vận từng năm).
- Thêm ngôn ngữ Bồ Đào Nha (Brazil), Nhật, Hàn.
