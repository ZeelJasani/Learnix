// Aa file admin panel mate ek lesson ni details (video, thumbnail, description) fetch kare chhe
// This file fetches a single lesson's details for admin editing (video, thumbnail, description)
import "server-only";

import { api } from "@/lib/api-client";
import { getAuthToken } from "@/lib/server-auth";
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