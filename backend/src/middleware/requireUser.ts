import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { ApiError } from '../utils/apiError';
import { UserService } from '../services/user.service';

export interface UserRequest extends AuthenticatedRequest {
    user?: {
        id: string;
        clerkId: string;
        name: string;
        email: string;
        role: string | null;
        image: string | null;
    };
}

export const requireUser = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.auth?.userId) {
            throw ApiError.unauthorized('Authentication required');
        }

        // Get or create user from database using Clerk ID
        const user = await UserService.getOrCreateFromClerk(req.auth.userId);

        if (!user) {
            throw ApiError.unauthorized('User not found');
        }

        if (user.banned) {
            throw ApiError.forbidden('Your account has been suspended');
        }

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
 * Optional user middleware - sets req.user if auth is present, but doesn't require it
 */
export const optionalRequireUser = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.auth?.userId) {
            // No auth - continue without user
            return next();
        }

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
        // Don't fail on auth errors - just continue without user
        next();
    }
};
