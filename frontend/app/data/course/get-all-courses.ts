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
}

export async function getAllCourses(): Promise<PublicCourseType[]> {
    const response = await api.get<PublicCourseType[]>('/courses');

    if (response.success && response.data) {
        return response.data;
    }

    return [];
}