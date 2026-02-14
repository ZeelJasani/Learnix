// Aa file admin mate courses ane temna lessons ni content fetch kare chhe (editing mate)
// This file fetches courses with their lesson content for admin course management
"server-only";

import { api } from "@/lib/api-client";
import { getAuthToken } from "@/lib/server-auth";

export async function adminGetCoursesWithContent() {
    const token = await getAuthToken();

    if (!token) {
        return [];
    }

    const response = await api.get<any[]>('/admin/courses/content', token);

    if (response.success && response.data) {
        return response.data;
    }

    return [];
}
