"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
            <div className="text-center py-12 border rounded-xl bg-muted/20 border-dashed">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-lg mb-2">No activities yet</h3>
                <p className="text-muted-foreground text-sm">
                    Activities assigned by instructors will appear here
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {activities.map((activity) => (
                <div
                    key={activity.id}
                    className={`p-4 rounded-xl border transition-colors ${activity.isCompleted ? "bg-muted/30" : "hover:bg-muted/50"}`}
                >
                    <div className="flex items-start gap-4">
                        <button
                            onClick={() => !activity.isCompleted && handleMarkComplete(activity.id)}
                            className={`mt-1 shrink-0 ${activity.isCompleted ? "text-green-500" : "text-muted-foreground hover:text-primary transition-colors"}`}
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
                                <Badge variant="secondary" className="text-xs font-normal">
                                    {getTypeIcon(activity.type)}
                                    <span className="ml-1">{activity.type}</span>
                                </Badge>
                            </div>
                            {activity.description && (
                                <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                            )}
                            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                                <Link href={`/courses/${activity.course.slug}`} className="hover:underline flex items-center gap-1 hover:text-primary">
                                    <BookOpen className="h-3 w-3" />
                                    {activity.course.title}
                                </Link>
                                {activity.dueDate && (
                                    <>
                                        <Separator orientation="vertical" className="h-3" />
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            Due: {new Date(activity.dueDate).toLocaleDateString()}
                                        </span>
                                    </>
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
                <div className="max-w-6xl mx-auto px-4 md:px-6">

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        {/* LEFT COLUMN: Identity & Stats */}
                        <div className="md:col-span-4 lg:col-span-3 space-y-6">

                            {/* Profile Card */}
                            <Card className="border shadow-sm">
                                <CardContent className="pt-6 text-center">
                                    <Avatar className="h-28 w-28 mx-auto border-4 border-muted/30 shadow-md">
                                        <AvatarImage src={userImage} alt={userName} />
                                        <AvatarFallback className="text-3xl font-bold bg-primary text-primary-foreground">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="mt-4 space-y-1">
                                        <div className="flex items-center justify-center gap-2">
                                            <h1 className="text-xl font-bold">{userName}</h1>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{userEmail}</p>
                                    </div>

                                    {isAdmin && (
                                        <div className="mt-4">
                                            <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                                                <Shield className="h-3 w-3 mr-1" />
                                                Administrator
                                            </Badge>
                                        </div>
                                    )}

                                    <div className="mt-6 grid grid-cols-2 gap-2 text-center">
                                        <div className="p-3 bg-muted/30 rounded-lg">
                                            <p className="text-lg font-bold">{enrolledCourses.length}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider">Enrolled</p>
                                        </div>
                                        <div className="p-3 bg-muted/30 rounded-lg">
                                            <p className="text-lg font-bold">0</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider">Completed</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Optional: Navigation Link Sidebar? (Maybe for future use) */}
                        </div>


                        {/* RIGHT COLUMN: Content Tabs */}
                        <div className="md:col-span-8 lg:col-span-9 space-y-6">

                            {/* Tabs Navigation */}
                            <div className="border-b">
                                <nav className="-mb-px flex w-full justify-between md:justify-start md:space-x-8">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`
                                                flex-1 md:flex-none whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-center transition-colors
                                                ${activeTab === tab.id
                                                    ? "border-primary text-primary"
                                                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                                                }
                                            `}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Tab Panels */}
                            <div className="min-h-[400px]">

                                {/* COURSES TAB */}
                                {activeTab === "courses" && (
                                    <div className="space-y-6 animate-in fade-in duration-300">
                                        {enrolledCourses.length === 0 ? (
                                            <div className="text-center py-20 border-2 border-dashed rounded-xl bg-muted/10">
                                                <GraduationCap className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                                                <h3 className="font-semibold text-lg">No courses enrolled</h3>
                                                <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto mt-2">
                                                    Enhance your skills by browsing our catalog of premium courses.
                                                </p>
                                                <Button asChild>
                                                    <Link href="/courses">Explore Courses</Link>
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-4">
                                                {enrolledCourses
                                                    .filter((enrollment) => enrollment.Course)
                                                    .map((enrollment) => (
                                                        <Link
                                                            key={enrollment.id}
                                                            href={`/courses/${enrollment.Course?.slug || ""}`}
                                                            className="group block"
                                                        >
                                                            <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                                                                <div className="flex h-full">
                                                                    <div className="w-48 sm:w-56 bg-muted shrink-0 relative min-h-[140px]">
                                                                        {enrollment.Course?.fileKey ? (
                                                                            <img
                                                                                src={`https://utfs.io/f/${enrollment.Course.fileKey}`}
                                                                                alt={enrollment.Course?.title}
                                                                                className="absolute inset-0 h-full w-full object-cover"
                                                                            />
                                                                        ) : (
                                                                            <div className="h-full w-full flex items-center justify-center">
                                                                                <BookOpen className="h-8 w-8 text-muted-foreground/50" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="p-4 flex-1 flex flex-col justify-center">
                                                                        <h4 className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                                                                            {enrollment.Course?.title}
                                                                        </h4>
                                                                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                                                            {enrollment.Course?.smallDescription}
                                                                        </p>
                                                                        <div className="mt-3">
                                                                            <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal">
                                                                                {enrollment.Course?.category}
                                                                            </Badge>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Card>
                                                        </Link>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ACTIVITY TAB */}
                                {activeTab === "activity" && (
                                    <div className="animate-in fade-in duration-300">
                                        <ActivityTab />
                                    </div>
                                )}

                                {/* CERTIFICATES TAB */}
                                {activeTab === "certificates" && (
                                    <div className="space-y-6 animate-in fade-in duration-300">
                                        {enrolledCourses.length === 0 ? (
                                            <div className="text-center py-20 border-2 border-dashed rounded-xl bg-muted/10">
                                                <Award className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                                                <h3 className="font-semibold text-lg">No certificates yet</h3>
                                                <p className="text-muted-foreground text-sm mt-2">
                                                    Complete your courses to earn certifications.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-4">
                                                {enrolledCourses
                                                    .filter((enrollment) => enrollment.Course)
                                                    .map((enrollment) => (
                                                        <Card key={enrollment.id} className="p-5 flex items-center justify-between group hover:border-primary/50 transition-colors">
                                                            <div className="flex items-center gap-4">
                                                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                                    <Award className="h-6 w-6" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium group-hover:text-primary transition-colors">{enrollment.Course?.title}</h4>
                                                                    <p className="text-sm text-muted-foreground">Certificate of Completion</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <Badge variant="secondary">In Progress</Badge>
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    {new Date(enrollment.createdAt).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </Card>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
