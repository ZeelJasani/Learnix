import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';
import { env } from '../config/env';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    // Log the error
    logger.error(`${req.method} ${req.path} - ${err.message}`, {
        stack: err.stack,
        body: req.body,
        params: req.params,
        query: req.query,
    });

    // Handle ApiError instances
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
            ...(env.NODE_ENV === 'development' && { stack: err.stack }),
        });
        return;
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: err.message,
        });
        return;
    }

    // Handle Mongoose CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        res.status(400).json({
            success: false,
            message: 'Invalid ID format',
        });
        return;
    }

    // Handle Mongoose duplicate key error
    if ((err as any).code === 11000) {
        res.status(409).json({
            success: false,
            message: 'Duplicate entry',
        });
        return;
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        res.status(401).json({
            success: false,
            message: 'Invalid token',
        });
        return;
    }

    if (err.name === 'TokenExpiredError') {
        res.status(401).json({
            success: false,
            message: 'Token expired',
        });
        return;
    }

    // Default to 500 internal server error
    res.status(500).json({
        success: false,
        message: env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
        ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export const notFoundHandler = (req: Request, res: Response): void => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found`,
    });
};
