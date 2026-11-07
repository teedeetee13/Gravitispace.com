# Hồ sơ bàn giao — Hữu Duyên v2.2

> Tài liệu dành cho người tiếp nhận vận hành / phát triển. Đọc theo thứ tự: 1 → 2 → 3 là đủ để chạy, đăng và phát hành.
> Các tài liệu liên quan: [CHECKLIST.md](CHECKLIST.md) (chi tiết từng hạng mục) · [SUPABASE.md](SUPABASE.md) (bật tài khoản) · [../SECURITY.md](../SECURITY.md) (bảo mật) · [../CHANGELOG.md](../CHANGELOG.md).

---

## 1. Tổng quan trong một trang

| | |
|---|---|
| **Sản phẩm** | Web chữa lành về Tarot, chiêm tinh phương Tây, Tử Vi Đẩu Số; bảng tin "lướt duyên", lập lá số, bản đồ sao, rút bài |
| **Ngôn ngữ** | 8: Việt (gốc), Anh, Tây Ban Nha, Pháp, Đức, Trung phồn thể, Hindi, Thái — đều dịch đủ 100% (kiểm thử bắt buộc) |
| **Công nghệ** | HTML + CSS + JavaScript thuần (ES Modules). **Không framework, không thư viện npm, không bước build bắt buộc** |
| **Lưu trữ** | Mặc định trên trình duyệt (`localStorage`). Tuỳ chọn: tài khoản Supabase (Postgres + Auth + RLS) |
| **Hosting** | GitHub Pages (miễn phí), tự đăng qua GitHub Actions. Chạy được trên mọi máy chủ tĩnh |
| **Kiểm thử** | `node:test` có sẵn trong Node ≥ 20 — 92 ca: lịch âm, an sao, thiên văn, kho dữ liệu, đồng bộ, đa ngôn ngữ, bảo mật |

### Sơ đồ kiến trúc

```
Trình duyệt
 ├─ index.html + boot.js ─ CSP, theme, ngôn ngữ, chống nhúng khung
 ├─ main.js ─ định tuyến #/…, tải lười từng trang (views/*.js)
 │    ├─ views/  ── giao diện từng trang (chỉ đọc qua content.js + store.js)
 │    ├─ content.js / i18n.js ── bản địa hoá (t, tr, cx) ← i18n/<mã>.js, <mã>-content.js, <mã>-text.js (tải lười)
 │    ├─ cover.js ── vẽ ảnh bìa SVG theo bài viết
 │    ├─ lib/ ── tính toán thuần: lịch âm, lá số Tử Vi, vị trí hành tinh (không đụng DOM)
 │    ├─ data/ ── nội dung gốc tiếng Việt + lời luận giải { vi, en }
 │    └─ store.js ── Repository duy nhất: localStorage ⇄ cloud.js ⇄ Supabase REST (tuỳ chọn)
 └─ sw.js ── service worker "mạng trước, bộ nhớ đệm sau" (mở lại khi offline)
```

---

## 2. Chạy, kiểm thử, đóng gói

Yêu cầu: **Node.js ≥ 20** và **Python 3** (chỉ để chạy máy chủ tĩnh khi thử trên máy; dùng bất kỳ máy chủ tĩnh nào cũng được).

| Việc | Lệnh | Kết quả |
|---|---|---|
| Chạy thử | `npm start` | http://localhost:5173 |
| Kiểm thử | `npm test` | 92 ca phải đạt |
| Đóng gói | `npm run build` | `dist/` — bản đăng web, đã đóng dấu phiên bản + commit, kiểm tra đường dẫn hỏng, báo dung lượng |
| Bản bàn giao | `npm run package` | `release/huu-duyen-<phiên bản>.zip` + `.sha256` |
| Kiểm tra đủ | `npm run verify` | test + build |
| Câu còn thiếu bản dịch | `npm run i18n:missing -- fr` | Danh sách câu luận giải tiếng Pháp chưa dịch (JSON) |

**Đối chiếu bản giao:** giải nén zip → so `sha256sum -c SHA256SUMS.txt` (Linux/macOS) hoặc `Get-FileHash` (Windows) với tệp `SHA256SUMS.txt` bên trong; `build-info.json` cho biết phiên bản, commit, thời điểm đóng gói.

---

## 3. CI/CD (GitHub Actions)

| Quy trình | Khi nào chạy | Làm gì |
|---|---|---|
| `deploy.yml` — Kiểm thử, đóng gói và đăng | Mọi push lên `main`, mọi pull request, chạy tay | Kiểm thử trên **Node 20 và 22** → `npm run build` → (chỉ `main`) đăng `dist/` lên GitHub Pages. Bước nào lỗi thì dừng, web đang chạy giữ nguyên |
| `release.yml` — Phát hành bản bàn giao | Đẩy thẻ `vX.Y.Z` | Kiểm tra thẻ khớp `package.json` → test → đóng gói → tạo **GitHub Release** kèm zip + SHA-256 |
| `codeql.yml` — Quét bảo mật | Push, pull request, sáng thứ Hai hằng tuần | CodeQL `security-extended` cho JavaScript |
| `dependabot.yml` | Hằng tuần | Đề xuất cập nhật phiên bản các action |

