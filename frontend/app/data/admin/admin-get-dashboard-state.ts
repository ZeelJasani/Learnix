// Aa file admin dashboard mate statistics (signups, courses, users, etc.) fetch kare chhe
// This file fetches admin dashboard statistics with optional month/year filtering
import "server-only";

import { api } from "@/lib/api-client";
import { getAuthToken } from "@/lib/server-auth";

type DashboardStats = {
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
};

const defaultStats: DashboardStats = {
  totalSignups: 0,
  totalCustomers: 0,
  totalCourses: 0,
  totalLessons: 0,
  recentSignups: 0,
  activeUsers: 0,
  statsByDate: [],
};

export async function adminGetDashboardStats(
  month?: number,
  year?: number
): Promise<DashboardStats> {
  try {
    const token = await getAuthToken();

    if (!token) {
      console.warn('No auth token available for dashboard stats');
      return defaultStats;
    }

    const queryParams = new URLSearchParams();
    if (month !== undefined) queryParams.append('month', month.toString());
    if (year !== undefined) queryParams.append('year', year.toString());

    const queryString = queryParams.toString();
    const endpoint = `/admin/dashboard/stats${queryString ? `?${queryString}` : ''}`;

    const response = await api.get<DashboardStats>(endpoint, token);

    if (!response.success || !response.data) {
      console.warn('Dashboard stats API returned unsuccessful response');
      return defaultStats;
    }

    return response.data;
  } catch (error) {
    console.error('Error in adminGetDashboardStats:', error);
    return defaultStats;
  }
}