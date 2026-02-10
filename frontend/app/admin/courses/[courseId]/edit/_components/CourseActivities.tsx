"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BookOpen, Clock } from "lucide-react";
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
            console.log("Fetching activities and quizzes...");

            // Fetch activities
            const activitiesRes = await fetch(`/api/admin/activities?courseId=${data.id}`);
            let activitiesData = { activities: [] };
            if (activitiesRes.ok) {
                activitiesData = await activitiesRes.json();
            } else {
                console.error("Failed to fetch activities:", activitiesRes.status);
            }

            // Fetch quizzes - direct backend call
            const quizzesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizzes/course/${data.id}`);
            let quizzesData = { data: [] }; // Default structure

            if (quizzesRes.ok) {
                const rawData = await quizzesRes.json();
                // Handle different response structures (e.g. { data: [...] } or [...])
                if (Array.isArray(rawData)) {
                    quizzesData = { data: rawData };
                } else if (rawData.data && Array.isArray(rawData.data)) {
                    quizzesData = rawData;
                } else if (rawData.quizzes && Array.isArray(rawData.quizzes)) {
                    quizzesData = { data: rawData.quizzes };
                } else {
                    // Fallback if data is directly the object but not array (unlikely for list)
                    console.warn("Unexpected quiz data structure:", rawData);
                    quizzesData = { data: [] };
                }
            } else {
                console.error("Failed to fetch quizzes:", quizzesRes.status);
            }

            console.log("Parsed Activities:", activitiesData);
            console.log("Parsed Quizzes:", quizzesData);

            setActivities(activitiesData.activities || []);
            // Map _id to id if necessary and ensure array
            const mappedQuizzes = (quizzesData.data || []).map((q: any) => ({
                ...q,
                id: q.id || q._id, // Handle both id and _id
                title: q.title || "Untitled Quiz", // Fallback title
                isPublished: q.isPublished === true || q.isPublished === "true" // Ensure boolean
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
                : `/api/admin/quizzes/${itemToDelete.id}`; // Ensure correct delete endpoint

            const res = await fetch(endpoint, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");

            toast.success(`${itemToDelete.type === 'activity' ? 'Activity' : 'Quiz'} deleted`);
            fetchData(); // Reload data
        } catch {
            toast.error(`Failed to delete ${itemToDelete.type}`);
        } finally {
            setItemToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-end mb-4">
                <div className="flex gap-2">
                    <Button
                        onClick={() => window.location.href = `/admin/quizzes/create?courseId=${data.id}`}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Create Quiz
                    </Button>
                    <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        New Activity
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading content...</div>
            ) : (activities.length === 0 && quizzes.length === 0) ? (
                <Card className="border-dashed">
                    <CardContent className="text-center py-12 flex flex-col items-center justify-center">
                        <BookOpen className="h-10 w-10 text-muted-foreground/50 mb-3" />
                        <h3 className="font-semibold mb-1">No content yet</h3>
                        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                            Create your first activity or quiz for this course.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {quizzes.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Quizzes</h4>
                            <div className="grid gap-4">
                                {quizzes.map(quiz => (
                                    <QuizListItem
                                        key={quiz.id}
                                        quiz={quiz}
                                        onEdit={(id) => window.location.href = `/admin/quizzes/${id}/edit`}
                                        onDelete={(id) => setItemToDelete({ id, type: 'quiz' })}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {activities.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Assignments & Tasks</h4>
                            <div className="grid gap-4">
                                {activities.map(activity => (
                                    <ActivityListItem
                                        key={activity.id}
                                        activity={activity}
                                        onDelete={(id) => setItemToDelete({ id, type: 'activity' })}
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
                courseId={data.id}
                courseTitle={data.title}
                onSuccess={fetchData}
            />

            <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the {itemToDelete?.type} and remove it from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteItem} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
