"use server";

import { requireUser } from "@/app/data/user/require-user";
import { api, getAuthToken } from "@/lib/api-client";
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