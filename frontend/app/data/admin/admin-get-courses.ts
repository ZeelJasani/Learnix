// Aa file admin panel mate badha courses ni list fetch kare chhe (MongoDB ID mapping sathe)
// This file fetches all courses for the admin panel with MongoDB _id to id mapping
import "server-only";

import { api } from "@/lib/api-client";
import { getAuthToken } from "@/lib/server-auth";

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
    mentor?: {
        id: string;
        name: string;
        image: string;
    };
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