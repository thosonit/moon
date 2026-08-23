import { readFile } from "node:fs/promises";
import path from "node:path";
import type { DayEntry, Topic } from "./types";

const DATA_DIR = path.join(process.cwd(), "public", "data");

export async function getTopics(): Promise<Topic[]> {
  const raw = await readFile(path.join(DATA_DIR, "topics.json"), "utf-8");
  return JSON.parse(raw) as Topic[];
}

export async function getTopicMeta(topicId: string): Promise<Topic | null> {
  const topics = await getTopics();
  return topics.find((topic) => topic.id === topicId) ?? null;
}

export async function getDays(topicId: string): Promise<DayEntry[]> {
  const raw = await readFile(path.join(DATA_DIR, `${topicId}.json`), "utf-8");
  return JSON.parse(raw) as DayEntry[];
}
