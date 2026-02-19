// ============================================================================
// Learnix LMS - Quiz Controller (ક્વિઝ કંટ્રોલર)
// ============================================================================
// Aa controller quiz-related HTTP requests handle kare chhe.
// This controller handles quiz-related HTTP requests.
//
// જવાબદારીઓ / Responsibilities:
// - Quiz CRUD operations (ક્વિઝ CRUD ઑપરેશન્સ)
// - Quiz attempt management (ક્વિઝ attempt મેનેજમેન્ટ)
// - Quiz eligibility checking (ક્વિઝ eligibility check)
// - Attempt history retrieval (Attempt ઇતિહાસ)
// - Quiz statistics (ક્વિઝ statistics)
// - Input validation via Zod schemas (Zod schemas થી validation)
// ============================================================================

import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { UserRequest } from '../middleware/requireUser';
import { QuizService } from '../services/quiz.service';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
// Validation schemas import karo - single source of truth
// Import validation schemas - single source of truth
import { createQuizSchema, updateQuizSchema, submitQuizSchema } from '../validations/quiz.validation';

/**
 * QuizController - ક્વિઝ સંબંધિત API endpoints
 * QuizController - Quiz-related API endpoints
 *
 * Quiz lifecycle manage kare chhe - create, attempt, score, statistics.
 * Manages quiz lifecycle - create, attempt, score, statistics.
 */
