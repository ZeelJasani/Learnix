/**
 * Clerk Token Authentication Middleware / Clerk Token Authentication Middleware
 *
 * Aa middleware Clerk SDK no use kari ne JWT token verify kare chhe.
 * This middleware verifies JWT tokens using the Clerk SDK.
 *
 * Flow / Flow:
 * 1. Authorization header mathi Bearer token extract kare chhe
 * 2. Clerk SDK thi token verify kare chhe
 * 3. Verified user info req.auth par set kare chhe
 * 4. Invalid token par 401 Unauthorized error throw kare chhe
 */
import { Request, Response, NextFunction } from 'express';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';

/**
 * Authenticated request mate extended interface
 * Extended interface for authenticated requests
 *
 * Aa interface Express Request ne extend kare chhe ane auth property add kare chhe
 * je verified user ni information store kare chhe.
 * This interface extends Express Request and adds an auth property
 * that stores verified user information.
 */
export interface AuthenticatedRequest extends Request {
    auth?: {
        userId: string;      // Clerk user ID (sub claim)
        sessionId?: string;  // Clerk session ID (sid claim)
        claims?: Record<string, unknown>; // Badha JWT claims / All JWT claims
    };
}

/**
 * Clerk token verify kare chhe ane req.auth set kare chhe
 * Verifies Clerk token and sets req.auth
 *
 * Aa middleware protected routes par use thay chhe je authentication jaruri kare chhe.
 * This middleware is used on protected routes that require authentication.
 *
 * @param req - AuthenticatedRequest with optional auth
 * @param res - Express Response
 * @param next - Express NextFunction
 */
export const verifyClerkToken = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Authorization header mathi Bearer token extract karo
        // Extract Bearer token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw ApiError.unauthorized('No authorization token provided');
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            throw ApiError.unauthorized('Invalid authorization header format');
        }

        try {
            // Clerk SDK thi session token verify karo
            // Verify the session token with Clerk SDK
            const verifiedToken = await clerkClient.verifyToken(token);

            // Verified user info req.auth par set karo
            // Set verified user info on req.auth
            req.auth = {
                userId: verifiedToken.sub,
                sessionId: verifiedToken.sid,
                claims: verifiedToken as unknown as Record<string, unknown>,
            };

            next();
        } catch (clerkError) {
            // Token invalid ke expired hoy to log karo ane error throw karo
            // Log and throw error if token is invalid or expired
            logger.error('Clerk token verification failed:', clerkError);
            throw ApiError.unauthorized('Invalid or expired token');
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Optional auth middleware - token hoy to verify kare chhe, na hoy to chalu rakhe chhe
 * Optional auth middleware - verifies token if present, continues without if absent
 *
 * Public routes par use thay chhe jya logged-in users ne extra features malva joiye
 * pan unauthenticated users pan page jovi shake.
 * Used on public routes where logged-in users get extra features
 * but unauthenticated users can still view the page.
 *
 * @param req - AuthenticatedRequest
 * @param res - Express Response
 * @param next - Express NextFunction
 */
export const optionalVerifyClerkToken = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        // Token na hoy to auth vagar aagal vadho
        // If no token, continue without auth
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return next();
        }

        try {
            // Token verify karvo ane req.auth set karo
            // Verify token and set req.auth
            const verifiedToken = await clerkClient.verifyToken(token);
            req.auth = {
                userId: verifiedToken.sub,
                sessionId: verifiedToken.sid,
                claims: verifiedToken as unknown as Record<string, unknown>,
            };
        } catch (clerkError) {
            // Token invalid hoy to auth vagar chalu rakho
            // If token is invalid, continue without auth
            logger.warn('Optional auth: invalid token, continuing without auth');
        }

        next();
    } catch (error) {
        next(error);
    }
};
