// Aa file admin dashboard mate recently added courses (limit 2) fetch kare chhe
// This file fetches the most recent courses (limit 2) for the admin dashboard overview
import "server-only";

import { api } from "@/lib/api-client";
import { getAuthToken } from "@/lib/server-auth";

export interface RecentCourseType {
  id: string;
  title: string;
  smallDescription: string;
  duration: number;
  level: string;
  status: string;
  price: number;
  fileKey: string;
  slug: string;
  category: string;
  chapterCount?: number;
}

export async function adminGetRecentCourses(): Promise<RecentCourseType[]> {
  const token = await getAuthToken();

  if (!token) {
    return [];
  }

  const response = await api.get<RecentCourseType[]>('/admin/dashboard/recent-courses?limit=2', token);

  if (response.success && response.data) {
    return response.data;
  }

  return [];
}