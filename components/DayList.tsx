"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGridNav } from "@/hooks/useGridNav";
import { useProgress } from "@/hooks/useProgress";
import type { DayEntry } from "@/lib/types";
import { DayListItem } from "./DayListItem";

interface DayListProps {
  topicId: string;
  days: DayEntry[];
}

export function DayList({ topicId, days }: DayListProps) {
  const { completedDays } = useProgress(topicId);
  const listRef = useRef<HTMLUListElement>(null);
  const latestDoneRef = useRef<HTMLLIElement | null>(null);

  const latestDoneDay = completedDays.size > 0 ? Math.max(...completedDays) : null;
  const nextDay = latestDoneDay !== null ? latestDoneDay + 1 : null;
  const nextIndex = useMemo(
    () => (nextDay !== null ? days.findIndex((entry) => entry.day === nextDay) : -1),
    [days, nextDay],
  );

  useGridNav(listRef, "a", { initialIndex: nextIndex >= 0 ? nextIndex : 0 });

  useEffect(() => {
    if (!latestDoneRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    latestDoneRef.current.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "center",
    });
  }, []);

  return (
    <ul
      ref={listRef}
      className="day-list m-0 grid list-none gap-sm p-0 [grid-template-columns:repeat(auto-fill,minmax(10rem,1fr))]"
    >
      {days.map((entry) => {
        const isDone = completedDays.has(entry.day);
        return (
          <DayListItem
            key={entry.day}
            topicId={topicId}
            entry={entry}
            isDone={isDone}
            itemRef={
              entry.day === latestDoneDay
                ? (node) => {
                    latestDoneRef.current = node;
                  }
                : undefined
            }
          />
        );
      })}
    </ul>
  );
}
