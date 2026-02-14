/**
 * Optional User Middleware / Optional User Middleware
 *
 * Aa middleware optional authentication provide kare chhe.
 * This middleware provides optional authentication.
 *
 * Authentication fail ke missing hoy to pan request aagal vadhe chhe,
 * pan req.user undefined rahe chhe.
 * Request proceeds even if authentication fails or is missing,
 * but req.user remains undefined.
 */
import { Response, NextFunction } from 'express';
import { UserRequest } from './requireUser';
import { UserService } from '../services/user.service';
import { logger } from '../utils/logger';

/**
 * Optionally user authenticate karo
 * Optionally authenticate user
 *
 * Public pages mate vaparay chhe jya authenticated users ne extra
 * features male chhe (e.g., "Already enrolled" badge on course cards).
 * Used for public pages where authenticated users get extra features
 * (e.g., "Already enrolled" badge on course cards).
 *
 * @param req - UserRequest
 * @param res - Express Response
 * @param next - Express NextFunction
 */
export const optionalUser = async (
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

        // Clerk ID thi database ma user search karo
        // Look up user in database using Clerk ID
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
        // Error log karo pan unauthenticated tarike proceed karo
        // Log error but proceed as unauthenticated
        logger.warn('Optional auth error:', error);
        next();
    }
};
