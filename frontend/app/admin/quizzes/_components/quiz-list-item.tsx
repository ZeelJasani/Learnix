/**
 * QuizListItem Component — Individual quiz item card with edit/delete actions
 * QuizListItem Component — Individual quiz item card with edit/delete actions
 *
 * Aa client component chhe je single quiz ni details display kare chhe
 * This is a client component that displays single quiz details
 *
 * Features:
 * - Title + status badge — Quiz name with Published/Draft status
 * - Description — Optional truncated description (line-clamp-2)
 * - Question count — HelpCircle icon sathe total questions
 *   Question count — Total questions with HelpCircle icon
 * - Time limit — Clock icon sathe quiz duration (minutes)
 *   Time limit — Quiz duration in minutes with Clock icon
 * - Edit button — Ghost button for quiz editing (onEdit callback)
 * - Delete button — Destructive ghost button with Trash2 icon (onDelete callback)
 */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, HelpCircle, Trash2, Edit } from "lucide-react";

interface Quiz {
    id: string;
    title: string;
    description: string | null;
    isPublished: boolean;
    questions: any[];
    timeLimit: number | null;
    dueDate: string | null;
}

interface QuizListItemProps {
    quiz: Quiz;
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
}

export function QuizListItem({ quiz, onDelete, onEdit }: QuizListItemProps) {
    return (
        <div className="flex items-start justify-between p-4 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors">
            <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-medium">{quiz.title}</h4>
                    <Badge variant={quiz.isPublished ? "default" : "secondary"} className="text-xs">
                        {quiz.isPublished ? "Published" : "Draft"}
                    </Badge>
                </div>
                {quiz.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {quiz.description}
                    </p>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <HelpCircle className="h-3.5 w-3.5" />
                        {quiz.questions.length} questions
                    </span>
                    {quiz.timeLimit && (
                        <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {quiz.timeLimit} mins
                        </span>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => onEdit(quiz.id)}
                >
                    <Edit className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                    onClick={() => onDelete(quiz.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
