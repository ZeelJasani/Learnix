// ============================================================================
// Learnix LMS - Lesson Validation Schemas (લેસન વેલિડેશન સ્કીમા)
// ============================================================================
// Aa file lesson-related request data validate karvani Zod schemas define kare chhe.
// This file defines Zod schemas for validating lesson-related request data.
//
// Schemas:
// - createLessonSchema   → Navo lesson create karva mate / For creating a new lesson
// - updateLessonSchema   → Lesson update karva mate / For updating a lesson
// - reorderLessonsSchema → Lessons reorder karva mate / For reordering lessons
// ============================================================================

import { z } from 'zod';

// Navo lesson banavo - name, courseId, ane chapterId jaruri chhe
// Create new lesson - name, courseId, and chapterId are required
export const createLessonSchema = z.object({
    name: z.string(),
    courseId: z.string().min(1),
    chapterId: z.string().min(1),
});

// Lesson update karo - badha fields optional, null pan accept thay
// Update lesson - all fields optional, null values accepted
export const updateLessonSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional().nullable(),
    thumbnailKey: z.string().optional().nullable(),
    videoKey: z.string().optional().nullable(),
    position: z.number().optional(),
});

// Lessons no order badlo - chapterId ane items array jaruri
// Reorder lessons - chapterId and items array required
export const reorderLessonsSchema = z.object({
    chapterId: z.string(),
    items: z.array(
        z.object({
            id: z.string(),
            position: z.number(),
        })
    ),
});
