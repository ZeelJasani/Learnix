"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { QuizTimer } from "./quiz-timer";
import { Quiz, QuizAPI, QuizAttempt } from "@/lib/quiz-api";
import { toast } from "sonner";
import { Loader2, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface QuizTakingInterfaceProps {
    quiz: Quiz;
    courseSlug: string;
}

export function QuizTakingInterface({ quiz, courseSlug }: QuizTakingInterfaceProps) {
    const router = useRouter();
    const { getToken } = useAuth();

    const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [isStarting, setIsStarting] = useState(false);

    const questions = quiz.shuffleQuestions
        ? [...quiz.questions].sort(() => Math.random() - 0.5)
        : quiz.questions;

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const answeredCount = Object.keys(answers).length;

    const startQuiz = async () => {
        setIsStarting(true);
        try {
            const token = await getToken();
            if (!token) {
                toast.error("Authentication required");
                return;
            }

            const response = await QuizAPI.startQuizAttempt(quiz._id, token);
            if (response.success && response.data) {
                setAttempt(response.data);
                toast.success("Quiz started! Good luck!");
            } else {
                toast.error(response.message || "Failed to start quiz");
            }
        } catch (error) {
            console.error("Error starting quiz:", error);
            toast.error("An error occurred while starting the quiz");
        } finally {
            setIsStarting(false);
        }
    };

    const handleAnswer = (questionId: string, answer: any) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: answer,
        }));
    };

    const handleSubmit = async (isAutoSubmitted: boolean = false) => {
        if (!attempt) return;

        setIsSubmitting(true);
        try {
            const token = await getToken();
            if (!token) {
                toast.error("Authentication required");
                return;
            }

            const response = await QuizAPI.submitQuizAttempt(
                attempt._id,
                answers,
                isAutoSubmitted,
                token
            );

            if (response.success && response.data) {
                toast.success(
                    isAutoSubmitted
                        ? "Quiz auto-submitted due to time limit"
                        : "Quiz submitted successfully!"
                );
                router.push(`/dashboard/${courseSlug}/quiz/${quiz._id}/results/${response.data._id}`);
            } else {
                toast.error(response.message || "Failed to submit quiz");
            }
        } catch (error) {
            console.error("Error submitting quiz:", error);
            toast.error("An error occurred while submitting the quiz");
        } finally {
            setIsSubmitting(false);
            setShowSubmitDialog(false);
        }
    };

    const handleTimeUp = () => {
        toast.warning("Time's up! Submitting your quiz...");
        handleSubmit(true);
    };

    if (!attempt) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{quiz.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {quiz.description && (
                        <p className="text-muted-foreground">{quiz.description}</p>
                    )}

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Questions:</span>
                            <span className="font-medium">{quiz.questions.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Points:</span>
                            <span className="font-medium">{quiz.totalPoints}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Passing Score:</span>
                            <span className="font-medium">{quiz.passingScore}%</span>
                        </div>
                        {quiz.timeLimit && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Time Limit:</span>
                                <span className="font-medium">{quiz.timeLimit} minutes</span>
                            </div>
                        )}
                        {quiz.allowedAttempts > 0 && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Allowed Attempts:</span>
                                <span className="font-medium">{quiz.allowedAttempts}</span>
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={startQuiz}
                        disabled={isStarting}
                        className="w-full"
                    >
                        {isStarting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Start Quiz
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Timer */}
            {quiz.timeLimit && (
                <QuizTimer
                    timeLimit={quiz.timeLimit}
                    onTimeUp={handleTimeUp}
                    isPaused={isSubmitting}
                />
            )}

            {/* Progress */}
            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                Question {currentQuestionIndex + 1} of {questions.length}
                            </span>
                            <span className="text-muted-foreground">
                                {answeredCount} / {questions.length} answered
                            </span>
                        </div>
                        <Progress value={progress} />
                    </div>
                </CardContent>
            </Card>

            {/* Question */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">
                        Question {currentQuestionIndex + 1}
                        <span className="text-sm font-normal text-muted-foreground ml-2">
                            ({currentQuestion.points} {currentQuestion.points === 1 ? "point" : "points"})
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-base">{currentQuestion.question}</p>

                    {/* Multiple Choice */}
                    {currentQuestion.type === "multiple_choice" && currentQuestion.options && (
                        <RadioGroup
                            value={answers[currentQuestion._id!] || ""}
                            onValueChange={(value) => handleAnswer(currentQuestion._id!, value)}
                        >
                            {currentQuestion.options.map((option, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option} id={`option-${index}`} />
                                    <Label htmlFor={`option-${index}`} className="cursor-pointer">
                                        {option}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    )}

                    {/* True/False */}
                    {currentQuestion.type === "true_false" && (
                        <RadioGroup
                            value={String(answers[currentQuestion._id!] ?? "")}
                            onValueChange={(value) => handleAnswer(currentQuestion._id!, value === "true")}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="true" id="true" />
                                <Label htmlFor="true" className="cursor-pointer">True</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="false" id="false" />
                                <Label htmlFor="false" className="cursor-pointer">False</Label>
                            </div>
                        </RadioGroup>
                    )}

                    {/* Fill in the Blank */}
                    {currentQuestion.type === "fill_blank" && (
                        <Input
                            value={answers[currentQuestion._id!] || ""}
                            onChange={(e) => handleAnswer(currentQuestion._id!, e.target.value)}
                            placeholder="Enter your answer..."
                        />
                    )}

                    {/* One Choice Answer */}
                    {currentQuestion.type === "one_choice_answer" && currentQuestion.options && (
                        <RadioGroup
                            value={answers[currentQuestion._id!] || ""}
                            onValueChange={(value) => handleAnswer(currentQuestion._id!, value)}
                        >
                            {currentQuestion.options.map((option, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option} id={`one-choice-${index}`} />
                                    <Label htmlFor={`one-choice-${index}`} className="cursor-pointer">
                                        {option}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    )}
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                    disabled={currentQuestionIndex === 0}
                >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                </Button>

                {currentQuestionIndex === questions.length - 1 ? (
                    <Button onClick={() => setShowSubmitDialog(true)} disabled={isSubmitting}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Submit Quiz
                    </Button>
                ) : (
                    <Button
                        onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                        disabled={currentQuestionIndex === questions.length - 1}
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                )}
            </div>

            {/* Submit Confirmation Dialog */}
            <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You have answered {answeredCount} out of {questions.length} questions.
                            {answeredCount < questions.length && (
                                <span className="block mt-2 text-destructive">
                                    ⚠️ You have {questions.length - answeredCount} unanswered question(s).
                                </span>
                            )}
                            <span className="block mt-2">
                                Are you sure you want to submit your quiz? This action cannot be undone.
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Review Answers</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleSubmit(false)}>
                            Submit Quiz
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
