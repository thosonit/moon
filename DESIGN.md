# Design Spec — Lớp học của Moon 🌸

Thiết kế giao diện dành cho bé gái 5 tuổi, tông hồng nhẹ nhàng (pastel pink), nhiều hiệu ứng hoạt hình con vật đáng yêu để bé thích thú khi học.

## 1. Định hướng phong cách

- **Phong cách:** Bé gái, dễ thương, mềm mại (kawaii / soft pastel), không dùng flat template nhàm chán.
- **Cảm xúc mục tiêu:** Vui vẻ, an toàn, tò mò muốn bấm vào xem tiếp.
- **Nguyên tắc:** To, tròn, nhiều khoảng thở, chuyển động nhẹ nhàng liên tục (không giật, không chớp gắt vì là trẻ nhỏ).

## 2. Bảng màu (tông hồng nhạt chủ đạo)

Dùng `oklch()` để dễ chỉnh độ sáng/độ bão hòa nhất quán, giữ tinh thần token hiện có trong `css/style.css`.

```css
:root {
  /* Nền & bề mặt */
  --color-bg: oklch(97% 0.02 20);          /* hồng phấn rất nhạt */
  --color-surface: oklch(99% 0.01 20);     /* thẻ/card trắng hồng */
  --color-surface-alt: oklch(94% 0.04 15); /* nền phụ, hồng đậm hơn chút */

  /* Chữ */
  --color-text: oklch(35% 0.03 20);        /* nâu hồng đậm, dễ đọc */
  --color-text-muted: oklch(55% 0.03 20);

  /* Accent — hồng chủ đạo + phụ trợ pastel */
  --color-accent: oklch(75% 0.14 10);      /* hồng bubblegum */
  --color-accent-strong: oklch(62% 0.18 8);/* hồng đậm cho hover/active */
  --color-secondary: oklch(85% 0.08 340);  /* tím hoa cà nhạt */
  --color-tertiary: oklch(90% 0.09 90);    /* vàng bơ nhạt (điểm nhấn nắng) */
  --color-success: oklch(85% 0.12 150);    /* xanh bạc hà nhạt (khen ngợi) */

  --color-border: oklch(90% 0.03 20);
}
```

Quy tắc dùng màu:
- Nền tổng thể: gradient rất nhẹ giữa `--color-bg` và `--color-surface-alt` (không phẳng một màu).
- Accent hồng dùng cho: tiêu đề, nút chính, viền active, icon nổi bật.
- Tím và vàng chỉ dùng làm điểm nhấn (huy hiệu, sao thưởng, con vật), không lấn át hồng.
- Tránh màu xám xịt/đen thui — kể cả text cũng dùng nâu-hồng đậm thay vì đen thuần.

## 3. Typography

- Không dùng Georgia/serif nghiêm túc — dùng font tròn, thân thiện.
- Đề xuất: **Baloo 2** hoặc **Quicksand** (Google Fonts, hỗ trợ tiếng Việt) cho tiêu đề; giữ system sans-serif cho phần chữ nhỏ để dễ đọc.

```css
--font-heading: "Baloo 2", "Quicksand", -apple-system, sans-serif;
--font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

--text-hero: clamp(2.25rem, 1.6rem + 3vw, 4rem);     /* tiêu đề trang chủ */
--text-heading: clamp(1.75rem, 1.4rem + 2vw, 2.75rem);
--text-body: clamp(1.1rem, 1rem + 0.4vw, 1.35rem);   /* chữ to hơn bình thường cho bé dễ đọc */
```

- Tiêu đề luôn có emoji đi kèm (🌙🌸🐰) để tạo cảm giác thân thiện.
- Line-height rộng (1.6+) cho phần thân, chữ tối thiểu ~18px để bé dễ nhìn.

## 4. Hình khối & bề mặt

- Bo góc lớn: `border-radius: 1.5rem–2rem` cho card, `999px` (pill) cho nút.
- Card nổi nhẹ bằng shadow mềm hồng thay vì xám:
  ```css
  box-shadow: 0 8px 24px oklch(75% 0.14 10 / 0.25);
  ```
- Viền: dùng viền đứt/lượn sóng (dashed hoặc scalloped border qua `mask`/SVG) cho card chủ đề để tạo cảm giác "sổ tay dán sticker".
- Họa tiết nền: chấm bi nhạt, hình sao/trái tim nhỏ rải rác (dùng CSS `background-image` lặp lại, opacity thấp ~0.08) — texture nhẹ, không rối mắt.

## 5. Con vật & hiệu ứng animation

Ý tưởng: mỗi topic/chủ đề có 1 "linh vật" con vật (thỏ, mèo, gấu, cún, chim cánh cụt...) xuất hiện làm bạn đồng hành, hoạt hình hoá bằng CSS/SVG, không cần video nặng.

### 5.1 Vị trí xuất hiện
- **Trang chủ:** một con vật lớn (ví dụ thỏ 🐰) đứng góc dưới bên phải header, vẫy tay chào, nhấp nháy mắt định kỳ.
- **Thẻ chủ đề (topic card):** icon con vật nhỏ ở góc thẻ, "nhún nhảy" nhẹ khi hover.
- **Danh sách bài học:** mỗi dòng có icon con vật/emoji xoay nhẹ khi hover hoặc khi bài đã hoàn thành hiện dấu ⭐.
- **Màn hình xem ảnh (viewer):** khi chuyển sang ảnh mới, một chú bướm/ong bay ngang qua màn hình 1 lần rồi biến mất — hiệu ứng "chào mừng" chứ không gây xao nhãng lâu dài.

