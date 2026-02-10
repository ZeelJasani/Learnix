"use client";

import { useParams } from "next/navigation";
import { QuizResults } from "@/components/quiz/quiz-results";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function QuizResultsPage() {
    const params = useParams();

    const slug = params.slug as string;
    const quizId = params.quizId as string;
    const attemptId = params.attemptId as string;

    return (
        <div className="container max-w-3xl mx-auto py-8">
            {/* Back navigation */}
            <div className="mb-6">
                <Link
                    href={`/dashboard/${slug}`}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Course
                </Link>
            </div>

            <QuizResults
                attemptId={attemptId}
                quizId={quizId}
                courseSlug={slug}
            />
        </div>
    );
}
