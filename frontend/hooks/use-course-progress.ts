// ============================================================================
// Learnix LMS - Course Progress Hook (કોર્સ પ્રોગ્રેસ હુક)
// ============================================================================
// Aa hook course na overall progress calculate kare chhe.
// This hook calculates the overall progress of a course.
//
// Total lessons, completed lessons, ane percentage return kare chhe.
// Returns total lessons, completed lessons, and percentage.
// useMemo thi memoized chhe - unnecessary recalculation avoid kare chhe.
// Memoized with useMemo - avoids unnecessary recalculation.
// ============================================================================

"use client";

import { useMemo } from "react";
import { getCourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";

// Component props type / Component props type
interface iAppProps {
    courseData: getCourseSidebarDataType["course"]
}

// Progress result type / Progress result type
interface CourseProgressResult {
    totalLesson: number;
    completedLessons: number;
    progressPercentage: number;
}

/**
 * Course progress calculate karo / Calculate course progress
 *
 * Badha chapters ane lessons iterate karine progress calculate kare chhe.
 * Calculates progress by iterating through all chapters and lessons.
 */
export function useCourseProgress({ courseData }: iAppProps): CourseProgressResult {
    return useMemo(() => {
        let totalLesson = 0;
        let completedLessons = 0;

        // Badha chapters ane lessons count karo / Count all chapters and lessons
        courseData.chapter.forEach((chapter) => {
            chapter.lessons.forEach((lesson) => {
                totalLesson++;

                // Lesson complete chhe ke nahi te check karo
                // Check if lesson is completed
                const isCompleted = lesson.lessonProgress.some(
                    (progress) => progress.lessonId === lesson.id && progress.completed
                );

                if (isCompleted) {
                    completedLessons++;
                }
            });
        });

        // Progress percentage calculate karo (0 division safe)
        // Calculate progress percentage (division by zero safe)
        const progressPercentage = totalLesson > 0 ? Math.round(
            (completedLessons / totalLesson) * 100) : 0;

        return {
            totalLesson,
            completedLessons,
            progressPercentage,
        };
    }, [courseData]);
}