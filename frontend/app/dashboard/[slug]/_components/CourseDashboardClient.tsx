/**
 * CourseDashboardClient Component — Course nu tabbed dashboard with 5 tabs
 * CourseDashboardClient Component — Course tabbed dashboard with 5 tabs
 *
 * Aa client component chhe je course ni detailed view ne 5 tabs ma organize kare chhe
 * This is a client component that organizes course detailed view into 5 tabs
 *
 * Tabs:
 * 1. Overview (LayoutDashboard) — CourseOverview — Progress, stats, continue learning
 * 2. Lessons (BookOpen) — CourseLessons — Searchable chapter/lesson list with completion
 * 3. Live (Video) — CourseLiveSessions — Live/upcoming/past sessions with join/manage
 * 4. Quizzes (FileQuestion) — CourseQuizzes — Quiz list with attempt/results
 * 5. Progress (TrendingUp) — CourseProgress — Detailed chapter-wise progress chart
 *
 * Features:
 * - Responsive tabs grid — 2/3/5 columns per breakpoint
 * - Icon-only tabs on mobile (sm:inline text hidden)
 */
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    LayoutDashboard,
    BookOpen,
    FileQuestion,
    TrendingUp,
    Video
} from "lucide-react";
import { CourseOverview } from "./CourseOverview";
import { CourseLessons } from "./CourseLessons";
import { CourseQuizzes } from "./CourseQuizzes";
import { CourseProgress } from "./CourseProgress";
import { CourseLiveSessions } from "./CourseLiveSessions";
import { SidebarCourse } from "@/app/data/course/get-course-sidebar-data";

interface CourseDashboardClientProps {
    course: SidebarCourse;
    slug: string;
}

export function CourseDashboardClient({ course, slug }: CourseDashboardClientProps) {
    return (
        <div className="h-full overflow-auto">
            <div className="container max-w-7xl mx-auto p-6 pb-16">
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 lg:w-auto lg:inline-grid">
                        <TabsTrigger value="overview" className="flex items-center gap-2">
                            <LayoutDashboard className="h-4 w-4" />
                            <span className="hidden sm:inline">Overview</span>
                        </TabsTrigger>
                        <TabsTrigger value="lessons" className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            <span className="hidden sm:inline">Lessons</span>
                        </TabsTrigger>
                        <TabsTrigger value="live" className="flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            <span className="hidden sm:inline">Live</span>
                        </TabsTrigger>
                        <TabsTrigger value="quizzes" className="flex items-center gap-2">
                            <FileQuestion className="h-4 w-4" />
                            <span className="hidden sm:inline">Quizzes</span>
                        </TabsTrigger>
                        <TabsTrigger value="progress" className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            <span className="hidden sm:inline">Progress</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <CourseOverview course={course} slug={slug} />
                    </TabsContent>

                    <TabsContent value="lessons" className="space-y-6">
                        <CourseLessons course={course} slug={slug} />
                    </TabsContent>

                    <TabsContent value="live" className="space-y-6">
                        <CourseLiveSessions slug={slug} />
                    </TabsContent>

                    <TabsContent value="quizzes" className="space-y-6">
                        <CourseQuizzes slug={slug} />
                    </TabsContent>

                    <TabsContent value="progress" className="space-y-6">
                        <CourseProgress course={course} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
