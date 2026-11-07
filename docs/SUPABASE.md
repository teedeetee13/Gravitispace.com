# Bật tài khoản và cơ sở dữ liệu (Supabase) — khoảng 10 phút

Mã nguồn đã viết xong. Bạn chỉ cần tạo dự án Supabase (miễn phí) và dán 2 giá trị vào cấu hình.

## Bước 1. Tạo dự án

1. Vào https://supabase.com → **Start your project** → đăng nhập (GitHub hoặc email).
2. **New project**: đặt tên `huu-duyen`, đặt mật khẩu cơ sở dữ liệu (lưu lại), **Region: Southeast Asia (Singapore)** cho nhanh nhất với Việt Nam.
3. Chờ khoảng 2 phút để dự án khởi tạo.

## Bước 2. Tạo bảng

1. Menu trái → **SQL Editor** → **New query**.
2. Dán toàn bộ nội dung tệp [`supabase/schema.sql`](../supabase/schema.sql) → **Run**.
3. Kiểm tra: **Table Editor** có 2 bảng `user_state`, `posts`, cả hai hiện nhãn **RLS enabled**.

## Bước 3. Cấu hình đăng nhập

**Authentication → URL Configuration**:
- **Site URL**: địa chỉ web thật, ví dụ `https://teedeetee13.github.io/teeco/`
- **Redirect URLs**: thêm cả địa chỉ trên và `http://localhost:5173/` (để thử trên máy).

**Authentication → Providers → Email**: để bật *Confirm email* (khuyên dùng).

> Gói miễn phí dùng máy chủ email có giới hạn (vài email/giờ). Khi có nhiều người dùng, vào
> **Authentication → SMTP Settings** để gắn dịch vụ email riêng (Resend, Brevo…).

## Bước 4. Dán khoá vào web

**Project Settings → API** (hoặc **Data API**), chép:
- **Project URL** → `SUPABASE_URL`
- khoá **anon / public** → `SUPABASE_ANON_KEY`

Mở `web/assets/js/config.js`, điền:

```js
SUPABASE_URL: 'https://xxxxxxxx.supabase.co',
SUPABASE_ANON_KEY: 'eyJhbGciOi...',
```

> Khoá **anon** được thiết kế để công khai trên web. Dữ liệu được bảo vệ bằng RLS trong `schema.sql`
> (mỗi người chỉ đọc/sửa được dữ liệu của mình). **Tuyệt đối không** dán khoá `service_role` vào web.

## Bước 5. Thử

1. Chạy `python -m http.server 5173 --directory web`, mở http://localhost:5173/#/tai-khoan
2. Đăng ký → mở email → bấm đường dẫn → web tự đăng nhập.
3. Nhập thông tin sinh ở *Bản mệnh* → mở web ở máy khác, đăng nhập → thông tin đã có sẵn.
4. Tắt mạng → tải lại trang → vẫn đăng nhập, vẫn thấy dữ liệu; bật mạng → tự đồng bộ.

## Duyệt bài cộng đồng

**Table Editor → posts** → lọc `status = pending` → đọc bài → sửa `status` thành `approved` (hiện công khai) hoặc `rejected`.

## Lưu ý gói miễn phí

- 500 MB cơ sở dữ liệu, 50.000 người dùng hoạt động/tháng.
- Dự án miễn phí **bị tạm dừng sau 1 tuần không có hoạt động** (bấm *Restore* trong Dashboard để chạy lại). Khi web có người dùng đều đặn thì không lo; muốn chắc chắn thì lên gói Pro.
