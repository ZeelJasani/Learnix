import { Response, NextFunction, Request } from 'express';
import { UserRequest } from '../middleware/requireUser';
import { UserService } from '../services/user.service';
import { EnrollmentService } from '../services/enrollment.service';
import { ApiResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';

export class UserController {
    /**
     * Sync current user from Clerk to MongoDB
     * This endpoint receives user data from the frontend and syncs it to MongoDB
     */
    static async syncCurrentUser(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            // Get user data from request body (sent by frontend)
            const { clerkId, email, firstName, lastName, imageUrl } = req.body;

            // If body data is provided, sync using that
            if (clerkId && email) {
                const user = await UserService.syncFromClerkData({
                    id: clerkId,
                    emailAddresses: [{ emailAddress: email }],
                    firstName: firstName || null,
                    lastName: lastName || null,
                    imageUrl: imageUrl || '',
                });

                logger.info(`User synced from request body: ${user.email}`);
                ApiResponse.success(res, {
                    synced: true,
                    user: {
                        id: user._id.toString(),
                        clerkId: user.clerkId,
                        name: user.name,
                        email: user.email,
                        emailVerified: user.emailVerified,
                        image: user.image,
                        role: user.role,
                    },
                });
                return;
            }

            // Fallback: if req.user exists (from middleware), return it
            const user = req.user;
            if (!user) {
                ApiResponse.error(res, 'User not found', 404);
                return;
            }

            ApiResponse.success(res, { synced: true, user });
        } catch (error) {
            logger.error('Error syncing user:', error);
            next(error);
        }
    }

    /**
     * Get current user profile
     */
    static async getProfile(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user;
            ApiResponse.success(res, user);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get enrolled courses for current user
     */
    static async getEnrolledCourses(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req.user as any)._id?.toString() || req.user!.id;
            const courses = await EnrollmentService.getEnrolledCourses(userId);
            ApiResponse.success(res, courses);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get all users (admin)
     */
    static async getAllUsers(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const result = await UserService.getAll({ page, limit });
            ApiResponse.paginated(res, result.users, { page, limit, total: result.total });
        } catch (error) {
            next(error);
        }
    }
}
