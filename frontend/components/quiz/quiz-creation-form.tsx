"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { QuestionBuilder } from "./question-builder";
import { QuizAPI, Question } from "@/lib/quiz-api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface QuizCreationFormProps {
    courseId: string;
    initialData?: any;
    isEdit?: boolean;
}

export function QuizCreationForm({
    courseId,
    initialData,
    isEdit = false,
}: QuizCreationFormProps) {
    const router = useRouter();
    const { getToken } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        passingScore: initialData?.passingScore || 70,
        timeLimit: initialData?.timeLimit || null,
        allowedAttempts: initialData?.allowedAttempts || 0,
        shuffleQuestions: initialData?.shuffleQuestions || false,
        showCorrectAnswers: initialData?.showCorrectAnswers || true,
        isPublished: initialData?.isPublished || false,
        startDate: initialData?.startDate || null,
        dueDate: initialData?.dueDate || null,
    });

    const [questions, setQuestions] = useState<Question[]>(
        initialData?.questions || []
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (questions.length === 0) {
            toast.error("Please add at least one question");
            return;
        }

        // Validate questions
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.question.trim()) {
                toast.error(`Question ${i + 1}: Question text is required`);
                return;
            }
            if (q.type === "multiple_choice") {
                if (!q.options || q.options.length < 2) {
                    toast.error(`Question ${i + 1}: At least 2 options required`);
                    return;
                }
                if (!q.correctAnswer) {
                    toast.error(`Question ${i + 1}: Please select a correct answer`);
                    return;
                }
            }
            if (q.type === "fill_blank" && !q.correctAnswer) {
                toast.error(`Question ${i + 1}: Correct answer is required`);
                return;
            }
        }

        setIsSubmitting(true);

        try {
            const token = await getToken();
            if (!token) {
                toast.error("Authentication required");
                return;
            }

            const quizData = {
                ...formData,
                courseId,
                questions,
            };

            let response;
            if (isEdit && initialData?._id) {
                response = await QuizAPI.updateQuiz(initialData._id, quizData, token);
            } else {
                response = await QuizAPI.createQuiz(quizData, token);
            }

            if (response.success) {
                toast.success(isEdit ? "Quiz updated successfully" : "Quiz created successfully");
                router.push(`/admin/courses/${courseId}/edit`);
                router.refresh();
            } else {
                toast.error(response.message || "Failed to save quiz");
            }
        } catch (error) {
            console.error("Error saving quiz:", error);
            toast.error("An error occurred while saving the quiz");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                        Set up the basic details of your quiz
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Quiz Title *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                            placeholder="e.g., JavaScript Basics Quiz"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            placeholder="Describe what this quiz covers..."
                            rows={3}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Quiz Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Quiz Settings</CardTitle>
                    <CardDescription>
                        Configure how students will take this quiz
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="passingScore">Passing Score (%)</Label>
                            <Input
                                id="passingScore"
                                type="number"
                                min={0}
                                max={100}
                                value={formData.passingScore}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        passingScore: parseInt(e.target.value) || 70,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                            <Input
                                id="timeLimit"
                                type="number"
                                min={1}
                                value={formData.timeLimit || ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        timeLimit: e.target.value ? parseInt(e.target.value) : null,
                                    })
                                }
                                placeholder="Leave empty for no limit"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="allowedAttempts">Allowed Attempts</Label>
                            <Input
                                id="allowedAttempts"
                                type="number"
                                min={0}
                                value={formData.allowedAttempts}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        allowedAttempts: parseInt(e.target.value) || 0,
                                    })
                                }
                                placeholder="0 = unlimited"
                            />
                            <p className="text-sm text-muted-foreground">
                                0 means unlimited attempts
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="shuffleQuestions">Shuffle Questions</Label>
                                <p className="text-sm text-muted-foreground">
                                    Randomize question order for each attempt
                                </p>
                            </div>
                            <Switch
                                id="shuffleQuestions"
                                checked={formData.shuffleQuestions}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, shuffleQuestions: checked })
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="showCorrectAnswers">Show Correct Answers</Label>
                                <p className="text-sm text-muted-foreground">
                                    Display correct answers after submission
                                </p>
                            </div>
                            <Switch
                                id="showCorrectAnswers"
                                checked={formData.showCorrectAnswers}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, showCorrectAnswers: checked })
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="isPublished">Publish Quiz</Label>
                                <p className="text-sm text-muted-foreground">
                                    Make this quiz available to students
                                </p>
                            </div>
                            <Switch
                                id="isPublished"
                                checked={formData.isPublished}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, isPublished: checked })
                                }
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Questions */}
            <Card>
                <CardHeader>
                    <CardTitle>Questions</CardTitle>
                    <CardDescription>
                        Add questions to your quiz
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <QuestionBuilder questions={questions} onChange={setQuestions} />
                </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEdit ? "Update Quiz" : "Create Quiz"}
                </Button>
            </div>
        </form>
    );
}
