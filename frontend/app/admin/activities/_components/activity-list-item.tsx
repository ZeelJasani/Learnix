"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, FileQuestion, Video, BookOpen, Layout, Trash2, Calendar } from "lucide-react"

interface ActivityListItemProps {
    activity: {
        _id: string
        title: string
        description?: string
        type: string
        dueDate?: string
        startDate?: string
        completedCount?: number
    }
    onDelete: () => void
}

const typeIcons: Record<string, any> = {
    assignment: FileText,
    quiz: FileQuestion,
    video: Video,
    reading: BookOpen,
    project: Layout,
}

export function ActivityListItem({ activity, onDelete }: ActivityListItemProps) {
    const Icon = typeIcons[activity.type?.toLowerCase()] || FileText

    return (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border/40 hover:border-border/80 hover:bg-muted/30 transition-all group">
            <div className="p-1.5 rounded-md bg-muted shrink-0">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{activity.title}</p>
                {activity.description && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{activity.description}</p>
                )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <Badge variant="secondary" className="text-[10px] capitalize h-5">
                    {activity.type}
                </Badge>
                {activity.dueDate && (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(activity.dueDate).toLocaleDateString()}
                    </span>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    onClick={onDelete}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    )
}
