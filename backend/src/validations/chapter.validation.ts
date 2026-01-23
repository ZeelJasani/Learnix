import { z } from 'zod';

export const createChapterSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    courseId: z.string().uuid('Invalid course ID'),
});

export const updateChapterSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').optional(),
    position: z.number().min(0).optional(),
});

export const reorderChaptersSchema = z.object({
    courseId: z.string().min(1, 'Course ID is required'),
    items: z.array(
        z.object({
            id: z.string().min(1, 'Chapter ID is required'),
            position: z.number().min(0),
        })
    ),
});
