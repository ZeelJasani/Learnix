import { Response, NextFunction } from 'express';
import { UserRequest } from '../middleware/requireUser';
import { ActivityService } from '../services/activity.service';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';

export class ActivityController {
    /**
     * Get activities for enrolled courses
     */
    static async getForUser(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const activities = await ActivityService.getForUser(userId);
            ApiResponse.success(res, activities);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get activities for a course (admin)
     */
    static async getByCourseId(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { courseId } = req.params;
            const activities = await ActivityService.getByCourseId(courseId);
            ApiResponse.success(res, activities);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Create activity (admin)
     */
    static async create(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log('[ActivityController] Create request received:', req.body);
            const { title, courseId, type } = req.body;

            if (!title || !courseId) {
                throw new Error("Missing required fields: title or courseId");
            }

            console.log(`[ActivityController] Creating activity '${title}' for course '${courseId}'`);

            const activity = await ActivityService.create(req.body);
            console.log('[ActivityController] Activity created successfully:', activity._id);
            ApiResponse.created(res, activity);
        } catch (error) {
            console.error('[ActivityController] Creation failed:', error);
            next(error);
        }
    }

    /**
     * Update activity (admin)
     */
    static async update(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const activity = await ActivityService.update(id, req.body);

            if (!activity) {
                throw ApiError.notFound('Activity not found');
            }

            ApiResponse.success(res, activity);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete activity (admin)
     */
    static async delete(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const deleted = await ActivityService.delete(id);

            if (!deleted) {
                throw ApiError.notFound('Activity not found');
            }

            ApiResponse.success(res, { deleted: true });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Mark activity as complete
     */
    static async complete(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { id } = req.params;

            const completion = await ActivityService.complete(id, userId);
            ApiResponse.success(res, completion);
        } catch (error) {
            next(error);
        }
    }
}
