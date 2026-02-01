import { Response, NextFunction } from 'express';
import { UserRequest } from './requireUser';
import { ApiError } from '../utils/apiError';

/**
 * Middleware to ensure user is a MENTOR or ADMIN
 */
export const requireMentor = (req: UserRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
        throw ApiError.unauthorized('Authentication required');
    }

    const userRole = req.user.role?.toLowerCase();

    if (userRole !== 'mentor' && userRole !== 'admin') {
        throw ApiError.forbidden('Mentor access required');
    }

    next();
};
