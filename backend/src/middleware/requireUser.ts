/**
 * User Authentication Middleware / User Authentication Middleware
 *
 * Aa middleware Clerk ID thi database ma user search kare chhe ane req.user set kare chhe.
 * This middleware looks up the user in the database by Clerk ID and sets req.user.
 *
 * Aa middleware verifyClerkToken PACHI vaparay chhe je pahela req.auth set kare chhe.
 * This middleware is used AFTER verifyClerkToken which first sets req.auth.
 *
 * Flow / Flow:
 * 1. req.auth.userId (Clerk ID) thi database ma user lookup kare chhe
 * 2. User na hoy to Clerk thi create kare chhe (getOrCreate pattern)
 * 3. Banned users ne block kare chhe
 * 4. User data req.user par set kare chhe
 */
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { ApiError } from '../utils/apiError';
import { UserService } from '../services/user.service';

/**
 * UserRequest interface - authenticated user ni info store kare chhe
 * UserRequest interface - stores authenticated user information
 *
 * Aa interface AuthenticatedRequest ne extend kare chhe ane
 * database thi maleli user info add kare chhe.
 * This interface extends AuthenticatedRequest and adds
 * user info retrieved from the database.
 */
export interface UserRequest extends AuthenticatedRequest {
    user?: {
        id: string;         // MongoDB _id
        clerkId: string;    // Clerk user ID
        name: string;       // User nu naam / User's name
        email: string;      // User no email
        role: string | null; // User role: admin, mentor, student, null
        image: string | null; // Profile image URL
    };
}

/**
 * User authentication require kare chhe ane req.user set kare chhe
 * Requires user authentication and sets req.user
 *
 * Protected routes par use thay chhe jya authenticated user jaruri chhe.
 * Used on protected routes where an authenticated user is required.
 *
 * @param req - UserRequest
 * @param res - Express Response
 * @param next - Express NextFunction
 */
export const requireUser = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Clerk token verify thayo chhe ke nahi check karo
        // Check if Clerk token was verified
        if (!req.auth?.userId) {
            throw ApiError.unauthorized('Authentication required');
        }

        // Clerk ID thi database ma user search karo, na hoy to create karo
        // Look up user in database by Clerk ID, create if not found
        const user = await UserService.getOrCreateFromClerk(req.auth.userId);

        if (!user) {
            throw ApiError.unauthorized('User not found');
        }

        // Banned user ne access na aapvo
        // Don't allow access to banned users
        if (user.banned) {
            throw ApiError.forbidden('Your account has been suspended');
        }

        // User data req.user par set karo badha downstream handlers mate
        // Set user data on req.user for all downstream handlers
        req.user = {
            id: user._id.toString(),
            clerkId: user.clerkId,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
        };

        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Optional user middleware - user hoy to set kare chhe, na hoy to chalu rakhe chhe
 * Optional user middleware - sets user if present, continues without if absent
 *
 * Public routes par use thay chhe jya user context helpful chhe pan required nathi.
 * Used on public routes where user context is helpful but not required.
 * E.g., course listing jya enrolled status show karvanu hoy.
 * E.g., course listing where enrolled status needs to be shown.
 *
 * @param req - UserRequest
 * @param res - Express Response
 * @param next - Express NextFunction
 */
export const optionalRequireUser = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Auth na hoy to user vagar aagal vadho
        // If no auth, continue without user
        if (!req.auth?.userId) {
            return next();
        }

        // User lookup karo database mathi
        // Look up user from database
        const user = await UserService.getOrCreateFromClerk(req.auth.userId);

        // Fakat non-banned users mate req.user set karo
        // Only set req.user for non-banned users
        if (user && !user.banned) {
            req.user = {
                id: user._id.toString(),
                clerkId: user.clerkId,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
            };
        }

        next();
    } catch (error) {
        // Auth error par fail na karo - user vagar chalu rakho
        // Don't fail on auth errors - continue without user
        next();
    }
};
