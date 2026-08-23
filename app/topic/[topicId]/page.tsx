import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BackKeyNav } from "@/components/BackKeyNav";
import { DayList } from "@/components/DayList";
import { Snowfall } from "@/components/Snowfall";
import { getDays, getTopicMeta } from "@/lib/data";

interface TopicPageProps {
  params: Promise<{ topicId: string }>;
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { topicId } = await params;
  const topicMeta = await getTopicMeta(topicId);
  if (!topicMeta) {
    notFound();
  }
  const days = await getDays(topicId);

  return (
    <>
      <Snowfall />
      <BackKeyNav href="/" />
      <header className="relative z-10 grid grid-cols-[2.75rem_1fr_2.75rem] items-center gap-md px-md pb-md pt-section">
        <Link
          href="/"
          aria-label="Về trang chủ"
          title="Về trang chủ"
          className="viewer-icon-button col-start-1 flex h-11 w-11 items-center justify-center rounded-full border-2 border-border bg-surface text-accent-strong opacity-40 shadow-icon transition-[opacity,transform,border-color] duration-150 hover:scale-105 hover:border-accent hover:opacity-100 focus-visible:scale-105 focus-visible:border-accent focus-visible:opacity-100 focus-visible:outline-none active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="col-start-2 m-0 text-center font-heading text-heading text-accent-strong">
          {topicMeta.title}
        </h1>
      </header>
      <main className="relative z-10 mx-auto max-w-6xl px-md pb-section">
        <DayList topicId={topicId} days={days} />
      </main>
    </>
  );
}
