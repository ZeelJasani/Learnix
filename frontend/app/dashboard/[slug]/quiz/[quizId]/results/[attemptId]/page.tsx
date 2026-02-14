/**
 * Quiz Results Page — Quiz attempt nu detailed result display kare chhe
 * Quiz Results Page — Displays detailed results of a quiz attempt
 *
 * Aa client component chhe je specific quiz attempt na results QuizResults component thi render kare chhe
 * This is a client component that renders specific quiz attempt results via QuizResults component
 *
 * Features:
 * - Dynamic routing — /dashboard/{slug}/quiz/{quizId}/results/{attemptId}
 * - QuizResults component — Score, answers, pass/fail status display
 * - Back navigation — ArrowLeft link to /dashboard/{slug}
 * - useParams() — slug, quizId, attemptId extract kare chhe from URL
 *   useParams() — Extracts slug, quizId, attemptId from URL
 */
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
