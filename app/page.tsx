import { getTopics } from "@/lib/data";
import { Snowfall } from "@/components/Snowfall";
import { TopicGrid } from "@/components/TopicGrid";

export default async function HomePage() {
  const topics = await getTopics();

  return (
    <>
      <Snowfall />
      <header className="relative z-10 flex flex-col items-center gap-sm px-md pb-md pt-section text-center">
        <h1 className="m-0 font-heading text-heading tracking-tight text-accent-strong">
          Lớp học của Moon - Quỳnh Như
        </h1>
      </header>
      <main className="relative z-10 mx-auto max-w-6xl px-md pb-section">
        <TopicGrid topics={topics} />
      </main>
    </>
  );
}
