import { z } from 'zod';

export const createLessonSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    courseId: z.string().min(1, 'Course ID is required'),
    chapterId: z.string().min(1, 'Chapter ID is required'),
    description: z.string().min(3).optional(),
    thumbnail: z.string().optional(),
    videoKey: z.string().optional(),
});

export const updateLessonSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').optional(),
    description: z.string().optional().nullable(),
    thumbnailKey: z.string().optional().nullable(),
    videoKey: z.string().optional().nullable(),
    position: z.number().min(0).optional(),
});

export const reorderLessonsSchema = z.object({
    chapterId: z.string().min(1, 'Chapter ID is required'),
    items: z.array(
        z.object({
            id: z.string().min(1, 'Lesson ID is required'),
            position: z.number().min(0),
        })
    ),
});
