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
  const imageUrl = entry ? entry.imagePath || toDirectImageUrl(entry.driveUrl) : null;

  root.innerHTML = "";

  const viewer = document.createElement("div");
  viewer.className = "viewer";

  const backLink = document.createElement("a");
  backLink.className = "viewer-icon-button viewer-back";
  backLink.href = `topic.html?topic=${encodeURIComponent(topicId)}`;
  backLink.textContent = "←";
  backLink.setAttribute("aria-label", "Danh sách");
  backLink.title = "Danh sách";

  const dateLabel = document.createElement("span");
  dateLabel.className = "viewer-date";
  dateLabel.textContent = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

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

  const info = document.createElement("div");
  info.className = "viewer-info";

  const infoDay = document.createElement("span");
  infoDay.className = "viewer-info-day";
  infoDay.textContent = `${day}`;

  info.append(infoDay);

  const fullscreenButton = document.createElement("button");
  fullscreenButton.type = "button";
  fullscreenButton.className = "viewer-icon-button viewer-fullscreen";
  fullscreenButton.textContent = "⛶";
  fullscreenButton.setAttribute("aria-label", "Toàn màn hình");
  fullscreenButton.title = "Toàn màn hình";
  fullscreenButton.addEventListener("click", () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      viewer.requestFullscreen();
    }
  });

  viewer.append(backLink, dateLabel, info, imageWrap, fullscreenButton);
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
