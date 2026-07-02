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

  for (const topic of topics) {
    const card = document.createElement("a");
    card.className = "topic-card";
    card.href = `topic.html?topic=${encodeURIComponent(topic.id)}`;

    const title = document.createElement("h2");
    title.textContent = topic.title;

    const meta = document.createElement("p");
    meta.textContent = `${topic.totalDays} ngày`;

    card.append(title, meta);
    grid.append(card);
  }
}

loadTopics()
  .then(renderTopics)
  .catch((error) => {
    const grid = document.getElementById("topic-grid");
    grid.textContent = "Không tải được danh sách chủ đề.";
    console.error(error);
  });
