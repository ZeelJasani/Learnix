import { requireAdminOrMentor } from "@/app/data/admin/require-admin";
import { adminGetLesson } from "@/app/data/admin/admin-get-lesson";
import { LessonForm } from "@/app/admin/courses/[courseId]/[chapterId]/[lessonId]/_components/LessonForm";

type Params = Promise<{
    courseId: string;
    chapterId: string;
    lessonId: string;
}>;

export default async function MentorLessonIdPage({ params }: { params: Params }) {
    const { chapterId, courseId, lessonId } = await params;
    await requireAdminOrMentor();
    const lesson = await adminGetLesson(lessonId);

    return <LessonForm data={lesson} chapterId={chapterId} courseId={courseId} />;
}
