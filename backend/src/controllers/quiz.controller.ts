import { Response, NextFunction } from 'express';
import { UserRequest } from '../middleware/requireUser';
import { QuizService } from '../services/quiz.service';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import {
    createQuizSchema,
    updateQuizSchema,
    submitQuizSchema,
} from '../validations/quiz.validation';

export class QuizController {
    /**
     * Create a new quiz (Admin/Instructor)
     */
    static async create(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const validatedData = createQuizSchema.parse(req.body);
            const quiz = await QuizService.createQuiz(validatedData, userId);
            ApiResponse.created(res, quiz);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update a quiz (Admin/Instructor)
     */
    static async update(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { id } = req.params;
            const validatedData = updateQuizSchema.parse(req.body);
            const quiz = await QuizService.updateQuiz(id, validatedData, userId);
            ApiResponse.success(res, quiz);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete a quiz (Admin/Instructor)
     */
    static async delete(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { id } = req.params;
            await QuizService.deleteQuiz(id, userId);
            ApiResponse.success(res, { deleted: true });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get quiz by ID (with correct answers for admin, without for students)
     */
    static async getById(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            const { id } = req.params;
            const quiz = await QuizService.getQuizById(id, userId);
            ApiResponse.success(res, quiz);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get quiz for taking (without correct answers)
     */
    static async getForTaking(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { id } = req.params;
            const quiz = await QuizService.getQuizForTaking(id, userId);
            ApiResponse.success(res, quiz);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get all quizzes for a course
     */
    static async getByCourse(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { courseId } = req.params;
            const includeUnpublished = req.user?.role === 'admin' || req.user?.role === 'instructor';
            const quizzes = await QuizService.getQuizzesByCourse(courseId, includeUnpublished);
            ApiResponse.success(res, quizzes);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Start a new quiz attempt
     */
    static async startAttempt(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { id } = req.params;
            const attempt = await QuizService.startQuizAttempt(id, userId);
            ApiResponse.created(res, attempt);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Submit a quiz attempt
     */
    static async submitAttempt(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { attemptId } = req.params;
            const validatedData = submitQuizSchema.parse(req.body);
            const attempt = await QuizService.submitQuizAttempt(attemptId, userId, validatedData);
            ApiResponse.success(res, attempt);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get user's attempt history for a quiz
     */
    static async getAttemptHistory(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { id } = req.params;
            const attempts = await QuizService.getAttemptHistory(id, userId);
            ApiResponse.success(res, attempts);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get a specific attempt
     */
    static async getAttempt(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { attemptId } = req.params;
            const attempt = await QuizService.getAttemptById(attemptId, userId);
            ApiResponse.success(res, attempt);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Check if user can take a quiz
     */
    static async canTake(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { id } = req.params;
            const result = await QuizService.canUserTakeQuiz(id, userId);
            ApiResponse.success(res, result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get quiz statistics (Admin/Instructor)
     */
    static async getStatistics(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const stats = await QuizService.getQuizStatistics(id);
            ApiResponse.success(res, stats);
        } catch (error) {
            next(error);
        }
    }
}
