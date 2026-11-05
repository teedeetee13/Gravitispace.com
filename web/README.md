# Hữu Duyên — website

Kho chữ chữa lành về **Tarot, Chiêm tinh, Tử vi**. Người dùng lướt bài viết theo kiểu "hữu duyên" (ngẫu nhiên, từng trang một), tra cứu, rút bài và gieo bài của chính mình.

> Bản hiện tại là **bản thử nghiệm chạy hoàn toàn trên trình duyệt**: không cần máy chủ, không cần cài đặt. Bài viết người dùng gieo chỉ lưu trong `localStorage` của máy đó.

## Chạy thử

Từ thư mục `Portfolio`:

```bash
python -m http.server 5173 --directory web
```

Mở http://localhost:5173. (Phải chạy qua máy chủ; mở trực tiếp file `index.html` sẽ không chạy vì trình duyệt chặn ES module từ `file://`.)

## Tính năng

| Trang | Đường dẫn | Mô tả |
|---|---|---|
| Lướt duyên | `#/` | Bảng tin cuộn từng trang, thứ tự ngẫu nhiên, lọc theo chủ đề |
| Tìm kiếm | `#/tim` | Một ô tìm cho bài viết, 78 lá bài, 12 cung, 12 con giáp; tìm không dấu được |
| Tarot | `#/tarot` | Rút một lá mỗi ngày + ghi chú, 4 kiểu trải bài, thư viện 78 lá |
| Chiêm tinh | `#/chiem-tinh` | Tra cung theo ngày sinh, 12 cung, 4 nguyên tố |
| Tử vi | `#/tu-vi` | Tra Can Chi, mệnh nạp âm, ngũ hành, tam hợp, tứ hành xung |
| Bản mệnh | `#/ban-menh` | Nhập ngày sinh một lần → cung + tuổi + lá bài hôm nay |
| Gieo duyên | `#/gieo` | Viết bài, gắn với lá bài/cung/tuổi; tự hiện đường dây hỗ trợ nếu phát hiện dấu hiệu khủng hoảng |
| Tủ của tôi | `#/tu` | Bài đã cất, bài đã gieo, nhật ký lá bài |
| Bài viết | `#/bai/<id>` | Trang riêng của một bài, có đường dẫn để chia sẻ |

## Cấu trúc

```
web/
├── index.html              Khung trang, thanh điều hướng, bộ biểu tượng SVG
├── assets/
│   ├── favicon.svg
│   ├── css/style.css       Toàn bộ giao diện (sáng/tối, điện thoại/máy tính)
│   └── js/
│       ├── main.js         Điều hướng + nút dùng chung (chạm, cất, gửi, đổi theme)
│       ├── store.js        Lưu trữ cục bộ — chỗ DUY NHẤT cần thay khi có máy chủ
│       ├── ui.js           Thẻ bài viết, lá bài Tarot, chip…
│       ├── util.js         Hàm tiện ích (chống chèn mã, tìm không dấu…)
│       ├── data/           Dữ liệu tĩnh: tarot, cung hoàng đạo, can chi, bài mẫu
│       └── views/          Mỗi trang một file
└── README.md
```

## Cần làm tiếp

- [ ] **Kiểm tra lại số đường dây hỗ trợ** trong `data/taxonomy.js` trước khi ra mắt
- [ ] Máy chủ + cơ sở dữ liệu (gợi ý: Supabase) để bài viết được chia sẻ thật giữa mọi người
- [ ] Kiểm duyệt bài viết trước khi hiện công khai
- [ ] Thuật toán "hữu duyên": ưu tiên bài hợp với cung/tuổi/lá bài hôm nay của người đọc
- [ ] Cung Mặt Trăng, cung Mọc (cần thư viện thiên văn), lá số Tử Vi Đẩu Số (cần lịch âm)
- [ ] Ảnh minh hoạ riêng cho 78 lá bài
- [ ] Tên miền, triển khai (Vercel/Netlify), ảnh xem trước khi chia sẻ (OG image)
