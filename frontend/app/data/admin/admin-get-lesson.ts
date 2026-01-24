import "server-only";

import { api, getAuthToken } from "@/lib/api-client";
import { notFound } from "next/navigation";

export interface AdminLessonType {
  id: string;
  title: string;
  videoKey: string | null;
  thumbnailKey: string | null;
  description: string | null;
  position: number;
}

export async function adminGetLesson(id: string): Promise<AdminLessonType> {
  const token = await getAuthToken();

  if (!token) {
    return notFound();
  }

  // This endpoint would need to be added to the backend if not present
  // For now, we'll use the lessons endpoint with the lesson ID
  const response = await api.get<AdminLessonType>(`/admin/lessons/${id}`, token);

  if (!response.success || !response.data) {
    return notFound();
  }

  return response.data;
}