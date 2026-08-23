"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Circle, Maximize, Minimize } from "lucide-react";
import { useBackKey } from "@/hooks/useBackKey";
import { useProgress } from "@/hooks/useProgress";

interface DayViewerProps {
  topicId: string;
  topicTitle: string;
  totalDays: number;
  day: number;
  imageUrl: string | null;
}

const ICON_BUTTON_CLASS =
  "viewer-icon-button fixed z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 bg-surface shadow-icon transition-[opacity,transform,border-color] duration-150 hover:scale-105 focus-visible:scale-105 focus-visible:outline-none active:scale-95 [&.tv-focused]:scale-105 [&.tv-focused]:border-accent [&.tv-focused]:opacity-100";

export function DayViewer({ topicId, topicTitle, totalDays, day, imageUrl }: DayViewerProps) {
  const router = useRouter();
  const viewerRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLAnchorElement>(null);
  const doneRef = useRef<HTMLButtonElement>(null);
  const fullscreenRef = useRef<HTMLButtonElement>(null);
  const controlRefs = [backRef, doneRef, fullscreenRef];

  const [controlIndex, setControlIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dateLabel, setDateLabel] = useState("");
  const { isDayDone, toggleDayDone } = useProgress(topicId);
  const isDone = isDayDone(day);

  useBackKey(() => router.push(`/topic/${encodeURIComponent(topicId)}`));

  useEffect(() => {
    setDateLabel(new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }));
  }, []);

  useEffect(() => {
    const active = controlRefs[controlIndex].current;
    active?.classList.add("tv-focused");
    active?.focus();
    return () => {
      active?.classList.remove("tv-focused");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlIndex]);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          if (day - 1 >= 1) router.push(`/day/${encodeURIComponent(topicId)}/${day - 1}`);
          break;
        case "ArrowRight":
          event.preventDefault();
          if (day + 1 <= totalDays) router.push(`/day/${encodeURIComponent(topicId)}/${day + 1}`);
          break;
        case "ArrowUp":
          event.preventDefault();
          setControlIndex((index) => (index - 1 + controlRefs.length) % controlRefs.length);
          break;
        case "ArrowDown":
          event.preventDefault();
          setControlIndex((index) => (index + 1) % controlRefs.length);
          break;
        default:
          break;
      }
    }
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, totalDays, topicId, router]);

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      viewerRef.current?.requestFullscreen();
    }
  }

  return (
    <div ref={viewerRef} className="viewer fixed inset-0 flex flex-col bg-bg">
      <Link
        ref={backRef}
        href={`/topic/${encodeURIComponent(topicId)}`}
        aria-label="Danh sách"
        title="Danh sách"
        className={`${ICON_BUTTON_CLASS} left-2 top-2 border-border text-accent-strong opacity-40 hover:border-accent hover:opacity-100 focus-visible:border-accent focus-visible:opacity-100`}
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <span className="fixed left-16 top-2 z-10 flex h-11 items-center whitespace-nowrap rounded-full px-4 font-heading text-xl font-semibold text-accent-strong">
        {dateLabel}
      </span>

      <span className="fixed right-2 top-2 z-10 flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full border-2 border-border bg-surface font-heading text-2xl font-semibold text-accent-strong shadow-icon [font-variant-numeric:tabular-nums]">
        {day}
      </span>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${topicTitle} - Ngày ${day}`}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        ) : (
          <p className="text-center text-text-muted">Chưa có ảnh</p>
        )}
      </div>

      <button
        ref={fullscreenRef}
        type="button"
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
        title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
        className={`${ICON_BUTTON_CLASS} bottom-2 right-2 border-border text-accent-strong opacity-40 hover:border-accent hover:opacity-100 focus-visible:border-accent focus-visible:opacity-100`}
      >
        {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
      </button>

      <button
        ref={doneRef}
        type="button"
        onClick={() => toggleDayDone(day)}
        aria-label={isDone ? "Đã hoàn thành" : "Đánh dấu hoàn thành"}
        title={isDone ? "Đã hoàn thành" : "Đánh dấu hoàn thành"}
        className={`${ICON_BUTTON_CLASS} bottom-2 left-2 ${
          isDone
            ? "border-success text-success opacity-100"
            : "border-border text-accent-strong opacity-40 hover:border-accent hover:opacity-100 focus-visible:border-accent focus-visible:opacity-100"
        }`}
      >
        {isDone ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
      </button>
    </div>
  );
}
