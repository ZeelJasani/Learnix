"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, BookOpen, GraduationCap, School, FileText, Layout, Video, FileQuestion, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { useConstructUrl } from "@/hooks/use-construct-url";
import Image from "next/image";
import { CreateActivityDialog } from "./_components/create-activity-dialog";
import { ActivityListItem } from "./_components/activity-list-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <Card
                className="group relative cursor-pointer overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 h-full"
                onClick={onClick}
            >
                {/* Activity count badge */}
                <div className="absolute top-3 left-3 z-20">
                    <Badge className="bg-background/80 backdrop-blur text-foreground border shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {activityCount} {activityCount === 1 ? "activity" : "activities"}
                    </Badge>
                </div>

                {/* Add Activity overlay */}
                <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-primary/5 transition-all duration-300" />

                {/* Image */}
                <div className="aspect-video relative overflow-hidden bg-muted">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={course.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                            <GraduationCap className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                    )}
                </div>

                <CardContent className="p-4 space-y-3">
                    <div>
                        <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                            {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                            {course.smallDescription}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <Badge variant="secondary" className="text-xs font-normal">
                            {course.category}
                        </Badge>
                        <Badge
                            variant={course.status === "PUBLISHED" ? "default" : "outline"}
                            className="text-xs"
                        >
                            {course.status}
                        </Badge>
                    </div>

                    <div className="pt-2">
                        <div className="w-full py-2 rounded-lg bg-primary/5 text-primary text-xs font-medium text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-1.5">
                            <Plus className="h-3 w-3" />
                            Add Activity
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default function AdminActivitiesPage() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCourseForActivity, setSelectedCourseForActivity] = useState<Course | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState<string | null>(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                await Promise.all([fetchActivities(), fetchCourses()]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const fetchActivities = async () => {
        try {
            const res = await fetch("/api/admin/activities");
            const data = await res.json();
            const activitiesData = data.data?.activities || data.activities || [];
            setActivities(Array.isArray(activitiesData) ? activitiesData : []);
        } catch {
            console.error("Error fetching activities");
            toast.error("Failed to fetch activities");
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

    const openCreateDialog = (course: Course | null = null) => {
        setSelectedCourseForActivity(course);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this activity?")) return;

        try {
            const res = await fetch(`/api/admin/activities/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");

            toast.success("Activity deleted");
            fetchActivities();
        } catch {
            toast.error("Failed to delete activity");
        }
    };

    // Filter Logic
    const filteredActivities = activities.filter(activity => {
        const matchesType = selectedType ? activity.type === selectedType : true;
        const matchesSearch = searchTerm
            ? activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.course?.title.toLowerCase().includes(searchTerm.toLowerCase())
            : true;
        return matchesType && matchesSearch;
    });

    const groupedActivities = filteredActivities.reduce((acc, activity) => {
        const courseName = activity.course?.title || "Unknown Course";
        if (!acc[courseName]) acc[courseName] = [];
        acc[courseName].push(activity);
        return acc;
    }, {} as Record<string, Activity[]>);

    const activityTypes = [
        { value: "ASSIGNMENT", label: "Assignment", icon: FileText },
        { value: "QUIZ", label: "Quiz", icon: FileQuestion },
        { value: "PROJECT", label: "Project", icon: Layout },
        { value: "READING", label: "Reading", icon: BookOpen },
        { value: "VIDEO", label: "Video", icon: Video },
    ];

    const getActivityCountForCourse = (courseId: string) => {
        return activities.filter(a => a.courseId === courseId).length;
    };

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="p-8 space-y-8 max-w-[1600px] mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b pb-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-400">
                        Course Activities
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Create and manage curriculum content and assignments
                    </p>
                </div>
                <Button onClick={() => openCreateDialog(null)} size="lg" className="shadow-lg hover:shadow-primary/25 transition-all">
                    <Plus className="h-5 w-5 mr-2" />
                    Create Activity
                </Button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left Column: Courses Grid (4/12 width) */}
                <div className="xl:col-span-4 space-y-6">
                    <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10 py-2">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <School className="h-5 w-5 text-primary" />
                            Select Course
                        </h2>
                        <Badge variant="secondary" className="rounded-full px-2.5">
                            {courses.length}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-48 rounded-xl bg-muted/50 animate-pulse" />
                            ))
                        ) : courses.length === 0 ? (
                            <Card className="border-dashed border-2">
                                <CardContent className="text-center py-12">
                                    <School className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                                    <p className="text-muted-foreground">No courses found</p>
                                </CardContent>
                            </Card>
                        ) : (
                            courses.map(course => (
                                <ActivityCourseCard
                                    key={course.id}
                                    course={course}
                                    activityCount={getActivityCountForCourse(course.id)}
                                    onClick={() => openCreateDialog(course)}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Right Column: Activities List (8/12 width) */}
                <div className="xl:col-span-8 space-y-6">
                    <div className="flex flex-col space-y-4 bg-muted/30 p-4 rounded-xl border">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search activities..."
                                    className="pl-9 bg-background"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                                <Button
                                    variant={selectedType === null ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedType(null)}
                                    className="rounded-full"
                                >
                                    All
                                </Button>
                                {activityTypes.map(type => {
                                    const Icon = type.icon;
                                    return (
                                        <Button
                                            key={type.value}
                                            variant={selectedType === type.value ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setSelectedType(type.value)}
                                            className="rounded-full gap-1.5"
                                        >
                                            <Icon className="h-3.5 w-3.5" />
                                            {/* Hide label on small screens if many items */}
                                            <span className="hidden sm:inline">{type.label}</span>
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground text-sm">Loading activities...</p>
                        </div>
                    ) : Object.keys(groupedActivities).length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-24 bg-card rounded-2xl border border-dashed shadow-sm"
                        >
                            <div className="bg-primary/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="h-8 w-8 text-primary/50" />
                            </div>
                            <h3 className="font-semibold text-xl mb-2">No activities found</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                                {searchTerm || selectedType
                                    ? "Try adjusting your filters or search terms."
                                    : "Select a course on the left to create your first activity."}
                            </p>
                            {(searchTerm || selectedType) && (
                                <Button variant="outline" onClick={() => { setSearchTerm(""); setSelectedType(null); }}>
                                    Clear Filters
                                </Button>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="space-y-6"
                        >
                            <AnimatePresence>
                                {Object.entries(groupedActivities).map(([courseName, courseActivities]) => (
                                    <motion.div key={courseName} variants={item} layout>
                                        <Card className="overflow-hidden border-l-4 border-l-primary/40 shadow-sm hover:shadow-md transition-shadow">
                                            <CardHeader className="py-3 px-5 bg-muted/30 flex flex-row items-center justify-between border-b">
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="h-4 w-4 text-primary" />
                                                    <CardTitle className="text-base font-semibold">
                                                        {courseName}
                                                    </CardTitle>
                                                </div>
                                                <Badge variant="secondary" className="font-mono text-xs">
                                                    {courseActivities.length}
                                                </Badge>
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                <div className="divide-y divide-border/50">
                                                    {courseActivities.map(activity => (
                                                        <div key={activity.id} className="p-4 hover:bg-muted/20 transition-colors group">
                                                            <ActivityListItem
                                                                activity={activity}
                                                                onDelete={handleDelete}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </div>

            <CreateActivityDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                courseId={selectedCourseForActivity?.id || ""}
                courseTitle={selectedCourseForActivity?.title || ""}
                availableCourses={courses}
                onSuccess={fetchActivities}
            />
        </div>
    );
}
