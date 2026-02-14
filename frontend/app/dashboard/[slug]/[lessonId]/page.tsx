/**
 * Lesson Content Page — Individual lesson nu video + description display kare chhe
 * Lesson Content Page — Displays individual lesson video + description
 *
 * Aa server component chhe je Suspense + skeleton sathe lesson content load kare chhe
 * This server component loads lesson content with Suspense + skeleton pattern
 *
 * Features:
 * - getLessonContent(lessonId) — Lesson data (video, description, progress) fetch
 * - Suspense + LessonSkeleton — Loading state display until data fetched
 * - CourseContent — Video player + description + "Mark as Complete" button
 */
import { getLessonContent } from "@/app/data/course/get-lesson-content";
import { CourseContent } from "./_components/CourseContent";
import { Suspense } from "react";
import { LessonSkeleton } from "./LessonSkelton";

export default async function LessonContentPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;

  return (
    <Suspense fallback={<LessonSkeleton />}>
      <LessonContentLoaded lessonId={lessonId} />
    </Suspense>
  )
}

async function LessonContentLoaded({ lessonId }: { lessonId: string }) {
  const data = await getLessonContent(lessonId);
  return <CourseContent data={data} />;
}