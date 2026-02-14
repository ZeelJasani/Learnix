// Aa file admin panel mate badha mentors ni list (avatar, bio, social links sathe) fetch kare chhe
// This file fetches all mentors with profile details for the admin mentor management page
"server-only";

import { api } from "@/lib/api-client";
import { getAuthToken } from "@/lib/server-auth";

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
