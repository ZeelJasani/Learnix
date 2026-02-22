// ============================================================================
// Learnix LMS - Activity Controller (એક્ટિવિટી કંટ્રોલર)
// ============================================================================
// Aa controller activity-related HTTP requests handle kare chhe.
// This controller handles activity-related HTTP requests.
//
// જવાબદારીઓ / Responsibilities:
// - Enrolled user mate activities listing (એનરોલ્ડ યુઝર માટે activities)
// - Course-level activities listing for admin (એડમિન માટે course activities)
// - Activity CRUD operations (એક્ટિવિટી CRUD ઑપરેશન્સ)
// - Activity completion marking (એક્ટિવિટી completion)
//
// 🔒 Security Fix: console.log/error → logger.debug/error
// ============================================================================

import { Response, NextFunction } from 'express';
import { UserRequest } from '../middleware/requireUser';
import { ActivityService } from '../services/activity.service';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';
import { OwnershipService } from '../utils/ownership';

/**
 * ActivityController - એક્ટિવિટી સંબંધિત API endpoints
 * ActivityController - Activity-related API endpoints
 *
 * Course activities manage kare chhe - assignments, quizzes, projects jevi activities.
 * Manages course activities - activities like assignments, quizzes, projects.
 */
export class ActivityController {
    /**
     * Enrolled courses ni activities kadho / Get activities for enrolled courses
     *
     * User na enrolled courses ni activities return kare chhe.
     * Returns activities from user's enrolled courses.
     *
     * @route GET /api/activities/my
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
     * Course ni activities kadho (Admin) / Get activities for a course (Admin)
     *
     * Course ID dwara badha activity records return kare chhe.
     * Returns all activity records by course ID.
     *
     * @route GET /api/activities/course/:courseId
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
     * Badhi activities kadho (Admin) / Get all activities (Admin)
     *
     * System ni badhi activities return kare chhe.
     * Returns all activities in the system.
     *
     * @route GET /api/admin/activities
     */
    static async getAll(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const activities = await ActivityService.getAll();
            ApiResponse.success(res, { activities });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Navi activity create karo (Admin) / Create a new activity (Admin)
     *
     * Title ane courseId required chhe. Type optional chhe.
     * Title and courseId are required. Type is optional.
     *
     * @route POST /api/activities
     */
    static async create(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            // Request data log karo / Log request data
            logger.debug('[ActivityController] Create request received:', JSON.stringify(req.body));
            const { title, courseId, type } = req.body;

            // Required fields validate karo / Validate required fields
            if (!title || !courseId) {
                throw new Error("Missing required fields: title or courseId");
            }

            await OwnershipService.verifyCourseOwnership(courseId, req.user!.id, req.user!.role);

            logger.debug(`[ActivityController] Creating activity '${title}' for course '${courseId}'`);

            // Activity create karo / Create the activity
            const activity = await ActivityService.create(req.body);

            // Success log karo / Log success
            logger.debug(`[ActivityController] Activity created successfully: ${activity._id}`);
            ApiResponse.created(res, activity);
        } catch (error) {
            // Error log karo / Log the error
            logger.error('[ActivityController] Creation failed:', error);
            next(error);
        }
    }

    /**
     * Activity update karo (Admin) / Update an activity (Admin)
     *
     * ID dwara activity shodhine update kare chhe.
     * Finds activity by ID and updates it.
     *
     * @route PUT /api/activities/:id
     */
    static async update(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            await OwnershipService.verifyActivityOwnership(id, req.user!.id, req.user!.role);
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
     * Activity delete karo (Admin) / Delete an activity (Admin)
     *
     * Activity ane associated completions delete thay chhe.
     * Activity and associated completions are deleted.
     *
     * @route DELETE /api/activities/:id
     */
    static async delete(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            await OwnershipService.verifyActivityOwnership(id, req.user!.id, req.user!.role);
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
     * Activity ne complete mark karo / Mark activity as complete
     *
     * User ID ane activity ID dwara completion record create kare chhe.
     * Creates a completion record with user ID and activity ID.
     *
     * @route POST /api/activities/:id/complete
     */
    static async complete(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { id } = req.params;

            // Activity complete karo / Complete the activity
            const completion = await ActivityService.complete(id, userId);
            ApiResponse.success(res, completion);
        } catch (error) {
            next(error);
        }
    }
}
