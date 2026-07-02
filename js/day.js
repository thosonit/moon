import { toDirectImageUrl } from "./drive-url.js";

function getParams() {
  const params = new URLSearchParams(window.location.search);
  const topicId = params.get("topic");
  const day = Number.parseInt(params.get("day"), 10);
  return { topicId, day };
}

async function loadTopicMeta(topicId) {
  const response = await fetch("data/topics.json");
  if (!response.ok) {
    throw new Error(`Failed to load topics.json: ${response.status}`);
  }
  const topics = await response.json();
  return topics.find((topic) => topic.id === topicId) || null;
}

async function loadDays(topicId) {
  const response = await fetch(`data/${topicId}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load data/${topicId}.json: ${response.status}`);
  }
  return response.json();
}

function renderNotFound(root) {
  root.innerHTML = `<p class="not-found">Không tìm thấy nội dung. <a href="index.html">Về trang chủ</a></p>`;
}

function renderViewer(root, { topicId, topicMeta, days, day }) {
  const entry = days.find((d) => d.day === day);
  const imageUrl = entry ? toDirectImageUrl(entry.driveUrl) : null;

  const isFirst = day <= 1;
  const isLast = day >= topicMeta.totalDays;

  root.innerHTML = "";

  const viewer = document.createElement("div");
  viewer.className = "viewer";

  const imageWrap = document.createElement("div");
  imageWrap.className = "viewer-image-wrap";

  if (imageUrl) {
    const img = document.createElement("img");
    img.className = "viewer-image";
    img.src = imageUrl;
    img.alt = `${topicMeta.title} - Ngày ${day}`;
    imageWrap.append(img);
  } else {
    const placeholder = document.createElement("p");
    placeholder.className = "placeholder";
    placeholder.textContent = "Chưa có ảnh";
    imageWrap.append(placeholder);
  }

  const controls = document.createElement("div");
  controls.className = "viewer-controls";

  const backLink = document.createElement("a");
  backLink.href = `topic.html?topic=${encodeURIComponent(topicId)}`;
  backLink.textContent = "← Danh sách";

  const prevButton = document.createElement("button");
  prevButton.textContent = "‹ Trước";
  prevButton.disabled = isFirst;
  prevButton.addEventListener("click", () => {
    window.location.href = `day.html?topic=${encodeURIComponent(topicId)}&day=${day - 1}`;
  });

  const label = document.createElement("span");
  label.textContent = `Ngày ${day} / ${topicMeta.totalDays}`;

  const nextButton = document.createElement("button");
  nextButton.textContent = "Sau ›";
  nextButton.disabled = isLast;
  nextButton.addEventListener("click", () => {
    window.location.href = `day.html?topic=${encodeURIComponent(topicId)}&day=${day + 1}`;
  });

  controls.append(backLink, prevButton, label, nextButton);
  viewer.append(imageWrap, controls);
  root.append(viewer);
}

async function init() {
  const root = document.getElementById("viewer-root");
  const { topicId, day } = getParams();

  if (!topicId || Number.isNaN(day)) {
    renderNotFound(root);
    return;
  }

  const topicMeta = await loadTopicMeta(topicId);
  if (!topicMeta || day < 1 || day > topicMeta.totalDays) {
    renderNotFound(root);
    return;
  }

  const days = await loadDays(topicId);
  renderViewer(root, { topicId, topicMeta, days, day });
}

init().catch((error) => {
  console.error(error);
  renderNotFound(document.getElementById("viewer-root"));
});
