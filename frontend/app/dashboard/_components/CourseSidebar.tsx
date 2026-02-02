"use client";

import { SidebarCourse } from "@/app/data/course/get-course-sidebar-data";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { ChevronDown, Play } from "lucide-react";
import { LessonItem } from "./LessonItem";
import { usePathname } from "next/navigation";
import { useCourseProgress } from "@/hooks/use-course-progress";

interface iAppProps {
    course: SidebarCourse;
}

export function CourseSidebar({ course }: iAppProps) {
    const pathname = usePathname();
    const currentLessonId = pathname.split("/").pop();
    const { totalLesson, completedLessons, progressPercentage } = useCourseProgress({ courseData: course })

    return (
        <div className="flex flex-col h-full w-full">
            <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Play className="size-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="font-semibold text-base leading-tight line-clamp-2">{course.title}</h1>
                        <p className="text-xs text-muted-foreground mt-1 truncate">{course.category}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{completedLessons}/{totalLesson} lessons</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <p className="text-xs text-muted-foreground">{progressPercentage}% completed</p>
                </div>
            </div>

            <div className="mx-4 h-px bg-border my-2" />

            <div className="p-4 space-y-3 overflow-y-auto">
                {course.chapter.map((chapter, index) => (
                    <Collapsible key={chapter.id} defaultOpen={index === 0}>
                        <CollapsibleTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full p-3 h-auto flex items-center gap-2 justify-between"
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className="shrink-0">
                                        <ChevronDown className="size-4 text-primary" />
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <p className="font-semibold text-sm truncate text-foreground">
                                            {chapter.position}: {chapter.title}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-[10px] text-muted-foreground font-medium shrink-0 ml-2">
                                    {chapter.lessons.length} lessons
                                </span>
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3 pl-6 border-l-2 space-y-3">
                            {chapter.lessons.map((lesson) => (
                                <LessonItem
                                    key={lesson.id}
                                    lesson={lesson}
                                    slug={course.slug}
                                    isActive={currentLessonId === lesson.id}
                                    completed={lesson.lessonProgress.find(
                                        (progrss) => progrss.lessonId === lesson.id
                                    )?.completed || false}
                                />
                            ))}
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </div>
        </div>
    );
}