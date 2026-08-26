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

function renderTopics(topics) {
  const grid = document.getElementById("topic-grid");
  grid.innerHTML = "";

  topics.forEach((topic, index) => {
    const card = document.createElement("a");
    card.className = "topic-card";
    card.href = `topic.html?topic=${encodeURIComponent(topic.id)}`;

    const mascot = document.createElement("span");
    mascot.className = "topic-mascot";
    mascot.setAttribute("aria-hidden", "true");
    mascot.textContent = TOPIC_MASCOTS[index % TOPIC_MASCOTS.length];

    const count = document.createElement("span");
    count.className = "topic-card-count";
    count.textContent = `${topic.totalDays} bài`;

    const title = document.createElement("h2");
    title.textContent = topic.title;

    const completed = getCompletedDays(topic.id).size;
    const meta = document.createElement("p");
    meta.textContent = `Hoàn thành: ${completed}/${topic.totalDays}`;

    card.append(count, mascot, title, meta);
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
