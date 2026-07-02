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

    const title = document.createElement("h2");
    title.textContent = topic.title;

    const meta = document.createElement("p");
    meta.textContent = `${topic.totalDays} ngày`;

    card.append(mascot, title, meta);
    grid.append(card);
  });
}

loadTopics()
  .then(renderTopics)
  .catch((error) => {
    const grid = document.getElementById("topic-grid");
    grid.textContent = "Không tải được danh sách chủ đề.";
    console.error(error);
  });
