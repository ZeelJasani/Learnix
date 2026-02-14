/**
 * Lesson Edit Page — Specific lesson ni configuration edit karva mate server-guarded page
 * Lesson Edit Page — Server-guarded page for editing specific lesson configuration
 *
 * Aa server component chhe je admin ne lesson edit karva mate form render kare chhe
 * This is a server component that renders a form for admin to edit lessons
 *
 * Features:
 * - requireAdmin() — Admin-only access guard
 * - Dynamic route — params thi courseId, chapterId, lessonId extract kare chhe
 *   Dynamic route — Extracts courseId, chapterId, lessonId from params
 * - adminGetLesson(lessonId) — Backend thi lesson data fetch kare chhe
 *   adminGetLesson(lessonId) — Fetches lesson data from backend
 * - LessonForm — Client component for lesson edit form (name, description, video, thumbnail)
 */
import { requireAdmin } from "@/app/data/admin/require-admin";
import { adminGetLesson } from "@/app/data/admin/admin-get-lesson";
// import { LessonForm } from "../_components/LessonForm";
import { LessonForm } from "./_components/LessonForm";

type Params = Promise<{
  courseId: string;
  chapterId: string;
  lessonId: string;
}>;

export default async function LessonIdPage({ params }: { params: Params }) {
  const { chapterId, courseId, lessonId } = await params;
  await requireAdmin();
  const lesson = await adminGetLesson(lessonId);
 
  return <LessonForm data={lesson} chapterId={chapterId} courseId={courseId} />;
}




// type Params = Promise<{
//     courseId: string;
//     chapterId: string;
//     lessonId: string;
// }>

// export default async function LessonIdPage({Params}: {params: Params}) {
//     const { chapterId, courseId, lessonId } = await Params;
//     const lesson = await adminGetLesson


//     return (
//       <LessonForm data={lesson} chapterId={chapterId} />
//     )
    
// }