// ============================================================================
// Learnix LMS - Activity Validation Schemas (એક્ટિવિટી વેલિડેશન સ્કીમા)
// ============================================================================
// Aa file activity-related request data validate karvani Zod schemas define kare chhe.
// This file defines Zod schemas for validating activity-related request data.
//
// Schemas:
// - createActivitySchema → Navi activity create karva mate / For creating a new activity
// - updateActivitySchema → Activity update karva mate / For updating an activity
//
// Activity types: ASSIGNMENT | QUIZ | PROJECT | READING | VIDEO
// ============================================================================

import { z } from 'zod';

// Activity types / એક્ટિવિટી ટાઇપ્સ
export const activityTypes = ['ASSIGNMENT', 'QUIZ', 'PROJECT', 'READING', 'VIDEO'] as const;

// Navi activity banavo - title ane courseId jaruri, baki optional
// Create new activity - title and courseId required, rest optional
export const createActivitySchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    type: z.enum(activityTypes).optional().default('ASSIGNMENT'),
    startDate: z.string().datetime().optional().nullable(),
    dueDate: z.string().datetime().optional().nullable(),
    courseId: z.string().min(1, 'Course ID is required'),
});

// Activity update karo - badha fields optional
// Update activity - all fields optional
export const updateActivitySchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
    type: z.enum(activityTypes).optional(),
    startDate: z.string().datetime().optional().nullable(),
    dueDate: z.string().datetime().optional().nullable(),
});
