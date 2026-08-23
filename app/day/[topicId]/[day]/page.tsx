import { notFound } from "next/navigation";
import { DayViewer } from "@/components/DayViewer";
import { getDays, getTopicMeta } from "@/lib/data";
import { toDirectImageUrl } from "@/lib/drive-url";

interface DayPageProps {
  params: Promise<{ topicId: string; day: string }>;
}

export default async function DayPage({ params }: DayPageProps) {
  const { topicId, day: dayParam } = await params;
  const day = Number.parseInt(dayParam, 10);

  const topicMeta = await getTopicMeta(topicId);
  if (!topicMeta || Number.isNaN(day) || day < 1 || day > topicMeta.totalDays) {
    notFound();
  }

  const days = await getDays(topicId);
  const entry = days.find((d) => d.day === day) ?? null;
  const imageUrl = entry ? (entry.imagePath ? `/${entry.imagePath}` : toDirectImageUrl(entry.driveUrl)) : null;

  return (
    <DayViewer
      topicId={topicId}
      topicTitle={topicMeta.title}
      totalDays={topicMeta.totalDays}
      day={day}
      imageUrl={imageUrl}
    />
  );
}