export class QuizController {
    /**
     * Navi quiz create karo / Create a new quiz
     *
     * Zod schema thi input validate kare chhe pachi QuizService ne delegate kare chhe.
     * Validates input with Zod schema then delegates to QuizService.
     *
     * @route POST /api/quizzes
     */
    static async create(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            // Input validate karo Zod schema thi / Validate input with Zod schema
            const data = createQuizSchema.parse(req.body);
            const quiz = await QuizService.createQuiz(data, req.user!.id);
            ApiResponse.created(res, quiz);
        } catch (error) {
            // Zod validation error handle karo / Handle Zod validation error
            if (error instanceof z.ZodError) {
                throw ApiError.badRequest(error.errors[0].message);
            }
            next(error);
        }
    }

    /**
     * Quiz update karo / Update a quiz
     *
     * Partial data accept kare chhe - faqat moklelaa fields update thay chhe.
     * Accepts partial data - only sent fields are updated.
     *
     * @route PUT /api/quizzes/:id
     */
    static async update(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            // Partial validation karo / Validate partial data
            const data = updateQuizSchema.parse(req.body);
            const quiz = await QuizService.updateQuiz(id, data, req.user!.id);

            // Quiz na male to 404 / 404 if quiz not found
            if (!quiz) {
                throw ApiError.notFound('Quiz not found');
            }

            ApiResponse.success(res, quiz);
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw ApiError.badRequest(error.errors[0].message);
            }
            next(error);
        }
    }

    /**
     * Quiz delete karo / Delete a quiz
     *
     * Quiz ane associated attempts badha delete thay chhe.
     * Quiz and all associated attempts are deleted.
     *
     * @route DELETE /api/quizzes/:id
     */
    static async deleteQuiz(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            // Quiz delete karo - service error throw kare chhe jo na male to
            // Delete quiz - service throws error if not found
            await QuizService.deleteQuiz(id, req.user!.id);

            ApiResponse.success(res, { deleted: true });
        } catch (error) {
            next(error);
        }
    }

    /**
     * ID dwara quiz kadho / Get quiz by ID
     *
     * Quiz details ane questions return kare chhe.
     * Returns quiz details and questions.
     *
     * @route GET /api/quizzes/:id
     */
    static async getById(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const quiz = await QuizService.getQuizById(id);

            // Quiz na male to 404 / 404 if quiz not found
            if (!quiz) {
                throw ApiError.notFound('Quiz not found');
            }

            ApiResponse.success(res, quiz);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Quiz taking mate kadho (correct answers vagar)
     * Get quiz for taking (without correct answers)
     *
     * Students mate - correct answers strip kare chhe.
     * For students - strips correct answers from response.
     *
     * @route GET /api/quizzes/:id/for-taking
     */
    static async getForTaking(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user!.id;
            const quiz = await QuizService.getQuizForTaking(id, userId);

            if (!quiz) {
                throw ApiError.notFound('Quiz not found');
            }

            ApiResponse.success(res, quiz);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Course ni quizzes kadho / Get quizzes for a course
     *
     * Course ID dwara badha quiz records return kare chhe.
     * Returns all quiz records by course ID.
     *
     * @route GET /api/quizzes/course/:courseId
     */
    static async getByCourseId(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { courseId } = req.params;
            const quizzes = await QuizService.getQuizzesByCourse(courseId);
            ApiResponse.success(res, quizzes);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Navo quiz attempt start karo / Start a new quiz attempt
     *
     * @route POST /api/quizzes/:id/start
     */
    static async startAttempt(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user!.id;
            const attempt = await QuizService.startQuizAttempt(id, userId);
            ApiResponse.created(res, attempt);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Quiz attempt submit karo / Submit a quiz attempt
     *
     * Answers validate thay chhe ane auto-grade thay chhe.
     * Answers are validated and auto-graded.
     *
     * @route POST /api/quizzes/:id/attempt
     */
    static async submitAttempt(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user!.id;
            // Attempt data validate karo / Validate attempt data
            const data = submitQuizSchema.parse(req.body);

            // Attempt submit ane grade karo / Submit and grade attempt
            const attempt = await QuizService.submitQuizAttempt(id, userId, data);
            ApiResponse.created(res, attempt);
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw ApiError.badRequest(error.errors[0].message);
            }
            next(error);
        }
    }

    /**
     * Attempt ID dwara quiz submit karo / Submit quiz by attempt ID
     *
     * Frontend pattern: POST /api/quizzes/attempts/:attemptId/submit
     *
     * @route POST /api/quizzes/attempts/:attemptId/submit
     */
    static async submitAttemptById(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { attemptId } = req.params;
            const userId = req.user!.id;
            const data = submitQuizSchema.parse(req.body);

            const attempt = await QuizService.submitQuizAttempt(attemptId, userId, data);
            ApiResponse.created(res, attempt);
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw ApiError.badRequest(error.errors[0].message);
            }
            next(error);
        }
    }

    /**
     * Specific attempt kadho / Get a specific attempt by ID
     *
     * @route GET /api/quizzes/attempts/:attemptId
     */
    static async getAttemptById(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { attemptId } = req.params;
            const userId = req.user!.id;
            const attempt = await QuizService.getAttemptById(attemptId, userId);

            if (!attempt) {
                throw ApiError.notFound('Attempt not found');
            }

            ApiResponse.success(res, attempt);
        } catch (error) {
            next(error);
        }
    }

    /**
     * User quiz mate eligible chhe ke nahi check karo / Check if user is eligible for quiz
     *
     * Max attempts ane cooldown period check kare chhe.
     * Checks max attempts and cooldown period.
     *
     * @route GET /api/quizzes/:id/can-attempt
     */
    static async canAttempt(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user!.id;

            // Eligibility check karo / Check eligibility
            const result = await QuizService.canUserTakeQuiz(id, userId);
            ApiResponse.success(res, result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * User no quiz attempt history kadho / Get user's quiz attempt history
     *
     * Best score ane attempt list return kare chhe.
     * Returns best score and attempt list.
     *
     * @route GET /api/quizzes/:id/attempts
     */
    static async getAttemptHistory(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user!.id;

            // Attempt history kadho / Get attempt history
            const history = await QuizService.getAttemptHistory(id, userId);
            ApiResponse.success(res, history);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Quiz na statistics kadho (Admin/Mentor) / Get quiz statistics (Admin/Mentor)
     *
     * Total attempts, average score, pass rate jevi stats return kare chhe.
     * Returns stats like total attempts, average score, pass rate.
     *
     * @route GET /api/quizzes/:id/stats
     */
    static async getStats(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            // Statistics generate karo / Generate statistics
            const stats = await QuizService.getQuizStatistics(id);
            ApiResponse.success(res, stats);
        } catch (error) {
            next(error);
        }
    }
}
