# Chính sách bảo mật — An Sao Space

## Báo lỗ hổng

Nếu phát hiện lỗ hổng, **xin đừng mở issue công khai**. Hãy báo riêng trên GitHub: vào tab **Security** của kho mã này, chọn **Report a vulnerability**.

Trong báo cáo, xin mô tả lỗi là gì, cách tái hiện và ảnh hưởng. Chúng tôi phản hồi trong vòng 7 ngày và ghi tên người báo nếu bạn muốn.

## Phạm vi

- **Trong phạm vi:** mã web (`web/`), cấu hình CI/CD (`.github/`), lược đồ CSDL (`supabase/schema.sql`).
- **Ngoài phạm vi:** hạ tầng của GitHub Pages, Netlify, Supabase, Google Fonts. Lỗi ở các nơi này xin báo cho nhà cung cấp tương ứng.

## Các lớp bảo vệ

Xem [docs/SO-TAY.md, mục 3](docs/SO-TAY.md#3-bảo-mật). Mục đó liệt kê 13 lớp bảo vệ, phần kiểm thử tự động cho từng lớp, và giới hạn hiện tại về chống tấn công từ chối dịch vụ.
