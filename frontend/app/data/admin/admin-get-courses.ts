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
}

export async function adminGetCourses(): Promise<AdminCourseType[]> {
    const token = await getAuthToken();

    if (!token) {
        return [];
    }

    const response = await api.get<AdminCourseType[]>('/admin/courses', token);

    if (response.success && response.data) {
        return response.data;
    }

    return [];
}