function getTopicIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("topic");
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

function renderNotFound() {
  document.getElementById("topic-title").textContent = "Không tìm thấy chủ đề";
  const list = document.getElementById("day-list");
  list.outerHTML = `<p class="not-found">Chủ đề này không tồn tại. <a href="index.html">Về trang chủ</a></p>`;
}

function renderDays(topicId, topicMeta, days) {
  document.getElementById("topic-title").textContent = topicMeta.title;

  const list = document.getElementById("day-list");
  list.innerHTML = "";

  for (const entry of days) {
    const item = document.createElement("li");
    item.className = "day-list-item";

    const link = document.createElement("a");
    link.href = `day.html?topic=${encodeURIComponent(topicId)}&day=${entry.day}`;
    link.textContent = entry.title ? `Ngày ${entry.day}: ${entry.title}` : `Ngày ${entry.day}`;

    item.append(link);
    list.append(item);
  }
}

async function init() {
  const topicId = getTopicIdFromQuery();
  if (!topicId) {
    renderNotFound();
    return;
  }

  const topicMeta = await loadTopicMeta(topicId);
  if (!topicMeta) {
    renderNotFound();
    return;
  }

  const days = await loadDays(topicId);
  renderDays(topicId, topicMeta, days);
}

init().catch((error) => {
  console.error(error);
  renderNotFound();
});
