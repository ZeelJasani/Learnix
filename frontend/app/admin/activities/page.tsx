"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, BookOpen, GraduationCap, School } from "lucide-react";
import { toast } from "sonner";
import { useConstructUrl } from "@/hooks/use-construct-url";
import Image from "next/image";
import { CreateActivityDialog } from "./_components/create-activity-dialog";
import { ActivityListItem } from "./_components/activity-list-item";

interface Course {
    id: string;
    title: string;
    slug: string;
    category: string;
    status: string;
    fileKey: string;
    smallDescription: string;
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

// Course Card Component with proper image handling
function ActivityCourseCard({
    course,
    activityCount,
    onClick
}: {
    course: Course;
    activityCount: number;
    onClick: () => void;
}) {
    const imageUrl = useConstructUrl(course.fileKey);

    return (
        <Card
            className="group relative py-0 gap-0 cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300"
            onClick={onClick}
        >
            {/* Activity count badge */}
            <div className="absolute top-3 left-3 z-10">
                <Badge className="bg-primary/90 text-primary-foreground shadow-lg">
                    {activityCount} {activityCount === 1 ? "activity" : "activities"}
                </Badge>
            </div>

            {/* Add Activity overlay */}
            <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <div className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full flex items-center gap-2 shadow-xl font-medium">
                        <Plus className="h-4 w-4" />
                        Add Activity
                    </div>
                </div>
            </div>

            {/* Course Image */}
            <div className="aspect-video relative overflow-hidden bg-muted">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                        <GraduationCap className="h-16 w-16 text-muted-foreground/30" />
                    </div>
                )}
            </div>

            {/* Course Info */}
            <CardContent className="p-4">
                <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                    {course.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                    {course.smallDescription}
                </p>
                <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline" className="text-xs">
                        {course.category}
                    </Badge>
                    <Badge
                        variant={course.status === "PUBLISHED" ? "default" : "secondary"}
                        className="text-xs"
                    >
                        {course.status}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}

export default function AdminActivitiesPage() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCourseForActivity, setSelectedCourseForActivity] = useState<Course | null>(null);

    useEffect(() => {
        fetchActivities();
        fetchCourses();
    }, []);

    const fetchActivities = async () => {
        try {
            const res = await fetch("/api/admin/activities");
            const data = await res.json();
            setActivities(data.activities || []);
        } catch {
            console.error("Error fetching activities");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const res = await fetch("/api/admin/courses");
            const data = await res.json();
            setCourses(data.courses || []);
        } catch {
            console.error("Error fetching courses");
        }
    };

    const openCreateDialog = (course: Course) => {
        setSelectedCourseForActivity(course);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this activity?")) return;

        try {
            const res = await fetch(`/api/admin/activities?id=${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");

            toast.success("Activity deleted");
            fetchActivities();
        } catch {
            toast.error("Failed to delete activity");
        }
    };

    const groupedActivities = activities.reduce((acc, activity) => {
        const courseName = activity.course.title;
        if (!acc[courseName]) acc[courseName] = [];
        acc[courseName].push(activity);
        return acc;
    }, {} as Record<string, Activity[]>);

    const getActivityCountForCourse = (courseId: string) => {
        return activities.filter(a => a.courseId === courseId).length;
    };

    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Course Activities</h1>
                <p className="text-muted-foreground mt-1">
                    Create and manage activities, assignments, and tasks for your courses
                </p>
            </div>

            {/* Courses Grid */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Select a Course</h2>
                    <p className="text-sm text-muted-foreground">Click on a course to add an activity</p>
                </div>

                {courses.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-12">
                            <School className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                            <h3 className="font-semibold text-lg mb-2">No courses found</h3>
                            <p className="text-muted-foreground text-sm">
                                Create a course first to add activities
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map(course => (
                            <ActivityCourseCard
                                key={course.id}
                                course={course}
                                activityCount={getActivityCountForCourse(course.id)}
                                onClick={() => openCreateDialog(course)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Create Activity Dialog */}
            {selectedCourseForActivity && (
                <CreateActivityDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    courseId={selectedCourseForActivity.id}
                    courseTitle={selectedCourseForActivity.title}
                    onSuccess={fetchActivities}
                />
            )}

            {/* Activities List */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Existing Activities</h2>
                {isLoading ? (
                    <div className="text-center py-12 text-muted-foreground">Loading activities...</div>
                ) : Object.keys(groupedActivities).length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-12">
                            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                            <h3 className="font-semibold text-lg mb-2">No activities yet</h3>
                            <p className="text-muted-foreground text-sm">
                                Click on a course above to create your first activity
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groupedActivities).map(([courseName, courseActivities]) => (
                            <Card key={courseName}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <BookOpen className="h-5 w-5 text-primary" />
                                        {courseName}
                                    </CardTitle>
                                    <CardDescription>
                                        {courseActivities.length} {courseActivities.length === 1 ? "activity" : "activities"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {courseActivities.map(activity => (
                                            <ActivityListItem
                                                key={activity.id}
                                                activity={activity}
                                                onDelete={handleDelete}
                                            />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
