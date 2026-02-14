/**
 * ActivityListItem Component — Individual activity item card with delete action
 * ActivityListItem Component — Individual activity item card with delete action
 *
 * Aa client component chhe je single activity ni details display kare chhe (grouped list ma use thay chhe)
 * This is a client component that displays single activity details (used in grouped list)
 *
 * Features:
 * - Title + type badge — Activity name with type label (ASSIGNMENT, QUIZ, etc.)
 * - Description — Optional truncated description (line-clamp-2)
 * - Due date — Calendar icon sathe formatted date
 *   Due date — Formatted date with Calendar icon
 * - Completions count — Ketla students e complete karyu
 *   Completions count — How many students completed it
 * - Delete button — Destructive ghost button with Trash2 icon
 */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Trash2, FileText, CheckCircle, Layout, BookOpen, Video, FileQuestion } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
    id: string;
    title: string;
    description: string | null;
    type: string;
    dueDate: string | null;
    _count: { completions: number };
}

interface ActivityListItemProps {
    activity: Activity;
    onDelete: (id: string) => void;
}

export function ActivityListItem({ activity, onDelete }: ActivityListItemProps) {
    const getTypeConfig = (type: string) => {
        switch (type) {
            case "ASSIGNMENT":
                return { icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-200" };
            case "QUIZ":
                return { icon: FileQuestion, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-200" };
            case "PROJECT":
                return { icon: Layout, color: "text-purple-500", bg: "bg-purple-500/10 border-purple-200" };
            case "READING":
                return { icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-200" };
            case "VIDEO":
                return { icon: Video, color: "text-rose-500", bg: "bg-rose-500/10 border-rose-200" };
            default:
                return { icon: FileText, color: "text-slate-500", bg: "bg-slate-500/10 border-slate-200" };
        }
    };

    const config = getTypeConfig(activity.type);
    const Icon = config.icon;

    return (
        <div className={cn(
            "flex items-start justify-between p-4 rounded-xl border transition-all hover:shadow-sm group",
            "bg-card hover:bg-muted/50"
        )}>
            <div className="flex gap-4">
                <div className={cn("p-2.5 rounded-lg shrink-0 h-fit", config.bg)}>
                    <Icon className={cn("h-5 w-5", config.color)} />
                </div>
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-base">{activity.title}</h4>
                        <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 h-5 font-medium border-0", config.bg, config.color)}>
                            {activity.type}
                        </Badge>
                    </div>
                    {activity.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {activity.description}
                        </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                        {activity.dueDate && (
                            <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-0.5 rounded-md">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>Due: {new Date(activity.dueDate).toLocaleDateString()}</span>
                            </span>
                        )}
                        <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-0.5 rounded-md">
                            <Users className="h-3.5 w-3.5" />
                            <span>{activity._count.completions} completed</span>
                        </span>
                    </div>
                </div>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 opacity-0 group-hover:opacity-100 transition-all"
                onClick={() => onDelete(activity.id)}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}
