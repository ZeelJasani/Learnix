import { Request, Response, NextFunction } from 'express';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';

export interface AuthenticatedRequest extends Request {
    auth?: {
        userId: string;
        sessionId?: string;
        claims?: Record<string, unknown>;
    };
}

export const verifyClerkToken = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw ApiError.unauthorized('No authorization token provided');
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            throw ApiError.unauthorized('Invalid authorization header format');
        }

        try {
            
            const verifiedToken = await clerkClient.verifyToken(token);

            req.auth = {
                userId: verifiedToken.sub,
                sessionId: verifiedToken.sid,
                claims: verifiedToken as unknown as Record<string, unknown>,
            };

            next();
        } catch (clerkError) {
            logger.error('Clerk token verification failed:', clerkError);
            throw ApiError.unauthorized('Invalid or expired token');
        }
    } catch (error) {
        next(error);
    }
};
