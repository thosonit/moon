import Link from "next/link";
import type { Topic } from "@/lib/types";

interface TopicCardProps {
  topic: Topic;
  mascot: string;
}

export function TopicCard({ topic, mascot }: TopicCardProps) {
  return (
    <Link
      href={`/topic/${encodeURIComponent(topic.id)}`}
      className="topic-card relative block rounded-card border-2 border-border bg-surface p-md text-text no-underline shadow-card transition-[transform,border-color,box-shadow] duration-normal ease-out-expo hover:-translate-y-1.5 hover:scale-[1.02] hover:border-accent hover:shadow-card-hover focus-visible:-translate-y-1.5 focus-visible:scale-[1.02] focus-visible:border-accent focus-visible:shadow-card-hover focus-visible:outline-none active:scale-[0.97] [&.tv-focused]:-translate-y-1.5 [&.tv-focused]:scale-[1.02] [&.tv-focused]:border-accent [&.tv-focused]:shadow-card-hover"
    >
      <span aria-hidden="true" className="topic-mascot mb-2 inline-block text-3xl">
        {mascot}
      </span>
      <h2 className="m-0 mb-2 font-heading text-subheading text-accent-strong">{topic.title}</h2>
      <p className="m-0 text-text-muted">{topic.totalDays} ngày</p>
    </Link>
  );
}
