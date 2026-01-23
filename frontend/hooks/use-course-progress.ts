"use client";



import { useMemo } from "react";
import { getCourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";



interface iAppProps {
    courseData: getCourseSidebarDataType["course"]
}


interface CourseProgressResult {
    totalLesson: number;
    completedLessons: number;
    progressPercentage: number;
}

export function useCourseProgress({ courseData }: iAppProps): CourseProgressResult {
    return useMemo(() => {
        let totalLesson = 0;
        let completedLessons = 0;


        courseData.chapter.forEach((chapter) => {
            chapter.lessons.forEach((lesson) => {
                totalLesson++;


                const isCompleted = lesson.lessonProgress.some(
                    (progress) => progress.lessonId === lesson.id && progress.completed
                );


                if (isCompleted) {
                    completedLessons++;
                }
            });
        });



        const progressPercentage = totalLesson > 0 ? Math.round(
            (completedLessons / totalLesson) * 100) : 0;



            return {
                totalLesson,
                completedLessons,
                progressPercentage,

            };
    }, [courseData]);
}