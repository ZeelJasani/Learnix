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
