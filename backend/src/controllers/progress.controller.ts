// ============================================================================
// Learnix LMS - Progress Controller (પ્રોગ્રેસ કંટ્રોલર)
// ============================================================================
// Aa controller user progress-related HTTP requests handle kare chhe.
// This controller handles user progress-related HTTP requests.
//
// જવાબદારીઓ / Responsibilities:
// - Lesson ne complete/incomplete mark karvanu (લેસન complete/incomplete)
// - Course progress retrieval (કોર્સ પ્રોગ્રેસ જોવો)
// - Course progress reset (કોર્સ પ્રોગ્રેસ રીસેટ)
// ============================================================================

import { Response, NextFunction } from 'express';
import { UserRequest } from '../middleware/requireUser';
import { ProgressService } from '../services/progress.service';
import { ApiResponse } from '../utils/apiResponse';

/**
 * ProgressController - પ્રોગ્રેસ સંબંધિત API endpoints
 * ProgressController - Progress-related API endpoints
 *
 * User na lesson-level ane course-level progress manage kare chhe.
 * Manages user's lesson-level and course-level progress.
 */
export class ProgressController {
    /**
     * Lesson ne complete mark karo / Mark lesson as complete
     *
     * completed=false moklo to incomplete thay chhe (toggle behavior).
     * Send completed=false to mark as incomplete (toggle behavior).
     *
     * @route POST /api/progress/lesson/:lessonId
     */
    static async markLessonComplete(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { lessonId } = req.params;
            // Body mathi completed flag kadho, default true / Extract completed flag from body, default true
            const { completed } = req.body;

            const progress = await ProgressService.markLessonComplete(
                userId,
                lessonId,
                completed !== false
            );

            ApiResponse.success(res, progress);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Course no overall progress kadho / Get course progress
     *
     * Chapter-wise breakdown sathe overall percentage return kare chhe.
     * Returns overall percentage with chapter-wise breakdown.
     *
     * @route GET /api/progress/course/:courseId
     */
    static async getCourseProgress(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { courseId } = req.params;

            const progress = await ProgressService.getCourseProgress(userId, courseId);
            ApiResponse.success(res, progress);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Course no progress reset karo / Reset course progress
     *
     * Course na badha lesson progress records delete kare chhe.
     * Deletes all lesson progress records for the course.
     *
     * @route DELETE /api/progress/course/:courseId
     */
    static async resetCourseProgress(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { courseId } = req.params;

            // Progress reset karo ane deleted count return karo / Reset progress and return deleted count
            const deletedCount = await ProgressService.resetCourseProgress(userId, courseId);
            ApiResponse.success(res, { reset: true, deletedCount });
        } catch (error) {
            next(error);
        }
    }
}
