// ============================================================================
// Learnix LMS - Quiz API Client (ક્વિઝ API ક્લાયન્ટ)
// ============================================================================
// Aa file quiz-related badha API calls handle kare chhe.
// This file handles all quiz-related API calls.
//
// Features / વિશેષતાઓ:
// - Quiz CRUD operations (create, update, delete, get)
// - Quiz attempt management (start, submit, history)
// - Quiz eligibility check (canTakeQuiz)
// - Quiz statistics retrieval
//
// Badha methods static chhe ane api-client through backend call kare chhe.
// All methods are static and call the backend through api-client.
// ============================================================================

import { api } from './api-client';

// ============================================================================
// Type Definitions (ટાઇપ ડેફિનિશન્સ)
// ============================================================================

// Quiz ma ek question no type / Type for a single question in a quiz
export interface Question {
    _id?: string;
    type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'one_choice_answer';
    question: string;
    options?: string[];
    correctAnswer?: string | boolean;
    explanation?: string;
    points: number;
}

// Complete quiz object no type / Type for complete quiz object
export interface Quiz {
    _id: string;
    title: string;
    description: string | null;
    courseId: string;
    questions: Question[];
    passingScore: number;
    timeLimit: number | null;
    allowedAttempts: number;
    shuffleQuestions: boolean;
    showCorrectAnswers: boolean;
    startDate: Date | null;
    dueDate: Date | null;
    isPublished: boolean;
    createdBy: string;
    totalPoints?: number;
    createdAt: Date;
    updatedAt: Date;
}

// Quiz attempt (user e quiz aapyo) no type / Type for quiz attempt
export interface QuizAttempt {
    _id: string;
    userId: string;
    quizId: string;
    answers: Record<string, string | string[] | boolean>;
    results: QuestionResult[];
    score: number;
    totalPoints: number;
    percentage: number;
    passed: boolean;
    attemptNumber: number;
    startedAt: Date;
    completedAt: Date | null;
    timeTaken: number | null;
    isAutoSubmitted: boolean;
}

// Ek question na result no type / Type for a single question result
export interface QuestionResult {
    questionId: string;
    userAnswer: string | string[] | boolean;
    correctAnswer: string | string[] | boolean;
    isCorrect: boolean;
    points: number;
    maxPoints: number;
}

// Quiz statistics no type / Type for quiz statistics
export interface QuizStatistics {
    totalAttempts: number;
    uniqueStudents: number;
    averageScore: number;
    averagePercentage: number;
    passRate: number;
    highestScore: number;
    lowestScore: number;
}

// Quiz attempt eligibility response no type / Type for quiz eligibility response
export interface CanTakeQuizResponse {
    allowed: boolean;
    reason?: string;
    attemptCount: number;
}

// ============================================================================
// Quiz API Class (ક્વિઝ API ક્લાસ)
// ============================================================================

export class QuizAPI {
    /**
     * Navi quiz create karo (Admin/Instructor) / Create a new quiz (Admin/Instructor)
     */
    static async createQuiz(quizData: Partial<Quiz>, token: string) {
        return api.post<Quiz>('/quizzes', quizData, token);
    }

    /**
     * Quiz update karo (Admin/Instructor) / Update a quiz (Admin/Instructor)
     */
    static async updateQuiz(quizId: string, quizData: Partial<Quiz>, token: string) {
        return api.put<Quiz>(`/quizzes/${quizId}`, quizData, token);
    }

    /**
     * Quiz delete karo (Admin/Instructor) / Delete a quiz (Admin/Instructor)
     */
    static async deleteQuiz(quizId: string, token: string) {
        return api.delete<{ deleted: boolean }>(`/quizzes/${quizId}`, token);
    }

    /**
     * ID par quiz melavo / Get quiz by ID
     */
    static async getQuizById(quizId: string, token: string) {
        return api.get<Quiz>(`/quizzes/${quizId}`, token);
    }

    /**
     * Quiz taking mate get karo (correct answers vagar)
     * Get quiz for taking (without correct answers)
     */
    static async getQuizForTaking(quizId: string, token: string) {
        return api.get<Quiz>(`/quizzes/${quizId}/for-taking`, token);
    }

    /**
     * Course ni badhi quizzes melavo / Get all quizzes for a course
     */
    static async getQuizzesByCourse(courseId: string, token: string) {
        return api.get<Quiz[]>(`/quizzes/course/${courseId}`, token);
    }

    /**
     * User quiz aapi shake ke nahi te check karo / Check if user can take a quiz
     */
    static async canTakeQuiz(quizId: string, token: string) {
        return api.get<CanTakeQuizResponse>(`/quizzes/${quizId}/can-take`, token);
    }

    /**
     * Navo quiz attempt start karo / Start a new quiz attempt
     */
    static async startQuizAttempt(quizId: string, token: string) {
        return api.post<QuizAttempt>(`/quizzes/${quizId}/start`, {}, token);
    }

    /**
     * Quiz attempt submit karo / Submit a quiz attempt
     */
    static async submitQuizAttempt(
        attemptId: string,
        answers: Record<string, string | string[] | boolean>,
        isAutoSubmitted: boolean,
        token: string
    ) {
        return api.post<QuizAttempt>(
            `/quizzes/attempts/${attemptId}/submit`,
            { answers, isAutoSubmitted },
            token
        );
    }

    /**
     * User ni attempt history melavo / Get user's attempt history for a quiz
     */
    static async getAttemptHistory(quizId: string, token: string) {
        return api.get<QuizAttempt[]>(`/quizzes/${quizId}/attempts`, token);
    }

    /**
     * Specific attempt melavo / Get a specific attempt
     */
    static async getAttempt(attemptId: string, token: string) {
        return api.get<QuizAttempt>(`/quizzes/attempts/${attemptId}`, token);
    }

    /**
     * Quiz na statistics melavo (Admin/Instructor)
     * Get quiz statistics (Admin/Instructor)
     */
    static async getQuizStatistics(quizId: string, token: string) {
        return api.get<QuizStatistics>(`/quizzes/${quizId}/statistics`, token);
    }
}
