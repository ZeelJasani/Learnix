"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    BookOpen,
    Clock,
    Award,
    TrendingUp,
    PlayCircle,
    CheckCircle2,
    Target
} from "lucide-react";
import Link from "next/link";
import { SidebarCourse } from "@/app/data/course/get-course-sidebar-data";

interface CourseOverviewProps {
    course: SidebarCourse;
    slug: string;
}

export function CourseOverview({ course, slug }: CourseOverviewProps) {
    // Calculate progress
    const totalLessons = course.chapter.reduce((acc, ch) => acc + ch.lessons.length, 0);
    const completedLessons = course.chapter.reduce((acc, ch) => {
        return acc + ch.lessons.filter(l => l.lessonProgress?.[0]?.completed).length;
    }, 0);
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Find last incomplete lesson or first lesson
    let continueLesson = null;
    for (const chapter of course.chapter) {
        for (const lesson of chapter.lessons) {
            if (!lesson.lessonProgress?.[0]?.completed) {
                continueLesson = { lesson, chapter };
                break;
            }
        }
        if (continueLesson) break;
    }

    // If all complete, use first lesson
    if (!continueLesson && course.chapter[0]?.lessons[0]) {
        continueLesson = {
            lesson: course.chapter[0].lessons[0],
            chapter: course.chapter[0]
        };
    }

    return (
        <div className="space-y-6">
            {/* Course Header */}
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                        <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-sm">
                        {course.category}
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                        {course.level}
                    </Badge>
                    <Badge variant="outline" className="text-sm flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {course.duration} hours
                    </Badge>
                </div>
            </div>

            {/* Progress Overview */}
            <Card className="border-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Your Progress
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Overall Completion</span>
                            <span className="font-bold">{progressPercentage}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-3" />
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{completedLessons}</div>
                            <div className="text-xs text-muted-foreground">Lessons Completed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">{totalLessons}</div>
                            <div className="text-xs text-muted-foreground">Total Lessons</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">{course.chapter.length}</div>
                            <div className="text-xs text-muted-foreground">Chapters</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Continue Learning */}
            {continueLesson && (
                <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PlayCircle className="h-5 w-5 text-primary" />
                            Continue Learning
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="text-sm text-muted-foreground mb-1">
                                {continueLesson.chapter.title}
                            </div>
                            <div className="font-semibold text-lg">
                                {continueLesson.lesson.title}
                            </div>
                            {continueLesson.lesson.description && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    {continueLesson.lesson.description}
                                </p>
                            )}
                        </div>
                        <Link href={`/dashboard/${slug}/${continueLesson.lesson.id}`}>
                            <Button className="w-full" size="lg">
                                <PlayCircle className="h-4 w-4 mr-2" />
                                {continueLesson.lesson.lessonProgress?.[0]?.completed
                                    ? "Review Lesson"
                                    : "Continue Learning"}
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-lg">
                                <BookOpen className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{totalLessons}</div>
                                <div className="text-sm text-muted-foreground">Total Lessons</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500/10 rounded-lg">
                                <CheckCircle2 className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{completedLessons}</div>
                                <div className="text-sm text-muted-foreground">Completed</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/10 rounded-lg">
                                <TrendingUp className="h-6 w-6 text-purple-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{progressPercentage}%</div>
                                <div className="text-sm text-muted-foreground">Progress</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Course Structure Overview */}
            <Card>
                <CardHeader>
                    <CardTitle>Course Structure</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {course.chapter.map((chapter) => {
                            const chapterCompleted = chapter.lessons.filter(
                                l => l.lessonProgress?.[0]?.completed
                            ).length;
                            const chapterProgress = chapter.lessons.length > 0
                                ? Math.round((chapterCompleted / chapter.lessons.length) * 100)
                                : 0;

                            return (
                                <div key={chapter.id} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Award className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">{chapter.title}</span>
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            {chapterCompleted}/{chapter.lessons.length} lessons
                                        </span>
                                    </div>
                                    <Progress value={chapterProgress} className="h-2" />
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
