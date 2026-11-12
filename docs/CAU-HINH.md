# Hướng dẫn cấu hình từng bước

Dành cho chủ dự án, viết cho người mới. Làm theo thứ tự. Mỗi bước ghi rõ **tốn tiền không** và **làm xong thì kiểm tra thế nào**.

> **Nguyên tắc vàng về bí mật:** mọi thứ có chữ *secret*, *service_role*, *API key* của Anthropic, mật khẩu SMTP **không bao giờ** được dán vào mã web, vào GitHub hay gửi qua chat. Chúng chỉ nằm trong ô cài đặt của Supabase, Cloudflare hoặc Anthropic. Mã web chỉ được chứa **khoá công khai** (`anon` của Supabase, site key của Turnstile).

| Bước | Việc | Chi phí | Bắt buộc khi nào |
|---|---|---|---|
| 1 | Mua tên miền `gravitispace.com` | khoảng 10–11 USD/năm | Trước khi quảng bá, trước khi có người dùng thật |
| 2 | Đưa web lên Cloudflare Pages | 0 đ | Cùng lúc với bước 1 |
| 3 | Khoá `/admin/` bằng Cloudflare Access | 0 đ (≤ 50 người dùng) | Trước khi đăng bản có trang quản trị |
| 4 | Bật tài khoản: Supabase | 0 đ (gói Free) | Khi muốn người dùng đăng nhập, đồng bộ nhiều máy |
| 5 | Email gửi thư xác nhận (SMTP riêng) | 0 đ (Resend Free: 3.000 thư/tháng) | Bắt buộc nếu bật bước 4 |
| 6 | Việc pháp lý theo Luật BVDLCN | Phí luật sư (nếu thuê) | Trước khi mở đăng ký công khai |
| 7 | (Sau này) AI luận giải | Theo lượt gọi, có trần chi tiêu | Khi duyệt tính năng AI |

---

## 1. Mua tên miền `gravitispace.com`

**Trước khi mua (5 phút, miễn phí):** tra trùng nhãn hiệu "Graviti" để tránh tranh chấp về sau.
- Việt Nam: https://wipopublish.ipvietnam.gov.vn (Cục Sở hữu trí tuệ), tìm "GRAVITI", nhóm 41, 44, 45 (giáo dục/giải trí, chăm sóc tinh thần, dịch vụ cá nhân).
- Quốc tế: https://branddb.wipo.int.
- Trùng tên ở ngành khác (ví dụ phần mềm dữ liệu) thường không sao. Trùng đúng ngành thì hỏi luật sư.

1. Tạo tài khoản tại https://dash.cloudflare.com (miễn phí). **Bật xác thực 2 lớp ngay**: *My Profile → Authentication*. Ai chiếm được tài khoản này là chiếm cả tên miền lẫn web.
2. *Domain Registration → Register Domains* → gõ `gravitispace.com` → *Purchase*.
   - Thanh toán: thẻ Visa/Mastercard (thẻ ghi nợ quốc tế của ngân hàng Việt Nam dùng được) hoặc PayPal.
   - Thông tin chủ sở hữu: điền thật (luật yêu cầu). Cloudflare **tự ẩn** thông tin này khỏi tra cứu công khai (WHOIS), miễn phí.
   - Chọn 1 năm (hoặc nhiều năm nếu muốn khỏi lo), **bật Auto-renew** (tự gia hạn).
   - Cloudflare bán theo giá gốc, không lãi và không tăng giá năm sau. Tên miền tự gắn vào DNS của Cloudflare, nên chống DDoS bật sẵn, không cần cấu hình gì.
   - Giới hạn duy nhất: tên miền mua ở Cloudflare phải dùng DNS của Cloudflare. Với Graviti thì đó lại là điều mình muốn.
3. Bật **Email Routing** (miễn phí): *Email → Email Routing* → tạo địa chỉ `privacy@gravitispace.com` chuyển tiếp về Gmail của bạn.
   Địa chỉ này đã ghi trong Chính sách quyền riêng tư, bắt buộc phải nhận được thư.

**Kiểm tra:** gửi thử một email tới `privacy@gravitispace.com`, thấy về Gmail là xong.

## 2. Đưa web lên Cloudflare (Workers, tệp tĩnh)

Cloudflare hiện gộp Pages vào **Workers**: tạo mới từ Git sẽ ra một Worker phục vụ tệp tĩnh. Miễn phí như Pages, cũng đọc `_headers`. Cấu hình nằm sẵn trong `wrangler.jsonc` ở gốc kho (tên `gravitispace-com`, đăng thư mục `dist/`).

