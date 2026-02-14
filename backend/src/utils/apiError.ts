/**
 * Custom API Error Class / Custom API Error Class
 *
 * Aa class HTTP errors mate standard format provide kare chhe.
 * This class provides a standard format for HTTP errors.
 *
 * Features / Features:
 * - HTTP status codes sathe categorized errors
 * - Operational vs programming error distinction
 * - Field-level validation errors (Zod integration mate)
 * - Stack trace capture for debugging
 *
 * Operational errors (isOperational = true):
 * - Expected errors: validation fail, unauthorized access, not found
 * - Client ne safe message batavay chhe
 *
 * Programming errors (isOperational = false):
 * - Unexpected errors: null reference, type errors
 * - Generic message batavay chhe, stack trace log thay chhe
 */
export class ApiError extends Error {
    statusCode: number;          // HTTP status code (400, 401, 403, 404, 500)
    isOperational: boolean;      // true = expected error, false = programming bug
    errors?: Record<string, string[]>; // Field-level validation errors

    /**
     * ApiError constructor
     *
     * @param statusCode - HTTP status code
     * @param message - Error message
     * @param isOperational - Operational error chhe ke nahi (default: true)
     * @param errors - Field-level validation errors (optional)
     */
    constructor(
        statusCode: number,
        message: string,
        isOperational = true,
        errors?: Record<string, string[]>
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.errors = errors;

        // Stack trace capture karo debugging mate
        // Capture stack trace for debugging
        Error.captureStackTrace(this, this.constructor);
    }

    // ===== Static Factory Methods / Static Factory Methods =====
    // Aa methods common HTTP errors mate shortcuts chhe
    // These methods are shortcuts for common HTTP errors

    // 400 Bad Request - invalid input ke validation failure mate
    // 400 Bad Request - for invalid input or validation failure
    static badRequest(message: string, errors?: Record<string, string[]>): ApiError {
        return new ApiError(400, message, true, errors);
    }

    // 401 Unauthorized - authentication required ke invalid token mate
    // 401 Unauthorized - for authentication required or invalid token
    static unauthorized(message = 'Unauthorized'): ApiError {
        return new ApiError(401, message);
    }

    // 403 Forbidden - authenticated pan access nathi
    // 403 Forbidden - authenticated but no access
    static forbidden(message = 'Forbidden'): ApiError {
        return new ApiError(403, message);
    }

    // 404 Not Found - resource exist nathi karto
    // 404 Not Found - resource does not exist
    static notFound(message = 'Resource not found'): ApiError {
        return new ApiError(404, message);
    }

    // 409 Conflict - duplicate entry ke conflicting state mate
    // 409 Conflict - for duplicate entry or conflicting state
    static conflict(message: string): ApiError {
        return new ApiError(409, message);
    }

    // 429 Too Many Requests - rate limit exceed thayo
    // 429 Too Many Requests - rate limit exceeded
    static tooManyRequests(message = 'Too many requests'): ApiError {
        return new ApiError(429, message);
    }

    // 500 Internal Server Error - unexpected programming error
    // isOperational = false kyonki aa unexpected error chhe
    // isOperational = false because this is an unexpected error
    static internal(message = 'Internal server error'): ApiError {
        return new ApiError(500, message, false);
    }
}
