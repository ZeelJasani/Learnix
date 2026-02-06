"server-only";

import { api, getAuthToken } from "@/lib/api-client";

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
