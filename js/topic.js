import { initSnowfall } from "./snowfall.js";
import { getCompletedDays } from "./progress.js";
import { ICONS } from "./icons.js";
import { enableGridNav, enableBackKey } from "./tv-nav.js";

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

  const completedDays = getCompletedDays(topicId);
  const latestDoneDay = completedDays.size > 0 ? Math.max(...completedDays) : null;
  const nextDay = latestDoneDay !== null ? latestDoneDay + 1 : null;
  let latestDoneItem = null;
  let nextLink = null;

  for (const entry of days) {
    const item = document.createElement("li");
    item.className = "day-list-item";
    const isDone = completedDays.has(entry.day);
    item.classList.toggle("is-done", isDone);
    if (entry.day === latestDoneDay) {
      latestDoneItem = item;
    }

    const link = document.createElement("a");
    link.href = `day.html?topic=${encodeURIComponent(topicId)}&day=${entry.day}`;
    if (entry.day === nextDay) {
      nextLink = link;
    }

    const subtitle = document.createElement("span");
    subtitle.className = "day-list-subtitle";
    subtitle.textContent = `Bài ${entry.day}`;

    const title = document.createElement("span");
    title.className = "day-list-title";
    title.textContent = entry.title || `Bài ${entry.day}`;

    link.append(subtitle, title);

    if (isDone) {
      const badge = document.createElement("span");
      badge.className = "day-list-done-badge";
      badge.innerHTML = ICONS.check;
      badge.setAttribute("aria-label", "Đã hoàn thành");
      link.append(badge);
    }

    item.append(link);
    list.append(item);
  }

  if (latestDoneItem) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    latestDoneItem.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "center",
    });
  }

  const links = Array.from(list.querySelectorAll("a"));
  const initialIndex = nextLink ? links.indexOf(nextLink) : 0;
  enableGridNav(list, "a", { initialIndex });
}

async function init() {
  initSnowfall();

  const topicId = getTopicIdFromQuery();
  enableBackKey(() => {
    window.location.href = "index.html";
  });

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
