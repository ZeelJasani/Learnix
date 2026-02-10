"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    TrendingUp,
    Award,
    Target,
    BookOpen,
    CheckCircle2
} from "lucide-react";
import { SidebarCourse } from "@/app/data/course/get-course-sidebar-data";

interface CourseProgressProps {
    course: SidebarCourse;
}

export function CourseProgress({ course }: CourseProgressProps) {
    // Calculate overall progress
    const totalLessons = course.chapter.reduce((acc, ch) => acc + ch.lessons.length, 0);
    const completedLessons = course.chapter.reduce((acc, ch) => {
        return acc + ch.lessons.filter(l => l.lessonProgress?.[0]?.completed).length;
    }, 0);
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return (
        <div className="space-y-6">
            {/* Overall Progress */}
            <Card className="border-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Overall Progress
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-center">
                        <div className="relative w-48 h-48">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="88"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="none"
                                    className="text-muted"
                                />
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="88"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 88}`}
                                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - progressPercentage / 100)}`}
                                    className="text-primary transition-all duration-500"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="text-4xl font-bold">{progressPercentage}%</div>
                                <div className="text-sm text-muted-foreground">Complete</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-500">{completedLessons}</div>
                            <div className="text-sm text-muted-foreground">Completed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-muted-foreground">
                                {totalLessons - completedLessons}
                            </div>
                            <div className="text-sm text-muted-foreground">Remaining</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Chapter Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Chapter Progress
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {course.chapter.map((chapter) => {
                        const chapterCompleted = chapter.lessons.filter(
                            l => l.lessonProgress?.[0]?.completed
                        ).length;
                        const chapterTotal = chapter.lessons.length;
                        const chapterProgress = chapterTotal > 0
                            ? Math.round((chapterCompleted / chapterTotal) * 100)
                            : 0;

                        return (
                            <div key={chapter.id} className="space-y-3">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1 flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-semibold">{chapter.title}</h4>
                                            {chapterProgress === 100 && (
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {chapterCompleted} of {chapterTotal} lessons completed
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold">{chapterProgress}%</div>
                                    </div>
                                </div>
                                <Progress value={chapterProgress} className="h-3" />

                                {/* Lesson breakdown */}
                                <div className="pl-4 space-y-2">
                                    {chapter.lessons.map((lesson) => {
                                        const isCompleted = lesson.lessonProgress?.[0]?.completed;
                                        return (
                                            <div key={lesson.id} className="flex items-center gap-2 text-sm">
                                                {isCompleted ? (
                                                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                                                ) : (
                                                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground shrink-0" />
                                                )}
                                                <span className={isCompleted ? "text-muted-foreground" : ""}>
                                                    {lesson.title}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Milestones
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${progressPercentage >= 25 ? 'bg-yellow-500/10' : 'bg-muted'}`}>
                                <Award className={`h-6 w-6 ${progressPercentage >= 25 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium">Getting Started</div>
                                <div className="text-sm text-muted-foreground">Complete 25% of the course</div>
                            </div>
                            {progressPercentage >= 25 && (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${progressPercentage >= 50 ? 'bg-blue-500/10' : 'bg-muted'}`}>
                                <Award className={`h-6 w-6 ${progressPercentage >= 50 ? 'text-blue-500' : 'text-muted-foreground'}`} />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium">Halfway There</div>
                                <div className="text-sm text-muted-foreground">Complete 50% of the course</div>
                            </div>
                            {progressPercentage >= 50 && (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${progressPercentage >= 75 ? 'bg-purple-500/10' : 'bg-muted'}`}>
                                <Award className={`h-6 w-6 ${progressPercentage >= 75 ? 'text-purple-500' : 'text-muted-foreground'}`} />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium">Almost Done</div>
                                <div className="text-sm text-muted-foreground">Complete 75% of the course</div>
                            </div>
                            {progressPercentage >= 75 && (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${progressPercentage === 100 ? 'bg-green-500/10' : 'bg-muted'}`}>
                                <Award className={`h-6 w-6 ${progressPercentage === 100 ? 'text-green-500' : 'text-muted-foreground'}`} />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium">Course Complete!</div>
                                <div className="text-sm text-muted-foreground">Complete 100% of the course</div>
                            </div>
                            {progressPercentage === 100 && (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
