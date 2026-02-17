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
            <div className="max-w-5xl mx-auto px-8 py-8">
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="h-9 gap-1 bg-muted/50 p-1">
                        <TabsTrigger value="overview" className="text-xs gap-1.5 px-3">
                            <LayoutDashboard className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Overview</span>
                        </TabsTrigger>
                        <TabsTrigger value="lessons" className="text-xs gap-1.5 px-3">
                            <BookOpen className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Lessons</span>
                        </TabsTrigger>
                        <TabsTrigger value="live" className="text-xs gap-1.5 px-3">
                            <Video className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Live</span>
                        </TabsTrigger>
                        <TabsTrigger value="quizzes" className="text-xs gap-1.5 px-3">
                            <FileQuestion className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Quizzes</span>
                        </TabsTrigger>
                        <TabsTrigger value="progress" className="text-xs gap-1.5 px-3">
                            <TrendingUp className="h-3.5 w-3.5" />
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
