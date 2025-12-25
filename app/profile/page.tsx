"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Mail, Shield, Settings, GraduationCap, Award, Clock, FileText, Video, CheckCircle2, Circle } from "lucide-react";
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
            <div className="text-center py-12">
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
    const [memberSince, setMemberSince] = useState("");

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

    useEffect(() => {
        if (clerkUser?.createdAt) {
            setMemberSince(new Date(clerkUser.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
            }));
        }
    }, [clerkUser]);

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
            <div className="min-h-screen bg-background pt-16">
                <div className="max-w-2xl mx-auto border-x">
                    {/* Banner */}
                    <div className="h-48 bg-gradient-to-r from-primary/80 via-primary/60 to-primary/40 relative">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
                    </div>

                    {/* Profile Section */}
                    <div className="px-4 pb-4 border-b">
                        {/* Avatar - overlapping banner */}
                        <div className="flex justify-between items-start">
                            <div className="-mt-16 mb-3">
                                <Avatar className="h-32 w-32 border-4 border-background">
                                    <AvatarImage src={userImage} alt={userName} />
                                    <AvatarFallback className="text-4xl font-bold bg-primary text-primary-foreground">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="pt-3 flex gap-2">
                                <Button variant="outline" size="icon" className="rounded-full" asChild>
                                    <Link href="/settings">
                                        <Settings className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button variant="outline" className="rounded-full" asChild>
                                    <Link href="https://accounts.clerk.com/user" target="_blank">
                                        Edit profile
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Name & Handle */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold">{userName}</h2>
                                {isAdmin && (
                                    <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                                        <Shield className="h-3 w-3 mr-1" />
                                        Admin
                                    </Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground">@{userEmail.split("@")[0]}</p>
                        </div>

                        {/* Bio */}
                        <p className="mt-3 text-sm">
                            {isAdmin
                                ? "Platform Administrator • Managing courses and content"
                                : "Learning enthusiast • Exploring new skills and knowledge"}
                        </p>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                {userEmail}
                            </span>
                            {memberSince && (
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Joined {memberSince}
                                </span>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="flex gap-4 mt-3 text-sm">
                            <Link href="/dashboard" className="hover:underline">
                                <span className="font-bold">{enrolledCourses.length}</span>
                                <span className="text-muted-foreground ml-1">Enrolled</span>
                            </Link>
                            <span>
                                <span className="font-bold">0</span>
                                <span className="text-muted-foreground ml-1">Completed</span>
                            </span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 py-4 text-sm font-medium transition-colors relative ${activeTab === tab.id
                                    ? "text-foreground"
                                    : "text-muted-foreground hover:bg-muted/50"
                                    }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="px-4 py-6">
                        {/* Courses Tab */}
                        {activeTab === "courses" && (
                            <div className="space-y-4">
                                {enrolledCourses.length === 0 ? (
                                    <div className="text-center py-12">
                                        <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                        <h3 className="font-semibold text-lg mb-2">No courses yet</h3>
                                        <p className="text-muted-foreground text-sm mb-4">
                                            Start your learning journey by enrolling in a course
                                        </p>
                                        <Button asChild>
                                            <Link href="/courses">Browse Courses</Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {enrolledCourses
                                            .filter((enrollment) => enrollment.Course)
                                            .map((enrollment) => (
                                                <Link
                                                    key={enrollment.id}
                                                    href={`/courses/${enrollment.Course?.slug || ""}`}
                                                    className="block p-4 rounded-xl border hover:bg-muted/50 transition-colors"
                                                >
                                                    <div className="flex gap-4">
                                                        <div className="h-16 w-24 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                                                            {enrollment.Course?.fileKey ? (
                                                                <img
                                                                    src={`https://utfs.io/f/${enrollment.Course.fileKey}`}
                                                                    alt={enrollment.Course?.title || "Course"}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <BookOpen className="h-6 w-6 text-muted-foreground" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-semibold truncate">{enrollment.Course?.title}</h4>
                                                            <p className="text-sm text-muted-foreground truncate">
                                                                {enrollment.Course?.smallDescription}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                {enrollment.Course?.category}
                                                            </p>
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
                            <ActivityTab />
                        )}

                        {/* Certificates Tab */}
                        {activeTab === "certificates" && (
                            <div className="space-y-6">
                                {enrolledCourses.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Award className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                        <h3 className="font-semibold text-lg mb-2">No certificates yet</h3>
                                        <p className="text-muted-foreground text-sm mb-4">
                                            Enroll in courses to start earning certificates
                                        </p>
                                        <Button variant="outline" asChild>
                                            <Link href="/courses">Browse Courses</Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="text-center py-8 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl border border-primary/20">
                                            <Award className="h-16 w-16 mx-auto text-primary/60 mb-4" />
                                            <h3 className="font-semibold text-lg mb-2">Your Certificates</h3>
                                            <p className="text-muted-foreground text-sm max-w-md mx-auto">
                                                Complete all lessons in a course to unlock your certificate of completion
                                            </p>
                                        </div>
                                        {enrolledCourses
                                            .filter((enrollment) => enrollment.Course)
                                            .map((enrollment) => (
                                                <div
                                                    key={enrollment.id}
                                                    className="p-4 rounded-xl border flex items-center justify-between"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                                                            <BookOpen className="h-6 w-6 text-muted-foreground" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium">{enrollment.Course?.title}</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                Complete this course to unlock your certificate
                                                            </p>
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
            </div>
        </>
    );
}
