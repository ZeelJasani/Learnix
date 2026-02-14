// Aa file check kare chhe ke current user specific course ma enrolled chhe ke nahi
// This file checks whether the current authenticated user is enrolled in a given course
import "server-only";

import { api } from "@/lib/api-client";
import { getAuthToken } from "@/lib/server-auth";

export async function checkIfCourseBought(courseId: string): Promise<boolean> {
  const token = await getAuthToken();

  if (!token) {
    return false;
  }

  const response = await api.get<{ enrolled: boolean; status?: string }>(`/enrollments/check/${courseId}`, token);

  if (response.success && response.data) {
    return response.data.enrolled;
  }

  return false;
}