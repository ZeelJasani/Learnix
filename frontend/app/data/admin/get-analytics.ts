// Aa file admin analytics page mate data fetch karva mate chhe
// This file fetches data for the admin analytics page
import "server-only";

import { api } from "@/lib/api-client";
import { getAuthToken } from "@/lib/server-auth";

interface DashboardStats {
    totalSignups: number;
    totalCustomers: number;
    totalCourses: number;
    totalLessons: number;
    recentSignups: number;
    activeUsers: number;
    statsByDate: Array<{
        date: string;
        signups: number;
        enrollments: number;
    }>;
}

interface EnrollmentStats {
    totalEnrollments: number;
    activeEnrollments: number;
    revenue: number;
    topCourses: Array<{ courseId: string; title: string; enrollments: number }>;
}

export async function getAnalyticsData() {
    const token = await getAuthToken();

    if (!token) {
        return null;
    }

    const [dashboardStats, enrollmentStats] = await Promise.all([
        api.get<DashboardStats>('/admin/dashboard/stats', token),
        api.get<EnrollmentStats>('/admin/dashboard/enrollments', token)
    ]);

    return {
        dashboard: dashboardStats.data,
        enrollment: enrollmentStats.data
    };
}
