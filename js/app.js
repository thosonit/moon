import { initSnowfall } from "./snowfall.js";
import { enableGridNav } from "./tv-nav.js";
import { getCompletedDays } from "./progress.js";

const TOPIC_MASCOTS = ["🐰", "🐻", "🐱", "🐧", "🦊", "🐼"];

async function loadTopics() {
  const response = await fetch("data/topics.json");
  if (!response.ok) {
    throw new Error(`Failed to load topics.json: ${response.status}`);
  }
  return response.json();
}

function buildProgressBar(completed, total) {
  const wrap = document.createElement("div");
  wrap.className = "topic-card-progress";

  const track = document.createElement("div");
  track.className = "topic-card-progress-track";
  const fill = document.createElement("div");
  fill.className = "topic-card-progress-fill";
  fill.style.width = `${total > 0 ? (completed / total) * 100 : 0}%`;
  track.append(fill);

  const label = document.createElement("span");
  label.className = "topic-card-progress-label";
  label.textContent = `${completed}/${total} bài`;

  wrap.append(track, label);
  return wrap;
}

function renderTopics(topics) {
  const grid = document.getElementById("topic-grid");
  grid.innerHTML = "";

  topics.forEach((topic, index) => {
    const completed = getCompletedDays(topic.id).size;

    const card = document.createElement("a");
    card.className = "topic-card";
    card.href = `topic.html?topic=${encodeURIComponent(topic.id)}`;

    const count = document.createElement("span");
    count.className = "topic-card-count";
    count.textContent = `${topic.totalDays} bài`;

    const mascotBadge = document.createElement("span");
    mascotBadge.className = "topic-card-mascot-badge";
    const mascot = document.createElement("span");
    mascot.className = "topic-mascot";
    mascot.setAttribute("aria-hidden", "true");
    mascot.textContent = TOPIC_MASCOTS[index % TOPIC_MASCOTS.length];
    mascotBadge.append(mascot);

    const title = document.createElement("h2");
    title.textContent = topic.title;

    card.append(count, mascotBadge, title, buildProgressBar(completed, topic.totalDays));
    grid.append(card);
  });

  enableGridNav(grid, ".topic-card");
}

initSnowfall();

loadTopics()
  .then(renderTopics)
  .catch((error) => {
    const grid = document.getElementById("topic-grid");
    grid.textContent = "Không tải được danh sách chủ đề.";
    console.error(error);
  });
