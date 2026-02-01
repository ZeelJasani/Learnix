import { Response, NextFunction } from 'express';
import { UserRequest } from './requireUser';
import { UserService } from '../services/user.service';

/**
 * Middleware to optionally authenticate a user.
 * If authentication fails or is missing, req.user remains undefined,
 * but the request proceeds.
 */
export const optionalUser = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.auth?.userId) {
            return next();
        }

        // Get user from database using Clerk ID
        const user = await UserService.getOrCreateFromClerk(req.auth.userId);

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
        // Log error but proceed as unauthenticated
        console.error('Optional auth error:', error);
        next();
    }
};
