// Aa file course sidebar mate chapters, lessons, ane user progress data fetch kare chhe
// This file fetches course sidebar navigation data with chapters, lessons, and user progress
import "server-only";
import { api } from "@/lib/api-client";
import { getAuthToken } from "@/lib/server-auth";
import { notFound } from "next/navigation";

export interface SidebarLesson {
  id: string;
  title: string;
  position: number;
  description: string | null;
  lessonProgress: Array<{
    completed: boolean;
    lessonId: string;
    id: string;
  }>;
}

export interface SidebarChapter {
  id: string;
  title: string;
  position: number;
  lessons: SidebarLesson[];
}

export interface SidebarCourse {
  id: string;
  title: string;
  fileKey: string;
  description: string;
  level: string;
  duration: number;
  category: string;
  slug: string;
  chapter: SidebarChapter[];
}

export async function getCourseSidebarData(slug: string): Promise<{ course: SidebarCourse | null }> {
  try {
    const token = await getAuthToken();

    // Get course data - this endpoint should return course with chapters and lessons
    const response = await api.get<SidebarCourse>(`/courses/${slug}`, token || undefined);

    if (!response.success || !response.data) {
      notFound();
      return { course: null };
    }

    // Map chapters if needed (backend might use 'chapters' instead of 'chapter')
    const course = response.data;
    if ((course as any).chapters && !course.chapter) {
      course.chapter = (course as any).chapters;
    }

    return { course };
  } catch (error) {
    console.error('Error in getCourseSidebarData:', error);
    throw error;
  }
}