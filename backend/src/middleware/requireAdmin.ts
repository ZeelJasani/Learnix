import { Response, NextFunction } from 'express';
import { UserRequest } from './requireUser';
import { ApiError } from '../utils/apiError';

export const requireAdmin = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user) {
            throw ApiError.unauthorized('Authentication required');
        }

        const role = (req.user.role || '').toLowerCase();

        if (role !== 'admin') {
            throw ApiError.forbidden('Admin access required');
        }

        next();
    } catch (error) {
        next(error);
    }
};

export const requireInstructor = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user) {
            throw ApiError.unauthorized('Authentication required');
        }

        const role = (req.user.role || '').toLowerCase();

        if (role !== 'admin' && role !== 'instructor') {
            throw ApiError.forbidden('Instructor access required');
        }

        next();
    } catch (error) {
        next(error);
    }
};