**Thiết lập một lần trên GitHub** (người tiếp nhận làm):
1. *Settings → Pages → Source*: chọn **GitHub Actions**.
2. *Settings → Branches*: bảo vệ nhánh `main` — bắt buộc pull request và bắt buộc các kiểm tra `Kiểm thử (Node 20)`, `Kiểm thử (Node 22)`, `Đóng gói` đạt.
3. *Settings → Code security*: bật **Dependabot alerts**, **Secret scanning**, **Private vulnerability reporting**.
4. *Settings → Environments → github-pages*: giới hạn chỉ nhánh `main` được đăng.

**Quy trình phát hành một phiên bản:**
```bash
# 1. sửa "version" trong package.json (ví dụ 2.3.0), ghi CHANGELOG.md
npm run verify
git commit -am "Phát hành 2.3.0"
git tag v2.3.0 && git push origin main v2.3.0     # → Release tự tạo, web tự đăng
```

---

## 4. Cấu hình và bí mật

| Mục | Nằm ở | Ghi chú |
|---|---|---|
| Supabase URL + khoá anon | `web/assets/js/config.js` | Khoá **anon** là công khai theo thiết kế. **Không bao giờ** dán `service_role` / `sb_secret_…` — kiểm thử bảo mật sẽ chặn |
| Phiên bản ứng dụng | `package.json` → tự chép vào `config.js` khi build | |
| Danh mục ngôn ngữ | `web/assets/js/i18n/langs.js` | Thêm/bớt ngôn ngữ — xem mục 6 |
| Đường dây hỗ trợ | `data/taxonomy.js` + `i18n/*-content.js` | ⚠️ Xác nhận lại số mỗi năm |
| Tiêu đề bảo mật | `web/_headers` (Netlify/Cloudflare) · CSP trong `index.html` (mọi nơi) | Nếu thêm dịch vụ ngoài, sửa **cả hai** chỗ |
| CSDL | `supabase/schema.sql` | Chạy lại an toàn nhiều lần; bản 2.2 thêm ràng buộc ngôn ngữ mới — **cần chạy lại** nếu đã tạo CSDL từ bản cũ |

---

## 5. Tài khoản cần chuyển giao

| Tài khoản | Việc cần làm khi bàn giao |
|---|---|
| Kho GitHub | Chuyển quyền sở hữu (*Settings → Transfer*) hoặc thêm người tiếp nhận làm Admin; bật 2FA |
| Supabase (nếu đã bật) | *Organization → Members*: mời người tiếp nhận làm Owner rồi rời tổ chức; đổi mật khẩu CSDL |
| Tên miền riêng (nếu có) | Chuyển nhà đăng ký; cấu hình CNAME trỏ GitHub Pages; bật *Enforce HTTPS* |
| Hộp thư nhận báo cáo bảo mật | GitHub Private vulnerability reporting (không cần hộp thư riêng) |

---

## 6. Vận hành hằng ngày

| Việc | Cách làm |
|---|---|
| Duyệt bài cộng đồng | Supabase → *Table Editor → posts* → lọc `status = pending` → đổi `approved` / `rejected` |
| Sao lưu dữ liệu | Gói miễn phí không có sao lưu tự động theo thời điểm: *Database → Backups* tải bản hằng ngày, hoặc `pg_dump` hằng tuần |
| Theo dõi lỗi | Tab *Actions* (CI đỏ = không đăng), tab *Security* (CodeQL, Dependabot) |
| Thêm bài mẫu | `web/assets/js/data/posts.js` + bản dịch trong **mọi** `i18n/*-content.js` (kiểm thử sẽ nhắc) |
| Thêm / sửa lời luận giải | Sửa `{ vi, en }` trong `data/*.js` → chạy `npm run i18n:missing -- <mã>` cho từng ngôn ngữ → dịch phần thiếu vào `i18n/<mã>-text.js` |
| **Thêm một ngôn ngữ mới** | (1) thêm dòng vào `i18n/langs.js`; (2) tạo `i18n/<mã>.js`, `<mã>-content.js`, `<mã>-text.js` (chép cấu trúc từ `fr`); (3) thêm vào bảng `PACKS` trong `i18n.js` và bảng `html` trong `boot.js`; (4) thêm mã vào ràng buộc `posts_lang_check` trong `schema.sql`; (5) `npm test` phải xanh. **Khuyến nghị:** nhờ một người bản ngữ am hiểu bộ môn đọc duyệt trước khi bật |

---

## 7. Giới hạn đã biết

- Định tuyến dùng `#/` nên công cụ tìm kiếm chỉ thấy trang chủ (lộ trình chuyển sang History API: CHECKLIST mục 5).
- Gợi ý múi giờ chính xác theo lịch sử **Việt Nam**; nơi sinh ngoài Việt Nam chỉ ước lượng theo kinh độ, **không tính giờ mùa hè** — người dùng tự chỉnh (biểu mẫu có ghi chú ở mọi ngôn ngữ).
- Lịch âm theo **múi giờ Việt Nam** (UTC+7): một số năm có ngày Tết / tháng nhuận khác lịch Trung Quốc, Đài Loan — đã ghi rõ trong phần "Cách tính" bản tiếng Trung.
- Chiêm tinh dùng **hoàng đạo nhiệt đới** (phương Tây). Người dùng Ấn Độ và Thái Lan quen hệ **sidereal** (निरयण / นิรายนะ): đã ghi chú rõ ở các trang tương ứng để không bị hiểu là "tính sai".
- Bản dịch 6 ngôn ngữ mới do AI biên soạn theo thuật ngữ chuẩn của từng nước; kiểm thử chỉ đảm bảo **đủ** và **đúng định dạng**, không thay được người bản ngữ đọc duyệt (xem CHECKLIST mục 9).
