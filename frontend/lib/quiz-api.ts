/**
 * Quiz API Client
 * Handles all quiz-related API calls
 */

import { api, getAuthToken } from './api-client';

export interface Question {
    _id?: string;
    type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'one_choice_answer';
    question: string;
    options?: string[];
    correctAnswer?: string | boolean;
    explanation?: string;
    points: number;
}

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

export interface QuizAttempt {
    _id: string;
    userId: string;
    quizId: string;
    answers: Record<string, any>;
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

export interface QuestionResult {
    questionId: string;
    userAnswer: any;
    correctAnswer: any;
    isCorrect: boolean;
    points: number;
    maxPoints: number;
}

export interface QuizStatistics {
    totalAttempts: number;
    uniqueStudents: number;
    averageScore: number;
    averagePercentage: number;
    passRate: number;
    highestScore: number;
    lowestScore: number;
}

export interface CanTakeQuizResponse {
    allowed: boolean;
    reason?: string;
    attemptCount: number;
}

export class QuizAPI {
    /**
     * Create a new quiz (Admin/Instructor)
     */
    static async createQuiz(quizData: Partial<Quiz>, token: string) {
        return api.post<Quiz>('/quizzes', quizData, token);
    }

    /**
     * Update a quiz (Admin/Instructor)
     */
    static async updateQuiz(quizId: string, quizData: Partial<Quiz>, token: string) {
        return api.put<Quiz>(`/quizzes/${quizId}`, quizData, token);
    }

    /**
     * Delete a quiz (Admin/Instructor)
     */
    static async deleteQuiz(quizId: string, token: string) {
        return api.delete<{ deleted: boolean }>(`/quizzes/${quizId}`, token);
    }

    /**
     * Get quiz by ID
     */
    static async getQuizById(quizId: string, token: string) {
        return api.get<Quiz>(`/quizzes/${quizId}`, token);
    }

    /**
     * Get quiz for taking (without correct answers)
     */
    static async getQuizForTaking(quizId: string, token: string) {
        return api.get<Quiz>(`/quizzes/${quizId}/for-taking`, token);
    }

    /**
     * Get all quizzes for a course
     */
    static async getQuizzesByCourse(courseId: string, token: string) {
        return api.get<Quiz[]>(`/quizzes/course/${courseId}`, token);
    }

    /**
     * Check if user can take a quiz
     */
    static async canTakeQuiz(quizId: string, token: string) {
        return api.get<CanTakeQuizResponse>(`/quizzes/${quizId}/can-take`, token);
    }

    /**
     * Start a new quiz attempt
     */
    static async startQuizAttempt(quizId: string, token: string) {
        return api.post<QuizAttempt>(`/quizzes/${quizId}/start`, {}, token);
    }

    /**
     * Submit a quiz attempt
     */
    static async submitQuizAttempt(
        attemptId: string,
        answers: Record<string, any>,
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
     * Get user's attempt history for a quiz
     */
    static async getAttemptHistory(quizId: string, token: string) {
        return api.get<QuizAttempt[]>(`/quizzes/${quizId}/attempts`, token);
    }

    /**
     * Get a specific attempt
     */
    static async getAttempt(attemptId: string, token: string) {
        return api.get<QuizAttempt>(`/quizzes/attempts/${attemptId}`, token);
    }

    /**
     * Get quiz statistics (Admin/Instructor)
     */
    static async getQuizStatistics(quizId: string, token: string) {
        return api.get<QuizStatistics>(`/quizzes/${quizId}/statistics`, token);
    }
}
