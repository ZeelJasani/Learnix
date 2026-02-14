// ============================================================================
// Learnix LMS - User Controller (યુઝર કંટ્રોલર)
// ============================================================================
// Aa controller user-related HTTP requests handle kare chhe.
// This controller handles user-related HTTP requests.
//
// જવાબદારીઓ / Responsibilities:
// - Clerk → MongoDB user sync (ક્લાર્ક ડેટા સિંક)
// - User profile retrieval (યુઝર પ્રોફાઇલ મેળવવી)
// - Enrolled courses listing (નોંધાયેલા કોર્સ લિસ્ટ)
// - Admin user listing with pagination (એડમિન માટે યુઝર લિસ્ટ)
// ============================================================================

import { Response, NextFunction, Request } from 'express';
import { UserRequest } from '../middleware/requireUser';
import { UserService } from '../services/user.service';
import { EnrollmentService } from '../services/enrollment.service';
import { ApiResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';

/**
 * UserController - યુઝર સંબંધિત API endpoints
 * UserController - User-related API endpoints
 *
 * Aa class static methods provide kare chhe je Express route handlers tarike use thay chhe.
 * This class provides static methods used as Express route handlers.
 */
export class UserController {
    /**
     * Clerk data ne MongoDB sathe sync karo / Sync current user from Clerk to MongoDB
     *
     * Frontend thi user data body ma ave chhe ane MongoDB ma upsert thay chhe.
     * User data comes from frontend body and gets upserted in MongoDB.
     *
     * @route POST /api/users/sync
     */
    static async syncCurrentUser(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            // Request body mathi user data kadho / Get user data from request body (sent by frontend)
            const { clerkId, email, firstName, lastName, imageUrl } = req.body;

            // Jо body data available hoy to sync karo / If body data is provided, sync using that
            if (clerkId && email) {
                const user = await UserService.syncFromClerkData({
                    id: clerkId,
                    emailAddresses: [{ emailAddress: email }],
                    firstName: firstName || null,
                    lastName: lastName || null,
                    imageUrl: imageUrl || '',
                });

                // Sync success log karo / Log successful sync
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

            // Fallback: jો middleware ae user set karyo hoy to return karo
            // Fallback: if req.user exists (from middleware), return it
            const user = req.user;
            if (!user) {
                ApiResponse.error(res, 'User not found', 404);
                return;
            }

            ApiResponse.success(res, { synced: true, user });
        } catch (error) {
            // Error log karo / Log the error
            logger.error('Error syncing user:', error);
            next(error);
        }
    }

    /**
     * Current user ni profile return karo / Get current user profile
     *
     * Middleware dwara set karelo req.user direct return thay chhe.
     * Returns the req.user object set by authentication middleware.
     *
     * @route GET /api/users/me
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
     * Current user na enrolled courses kadho / Get enrolled courses for current user
     *
     * User ID middleware thi laine EnrollmentService ne delegate kare chhe.
     * Extracts user ID from middleware and delegates to EnrollmentService.
     *
     * @route GET /api/users/courses
     */
    static async getEnrolledCourses(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            // User ID kadho - MongoDB _id ke Clerk id / Extract user ID - MongoDB _id or Clerk id
            const userId = (req.user as any)._id?.toString() || req.user!.id;
            const courses = await EnrollmentService.getEnrolledCourses(userId);
            ApiResponse.success(res, courses);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Badha users ni list kadho (Admin only) / Get all users with pagination (Admin only)
     *
     * Pagination parameters query string mathi parse thay chhe.
     * Pagination parameters are parsed from the query string.
     *
     * @route GET /api/users (admin)
     */
    static async getAllUsers(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            // Pagination parameters parse karo / Parse pagination parameters
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const result = await UserService.getAll({ page, limit });
            ApiResponse.paginated(res, result.users, { page, limit, total: result.total });
        } catch (error) {
            next(error);
        }
    }
}
