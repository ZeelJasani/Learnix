// Aa file logged-in user na enrolled courses ane lesson-level progress data fetch kare chhe
// This file fetches the current user's enrolled courses with lesson-level progress tracking
import "server-only";
import { api } from "@/lib/api-client";
import { getAuthToken } from "@/lib/server-auth";

export interface LessonProgress {
    id: string;
    completed: boolean;
    lessonId: string;
}

export interface EnrolledLesson {
    id: string;
    lessonProgress: LessonProgress[];
}

export interface EnrolledChapter {
    id: string;
    lessons: EnrolledLesson[];
}

export interface EnrolledCourse {
    id: string;
    title: string;
    smallDescription: string;
    fileKey: string;
    level: string;
    slug: string;
    duration: number;
    chapter: EnrolledChapter[];
}

export interface EnrolledCourseType {
    status: string;
    Course: EnrolledCourse;
}

export async function getEnrolledCourses(): Promise<EnrolledCourseType[]> {
    const token = await getAuthToken();

    if (!token) {
        return [];
    }

    const response = await api.get<EnrolledCourseType[]>('/users/enrolled-courses', token);

    if (response.success && response.data) {
        return response.data;
    }

    return [];
}