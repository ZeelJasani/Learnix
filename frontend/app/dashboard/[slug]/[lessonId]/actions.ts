// Aa file student lesson complete mark karva mate server action provide kare chhe (progress API + cache revalidation sathe)
// This file provides a server action for marking a lesson as complete with progress API call and cache revalidation
"use server";

import { requireUser } from "@/app/data/user/require-user";
import { api } from "@/lib/api-client";
import { getAuthToken } from "@/lib/server-auth";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function markLessonComplete(
  lessonId: string,
  slug: string
): Promise<ApiResponse> {
  await requireUser();

  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        status: "error",
        message: "Authentication required",
      };
    }

    const response = await api.post(`/progress/lesson/${lessonId}`, { completed: true }, token);

    if (!response.success) {
      return {
        status: "error",
        message: response.message || "Failed to mark lesson as complete",
      };
    }

    revalidatePath(`/dashboard/${slug}`);

    return {
      status: "success",
      message: "Lesson marked as complete",
    }
  } catch {
    return {
      status: "error",
      message: "Failed to mark lesson as complete",
    };
  }
}