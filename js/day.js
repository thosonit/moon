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

  const imageWrap = document.createElement("div");
  imageWrap.className = "viewer-image-wrap";

  const ZOOM_STEP = 0.05;
  const ZOOM_MIN = 1;
  const ZOOM_MAX = 4;
  let zoomLevel = ZOOM_MIN;
  let img = null;
  let zoomLabel = null;

  function applyZoom() {
    if (!img) return;
    img.style.transform = `scale(${zoomLevel})`;
    imageWrap.classList.toggle("is-zoomed", zoomLevel > ZOOM_MIN);
    if (zoomLabel) {
      zoomLabel.textContent = `${Math.round(zoomLevel * 100)}%`;
    }
  }

  if (imageUrl) {
    img = document.createElement("img");
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

  const zoomControls = document.createElement("div");
  zoomControls.className = "viewer-zoom-controls";

  const zoomOutButton = document.createElement("button");
  zoomOutButton.type = "button";
  zoomOutButton.className = "viewer-icon-button viewer-zoom-out";
  zoomOutButton.textContent = "−";
  zoomOutButton.setAttribute("aria-label", "Thu nhỏ");
  zoomOutButton.title = "Thu nhỏ";
  zoomOutButton.addEventListener("click", () => {
    zoomLevel = Math.max(ZOOM_MIN, zoomLevel - ZOOM_STEP);
    applyZoom();
  });

  const zoomInButton = document.createElement("button");
  zoomInButton.type = "button";
  zoomInButton.className = "viewer-icon-button viewer-zoom-in";
  zoomInButton.textContent = "+";
  zoomInButton.setAttribute("aria-label", "Phóng to");
  zoomInButton.title = "Phóng to";
  zoomInButton.addEventListener("click", () => {
    zoomLevel = Math.min(ZOOM_MAX, zoomLevel + ZOOM_STEP);
    applyZoom();
  });

  zoomLabel = document.createElement("span");
  zoomLabel.className = "viewer-zoom-label";
  zoomLabel.textContent = `${Math.round(zoomLevel * 100)}%`;

  zoomControls.append(zoomOutButton, zoomLabel, zoomInButton);

  viewer.append(backLink, imageWrap, fullscreenButton, zoomControls);
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
