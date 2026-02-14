/**
 * Admin Lessons Page — Badha lessons nu course/chapter wise grouped view
 * Admin Lessons Page — All lessons grouped by course/chapter view
 *
 * Aa server component chhe je badha courses, chapters, ane lessons hierarchically display kare chhe
 * This is a server component that displays all courses, chapters, and lessons hierarchically
 *
 * Features:
 * - force-dynamic — Har request par fresh data fetch kare chhe
 *   force-dynamic — Fetches fresh data on every request
 * - Course cards — Title, status badge, mentor info with avatar
 * - Chapter sections — LayoutList icon sathe chapter title
 *   Chapter sections — Chapter title with LayoutList icon
 * - Lesson items — Type badge (VIDEO), duration, free/locked status badge
 * - Empty states — "No courses found" / "No chapters" / "No lessons" messages
 */
import { adminGetCoursesWithContent } from "@/app/data/admin/admin-get-lessons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileVideo, LayoutList } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminLessonsPage() {
    const courses = await adminGetCoursesWithContent();

    return (
        <div className="p-6 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Lesson Management</h1>
                    <p className="text-muted-foreground">
                        View all lessons grouped by course and chapter.
                    </p>
                </div>
            </div>

            <div className="grid gap-6">
                {courses.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        No courses found.
                    </div>
                ) : (
                    courses.map((course) => (
                        <Card key={course._id} className="overflow-hidden border-2">
                            <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between p-4 px-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            {course.title}
                                            <Badge variant={course.status === 'PUBLISHED' ? 'default' : 'secondary'} className="text-xs">
                                                {course.status}
                                            </Badge>
                                        </h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-1 max-w-md">
                                        {course.smallDescription}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 bg-background border px-3 py-1.5 rounded-full shadow-sm">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-xs font-medium leading-none">{course.userId?.name || 'Unknown Mentor'}</p>
                                        <p className="text-[10px] text-muted-foreground leading-none mt-1">Mentor</p>
                                    </div>
                                    <Avatar className="h-8 w-8 border">
                                        <AvatarImage src={course.userId?.image || ""} />
                                        <AvatarFallback>
                                            {course.userId?.name?.slice(0, 2).toUpperCase() || "??"}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                            </CardHeader>

                            <CardContent className="p-0">
                                {(!course.chapters || course.chapters.length === 0) ? (
                                    <div className="p-8 text-center text-sm text-muted-foreground">
                                        No chapters added yet.
                                    </div>
                                ) : (
                                    <div className="divide-y">
                                        {course.chapters.map((chapter: any) => (
                                            <div key={chapter._id} className="p-4 bg-card/50">
                                                <h4 className="flex items-center gap-2 font-medium text-sm text-muted-foreground mb-3 px-2">
                                                    <LayoutList className="h-4 w-4" />
                                                    {chapter.title}
                                                </h4>

                                                <div className="space-y-1 pl-4">
                                                    {(!chapter.lessons || chapter.lessons.length === 0) ? (
                                                        <p className="text-xs text-muted-foreground italic px-2 py-1">No lessons in this chapter.</p>
                                                    ) : (
                                                        chapter.lessons.map((lesson: any) => (
                                                            <div
                                                                key={lesson._id}
                                                                className="flex items-center gap-3 p-2 rounded-md hover:bg-accent/50 group transition-colors"
                                                            >
                                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                                                                    <FileVideo className="h-4 w-4" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium leading-none truncate group-hover:text-primary transition-colors">
                                                                        {lesson.title}
                                                                    </p>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted px-1.5 rounded-sm">
                                                                            {lesson.type || "VIDEO"}
                                                                        </span>
                                                                        {lesson.duration && (
                                                                            <span className="text-[10px] text-muted-foreground">
                                                                                {Math.floor(lesson.duration / 60)}m {lesson.duration % 60}s
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <Badge variant={lesson.isFree ? "secondary" : "outline"} className="text-[10px]">
                                                                    {lesson.isFree ? "Free Preview" : "Locked"}
                                                                </Badge>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