1. Cloudflare → *Workers & Pages → Create → Import a repository* → cho phép truy cập kho `teedeetee13/Gravitispace.com`.
2. Điền:

   | Ô | Giá trị |
   |---|---|
   | Project name | `gravitispace-com` (phải trùng `name` trong `wrangler.jsonc`) |
   | Build command | `npm run build` (đổi thành `npm run build:admin` **sau khi** làm bước 3) |
   | Deploy command | `npx wrangler deploy` |
   | Root directory | `/` |

   Mỗi lần gộp vào `main`, Cloudflare tự dựng và đăng lại. Địa chỉ miễn phí: `gravitispace-com.<tên-tài-khoản>.workers.dev` (xem ở tab *Overview* hoặc *Domains*).
3. Khi có tên miền: tab *Domains → Add custom domain* → `gravitispace.com`, thêm `www.gravitispace.com` (Cloudflare tự chuyển hướng).
4. Sửa `hub/assets/js/data.js`: `LIVE.stars` = `'https://gravitispace.com/stars/'`, xoá dòng `starsLegacy`. Đẩy code lên.
5. Giữ GitHub Pages thêm 2–3 tháng. Đặt thông báo "Graviti đã chuyển về gravitispace.com".
   Dữ liệu trên máy gắn với địa chỉ web, nên người dùng cũ cần *Tủ của tôi → Tải dữ liệu về*, rồi *Nạp từ tệp* ở địa chỉ mới, hoặc đăng nhập nếu đã bật tài khoản.

**Kiểm tra:**
- Mở `https://gravitispace.com`, `/stars/`, `/privacy/`.
- Nhập địa chỉ vào https://securityheaders.com: phải đạt **A** trở lên. Cloudflare đọc tệp `_headers` ở gốc web.

**Chống DDoS:** Cloudflare tự lọc tấn công cho mọi web chạy trên Workers/Pages, không cần bật gì. Muốn chặn chặt hơn: *Security → WAF → Rate limiting rules* (gói Free có 1 quy tắc), ví dụ 100 yêu cầu/10 giây mỗi IP cho `/stars/*`. Thêm *Security → Bots → Bot Fight Mode*: bật (miễn phí).

### Chống spam thao tác của người dùng

Web Graviti là tệp tĩnh: bấm liên tục cũng chỉ tốn sức máy người bấm. Thứ cần chống spam là **những gì ghi lên máy chủ** (Supabase): đăng ký, đăng nhập, gửi bài. Có 4 lớp:

| Lớp | Chặn gì | Trạng thái | Ở đâu |
|---|---|---|---|
| Cloudflare (DDoS, Bot Fight Mode, rate limit) | Lượng truy cập ồ ạt vào web | Tự bật khi lên Cloudflare | Bước 2 ở trên |
| Giới hạn trong cơ sở dữ liệu | Gửi bài dồn dập: tối đa 10 bài/giờ và 20 bài chờ duyệt mỗi tài khoản; giới hạn độ dài; bài mới luôn phải chờ duyệt | ✅ đã có | `supabase/schema.sql` (`posts_before_insert`) |
| Supabase *Authentication → Rate Limits* | Đăng ký, đăng nhập, gửi thư dồn dập | Bật khi làm bước 4 | Bước 4–5 |
| **Cloudflare Turnstile** (ô "tôi không phải robot" miễn phí, thường người dùng không phải bấm gì) | Máy tạo tài khoản ảo hàng loạt | ⏳ **Chờ bạn duyệt**: phải nạp một tệp mã từ `challenges.cloudflare.com`, tức là thêm mã bên ngoài | Khi duyệt: Cloudflare → *Turnstile → Add site* lấy site key (công khai) và secret key; dán secret key vào Supabase *Authentication → Bot and Abuse Protection → Enable CAPTCHA → Turnstile*. Mình sẽ gắn ô Turnstile vào form đăng ký |

## 3. Khoá trang quản trị `/admin/` bằng Cloudflare Access

Trang tĩnh **không tự khoá được**: ai có đường dẫn đều tải được tệp HTML. Vì vậy cổng phải đặt ở Cloudflare, chặn trước khi tệp được gửi đi. Bản công khai (`npm run build`, cả GitHub Pages lẫn Worker `gravitispace-com`) không chứa `/admin/`.

