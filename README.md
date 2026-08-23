# Moon - Quỳnh Như

Website học tập tĩnh (static, không build) cho bé Moon - Quỳnh Như, giúp bé chọn chủ đề học và lật xem hình ảnh bài học (mindmap/flashcard) theo từng ngày.

## Chức năng

- **Trang chủ** (`index.html`) — hiển thị lưới các chủ đề học (topic) để chọn.
- **Danh sách bài học** (`topic.html?topic=<id>`) — hiển thị danh sách các ngày/bài học trong một chủ đề.
- **Xem hình bài học** (`day.html?topic=<id>&day=<n>`) — xem hình ảnh bài học toàn màn hình, có nút quay lại, bật/tắt fullscreen, và zoom in/out (1x–4x).

## Công nghệ

Next.js (App Router), TypeScript, Tailwind CSS. Dữ liệu chủ đề/bài học lưu trong file JSON tĩnh dưới `public/data/`, ảnh bài học lưu ở dạng webp. Triển khai trên Vercel.

## Cấu trúc dự án

```text
app/          # Routes và API endpoints
components/   # React components
hooks/        # Custom hooks (progress, keyboard/TV navigation)
lib/          # Data access, types
public/data/  # JSON + ảnh bài học
docs/         # Tài liệu dự án (design system, specs, screens...)
tests/        # (chưa dùng)
vercel.json   # Cấu hình deploy Vercel
```

Xem chi tiết trong [`CLAUDE.md`](./CLAUDE.md).

## Chạy thử local

```bash
npm install
npm run dev
```

Mở `index.html` → chọn chủ đề → chọn bài → xem hình.
