"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Trash2 } from "lucide-react";

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
    return (
        <div className="flex items-start justify-between p-4 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors">
            <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-medium">{activity.title}</h4>
                    <Badge variant="secondary" className="text-xs">
                        {activity.type}
                    </Badge>
                </div>
                {activity.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {activity.description}
                    </p>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {activity.dueDate && (
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            Due: {new Date(activity.dueDate).toLocaleDateString()}
                        </span>
                    )}
                    <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {activity._count.completions} completed
                    </span>
                </div>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                onClick={() => onDelete(activity.id)}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}
