/**
 * Create Quiz Page — Specific course mate navi quiz create karva mate page
 * Create Quiz Page — Page for creating new quiz for a specific course
 *
 * Aa server component chhe je courseId search param thi course-specific quiz creation form render kare chhe
 * This is a server component that renders a course-specific quiz creation form from courseId search param
 *
 * Features:
 * - courseId validation — courseId search param na hoy to /admin/courses par redirect
 *   courseId validation — Redirects to /admin/courses if courseId search param is missing
 * - QuizCreationForm — Shared quiz form component (from @/components/quiz)
 */
import { QuizCreationForm } from "@/components/quiz/quiz-creation-form";
import { redirect } from "next/navigation";

interface CreateQuizPageProps {
    searchParams: { courseId?: string };
}

export default function CreateQuizPage({ searchParams }: CreateQuizPageProps) {
    const courseId = searchParams.courseId;

    if (!courseId) {
        redirect("/admin/courses");
    }

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Create New Quiz</h1>
                <p className="text-muted-foreground mt-2">
                    Add a new quiz to your course
                </p>
            </div>

            <QuizCreationForm courseId={courseId} />
        </div>
    );
}
