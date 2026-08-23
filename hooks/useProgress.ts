"use client";

import { useCallback, useState } from "react";

const STORAGE_PREFIX = "moon:progress:";

function readCompletedDays(topicId: string): number[] {
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${topicId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((day): day is number => Number.isInteger(day)) : [];
  } catch {
    return [];
  }
}

function writeCompletedDays(topicId: string, days: number[]): void {
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${topicId}`, JSON.stringify(days));
  } catch {
    // localStorage unavailable (private mode, quota) — progress just won't persist.
  }
}

export function useProgress(topicId: string) {
  const [completedDays, setCompletedDays] = useState<Set<number>>(
    () => new Set(readCompletedDays(topicId)),
  );

  const isDayDone = useCallback((day: number) => completedDays.has(day), [completedDays]);

  const toggleDayDone = useCallback(
    (day: number) => {
      setCompletedDays((prev) => {
        const next = new Set(prev);
        if (next.has(day)) {
          next.delete(day);
        } else {
          next.add(day);
        }
        writeCompletedDays(topicId, Array.from(next));
        return next;
      });
    },
    [topicId],
  );

  return { completedDays, isDayDone, toggleDayDone };
}
