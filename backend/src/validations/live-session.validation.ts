// ============================================================================
// Learnix LMS - Live Session Validation Schema (લાઇવ સેશન વેલિડેશન સ્કીમા)
// ============================================================================
// Aa file live session create request validate karvani Zod schema define kare chhe.
// This file defines a Zod schema for validating live session create requests.
//
// Schema:
// - createLiveSessionSchema → Navo live session create karva mate
//                             For creating a new live session
//
// Note: startsAt ISO 8601 datetime format ma hovu joiye
// Note: startsAt must be in ISO 8601 datetime format
// ============================================================================

import { z } from 'zod';

// Navo live session create karva mate validation
// Validation for creating a new live session
export const createLiveSessionSchema = z.object({
    // Course ID ya slug - session kaya course mate chhe te identify karva
    // Course ID or slug - identifies which course the session is for
    courseIdOrSlug: z.string().min(1, 'Course ID or slug is required'),

    // Session title - 3-120 characters
    title: z.string().min(3, 'Title must be at least 3 characters').max(120, 'Title is too long'),

    // Optional description / Optional description
    description: z.string().optional(),

    // Session start time - valid datetime string jaruri
    // Session start time - must be a valid datetime string
    startsAt: z.string().min(1, 'Start time is required').refine((value) => !Number.isNaN(Date.parse(value)), {
        message: 'Invalid start time',
    }),

    // Session duration minutes ma (optional)
    // Session duration in minutes (optional)
    durationMinutes: z.number().int().positive().optional(),
});