**Vì sao chưa khoá riêng được `/admin/`:** quy tắc Access theo đường dẫn chỉ gắn được vào tên miền nằm trong tài khoản của bạn (bạn giữ DNS của nó). `workers.dev` là tên miền chung của Cloudflare, nên với nó Cloudflare chỉ cho bật/tắt Access cho **cả một Worker** (tab *Access* của Worker: *Previews only* hoặc *All traffic*).

### Trước khi có tên miền: một Worker riêng cho quản trị (cùng repo)

| Worker | Lệnh dựng | Ai vào được |
|---|---|---|
| `gravitispace-com` | `npm run build` | Mọi người. Tab Access: **Previews only** + **Cloudflare account** |
| `graviti-admin` | `npm run build:admin` | Chỉ bạn. Tab Access: **All traffic** + **Cloudflare account** |

1. *Workers & Pages → Create → Import a repository* → cùng repo `Gravitispace.com`.
   Project name `graviti-admin`, Build command **`npm run build`** (chưa có quản trị), Deploy command `npx wrangler deploy --name graviti-admin`.
2. Tab **Access** của `graviti-admin` → **All traffic** + policy **Cloudflare account** → *Apply Access*.
   **Không chọn "Email domain"**: với Gmail, mọi người có Gmail đều vào được.
3. Tab *Domains* của `graviti-admin`: tắt dòng **Preview**.
4. Cửa sổ ẩn danh: `graviti-admin.<tên-tài-khoản>.workers.dev` phải bắt đăng nhập Cloudflare; `gravitispace-com.<tên-tài-khoản>.workers.dev` vẫn mở bình thường.
5. Đúng cả hai mới đổi Build command của `graviti-admin` thành **`npm run build:admin`** và deploy lại. Trang quản trị ở `graviti-admin…/admin/`.

**Không bao giờ** chọn *All traffic* cho `gravitispace-com`: người dùng thường sẽ không vào được web.

### Khi có tên miền `gravitispace.com`

1. Worker `gravitispace-com` → *Domains → Add Domain* → `gravitispace.com`. Đổi Build command thành `npm run build:admin`.
   Trước khi đổi: Cloudflare One → *Access controls → Applications → Add an application → Self-hosted* → hostname `gravitispace.com`, path `admin` → policy Allow, Include Emails = email của bạn. Thử ẩn danh thấy `/admin/` bị chặn rồi mới đổi.
2. Xoá Worker `graviti-admin`.

Trang quản trị chỉ chứa số liệu công khai (phiên bản, kiểm thử, lộ trình), không có khoá bí mật nào. Khoá lại là để giữ kín kế hoạch, không phải để giữ mật khẩu.

## 4. Bật tài khoản: Supabase

1. https://supabase.com → *New project*. Bật xác thực 2 lớp cho tài khoản Supabase.
   - Name: `graviti`. Region: **Southeast Asia (Singapore)** (gần Việt Nam nhất; đã ghi trong chính sách).
   - Database password: tạo mật khẩu dài, cất trong trình quản lý mật khẩu, **không** dùng trong web.
2. *SQL Editor → New query* → dán toàn bộ `supabase/schema.sql` → *Run*.
   Supabase sẽ hiện hộp **"Potential issue detected… destructive operation"**. Đây là cảnh báo tự động khi thấy chữ `DROP`/`DELETE`, không phải lỗi: tệp chỉ gỡ chính sách cũ của chính nó để tạo lại, không xoá dữ liệu. Bấm **Run this query**. Kết quả đúng là dòng *Success. No rows returned*.
   **Kiểm tra:** *Table Editor* có 2 bảng `user_state` và `posts`, cả hai không có nhãn đỏ *Unrestricted* (tức là RLS đã bật).
   Lần nào cập nhật lược đồ thì chạy lại cả tệp: tệp viết để chạy lại nhiều lần không hỏng.
3. *Authentication → Sign In / Providers → Email*:
   - Bật **Confirm email**.
   - Minimum password length: **10**.
4. *Authentication → URL Configuration*:
   - Site URL: `https://gravitispace.com/`
   - Redirect URLs: mỗi địa chỉ web một dòng, **kết thúc bằng `/**`** (hai dấu sao: mọi trang bên dưới):
     - `https://gravitispace.com/**`
     - `https://teedeetee13.github.io/Gravitispace.com/**` (bản GitHub Pages)
     - `https://gravitispace-com.<tên-tài-khoản>.workers.dev/**` (bản Cloudflare trước khi có tên miền)
     - `http://localhost:5191/**` và `http://localhost:5190/**` (chạy thử trên máy)

   Vì sao phải `/**`: hộp đăng nhập hiện ngay trên trang đang xem (trang chính, một lá bài, một bài viết…), và Google hay link trong email quay về **đúng trang đó**. Supabase chỉ cho quay về địa chỉ có trong danh sách; địa chỉ lạ thì nó đưa về Site URL (vẫn đăng nhập được, chỉ là về trang chủ).
