const STORAGE_PREFIX = "moon:progress:";

function readCompletedDays(topicId) {
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${topicId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((day) => Number.isInteger(day)) : [];
  } catch {
    return [];
  }
}

function writeCompletedDays(topicId, days) {
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${topicId}`, JSON.stringify(days));
  } catch {
    // localStorage unavailable (private mode, quota) — progress just won't persist.
  }
}

export function getCompletedDays(topicId) {
  return new Set(readCompletedDays(topicId));
}

export function isDayDone(topicId, day) {
  return getCompletedDays(topicId).has(day);
}

export function toggleDayDone(topicId, day) {
  const completed = getCompletedDays(topicId);
  const isDone = !completed.has(day);
  if (isDone) {
    completed.add(day);
  } else {
    completed.delete(day);
  }
  writeCompletedDays(topicId, Array.from(completed));
  return isDone;
}
