"use client";

import { useEffect, useRef } from "react";

const SNOWFLAKE_COUNT = 22;
const SNOWFLAKE_CHARS = ["❄", "❅", "❆"];

export function Snowfall() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    for (let i = 0; i < SNOWFLAKE_COUNT; i += 1) {
      const flake = document.createElement("span");
      flake.className = "snowflake text-secondary";
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
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    />
  );
}
