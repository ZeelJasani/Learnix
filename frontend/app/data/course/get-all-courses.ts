import "server-only";

import { api } from "@/lib/api-client";

export interface PublicCourseType {
    id: string;
    title: string;
    price: number;
    smallDescription: string;
    slug: string;
    fileKey: string;
    level: string;
    duration: number;
    category: string;
    chapterCount?: number;
}

export async function getAllCourses(): Promise<PublicCourseType[]> {
    const response = await api.get<any[]>('/courses');

    if (response.success && response.data) {
        // Map _id to id for MongoDB compatibility
        return response.data.map((course: any) => ({
            ...course,
            id: course.id || course._id?.toString() || course._id,
        }));
    }

    return [];
}