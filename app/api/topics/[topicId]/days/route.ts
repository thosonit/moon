import { NextResponse } from "next/server";
import { getDays, getTopicMeta } from "@/lib/data";

export async function GET(_request: Request, { params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params;
  const topicMeta = await getTopicMeta(topicId);
  if (!topicMeta) {
    return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  }
  const days = await getDays(topicId);
  return NextResponse.json(days);
}
