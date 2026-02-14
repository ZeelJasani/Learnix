/**
 * CourseQuizzes Component — Course na quizzes ni list with stats ane attempt history
 * CourseQuizzes Component — Course quizzes list with stats and attempt history
 *
 * Aa client component chhe je course na available quizzes display kare chhe with attempt tracking
 * This is a client component that displays available course quizzes with attempt tracking
 *
 * Features:
 * - Stats cards — Total Quizzes, Completed (attempted), Passed count (3-col grid)
 * - Quiz cards — Title, description, question count, time limit, passing score
 * - Attempt history — Latest score with pass/fail badge ane attempt count
 *   Attempt history — Latest score with pass/fail badge and attempt count
 * - Actions — Start Quiz (new), View Results + Retake (attempted)
 * - API calls — /courses/{slug} (GET course ID) + /quizzes/course/{courseId} (GET quizzes)
 * - Clerk auth — useAuth() thi Bearer token for authenticated quiz data
 *   Clerk auth — Bearer token via useAuth() for authenticated quiz data
 * - Empty state — "No Quizzes Available" with FileQuestion icon
 */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    FileQuestion,
    Trophy,
    Clock,
    PlayCircle,
    CheckCircle2,
    XCircle
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

interface CourseQuizzesProps {
    slug: string;
}

export function CourseQuizzes({ slug }: CourseQuizzesProps) {
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const token = await getToken();

                // First get course ID from slug
                const courseRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${slug}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    cache: 'no-store',
                });
                if (!courseRes.ok) {
                    console.error("Failed to fetch course");
                    setIsLoading(false);
                    return;
                }

                const courseData = await courseRes.json();
                const courseId = courseData.data?._id || courseData.data?.id;

                if (!courseId) {
                    console.error("No course ID found");
                    setIsLoading(false);
                    return;
                }

                // Now fetch quizzes for this course (with auth token so backend can return user's attempts)
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizzes/course/${courseId}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    cache: 'no-store',
                });

                if (response.ok) {
                    const result = await response.json();

                    // Response structure handle karo / Handle response structure
                    let quizList = [];
                    if (result.success && Array.isArray(result.data)) {
                        quizList = result.data;
                    } else if (Array.isArray(result)) {
                        quizList = result;
                    } else if (result.data && Array.isArray(result.data)) {
                        quizList = result.data;
                    }

                    const mappedQuizzes = quizList.map((q: any) => ({
                        ...q,
                        id: q.id || q._id,
                        questions: q.questions || []
                    }));

                    setQuizzes(mappedQuizzes);
                } else {
                    console.error("Failed to fetch student quizzes:", response.status);
                }
            } catch (error) {
                console.error("Failed to fetch quizzes", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuizzes();
    }, [slug]);

    if (isLoading) {
        return <div className="text-center py-12 text-muted-foreground">Loading quizzes...</div>;
    }

    if (!quizzes || quizzes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
                    <FileQuestion className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight mb-2">No Quizzes Available</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                    This course doesn't have any quizzes yet. Check back later or contact your instructor.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-lg">
                                <FileQuestion className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{quizzes.length}</div>
                                <div className="text-sm text-muted-foreground">Total Quizzes</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500/10 rounded-lg">
                                <Trophy className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">
                                    {quizzes.filter(q => q.attempts && q.attempts.length > 0).length}
                                </div>
                                <div className="text-sm text-muted-foreground">Completed</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/10 rounded-lg">
                                <CheckCircle2 className="h-6 w-6 text-purple-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">
                                    {quizzes.filter(q => q.attempts?.some((a: any) => a.passed)).length}
                                </div>
                                <div className="text-sm text-muted-foreground">Passed</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quizzes List */}
            <div className="space-y-4">
                {quizzes.map((quiz) => {
                    // Start of placeholder logic replacement 
                    // We need to handle attempt history if available from the API
                    // If not available, we might assume not started
                    const latestAttempt = quiz.attempts && quiz.attempts.length > 0 ? quiz.attempts[0] : null;
                    const isPassed = latestAttempt?.passed;
                    const isCompleted = !!latestAttempt;

                    return (
                        <Card key={quiz.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1 flex-1">
                                        <CardTitle className="flex items-center gap-2">
                                            {quiz.title}
                                            {isCompleted && (
                                                <Badge variant={isPassed ? "default" : "destructive"}>
                                                    {isPassed ? "Passed" : "Failed"}
                                                </Badge>
                                            )}
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            {quiz.description}
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <FileQuestion className="h-4 w-4 text-muted-foreground" />
                                        <span>{quiz.questions?.length || 0} questions</span>
                                    </div>
                                    {quiz.timeLimit && (
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span>{quiz.timeLimit} minutes</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Trophy className="h-4 w-4 text-muted-foreground" />
                                        <span>{quiz.passingScore}% to pass</span>
                                    </div>
                                </div>

                                {latestAttempt && (
                                    <div className="p-4 bg-muted rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm text-muted-foreground">Latest Score</div>
                                                <div className="text-2xl font-bold flex items-center gap-2">
                                                    {latestAttempt.score}%
                                                    {isPassed ? (
                                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                    ) : (
                                                        <XCircle className="h-5 w-5 text-destructive" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-muted-foreground">Attempts</div>
                                                <div className="text-lg font-semibold">{quiz.attempts.length}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    {isCompleted ? (
                                        <>
                                            <Link href={`/dashboard/${slug}/quiz/${quiz.id}/results/${latestAttempt._id}`} className="flex-1">
                                                <Button className="w-full">
                                                    View Results
                                                </Button>
                                            </Link>
                                            {/* Optional: Add condition to check if retake is allowed based on quiz settings */}
                                            <Link href={`/dashboard/${slug}/quiz/${quiz.id}`}>
                                                <Button variant="outline">
                                                    Retake
                                                </Button>
                                            </Link>
                                        </>
                                    ) : (
                                        <Link href={`/dashboard/${slug}/quiz/${quiz.id}`} className="flex-1">
                                            <Button className="w-full">
                                                <PlayCircle className="h-4 w-4 mr-2" />
                                                Start Quiz
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
