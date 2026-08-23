"use client";

import { useRef } from "react";
import { useGridNav } from "@/hooks/useGridNav";
import type { Topic } from "@/lib/types";
import { TopicCard } from "./TopicCard";

const TOPIC_MASCOTS = ["🐰", "🐻", "🐱", "🐧", "🦊", "🐼"];

interface TopicGridProps {
  topics: Topic[];
}

export function TopicGrid({ topics }: TopicGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  useGridNav(gridRef, ".topic-card");

  return (
    <div ref={gridRef} className="grid gap-md [grid-template-columns:repeat(auto-fill,minmax(16rem,1fr))]">
      {topics.map((topic, index) => (
        <TopicCard key={topic.id} topic={topic} mascot={TOPIC_MASCOTS[index % TOPIC_MASCOTS.length]} />
      ))}
    </div>
  );
}
