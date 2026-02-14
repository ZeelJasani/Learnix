"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuizAttempt, QuizAPI, Quiz } from "@/lib/quiz-api";
import { Loader2, CheckCircle, XCircle, Trophy, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface QuizResultsProps {
    attemptId: string;
    quizId: string;
    courseSlug: string;
}

export function QuizResults({ attemptId, quizId, courseSlug }: QuizResultsProps) {
    const router = useRouter();
    const { getToken } = useAuth();

    const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const token = await getToken();
                if (!token) {
                    toast.error("Authentication required");
                    return;
                }

                const [attemptResponse, quizResponse] = await Promise.all([
                    QuizAPI.getAttempt(attemptId, token),
                    QuizAPI.getQuizById(quizId, token),
                ]);

                if (attemptResponse.success && attemptResponse.data) {
                    setAttempt(attemptResponse.data);
                }

                if (quizResponse.success && quizResponse.data) {
                    setQuiz(quizResponse.data);
                }
            } catch (error) {
                console.error("Error fetching results:", error);
                toast.error("Failed to load quiz results");
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [attemptId, quizId, getToken]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!attempt || !quiz) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">Results not found</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Score Summary */}
            <Card className={attempt.passed ? "border-green-500" : "border-destructive"}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Quiz Results</CardTitle>
                        <Badge variant={attempt.passed ? "default" : "destructive"} className="text-lg px-4 py-1">
                            {attempt.passed ? (
                                <>
                                    <Trophy className="h-4 w-4 mr-2" />
                                    Passed
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Failed
                                </>
                            )}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-muted rounded-lg">
                            <div className="text-3xl font-bold">{attempt.percentage.toFixed(1)}%</div>
                            <div className="text-sm text-muted-foreground">Score</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                            <div className="text-3xl font-bold">{attempt.score}/{attempt.totalPoints}</div>
                            <div className="text-sm text-muted-foreground">Points</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                            <div className="text-3xl font-bold">{attempt.attemptNumber}</div>
                            <div className="text-sm text-muted-foreground">Attempt</div>
                        </div>
                    </div>

                    {attempt.isAutoSubmitted && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                ⏰ This quiz was auto-submitted due to time limit expiration.
                            </p>
                        </div>
                    )}

                    {!attempt.passed && (
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                            <p className="text-sm text-destructive">
                                You need {quiz.passingScore}% to pass. Keep practicing!
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Question Review */}
            {quiz.showCorrectAnswers && (
                <Card>
                    <CardHeader>
                        <CardTitle>Question Review</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {attempt.results.map((result, index) => {
                            const question = quiz.questions.find(q => q._id === result.questionId);
                            if (!question) return null;

                            return (
                                <div key={index} className="border-b last:border-0 pb-6 last:pb-0">
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="font-medium">Question {index + 1}</h4>
                                        <Badge variant={result.isCorrect ? "default" : "destructive"}>
                                            {result.isCorrect ? (
                                                <>
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Correct
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="h-3 w-3 mr-1" />
                                                    Incorrect
                                                </>
                                            )}
                                        </Badge>
                                    </div>

                                    <p className="mb-3">{question.question}</p>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex gap-2">
                                            <span className="text-muted-foreground">Your Answer:</span>
                                            <span className={result.isCorrect ? "text-green-600 dark:text-green-400" : "text-destructive"}>
                                                {String(result.userAnswer || "No answer")}
                                            </span>
                                        </div>

                                        {!result.isCorrect && (
                                            <div className="flex gap-2">
                                                <span className="text-muted-foreground">Correct Answer:</span>
                                                <span className="text-green-600 dark:text-green-400">
                                                    {String(result.correctAnswer)}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <span className="text-muted-foreground">Points:</span>
                                            <span>{result.points} / {result.maxPoints}</span>
                                        </div>

                                        {question.explanation && (
                                            <div className="mt-3 p-3 bg-muted rounded-lg">
                                                <p className="text-sm">
                                                    <strong>Explanation:</strong> {question.explanation}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            )}

            {/* Actions */}
            <div className="flex gap-4">
                <Button
                    variant="outline"
                    onClick={() => router.push(`/dashboard/${courseSlug}`)}
                    className="flex-1"
                >
                    Back to Course
                </Button>
                {quiz.allowedAttempts === 0 || attempt.attemptNumber < quiz.allowedAttempts ? (
                    <Button
                        onClick={() => router.push(`/dashboard/${courseSlug}/quiz/${quizId}`)}
                        className="flex-1"
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Try Again
                    </Button>
                ) : (
                    <Button disabled className="flex-1">
                        No Attempts Remaining
                    </Button>
                )}
            </div>
        </div>
    );
}
