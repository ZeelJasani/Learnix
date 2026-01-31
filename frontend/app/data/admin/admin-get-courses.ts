import "server-only";

import { api, getAuthToken } from "@/lib/api-client";

export interface AdminCourseType {
    id: string;
    title: string;
    smallDescription: string;
    duration: number;
    level: string;
    status: string;
    price: number;
    fileKey: string;
    category: string;
    slug: string;
    chapterCount?: number;
}

export async function adminGetCourses(): Promise<AdminCourseType[]> {
    const token = await getAuthToken();

    if (!token) {
        return [];
    }

    const response = await api.get<any[]>('/admin/courses', token);

    if (response.success && response.data) {
        // Map _id to id for MongoDB compatibility
        return response.data.map((course: any) => ({
            ...course,
            id: course.id || course._id?.toString() || course._id,
        }));
    }

    return [];
}