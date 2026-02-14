// ============================================================================
// Learnix LMS - Chapter Validation Schemas (ચેપ્ટર વેલિડેશન સ્કીમા)
// ============================================================================
// Aa file chapter-related request data validate karvani Zod schemas define kare chhe.
// This file defines Zod schemas for validating chapter-related request data.
//
// Schemas:
// - createChapterSchema   → Navo chapter create karva mate / For creating a new chapter
// - updateChapterSchema   → Chapter update karva mate / For updating a chapter
// - reorderChaptersSchema → Chapters reorder karva mate / For reordering chapters
// ============================================================================

import { z } from 'zod';

// Navo chapter banavo - name ane courseId jaruri chhe
// Create new chapter - name and courseId are required
export const createChapterSchema = z.object({
    name: z.string(),
    courseId: z.string().min(1),
});

// Chapter update karo - badha fields optional
// Update chapter - all fields optional
export const updateChapterSchema = z.object({
    title: z.string().optional(),
    position: z.number().optional(),
});

// Chapters no order badlo - courseId ane items array jaruri
// Reorder chapters - courseId and items array required
export const reorderChaptersSchema = z.object({
    courseId: z.string(),
    items: z.array(
        z.object({
            id: z.string(),
            position: z.number(),
        })
    ),
});
