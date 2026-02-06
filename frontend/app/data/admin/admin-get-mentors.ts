"server-only";

import { api, getAuthToken } from "@/lib/api-client";

export interface MentorType {
    id: string;
    name: string;
    email: string;
    image: string | null;
    createdAt: string;
    courseCount: number;
    studentCount: number;
}

export async function adminGetMentors(): Promise<MentorType[]> {
    const token = await getAuthToken();

    if (!token) {
        return [];
    }

    const response = await api.get<MentorType[]>('/admin/mentors', token);

    if (response.success && response.data) {
        return response.data;
    }

    return [];
}
