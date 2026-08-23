# Migrate Moon sang Next.js — Design Spec

**Ngày:** 2026-08-23
**Trạng thái:** Approved (chờ viết implementation plan)

## 1. Bối cảnh & mục tiêu

Project "Moon - Quỳnh Như" hiện là site tĩnh HTML/CSS/JS thuần (không build, không framework), gồm 3 màn hình:

- Trang chủ (`index.html`) — lưới chủ đề học.
- Danh sách bài học (`topic.html?topic=<id>`) — danh sách ngày trong một chủ đề, có trạng thái hoàn thành.
- Viewer bài học (`day.html?topic=<id>&day=<n>`) — xem ảnh toàn màn hình, fullscreen toggle, đánh dấu hoàn thành, điều hướng bàn phím/remote TV.

**Lý do migrate:** dễ mở rộng chức năng về sau, muốn dùng React/component ecosystem, và mở đường cho SSR/API routes/database trong tương lai (không bắt buộc phải có ngay).

**Ngoài phạm vi lần này:**
- Không migrate data sang database — vẫn dùng JSON tĩnh, chỉ bọc qua API routes để dễ đổi implementation sau.
- Không thiết lập test tự động (Vitest/Playwright) — quyết định có chủ ý của người dùng, lệch khỏi rule mặc định về coverage/test. Có thể làm ở task riêng sau này.
- Không thêm auth, không thêm tính năng mới (multi-user, v.v.).

## 2. Quyết định kiến trúc

| Hạng mục | Quyết định |
|---|---|
| Framework | Next.js, App Router (không dùng Pages Router) |
| Ngôn ngữ | TypeScript |
| Styling | Tailwind CSS (thay CSS thuần), token lấy từ `docs/design/DESIGN.md` |
| Data | JSON tĩnh trong `data/`, đọc server-side qua `lib/data.ts`; có API routes wrap sẵn |
| Progress | Vẫn `localStorage`, logic giữ nguyên, chuyển thành hook `useProgress` |
| Icon | `lucide-react` (thay SVG thủ công trong `js/icons.js`) |
| Package manager | npm |
| Deploy | Vercel, Next.js runtime mặc định (bỏ `outputDirectory` static export) |
| Test | Không setup trong lần migrate này |

Đã xem xét và loại các phương án khác:
- **Pages Router** — không có lợi ích gì hơn App Router cho một project viết lại từ đầu.
- **Monorepo (apps/web + packages/data)** — overkill cho quy mô 3 trang, 1 người dùng; vi phạm YAGNI.

## 3. Cấu trúc thư mục mới