5. *Project Settings → API*: chép **Project URL** và khoá **anon public** vào `web/assets/js/config.js`:
   ```js
   SUPABASE_URL: 'https://xxxx.supabase.co',
   SUPABASE_ANON_KEY: 'eyJ...',   // khoá "anon public": công khai theo thiết kế, an toàn nhờ RLS
   ```
   **Không** chép khoá `service_role` hay `sb_secret_...`: khoá đó vượt qua mọi lớp bảo vệ.
6. Gói Free tự **tạm dừng** dự án nếu 7 ngày không có ai dùng. Khi có người dùng thật, cân nhắc gói Pro (25 USD/tháng). Gói Pro còn có sao lưu hằng ngày.

**Kiểm tra:** `npm run preview` → mở http://localhost:5191/ → bấm *Đăng nhập* ở góc trên → *Tạo tài khoản* → đăng ký bằng email thật. Phải có ô "Tôi đồng ý…" (không đánh sẵn), thư xác nhận phải về.

### 4b. Đăng nhập bằng Google

Web đã có nút **Tiếp tục với Google** (`CONFIG.OAUTH_PROVIDERS` trong `web/assets/js/config.js`). Nút chỉ chạy khi bạn bật Google trong Supabase:

1. https://console.cloud.google.com → tạo dự án `graviti` → **Google Auth Platform**:
   - *Branding*: tên ứng dụng `Graviti`, email hỗ trợ, đường dẫn trang chính và trang `/privacy/`.
   - *Audience*: **External**. Lúc đầu để *Testing* và thêm email của bạn vào *Test users*; mở cho mọi người thì bấm *Publish app*.
   - *Data access*: chỉ cần `openid`, `email`, `profile` (loại không nhạy cảm, Google không bắt thẩm định).
   - *Clients → Create client → Web application*:
     - Authorized JavaScript origins: `https://teedeetee13.github.io`, địa chỉ `https://gravitispace-com.<tên-tài-khoản>.workers.dev`, sau này `https://gravitispace.com`.
     - Authorized redirect URIs: **chỉ một dòng** `https://<mã-dự-án>.supabase.co/auth/v1/callback` (lấy đúng dòng *Callback URL* mà Supabase hiện ở bước 2).
2. Supabase → *Authentication → Sign In / Providers → Google* → bật, dán **Client ID** và **Client Secret** → *Save*.
   **Client Secret chỉ dán vào Supabase**, không bao giờ vào mã web.
3. Kiểm tra *URL Configuration* (bước 4 ở trên) đã có địa chỉ web của bạn trong *Redirect URLs*. Thiếu là Google xong sẽ quay về sai trang.

Cách mã chạy (luồng **PKCE**, không dùng thư viện): trình duyệt tạo một chuỗi bí mật, chỉ gửi bản băm của nó sang Google/Supabase, rồi đổi mã `?code=…` quay về lấy phiên bằng chuỗi bí mật đó. Link giả mạo hay mã bị lộ đều không đăng nhập được (`tests/cloud.test.mjs` kiểm tra). Người dùng phải tích ô đồng ý chính sách trước khi bấm nút, và phiên bản chính sách được ghi vào tài khoản như khi đăng ký bằng email.

Cùng một email thì Supabase tự gộp: ai đã đăng ký bằng email rồi bấm Google (cùng địa chỉ Gmail) vẫn vào đúng tài khoản cũ.

Lưu ý: trước khi có tên miền riêng, màn hình chọn tài khoản của Google ghi "tiếp tục tới `<mã-dự-án>.supabase.co`". Khi có `gravitispace.com`, có thể bật *Custom domain* của Supabase (gói trả phí) để đổi dòng này.

## 5. Email xác nhận: SMTP riêng (bắt buộc nếu bật Supabase)

Email có sẵn của Supabase chỉ gửi khoảng **2 thư/giờ** và chỉ tới email trong nhóm của bạn. Người dùng thật sẽ không nhận được thư.

1. https://resend.com → đăng ký (Free: 3.000 thư/tháng, 100 thư/ngày) → *Domains → Add* `gravitispace.com`.
   Resend đưa ra vài bản ghi DNS → thêm vào Cloudflare *DNS → Records* (Resend có nút tự thêm cho Cloudflare).
