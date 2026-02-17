/**
 * Create Quiz Page — Page for creating new quiz for a specific course
 *
 * Features:
 * - courseId validation — Redirects to /admin/courses if courseId search param is missing
 * - QuizCreationForm — Shared quiz form component
 * - Gradient header with breadcrumb
 */
import { QuizCreationForm } from "@/components/quiz/quiz-creation-form";
import { redirect } from "next/navigation";
import { FileQuestion, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CreateQuizPageProps {
    searchParams: { courseId?: string };
}

export default function CreateQuizPage({ searchParams }: CreateQuizPageProps) {
    const courseId = searchParams.courseId;

    if (!courseId) {
        redirect("/admin/courses");
    }

    return (
        <div className="flex flex-1 flex-col gap-8 p-6 md:p-8 lg:p-10 max-w-4xl mx-auto w-full">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/10 p-6 md:p-8">
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative space-y-4">
                    {/* Breadcrumb */}
                    <Link
                        href={`/admin/courses/${courseId}/edit`}
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                        Back to Course
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-500/15 ring-1 ring-amber-500/20">
                            <FileQuestion className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                                Create New Quiz
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Add a new quiz to your course
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <QuizCreationForm courseId={courseId} />
        </div>
    );
}
