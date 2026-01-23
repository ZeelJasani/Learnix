import "server-only";

import { api, getAuthToken } from "@/lib/api-client";

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