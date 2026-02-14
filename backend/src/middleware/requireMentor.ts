/**
 * Mentor Authorization Middleware / Mentor Authorization Middleware
 *
 * Aa middleware check kare chhe ke user mentor ke admin role dheravi chhe ke nahi.
 * This middleware checks if the user has mentor or admin role.
 *
 * Mentor mate allowed routes / Routes allowed for mentors:
 * - Course creation ane management
 * - Live session creation
 * - Student progress monitoring
 */
import { Response, NextFunction } from 'express';
import { UserRequest } from './requireUser';
import { ApiError } from '../utils/apiError';

/**
 * Mentor ke admin role verify kare chhe
 * Verifies mentor or admin role
 *
 * Course instructor/mentor routes mate vaparay chhe jya course content
 * create ke manage karvanu hoy.
 * Used for course instructor/mentor routes where course content
 * needs to be created or managed.
 *
 * @param req - UserRequest with user data
 * @param res - Express Response
 * @param next - Express NextFunction
 */
export const requireMentor = (req: UserRequest, res: Response, next: NextFunction): void => {
    // User authenticated chhe ke nahi check karo
    // Check if user is authenticated
    if (!req.user) {
        throw ApiError.unauthorized('Authentication required');
    }

    // User nu role lowercase ma compare karo
    // Compare user role in lowercase for consistency
    const userRole = req.user.role?.toLowerCase();

    // Fakat mentor ane admin ne access aape chhe
    // Only allows access for mentor and admin roles
    if (userRole !== 'mentor' && userRole !== 'admin') {
        throw ApiError.forbidden('Mentor access required');
    }

    next();
};
