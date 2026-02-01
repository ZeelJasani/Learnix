"use server";

import { requireAdminOrMentor } from "@/app/data/admin/require-admin";
import { ApiResponse } from "@/lib/types";
import { ChapterSchemaType, CourseSchemaType, chapterSchema, courseSchema, lessonSchema } from "@/lib/zodSchemas";
import { api, getAuthToken } from "@/lib/api-client";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcjet
    .withRule(
        detectBot({
            mode: "LIVE",
            allow: [],
        })
    ).withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 2,
        })
    );


export async function editCourse(data: CourseSchemaType, courseId: string): Promise<ApiResponse> {
    try {
        const user = await requireAdminOrMentor(true);
        const req = await request();
        const decision = await aj.protect(req, {
            fingerprint: user.user.id,
        });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return {
                    status: "error",
                    message: "you have been blocked due to rate limit"
                };
            } else {
                return {
                    status: 'error',
                    message: 'Bot detected'
                };
            }
        }

        const result = courseSchema.safeParse(data);
        if (!result.success) {
            return {
                status: "error",
                message: "invalid data",
            }
        }

        const token = await getAuthToken();
        if (!token) {
            return { status: "error", message: "Authentication required" };
        }

        const response = await api.put(`/admin/courses/${courseId}`, data, token);

        if (!response.success) {
            return {
                status: "error",
                message: response.message || "Failed to update course",
            };
        }

        return {
            status: "success",
            message: "Course updated successfully",
        };
    } catch {
        return {
            status: "error",
            message: "Failed to update course",
        };
    }
}

export async function reorderLesson(
    chapterId: string,
    lessons: { id: string; position: number }[],
    courseId: string
): Promise<ApiResponse> {
    await requireAdminOrMentor(true);
    try {
        if (!lessons || lessons.length === 0) {
            return {
                status: "error",
                message: "No lessons provided for reordering"
            };
        }

        const token = await getAuthToken();
        if (!token) {
            return { status: "error", message: "Authentication required" };
        }

        const response = await api.put('/admin/lessons/reorder', {
            chapterId,
            items: lessons.map(l => ({ id: l.id, position: l.position }))
        }, token);

        if (!response.success) {
            return {
                status: "error",
                message: response.message || "Failed to reorder lessons"
            };
        }

        revalidatePath(`/admin/courses/${courseId}/edit`);
        revalidatePath(`/mentor/courses/${courseId}/edit`);

        return {
            status: "success",
            message: "Lessons reordered successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Failed to reorder lessons"
        }
    }
}


export async function reorderChapters(
    courseId: string,
    chapters: { id: string; position: number }[]
): Promise<ApiResponse> {
    await requireAdminOrMentor(true);
    try {
        if (!chapters || chapters.length === 0) {
            return {
                status: "error",
                message: "No chapters provided"
            };
        }

        const token = await getAuthToken();
        if (!token) {
            return { status: "error", message: "Authentication required" };
        }

        const response = await api.put('/admin/chapters/reorder', {
            courseId,
            items: chapters.map(c => ({ id: c.id, position: c.position }))
        }, token);

        if (!response.success) {
            return {
                status: "error",
                message: response.message || "Failed to reorder chapters"
            };
        }

        revalidatePath(`/admin/courses/${courseId}/edit`);
        revalidatePath(`/mentor/courses/${courseId}/edit`);

        return {
            status: "success",
            message: "Chapters reordered successfully"
        }

    } catch {
        return {
            status: "error",
            message: "Failed to reorder chapters"
        }
    }
}


export async function createChapter(values: ChapterSchemaType): Promise<ApiResponse> {
    try {
        await requireAdminOrMentor(true);

        const validatedFields = chapterSchema.safeParse(values);

        if (!validatedFields.success) {
            return {
                status: "error",
                message: "Invalid data",
            };
        }

        const token = await getAuthToken();
        if (!token) {
            return { status: "error", message: "Authentication required" };
        }

        const response = await api.post('/admin/chapters', {
            name: values.name,
            courseId: values.courseId,
        }, token);

        if (!response.success) {
            console.error("createChapter API failed:", response);
            return { status: "error", message: response.message || "Failed to create chapter" };
        }

        revalidatePath(`/admin/courses/${values.courseId}/edit`);
        revalidatePath(`/mentor/courses/${values.courseId}/edit`);
        return { status: "success", message: "Chapter created successfully" };
    } catch (error) {
        console.error("Error in createChapter:", error);
        return { status: "error", message: "Failed to create chapter" };
    }
}


export async function createLesson(values: { name: string; courseId: string; chapterId: string }): Promise<ApiResponse> {
    try {
        await requireAdminOrMentor(true);

        const validatedFields = lessonSchema.safeParse(values);

        if (!validatedFields.success) {
            return {
                status: "error",
                message: "Invalid data",
            };
        }

        const token = await getAuthToken();
        if (!token) {
            return { status: "error", message: "Authentication required" };
        }

        const response = await api.post('/admin/lessons', {
            name: values.name,
            chapterId: values.chapterId,
            courseId: values.courseId,
        }, token);

        if (!response.success) {
            return { status: "error", message: response.message || "Failed to create lesson" };
        }

        revalidatePath(`/admin/courses/${values.courseId}/edit`);
        revalidatePath(`/mentor/courses/${values.courseId}/edit`);
        return { status: "success", message: "Lesson created successfully" };
    } catch (error) {
        console.error("Error:", error);
        return { status: "error", message: "Failed to create lesson" };
    }
}


export async function deleteLesson({
    chapterId,
    courseId,
    lessonId,
}: {
    chapterId: string;
    courseId: string;
    lessonId: string
}): Promise<ApiResponse> {
    await requireAdminOrMentor(true);

    try {
        const token = await getAuthToken();
        if (!token) {
            return { status: "error", message: "Authentication required" };
        }

        const response = await api.delete(`/admin/lessons/${lessonId}`, token);

        if (!response.success) {
            return {
                status: "error",
                message: response.message || "Failed to delete lesson"
            };
        }

        revalidatePath(`/admin/courses/${courseId}/edit`);
        revalidatePath(`/mentor/courses/${courseId}/edit`);

        return {
            status: "success",
            message: "Lesson deleted successfully"
        };

    } catch {
        return {
            status: "error",
            message: "Failed to delete lesson"
        }
    }
}


export async function deleteChapter({
    chapterId,
    courseId,
}: {
    chapterId: string;
    courseId: string;
}): Promise<ApiResponse> {
    await requireAdminOrMentor(true);

    try {
        const token = await getAuthToken();
        if (!token) {
            return { status: "error", message: "Authentication required" };
        }

        const response = await api.delete(`/admin/chapters/${chapterId}`, token);

        if (!response.success) {
            return {
                status: "error",
                message: response.message || "Failed to delete chapter"
            };
        }

        revalidatePath(`/admin/courses/${courseId}/edit`);
        revalidatePath(`/mentor/courses/${courseId}/edit`);

        return {
            status: "success",
            message: "Chapter deleted successfully"
        };

    } catch (error) {
        console.error('Error deleting chapter:', error);
        return {
            status: "error",
            message: "Failed to delete chapter"
        };
    }
}
