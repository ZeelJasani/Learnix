// Aa file admin mate last 30 days na enrollment statistics fetch kare chhe (chart data mate)
// This file fetches enrollment statistics for the last 30 days for admin dashboard charts
import "server-only";

import { api } from "@/lib/api-client";
import { getAuthToken } from "@/lib/server-auth";

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