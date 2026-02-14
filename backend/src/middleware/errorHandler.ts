/**
 * Error Handler Middleware / Error Handler Middleware
 *
 * Aa middleware Express app ma aavti badhi errors ne handle kare chhe.
 * This middleware handles all errors that occur in the Express app.
 *
 * Error types handled / Handle thata error types:
 * - ApiError (custom application errors)
 * - Mongoose ValidationError
 * - Mongoose CastError (invalid ObjectId)
 * - Mongoose duplicate key error (code 11000)
 * - JWT errors (invalid/expired tokens)
 * - Generic server errors (500)
 */
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';
import { env } from '../config/env';

/**
 * MongoDB duplicate key error mate interface
 * Interface for MongoDB duplicate key errors
 *
 * Mongoose duplicate key error ne properly type karva mate
 * aa interface use thay chhe (err as any).code na badle.
 * Used to properly type Mongoose duplicate key errors
 * instead of using (err as any).code.
 */
interface MongoError extends Error {
    code?: number;
    keyPattern?: Record<string, number>;
    keyValue?: Record<string, unknown>;
}

/**
 * Global Error Handler Middleware
 *
 * Aa middleware express error handling pipeline nu last step chhe.
 * This middleware is the last step in Express error handling pipeline.
 *
 * Development ma stack trace return kare chhe, production ma generic message.
 * Returns stack trace in development, generic message in production.
 *
 * @param err - Error object
 * @param req - Express Request
 * @param res - Express Response
 * @param _next - Express NextFunction (unused but required by Express)
 */
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    // Error log karo request details sathe
    // Log the error with request details
    logger.error(`${req.method} ${req.path} - ${err.message}`, {
        stack: err.stack,
        body: req.body,
        params: req.params,
        query: req.query,
    });

    // Custom ApiError instances handle karo
    // Handle custom ApiError instances
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
            ...(env.NODE_ENV === 'development' && { stack: err.stack }),
        });
        return;
    }

    // Mongoose validation errors handle karo (e.g., required fields missing)
    // Handle Mongoose validation errors (e.g., required fields missing)
    if (err.name === 'ValidationError') {
        res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: err.message,
        });
        return;
    }

    // Invalid ObjectId format handle karo (e.g., '/courses/invalid-id')
    // Handle invalid ObjectId format (e.g., '/courses/invalid-id')
    if (err.name === 'CastError') {
        res.status(400).json({
            success: false,
            message: 'Invalid ID format',
        });
        return;
    }

    // MongoDB duplicate key error handle karo (e.g., duplicate email)
    // Handle MongoDB duplicate key error (e.g., duplicate email registration)
    // Properly typed MongoError interface use kare chhe (err as any) na badle
    // Uses properly typed MongoError interface instead of (err as any)
    const mongoErr = err as MongoError;
    if (mongoErr.code === 11000) {
        res.status(409).json({
            success: false,
            message: 'Duplicate entry',
        });
        return;
    }

    // JWT token errors handle karo
    // Handle JWT token errors
    if (err.name === 'JsonWebTokenError') {
        res.status(401).json({
            success: false,
            message: 'Invalid token',
        });
        return;
    }

    // Expired JWT token handle karo
    // Handle expired JWT token
    if (err.name === 'TokenExpiredError') {
        res.status(401).json({
            success: false,
            message: 'Token expired',
        });
        return;
    }

    // Baki badhi unhandled errors mate 500 Internal Server Error
    // Default to 500 Internal Server Error for all unhandled errors
    // Production ma error details expose na karo security mate
    // Don't expose error details in production for security
    res.status(500).json({
        success: false,
        message: env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
        ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

/**
 * 404 Not Found Handler
 *
 * Jyare koi request aave ane koi route match na thay tyare aa handler call thay chhe.
 * Called when no route matches the incoming request.
 *
 * @param req - Express Request
 * @param res - Express Response
 */
export const notFoundHandler = (req: Request, res: Response): void => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found`,
    });
};
