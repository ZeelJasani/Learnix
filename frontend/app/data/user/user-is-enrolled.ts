import "server-only";

import { api, getAuthToken } from "@/lib/api-client";

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