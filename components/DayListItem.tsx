import Link from "next/link";
import { Check } from "lucide-react";
import type { DayEntry } from "@/lib/types";

interface DayListItemProps {
  topicId: string;
  entry: DayEntry;
  isDone: boolean;
  itemRef?: (node: HTMLLIElement | null) => void;
}

export function DayListItem({ topicId, entry, isDone, itemRef }: DayListItemProps) {
  return (
    <li ref={itemRef} className="day-list-item relative">
      <Link
        href={`/day/${encodeURIComponent(topicId)}/${entry.day}`}
        className={`flex flex-col gap-1 rounded-row border-2 px-md py-sm text-center text-text no-underline shadow-row transition-[transform,border-color,box-shadow] duration-normal ease-out-expo hover:-translate-y-0.5 hover:scale-[1.03] hover:border-accent hover:shadow-row-hover focus-visible:-translate-y-0.5 focus-visible:scale-[1.03] focus-visible:border-accent focus-visible:shadow-row-hover focus-visible:outline-none active:scale-[0.96] [&.tv-focused]:-translate-y-0.5 [&.tv-focused]:scale-[1.03] [&.tv-focused]:border-accent [&.tv-focused]:shadow-row-hover ${
          isDone ? "border-success bg-success/20" : "border-border bg-surface"
        }`}
      >
        <span className="text-xs text-text-muted">Bài {entry.day}</span>
        <span className="font-heading font-semibold text-accent-strong">
          {entry.title || `Bài ${entry.day}`}
        </span>
        {isDone ? (
          <span
            aria-label="Đã hoàn thành"
            className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-success text-surface"
          >
            <Check className="h-3.5 w-3.5" />
          </span>
        ) : null}
      </Link>
    </li>
  );
}
