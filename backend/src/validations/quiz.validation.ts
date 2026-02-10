import { z } from 'zod';

// Question type enum
export const questionTypes = ['multiple_choice', 'true_false', 'fill_blank', 'one_choice_answer'] as const;

// Question schema based on type
export const questionSchema = z.object({
    type: z.enum(questionTypes),
    question: z.string().min(1, 'Question text is required'),
    options: z.array(z.string()).optional(),
    correctAnswer: z.union([z.string(), z.boolean()]),
    explanation: z.string().optional(),
    points: z.number().min(1, 'Points must be at least 1').default(1),
}).refine(
    (data) => {
        // Multiple choice and one choice answer must have options
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

// Create quiz schema
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

// Update quiz schema
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

// Submit quiz attempt schema
export const submitQuizSchema = z.object({
    answers: z.record(z.string(), z.any()),
    isAutoSubmitted: z.boolean().default(false),
});

// Type exports
export type CreateQuizInput = z.infer<typeof createQuizSchema>;
export type UpdateQuizInput = z.infer<typeof updateQuizSchema>;
export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;
export type QuestionInput = z.infer<typeof questionSchema>;
