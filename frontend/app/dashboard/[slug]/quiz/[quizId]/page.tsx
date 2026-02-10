"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { QuizTakingInterface } from "@/components/quiz/quiz-taking-interface";
import { QuizAPI, Quiz, CanTakeQuizResponse } from "@/lib/quiz-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Loader2,
    ArrowLeft,
    ShieldAlert,
    FileQuestion,
    Clock,
    Trophy,
    Target,
    RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function QuizPage() {
    const params = useParams();
    const router = useRouter();
    const { getToken } = useAuth();

    const slug = params.slug as string;
    const quizId = params.quizId as string;

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [canTake, setCanTake] = useState<CanTakeQuizResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchQuizData();
    }, [quizId]);

    const fetchQuizData = async () => {
        try {
            const token = await getToken();
            if (!token) {
                toast.error("Please sign in to take this quiz");
                router.push("/sign-in");
                return;
            }

            const [quizResponse, canTakeResponse] = await Promise.all([
                QuizAPI.getQuizForTaking(quizId, token),
                QuizAPI.canTakeQuiz(quizId, token),
            ]);

            if (quizResponse.success && quizResponse.data) {
                setQuiz(quizResponse.data);
            } else {
                toast.error(quizResponse.message || "Failed to load quiz");
            }

            if (canTakeResponse.success && canTakeResponse.data) {
                setCanTake(canTakeResponse.data);
            }
        } catch (error) {
            console.error("Error loading quiz:", error);
            toast.error("Failed to load quiz");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-muted-foreground text-sm">Loading quiz...</p>
                </div>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
                    <FileQuestion className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight mb-2">Quiz Not Found</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                    This quiz may have been removed or is currently unavailable.
                </p>
                <Button variant="outline" onClick={() => router.push(`/dashboard/${slug}`)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Course
                </Button>
            </div>
        );
    }

    if (canTake && !canTake.allowed) {
        return (
            <div className="container max-w-2xl mx-auto py-8">
                <Card className="border-destructive/50">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-destructive/10 rounded-lg">
                                <ShieldAlert className="h-6 w-6 text-destructive" />
                            </div>
                            <div>
                                <CardTitle>{quiz.title}</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    You cannot take this quiz
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <p className="text-sm text-destructive font-medium">
                                {canTake.reason}
                            </p>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Attempts used:</span>
                            <span className="font-medium">{canTake.attemptCount}</span>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => router.push(`/dashboard/${slug}`)}
                                className="flex-1"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Course
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

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

            <QuizTakingInterface quiz={quiz} courseSlug={slug} />
        </div>
    );
}
