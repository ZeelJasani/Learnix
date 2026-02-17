"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestionBuilder } from "./question-builder";
import { QuizAPI, Question, Quiz } from "@/lib/quiz-api";
import { toast } from "sonner";
import { Loader2, Clock, Target, HelpCircle } from "lucide-react";

interface QuizCreationFormProps {
    courseId: string;
    initialData?: Partial<Quiz>;
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

    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        passingScore: number;
        timeLimit: number | null;
        allowedAttempts: number;
        shuffleQuestions: boolean;
        showCorrectAnswers: boolean;
        isPublished: boolean;
        startDate: string | null;
        dueDate: string | null;
    }>({
        title: initialData?.title || "",
        description: initialData?.description || "",
        passingScore: initialData?.passingScore || 70,
        timeLimit: initialData?.timeLimit || null,
        allowedAttempts: initialData?.allowedAttempts || 0,
        shuffleQuestions: initialData?.shuffleQuestions || false,
        showCorrectAnswers: initialData?.showCorrectAnswers ?? true,
        isPublished: initialData?.isPublished || false,
        startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().slice(0, 16) : null,
        dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().slice(0, 16) : null,
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
                startDate: formData.startDate ? new Date(formData.startDate) : null,
                dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
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
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card className="border-border/60">
                <CardHeader className="pb-4">
                    <CardTitle className="text-base">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="title" className="text-xs">Quiz Title *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., JavaScript Basics Quiz"
                            className="h-9 text-sm"
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="description" className="text-xs">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description || ""}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe what this quiz covers..."
                            rows={2}
                            className="text-sm resize-none"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Quiz Settings */}
            <Card className="border-border/60">
                <CardHeader className="pb-4">
                    <CardTitle className="text-base">Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="passingScore" className="text-xs flex items-center gap-1.5">
                                <Target className="h-3 w-3 text-muted-foreground" />
                                Passing Score (%)
                            </Label>
                            <Input
                                id="passingScore"
                                type="number"
                                min={0}
                                max={100}
                                value={formData.passingScore}
                                onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) || 70 })}
                                className="h-9 text-sm"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="timeLimit" className="text-xs flex items-center gap-1.5">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                Time Limit (min)
                            </Label>
                            <Input
                                id="timeLimit"
                                type="number"
                                min={1}
                                value={formData.timeLimit || ""}
                                onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value ? parseInt(e.target.value) : null })}
                                placeholder="No limit"
                                className="h-9 text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="allowedAttempts" className="text-xs flex items-center gap-1.5">
                                <HelpCircle className="h-3 w-3 text-muted-foreground" />
                                Attempts
                            </Label>
                            <Input
                                id="allowedAttempts"
                                type="number"
                                min={0}
                                value={formData.allowedAttempts}
                                onChange={(e) => setFormData({ ...formData, allowedAttempts: parseInt(e.target.value) || 0 })}
                                placeholder="0 = unlimited"
                                className="h-9 text-sm"
                            />
                            <p className="text-[10px] text-muted-foreground">0 = unlimited</p>
                        </div>
                    </div>

                    <div className="border-t border-border/40 pt-4 space-y-3">
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <Label htmlFor="shuffleQuestions" className="text-sm cursor-pointer">Shuffle Questions</Label>
                                <p className="text-xs text-muted-foreground">Randomize order for each attempt</p>
                            </div>
                            <Switch
                                id="shuffleQuestions"
                                checked={formData.shuffleQuestions}
                                onCheckedChange={(checked) => setFormData({ ...formData, shuffleQuestions: checked })}
                            />
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <Label htmlFor="showCorrectAnswers" className="text-sm cursor-pointer">Show Correct Answers</Label>
                                <p className="text-xs text-muted-foreground">Display after submission</p>
                            </div>
                            <Switch
                                id="showCorrectAnswers"
                                checked={formData.showCorrectAnswers}
                                onCheckedChange={(checked) => setFormData({ ...formData, showCorrectAnswers: checked })}
                            />
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <Label htmlFor="isPublished" className="text-sm cursor-pointer">Publish Quiz</Label>
                                <p className="text-xs text-muted-foreground">Make available to students</p>
                            </div>
                            <Switch
                                id="isPublished"
                                checked={formData.isPublished}
                                onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Questions */}
            <Card className="border-border/60">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Questions</CardTitle>
                        {questions.length > 0 && (
                            <span className="text-xs text-muted-foreground">{questions.length} {questions.length === 1 ? "question" : "questions"}</span>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <QuestionBuilder questions={questions} onChange={setQuestions} />
                </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-3 sticky bottom-0 bg-background/95 backdrop-blur py-4 border-t border-border/40">
                <Button type="button" variant="outline" size="sm" onClick={() => router.back()} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" size="sm" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                    {isEdit ? "Update Quiz" : "Create Quiz"}
                </Button>
            </div>
        </form>
    );
}
