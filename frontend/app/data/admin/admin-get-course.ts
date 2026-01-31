import "server-only";

import { api, getAuthToken } from "@/lib/api-client";
import { notFound } from "next/navigation";

export interface AdminLesson {
    id: string;
    title: string;
    description: string | null;
    thumbnailKey: string | null;
    position: number;
    videoKey: string | null;
}

export interface AdminChapter {
    id: string;
    title: string;
    position: number;
    lessons: AdminLesson[];
}

export interface AdminCourseSingularType {
    id: string;
    title: string;
    description: string;
    fileKey: string;
    price: number;
    duration: number;
    level: string;
    status: string;
    slug: string;
    smallDescription: string;
    chapter?: AdminChapter[];
    chapters?: AdminChapter[];
    originalIdentifier?: string;
}

export async function adminGetCourse(id: string): Promise<AdminCourseSingularType> {
    const token = await getAuthToken();

    if (!token) {
        return notFound();
    }

    const response = await api.get<AdminCourseSingularType>(`/admin/courses/${id}`, token);

    if (!response.success || !response.data) {
        return notFound();
    }

    // Map chapters if needed
    const course = response.data;
    if (course.chapters && !course.chapter) {
        course.chapter = course.chapters;
    }

    // Add the original identifier to the course object for form submission
    // This ensures we use the same identifier (ID or slug) that was used to fetch the course
    course.originalIdentifier = id;

    return course;
}