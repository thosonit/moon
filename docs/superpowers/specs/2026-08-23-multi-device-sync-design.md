# Đồng bộ tiến độ học đa thiết bị + Hồ sơ (Profile) — Thiết kế

**Ngày:** 2026-08-23
**Trạng thái:** Đã duyệt design, chuẩn bị viết implementation plan

## Bối cảnh

Ứng dụng Moon hiện tại (Next.js App Router, TypeScript, Tailwind, không database) lưu tiến độ học (`completedDays` theo từng `topicId`) hoàn toàn trong `localStorage` của trình duyệt (`hooks/useProgress.ts`). Ứng dụng chủ yếu dùng trên TV. Không có khái niệm user/profile — mọi thiết bị là một "người dùng" độc lập.

## Mục tiêu

- Đồng bộ lịch sử học (các ngày đã hoàn thành) giữa nhiều thiết bị cho cùng một bé.
- Định danh người dùng bằng **Nickname + Ngày tháng năm sinh** — không mật khẩu.
- Hỗ trợ nhiều hồ sơ (profile) trên cùng một thiết bị TV, chọn/chuyển đổi dễ dàng.

## Ngoài phạm vi (Out of scope)

- Không migrate dữ liệu `localStorage` cũ hiện có — bắt đầu lại từ đầu.
- Không xử lý xung đột phức tạp hay hàng đợi offline — ứng dụng yêu cầu có mạng khi thao tác tiến độ; xung đột (hiếm khi xảy ra) giải quyết bằng "ghi sau cùng thắng" (last-write-wins) theo `completed_at`.
- Không có mật khẩu, không có session/JWT thật, không có vai trò (role) hay phân quyền.

## Kiến trúc

### Lưu trữ: Neon Postgres (SQL thuần, không ORM)

Schema chỉ gồm 2 bảng — dùng driver `@neondatabase/serverless` với SQL thuần (parameterized queries) thay vì ORM (Drizzle/Prisma), vì thêm ORM là abstraction thừa cho quy mô này. Nếu sau này schema phức tạp hơn, có thể migrate sang Drizzle.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname TEXT NOT NULL,
  birthdate DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (nickname, birthdate)
);

CREATE TABLE progress (
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  day INTEGER NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (profile_id, topic_id, day)
);
```

Kết nối qua biến môi trường `DATABASE_URL` (Neon connection string), cấu hình trong `.env.local` (dev) và Vercel Project Settings (prod) — không hardcode.

### API (2 route handlers mới dưới `app/api/`)

**`POST /api/profiles`**
- Body: `{ nickname: string, birthdate: string (YYYY-MM-DD) }`
- Hành vi "lookup-or-create": nếu cặp `(nickname, birthdate)` đã tồn tại → trả về profile đó; nếu chưa → tạo mới.
- Response: `{ id: string, nickname: string, birthdate: string }`
- Validate input bằng zod tại route handler (nickname không rỗng, birthdate là ngày hợp lệ, không ở tương lai).

**`GET /api/profiles/:id/progress?topicId=<topicId>`**
- Response: `{ completedDays: number[] }`

**`PUT /api/profiles/:id/progress`**
- Body: `{ topicId: string, day: number, completed: boolean }`
- `completed: true` → upsert row vào `progress` với `completed_at = now()`.
- `completed: false` → xoá row.
- Response: `{ completedDays: number[] }` (trạng thái mới nhất sau thao tác).

### Định danh & danh sách hồ sơ trên thiết bị

- Không có auth thật (không mật khẩu, không session/JWT). "Đăng nhập" = gọi `POST /api/profiles` với nickname + ngày sinh.
- Mỗi thiết bị (TV) giữ trong `localStorage`:
  - `moon:device-profiles` — mảng các profile đã "thêm vào thiết bị này": `{ id, nickname, birthdate }[]`.
  - `moon:active-profile-id` — id profile đang active trên thiết bị này.
- Xoá 1 profile khỏi danh sách thiết bị chỉ xoá local (không xoá trên Neon) — muốn dùng lại phải nhập lại nickname + ngày sinh.

## Luồng màn hình

1. **Màn hình chọn hồ sơ** (hiện trước Trang chủ khi thiết bị chưa có `activeProfileId`, hoặc khi bấm "Đổi hồ sơ"):
   - Lưới các profile trong `moon:device-profiles`, điều hướng bằng D-pad (tái dùng `useGridNav`).
   - Nút "Thêm hồ sơ mới" → form Nickname + Ngày sinh → `POST /api/profiles` → thêm vào `moon:device-profiles`, set `moon:active-profile-id`, vào Trang chủ.
   - Long-press/giữ trên 1 profile → tuỳ chọn "Xoá khỏi thiết bị này" (chỉ xoá local).
2. **Trang chủ / Danh sách bài học / Xem bài học**: giữ nguyên UI hiện tại, chỉ đổi nguồn dữ liệu tiến độ (xem Data flow).
3. Nút "Đổi hồ sơ" (dùng pattern `viewer-icon-button` đã có) ở Trang chủ để quay lại màn hình chọn hồ sơ.

## Data flow

- `ProfileContext` (React context) bọc app, cung cấp `activeProfile: { id, nickname } | null` và hàm `switchProfile`/`clearActiveProfile`, đọc/ghi `moon:active-profile-id`.
- `useProgress` đổi chữ ký: `useProgress(profileId: string, topicId: string)`.
  - Mount: `GET /api/profiles/:id/progress?topicId=`.
  - `toggleDayDone(day)`: `PUT /api/profiles/:id/progress` với `completed` đảo ngược trạng thái hiện tại, cập nhật state từ response.
  - Bỏ hoàn toàn code đọc/ghi `localStorage` cho tiến độ (giữ lại `localStorage` chỉ cho danh sách/active profile ở trên).

## Error handling

- Lỗi mạng/API khi gọi profile hoặc progress: hiển thị thông báo tiếng Việt ngắn ("Không thể kết nối, vui lòng kiểm tra mạng") + nút thử lại.
- Validate ngày sinh phía client trước khi submit (định dạng hợp lệ, không ở tương lai) để giảm round-trip lỗi.
- Server validate bằng zod, trả lỗi 400 rõ ràng nếu thiếu/sai field.

## Testing & triển khai

- Không có test framework trong dự án (chủ ý, theo `CLAUDE.md`) — cổng kiểm tra vẫn là `next build`/typecheck.
- Kiểm thử thủ công qua trình duyệt (giả lập điều hướng TV bằng bàn phím/D-pad).
- Cần chạy migration SQL (file `scripts/migrate.sql`) một lần trên Neon để tạo 2 bảng trên.
- Thêm `DATABASE_URL` vào `.env.local` và Vercel Project Settings.

## Các quyết định đã chốt (từ brainstorming)

- Backend: Neon Postgres thuần (không qua Vercel Postgres wrapper), không ORM.
- Khóa định danh: cặp `(nickname, birthdate)` duy nhất — cho phép trùng nickname nếu khác ngày sinh.
- Nhập trên TV: luôn gõ Nickname + ngày sinh bằng remote khi **thêm** hồ sơ vào thiết bị; sau đó thiết bị nhớ hồ sơ đó (danh sách local) đến khi bị xoá khỏi thiết bị.
- Phạm vi đồng bộ: danh sách ngày hoàn thành + thời điểm hoàn thành (`completed_at`).
- Không xử lý offline/xung đột phức tạp — yêu cầu có mạng, last-write-wins.
- Không migrate dữ liệu `localStorage` cũ.
