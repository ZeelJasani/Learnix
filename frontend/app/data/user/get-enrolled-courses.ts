import "server-only";
import { api, getAuthToken } from "@/lib/api-client";

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