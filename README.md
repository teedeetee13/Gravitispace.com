# Graviti

Hệ sinh thái chữa lành và kết nối, dự kiến tại `gravitispace.com`. Một web, chia theo đường dẫn:

| Đường dẫn | Phần | Mã nguồn |
|---|---|---|
| `/` | Trang chính Graviti, 9 ngôn ngữ (Việt, Anh, Hàn, Trung phồn thể, Thái, Hindi, Tây Ban Nha, Pháp, Đức) | `hub/` |
| `/stars/` | **Graviti Stars** (tên tiếng Việt: An Sao): Tarot, chiêm tinh, Tử Vi theo hướng chữa lành, 8 ngôn ngữ | `web/` |
| `/privacy/` | Chính sách quyền riêng tư (Luật BVDLCN 91/2025/QH15) | `hub/privacy/` |
| `/admin/` | Trang quản trị: chỉ quản trị viên, chỉ Việt/Anh, khoá bằng Cloudflare Access | `hub/admin/` |

Viết bằng HTML, CSS, JavaScript thuần, không dùng thư viện ngoài.

```bash
npm start            # chạy thử Graviti Stars: http://localhost:5190
npm run preview      # dựng cả web (có quản trị) và mở http://localhost:5191
npm test             # 110 kiểm thử (Node.js ≥ 22)
npm run build        # bản công khai → dist/ (không có /admin/)
npm run build:admin  # bản có /admin/ (chỉ dùng trên Cloudflare sau khi bật Access)
npm run verify       # kiểm thử + dựng (chạy trước khi đẩy code)
npm run package      # bản bàn giao: release/graviti-<phiên bản>.zip + SHA-256
```

| Tài liệu | Nội dung |
|---|---|
| **[docs/GRAVITI.md](docs/GRAVITI.md)** | Tên gọi, đường dẫn hay tên miền phụ, cấu trúc, **so sánh hosting**, **chi phí từng tính năng** (cả AI), kế hoạch trang quản trị |
| **[docs/CAU-HINH.md](docs/CAU-HINH.md)** | **Cấu hình từng bước**: tên miền, Cloudflare Pages, khoá `/admin/`, Supabase, email, việc pháp lý theo Luật BVDLCN |
| **[docs/SO-TAY.md](docs/SO-TAY.md)** | Sổ tay chính: tổng quan, tối ưu, bảo mật, **triển khai** (Netlify, GitHub Pages, Supabase), **vận hành**, bàn giao |
| [docs/CHECKLIST.md](docs/CHECKLIST.md) | Hồ sơ duyệt từng hạng mục: cách làm, công nghệ, nguồn tham khảo |
| [SECURITY.md](SECURITY.md) | Cách báo lỗ hổng bảo mật |
| [CHANGELOG.md](CHANGELOG.md) | Các phiên bản |
