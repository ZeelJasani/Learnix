"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { api, getAuthToken } from "@/lib/api-client";
import { ApiResponse } from "@/lib/types";
import { lessonSchema, lessonSchemaType } from "@/lib/zodSchemas";
import { revalidatePath } from "next/cache";

export async function updateLesson({
    lessonId,
    data,
    courseId,
}: {
    lessonId: string;
    data: lessonSchemaType;
    courseId: string;
}): Promise<ApiResponse> {
    try {
        await requireAdmin();

        // Validate the data
        const result = lessonSchema.safeParse(data);
        if (!result.success) {
            return {
                status: "error",
                message: "Invalid lesson data",
            };
        }

        const token = await getAuthToken();
        if (!token) {
            return { status: "error", message: "Authentication required" };
        }

        const response = await api.put(`/admin/lessons/${lessonId}`, {
            title: data.name,
            description: data.description || "",
            videoKey: data.videoKey || "",
            thumbnailKey: data.thumbnail || "",
        }, token);

        if (!response.success) {
            return {
                status: "error",
                message: response.message || "Failed to update lesson",
            };
        }

        revalidatePath(`/admin/courses/${courseId}/edit`);
        revalidatePath(`/admin/courses/${courseId}/${data.chapterId}/${lessonId}`);

        return {
            status: "success",
            message: "Lesson updated successfully",
        };
    } catch (error) {
        console.error("Error updating lesson:", error);
        return {
            status: "error",
            message: "Failed to update lesson",
        };
    }
}