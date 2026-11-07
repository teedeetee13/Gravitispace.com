# Hữu Duyên

Kho chữ chữa lành về Tarot, Chiêm tinh và Tử vi, có lập lá số Tử Vi Đẩu Số, bản đồ sao và rút bài mỗi ngày. 8 ngôn ngữ: Việt, Anh, Tây Ban Nha, Pháp, Đức, Trung phồn thể, Hindi, Thái. Lướt xuống, bài viết nào đến với bạn, là duyên.

- Mã nguồn website: [`web/`](web/) (xem [web/README.md](web/README.md))
- **Checklist hoàn thiện để duyệt:** [docs/CHECKLIST.md](docs/CHECKLIST.md)
- **Hồ sơ bàn giao:** [docs/BAN-GIAO.md](docs/BAN-GIAO.md) · Bảo mật: [SECURITY.md](SECURITY.md) · Phiên bản: [CHANGELOG.md](CHANGELOG.md)
- Kiểm thử tự động: [`tests/`](tests/) — chạy bằng `npm test` (Node.js ≥ 20, không cần cài thư viện)
- Mỗi lần đẩy code lên `main`: kiểm thử (Node 20 + 22) → đóng gói `dist/` → tự đăng GitHub Pages ([`deploy.yml`](.github/workflows/deploy.yml)); đẩy thẻ `vX.Y.Z` → GitHub Release kèm gói bàn giao ([`release.yml`](.github/workflows/release.yml)); quét bảo mật CodeQL ([`codeql.yml`](.github/workflows/codeql.yml))

Chạy thử trên máy:

```bash
npm start            # = python -m http.server 5173 --directory web
npm test             # 92 kiểm thử
npm run build        # đóng gói dist/
npm run package      # release/huu-duyen-<phiên bản>.zip + SHA-256
```
