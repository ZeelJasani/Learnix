import "server-only";
import { api, getAuthToken } from "@/lib/api-client";
import { notFound } from "next/navigation";

export interface LessonContentType {
  id: string;
  title: string;
  description: string | null;
  thumbnailKey: string | null;
  videoKey: string | null;
  position: number;
  lessonProgress: Array<{
    completed: boolean;
    lessonId: string;
  }>;
  Chapter: {
    courseId: string;
    Course: {
      slug: string;
    };
  };
}

export async function getLessonContent(lessonId: string): Promise<LessonContentType> {
  const token = await getAuthToken();

  if (!token) {
    return notFound();
  }

  const response = await api.get<LessonContentType>(`/lessons/${lessonId}/content`, token);

  if (!response.success || !response.data) {
    return notFound();
  }

  return response.data;
}