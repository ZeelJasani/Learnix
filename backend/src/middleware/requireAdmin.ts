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

        const fs = require('fs');
        const path = require('path');
        const logPath = path.join(__dirname, '../../debug.log');
        fs.appendFileSync(logPath, `[${new Date().toISOString()}] requireAdmin called. Role in req.user: "${role}"\n`);

        if (role !== 'admin') {
            fs.appendFileSync(logPath, `[${new Date().toISOString()}] requireAdmin FAILED.\n`);
            throw ApiError.forbidden('Admin access required');
        }

        fs.appendFileSync(logPath, `[${new Date().toISOString()}] requireAdmin PASSED.\n`);

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
