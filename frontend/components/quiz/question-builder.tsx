"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, Trash2 } from "lucide-react";
import { Question } from "@/lib/quiz-api";

interface QuestionBuilderProps {
    questions: Question[];
    onChange: (questions: Question[]) => void;
}

export function QuestionBuilder({ questions, onChange }: QuestionBuilderProps) {
    const addQuestion = () => {
        const newQuestion: Question = {
            type: "multiple_choice",
            question: "",
            options: ["", "", "", ""],
            correctAnswer: "",
            explanation: "",
            points: 1,
        };
        onChange([...questions, newQuestion]);
    };

    const removeQuestion = (index: number) => {
        const updated = questions.filter((_, i) => i !== index);
        onChange(updated);
    };

    const updateQuestion = (index: number, updates: Partial<Question>) => {
        const updated = questions.map((q, i) =>
            i === index ? { ...q, ...updates } : q
        );
        onChange(updated);
    };

    const addOption = (questionIndex: number) => {
        const question = questions[questionIndex];
        if (question.options) {
            updateQuestion(questionIndex, {
                options: [...question.options, ""],
            });
        }
    };

    const removeOption = (questionIndex: number, optionIndex: number) => {
        const question = questions[questionIndex];
        if (question.options && question.options.length > 2) {
            const newOptions = question.options.filter((_, i) => i !== optionIndex);
            updateQuestion(questionIndex, { options: newOptions });
        }
    };

    const updateOption = (
        questionIndex: number,
        optionIndex: number,
        value: string
    ) => {
        const question = questions[questionIndex];
        if (question.options) {
            const newOptions = question.options.map((opt, i) =>
                i === optionIndex ? value : opt
            );
            updateQuestion(questionIndex, { options: newOptions });
        }
    };

    return (
        <div className="space-y-6">
            {questions.map((question, qIndex) => (
                <Card key={qIndex} className="relative">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">
                                Question {qIndex + 1}
                            </CardTitle>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeQuestion(qIndex)}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Question Type */}
                        <div className="space-y-2">
                            <Label>Question Type</Label>
                            <Select
                                value={question.type}
                                onValueChange={(value: Question["type"]) => {
                                    const updates: Partial<Question> = { type: value };
                                    if (value === "multiple_choice" || value === "one_choice_answer") {
                                        updates.options = ["", "", "", ""];
                                        updates.correctAnswer = "";
                                    } else if (value === "true_false") {
                                        updates.options = undefined;
                                        updates.correctAnswer = false;
                                    } else if (value === "fill_blank") {
                                        updates.options = undefined;
                                        updates.correctAnswer = "";
                                    }
                                    updateQuestion(qIndex, updates);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="one_choice_answer">One Choice Answer</SelectItem>
                                    <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                    <SelectItem value="true_false">True/False</SelectItem>
                                    <SelectItem value="fill_blank">Fill in the Blank</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Question Text */}
                        <div className="space-y-2">
                            <Label>Question *</Label>
                            <Textarea
                                value={question.question}
                                onChange={(e) =>
                                    updateQuestion(qIndex, { question: e.target.value })
                                }
                                placeholder="Enter your question here..."
                                rows={3}
                                required
                            />
                        </div>

                        {/* Multiple Choice Options */}
                        {question.type === "multiple_choice" && (
                            <div className="space-y-2">
                                <Label>Options *</Label>
                                {question.options?.map((option, oIndex) => (
                                    <div key={oIndex} className="flex gap-2">
                                        <Input
                                            value={option}
                                            onChange={(e) =>
                                                updateOption(qIndex, oIndex, e.target.value)
                                            }
                                            placeholder={`Option ${oIndex + 1}`}
                                            required
                                        />
                                        {question.options && question.options.length > 2 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeOption(qIndex, oIndex)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addOption(qIndex)}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Option
                                </Button>
                            </div>
                        )}

                        {/* One Choice Answer Options */}
                        {question.type === "one_choice_answer" && (
                            <div className="space-y-2">
                                <Label>Answer Options *</Label>
                                {question.options?.map((option, oIndex) => (
                                    <div key={oIndex} className="flex gap-2">
                                        <Input
                                            value={option}
                                            onChange={(e) =>
                                                updateOption(qIndex, oIndex, e.target.value)
                                            }
                                            placeholder={`Option ${oIndex + 1}`}
                                            required
                                        />
                                        {question.options && question.options.length > 2 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeOption(qIndex, oIndex)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addOption(qIndex)}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Option
                                </Button>
                            </div>
                        )}

                        {/* Correct Answer */}
                        <div className="space-y-2">
                            <Label>Correct Answer *</Label>
                            {question.type === "multiple_choice" && (
                                <Select
                                    value={question.correctAnswer as string}
                                    onValueChange={(value) =>
                                        updateQuestion(qIndex, { correctAnswer: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select correct answer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {question.options?.map((option, i) => (
                                            option.trim() && (
                                                <SelectItem key={i} value={option}>
                                                    {option}
                                                </SelectItem>
                                            )
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                            {question.type === "one_choice_answer" && (
                                <Select
                                    value={question.correctAnswer as string}
                                    onValueChange={(value) =>
                                        updateQuestion(qIndex, { correctAnswer: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select correct answer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {question.options?.map((option, i) => (
                                            option.trim() && (
                                                <SelectItem key={i} value={option}>
                                                    {option}
                                                </SelectItem>
                                            )
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                            {question.type === "true_false" && (
                                <Select
                                    value={String(question.correctAnswer)}
                                    onValueChange={(value) =>
                                        updateQuestion(qIndex, { correctAnswer: value === "true" })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">True</SelectItem>
                                        <SelectItem value="false">False</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                            {question.type === "fill_blank" && (
                                <Input
                                    value={question.correctAnswer as string}
                                    onChange={(e) =>
                                        updateQuestion(qIndex, { correctAnswer: e.target.value })
                                    }
                                    placeholder="Enter the correct answer"
                                    required
                                />
                            )}
                        </div>

                        {/* Points */}
                        <div className="space-y-2">
                            <Label>Points *</Label>
                            <Input
                                type="number"
                                min={1}
                                value={question.points}
                                onChange={(e) =>
                                    updateQuestion(qIndex, { points: parseInt(e.target.value) || 1 })
                                }
                                required
                            />
                        </div>

                        {/* Explanation */}
                        <div className="space-y-2">
                            <Label>Explanation (Optional)</Label>
                            <Textarea
                                value={question.explanation || ""}
                                onChange={(e) =>
                                    updateQuestion(qIndex, { explanation: e.target.value })
                                }
                                placeholder="Explain why this is the correct answer..."
                                rows={2}
                            />
                        </div>
                    </CardContent>
                </Card>
            ))}

            <Button
                type="button"
                variant="outline"
                onClick={addQuestion}
                className="w-full"
            >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
            </Button>
        </div>
    );
}
