"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, BookOpen, Calendar, Users, GraduationCap, Clock, School } from "lucide-react";
import { toast } from "sonner";
import { useConstructUrl } from "@/hooks/use-construct-url";
import Image from "next/image";

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

const activityTypes = [
    { value: "ASSIGNMENT", label: "Assignment" },
    { value: "QUIZ", label: "Quiz" },
    { value: "PROJECT", label: "Project" },
    { value: "READING", label: "Reading" },
    { value: "VIDEO", label: "Video" },
];

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

// Selected Course Preview in Dialog
function SelectedCoursePreview({ course }: { course: Course }) {
    const imageUrl = useConstructUrl(course.fileKey);

    return (
        <div className="flex items-center gap-4 p-4 rounded-xl border bg-muted/30">
            <div className="h-20 w-32 rounded-lg bg-muted overflow-hidden shrink-0 relative">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={course.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <GraduationCap className="h-8 w-8 text-muted-foreground" />
                    </div>
                )}
            </div>
            <div className="min-w-0 flex-1">
                <h4 className="font-semibold truncate">{course.title}</h4>
                <p className="text-sm text-muted-foreground truncate">{course.smallDescription}</p>
                <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{course.category}</Badge>
                </div>
            </div>
        </div>
    );
}

export default function AdminActivitiesPage() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("ASSIGNMENT");
    const [startDate, setStartDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [courseId, setCourseId] = useState("");
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
        setCourseId(course.id);
        setIsDialogOpen(true);
    };

    const handleCreate = async () => {
        if (!title || !courseId) {
            toast.error("Please fill in required fields");
            return;
        }

        try {
            const res = await fetch("/api/admin/activities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, type, startDate: startDate || null, dueDate: dueDate || null, courseId })
            });

            if (!res.ok) throw new Error("Failed to create activity");

            toast.success("Activity created successfully");
            setIsDialogOpen(false);
            resetForm();
            fetchActivities();
        } catch {
            toast.error("Failed to create activity");
        }
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

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setType("ASSIGNMENT");
        setStartDate("");
        setDueDate("");
        setCourseId("");
        setSelectedCourseForActivity(null);
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
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
                <DialogContent className="max-w-md w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl">
                    <DialogHeader className="text-left">
                        <DialogTitle>Create Activity</DialogTitle>
                        <DialogDescription>
                            {selectedCourseForActivity?.title}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        {/* Activity Type */}
                        <div className="grid grid-cols-3 gap-2">
                            {activityTypes.map(t => (
                                <button
                                    key={t.value}
                                    type="button"
                                    onClick={() => setType(t.value)}
                                    className={`p-2 rounded-lg border text-xs font-medium transition-all ${type === t.value
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-border hover:bg-muted"
                                        }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* Title */}
                        <div className="space-y-1.5">
                            <Label htmlFor="title" className="text-sm">Title *</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Activity title"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <Label htmlFor="description" className="text-sm">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Optional description"
                                rows={2}
                                className="resize-none"
                            />
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="startDate" className="text-sm">Start Date</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="dueDate" className="text-sm">End Date</Label>
                                <Input
                                    id="dueDate"
                                    type="date"
                                    value={dueDate}
                                    onChange={e => setDueDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreate}
                            disabled={!title}
                            className="flex-1"
                        >
                            Create
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

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
                                            <div
                                                key={activity.id}
                                                className="flex items-start justify-between p-4 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors"
                                            >
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
                                                    onClick={() => handleDelete(activity.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
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
