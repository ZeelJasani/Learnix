/**
 * Request Validation Middleware / Request Validation Middleware
 *
 * Aa middleware Zod schemas no use kari ne incoming request data validate kare chhe.
 * This middleware validates incoming request data using Zod schemas.
 *
 * Body, query, ane params - badhuj validate kari shakay chhe.
 * Can validate body, query, and params.
 *
 * Invalid data par structured error message return kare chhe
 * je frontend ne field-level errors batave chhe.
 * Returns structured error messages for invalid data
 * showing field-level errors to the frontend.
 */
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';

// Validation target - request nu yu part validate karvanu chhe
// Validation target - which part of the request to validate
type ValidationTarget = 'body' | 'query' | 'params';

/**
 * Generic validation middleware factory
 * Generic validation middleware factory
 *
 * Aa function ek middleware return kare chhe je specified Zod schema
 * sathe request data validate kare chhe.
 * This function returns a middleware that validates request data
 * against the specified Zod schema.
 *
 * @param schema - Zod validation schema
 * @param target - Request nu yu part validate karvanu (body, query, params)
 * @returns Express middleware function
 *
 * @example
 * // Route ma use karo / Use in route:
 * router.post('/courses', validate(createCourseSchema, 'body'), createCourse);
 */
export const validate = (schema: ZodSchema, target: ValidationTarget = 'body') => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            // Specified target (body/query/params) mathi data melo
            // Get data from specified target (body/query/params)
            const dataToValidate = req[target];

            // Development ma validation data log karo debugging mate
            // Log validation data in development for debugging
            if (process.env.NODE_ENV === 'development') {
                logger.debug(`[Validation] Validating ${target}:`, dataToValidate);
            }

            // Zod schema sathe data validate karo
            // Validate data against Zod schema
            schema.parse(dataToValidate);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Zod errors ne field-level format ma convert karo
                // Convert Zod errors to field-level format
                const formattedErrors: Record<string, string[]> = {};
                error.errors.forEach((err) => {
                    const path = err.path.join('.');
                    if (!formattedErrors[path]) {
                        formattedErrors[path] = [];
                    }
                    formattedErrors[path].push(err.message);
                });

                // Development ma detailed error log karo
                // Log detailed errors in development
                if (process.env.NODE_ENV === 'development') {
                    logger.debug('[Validation] Formatted errors:', formattedErrors);
                }

                // Readable error message banavo
                // Create a readable error message
                const errorDetails = Object.entries(formattedErrors)
                    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                    .join('; ');

                next(ApiError.badRequest(`Validation failed: ${errorDetails}`, formattedErrors));
            } else {
                next(error);
            }
        }
    };

};

// Pre-configured validation helpers / Pre-configured validation helpers
// Aa shortcuts chhe common validation targets mate
// These are shortcuts for common validation targets

// Request body validate karo / Validate request body
export const validateBody = (schema: ZodSchema) => validate(schema, 'body');

// Query parameters validate karo / Validate query parameters
export const validateQuery = (schema: ZodSchema) => validate(schema, 'query');

// URL parameters validate karo (e.g., :id) / Validate URL parameters (e.g., :id)
export const validateParams = (schema: ZodSchema) => validate(schema, 'params');
