import { z } from 'zod';

console.log("!!! LOADING DEBUG VALIDATION SCHEMAS !!!");

export const debugChapterSchema = z.object({
    name: z.string(),
    courseId: z.string().optional().or(z.any()), // Extremely loose to prove it works
});

export const debugLessonSchema = z.object({
    name: z.string(),
    courseId: z.string().optional().or(z.any()),
    chapterId: z.string().optional().or(z.any()),
});
