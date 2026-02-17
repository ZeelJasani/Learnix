"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, BookOpen, FileQuestion, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CreateActivityDialog } from "@/app/admin/activities/_components/create-activity-dialog";
import { ActivityListItem } from "@/app/admin/activities/_components/activity-list-item";
import { QuizListItem } from "@/app/admin/quizzes/_components/quiz-list-item";
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

interface Quiz {
    id: string;
    title: string;
    description: string | null;
    isPublished: boolean;
    questions: any[];
    timeLimit: number | null;
    dueDate: string | null;
}

export function CourseActivities({ data }: { data: Course }) {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'activity' | 'quiz' } | null>(null);

    useEffect(() => {
        fetchData();
    }, [data.id]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const activitiesRes = await fetch(`/api/admin/activities?courseId=${data.id}`);
            let activitiesData = { activities: [] };
            if (activitiesRes.ok) {
                activitiesData = await activitiesRes.json();
            }

            const quizzesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizzes/course/${data.id}`);
            let quizzesData: { data: any[] } = { data: [] };
            if (quizzesRes.ok) {
                const rawData = await quizzesRes.json();
                if (Array.isArray(rawData)) {
                    quizzesData = { data: rawData };
                } else if (rawData.data && Array.isArray(rawData.data)) {
                    quizzesData = rawData;
                } else if (rawData.quizzes && Array.isArray(rawData.quizzes)) {
                    quizzesData = { data: rawData.quizzes };
                } else {
                    quizzesData = { data: [] };
                }
            }

            setActivities(activitiesData.activities || []);
            const mappedQuizzes = (quizzesData.data || []).map((q: any) => ({
                ...q,
                id: q.id || q._id,
                title: q.title || "Untitled Quiz",
                isPublished: q.isPublished === true || q.isPublished === "true"
            }));
            setQuizzes(mappedQuizzes);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load course content");
        } finally {
            setIsLoading(false);
        }
    };

    const deleteItem = async () => {
        if (!itemToDelete) return;
        try {
            const endpoint = itemToDelete.type === 'activity'
                ? `/api/admin/activities?id=${itemToDelete.id}`
                : `/api/admin/quizzes/${itemToDelete.id}`;
            const res = await fetch(endpoint, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            toast.success(`${itemToDelete.type === 'activity' ? 'Activity' : 'Quiz'} deleted`);
            fetchData();
        } catch {
            toast.error(`Failed to delete ${itemToDelete.type}`);
        } finally {
            setItemToDelete(null);
        }
    };

    const totalContent = quizzes.length + activities.length;

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {totalContent > 0 && (
                        <span className="text-xs text-muted-foreground">{totalContent} items</span>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => window.location.href = `/admin/quizzes/create?courseId=${data.id}`}
                        variant="outline"
                        size="sm"
                    >
                        <FileQuestion className="h-3.5 w-3.5 mr-1.5" />
                        Create Quiz
                    </Button>
                    <Button onClick={() => setIsDialogOpen(true)} size="sm">
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        New Activity
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
            ) : totalContent === 0 ? (
                <div className="text-center py-16 border border-dashed border-border/60 rounded-lg">
                    <div className="p-3 rounded-lg bg-muted w-fit mx-auto mb-3">
                        <BookOpen className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-sm mb-1">No content yet</h3>
                    <p className="text-xs text-muted-foreground">Create your first activity or quiz</p>
                </div>
            ) : (
                <div className="space-y-5">
                    {quizzes.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Quizzes</h4>
                                <span className="text-[10px] text-muted-foreground">{quizzes.length}</span>
                            </div>
                            <div className="space-y-1.5">
                                {quizzes.map(quiz => (
                                    <QuizListItem
                                        key={quiz.id}
                                        quiz={quiz}
                                        basePath="/admin"
                                        onDelete={() => setItemToDelete({ id: quiz.id, type: 'quiz' })}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {activities.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Activities</h4>
                                <span className="text-[10px] text-muted-foreground">{activities.length}</span>
                            </div>
                            <div className="space-y-1.5">
                                {activities.map(activity => (
                                    <ActivityListItem
                                        key={activity.id}
                                        activity={activity}
                                        onDelete={() => setItemToDelete({ id: activity.id, type: 'activity' })}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <CreateActivityDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                availableCourses={[{ _id: data.id, title: data.title }]}
                preSelectedCourseId={data.id}
                onCreated={fetchData}
            />

            <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the {itemToDelete?.type}.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteItem} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
