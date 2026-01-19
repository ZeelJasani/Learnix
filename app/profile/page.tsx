"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Mail, Shield, GraduationCap, Award, Clock, FileText, Video, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { HeroHeader } from "@/components/header";

type Tab = "courses" | "activity" | "certificates";

interface Course {
    id: string;
    title: string;
    slug: string;
    smallDescription: string;
    category: string;
    fileKey?: string | null;
}

interface Enrollment {
    id: string;
    Course: Course;
    createdAt: string;
}

interface ActivityItem {
    id: string;
    title: string;
    description: string | null;
    type: string;
    dueDate: string | null;
    course: { id: string; title: string; slug: string };
    isCompleted: boolean;
    completedAt: string | null;
    createdAt: string;
}

// Activity Tab Component
function ActivityTab() {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("/api/user/activities")
            .then(res => res.json())
            .then(data => {
                setActivities(data.activities || []);
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    const handleMarkComplete = async (activityId: string) => {
        try {
            await fetch("/api/user/activities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ activityId })
            });
            // Update local state
            setActivities(prev => prev.map(a =>
                a.id === activityId ? { ...a, isCompleted: true, completedAt: new Date().toISOString() } : a
            ));
        } catch (error) {
            console.error("Error completing activity:", error);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "VIDEO": return <Video className="h-4 w-4" />;
            case "READING": return <FileText className="h-4 w-4" />;
            default: return <FileText className="h-4 w-4" />;
        }
    };

    if (isLoading) {
        return <div className="text-center py-12 text-muted-foreground">Loading activities...</div>;
    }

    if (activities.length === 0) {
        return (
            <div className="text-center py-12 border rounded-xl bg-muted/20">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-lg mb-2">No activities yet</h3>
                <p className="text-muted-foreground text-sm">
                    Activities assigned by instructors will appear here
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {activities.map(activity => (
                <div
                    key={activity.id}
                    className={`p-4 rounded-xl border transition-colors ${activity.isCompleted ? "bg-muted/30" : "hover:bg-muted/50"}`}
                >
                    <div className="flex items-start gap-3">
                        <button
                            onClick={() => !activity.isCompleted && handleMarkComplete(activity.id)}
                            className={`mt-0.5 shrink-0 ${activity.isCompleted ? "text-green-500" : "text-muted-foreground hover:text-primary"}`}
                            disabled={activity.isCompleted}
                        >
                            {activity.isCompleted ? (
                                <CheckCircle2 className="h-5 w-5" />
                            ) : (
                                <Circle className="h-5 w-5" />
                            )}
                        </button>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h4 className={`font-medium ${activity.isCompleted ? "line-through text-muted-foreground" : ""}`}>
                                    {activity.title}
                                </h4>
                                <Badge variant="secondary" className="text-xs">
                                    {getTypeIcon(activity.type)}
                                    <span className="ml-1">{activity.type}</span>
                                </Badge>
                            </div>
                            {activity.description && (
                                <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                            )}
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                <Link href={`/courses/${activity.course.slug}`} className="hover:underline">
                                    {activity.course.title}
                                </Link>
                                {activity.dueDate && (
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        Due: {new Date(activity.dueDate).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}


export default function ProfilePage() {
    const { user: clerkUser, isLoaded } = useUser();
    const [activeTab, setActiveTab] = useState<Tab>("courses");
    const [enrolledCourses, setEnrolledCourses] = useState<Enrollment[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Fetch enrolled courses
        fetch("/api/user/enrolled-courses")
            .then(res => res.json())
            .then(data => {
                if (data.courses) {
                    setEnrolledCourses(data.courses);
                }
            })
            .catch(console.error);

        // Fetch user role
        fetch("/api/user/get-current-user-role")
            .then(res => res.json())
            .then(data => {
                setIsAdmin(data.isAdmin);
            })
            .catch(console.error);
    }, []);



    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
        );
    }

    if (!clerkUser) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-muted-foreground">Please sign in to view your profile</p>
                    <Button asChild>
                        <Link href="/login">Sign In</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const userName = clerkUser.fullName || clerkUser.firstName || "User";
    const userEmail = clerkUser.primaryEmailAddress?.emailAddress || "";
    const userImage = clerkUser.imageUrl || "";
    const initials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const tabs: { id: Tab; label: string }[] = [
        { id: "courses", label: "Courses" },
        { id: "activity", label: "Activity" },
        { id: "certificates", label: "Certificates" },
    ];

    return (
        <>
            <HeroHeader />
            <div className="min-h-screen bg-background pt-24 pb-12">
                <div className="max-w-4xl mx-auto px-4">

                    {/* Simplified Profile Header */}
                    <div className="flex flex-col items-center text-center space-y-6 mb-12">
                        <Avatar className="h-32 w-32 border-4 border-muted/20 shadow-lg">
                            <AvatarImage src={userImage} alt={userName} />
                            <AvatarFallback className="text-4xl font-bold bg-primary text-primary-foreground">
                                {initials}
                            </AvatarFallback>
                        </Avatar>

                        <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2">
                                <h1 className="text-3xl font-bold tracking-tight">{userName}</h1>
                                {isAdmin && (
                                    <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                                        <Shield className="h-3 w-3 mr-1" />
                                        Admin
                                    </Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground text-lg">
                                {isAdmin ? "Administrator" : "Student"}
                            </p>
                        </div>

                        {/* Meta Info Pills */}
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <div className="px-3 py-1.5 rounded-full bg-muted/50 text-sm text-muted-foreground flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5" />
                                {userEmail}
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex items-center divide-x border rounded-lg overflow-hidden bg-muted/30">
                        <div className="px-6 py-3">
                            <p className="text-2xl font-bold">{enrolledCourses.length}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Enrolled</p>
                        </div>
                        <div className="px-6 py-3">
                            <p className="text-2xl font-bold">0</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Completed</p>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex items-center justify-center gap-2 mb-8 border-b pb-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-all relative top-0.5 border-b-2 ${activeTab === tab.id
                                ? "text-primary border-primary bg-primary/5"
                                : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/30"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content Area */}
                <div className="min-h-[300px]">
                    {/* Courses Tab */}
                    {activeTab === "courses" && (
                        <div className="space-y-4">
                            {enrolledCourses.length === 0 ? (
                                <div className="text-center py-16 border rounded-xl border-dashed">
                                    <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                                    <h3 className="font-semibold text-lg mb-2">No courses yet</h3>
                                    <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                                        Start your learning journey by enrolling in a course.
                                    </p>
                                    <Button asChild>
                                        <Link href="/courses">Explore Courses</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {enrolledCourses
                                        .filter((enrollment) => enrollment.Course)
                                        .map((enrollment) => (
                                            <Link
                                                key={enrollment.id}
                                                href={`/courses/${enrollment.Course?.slug || ""}`}
                                                className="group flex gap-4 p-4 rounded-xl border bg-card hover:border-primary/50 hover:shadow-sm transition-all"
                                            >
                                                <div className="h-20 w-32 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden relative">
                                                    {enrollment.Course?.fileKey ? (
                                                        <img
                                                            src={`https://utfs.io/f/${enrollment.Course.fileKey}`}
                                                            alt={enrollment.Course?.title || "Course"}
                                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <BookOpen className="h-8 w-8 text-muted-foreground/50" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                    <h4 className="font-semibold truncate pr-2 group-hover:text-primary transition-colors">
                                                        {enrollment.Course?.title}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                        {enrollment.Course?.smallDescription}
                                                    </p>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                                                            {enrollment.Course?.category}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Activity Tab */}
                    {activeTab === "activity" && (
                        <div className="max-w-2xl mx-auto">
                            <ActivityTab />
                        </div>
                    )}

                    {/* Certificates Tab */}
                    {activeTab === "certificates" && (
                        <div className="space-y-6">
                            {enrolledCourses.length === 0 ? (
                                <div className="text-center py-16 border rounded-xl border-dashed">
                                    <Award className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                                    <h3 className="font-semibold text-lg mb-2">No certificates yet</h3>
                                    <p className="text-muted-foreground text-sm mb-6">
                                        Enroll in courses to start earning certificates
                                    </p>
                                    <Button variant="outline" asChild>
                                        <Link href="/courses">Browse Courses</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="max-w-2xl mx-auto space-y-4">
                                    {enrolledCourses
                                        .filter((enrollment) => enrollment.Course)
                                        .map((enrollment) => (
                                            <div
                                                key={enrollment.id}
                                                className="p-5 rounded-xl border bg-card flex items-center justify-between group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                        <Award className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium">{enrollment.Course?.title}</h4>
                                                        <p className="text-sm text-muted-foreground">Certificate of Completion</p>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary" className="shrink-0">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    In Progress
                                                </Badge>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div >
        </>
    );
}
