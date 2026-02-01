import { z } from 'zod';

// Simple validation - just check if fields exist
export const createChapterSchema = z.object({
    name: z.string(),
    courseId: z.string().min(1),
});

export const updateChapterSchema = z.object({
    title: z.string().optional(),
    position: z.number().optional(),
});

export const reorderChaptersSchema = z.object({
    courseId: z.string(),
    items: z.array(
        z.object({
            id: z.string(),
            position: z.number(),
        })
    ),
});
