# Moon - Quỳnh Như

Website học tập tĩnh (static, không build) cho bé Moon - Quỳnh Như, giúp bé chọn chủ đề học và lật xem hình ảnh bài học (mindmap/flashcard) theo từng ngày.

## Chức năng

- **Trang chủ** (`index.html`) — hiển thị lưới các chủ đề học (topic) để chọn.
- **Danh sách bài học** (`topic.html?topic=<id>`) — hiển thị danh sách các ngày/bài học trong một chủ đề.
- **Xem hình bài học** (`day.html?topic=<id>&day=<n>`) — xem hình ảnh bài học toàn màn hình, có nút quay lại, bật/tắt fullscreen, và zoom in/out (1x–4x).

## Công nghệ

Vanilla HTML/CSS/JS, không framework, không bundler. Dữ liệu chủ đề/bài học lưu trong file JSON tĩnh, ảnh bài học lưu ở dạng webp. Triển khai tĩnh trên Vercel.

## Cấu trúc dự án

```text
src/moon/     # Toàn bộ mã nguồn website (HTML/CSS/JS/data)
docs/         # Tài liệu dự án (design system, specs, screens...)
tests/        # (chưa dùng)
vercel.json   # Cấu hình deploy Vercel
```

Xem chi tiết trong [`CLAUDE.md`](./CLAUDE.md).

## Chạy thử local

```bash
npx serve src/moon
# hoặc
python3 -m http.server 8000 --directory src/moon
```

Mở `index.html` → chọn chủ đề → chọn bài → xem hình.
