"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileQuestion, Pencil, Trash2, Clock, HelpCircle } from "lucide-react"
import Link from "next/link"

interface QuizListItemProps {
    quiz: {
        _id: string
        title: string
        description?: string
        isPublished: boolean
        questions: any[]
        timeLimit?: number
        courseId?: string
    }
    basePath: string
    onDelete: () => void
}

export function QuizListItem({ quiz, basePath, onDelete }: QuizListItemProps) {
    return (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border/40 hover:border-border/80 hover:bg-muted/30 transition-all group">
            <div className="p-1.5 rounded-md bg-muted shrink-0">
                <FileQuestion className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{quiz.title}</p>
                    <div className={`h-2 w-2 rounded-full shrink-0 ${quiz.isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                </div>
                {quiz.description && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{quiz.description}</p>
                )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <HelpCircle className="h-3 w-3" />
                    {quiz.questions?.length || 0}
                </span>
                {quiz.timeLimit && (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {quiz.timeLimit}m
                    </span>
                )}
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" asChild>
                        <Link href={`${basePath}/quizzes/create?courseId=${quiz.courseId}&quizId=${quiz._id}`}>
                            <Pencil className="h-3.5 w-3.5" />
                        </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={onDelete}>
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