2. Resend → *API Keys → Create* (quyền chỉ gửi thư).
3. Supabase → *Authentication → Emails → SMTP Settings → Enable custom SMTP*:
   Host `smtp.resend.com`, Port `465`, User `resend`, Password = API key vừa tạo, Sender `Graviti <no-reply@gravitispace.com>`.
4. *Authentication → Rate Limits*: đặt số thư mỗi giờ phù hợp (mặc định 30/giờ khi dùng SMTP riêng).

## 6. Việc pháp lý theo Luật Bảo vệ dữ liệu cá nhân (91/2025/QH15, hiệu lực 01/01/2026)

Mã nguồn đã làm phần kỹ thuật (bảng dưới). Phần giấy tờ thì chỉ bạn làm được. **Nên thuê luật sư rà một lần trước khi mở đăng ký công khai.** Đây là hướng dẫn kỹ thuật, không phải tư vấn pháp lý.

| Yêu cầu của luật | Trạng thái | Ở đâu |
|---|---|---|
| Thông báo xử lý dữ liệu, mục đích rõ ràng | ✅ | Trang `/privacy/` (Việt + Anh, bản Việt có giá trị) |
| Đồng ý rõ ràng, tự nguyện, không đánh sẵn; lưu được bằng chứng | ✅ | Ô đồng ý khi đăng ký; lưu `consent_version` + `consent_at` vào tài khoản; chưa đồng ý thì không gửi gì lên máy chủ |
| Tối thiểu hoá dữ liệu | ✅ | Mặc định chỉ lưu trên máy; không thu số điện thoại, CCCD, vị trí; người đọc không thấy `user_id` |
| Quyền xem, tải về, sửa, xoá, rút đồng ý | ✅ | Tải dữ liệu về, Bản mệnh, Xoá tài khoản (xoá cả máy chủ lẫn máy) |
| Biện pháp bảo vệ | ✅ | HTTPS, CSP, RLS, mật khẩu băm, giới hạn gửi bài, không khoá bí mật trong mã, kiểm thử bảo mật tự động |
| Danh tính bên kiểm soát dữ liệu | ⏳ **Bạn** | Điền họ tên / tên doanh nghiệp vào mục 1 của `/privacy/` |
| Hồ sơ đánh giá tác động xử lý và chuyển dữ liệu ra nước ngoài (Supabase ở Singapore) | ⏳ **Bạn** | Theo tìm hiểu của mình: doanh nghiệp nhỏ, khởi nghiệp được chọn làm hay không trong 5 năm đầu; hộ kinh doanh, doanh nghiệp siêu nhỏ được miễn (trừ khi xử lý dữ liệu nhạy cảm hoặc kinh doanh dịch vụ xử lý dữ liệu). **Hỏi luật sư** xem Graviti thuộc diện nào |
| Báo sự cố trong 72 giờ | ⏳ **Bạn** | Lưu sẵn đầu mối của A05 (Cục An ninh mạng và phòng, chống tội phạm sử dụng công nghệ cao, Bộ Công an) |
| Trẻ em | ✅ chính sách / ⏳ quy trình | Chính sách: dưới 16 tuổi cần cha mẹ đồng ý. Khi có báo cáo, xoá tài khoản |

Mỗi khi đổi nội dung chính sách: tăng `CONSENT_VERSION` trong `web/assets/js/config.js` **và** số phiên bản trên trang `/privacy/`. Kiểm thử bắt buộc hai số khớp nhau.

## 7. (Sau này) AI luận giải chuyên sâu

Gói **Claude Pro** (trả tháng trên claude.ai) dành cho **một người chat**. Nó không dùng được để chạy tính năng cho người dùng của web. Web phải dùng **Claude API**, trả tiền theo lượt.

1. https://platform.claude.com → tạo tài khoản → nạp trước (ví dụ 10 USD).
2. *Settings → Limits*: đặt **trần chi tiêu tháng = 38 USD** (khoảng 1 triệu đồng). Vượt trần thì API tự dừng, không bao giờ bị trừ quá.
3. Tạo API key → dán vào **Cloudflare Workers** (*Settings → Variables → Secret*), **không bao giờ** dán vào mã web.
4. Chi phí ước tính và cách chọn mô hình: xem `docs/GRAVITI.md` mục 5.

## 8. Bảo vệ nhánh main (GitHub)

GitHub → kho → *Settings → Branches → Add branch ruleset*: nhánh `main`, bật *Require a pull request before merging* và *Require status checks to pass* (chọn các bước "Kiểm thử"). Trang quản trị sẽ tự đổi sang "Đã bảo vệ".
