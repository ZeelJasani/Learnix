import { z } from 'zod';

// Simple validation - just check if fields exist
export const createLessonSchema = z.object({
    name: z.string(),
    courseId: z.string().min(1),
    chapterId: z.string().min(1),
});

export const updateLessonSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional().nullable(),
    thumbnailKey: z.string().optional().nullable(),
    videoKey: z.string().optional().nullable(),
    position: z.number().optional(),
});

export const reorderLessonsSchema = z.object({
    chapterId: z.string(),
    items: z.array(
        z.object({
            id: z.string(),
            position: z.number(),
        })
    ),
});
