"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BookOpen, Clock } from "lucide-react";
import { toast } from "sonner";
import { CreateActivityDialog } from "@/app/admin/activities/_components/create-activity-dialog";
import { ActivityListItem } from "@/app/admin/activities/_components/activity-list-item";
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

interface Course {
    id: string;
    title: string;
    description: string;
    duration: number;
}

interface Activity {
    id: string;
    title: string;
    description: string | null;
    type: string;
    dueDate: string | null;
    courseId: string;
    course: { id: string; title: string };
    _count: { completions: number };
    createdAt: string;
}

export function CourseActivities({ data }: { data: Course }) {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [activityToDelete, setActivityToDelete] = useState<string | null>(null);

    useEffect(() => {
        fetchActivities();
    }, [data.id]);

    const fetchActivities = async () => {
        try {
            const res = await fetch(`/api/admin/activities?courseId=${data.id}`);
            const resData = await res.json();
            setActivities(resData.activities || []);
        } catch {
            console.error("Error fetching activities");
            toast.error("Failed to load activities");
        } finally {
            setIsLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!activityToDelete) return;

        try {
            const res = await fetch(`/api/admin/activities?id=${activityToDelete}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");

            toast.success("Activity deleted");
            fetchActivities();
        } catch {
            toast.error("Failed to delete activity");
        } finally {
            setActivityToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Activities</h3>
                    <p className="text-sm text-muted-foreground">Manage assignments, quizzes, and tasks for this course</p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    New Activity
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading activities...</div>
            ) : activities.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="text-center py-12 flex flex-col items-center justify-center">
                        <BookOpen className="h-10 w-10 text-muted-foreground/50 mb-3" />
                        <h3 className="font-semibold mb-1">No activities yet</h3>
                        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                            Create your first activity for this course to engage your students.
                        </p>
                        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                            Create Activity
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {activities.map(activity => (
                        <ActivityListItem
                            key={activity.id}
                            activity={activity}
                            onDelete={(id) => setActivityToDelete(id)}
                        />
                    ))}
                </div>
            )}

            <CreateActivityDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                courseId={data.id}
                courseTitle={data.title}
                onSuccess={fetchActivities}
            />

            <AlertDialog open={!!activityToDelete} onOpenChange={() => setActivityToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the activity and remove it from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
