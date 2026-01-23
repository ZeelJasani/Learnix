import { z } from 'zod';

export const activityTypes = ['ASSIGNMENT', 'QUIZ', 'PROJECT', 'READING', 'VIDEO'] as const;

export const createActivitySchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    type: z.enum(activityTypes).optional().default('ASSIGNMENT'),
    startDate: z.string().datetime().optional().nullable(),
    dueDate: z.string().datetime().optional().nullable(),
    courseId: z.string().min(1, 'Course ID is required'),
});

export const updateActivitySchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
    type: z.enum(activityTypes).optional(),
    startDate: z.string().datetime().optional().nullable(),
    dueDate: z.string().datetime().optional().nullable(),
});
