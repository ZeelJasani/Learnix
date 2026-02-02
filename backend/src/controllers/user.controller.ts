import { Response, NextFunction, Request } from 'express';
import { UserRequest } from '../middleware/requireUser';
import { UserService } from '../services/user.service';
import { EnrollmentService } from '../services/enrollment.service';
import { ApiResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';

export class UserController {

    static async syncCurrentUser(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const { clerkId, email, firstName, lastName, imageUrl } = req.body;


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


    static async getProfile(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user;
            ApiResponse.success(res, user);
        } catch (error) {
            next(error);
        }
    }


    static async getEnrolledCourses(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req.user as any)._id?.toString() || req.user!.id;
            const courses = await EnrollmentService.getEnrolledCourses(userId);
            ApiResponse.success(res, courses);
        } catch (error) {
            next(error);
        }
    }


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