### 5.2 Kiểu chuyển động (compositor-friendly, chỉ animate `transform`/`opacity`)

```css
/* Nhún nhảy nhẹ (bounce) cho icon con vật trên card */
@keyframes gentle-bounce {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-6px) rotate(-3deg); }
}
.mascot-icon {
  animation: gentle-bounce 2.4s var(--ease-out-expo) infinite;
}

/* Vẫy tay chào ở trang chủ */
@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  20% { transform: rotate(-12deg); }
  40% { transform: rotate(8deg); }
  60% { transform: rotate(-6deg); }
}
.mascot-hero .paw {
  transform-origin: bottom center;
  animation: wave 1.6s ease-in-out infinite;
  animation-delay: 3s; /* lặp lại sau vài giây, không liên tục gây rối */
}

/* Lấp lánh sao/tim rải rác nền */
@keyframes twinkle {
  0%, 100% { opacity: 0.15; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}
.bg-sparkle {
  animation: twinkle 3s ease-in-out infinite;
}

/* Bay ngang qua khi chuyển ảnh trong viewer */
@keyframes fly-across {
  from { transform: translateX(-10vw) translateY(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  to { transform: translateX(110vw) translateY(-20px); opacity: 0; }
}
.mascot-flyby {
  animation: fly-across 3.5s var(--ease-out-expo) 1;
}
```

- Thời lượng animation: 1.5–3.5s, dùng `ease-out`/`ease-in-out`, không lặp giật (không dùng `linear` cho chuyển động hữu cơ).
- Luôn tôn trọng `prefers-reduced-motion`: tắt hết animation lặp vô hạn, chỉ giữ hiệu ứng chuyển tab/trang.

```css
@media (prefers-reduced-motion: reduce) {
  .mascot-icon, .mascot-hero .paw, .bg-sparkle, .mascot-flyby {
    animation: none;
  }
}
```

### 5.3 Nguồn hình con vật
- Ưu tiên SVG đơn giản (flat, viền tròn, 2–3 màu) tự vẽ hoặc từ thư viện icon mở (ví dụ set "cute animal" trên unDraw/Blush với tông hồng), để nhẹ và dễ animate từng phần (tai, đuôi, mắt) bằng CSS.
- Không dùng ảnh chụp thật — giữ phong cách minh họa phẳng, mềm mại, đúng gu thiếu nhi.

## 6. Nút bấm & trạng thái tương tác

- Nút chính (pill, nền `--color-accent`, chữ trắng), khi hover: phồng nhẹ `transform: scale(1.05)` + shadow hồng đậm hơn.
- Nút phụ (icon-only, như back/fullscreen/zoom trong viewer): giữ nguyên hành vi "mờ → rõ khi hover" hiện tại, nhưng đổi nền sang trắng-hồng, viền hồng nhạt, icon màu hồng đậm thay vì trung tính.
- Khi bấm (`:active`): thu nhỏ nhẹ `scale(0.95)` để tạo phản hồi xúc giác rõ ràng cho trẻ nhỏ.
- Trạng thái hoàn thành bài học: viền thẻ chuyển sang xanh mint nhạt + icon ⭐ nảy lên 1 lần (hiệu ứng "thưởng sao").

## 7. Bố cục theo trang

- **`index.html` (trang chủ):** Hero lớn với tên bé + linh vật vẫy chào, bên dưới là lưới thẻ chủ đề dạng bento (thẻ to nhỏ xen kẽ, không đều tăm tắp), mỗi thẻ có icon con vật riêng.
- **`topic.html` (danh sách bài):** Danh sách dạng "cuốn sổ tay" — mỗi bài là 1 hàng bo tròn, số thứ tự trong vòng tròn màu hồng, tiêu đề bài học in đậm, có thể thêm dải ruy băng nhỏ ("Bài đang học") nhấp nháy nhẹ ở bài tiếp theo cần học.
- **`day.html` (xem ảnh):** Giữ nguyên bố cục ảnh full-screen + nút icon nổi hiện tại, chỉ đổi tông màu nút sang hồng pastel và thêm hiệu ứng bay qua của linh vật khi vừa mở trang.

## 8. Breakpoint & responsive

Theo chuẩn hiện có của dự án: kiểm tra tại 320, 768, 1024, 1440px. Trên màn hình nhỏ (điện thoại bé dùng), linh vật hero thu nhỏ và chuyển xuống dưới tiêu đề thay vì đè lên chữ.

## 9. Việc cần làm khi hiện thực hoá

1. Thêm Google Font (Baloo 2/Quicksand) qua `<link>` hoặc self-host, `font-display: swap`.
2. Cập nhật token màu trong `:root` của `css/style.css` sang bảng màu hồng ở mục 2.
3. Tạo 2–3 SVG linh vật (thỏ, mèo, gấu) làm component tái sử dụng cho hero + card.
4. Thêm các `@keyframes` ở mục 5.2 vào `css/style.css`, áp `prefers-reduced-motion` guard.
5. Áp style nút mới cho `.viewer-icon-button`, `.topic-card`, `.day-list-item` theo mục 6–7.
