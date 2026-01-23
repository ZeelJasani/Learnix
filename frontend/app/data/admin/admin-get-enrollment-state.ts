import "server-only";

import { api, getAuthToken } from "@/lib/api-client";

interface EnrollmentDayData {
    date: string;
    enrollment: number;
}

export async function adminGetEnrollmentStats(): Promise<EnrollmentDayData[]> {
    const token = await getAuthToken();

    if (!token) {
        return [];
    }

    const response = await api.get<{
        totalEnrollments: number;
        activeEnrollments: number;
        revenue: number;
        topCourses: Array<{ courseId: string; title: string; enrollments: number }>;
    }>('/admin/dashboard/enrollments', token);

    // Generate last 30 days with data from API
    // Note: The backend would need to provide daily enrollment data
    // For now, return empty structure that frontend expects
    const last30Days: EnrollmentDayData[] = [];

    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last30Days.push({
            date: date.toISOString().split("T")[0],
            enrollment: 0,
        });
    }

    return last30Days;
}