import { Response, NextFunction } from 'express';
import { UserRequest } from '../middleware/requireUser';
import { ProgressService } from '../services/progress.service';
import { ApiResponse } from '../utils/apiResponse';

export class ProgressController {
    /**
     * Mark lesson as complete
     */
    static async markLessonComplete(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { lessonId } = req.params;
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
     * Get course progress
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
     * Reset course progress
     */
    static async resetCourseProgress(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { courseId } = req.params;

            const deletedCount = await ProgressService.resetCourseProgress(userId, courseId);
            ApiResponse.success(res, { reset: true, deletedCount });
        } catch (error) {
            next(error);
        }
    }
}
