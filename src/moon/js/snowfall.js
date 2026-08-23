const SNOWFLAKE_COUNT = 22;
const SNOWFLAKE_CHARS = ["❄", "❅", "❆"];

export function initSnowfall() {
  const container = document.createElement("div");
  container.className = "snowfall";
  container.setAttribute("aria-hidden", "true");

  for (let i = 0; i < SNOWFLAKE_COUNT; i += 1) {
    const flake = document.createElement("span");
    flake.className = "snowflake";
    flake.textContent = SNOWFLAKE_CHARS[i % SNOWFLAKE_CHARS.length];

    const left = Math.random() * 100;
    const duration = 8 + Math.random() * 10;
    const delay = Math.random() * -18;
    const size = 0.75 + Math.random() * 1.1;
    const drift = 40 + Math.random() * 80;

    flake.style.left = `${left}vw`;
    flake.style.setProperty("--fall-duration", `${duration}s`);
    flake.style.setProperty("--fall-delay", `${delay}s`);
    flake.style.setProperty("--flake-size", `${size}rem`);
    flake.style.setProperty("--drift", `${drift}px`);

    container.append(flake);
  }

  document.body.append(container);
}
