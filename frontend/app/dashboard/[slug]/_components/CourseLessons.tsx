/**
 * CourseLessons Component — Course lessons ni searchable ane collapsible chapter-wise list
 * CourseLessons Component — Searchable and collapsible chapter-wise list of course lessons
 *
 * Aa client component chhe je student ne course na lessons browse karva ane access karva de chhe
 * This is a client component that allows students to browse and access course lessons
 *
 * Features:
 * - Search filter — Lesson title/description search with Search icon input
 * - Collapsible chapters — ChevronDown/Right toggle per chapter (all open by default)
 * - Chapter progress — Per-chapter completion count ane Progress bar
 *   Chapter progress — Per-chapter completion count and Progress bar
 * - Lesson completion status — CheckCircle2 (completed) vs Circle (pending) icons
 * - "Completed" badge — Lesson complete hoy tyare badge display thay chhe
 *   "Completed" badge — Badge displayed when lesson is complete
 * - Lesson links — /dashboard/{slug}/{lessonId} par navigate kare chhe
 *   Lesson links — Navigates to /dashboard/{slug}/{lessonId}
 * - Summary card — Total lessons count at bottom
 */
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Search,
    CheckCircle2,
    Circle,
    PlayCircle,
    ChevronDown,
    ChevronRight,
    BookOpen
} from "lucide-react";
import Link from "next/link";
import { SidebarCourse } from "@/app/data/course/get-course-sidebar-data";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface CourseLessonsProps {
    course: SidebarCourse;
    slug: string;
}

export function CourseLessons({ course, slug }: CourseLessonsProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [openChapters, setOpenChapters] = useState<string[]>(
        course.chapter.map(ch => ch.id)
    );

    const toggleChapter = (chapterId: string) => {
        setOpenChapters(prev =>
            prev.includes(chapterId)
                ? prev.filter(id => id !== chapterId)
                : [...prev, chapterId]
        );
    };

    // Filter lessons based on search
    const filteredChapters = course.chapter.map(chapter => ({
        ...chapter,
        lessons: chapter.lessons.filter(lesson =>
            lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lesson.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(chapter => chapter.lessons.length > 0);

    return (
        <div className="space-y-6">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search lessons..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Lessons List */}
            <div className="space-y-4">
                {filteredChapters.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No lessons found matching your search.</p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredChapters.map((chapter) => {
                        const completedLessons = chapter.lessons.filter(
                            l => l.lessonProgress?.[0]?.completed
                        ).length;
                        const chapterProgress = chapter.lessons.length > 0
                            ? Math.round((completedLessons / chapter.lessons.length) * 100)
                            : 0;
                        const isOpen = openChapters.includes(chapter.id);

                        return (
                            <Card key={chapter.id}>
                                <Collapsible open={isOpen} onOpenChange={() => toggleChapter(chapter.id)}>
                                    <CollapsibleTrigger asChild>
                                        <div className="p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 flex-1">
                                                    {isOpen ? (
                                                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                                    ) : (
                                                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                                    )}
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-lg">{chapter.title}</h3>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {completedLessons}/{chapter.lessons.length} lessons completed
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right min-w-[100px]">
                                                        <div className="text-sm font-medium">{chapterProgress}%</div>
                                                        <Progress value={chapterProgress} className="h-2 w-24 mt-1" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent>
                                        <div className="border-t">
                                            {chapter.lessons.map((lesson, index) => {
                                                const isCompleted = lesson.lessonProgress?.[0]?.completed;

                                                return (
                                                    <Link
                                                        key={lesson.id}
                                                        href={`/dashboard/${slug}/${lesson.id}`}
                                                        className="block border-b last:border-0 hover:bg-muted/50 transition-colors"
                                                    >
                                                        <div className="p-4 pl-14">
                                                            <div className="flex items-start gap-4">
                                                                <div className="flex items-center gap-3 flex-1">
                                                                    {isCompleted ? (
                                                                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                                                    ) : (
                                                                        <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                                                                    )}
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="font-medium">{lesson.title}</span>
                                                                            {isCompleted && (
                                                                                <Badge variant="secondary" className="text-xs">
                                                                                    Completed
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                        {lesson.description && (
                                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                                {lesson.description}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <Button variant="ghost" size="sm">
                                                                    <PlayCircle className="h-4 w-4 mr-2" />
                                                                    {isCompleted ? "Review" : "Start"}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            </Card>
                        );
                    })
                )}
            </div>

            {/* Summary */}
            <Card className="bg-muted/50">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Total Lessons</span>
                        <span className="font-semibold">
                            {course.chapter.reduce((acc, ch) => acc + ch.lessons.length, 0)}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