```text
moon/
├── app/
│   ├── layout.tsx                     # <html lang="vi">, next/font (Baloo 2, Quicksand), header chung
│   ├── page.tsx                       # Trang chủ (Server Component)
│   ├── topic/[topicId]/page.tsx       # Danh sách bài học
│   ├── day/[topicId]/[day]/page.tsx   # Viewer toàn màn hình
│   ├── globals.css                    # Tailwind base + keyframes không map trực tiếp (snowfall, tv-focus ring)
│   └── api/
│       ├── topics/route.ts
│       └── topics/[topicId]/days/route.ts
├── components/
│   ├── TopicGrid.tsx
│   ├── TopicCard.tsx
│   ├── DayList.tsx
│   ├── DayListItem.tsx
│   ├── DayViewer.tsx                  # client component
│   └── Snowfall.tsx                   # client component
├── hooks/
│   ├── useProgress.ts                 # thay progress.js
│   ├── useGridNav.ts                  # thay tv-nav.js enableGridNav
│   └── useBackKey.ts                  # thay tv-nav.js enableBackKey
├── lib/
│   ├── data.ts                        # getTopics(), getTopicMeta(id), getDays(topicId) — fs, server-only
│   └── drive-url.ts                   # toDirectImageUrl(driveUrl)
├── data/                               # giữ nguyên JSON + ảnh, không đổi format
│   ├── topics.json
│   ├── mindmap-heineman-gk7.json
│   ├── 365-daily-english-presentations.json
│   └── images/
├── public/
│   └── favicon.svg, favicon-32.png, favicon-180.png
├── vercel.json                         # bỏ outputDirectory + custom no-cache headers
├── next.config.ts                      # images.remotePatterns cho lh3.googleusercontent.com
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

`src/moon/*.html`, `src/moon/js/*.js`, `src/moon/css/style.css` bị xoá sau khi migrate xong; app chuyển lên gốc repo.

## 4. Routing

| Cũ (query params) | Mới (path params) |
|---|---|
| `index.html` | `/` |
| `topic.html?topic=X` | `/topic/X` |
| `day.html?topic=X&day=N` | `/day/X/N` |

Validate `day` (số nguyên, trong khoảng `[1, totalDays]`) và `topicId` (tồn tại trong `topics.json`) ngay trong Server Component của trang; không hợp lệ → `notFound()` (thay cho `renderNotFound` cũ).

## 5. Data & API layer

- `lib/data.ts`:
  - `getTopics(): Promise<Topic[]>` — đọc `data/topics.json`.
  - `getTopicMeta(topicId: string): Promise<Topic | null>`.
  - `getDays(topicId: string): Promise<DayEntry[]>` — đọc `data/<topicId>.json`.
- `app/api/topics/route.ts` và `app/api/topics/[topicId]/days/route.ts` gọi lại các hàm trên, trả JSON — giữ cho khả năng client-side fetch động hoặc khi có DB thì chỉ đổi implementation trong `lib/data.ts`.
- Trang chủ, trang topic-list, trang viewer dùng Server Component gọi trực tiếp `lib/data.ts` (không round-trip qua API cho initial render).

**Types** (`lib/data.ts` hoặc `types.ts`):
```typescript
interface Topic {
  id: string
  title: string
  totalDays: number
}

interface DayEntry {
  day: number
  title?: string
  imagePath?: string
  driveUrl?: string
}
```

## 6. Component behavior (giữ đúng hành vi hiện tại)

**TopicGrid / TopicCard**
- Render mascot emoji xoay vòng theo mảng cố định (`["🐰","🐻","🐱","🐧","🦊","🐼"]`), tiêu đề, số ngày (`{totalDays} ngày`), link tới `/topic/[id]`.
- Điều hướng lưới bằng `useGridNav` (roving tabindex, class `.tv-focused`).

**DayList / DayListItem**
- Tính `completedDays` từ `useProgress(topicId)`.
- `latestDoneDay = max(completedDays)`, `nextDay = latestDoneDay + 1`.
- Badge check khi `isDone`.
- Scroll-into-view bài vừa hoàn thành gần nhất, tôn trọng `prefers-reduced-motion`.
- Focus ban đầu của grid-nav đặt vào `nextDay` nếu có, ngược lại phần tử đầu.

**DayViewer** (client component)
- Load ảnh từ `entry.imagePath` hoặc `toDirectImageUrl(entry.driveUrl)`; không có → placeholder "Chưa có ảnh".
- Nút back (`ArrowLeft` icon) → `/topic/[topicId]`.
- Nút fullscreen: `requestFullscreen()`/`exitFullscreen()`, icon đổi theo `fullscreenchange` event (`Maximize`/`Minimize`).
- Nút done-toggle: gọi `toggleDayDone` từ `useProgress`, icon `Circle`/`CheckCircle2`.
- Điều hướng bàn phím: `ArrowLeft/ArrowRight` đổi ngày (trong giới hạn `[1, totalDays]`), `ArrowUp/ArrowDown` đổi focus giữa 3 control (back, done, fullscreen), back-key (Escape/Backspace/remote TV back code 10009, 461) → về `/topic/[topicId]`.

**Snowfall** (client component)
- Giữ nguyên logic: 22 snowflake, ký tự `["❄","❅","❆"]`, random left/duration/delay/size/drift qua CSS variables.

## 7. Hooks (thay `tv-nav.js`, `progress.js`)

- `useProgress(topicId)` — expose `completedDays: Set<number>`, `isDayDone(day)`, `toggleDayDone(day)`; đọc/viết `localStorage` key `moon:progress:<topicId>`, try/catch giữ nguyên (không throw khi localStorage unavailable).
- `useGridNav(containerRef, itemSelector, { initialIndex })` — port `enableGridNav` (group rows theo `offsetTop`, tolerance 4px; roving tabindex).
- `useBackKey(onBack)` — port `enableBackKey` (lắng nghe `keydown` cho `Escape`/`Backspace`/`GoBack`/`BrowserBack` và keyCode TV 10009/461).

## 8. Styling

- Chuyển design tokens từ `docs/design/DESIGN.md` (màu, spacing, typography, radius) vào `tailwind.config.ts` → `theme.extend`.
- Font: `next/font/google` cho Baloo 2 (500/700) và Quicksand (500/700), thay `<link>` thủ công trong `<head>` — tự động `font-display: swap`, preconnect không cần khai báo tay.
- Style component chuyển từ `css/style.css` (437 dòng) sang className Tailwind trực tiếp trong từng component.
- Animation không map trực tiếp qua utility (keyframes snowfall rơi/trôi, ring focus TV `.tv-focused`) giữ trong `app/globals.css` dưới `@layer utilities` / `@keyframes`, theo đúng rule animation-only-properties (transform/opacity, tránh width/height/top/left).

## 9. Ảnh

- Ảnh local trong `data/images/*.webp` → `next/image` với `width`/`height` cố định theo layout viewer.
- Ảnh Google Drive (qua `toDirectImageUrl` → `lh3.googleusercontent.com`) → khai báo `images.remotePatterns` trong `next.config.ts`, vẫn dùng `next/image`.
- Giữ nguyên comment giải thích lý do dùng host `lh3` thay `drive.google.com/uc` (uc endpoint trả 503 khi hotlink từ `<img>`).

## 10. Config thay đổi

- `vercel.json`: bỏ `outputDirectory: "src/moon"` (Next.js tự build/deploy), bỏ các header `Cache-Control: no-cache` thủ công cho `.html`/`js`/`css` (Next quản lý caching asset theo build hash).
- `package.json` mới: `next`, `react`, `react-dom`, `typescript`, `tailwindcss`, `lucide-react`.
- `CLAUDE.md` cần cập nhật sau khi migrate xong: bỏ phần "static, no-build website", cập nhật cấu trúc `app/`, `components/`, `hooks/`, `lib/`, lệnh chạy local đổi thành `npm run dev`.

## 11. Rủi ro & lưu ý

- **Fullscreen API + TV remote**: cần kiểm tra thủ công trên môi trường thực tế (Smart TV/Tizen/webOS) sau migrate vì không có test tự động cho phần này — không có E2E để bắt regression.
- **SEO/`favicon`**: giữ nguyên 3 file favicon, chuyển vào `public/`, khai báo qua `app/layout.tsx` (`metadata.icons`) thay `<link>` thủ công.
- **Không có test**: theo quyết định người dùng, migration không có safety net tự động — cần test tay kỹ theo 3 flow chính (chọn chủ đề → danh sách bài → viewer) ở các breakpoint 320/768/1024/1440 trước khi coi migration hoàn tất.
