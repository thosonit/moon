# Cấu trúc Data

Ứng dụng không dùng database. Có hai loại lưu trữ hoàn toàn tách biệt:

1. **Data bài học** — file JSON tĩnh trong `public/data/`, chỉ đọc, do server serve qua `lib/data.ts` và 2 API route.
2. **Data tiến trình học** — lưu ở `localStorage` của trình duyệt người dùng, không có backend nào biết đến.

```text
public/data/
├── topics.json                          # danh sách chủ đề
├── <topicId>.json                       # danh sách ngày học của 1 chủ đề (1 file/chủ đề)
└── images/                               # ảnh minh hoạ cho từng ngày (webp)

localStorage (trình duyệt)
└── moon:progress:<topicId> -> number[]   # các ngày đã hoàn thành, theo từng chủ đề
```

## 1. Data bài học (`public/data/*.json`)

### `topics.json` — danh sách chủ đề

Type: `Topic[]` ([`lib/types.ts`](../lib/types.ts))

| Field | Type | Ghi chú |
|---|---|---|
| `id` | `string` | slug, dùng làm tên file `<id>.json` và trong URL `/topic/[topicId]` |
| `title` | `string` | tên hiển thị |
| `totalDays` | `number` | tổng số ngày, hiển thị ở UI |

```json
[
  { "id": "mindmap-heineman-gk7", "title": "Mindmap Heineman GK", "totalDays": 70 },
  { "id": "365-daily-english-presentations", "title": "365 Daily English Presentations", "totalDays": 365 }
]
```

### `<topicId>.json` — danh sách ngày của 1 chủ đề

Type: `DayEntry[]` ([`lib/types.ts`](../lib/types.ts))

| Field | Type | Ghi chú |
|---|---|---|
| `day` | `number` | thứ tự ngày, dùng làm khoá trong URL `/day/[topicId]/[day]` và trong progress |
| `title?` | `string` | tiêu đề bài học (tuỳ chọn) |
| `imagePath?` | `string` | đường dẫn ảnh tương đối trong `public/`, ví dụ `data/images/<file>.webp` |
| `driveUrl?` | `string` | link Google Drive thay thế cho ảnh, được convert sang URL ảnh trực tiếp qua [`lib/drive-url.ts`](../lib/drive-url.ts) |

```json
[
  { "day": 1, "imagePath": "data/images/mindmap-heineman-gk7-p01.webp", "title": "At the Market" },
  { "day": 2, "imagePath": "data/images/mindmap-heineman-gk7-p02.webp", "title": "Rex" }
]
```

### Luồng đọc data

```text
public/data/*.json
      │  fs.readFile (server-only)
      ▼
lib/data.ts
  ├── getTopics()            → đọc topics.json
  ├── getTopicMeta(topicId)  → tìm 1 topic trong getTopics()
  └── getDays(topicId)       → đọc <topicId>.json
      │
      ▼
app/api/topics/route.ts                    GET /api/topics
app/api/topics/[topicId]/days/route.ts     GET /api/topics/:topicId/days
```

Không có ghi (write) nào vào các file JSON này từ phía ứng dụng — đây là data tĩnh, chỉnh sửa thủ công.

## 2. Data tiến trình học (localStorage)

Quản lý bởi [`hooks/useProgress.ts`](../hooks/useProgress.ts). Không đồng bộ server, không có tài khoản người dùng — mỗi trình duyệt/thiết bị có tiến trình riêng.

| Key | Value | Ghi chú |
|---|---|---|
| `moon:progress:<topicId>` | `number[]` (JSON) | danh sách các `day` đã đánh dấu hoàn thành trong chủ đề đó |

```text
localStorage["moon:progress:mindmap-heineman-gk7"] = "[1,2,5,7]"
```

- Đọc: `readCompletedDays(topicId)` — parse JSON, lọc lấy phần tử là số nguyên, lỗi (mất quyền, quota, private mode) → trả về `[]`.
- Ghi: `writeCompletedDays(topicId, days)` — ghi đè toàn bộ mảng mỗi lần toggle; lỗi ghi bị nuốt im lặng (tiến trình đơn giản không lưu được, không có bản backup).
- `toggleDayDone(day)` thêm/xoá 1 ngày khỏi `Set` state rồi ghi lại toàn bộ mảng.

### Hệ quả

- Xoá cache trình duyệt / đổi thiết bị → mất toàn bộ tiến trình.
- Không có cách nào server biết người dùng đã học đến đâu.
