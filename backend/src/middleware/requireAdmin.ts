/**
 * Admin Authorization Middleware / Admin Authorization Middleware
 *
 * Aa middleware check kare chhe ke user admin role dheravi chhe ke nahi.
 * This middleware checks if the user has admin role.
 *
 * Role checking / Role checking:
 * - requireAdmin: Fakat admin users ne access aape chhe
 * - requireInstructor: Admin ane instructor banne ne access aape chhe
 *
 * - requireAdmin: Only allows admin users
 * - requireInstructor: Allows both admin and instructor users
 */
import { Response, NextFunction } from 'express';
import { UserRequest } from './requireUser';
import { ApiError } from '../utils/apiError';

/**
 * Admin role verify kare chhe
 * Verifies admin role
 *
 * Jyare admin-only routes (e.g., user management, system settings) par
 * access karva hoy tyare aa middleware vaparay chhe.
 * Used when accessing admin-only routes (e.g., user management, system settings).
 *
 * @param req - UserRequest with user data
 * @param res - Express Response
 * @param next - Express NextFunction
 */
export const requireAdmin = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // User authenticated chhe ke nahi check karo
        // Check if user is authenticated
        if (!req.user) {
            throw ApiError.unauthorized('Authentication required');
        }

        // User nu role lowercase ma compare karo
        // Compare user role in lowercase for consistency
        const role = (req.user.role || '').toLowerCase();

        if (role !== 'admin') {
            throw ApiError.forbidden('Admin access required');
        }

        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Instructor ke admin role verify kare chhe
 * Verifies instructor or admin role
 *
 * Course management ane content creation routes mate vaparay chhe.
 * Used for course management and content creation routes.
 *
 * @param req - UserRequest with user data
 * @param res - Express Response
 * @param next - Express NextFunction
 */
export const requireInstructor = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user) {
            throw ApiError.unauthorized('Authentication required');
        }

        // Admin ane instructor banne ne access aape chhe
        // Grants access to both admin and instructor roles
        const role = (req.user.role || '').toLowerCase();

        if (role !== 'admin' && role !== 'instructor') {
            throw ApiError.forbidden('Instructor access required');
        }

        next();
    } catch (error) {
        next(error);
    }
};
