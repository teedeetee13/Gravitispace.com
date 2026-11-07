# Hữu Duyên — website

Kho chữ chữa lành về **Tarot, Chiêm tinh, Tử vi**, **8 ngôn ngữ** (Việt, Anh, Tây Ban Nha, Pháp, Đức, Trung phồn thể, Hindi, Thái). Người dùng lướt bài viết theo kiểu "hữu duyên", rút bài, lập **lá số Tử Vi Đẩu Số** và **bản đồ sao**, đọc luận giải và lộ trình năng lượng.

> Bản hiện tại là **web tĩnh chạy hoàn toàn trên trình duyệt**, không phụ thuộc thư viện ngoài, không cần bước build. Dữ liệu cá nhân chỉ lưu trong `localStorage` của máy đó. Kiến trúc đã chuẩn bị sẵn để lên web động (xem [docs/CHECKLIST.md](../docs/CHECKLIST.md), mục 5).

## Chạy thử

```bash
python -m http.server 5173 --directory web
```

Mở http://localhost:5173. (Phải chạy qua máy chủ; mở trực tiếp `index.html` sẽ không chạy vì trình duyệt chặn ES module từ `file://`.)

## Tính năng

| Trang | Đường dẫn | Mô tả |
|---|---|---|
| Lướt duyên | `#/` | Bảng tin cuộn từng trang, thứ tự ngẫu nhiên, lọc theo chủ đề |
| Tìm kiếm | `#/tim` | Một ô tìm cho bài viết, 78 lá bài, 12 cung, 12 con giáp; tìm không dấu, tìm cả tiếng Anh |
| Tarot | `#/tarot` | Rút một lá mỗi ngày + ghi chú, 5 kiểu trải bài (có Thập tự Celtic 10 lá), thư viện 78 lá |
| Chiêm tinh | `#/chiem-tinh` | Tra cung theo ngày sinh, 12 cung, 4 nguyên tố |
| Bản đồ sao | `#/chiem-tinh/ban-do-sao` | Mặt Trời, Mặt Trăng, cung Mọc, 8 hành tinh, nhà, vòng hoàng đạo, luận giải, năng lượng giai đoạn hiện tại |
| Tử vi | `#/tu-vi` | Can Chi, mệnh nạp âm, ngũ hành, tam hợp, tứ hành xung |
| Lá số Tử Vi | `#/tu-vi/la-so` | Lá số 12 cung, 14 chính tinh, phụ tinh, Tứ Hóa, Tuần Triệt, luận giải, lộ trình đại hạn |
| Bản mệnh | `#/ban-menh` | Nhập thông tin sinh một lần → tổng hợp Đông + Tây |
| Gieo duyên | `#/gieo` | Viết bài, gắn với lá bài/cung/tuổi; tự hiện đường dây hỗ trợ nếu phát hiện dấu hiệu khủng hoảng |
| Tủ của tôi | `#/tu` | Bài đã cất, bài đã gieo, nhật ký lá bài, **dữ liệu của tôi** (tải về / nạp / xoá) |
| Bài viết | `#/bai/<id>` | Trang riêng của một bài, có đường dẫn để chia sẻ |
| Về | `#/ve` | Triết lý, phương pháp và nguồn dữ liệu, riêng tư, đường dây hỗ trợ |

## Cấu trúc

```
web/
├── index.html              Khung trang (CSP, Open Graph, manifest), thanh điều hướng, bộ biểu tượng SVG
├── sw.js                   Service worker: mở lại được khi mất mạng
├── manifest.webmanifest    Cài lên màn hình chính
├── 404.html, robots.txt
├── assets/
│   ├── favicon.svg, og-image.png
│   ├── css/style.css       Toàn bộ giao diện (sáng/tối, điện thoại/máy tính)
│   └── js/
│       ├── boot.js         Chạy trước khi vẽ: áp theme + ngôn ngữ đã chọn
│       ├── main.js         Khởi động, định tuyến tải lười, nút dùng chung, bắt lỗi toàn cục
│       ├── config.js       Cấu hình (nguồn dữ liệu local/remote)
│       ├── store.js        Kho dữ liệu (Repository) — chỗ DUY NHẤT cần thay khi có máy chủ
│       ├── i18n.js         Đa ngôn ngữ: t(), tr(), cx()
│       ├── i18n/           langs.js (danh mục) · <mã>.js giao diện · <mã>-content.js nội dung · <mã>-text.js lời luận giải (tải lười)
│       ├── cover.js        Ảnh bìa SVG cho từng bài viết (hạt giống = mã bài)
│       ├── content.js      Trả dữ liệu đã bản địa hoá cho giao diện
│       ├── ui.js, util.js  Mảnh giao diện dùng chung, tiện ích (chống XSS, tìm không dấu…)
│       ├── lib/            Lõi tính toán thuần: lunar.js, tuvi-chart.js, ephemeris.js
│       ├── data/           Dữ liệu tĩnh + lời luận giải
│       └── views/          Mỗi trang một tệp (birth.js: biểu mẫu thông tin sinh dùng chung)
└── README.md
```

## Cần làm tiếp

- [ ] **Kiểm tra lại số đường dây hỗ trợ** trong `data/taxonomy.js` trước khi ra mắt
- [ ] Máy chủ + cơ sở dữ liệu để bài viết được chia sẻ thật giữa mọi người (viết adapter `remote` trong `store.js`)
- [ ] Kiểm duyệt bài viết trước khi hiện công khai
- [ ] Thuật toán "hữu duyên": ưu tiên bài hợp với cung/tuổi/lá bài hôm nay của người đọc
- [ ] Tử Vi: độ sáng sao (miếu/vượng/hãm), vòng Tràng Sinh, lưu niên
- [ ] Ảnh minh hoạ riêng cho 78 lá bài
- [ ] Tên miền riêng
