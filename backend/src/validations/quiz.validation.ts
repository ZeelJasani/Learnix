// ============================================================================
// Learnix LMS - Quiz Validation Schemas (ક્વિઝ વેલિડેશન સ્કીમા)
// ============================================================================
// Aa file quiz-related request data validate karvani Zod schemas define kare chhe.
// This file defines Zod schemas for validating quiz-related request data.
//
// Schemas:
// - questionSchema      → Individual question validate karva mate
// - createQuizSchema    → Navo quiz create karva mate
// - updateQuizSchema    → Quiz update karva mate
// - submitQuizSchema    → Quiz attempt submit karva mate
//
// Question types: multiple_choice | true_false | fill_blank | one_choice_answer
// ============================================================================

import { z } from 'zod';

// Question type enum / પ્રશ્ન ટાઇપ enum
export const questionTypes = ['multiple_choice', 'true_false', 'fill_blank', 'one_choice_answer'] as const;

// Individual question validation schema / વ્યક્તિગત પ્રશ્ન validation schema
// Aa schema question type na aadhare different validations apply kare chhe:
// This schema applies different validations based on question type:
// - multiple_choice / one_choice_answer: options array jaruri (min 2)
// - true_false: correctAnswer boolean hovo joiye
// - fill_blank: correctAnswer string hovo joiye
export const questionSchema = z.object({
    type: z.enum(questionTypes),
    question: z.string().min(1, 'Question text is required'),
    options: z.array(z.string()).optional(),
    correctAnswer: z.union([z.string(), z.boolean()]),
    explanation: z.string().optional(),
    points: z.number().min(1, 'Points must be at least 1').default(1),
}).refine(
    (data) => {
        // Multiple choice ane one choice answer ma options jaruri chhe (min 2)
        // Multiple choice and one choice answer must have options (min 2)
        if (data.type === 'multiple_choice' || data.type === 'one_choice_answer') {
            return data.options && data.options.length >= 2;
        }
        return true;
    },
    {
        message: 'Multiple choice and one choice answer questions must have at least 2 options',
        path: ['options'],
    }
).refine(
    (data) => {
        // True/false ma boolean answer jaruri chhe
        // True/false must have boolean answer
        if (data.type === 'true_false') {
            return typeof data.correctAnswer === 'boolean';
        }
        return true;
    },
    {
        message: 'True/false questions must have a boolean answer',
        path: ['correctAnswer'],
    }
).refine(
    (data) => {
        // Fill blank ma string answer jaruri chhe
        // Fill blank must have string answer
        if (data.type === 'fill_blank') {
            return typeof data.correctAnswer === 'string';
        }
        return true;
    },
    {
        message: 'Fill in the blank questions must have a string answer',
        path: ['correctAnswer'],
    }
).refine(
    (data) => {
        // One choice answer ma string answer jaruri chhe
        // One choice answer must have string answer
        if (data.type === 'one_choice_answer') {
            return typeof data.correctAnswer === 'string';
        }
        return true;
    },
    {
        message: 'One choice answer questions must have a string answer',
        path: ['correctAnswer'],
    }
);

// Navo quiz create karva mate validation schema
// Validation schema for creating a new quiz
export const createQuizSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    description: z.string().optional().nullable(),
    courseId: z.string().min(1, 'Course ID is required'),
    questions: z.array(questionSchema).min(1, 'Quiz must have at least one question'),
    passingScore: z.number().min(0).max(100).default(70),
    timeLimit: z.number().min(1).optional().nullable(),
    allowedAttempts: z.number().min(0).default(0),
    shuffleQuestions: z.boolean().default(false),
    showCorrectAnswers: z.boolean().default(true),
    startDate: z.string().datetime().optional().nullable(),
    dueDate: z.string().datetime().optional().nullable(),
    isPublished: z.boolean().default(false),
});

// Quiz update mate partial schema (badha fields optional)
// Partial schema for quiz update (all fields optional)
export const updateQuizSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().optional().nullable(),
    questions: z.array(questionSchema).min(1).optional(),
    passingScore: z.number().min(0).max(100).optional(),
    timeLimit: z.number().min(1).optional().nullable(),
    allowedAttempts: z.number().min(0).optional(),
    shuffleQuestions: z.boolean().optional(),
    showCorrectAnswers: z.boolean().optional(),
    startDate: z.string().datetime().optional().nullable(),
    dueDate: z.string().datetime().optional().nullable(),
    isPublished: z.boolean().optional(),
});

// Quiz attempt submit mate validation schema
// Validation schema for submitting a quiz attempt
export const submitQuizSchema = z.object({
    // Answers map - question ID → user no answer
    // Answers map - question ID → user's answer
    answers: z.record(z.string(), z.any()),
    // Auto-submit flag (time limit expire thay tyare)
    // Auto-submit flag (when time limit expires)
    isAutoSubmitted: z.boolean().default(false),
});

// TypeScript type exports - schemas thi infer thayela types
// TypeScript type exports - types inferred from schemas
export type CreateQuizInput = z.infer<typeof createQuizSchema>;
export type UpdateQuizInput = z.infer<typeof updateQuizSchema>;
export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;
export type QuestionInput = z.infer<typeof questionSchema>;
